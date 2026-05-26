const CronJob = require('cron').CronJob;
const { employee: { employeeModel }, projects: { taskModel, projectModel } } = require('../Models/Extractor/index')

const projectCron = new CronJob('30 23 * * *', async function () {
    const projects = await projectModel.find({ completed: false, active: true }); // find all projects
    for (const project of projects) {
        const tasks = await taskModel.find({ projectId: project._id }); // find all tasks with the current project's projectId
        const completedHours = tasks.reduce((acc, task) => acc + task.completedHours, 0); // calculate the sum of completed hours for all tasks
        await projectModel.updateOne({ _id: project._id }, { hours: completedHours }); // update the completedHours field for the current project
    }
});


module.exports = projectCron
