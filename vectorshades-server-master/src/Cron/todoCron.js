const CronJob = require('cron').CronJob;
const { employeeTodoModel } = require('../Models/Employee');

const todoCron = new CronJob('45 23 * * *', async function () {
    employeeTodoModel.deleteMany({
        createdAt: {
            $lt: new Date(new Date().setMonth(new Date().getMonth() - 3))
        }
    });
});

module.exports = todoCron;