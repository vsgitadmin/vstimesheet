const CronJob = require('cron').CronJob;
const { patchDashboardJob } = require('../Controllers/ControllerFunction/Jobs');
const { projects: { taskModel , projectModel} , jobs:{ProjectDashboardModel}} = require('../Models/Extractor/index');

const dashboardHrsCron = new CronJob('25 23 * * *', async function () {
    const projects = await projectModel.find({completed:false,rebar:false})
    // await taskModel.updateMany(
    //     { $expr: { $gt: ["$completedHours", "$allocatedHours"] } },
    //     [{ $set: { completedHours: "$allocatedHours" } }]
    // );
    projects.map(async (projectData) => {
        const tasks = await taskModel.find({
            projectId: projectData._id,
            section: { $ne: "General" }
          });
        let usedHours = 0;
        for (const task of tasks) { 
            usedHours += task.completedHours || 0; // Ensure `completedHours` is treated as 0 if undefined
        }
        usedHours = parseFloat(usedHours.toFixed(2))
        const dashboardData = await ProjectDashboardModel.findOne({jobId:projectData.job}).lean()
        dashboardData.usedHours = usedHours
        if(dashboardData !== null) await patchDashboardJob(dashboardData)
        projectData.hours = usedHours
        await projectData.save()
    })
    console.log('CRON - dashboard used hrs')
});


module.exports = dashboardHrsCron
