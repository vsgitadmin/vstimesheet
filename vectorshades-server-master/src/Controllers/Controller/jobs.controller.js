const { GetAllJobs, CreateJob, patchJob, DeleteJob, GetAllPendingJobs, GetJob, awardJob, getAwardedJob, getJobDashboard, patchAwardedJob, GetAwardedJobs, getMonthlyDashboardJobAnalytics, getAwardedJobByJob, getMonthlyJobAnalytics, GetDashbBoardJobs, patchDashboardJob, getJobActivity, getTotalNumberofJobs, getTotalNumberofAwardedJobs, getFilterdJobs, getFilterdAwardedJobs, getFilterdProjects, generateReportJob, getEmployeeSalesPerfomance, getRebarJob, updateRebarJob, getRebarJobList, getRebarJobs, getSubmissions, createSubmission, deleteSubmission, getChangeOrders, createChangeOrder, updateChangeOrder, deleteChangeOrder, createChangeOrderReport, Controller, generateDashboardReport, generateSubmissionsReport } = require("../ControllerFunction/Jobs/index")
const { response: { jobResponse } } = require("../../Classes/index")

const getAllJobsController = async (req, res) => {
    try {
        const response = await GetAllJobs(req.query)
        res.status(200).json(response)
    } catch (err) {
        res.status(400).json(err.message)
    }
}

const getAllPendingJobsController = async (req, res) => {
    try {
        const response = await GetAllPendingJobs(req.query)
        res.status(200).json(response)
    } catch (err) {
        res.status(400).json(err.message)
    }
}

const getMonthlyJobAnalyticsController = async (req, res) => {
    const response = await getMonthlyJobAnalytics(req.query.month)
        .then((job) => new jobResponse("job analytics fetched", { job }, false))
        .catch((err) => new jobResponse(err.message, null, true))
    res.status(response.failed ? 400 : 200).json(response)
}


const CreateJobController = async (req, res) => {
    const response = await CreateJob(req.body)
        .then((job) => new jobResponse("job created", { id: job._id }, false))
        .catch((err) => new jobResponse(err.message, null, true))
    res.status(response.failed ? 400 : 200).json(response)
}

const updateJobController = async (req, res) => {
    const response = await patchJob(req.body, req.body.id)
        .then(async (job) => new jobResponse("job updated", { id: job._id }, false))
        .catch((err) => new jobResponse(err.message, null, true))
    res.status(response.failed ? 400 : 200).json(response)
}

const DeleteJobController = async (req, res) => {
    const response = await DeleteJob(req.query)
        .then((job) => new jobResponse("job deleted", { job }, false))
        .catch((err) => new jobResponse(err.message, null, true))
    res.status(response.failed ? 400 : 200).json(response)
}

const GetJObDetailsController = async (req, res) => {
    const response = await GetJob(req.query)
        .then((details) => new jobResponse("success", details, false))
        .catch((err) => new jobResponse(err.message, null, true))
    res.status(response.failed ? 400 : 200).json(response)
}

const AwardJobController = async (req, res) => {
    const response = await awardJob(req.body, req.headers.data)
        .then((details) => new jobResponse("success", { awardId: details._id }, false))
        .catch((err) => new jobResponse(err.message, null, true))
    res.status(response.failed ? 400 : 200).json(response)
}

const GenerateJobReportController = async (req, res) => {
    const response = await generateReportJob(req.query.id)
        .then((details) => new jobResponse("report generated successfully", { path: details }, false))
        .catch((err) => new jobResponse(err.message, null, true))
    res.status(response.failed ? 400 : 200).json(response)
}

const generateDashboardReportController = async (req, res) => {
    const response = await generateDashboardReport(req.headers.data, req.body)
        .then((details) => new jobResponse("report generated successfully", {
            data: {
                url: details
            }
        }, false))
        .catch((err) => new jobResponse(err.message, null, true))
    res.status(response.failed ? 400 : 200).json(response)
}

const generateSubmissionsReportController = async (req, res) => {
    const response = await generateSubmissionsReport(req.headers.data)
        .then((details) => new jobResponse("report generated successfully", {
            data: {
                url: details
            }
        }, false))
        .catch((err) => new jobResponse(err.message, null, true))
    res.status(response.failed ? 400 : 200).json(response)
}

const getAwardedJobsController = async (req, res) => {
    const response = await GetAwardedJobs(req.query.page, req.query)
        .then((jobs) => new jobResponse("success", { jobs: jobs.data, cost: jobs.cost }, false))
        .catch((err) => new jobResponse(err.message, null, true))
    res.status(response.failed ? 400 : 200).json(response)
}

const getProjectDashboardJobsController = async (req, res) => {
    const response = await GetDashbBoardJobs(req.query, req.headers.data)
        .then(([jobs, yearly]) => new jobResponse("success", { jobs: jobs, yearly }, false))
        .catch((err) => new jobResponse(err.message, null, true))
    res.status(response.failed ? 400 : 200).json(response)
}

const patchAwardedJobController = async (req, res) => {
    const response = await patchAwardedJob(req.body)
        .then((jobs) => new jobResponse("awarded job updated", { job: jobs._id }, false))
        .catch((err) => new jobResponse(err.message, null, true))
    res.status(response.failed ? 400 : 200).json(response)
}

const patchDashboardJobController = async (req, res) => {
    const response = await patchDashboardJob(req.body)
        .then((jobs) => new jobResponse("awarded job updated", { job: jobs._id }, false))
        .catch((err) => new jobResponse(err.message, null, true))
    res.status(response.failed ? 400 : 200).json(response)
}
const getJobActivities = async (req, res) => {
    const response = await getJobActivity(req.query.id)
        .then((activities) => new jobResponse("success", { activity: activities }, false))
        .catch((err) => new jobResponse(err.message, null, true))
    res.status(response.failed ? 400 : 200).json(response)
}

const getTotalNumberOfJobsController = async (req, res) => {
    const response = await getTotalNumberofJobs(req.query)
        .then((count) => new jobResponse("success", { total: count }, false))
        .catch((err) => new jobResponse(err.message, null, true))
    res.status(response.failed ? 400 : 200).json(response)
}


const getTotalNumberOfJAwardedjobsController = async (req, res) => {
    const response = await getTotalNumberofAwardedJobs()
        .then((count) => new jobResponse("success", { total: count }, false))
        .catch((err) => new jobResponse(err.message, null, true))
    res.status(response.failed ? 400 : 200).json(response)
}

const getFilterdJobsController = async (req, res) => {
    const response = await getFilterdJobs(req.query)
        .then((count) => new jobResponse("success", { jobs: count }, false))
        .catch((err) => new jobResponse(err.message, null, true))
    res.status(response.failed ? 400 : 200).json(response)
}

const getFilterdAwardedJobsController = async (req, res) => {
    const response = await getFilterdAwardedJobs(req.query)
        .then((count) => new jobResponse("success", { jobs: count }, false))
        .catch((err) => new jobResponse(err.message, null, true))
    res.status(response.failed ? 400 : 200).json(response)
}

const getMonthlyDashboardJobsAnalyticsController = async (req, res) => {
    const response = await getMonthlyDashboardJobAnalytics(req.query.month)
        .then((dashboard) => new jobResponse("dashboard jobs analytics fetched", { dashboard }, false))
        .catch((err) => new jobResponse(err.message, null, true))
    res.status(response.failed ? 400 : 200).json(response)
}

const getFilterdProjectsController = async (req, res) => {
    const response = await getFilterdProjects(req.query)
        .then((count) => new jobResponse("success", { jobs: count }, false))
        .catch((err) => new jobResponse(err.message, null, true))
    res.status(response.failed ? 400 : 200).json(response)
}

const getJobDashboardController = async (req, res) => {
    const response = await getJobDashboard(req.headers.data)
        .then((dashboard) => new jobResponse("job dashboard data fetched successfully", { dashboard }, false))
        .catch((err) => new jobResponse(err.message, null, true))
    res.status(response.failed ? 400 : 200).json(response)
}

const getEmployeeSalesPerfomanceController = async (req, res) => {
    const response = await getEmployeeSalesPerfomance(req.query, req.headers.data)
        .then((data) => new jobResponse("fetched successfully", { data }, false))
        .catch((err) => new jobResponse(err.message, null, true))
    res.status(response.failed ? 400 : 200).json(response)
}

const getRebarJobListController = async (req, res) => {
    const response = await getRebarJobList()
        .then((data) => new jobResponse("rebar list fetched successfully", { data }, false))
        .catch((err) => new jobResponse(err.message, null, true))
    res.status(response.failed ? 400 : 200).json(response)
}

const getRebarJobController = async (req, res) => {
    const response = await getRebarJob(req.query.id)
        .then((data) => new jobResponse("rebar details fetched successfully", { data }, false))
        .catch((err) => new jobResponse(err.message, null, true))
    res.status(response.failed ? 400 : 200).json(response)
}

const updateRebarJobController = async (req, res) => {
    const response = await updateRebarJob(req.query.id, req.body)
        .then((data) => new jobResponse("rebar details updated", { data }, false))
        .catch((err) => new jobResponse(err.message, null, true))
    res.status(response.failed ? 400 : 200).json(response)
}

const getRebarJobsController = async (req, res) => {
    const response = await getRebarJobs()
        .then((data) => new jobResponse("rebar jobs fetched successfully", { data }, false))
        .catch((err) => new jobResponse(err.message, null, true))
    res.status(response.failed ? 400 : 200).json(response)
}

const getSubmissionsController = async (req, res) => {
    const response = await getSubmissions(req.query)
        .then((data) => new jobResponse("submissions fetched successfully", { data }, false))
        .catch((err) => new jobResponse(err.message, null, true))
    res.status(response.failed ? 400 : 200).json(response)
}

const createSubmissionsController = async (req, res) => {
    const response = await createSubmission(req.body)
        .then((data) => new jobResponse("submissions created successfully", { data }, false))
        .catch((err) => new jobResponse(err.message, null, true))
    res.status(response.failed ? 400 : 200).json(response)
}


const deleteSubmissionsController = async (req, res) => {
    const response = await deleteSubmission(req.body)
        .then((data) => new jobResponse("submissions deleted successfully", { data }, false))
        .catch((err) => new jobResponse(err.message, null, true))
    res.status(response.failed ? 400 : 200).json(response)
}

const getChangeOrdersController = async (req, res) => {
    const response = await getChangeOrders(req.query.id)
        .then((data) => new jobResponse("change order fetched successfully", { data }, false))
        .catch((err) => new jobResponse(err.message, null, true))
    res.status(response.failed ? 400 : 200).json(response)
}

const createChangeOrdersController = async (req, res) => {
    const response = await createChangeOrderReport(req.body)
        .then((data) => new jobResponse("change order report created successfully", { data }, false))
        .catch((err) => new jobResponse(err.message, null, true))
    res.status(response.failed ? 400 : 200).json(response)
}

const createChangeOrderController = async (req, res) => {
    const response = await createChangeOrder(req.body)
        .then((data) => new jobResponse("change order created successfully", { data }, false))
        .catch((err) => new jobResponse(err.message, null, true))
    res.status(response.failed ? 400 : 200).json(response)
}

const updateChangeOrderController = async (req, res) => {
    const response = await updateChangeOrder(req.body)
        .then((data) => new jobResponse("change order updated successfully", { data }, false))
        .catch((err) => new jobResponse(err.message, null, true))
    res.status(response.failed ? 400 : 200).json(response)
}

const deleteChangeOrderController = async (req, res) => {
    const response = await deleteChangeOrder(req.query.id)
        .then((data) => new jobResponse("change order deleted successfully", { data }, false))
        .catch((err) => new jobResponse(err.message, null, true))
    res.status(response.failed ? 400 : 200).json(response)
}


module.exports = {
    getAllJobsController,
    CreateJobController,
    updateJobController,
    DeleteJobController,
    GetJObDetailsController,
    AwardJobController,
    getAwardedJobsController,
    patchAwardedJobController,
    getProjectDashboardJobsController,
    patchDashboardJobController,
    getJobActivities,
    getTotalNumberOfJobsController,
    getTotalNumberOfJAwardedjobsController,
    getFilterdJobsController,
    getFilterdAwardedJobsController,
    getFilterdProjectsController,
    getJobDashboardController,
    GenerateJobReportController,
    getMonthlyJobAnalyticsController,
    getMonthlyDashboardJobsAnalyticsController,
    getEmployeeSalesPerfomanceController,
    getRebarJobController,
    updateRebarJobController,
    getRebarJobListController,
    getRebarJobsController,
    getAllPendingJobsController,
    getSubmissionsController,
    createSubmissionsController,
    deleteSubmissionsController,
    getChangeOrdersController,
    createChangeOrderController,
    updateChangeOrderController,
    deleteChangeOrderController,
    createChangeOrdersController,
    generateDashboardReportController,
    generateSubmissionsReportController
}