import instance from "../../Axios/Axios.config";
import {job} from "../../Constants/API/Endpoints"

const getAllAwardedJobs = async (query) => {
    try {
        let page = query.page ? query.page : 1
        const response = await instance.get(job.getAwardedJobs, {params: query})
        return response
    } catch (err) {
        throw err
    }
}

const getAllDashboardJobsController = async (query) => {
    try {
        const response = await instance.get(job.getDashboardJobs, {params: query})
        return response.data
    } catch (err) {
        throw err
    }
}

const getMonthlyJobAnalyticsController = async (query) => {
    try {
        const response = await instance.get(job.jobMonthlyAnalytics, {params: query})
        return response.data
    } catch (err) {
        throw err
    }
}

const getMonthlyDashboardJobAnalyticsController = async (query) => {
    try {
        const response = await instance.get(job.dashboardJobsMonthlyAnalytics, {params: query})
        return response.data
    } catch (err) {
        throw err
    }
}


const generateReportJobsController = async (query) => {
    try {
        const response = await instance.post(job.createJobReport, {}, {params: query})
        return response
    } catch (err) {
        throw err
    }
}

const awardJobController = async (data) => {
    try {
        const response = await instance.post(job.awardJob, data)
        return response
    } catch (err) {
        throw err
    }
}

const deleteJobController = async (data) => {
    try {
        const response = await instance.delete(`${job.deletejob}?id=${data}`)
        return response
    } catch (err) {
        throw err
    }
}

const updateAwardedJobController = async (data) => {
    try {
        const response = await instance.patch(`${job.patchAwardedJob}`, data)
        return response
    } catch (err) {
        throw err
    }
}

const updateDashboardJobsController = async (data) => {
    try {
        const response = await instance.patch(`${job.patchDashboardJobs}`, data)
        return response
    } catch (err) {
        throw err
    }
}

const getAlljobsController = async (query) => {
    try {
        const response = await instance.get(job.getalljobs, {params: query})
        return response
    } catch (err) {
        throw err
    }
}

const getAllPendingjobsController = async (query) => {
    try {
        const response = await instance.get(job.getallpendingjobs, {params: query})
        return response
    } catch (err) {
        throw err
    }
}

const getTotalNumberOfJobsController = async (query) => {
    try {
        const response = await instance.get(job.getTotalNumberOfJobs, {params: query})
        return response
    } catch (err) {
        throw err
    }
}


const getTotalNumberOfJAwardedJobsController = async () => {
    try {
        const response = await instance.get(job.getTotalNumberOfAwardedJobs)
        return response
    } catch (err) {
        throw err
    }
}

const filterJobsController = async (input) => {
    try {
        const response = await instance.get(`${job.getFilteredJobs}?job=${input}&sortkey=-1`)
        return response
    } catch (err) {
        throw err
    }
}

const filterAwardedJobsController = async (input) => {
    try {
        const response = await instance.get(`${job.getFilteredAwardedJobs}?job=${input}&sortkey=-1`)
        return response
    } catch (err) {
        throw err
    }
}

const filterDashboardJobsController = async (input) => {
    try {
        const response = await instance.get(`${job.getFilteredDashboardJobs}?job=${input}&sortkey=-1`)
        return response
    } catch (err) {
        throw err
    }
}

const getJobDashboardController = async () => {
    try {
        const response = await instance.get(job.dashboard)
        return response
    } catch (err) {
        throw err
    }
}

const getSalesPerfomanceController = async (query) => {
    try {
        const response = await instance.get(job.getSalesPerfomance,{params:query})
        return response
    } catch (err) {
        throw err
    }
}

const getAllRebarJobsController = async () => {
    try {
        const response = await instance.get(job.getAllRebarJobs)
        return response
    } catch (err) {
        throw err
    }
}

const getRebarJobDetails = async (query) => {
    try {
        const response = await instance.get(job.getRebarJobDetails, {params: query})
        return response
    } catch (err) {
        throw err
    }
}

const getSubmissionsController = async (query) => {
    try {
        const response = await instance.get(job.getSubmissions, {params: query})
        return response
    } catch (err) {
        throw err
    }
}

const createSubmissionController = async (body) => {
    try {
        const response = await instance.post(job.createSubmissions, body)
        return response
    } catch (err) {
        throw err
    }
}

const deleteSubmissionController = async (query) => {
    try {
        const response = await instance.delete(job.deleteSubmissions, {params: query})
        return response
    } catch (err) {
        throw err
    }
}

const getChangeOrder = async (query) => {
    try {
        const response = await instance.get(job.getChangeOrder, { params: query })
        return response
    } catch (err) { throw err }
}

const createChangeOrder = async (body) => {
    try {
        const response = await instance.post(job.createChangeOrder, body)
        return response
    } catch (err) { throw err }
}

const updateChangeOrder = async (body) => {
    try {
        const response = await instance.patch(job.updateChangeOrder, body)
        return response
    } catch (err) { throw err }
}

const deleteChangeOrder = async (query) => {
    try {
        const response = await instance.delete(job.deleteChangeOrder, { params: query })
        return response
    } catch (err) { throw err }
}

const createChangeOrderReport = async (query) => {
    try {
        const response = await instance.post(job.createChangeOrderReport, query)
        return response
    } catch (err) { throw err }
}

const generateDashboardReport = async (query) => {
    try {
        const response = await instance.post(job.generateDashboardReport,query)
        return response
    } catch (err) { throw err }
}

const generateSubmissionReport = async (query) => {
    try {
        const response = await instance.post(job.generateSubmissionReport,query)
        return response
    } catch (err) { throw err }
}

module.exports = {
    awardJobController,
    getMonthlyDashboardJobAnalyticsController,
    getAllPendingjobsController,
    getAllAwardedJobs,
    deleteJobController,
    updateAwardedJobController,
    getAllDashboardJobsController,
    updateDashboardJobsController,
    getAlljobsController,
    generateReportJobsController,
    getTotalNumberOfJobsController,
    getJobDashboardController,
    getMonthlyJobAnalyticsController,
    getTotalNumberOfJAwardedJobsController,
    filterAwardedJobsController,
    filterDashboardJobsController,
    filterJobsController,
    getSalesPerfomanceController,
    getAllRebarJobsController,
    getRebarJobDetails,
    getSubmissionsController,
    deleteSubmissionController,
    createSubmissionController,
    getChangeOrder,
    createChangeOrder,
    updateChangeOrder,
    deleteChangeOrder,
    createChangeOrderReport,
    generateDashboardReport,
    generateSubmissionReport
}