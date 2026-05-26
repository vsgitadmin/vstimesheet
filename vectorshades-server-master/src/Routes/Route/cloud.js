const express = require("express");
const { createCloudController, getAllCloudDataController, deleteCloudDataController, searchCloudDataController, forwardCloudDataController,getAllPublicCloudDataController,
    createBulkBatchController,
    updateBulkFileController,
    getAllBulkBatchesController,
    getCloudCountController
} = require("../../Controllers/Controller/cloud.controller");
const cloudRoute = express.Router();

cloudRoute.post('/create', createCloudController)
cloudRoute.get('/get', getAllCloudDataController)
cloudRoute.get('/get/count', getCloudCountController)
cloudRoute.delete('/delete', deleteCloudDataController)
cloudRoute.get('/search', searchCloudDataController)
cloudRoute.post('/forward', forwardCloudDataController)
cloudRoute.get('/get/public', getAllPublicCloudDataController)
cloudRoute.post('/bulk/create', createBulkBatchController)
cloudRoute.post('/bulk/update/file', updateBulkFileController)
cloudRoute.get('/bulk/get', getAllBulkBatchesController)

module.exports = cloudRoute