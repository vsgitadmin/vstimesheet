const express = require("express");
const { createNotificationsController, getAllNotificationsController, deleteNotificationsController, sendEmailController } = require("../../Controllers/Controller/communication.controller");
const communicationRoute = express.Router();

communicationRoute.post('/notification/create', createNotificationsController)
communicationRoute.get('/notification/get', getAllNotificationsController)
communicationRoute.patch('/notification/delete', deleteNotificationsController)
communicationRoute.post('/email/send', sendEmailController)

module.exports = communicationRoute