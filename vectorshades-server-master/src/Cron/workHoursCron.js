const CronJob = require('cron').CronJob;
const { generateWorkHours } = require('../Helpers/Functions/Cron/generateWorkHours');

// Runs every day at 23:25; one calendar day per run (use daysBack > 1 for a rolling catch-up window).
const workHoursCron = new CronJob('25 23 * * *', async function () {
  try {
    await generateWorkHours({ daysBack: 1, concurrency: 2 });
    console.log('CRON - generated work hours logs');
  } catch (err) {
    console.error('CRON - workHoursCron failed:', err?.message || err);
  }
});

module.exports = workHoursCron;

