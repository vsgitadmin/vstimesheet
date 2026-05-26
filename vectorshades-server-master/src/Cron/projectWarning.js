const CronJob = require('cron').CronJob;
const notifyTaskTemplate = require('../Config/Templates/notifyTaskTemplate');
const { projects: { projectModel } , employee : {employeeModel} } = require('../Models/Extractor/index')
const { sendEmailFunction } = require('../Controllers/ControllerFunction/Communication');
const { withEmailBanner } = require('../Helpers/Functions/General/emailBanner');

const projectWarningCron = new CronJob('25 23 * * *', async function () {
    const projects = await projectModel.find({
        $expr: { $gt: ["$hours", "$estimatedHours"] }
    });
    projects.forEach(async (data) => {
        const employee = await employeeModel.findById(data.createdById).select('email')
        const templateCode = notifyTaskTemplate(
                await withEmailBanner({ 
                    name: data.createdBy,
                    project: data.projectName, 
                    task: "Estimated Hours Crossed", 
                    message: 'Your Project has Recently been crossed estimated hours . Please log in to dashboard for more details', 
                    link: `https://vectorshades-frontend.vercel.app/admin/dashboard/projects/${data._id}` 
                }))
    await sendEmailFunction({to:employee.email,subject:`Your Project ${data.projectName} has crossed estimate`,html:templateCode})
    })
});


module.exports = projectWarningCron
