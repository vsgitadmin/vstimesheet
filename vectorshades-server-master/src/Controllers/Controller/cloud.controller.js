const { createCloudFunction, getCloudFunction, deleteCloudFunction, searchCloud, forwardCloud, getAllPublicCloud, updateBulkFileFunction, getAllBulkBatchesFunction, getCloudCountFunction } = require("../ControllerFunction/Cloud/index")
const { response: { cloudResponse } } = require("../../Classes/index")
const { createBulkBatchFunction } = require("../ControllerFunction/Cloud");

const createCloudController = async (req, res) => {
    const response = await createCloudFunction({ ...req.body, employeeId: req.headers.data.id })
        .then((files) => new cloudResponse("cloud file created", { files }, false))
        .catch((err) => new cloudResponse(err.message, null, true))
    res.status(response.failed ? 400 : 200).json(response)
}

const getAllCloudDataController = async (req, res) => {
    const response = await getCloudFunction(req.query, req.headers.data.id)
        .then((files) => new cloudResponse("fetched Employee cloud", { files }, false))
        .catch((err) => new cloudResponse(err.message, null, true))
    res.status(response.failed ? 400 : 200).json(response)
}

const forwardCloudDataController = async (req, res) => {
    const response = await forwardCloud(req.query, req.body)
        .then((files) => new cloudResponse("Cloud File forwarded", { files }, false))
        .catch((err) => new cloudResponse(err.message, null, true))
    res.status(response.failed ? 400 : 200).json(response)
}

const getCloudCountController = async (req, res) => {
    const response = await getCloudCountFunction(req.query.id?req.query.id:req.headers.data.id)
        .then((count) => new cloudResponse("Cloud count fecthed", { count }, false))
        .catch((err) => new cloudResponse(err.message, null, true))
    res.status(response.failed ? 400 : 200).json(response)
}

const deleteCloudDataController = async (req, res) => {
    const response = await deleteCloudFunction(req.query.id)
        .then((files) => new cloudResponse("files deleted", { files }, false))
        .catch((err) => new cloudResponse(err.message, null, true))
    res.status(response.failed ? 400 : 200).json(response)
}

const searchCloudDataController = async (req, res) => {
    const response = await searchCloud(req.query, req.headers.data.id)
        .then((files) => new cloudResponse("filtered files", { files }, false))
        .catch((err) => new cloudResponse(err.message, null, true))
    res.status(response.failed ? 400 : 200).json(response)
}

const getAllPublicCloudDataController = async (req, res) => {
    const response = await getAllPublicCloud()
        .then((files) => new cloudResponse("fetched Employee cloud", { files }, false))
        .catch((err) => new cloudResponse(err.message, null, true))
    res.status(response.failed ? 400 : 200).json(response)
}

const createBulkBatchController = async (req, res) => {
    const response = await createBulkBatchFunction(req.body)
        .then((batch) => new cloudResponse("bulk batch created", batch, false))
        .catch((err) => new cloudResponse(err.message, null, true))
    res.status(response.failed ? 400 : 200).json(response)
}

const updateBulkFileController = async (req, res) => {
    const response = await updateBulkFileFunction(req.body)
        .then((batch) => new cloudResponse("bulk batch updated", batch, false))
        .catch((err) => new cloudResponse(err.message, null, true))
    res.status(response.failed ? 400 : 200).json(response)
}

const getAllBulkBatchesController = async (req, res) => {
    const response = await getAllBulkBatchesFunction()
        .then((batchs) => new cloudResponse("fecthed bulk batches successfully", batchs, false))
        .catch((err) => new cloudResponse(err.message, null, true))
    res.status(response.failed ? 400 : 200).json(response)
}

module.exports = { getCloudCountController, createCloudController, getAllCloudDataController, deleteCloudDataController, searchCloudDataController, forwardCloudDataController, getAllPublicCloudDataController, createBulkBatchController, updateBulkFileController, getAllBulkBatchesController }