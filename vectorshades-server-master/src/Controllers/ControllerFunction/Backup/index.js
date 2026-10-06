const fs = require('fs')
const path = require('path')
const zlib = require('zlib')
const readline = require('readline')
const crypto = require('crypto')
const mongoose = require('mongoose')
const { EJSON } = require('bson')

// Stored outside /public so backup files (which contain the whole database,
// including credentials/hashes) can never be reached via the static file server.
const BACKUP_DIR = path.join(__dirname, '../../../../backups')

// Backups are never deleted automatically - the only way one goes away is
// an explicit Delete click (deleteBackupFunction below). The UI lists the
// most recent DEFAULT_LIST_LIMIT, but every backup ever taken stays on disk
// until someone chooses to remove it.
const DEFAULT_LIST_LIMIT = 15

// Documents are streamed to/from disk in batches instead of ever being held
// as one big array or one big string - a whole-database JSON.stringify/parse
// blows past V8's ~512MB string length limit ("Invalid string length") well
// before a real database does.
const STREAM_BATCH_SIZE = 500

// Uploaded files land here first (still inside BACKUP_DIR, not the OS temp
// dir) so the final "move into place" is a same-filesystem rename, not a
// copy - large backups shouldn't be copied twice just to get positioned.
const UPLOAD_TMP_DIR = path.join(BACKUP_DIR, '.uploads')

const ensureBackupDir = () => {
    if (!fs.existsSync(BACKUP_DIR)) fs.mkdirSync(BACKUP_DIR, { recursive: true })
}

const ensureUploadTmpDir = () => {
    ensureBackupDir()
    if (!fs.existsSync(UPLOAD_TMP_DIR)) fs.mkdirSync(UPLOAD_TMP_DIR, { recursive: true })
}

// A generous sanity cap, not a real product constraint - a whole-database
// backup can legitimately be large; this just stops an obviously-wrong
// upload (someone picking a random multi-terabyte file) from filling disk.
const MAX_UPLOAD_BYTES = 20 * 1024 * 1024 * 1024

// A fresh path (inside our own temp dir, not the OS one) for an incoming
// upload to be written to, before it's validated and moved into place.
// Re-checks the directory exists every call (cheap - just an existsSync)
// rather than only once at server startup, so this stays correct even if
// the folder is ever removed out from under a long-running process (e.g.
// manual disk cleanup) instead of failing every upload until restart.
const newUploadTempPath = () => {
    ensureUploadTmpDir()
    return path.join(UPLOAD_TMP_DIR, `upload-${crypto.randomUUID()}.tmp`)
}

const getDb = () => {
    const db = mongoose.connection && mongoose.connection.db
    if (!db || mongoose.connection.readyState !== 1) throw new Error('Database is not connected')
    return db
}

// Backup ids are derived from a timestamp and only ever used to build a file
// path, so keep them locked down to prevent any path traversal.
const isValidBackupId = (id) => typeof id === 'string' && /^backup-[0-9TZ_-]+$/.test(id)

const metaPathFor = (id) => path.join(BACKUP_DIR, `${id}.meta.json`)
const dataPathFor = (id) => path.join(BACKUP_DIR, `${id}.ndjson.gz`)

const readMeta = (id) => {
    if (!isValidBackupId(id)) throw new Error('Invalid backup id')
    const metaPath = metaPathFor(id)
    if (!fs.existsSync(metaPath)) throw new Error('Backup not found')
    return JSON.parse(fs.readFileSync(metaPath, 'utf8'))
}

const listAllMeta = () => {
    ensureBackupDir()
    return fs.readdirSync(BACKUP_DIR)
        .filter((file) => file.endsWith('.meta.json'))
        .map((file) => {
            try { return JSON.parse(fs.readFileSync(path.join(BACKUP_DIR, file), 'utf8')) }
            catch (e) { return null }
        })
        .filter(Boolean)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
}

// ---------------------------------------------------------------------------
// In-memory job/progress tracking.
//
// A full-database backup or restore can take a while, so /backup/create and
// /backup/restore hand back a jobId immediately and do the work in the
// background; the frontend polls /backup/progress?jobId=... for a live
// percentage. Jobs are kept around for a while after finishing so a client
// that polls right after completion still sees the final state, then swept.
// ---------------------------------------------------------------------------
const jobs = new Map()
const JOB_RETENTION_MS = 10 * 60 * 1000

const createJob = (type) => {
    const jobId = crypto.randomUUID()
    const job = {
        jobId,
        type,
        phase: 'starting',
        currentCollection: null,
        collectionsDone: 0,
        collectionsTotal: 0,
        docsDone: 0,
        docsTotal: 0,
        percent: 0,
        error: null,
        result: null,
        startedAt: new Date().toISOString(),
    }
    jobs.set(jobId, job)
    return job
}

const updateJob = (jobId, patch) => {
    const job = jobs.get(jobId)
    if (!job) return
    Object.assign(job, patch)
    if (job.docsTotal > 0 && job.phase !== 'completed') {
        job.percent = Math.min(99, Math.round((job.docsDone / job.docsTotal) * 100))
    }
}

const finishJob = (jobId, patch) => {
    const job = jobs.get(jobId)
    if (!job) return
    Object.assign(job, patch, { percent: patch.phase === 'completed' ? 100 : job.percent })
    setTimeout(() => jobs.delete(jobId), JOB_RETENTION_MS).unref?.()
}

const getJob = (jobId) => {
    const job = jobs.get(jobId)
    if (!job) throw new Error('Job not found or has expired')
    return job
}

// Backpressure-aware write: waits for 'drain' instead of buffering everything
// in memory when the gzip/file stream can't keep up.
const write = (stream, chunk) => new Promise((resolve) => {
    if (stream.write(chunk)) resolve()
    else stream.once('drain', resolve)
})

/**
 * Streams every collection in the database to a single gzipped NDJSON file:
 * one small metadata line, then one line per document (as BSON-safe EJSON so
 * ObjectId/Date/Binary round-trip correctly). Nothing is ever buffered as one
 * big string or one big array, so this scales to databases far larger than
 * V8's string-length limit.
 */
const runCreateBackupJob = async (jobId, user) => {
    ensureBackupDir()
    const db = getDb()

    updateJob(jobId, { phase: 'counting' })
    const collectionInfos = await db.listCollections().toArray()
    const collectionNames = collectionInfos
        .map((info) => info.name)
        .filter((name) => !name.startsWith('system.'))

    const counts = {}
    let docsTotal = 0
    for (const name of collectionNames) {
        // estimatedDocumentCount reads collection metadata instead of scanning,
        // which is what we want for a fast progress-bar estimate.
        const count = await db.collection(name).estimatedDocumentCount()
        counts[name] = count
        docsTotal += count
    }

    const createdAt = new Date().toISOString()
    const id = `backup-${createdAt.replace(/[:.]/g, '-')}`
    const dataPath = dataPathFor(id)

    updateJob(jobId, { phase: 'exporting', collectionsTotal: collectionNames.length, docsTotal })

    await new Promise((resolve, reject) => {
        const fileStream = fs.createWriteStream(dataPath)
        const gzip = zlib.createGzip()
        gzip.on('error', reject)
        fileStream.on('error', reject)
        fileStream.on('finish', resolve)
        gzip.pipe(fileStream)

        const run = async () => {
            const metaLine = EJSON.stringify({
                __meta__: true, id, createdAt, dbName: db.databaseName, collections: collectionNames, counts,
            }, { relaxed: false })
            await write(gzip, metaLine + '\n')

            for (let i = 0; i < collectionNames.length; i++) {
                const name = collectionNames[i]
                updateJob(jobId, { currentCollection: name })

                const cursor = db.collection(name).find({}).batchSize(STREAM_BATCH_SIZE)
                for await (const doc of cursor) {
                    const line = EJSON.stringify({ __col__: name, doc }, { relaxed: false })
                    await write(gzip, line + '\n')
                    const job = jobs.get(jobId)
                    if (job) {
                        job.docsDone++
                        if (job.docsTotal > 0) job.percent = Math.min(99, Math.round((job.docsDone / job.docsTotal) * 100))
                    }
                }

                updateJob(jobId, { collectionsDone: i + 1 })
            }

            gzip.end()
        }

        run().catch(reject)
    })

    updateJob(jobId, { phase: 'finalizing' })
    const sizeBytes = fs.statSync(dataPath).size
    const meta = {
        id,
        createdAt,
        dbName: db.databaseName,
        collections: collectionNames,
        counts,
        totalDocuments: docsTotal,
        sizeBytes,
        triggeredBy: user ? { id: user.id || user._id, email: user.email, name: [user.firstName, user.lastName].filter(Boolean).join(' ') } : null,
    }
    fs.writeFileSync(metaPathFor(id), JSON.stringify(meta, null, 2))

    return meta
}

const createBackupFunction = (user) => {
    const job = createJob('backup')
    runCreateBackupJob(job.jobId, user)
        .then((meta) => finishJob(job.jobId, { phase: 'completed', result: meta }))
        .catch((err) => finishJob(job.jobId, { phase: 'failed', error: err.message || 'Backup failed' }))
    return job
}

// Real backend pagination over every backup on disk (not just a capped
// "most recent N") - listAllMeta() is already sorted newest-first, this
// just slices out the requested page of it.
const listBackupsFunction = async ({ page, limit } = {}) => {
    const pageSize = Math.min(Math.max(Number(limit) || DEFAULT_LIST_LIMIT, 1), 50)
    const all = listAllMeta()
    const total = all.length
    const totalPages = Math.max(Math.ceil(total / pageSize), 1)
    const pageNumber = Math.min(Math.max(Number(page) || 1, 1), totalPages)
    const start = (pageNumber - 1) * pageSize
    return { data: all.slice(start, start + pageSize), total, totalPages, page: pageNumber }
}

/**
 * Full-database restore from a previously created backup. Streams the NDJSON
 * file back in line by line (never parsing the whole file as one JSON value)
 * and replaces each collection's contents in batches. A failure on one
 * collection is recorded and does not abort the rest.
 *
 * Each collection is only cleared right before its own data starts streaming
 * back in (not all of them upfront) - so if the process dies partway through,
 * collections already restored keep the new data, the one in flight may be
 * partial, and every collection not yet reached still has its untouched
 * pre-restore data instead of having been wiped for nothing.
 */
const runRestoreBackupJob = async (jobId, id) => {
    const meta = readMeta(id)
    const dataPath = dataPathFor(id)
    if (!fs.existsSync(dataPath)) throw new Error('Backup file is missing from disk')

    const db = getDb()
    updateJob(jobId, {
        phase: 'restoring',
        collectionsTotal: meta.collections.length,
        docsTotal: meta.totalDocuments || 0,
    })

    const clearedCollections = new Set()
    const ensureCleared = async (name) => {
        if (clearedCollections.has(name)) return
        try { await db.collection(name).deleteMany({}) } catch (e) { /* collection may not exist yet, insertMany will create it */ }
        clearedCollections.add(name)
    }

    const restoredCounts = {}
    const errors = {}
    const seenCollections = new Set()
    const batches = new Map()

    const flush = async (name) => {
        const docs = batches.get(name)
        if (!docs || !docs.length) return
        try {
            await db.collection(name).insertMany(docs, { ordered: false })
            restoredCounts[name] = (restoredCounts[name] || 0) + docs.length
        } catch (e) {
            errors[name] = e.message
        }
        batches.set(name, [])
    }

    const rl = readline.createInterface({
        input: fs.createReadStream(dataPath).pipe(zlib.createGunzip()),
        crlfDelay: Infinity,
    })

    // The backup file is written one collection at a time (all of a
    // collection's lines are contiguous), so noticing the collection name
    // change is a reliable point to flush the previous one's tail batch -
    // that's what makes a finished collection durable in the database
    // *before* the next one starts, instead of sitting in memory until the
    // entire file has been read.
    let previousCollection = null

    for await (const line of rl) {
        if (!line) continue
        const parsed = EJSON.parse(line, { relaxed: false })
        if (parsed.__meta__) continue

        const { __col__: name, doc } = parsed
        if (previousCollection !== null && previousCollection !== name) await flush(previousCollection)
        previousCollection = name

        seenCollections.add(name)
        if (!batches.has(name)) {
            batches.set(name, [])
            await ensureCleared(name)
        }
        batches.get(name).push(doc)

        const job = jobs.get(jobId)
        if (job) {
            job.docsDone++
            if (job.docsTotal > 0) job.percent = Math.min(99, Math.round((job.docsDone / job.docsTotal) * 100))
            job.currentCollection = name
        }

        if (batches.get(name).length >= STREAM_BATCH_SIZE) await flush(name)
    }

    for (const name of batches.keys()) await flush(name)

    // Collections that had zero documents in the backup never appear as a
    // line above, so they'd never get cleared by the loop - do that now,
    // after everything that actually had data to restore has succeeded.
    for (const name of meta.collections) await ensureCleared(name)

    updateJob(jobId, { collectionsDone: seenCollections.size })

    const results = meta.collections.map((name) => (
        errors[name]
            ? { collection: name, ok: false, error: errors[name] }
            : { collection: name, ok: true, restored: restoredCounts[name] || 0 }
    ))

    return {
        restoredAt: new Date().toISOString(),
        backup: meta,
        results,
        failedCollections: results.filter((r) => !r.ok).map((r) => r.collection),
    }
}

const restoreBackupFunction = (id) => {
    // Validate up front so a bad id fails fast instead of only surfacing
    // once the caller starts polling for progress.
    readMeta(id)

    const job = createJob('restore')
    runRestoreBackupJob(job.jobId, id)
        .then((result) => finishJob(job.jobId, {
            phase: 'completed',
            result,
            error: result.failedCollections.length ? `${result.failedCollections.length} collection(s) failed to restore` : null,
        }))
        .catch((err) => finishJob(job.jobId, { phase: 'failed', error: err.message || 'Restore failed' }))
    return job
}

const getJobProgress = (jobId) => {
    const job = getJob(jobId)
    return { ...job }
}

const getBackupFileForDownload = (id) => {
    const meta = readMeta(id)
    const dataPath = dataPathFor(id)
    if (!fs.existsSync(dataPath)) throw new Error('Backup file is missing from disk')
    return { meta, dataPath }
}

/**
 * Permanently deletes a backup's files from disk (both the gzipped data file
 * and its metadata sidecar). This only removes the backup snapshot itself -
 * it never touches the live database.
 */
const deleteBackupFunction = async (id) => {
    const meta = readMeta(id) // validates the id and that the backup exists

    let dataDeleted = false
    try { await fs.promises.unlink(dataPathFor(id)); dataDeleted = true } catch (e) { if (e.code !== 'ENOENT') throw e }
    try { await fs.promises.unlink(metaPathFor(id)) } catch (e) { if (e.code !== 'ENOENT') throw e }

    return { id, dataDeleted, deletedAt: new Date().toISOString(), backup: meta }
}

/**
 * Peeks the first (meta) line of an uploaded gzipped NDJSON file to confirm
 * it really is one of our backups and pull out its original collections/
 * counts, without decompressing the whole file. Resolves with that meta
 * line, or rejects (and the caller cleans up the temp file) if the upload
 * doesn't look like a valid backup.
 */
const peekBackupMeta = (filePath) => new Promise((resolve, reject) => {
    const gunzip = zlib.createGunzip()
    const fileStream = fs.createReadStream(filePath)
    const rl = readline.createInterface({ input: fileStream.pipe(gunzip), crlfDelay: Infinity })

    let settled = false
    const finish = (err, meta) => {
        if (settled) return
        settled = true
        rl.close()
        fileStream.destroy()
        gunzip.destroy()
        if (err) reject(err)
        else resolve(meta)
    }

    rl.on('line', (line) => {
        try {
            const parsed = EJSON.parse(line, { relaxed: false })
            if (!parsed.__meta__) return finish(new Error('This does not look like a valid backup file'))
            finish(null, parsed)
        } catch (e) {
            finish(new Error('This does not look like a valid backup file'))
        }
    })
    rl.on('close', () => finish(new Error('This does not look like a valid backup file')))
    fileStream.on('error', () => finish(new Error('Unable to read the uploaded file - is it a valid .gz backup?')))
    gunzip.on('error', () => finish(new Error('Unable to read the uploaded file - is it a valid .gz backup? (must be gzip-compressed)')))
})

/**
 * Registers a manually-uploaded backup file as a normal backup entry (same
 * id scheme, same meta.json sidecar) so it shows up in the list and can be
 * restored/downloaded/deleted through the exact same flows as one created
 * on this server - the only difference is where the data file came from
 * (e.g. downloaded earlier from this same system, or copied over from
 * another environment).
 */
const registerUploadedBackupFunction = async (tempFilePath, user, originalFilename) => {
    let meta
    try {
        meta = await peekBackupMeta(tempFilePath)
    } catch (err) {
        await fs.promises.unlink(tempFilePath).catch(() => {})
        throw err
    }

    ensureBackupDir()
    const uploadedAt = new Date().toISOString()
    const id = `backup-${uploadedAt.replace(/[:.]/g, '-')}`
    const dataPath = dataPathFor(id)

    try {
        await fs.promises.rename(tempFilePath, dataPath)
    } catch (err) {
        if (err.code !== 'EXDEV') throw err
        // cross-device fallback, in case the temp dir and BACKUP_DIR ever end
        // up on different filesystems
        await fs.promises.copyFile(tempFilePath, dataPath)
        await fs.promises.unlink(tempFilePath)
    }

    const sizeBytes = fs.statSync(dataPath).size
    const counts = meta.counts || {}
    const savedMeta = {
        id,
        createdAt: meta.createdAt || uploadedAt,
        dbName: meta.dbName,
        collections: meta.collections || [],
        counts,
        totalDocuments: Object.values(counts).reduce((sum, n) => sum + (n || 0), 0),
        sizeBytes,
        triggeredBy: user ? { id: user.id || user._id, email: user.email, name: [user.firstName, user.lastName].filter(Boolean).join(' ') } : null,
        uploadedFrom: originalFilename || null,
    }
    fs.writeFileSync(metaPathFor(id), JSON.stringify(savedMeta, null, 2))

    return savedMeta
}

module.exports = {
    createBackupFunction,
    listBackupsFunction,
    restoreBackupFunction,
    getJobProgress,
    getBackupFileForDownload,
    deleteBackupFunction,
    newUploadTempPath,
    MAX_UPLOAD_BYTES,
    registerUploadedBackupFunction,
}
