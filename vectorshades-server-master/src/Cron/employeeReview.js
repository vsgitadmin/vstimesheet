const { generateYearlyAnalyticsEmployee } = require('../Controllers/ControllerFunction/Review');
const CronJob = require('cron').CronJob;
const { employee: { employeeModel }} = require('../Models/Extractor/index')

const PerformanceCron = new CronJob('25 23 * * *', async function () {
    const year = new Date().getFullYear()
    const employees = await employeeModel.find({ active: true }).select('_id role').lean()
    employees.forEach(({ _id }) => generateYearlyAnalyticsEmployee({emp:_id,year}))
});


module.exports = PerformanceCron
