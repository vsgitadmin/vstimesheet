const express = require("express")
const {createConfigController, updateConfigController, readConfigController, deleteConfigController} = require("../../Controllers/Controller/config.controller");
const configRoute = express.Router();

configRoute.post("/create",createConfigController)
configRoute.post("/update",updateConfigController)
configRoute.get("/get",readConfigController)
configRoute.delete("/delete",deleteConfigController)

module.exports = configRoute