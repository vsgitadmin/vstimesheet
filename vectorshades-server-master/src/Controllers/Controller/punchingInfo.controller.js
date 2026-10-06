const { createPunchingInfo, getPunchingInfoList, getPunchingInfoById, updatePunchingInfo } = require("../ControllerFunction/PunchingInfo/index")
const { response: { employeeResponse } } = require("../../Classes/index")

const createPunchingInfoController = async (req, res) => {
    const response = await createPunchingInfo(req.body)
        .then((data) => new employeeResponse("Punching info created", { data }, false))
        .catch((err) => new employeeResponse(err.message, null, true))
    res.status(response.failed ? 400 : 200).json(response)
}

const getPunchingInfoListController = async (req, res) => {
    const response = await getPunchingInfoList(req.query)
        .then((data) => new employeeResponse("Punching info fetched", { data }, false))
        .catch((err) => new employeeResponse(err.message, null, true))
    res.status(response.failed ? 400 : 200).json(response)
}

const getPunchingInfoByIdController = async (req, res) => {
    const response = await getPunchingInfoById(req.params.id)
        .then((data) => new employeeResponse("Punching info fetched", { data }, false))
        .catch((err) => new employeeResponse(err.message, null, true))
    res.status(response.failed ? 400 : 200).json(response)
}

const updatePunchingInfoController = async (req, res) => {
    const response = await updatePunchingInfo(req.params.id, req.body)
        .then((data) => new employeeResponse("Punching info updated", { data }, false))
        .catch((err) => new employeeResponse(err.message, null, true))
    res.status(response.failed ? 400 : 200).json(response)
}

module.exports = { createPunchingInfoController, getPunchingInfoListController, getPunchingInfoByIdController, updatePunchingInfoController }
