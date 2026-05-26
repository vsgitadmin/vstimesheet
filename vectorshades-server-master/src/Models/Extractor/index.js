const {
    employeeModel,
    employeeTodoModel,
    employeeBasicDetailsModel,
    employeeActivityModel,
    employeeLogsModel
} = require("../Employee/index");
const { employeeActivationRequest } = require("../Management/index")
const {
    jobModel,
    awardedJobsModel,
    ProjectDashboardModel,
    jobActivitiesModel,
    rebarJobsModel
} = require("../Jobs/index");
const { attendenceModel, absenteesModel, timeSheetModel, timeSheetActivityModel } = require("../Timesheet");
const { projectModel, taskModel, activityModel, taskActivityModel, drawingModel } = require("../Projects/index");
const { reportModel, reportsCsvModel } = require("../Reports/index");
const { notificationModel } = require("../Communication/index");
const { cloudFilesModel, projectCloudModel } = require("../Cloud/index");
const { noticeModel } = require("../Notice/index")
const { employeeAnalyticsModel, employeeReviewsModel, reviewRequestsModel } = require("../../Models/Reviews/index")
const { TrainingModel } = require("../Training/index");
const RebarModels = require("../Rebar/index");
const { billingModel } = require('../Billing/index')
const { configModel } = require("../Config/index");
const { submissionsModel } = require("../Submissions/index")

const Models = {
    config: {
        configModel: configModel
    }, employee: {
        employeeModel, employeeTodoModel, employeeBasicDetailsModel, employeeActivityModel, employeeLogsModel
    }, management: {
        employeeActivationRequest, noticeModel
    }, jobs: {
        jobModel, awardedJobsModel, ProjectDashboardModel, jobActivitiesModel, rebarJobsModel
    }, rebarJobs: {
        jobModel: RebarModels.jobModel,
        awardedJobsModel: RebarModels.awardedJobsModel,
        ProjectDashboardModel: RebarModels.ProjectDashboardModel,
        jobActivitiesModel: RebarModels.jobActivitiesModel,
        rebarJobsModel: RebarModels.jobActivitiesModel
    }, timesheet: {
        attendenceModel, absenteesModel, timeSheetModel, timeSheetActivityModel
    }, projects: {
        projectModel, taskModel, taskActivityModel, activityModel, drawingModel
    }, reports: {
        reportModel, reportsCsvModel
    }, communication: {
        notificationModel
    }, cloud: {
        cloudFilesModel, projectCloudModel
    }, reviews: {
        employeeAnalyticsModel, employeeReviewsModel, reviewRequestsModel
    }, training: {
        TrainingModel,
    }, billing: {
        billingModel
    },
    submissions: {
        submissionsModel
    }
}

module.exports = Models