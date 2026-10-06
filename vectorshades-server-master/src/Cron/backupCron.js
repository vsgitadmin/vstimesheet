const CronJob = require('cron').CronJob
const { createBackupFunction, getJobProgress } = require('../Controllers/ControllerFunction/Backup')

// Tags the backup as system-triggered (rather than a real employee) so it's
// distinguishable in the Backup & Restore list ("By Scheduled backup...").
const SCHEDULED_BACKUP_USER = { id: 'system', email: 'Scheduled backup (weekly)', firstName: '', lastName: '' }

// Backup jobs aren't promises (createBackupFunction just kicks the work off
// and hands back a jobId, same as the HTTP route does for a client to poll)
// - this does that same polling server-side so the outcome lands in the
// server log instead of going unobserved.
const pollUntilDone = (jobId) => {
    const check = () => {
        let job
        try {
            job = getJobProgress(jobId)
        } catch (err) {
            console.log(`[backupCron] lost track of job ${jobId}: ${err.message}`)
            return
        }
        if (job.phase === 'completed') console.log(`[backupCron] weekly backup completed: ${job.result?.id}`)
        else if (job.phase === 'failed') console.log(`[backupCron] weekly backup failed: ${job.error}`)
        else setTimeout(check, 5000)
    }
    check()
}

// Every Sunday at 6:00 AM (server local time) - a rolling automatic safety
// net independent of anyone remembering to click "Create Backup" in Settings.
const backupCron = new CronJob('0 6 * * 0', function () {
    try {
        const job = createBackupFunction(SCHEDULED_BACKUP_USER)
        console.log(`[backupCron] weekly backup started (job ${job.jobId})`)
        pollUntilDone(job.jobId)
    } catch (err) {
        console.log(`[backupCron] failed to start weekly backup: ${err.message}`)
    }
})

module.exports = backupCron
