const express = require("express")
const managementRoute = express.Router();
const { createEmpActivationRequestController, getAllEmpActivationRequestsController, sendActivationReviewRequestsController, approveEmployeeActivationRequestController, getSingleActivationRequestController, UpdateEmpActivationRequestsController, getTotalNumberOfActivationRequestController, getAllFilterdEmpActivationRequestsController } = require("../../Controllers/Controller/management.controller")

managementRoute.get('/get/activation/requests', getAllEmpActivationRequestsController);
managementRoute.post('/create/activation/request', createEmpActivationRequestController);
managementRoute.patch('/approve/account/activation/request', approveEmployeeActivationRequestController);
managementRoute.get('/get/activation/single', getSingleActivationRequestController)
managementRoute.patch('/update/activation', UpdateEmpActivationRequestsController)
managementRoute.get('/activation/get/totalcount', getTotalNumberOfActivationRequestController)
managementRoute.post('/send/activation/review', sendActivationReviewRequestsController);
managementRoute.get('/activation/filterd', getAllFilterdEmpActivationRequestsController)

module.exports = managementRoute;