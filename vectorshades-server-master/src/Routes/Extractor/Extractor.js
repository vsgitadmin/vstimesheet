const employeeRoute = require("../Route/employee")
const managementRoute = require("../Route/management")
const authenticationRoute = require("../Route/authentication")
const jobsroute = require("../Route/jobs")
const timesheetRoute = require("../Route/timesheet")
const constantRoute = require('../Route/constants')
const fileRoutes = require('../Route/files');
const projectRoute = require('../Route/project');
const reportsRoute = require('../Route/reports');
const communicationRoute = require('../Route/communications');
const publicRoute = require("../Route/public");
const filterRoute = require('../Route/filters')
const cloudRoute = require('../Route/cloud');
const noticeRoute = require('../Route/notice');
const messagingRoute = require('../Route/messaging')
const reviewRoute = require('../Route/review')
const trainingRouter = require("../Route/training");
const rebarJobsRoute = require("../Route/rebar")
const billingRoute = require("../Route/billing")
const configRoute = require('../Route/config')

const AllRoutes = {
    employeeRoute,
    managementRoute,
    authenticationRoute,
    jobsroute,
    timesheetRoute,
    constantRoute,
    fileRoutes,
    projectRoute,
    reportsRoute,
    filterRoute,
    communicationRoute,
    publicRoute,
    cloudRoute,
    noticeRoute,
    messagingRoute,
    reviewRoute,
    trainingRouter,
    rebarJobsRoute,
    billingRoute,
    configRoute
}

module.exports = AllRoutes
