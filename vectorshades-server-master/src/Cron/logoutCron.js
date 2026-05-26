const CronJob = require('cron').CronJob;
const { employee: { employeeModel } } = require('../Models/Extractor/index')
const { logoutUser } = require('../Controllers/ControllerFunction/Authentication/index')

const logoutCron = new CronJob('25 23 * * *', async function () {
    // const employees = await employeeModel.find({ active: true }).select('_id role').lean()
    // employees.forEach(({ _id, role }) => logoutUser({ id: _id, role }))
});


module.exports = logoutCron
