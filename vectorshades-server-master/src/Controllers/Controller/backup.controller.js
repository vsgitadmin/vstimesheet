const { response: { backupResponse } } = require("../../Classes/index")
const {
    createBackupFunction, listBackupsFunction, restoreBackupFunction, getJobProgress, getBackupFileForDownload, deleteBackupFunction,
    newUploadTempPath, MAX_UPLOAD_BYTES, registerUploadedBackupFunction,
} = require("../ControllerFunction/Backup")

// Full-database backup/restore is destructive and exposes every record in the
// system, so it is restricted to Super Admins regardless of the (currently
// disabled) global role middleware.
const isSuperAdmin = (req) => req.headers?.data?.role === 'SA'

// Backups/restores run in the background (they can take a while on a large
// database), so these two just kick off a job and hand back a jobId - the
// frontend polls /backup/progress?jobId=... for a live percentage.
const createBackupController = async (req, res) => {
    if (!isSuperAdmin(req)) return res.status(403).json(new backupResponse("Only a Super Admin can create a backup", null, true))

    try {
        const job = createBackupFunction(req.headers.data)
        res.status(202).json(new backupResponse("Backup started", { data: { jobId: job.jobId } }, false))
    } catch (err) {
        res.status(400).json(new backupResponse(err.message || "Unable to start backup", null, true))
    }
}

const listBackupsController = async (req, res) => {
    if (!isSuperAdmin(req)) return res.status(403).json(new backupResponse("Only a Super Admin can view backups", null, true))

    // listBackupsFunction already returns { data, total, totalPages, page } -
    // passed straight through as the response body (not re-wrapped under
    // another .data) so the frontend can read response.totalPages directly.
    const response = await listBackupsFunction({ page: req.query.page, limit: req.query.limit })
        .then((result) => new backupResponse("Backups fetched successfully", result, false))
        .catch((err) => new backupResponse(err.message || "Unable to fetch backups", null, true))
    res.status(response.failed ? 400 : 200).json(response)
}

const restoreBackupController = async (req, res) => {
    if (!isSuperAdmin(req)) return res.status(403).json(new backupResponse("Only a Super Admin can restore a backup", null, true))
    if (req.body?.confirm !== true) return res.status(400).json(new backupResponse("Restore must be explicitly confirmed", null, true))

    try {
        const job = restoreBackupFunction(req.body.id)
        res.status(202).json(new backupResponse("Restore started", { data: { jobId: job.jobId } }, false))
    } catch (err) {
        res.status(400).json(new backupResponse(err.message || "Unable to start restore", null, true))
    }
}

const backupProgressController = async (req, res) => {
    if (!isSuperAdmin(req)) return res.status(403).json(new backupResponse("Only a Super Admin can view backup jobs", null, true))

    try {
        const data = getJobProgress(req.query.jobId)
        res.status(200).json(new backupResponse("Job progress fetched successfully", { data }, false))
    } catch (err) {
        res.status(404).json(new backupResponse(err.message || "Job not found", null, true))
    }
}

const downloadBackupController = async (req, res) => {
    if (!isSuperAdmin(req)) return res.status(403).json(new backupResponse("Only a Super Admin can download a backup", null, true))

    try {
        const { meta, dataPath } = getBackupFileForDownload(req.query.id)
        res.download(dataPath, `${meta.id}.ndjson.gz`)
    } catch (err) {
        res.status(400).json(new backupResponse(err.message || "Unable to download backup", null, true))
    }
}

// The app already mounts connect-busboy and express-fileupload globally
// (src/app.js) for the rest of the codebase's uploads - multer would try to
// read the request body a second time, after one of those has already
// consumed the multipart stream, and fail. So this uses express-fileupload
// (req.files.file, same as documentUploadActivationController) instead of
// its own parser.
const uploadBackupController = async (req, res) => {
    if (!isSuperAdmin(req)) return res.status(403).json(new backupResponse("Only a Super Admin can upload a backup", null, true))

    const file = req.files?.file
    if (!file) return res.status(400).json(new backupResponse("No file was uploaded", null, true))
    if (file.size > MAX_UPLOAD_BYTES) return res.status(400).json(new backupResponse("File is too large", null, true))

    const tempPath = newUploadTempPath()
    try {
        await new Promise((resolve, reject) => file.mv(tempPath, (err) => (err ? reject(err) : resolve())))
    } catch (err) {
        return res.status(400).json(new backupResponse(err.message || "Unable to save the uploaded file", null, true))
    }

    const response = await registerUploadedBackupFunction(tempPath, req.headers.data, file.name)
        .then((data) => new backupResponse("Backup uploaded successfully", { data }, false))
        .catch((err) => new backupResponse(err.message || "Unable to process the uploaded backup", null, true))
    res.status(response.failed ? 400 : 200).json(response)
}

const deleteBackupController = async (req, res) => {
    if (!isSuperAdmin(req)) return res.status(403).json(new backupResponse("Only a Super Admin can delete a backup", null, true))

    const response = await deleteBackupFunction(req.query.id)
        .then((data) => new backupResponse("Backup deleted successfully", { data }, false))
        .catch((err) => new backupResponse(err.message || "Unable to delete backup", null, true))
    res.status(response.failed ? 400 : 200).json(response)
}

module.exports = {
    createBackupController,
    listBackupsController,
    restoreBackupController,
    backupProgressController,
    downloadBackupController,
    uploadBackupController,
    deleteBackupController,
}
