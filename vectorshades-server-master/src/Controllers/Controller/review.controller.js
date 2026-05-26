const employeeResponse = require("../../Classes/Responses/employeeResponse.type")
const { createEmployeeReview, deleteEmployeeReview, getEmployeeReviewDetails, getEmployeeReviews, updateEmployeeReview,createReviewAnalytics,deleteEmployeeReviewAnalytics,getEmployeeReviewAnalytics,getReviewAnalyticsDetails,updateEmployeeReviewAnalytics, createReviewRequest, getReviewRequests, updateReviewRequests, deleteReviewRequest, getAllReviewRequests, getEmployeeAnalyticsOfSpecificYear, getAllIncommingReviewRequests, getReviewRequestById, generateYearlyAnalyticsEmployee } = require("../ControllerFunction/Review")

const createEmployeeReviewController = async (req, res) => {
    const response = await createEmployeeReview(req.body)
        .then((response) => new employeeResponse("Success", { data: response }, false))
        .catch((err) => new employeeResponse("Failed ", null, true))
    res.status(200).send(response)
}

const getEmployeeReviewsController = async (req, res) => {
    const response = await getEmployeeReviews(req.query,req.headers.data.id)
        .then((response) => new employeeResponse("Success", { data: response }, false))
        .catch((err) => new employeeResponse("Failed ", null, true))
    res.status(200).send(response)
}

const getEmployeeReviewDetailsController = async (req, res) => {
    const response = await getEmployeeReviewDetails(req.query)
        .then((response) => new employeeResponse("Success", { data: response }, false))
        .catch((err) => new employeeResponse("Failed ", null, true))
    res.status(200).send(response)
}

const deleteEmployeeReviewController = async (req, res) => {
    const response = await deleteEmployeeReview(req.query)
        .then((response) => new employeeResponse("Success", { data: response }, false))
        .catch((err) => new employeeResponse("Failed ", null, true))
    res.status(200).send(response)
}

const updateEmployeeReviewController = async (req, res) => {
    const response = await updateEmployeeReview(req.query, req.body)
        .then((response) => new employeeResponse("Success", { data: response }, false))
        .catch((err) => new employeeResponse("Failed ", null, true))
    res.status(200).send(response)
}

const createReviewAnalyticsController = async (req, res) => {
    const response = await  createReviewAnalytics(req.body)
        .then((response) => new employeeResponse("Success", { data: response }, false))
        .catch((err) => new employeeResponse("Failed ", null, true))
    res.status(200).send(response)
}

const deleteEmployeeReviewAnalyticsController = async (req, res) => {
    const response = await  deleteEmployeeReviewAnalytics(req.query)
        .then((response) => new employeeResponse("Success", { data: response }, false))
        .catch((err) => new employeeResponse("Failed ", null, true))
    res.status(200).send(response)
}

const getEmployeeReviewAnalyticsController = async (req, res) => {
    const response = await  getEmployeeReviewAnalytics(req.query)
        .then((response) => new employeeResponse("Success", { data: response }, false))
        .catch((err) => new employeeResponse("Failed ", null, true))
    res.status(200).send(response)
}

const getReviewAnalyticsDetailsController = async (req, res) => {
    const response = await  getReviewAnalyticsDetails(req.query)
        .then((response) => new employeeResponse("Success", { data: response }, false))
        .catch((err) => new employeeResponse("Failed ", null, true))
    res.status(200).send(response)
}

const updateEmployeeReviewAnalyticsController = async (req, res) => {
    const response = await  updateEmployeeReviewAnalytics(req.query,req.body)
        .then((response) => new employeeResponse("Success", { data: response }, false))
        .catch((err) => new employeeResponse("Failed ", null, true))
    res.status(200).send(response)
}

const createReviewRequestController = async (req, res) => {
    const response = await createReviewRequest(req.body)
        .then((response) => new employeeResponse("Success", { data: response }, false))
        .catch((err) => new employeeResponse("Failed ", null, true))
    res.status(200).send(response)
}

const getReviewRequestsController = async (req, res) => {
    const response = await  getReviewRequests()
        .then((response) => new employeeResponse("Success", { data: response }, false))
        .catch((err) => new employeeResponse("Failed ", null, true))
    res.status(200).send(response)
}

const updateReviewRequestsController = async (req, res) => {
    const response = await  updateReviewRequests(req.query,req.body)
        .then((response) => new employeeResponse("Success", { data: response }, false))
        .catch((err) => new employeeResponse("Failed ", null, true))
    res.status(200).send(response)
}

const deleteReviewRequestsController = async (req, res) => {
    const response = await  deleteReviewRequest(req.query)
        .then((response) => new employeeResponse("Success", { data: response }, false))
        .catch((err) => new employeeResponse("Failed ", null, true))
    res.status(200).send(response)
}

const getAllReviewRequestsController = async (req, res) => {
    const response = await  getAllReviewRequests()
        .then((response) => new employeeResponse("Success", { data: response }, false))
        .catch((err) => new employeeResponse("Failed ", null, true))
    res.status(200).send(response)
}

const getEmployeeAnalyticsOfSpecificYearController = async (req, res) => {
    const response = await  getEmployeeAnalyticsOfSpecificYear(req.query,req.headers.data.id)
        .then((response) => new employeeResponse("Success", { data: response }, false))
        .catch((err) => new employeeResponse("Failed ", null, true))
    res.status(200).send(response)
}

const getAllIncommingReviewRequestsController = async (req, res) => {
    const response = await  getAllIncommingReviewRequests(req.query,req.headers.data.id)
        .then((response) => new employeeResponse("Success", { data: response }, false))
        .catch((err) => new employeeResponse("Failed ", null, true))
    res.status(200).send(response)
}

const generateEmployeePerformanceController = async (req, res) => {
    const response = await generateYearlyAnalyticsEmployee(req.query)
        .then((response) => new employeeResponse("Success", { data: response }, false))
        .catch((err) => new employeeResponse("Failed ", null, true))
    res.status(200).send(response)
}

const getReviewRequestByIdController = async (req, res) => {
    const response = await  getReviewRequestById(req.query)
        .then((response) => new employeeResponse("Success", { data: response }, false))
        .catch((err) => new employeeResponse("Failed ", null, true))
    res.status(200).send(response)
}

module.exports = {
    createEmployeeReviewController,
    getEmployeeReviewsController,
    getEmployeeReviewDetailsController,
    updateEmployeeReviewController,
    deleteEmployeeReviewController, 
    createReviewAnalyticsController,
    deleteEmployeeReviewAnalyticsController,
    getReviewAnalyticsDetailsController,
    updateEmployeeReviewAnalyticsController,
    getEmployeeReviewAnalyticsController,
    createReviewRequestController,
    getReviewRequestsController,
    updateReviewRequestsController,
    deleteReviewRequestsController,
    getAllReviewRequestsController,
    getEmployeeAnalyticsOfSpecificYearController,
    getAllIncommingReviewRequestsController,
    getReviewRequestByIdController,
    generateEmployeePerformanceController
}