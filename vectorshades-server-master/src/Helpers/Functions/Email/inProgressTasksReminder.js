const sendEmail = require('./sendEmail');
const { withEmailBanner } = require('../General/emailBanner');

const frontendBase = () =>
    (process.env.FRONTEND_URL || 'https://vectorshades-frontend.vercel.app').replace(/\/+$/, '');

function formatTaskForClient(task) {
    const taskId = String(task._id);
    const projectId = task.projectId ? String(task.projectId) : '';
    const section = task.section ? String(task.section) : '';
    const labelParts = [
        task.name ? String(task.name) : `Task ${taskId}`,
        task.taskIndex ? `#${task.taskIndex}` : null,
    ].filter(Boolean);
    return {
        _id: taskId,
        name: task.name || `Task ${taskId}`,
        taskIndex: task.taskIndex || null,
        projectId: projectId || null,
        section: section || null,
        label: labelParts.join(' '),
        link: projectId
            ? `${frontendBase()}/admin/dashboard/projects/${projectId}?taskpopup=${taskId}${section ? `&group=${encodeURIComponent(section)}` : ''}`
            : frontendBase(),
    };
}

async function buildInProgressTasksEmailHtml(user, tasks) {
    const bannerProps = await withEmailBanner({ name: user.firstName || 'User' });
    const items = tasks.map((t) => {
        const formatted = formatTaskForClient(t);
        return `<li style="margin:6px 0;font-family:'Work Sans',sans-serif;">
          <div style="color:#1a73e8;text-decoration:none;">${formatted.label}</div>
          <div style="color:#9aa0a6;font-size:12px;word-break:break-all;">${formatted.link}</div>
        </li>`;
    }).join('');

    const subject = `Reminder: you have ${tasks.length} in-progress task(s)`;
    const html = `<div style="background-color:#f1f1f1;padding:20px 10px">
      <div style="width:800px;margin:0 auto;border-radius:5px;overflow:hidden">
        <div style="background-image:url('${bannerProps.bannerUrl || ''}');width:100%;height:200px;background-size:cover;"></div>
        <div style="background-color:#fff;padding:20px;margin:0">
          <h2 style="font-weight:600;font-size:20px;margin:0;font-family:'Work Sans',sans-serif;">
            Dear ${bannerProps.name || 'User'},
          </h2>
          <p style="font-family:'Work Sans',sans-serif;margin-top:10px;">
            You are still logged in and have in-progress task(s). Please pause them if you are not working on them.
          </p>
          <ul style="padding-left:18px;margin:10px 0 0 0;">${items}</ul>
          <div style="padding:0;margin:0;margin-top:20px;">
            <p style="padding:0;margin:0;margin-top:5px;font-family:'Work Sans',sans-serif;color:lightgrey;">Vector Shades LTD</p>
            <p style="padding:0;margin:0;margin-top:5px;font-family:'Work Sans',sans-serif;color:lightgrey;">Kochi, Kerala, India</p>
          </div>
        </div>
      </div>
    </div>`;

    return { subject, html };
}

async function sendInProgressTasksReminderEmail(user, tasks) {
    if (!user?.email || !Array.isArray(tasks) || tasks.length === 0) return false;
    const { subject, html } = await buildInProgressTasksEmailHtml(user, tasks);
    await sendEmail(user.email, subject, html);
    return true;
}

module.exports = {
    formatTaskForClient,
    sendInProgressTasksReminderEmail,
};
