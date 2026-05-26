const { employeeReviewsModel, employeeAnalyticsModel, reviewRequestsModel } = require("../../../Models/Reviews")
const { employeeModel } = require("../../../Models/Employee")
const { taskModel } = require("../../../Models/Projects")
const { absenteesModel } = require("../../../Models/Timesheet");

const createEmployeeReview = async (body) => {
    try {
        const response = await new employeeReviewsModel(body).save()
        let reviewReq = await reviewRequestsModel.findOneAndUpdate({ _id: body.requestId }, { reviewSubmitted: true, expired: true }, { new: true })
        await generateYearlyAnalyticsEmployee({emp:body.employeeId,year:new Date().getFullYear()})
        return response
    } catch (err) { throw err }
}

const getEmployeeReviews = async (query, uid) => {
    try {
        let response = await employeeReviewsModel.find({ employeeId: query.emp ? query.emp : uid }).sort({ createdAt: -1 }).lean()
        response = Promise.all(response.map(async (data) => {
            data = { ...data, reviewdByObj: await employeeModel.findOne({ _id: data.reviewBy }).select('firstName lastName designation').lean() }
            return data
        }))
        return response
    } catch (err) { throw err }
}

const getEmployeeReviewDetails = async (query) => {
    try {
        const response = await employeeReviewsModel.findOne({ _id: query.id })
        return response
    } catch (err) { throw err }
}

const deleteEmployeeReview = async (query) => {
    try {
        const response = await employeeReviewsModel.deleteOne({ _id: query.id })
        return response
    } catch (err) { throw err }
}

const updateEmployeeReview = async (query, body) => {
    try {
        const response = await employeeReviewsModel.findOneAndUpdate({ _id: query.id }, { $set: body }, { new: true })
        return response
    } catch (err) { throw err }
}

const createReviewAnalytics = async (body) => {
    try {
        const response = await new employeeAnalyticsModel(body).save()
        return response
    } catch (err) { throw err }
}

const getReviewAnalyticsDetails = async (query) => {
    try {
        const response = await employeeAnalyticsModel.findOne({ _id: query.id })
        return response
    } catch (err) { throw err }
}

const getEmployeeReviewAnalytics = async (query) => {
    try {
        const response = await employeeAnalyticsModel.find({ employeeId: query.id })
        return response
    } catch (err) { throw err }
}

const updateEmployeeReviewAnalytics = async (query, body) => {
    try {
        const response = await employeeAnalyticsModel.findOneAndUpdate({ _id: query.id }, { $set: body }, { new: true })
        return response
    } catch (err) { throw err }
}

const deleteEmployeeReviewAnalytics = async (query) => {
    try {
        const response = await employeeAnalyticsModel.deleteOne({ _id: query.id })
        return response
    } catch (err) { throw err }
}

const createReviewRequest = async (body) => {
    try {
        let requestFromName = await employeeModel.findOne({ _id: body.requestedFrom }).select('firstName lastName')
        let requestedByName = await employeeModel.findOne({ _id: body.requestedBy }).select('firstName lastName')
        let requestedToName = await employeeModel.findOne({ _id: body.requestedTo }).select('firstName lastName')
        const response = await new reviewRequestsModel({ ...body, requestedFromName: requestFromName.firstName + " " + requestFromName.lastName, requestedByName: requestedByName.firstName + " " + requestedByName.lastName, requestedToName: requestedToName.firstName + "" + requestedToName.lastName }).save()
        return response
    } catch (err) { throw err }
}

const getReviewRequests = async () => {
    try {
        const response = await reviewRequestsModel.find({ expired: false })
        return response
    } catch (err) { throw err }
}

const updateReviewRequests = async (query, body) => {
    try {
        const response = await reviewRequestsModel.findOneAndUpdate({ _id: query.id }, { $set: body }, { new: true })
        return response
    } catch (err) { throw err }
}

const deleteReviewRequest = async (query) => {
    try {
        const response = await reviewRequestsModel.deleteOne({ _id: query.id })
        return response
    } catch (err) { throw err }
}

const getAllReviewRequests = async () => {
    try {
        const response = await reviewRequestsModel.find()
        return response
    } catch (err) { 
        throw err 
    }
}

const getEmployeeAnalyticsOfSpecificYear = async (query, empId) => {
    try {
        const year = parseInt(query.year);
        const startDate = new Date(year, 0, 1);
        const endDate = new Date(year + 1, 0, 1);
        const response = await employeeAnalyticsModel.findOne({ employeeId: query.emp ? query.emp : empId, createdAt: { $gte: startDate, $lt: endDate }, });
        return response;
    } catch (err) { throw err }
}

const generateYearlyAnalyticsEmployee = async (query) => {
    try {
        let analyticsModel = await employeeAnalyticsModel.findOne({ employeeId: query.emp, year: query.year })
        let [workAnalytics] = await taskModel.aggregate([
            {
                $match: {
                    assignedTo: query.emp,
                },
            },
            {
                $group: {
                    _id: null,
                    totalHoursAssigned: { $sum: '$allocatedHours' },
                    totalHoursWorked: { $sum: '$completedHours' },
                    totalTasksCompleted: { $sum: { $cond: [{ $eq: ['$completed', true] }, 1, 0] } },
                    totalTasks: { $sum: 1 },
                },
            },
            {
                $project: {
                    _id: 0,
                    totalHoursAssigned: 1,
                    totalHoursWorked: 1,
                    totalTasksCompleted: 1,
                    totalTasks: 1,
                },
            },
        ]);
        const leaveCounts = await absenteesModel.aggregate([
            {
                $match: {
                    employeeId: query.emp,
                },
            },
            {
                $group: {
                    _id: '$duration',
                    count: { $sum: 1 }, // Count occurrences
                },
            },
            {
                $match: {
                    _id: { $in: [0.5, 1] }, // Include only durations 0.5 and 1
                },
            },
            {
                $project: {
                    _id: 1,
                    count: 1,
                },
            },
        ]);
        if(workAnalytics === undefined ) workAnalytics = await new employeeAnalyticsModel({year:query.year,employeeId:query.emp})
        const { totalHoursAssigned, totalHoursWorked, totalTasks, totalTasksCompleted } = workAnalytics
        let body = { year: query.year, employeeId: query.emp, totalHoursAssigned, totalHoursWorked, totalTasks, totalTasksCompleted , leaveAnalytics:leaveCounts}
        const [averageRatings] = await employeeReviewsModel.aggregate([
            {
              $match: {
                employeeId: query.emp,
              },
            },
            {
              $group: {
                _id: null,
                punctuality: { $avg: '$punctuality' },
                efficiency: { $avg: '$efficiency' },
                communication: { $avg: '$communication' },
                performance: { $avg: '$performance' },
                skills: { $avg: '$skills' },
              },
            },
            {
              $project: {
                _id: 0,
                punctuality: 1,
                efficiency: 1,
                communication: 1,
                performance: 1,
                skills: 1,
              },
            },
          ]);
        if(averageRatings !== undefined) body = {...body,...averageRatings}
        if (!analyticsModel) {
            analyticsModel = new employeeAnalyticsModel(body);
            await analyticsModel.save();
          } else {
            Object.assign(analyticsModel, body);
            await analyticsModel.save();
          }
        return {message:'employee analytics generated',data:analyticsModel,failed:false}
    } catch (err) {
        throw err
    }
}

const getAllIncommingReviewRequests = async (query, uid) => {
    try {
        const response = await reviewRequestsModel.find({ requestedTo: query.id || uid }).sort({createdAt:-1})
        return response
    } catch (err) { throw err }
}

const getReviewRequestById = async (query) => {
    try {
        const response = await reviewRequestsModel.findOne({ _id: query.id })
        return response
    } catch (err) { throw err }
}

module.exports = { createEmployeeReview, generateYearlyAnalyticsEmployee, getEmployeeReviews, getEmployeeReviewDetails, deleteEmployeeReview, updateEmployeeReview, createReviewAnalytics, getReviewAnalyticsDetails, getEmployeeReviewAnalytics, updateEmployeeReviewAnalytics, deleteEmployeeReviewAnalytics, createReviewRequest, getReviewRequests, updateReviewRequests, deleteReviewRequest, getAllReviewRequests, getEmployeeAnalyticsOfSpecificYear, getAllIncommingReviewRequests, getReviewRequestById }