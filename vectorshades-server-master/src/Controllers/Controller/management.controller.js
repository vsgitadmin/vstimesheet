const { createEmployeeActivationRequest, getAllEmpActivationRequests, ApproveEmployeeActivationRequests, getSingleActivationRequest, UpdateActivationRequest, sendEmpActivationreviewRequests, getTotalNumberofActivationRequests, getAllFilterdActivationReq } = require("../ControllerFunction/Management/index")
const { response: { employeeResponse } } = require("../../Classes/index")

const createEmpActivationRequestController = async (req, res) => {
    const response = await createEmployeeActivationRequest(req.body)
        .then((request) => new employeeResponse("employee request created", { id: request._id }, false))
        .catch((err) => new employeeResponse(err.message, null, true))
    res.status(response.failed ? 400 : 200).json(response)
}

const getAllEmpActivationRequestsController = async (req, res) => {
    const response = await getAllEmpActivationRequests(req.query.page)
        .then((requests) => new employeeResponse("all employee account activation request fetched", { requests: requests }, false))
        .catch((err) => new employeeResponse(err.message, null, true))
    res.status(response.failed ? 400 : 200).json(response)
}

const sendActivationReviewRequestsController = async (req, res) => {
    const response = await sendEmpActivationreviewRequests(req.body)
        .then((requests) => new employeeResponse("Activation review mail sent", { success: true }, false))
        .catch((err) => new employeeResponse(err.message, null, true))
    res.status(response.failed ? 400 : 200).json(response)
}

const UpdateEmpActivationRequestsController = async (req, res) => {
    const response = await UpdateActivationRequest(req.query.id, req.body)
        .then((requests) => new employeeResponse("employee activation request updated", { updatedId: requests._id }, false))
        .catch((err) => new employeeResponse(err.message, null, true))
    res.status(response.failed ? 400 : 200).json(response)
}

const getSingleActivationRequestController = async (req, res) => {
    const response = await getSingleActivationRequest(req.query)
        .then((request) => new employeeResponse("activation request fetched", { request: request }, false))
        .catch((err) => new employeeResponse(err.message, null, true))
    res.status(response.failed ? 400 : 200).json(response)
}

const approveEmployeeActivationRequestController = async (req, res) => {
    const response = await ApproveEmployeeActivationRequests(req.query.id)
        .then((requests) => new employeeResponse("employee account activated", { requests: requests }, false))
        .catch((err) => new employeeResponse(err.message, null, true))
    res.status(response.failed ? 400 : 200).json(response)
}

const getTotalNumberOfActivationRequestController = async (req, res) => {
    const response = await getTotalNumberofActivationRequests()
        .then((count) => new employeeResponse("success", { total: count }, false))
        .catch((err) => new employeeResponse(err.message, null, true))
    res.status(response.failed ? 400 : 200).json(response)
}

const getAllFilterdEmpActivationRequestsController = async (req, res) => {
    const response = await getAllFilterdActivationReq(req.query)
        .then((requests) => new employeeResponse(" account activation requests fetched", { requests: requests }, false))
        .catch((err) => new employeeResponse(err.message, null, true))
    res.status(response.failed ? 400 : 200).json(response)
}



module.exports = { createEmpActivationRequestController, sendActivationReviewRequestsController, getAllEmpActivationRequestsController, approveEmployeeActivationRequestController, getSingleActivationRequestController, UpdateEmpActivationRequestsController, getTotalNumberOfActivationRequestController, getAllFilterdEmpActivationRequestsController }