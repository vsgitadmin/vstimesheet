const employeeResponse = require("./Responses/employeeResponse.type");
const authResponse = require("./Responses/auth.type")
const jobResponse=require("../Classes/Responses/jobResponse.type");
const attendenceResponse = require("./Responses/attendence.type");
const ConstantResponse = require('../Classes/Responses/constant.type')
const projectResponse = require("../Classes/Responses/project.type");
const reportResponse = require("../Classes/Responses/reports.type");
const communicationResponse = require("../Classes/Responses/communication.type");
const cloudResponse = require("../Classes/Responses/cloud.type")
const TrainingResponse = require("./Responses/training.type");
const billingResponse = require("./Responses/billing.type");
const configResponse = require('./Responses/configResponse.type')
const backupResponse = require('./Responses/backup.type')

module.exports = {
    response:{
        employeeResponse,
        authResponse,
        jobResponse,
        attendenceResponse,
        ConstantResponse,
        projectResponse,
        reportResponse,
        cloudResponse,
        communicationResponse,
        TrainingResponse,
        billingResponse,
        configResponse,
        backupResponse
    }
}