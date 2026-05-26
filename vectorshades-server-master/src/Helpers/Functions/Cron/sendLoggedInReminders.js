const { projects: { taskModel } } = require('../../../Models/Extractor/index');
const { sendInProgressTasksReminderEmail } = require('../Email/inProgressTasksReminder');

async function sendLoggedInReminders(employees, { concurrency = 10 } = {}) {
    if (!Array.isArray(employees)) throw new TypeError('employees must be an array');

    const loggedIn = employees.filter((emp) => emp && (emp._id ?? emp.id) && emp.logedIn);
    const summary = {
        requested: employees.length,
        attempted: loggedIn.length,
        emailed: 0,
        skipped: 0,
        failed: 0,
        errors: [],
    };

    for (let i = 0; i < loggedIn.length; i += concurrency) {
        const chunk = loggedIn.slice(i, i + concurrency);
        const results = await Promise.allSettled(
            chunk.map(async (emp) => {
                const id = emp._id ?? emp.id;
                const tasks = await taskModel
                    .find({ status: 'In Progress', assignedTo: id })
                    .select('_id name projectId section taskIndex')
                    .lean();
                if (!tasks.length) {
                    return { id, ok: true, skipped: true };
                }
                await sendInProgressTasksReminderEmail(emp, tasks);
                return { id, ok: true, skipped: false };
            })
        );

        for (const r of results) {
            if (r.status === 'fulfilled') {
                const val = r.value;
                if (val?.ok && val.skipped) summary.skipped++;
                else if (val?.ok) summary.emailed++;
                else {
                    summary.failed++;
                    summary.errors.push(val);
                }
            } else {
                summary.failed++;
                summary.errors.push({ ok: false, error: r.reason });
            }
        }
    }

    return summary;
}

module.exports = sendLoggedInReminders;
