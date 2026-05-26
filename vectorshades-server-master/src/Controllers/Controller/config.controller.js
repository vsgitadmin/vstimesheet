const { response: { configResponse } } = require("../../Classes/index")
const { getAllNotifications } = require("../ControllerFunction/Communication");
const {
    readConfigFunction, createConfigFunction, updateConfigFunction, deleteConfigFunction
} = require("../ControllerFunction/Config");

const readConfigController = async (req, res) => {
    const response = await readConfigFunction()
        .then((data) => new configResponse("config fetched successfully", { data }, true))
        .catch((err) => new configResponse(err.message, null, false))
    res.status(response.ok ? 200 : 400).json(response)
}

const createConfigController = async (req, res) => {
    const response = await createConfigFunction(req.body)
        .then((data) => new configResponse("config created successfully", { data }, true))
        .catch((err) => new configResponse("Error occured", err.message, true))
    res.status(response.ok ? 200 : 400).json(response)
}

const updateConfigController = async (req, res) => {
    const response = await updateConfigFunction(req.body)
        .then((data) => new configResponse("config updated successfully", { data }, true))
        .catch((err) => new configResponse(err.message, null, false))
    res.status(response.ok ? 200 : 400).json(response)
}

const deleteConfigController = async (req, res) => {
    const response = await deleteConfigFunction(req.query)
        .then((data) => new configResponse("config deleted successfully", { data }, true))
        .catch((err) => new configResponse(err.message, null, false))
    res.status(response.ok ? 200 : 400).json(response)
}

module.exports = { createConfigController, readConfigController, updateConfigController, deleteConfigController }

