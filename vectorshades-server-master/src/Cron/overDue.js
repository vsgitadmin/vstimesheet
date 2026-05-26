const CronJob = require('cron').CronJob;
const { employee: { employeeModel } } = require('../Models/Extractor/index')
const { taskModel } = require('../Models/Projects');
const notifyTaskTemplate = require('../Config/Templates/notifyTaskTemplate');
const { sendEmailFunction, createNotification } = require('../Controllers/ControllerFunction/Communication');
const { withEmailBanner } = require('../Helpers/Functions/General/emailBanner');

async function sendTaskNotification({ userTask, project, recipientId, recipientName, subject, message }) {
  const employee = await employeeModel.findById(recipientId).select('email');
  const templateCode = notifyTaskTemplate(await withEmailBanner({
    name: recipientName,
    project: project,
    task: userTask.name,
    assignedTo: userTask.assignedToName,
    message,
    link: `https://vectorshades-frontend.vercel.app/admin/dashboard/projects/${userTask.projectId}?taskpopup=${userTask._id}&group=${userTask.section}`
  }));
  await sendEmailFunction({ to: employee.email, subject, html: templateCode });
  await createNotification({ text: subject, reciever: employee._id, link: `/admin/dashboard/projects/${userTask.projectId}?taskpopup=${userTask._id}&group=${userTask.section}` })
}

let isTaskDueCronRunning = false;

const taskDueCron = new CronJob(
  '35 */2 * * *',
  async function () {
    if (isTaskDueCronRunning) {
      console.log('taskDueCron already running - skipping this run');
      return;
    }
    isTaskDueCronRunning = true;

    try {
      console.log('taskDueCron started', new Date().toISOString());

      const tasksWithProjectName = await taskModel.aggregate([
        { $match: { status: 'In Progress' } },
        {
          $lookup: {
            from: 'projects',
            localField: 'projectId',
            foreignField: '_id',
            as: 'project'
          }
        },
        {
          $addFields: {
            projectName: { $ifNull: [{ $arrayElemAt: ['$project.projectName', 0] }, null] }
          }
        },
        {
          $project: {
            project: 0,
            projectId: 0
          }
        }
      ]);

      for (const userTask of tasksWithProjectName) {
        try {
          const startedOnTime = userTask.startedOn ? new Date(userTask.startedOn).getTime() : null;
          const diffInMs = startedOnTime ? Math.abs(Date.now() - startedOnTime) : 0;
          const diffInHrs = Number((diffInMs / (1000 * 60 * 60)).toFixed(2));
          const completedHoursNum = Number(userTask.completedHours) || 0;
          const allocatedHoursNum = Number(userTask.allocatedHours) || 0;
          const total = completedHoursNum + diffInHrs;

          if (total > allocatedHoursNum) {
            await sendTaskNotification({
              userTask,
              project: userTask.projectName,
              recipientId: userTask.assignedBy,
              recipientName: userTask.assignedByName,
              subject: `Task ${userTask.name} is overdue`,
              message: `${userTask.name} exceeded allocated Time. Please contact Admin Or Pause the task to stop recieving notifications`
            });
          }
        } catch (taskErr) {
          console.error('Error handling task', userTask?._id, taskErr);
        }
      }
    } catch (err) {
      console.error('taskDueCron failed', err);
    } finally {
      isTaskDueCronRunning = false;
      console.log('taskDueCron finished', new Date().toISOString());
    }
  },
  null,
  true,
  'Asia/Kolkata'
);

module.exports = taskDueCron;
