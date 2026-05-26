const CronJob = require('cron').CronJob;
const { reviews: { reviewRequestsModel } } = require('../Models/Extractor')

const reviewRequestCron = new CronJob('40 23 * * *', async function () {
    const sevenDaysDago = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    const reviewRequests = await reviewRequestsModel.updateMany(
        { createdAt: { $lte: sevenDaysDago }, expired: false, reviewSubmitted: false },
        { $set: { expired: true } }
    );
})

module.exports = reviewRequestCron;