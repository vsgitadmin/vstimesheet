const CronJob = require('cron').CronJob;
const { reviews: { employeeAnalyticsModel, employeeReviewsModel }, employee: { employeeModel } , timesheet:{absenteesModel}} = require('../Models/Extractor/index')
const {employeePerformanceByEMP} = require('../Controllers/ControllerFunction/Project/index')

const employeeReviewCron = new CronJob('25 23 * * *', async function () {
    const employees = await employeeModel.find({ active: true, role: 'EMP' }).select('_id role').lean()
    employees.forEach(async (emp) => {
        const employeeReviews = await employeeReviewsModel.find({ employeeId: emp._id }).select('starRating ratingObj')
        const overallScore = (employeeReviews.reduce((acc, curr) => acc + curr.starRating, 0)) / employeeReviews.length
        const employeePerformanceData = await employeePerformanceByEMP({ id: emp._id }, {})
        const timeMapping = employeePerformanceData.map((curr) => {
            const currentTotalReducer = curr.analytics.reduce((subAcc, subCurr) => subAcc + parseInt(subCurr.totalAllocatedHours), 0)
            const currentUsedReducer = curr.analytics.reduce((subAcc, subCurr) => subAcc + parseInt(subCurr.totalCompletedHours), 0)
            const currentRemainingHours = currentTotalReducer - currentUsedReducer
            return { currentTotalReducer, currentUsedReducer, currentRemainingHours }
        })
        const [totalHoursWorked, totalHoursAssigned, totalEfficientWorked] = [
            timeMapping.reduce((acc, curr) => acc + curr.currentUsedReducer, 0),
            timeMapping.reduce((acc, curr) => acc + curr.currentTotalReducer, 0),
            timeMapping.reduce((acc, curr) => acc + curr.currentRemainingHours, 0),
        ]
        const [punctuality, efficiency, communication, performance, skills] = [
            (employeeReviews.reduce((subAcc, subCurr) => subAcc + parseInt(subCurr.ratingObj.punctuality), 0)) / employeeReviews.length,
            (employeeReviews.reduce((subAcc, subCurr) => subAcc + parseInt(subCurr.ratingObj.efficiency), 0)) / employeeReviews.length,
            (employeeReviews.reduce((subAcc, subCurr) => subAcc + parseInt(subCurr.ratingObj.communication), 0)) / employeeReviews.length,
            (employeeReviews.reduce((subAcc, subCurr) => subAcc + parseInt(subCurr.ratingObj.performance), 0)) / employeeReviews.length,
            (employeeReviews.reduce((subAcc, subCurr) => subAcc + parseInt(subCurr.ratingObj.skills), 0)) / employeeReviews.length,
        ]
        const leaveAnalytics = await absenteesModel.aggregate([
            { $match: { employeeId: emp._id } },
            { $group: { _id: '$type', count: { $sum: 1 } } },
        ]);
        const payload = { punctuality, efficiency, performance, communication, skills, overallScore, totalHoursAssigned, totalHoursWorked, totalEfficientWorked, leaveAnalytics }
        await employeeAnalyticsModel.updateOne({ employeeId: emp._id, year: new Date().getFullYear }, { $set: payload })
    })
});


module.exports = employeeReviewCron
