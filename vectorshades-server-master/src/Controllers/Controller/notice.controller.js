const { createNotice, deleteNotice, getNoticeByHR, getNoticeBYEmp,getTotalNumberOfNoticesByEmp,getTotalNumberOfNoticesByHr } = require('../ControllerFunction/notice/index')
const { response: { communicationResponse } } = require("../../Classes/index")

createNoticeController = async (req, res) => {
    const response = await createNotice({...req.body, ['createdByObj']:req.headers.data})
        .then((data) => new communicationResponse("notice created successfully", { data }, false))
        .catch((err) => new communicationResponse(err.message, null, true))
    res.status(response.failed ? 400 : 200).json(response)
}

getNoticeByEmpController = async (req, res) => {
    const response = await getNoticeBYEmp(req.headers.data.id, req.query.page , req.query.emp)
        .then((data) => new communicationResponse("notice fetched successfully", { data }, false))
        .catch((err) => new communicationResponse(err.message, null, true))
    res.status(response.failed ? 400 : 200).json(response)
}

getNoticeByHRController = async (req, res) => {
    const response = await getNoticeByHR(req.query.page)
        .then((data) => new communicationResponse("notice fetched successfully", { data }, false))
        .catch((err) => new communicationResponse(err.message, null, true))
    res.status(response.failed ? 400 : 200).json(response)
}

deleteNoticeController = async (req, res) => {
    const response = await deleteNotice(req.query.id)
        .then((data) => new communicationResponse("notice deleted successfully", { data }, false))
        .catch((err) => new communicationResponse(err.message, null, true))
    res.status(response.failed ? 400 : 200).json(response)
}


getTotalNoOfNoticesByEmpController = async (req, res) => {
    const response = await getTotalNumberOfNoticesByEmp(req.headers.data.id,)
        .then((data) => new communicationResponse("emp notice fetched successfully", { count:data }, false))
        .catch((err) => new communicationResponse(err.message, null, true))
    res.status(response.failed ? 400 : 200).json(response)
}

getTotalNoOfNoticesByHrController = async (req, res) => {
    const response = await getTotalNumberOfNoticesByHr()
        .then((data) => new communicationResponse("hr notice fetched successfully", { count:data }, false))
        .catch((err) => new communicationResponse(err.message, null, true))
    res.status(response.failed ? 400 : 200).json(response)
}

module.exports = {
    createNoticeController,
    getNoticeByEmpController,
    getNoticeByHRController,
    deleteNoticeController,
    getTotalNoOfNoticesByEmpController,
    getTotalNoOfNoticesByHrController
}
