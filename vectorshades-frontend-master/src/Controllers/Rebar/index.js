import instance from "../../Axios/Axios.config";
import { rebarJob } from "../../Constants/API/Endpoints"

const getAllAwardedJobs = async (query) => {
    try {
        let page = query.page ? query.page : 1
        const response = await instance.get(rebarJob.getAwardedJobs, { params: query })
        return response
    } catch (err) { throw err }
}

const getAllDashboardJobsController = async (query) => {
    try {
        const response = await instance.get(rebarJob.getDashboardJobs, { params: query })
        return response.data
    } catch (err) { throw err }
}

const getMonthlyJobAnalyticsController = async (query) => {
    try {
        const response = await instance.get(rebarJob.jobMonthlyAnalytics, { params: query })
        return response.data
    } catch (err) { throw err }
}

const getMonthlyDashboardJobAnalyticsController = async (query) => {
    try {
        const response = await instance.get(rebarJob.dashboardJobsMonthlyAnalytics, { params: query })
        return response.data
    } catch (err) { throw err }
}


const generateReportJobsController = async (query) => {
    try {
        const response = await instance.post(rebarJob.createJobReport, {}, { params: query })
        return response
    } catch (err) { throw err }
}

const awardJobController = async (data) => {
    try {
        const response = await instance.post(rebarJob.awardJob, data)
        return response
    } catch (err) { throw err }
}

const deleteJobController = async (data) => {
    try {
        const response = await instance.delete(`${rebarJob.deletejob}?id=${data}`)
        return response
    } catch (err) { throw err }
}

const updateAwardedJobController = async (data) => {
    try {
        const response = await instance.patch(`${rebarJob.patchAwardedJob}`, data)
        return response
    } catch (err) { throw err }
}

const updateDashboardJobsController = async (data) => {
    try {
        const response = await instance.patch(`${rebarJob.patchDashboardJobs}`, data)
        return response
    } catch (err) { throw err }
}

const getAlljobsController = async (query) => {
    try {
        const response = await instance.get(rebarJob.getalljobs, { params: query })
        return response
    } catch (err) { throw err }
}

const getAllPendingjobsController = async (query) => {
    try {
        const response = await instance.get(rebarJob.getallpendingjobs, { params: query })
        return response
    } catch (err) { throw err }
}

const getTotalNumberOfJobsController = async (query) => {
    try {
        const response = await instance.get(rebarJob.getTotalNumberOfJobs, { params: query })
        return response
    } catch (err) { throw err }
}


const getTotalNumberOfJAwardedJobsController = async () => {
    try {
        const response = await instance.get(rebarJob.getTotalNumberOfAwardedJobs)
        return response
    } catch (err) { throw err }
}

const filterJobsController = async (input) => {
    try {
        const response = await instance.get(`${rebarJob.getFilteredJobs}?job=${input}&sortkey=-1`)
        return response
    } catch (err) { throw err }
}

const filterAwardedJobsController = async (input) => {
    try {
        const response = await instance.get(`${rebarJob.getFilteredAwardedJobs}?job=${input}&sortkey=-1`)
        return response
    } catch (err) { throw err }
}

const filterDashboardJobsController = async (input) => {
    try {
        const response = await instance.get(`${rebarJob.getFilteredDashboardJobs}?job=${input}&sortkey=-1`)
        return response
    } catch (err) { throw err }
}

const getJobDashboardController = async () => {
    try {
        const response = await instance.get(rebarJob.dashboard)
        return response
    } catch (err) { throw err }
}

const getSalesPerfomanceController = async () => {
    try {
        const response = await instance.get(rebarJob.getSalesPerfomance)
        return response
    } catch (err) { throw err }
}

const getAllRebarJobsController = async () => {
    try {
        const response = await instance.get(rebarJob.getAllRebarJobs)
        return response
    } catch (err) { throw err }
}

const getRebarJobDetails = async (query) => {
    try {
        const response = await instance.get(rebarJob.getRebarJobDetails, { params: query })
        return response
    } catch (err) { throw err }
}

const getRebarChangeOrder = async (query) => {
    try {
        const response = await instance.get(rebarJob.getRebarChangeOrder, { params: query })
        return response
    } catch (err) { throw err }
}

const createRebarChangeOrder = async (body) => {
    try {
        const response = await instance.post(rebarJob.createRebarChangeOrder, body)
        return response
    } catch (err) { throw err }
}

const updateRebarChangeOrder = async (body) => {
    try {
        const response = await instance.patch(rebarJob.updateRebarChangeOrder, body)
        return response
    } catch (err) { throw err }
}

const deleteRebarChangeOrder = async (query) => {
    try {
        const response = await instance.delete(rebarJob.deleteRebarChangeOrder, { params: query })
        return response
    } catch (err) { throw err }
}


module.exports = { getRebarChangeOrder,createRebarChangeOrder,updateRebarChangeOrder,deleteRebarChangeOrder,awardJobController, getMonthlyDashboardJobAnalyticsController, getAllPendingjobsController, getAllAwardedJobs, deleteJobController, updateAwardedJobController, getAllDashboardJobsController, updateDashboardJobsController, getAlljobsController, generateReportJobsController, getTotalNumberOfJobsController, getJobDashboardController, getMonthlyJobAnalyticsController, getTotalNumberOfJAwardedJobsController, filterAwardedJobsController, filterDashboardJobsController, filterJobsController, getSalesPerfomanceController, getAllRebarJobsController, getRebarJobDetails }