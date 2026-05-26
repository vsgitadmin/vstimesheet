const CronJob = require('cron').CronJob;
const sendLoggedInReminders = require('../Helpers/Functions/Cron/sendLoggedInReminders');
const runEmployeeLogs = require('../Helpers/Functions/Cron/runLogs');
const { employeeBasicDetailsModel } = require('../Models/Employee');
const { employee: { employeeModel } } = require('../Models/Extractor/index');

const employeeLogsMorningCron = new CronJob('0 13 * * *', async function () {
  const now = new Date()
  const basic = await employeeBasicDetailsModel.find({ endTime: "16:00" }).select('employeeId').lean();
  const ids = basic.map(b => b.employeeId);

  const logedEmployees = await employeeModel.find({
    active: true,
    logedIn: true,
    _id: { $in: ids }
  });

  const reminders = await sendLoggedInReminders(logedEmployees)
  console.log(`CRON - shift-end login reminders - ${now}`, reminders)

  const employees = await employeeModel.find({
    active: true,
    _id: { $in: ids }
  });

  const cron = await runEmployeeLogs(employees)
  console.log(`CRON - employee morning shift logs - ${now}`, cron)
  return true
});


module.exports = employeeLogsMorningCron
