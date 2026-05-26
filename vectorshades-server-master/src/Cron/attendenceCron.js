const CronJob = require('cron').CronJob;
const { employeeModel } = require('../Models/Employee');
const { taskActivityModel } = require('../Models/Projects');
const { attendenceModel } = require('../Models/Timesheet');

const attendenceCron = new CronJob('00 23 * * *', async function () {
    try {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const results = await taskActivityModel.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: startOfDay,
                        $lte: endOfDay
                    }
                }
            },
            {
                $group: {
                    _id: "$createdBy.id"
                }
            },
            {
                $project: {
                    _id: 0,
                    createdById: "$_id"
                }
            }
        ]);

        const uniqueCreatorIds = results.map(r => r.createdById);
        const todayDate = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

        for (const empId of uniqueCreatorIds) {
            const employee = await employeeModel.findById(empId).select('loginTime taskTime')
            new attendenceModel(
                {
                hours: employee.taskTime,
                loginHours:employee.loginTime,
                projectId: "auto-timer",
                date: todayDate,
                employeeId: empId
            }
            ).save()
        }
        console.log('Attendance marking complete.');
    } catch (err) {
        console.error('Error running attendanceCron:', err);
    }
});


module.exports = attendenceCron
