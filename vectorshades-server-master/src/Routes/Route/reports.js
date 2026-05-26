const express = require("express")
const reportsRoute = express.Router();
const {createReportController,getReportsController,refreshReportsController,deleteReportsController,getReportKeysController,getTotalNumberOfReportsController,
    generateCsvReportController,
    getCsvReportController,
    generateReportsController,
    viewFileController,
    generateWorkHoursController,
    generateWorkHoursForEmployeeDayController
} = require("../../Controllers/Controller/reports.controller")

reportsRoute.post("/create",createReportController)
reportsRoute.get("/get/all",getReportsController)
reportsRoute.get("/get/file",viewFileController)
reportsRoute.get("/keys",getReportKeysController)
reportsRoute.patch("/refresh",refreshReportsController)
reportsRoute.delete("/delete",deleteReportsController)
reportsRoute.get('/get/totalcount',getTotalNumberOfReportsController)
reportsRoute.post("/generate",generateCsvReportController)
reportsRoute.post('/csv/generate',generateReportsController)
reportsRoute.get('/csv/get',getCsvReportController)
reportsRoute.post('/workhours/generate', generateWorkHoursController)
reportsRoute.post('/workhours/generate/day', generateWorkHoursForEmployeeDayController)

module.exports = reportsRoute