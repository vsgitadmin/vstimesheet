const express = require("express")
const jobsRoute = express.Router();
const { getAllJobsController, CreateJobController,getAllPendingJobsController, patchDashboardJobController, GenerateJobReportController, getJobDashboardController, getMonthlyJobAnalyticsController, getMonthlyDashboardJobsAnalyticsController, updateJobController, DeleteJobController, GetJObDetailsController, AwardJobController, getAwardedJobsController, patchAwardedJobController, getProjectDashboardJobsController, getJobActivities, getTotalNumberOfJobsController, getTotalNumberOfJAwardedjobsController, getFilterdJobsController, getFilterdAwardedJobsController, getFilterdProjectsController, getEmployeeSalesPerfomanceController , getRebarJobController , updateRebarJobController, getRebarJobListController, getRebarJobsController, createSubmissionsController, getSubmissionsController, deleteSubmissionsController, getChangeOrdersController, createChangeOrderController, updateChangeOrderController, deleteChangeOrderController, createChangeOrdersController, generateDashboardReportController, generateSubmissionsReportController} = require("../../Controllers/Controller/jobs.controller");

jobsRoute.get('/all', getAllJobsController);
jobsRoute.get('/pending/all', getAllPendingJobsController);
jobsRoute.post('/create', CreateJobController);
jobsRoute.patch('/update', updateJobController);
jobsRoute.delete('/delete', DeleteJobController);
jobsRoute.get('/details', GetJObDetailsController);
jobsRoute.post('/award/job', AwardJobController);
jobsRoute.get('/get/awarded/all', getAwardedJobsController);
jobsRoute.get('/get/dashboard/all', getProjectDashboardJobsController);
jobsRoute.patch('/awarded/update', patchAwardedJobController);
jobsRoute.patch('/dashboard/update', patchDashboardJobController)
jobsRoute.get('/activity', getJobActivities)
jobsRoute.get('/get/totalcount', getTotalNumberOfJobsController)
jobsRoute.get('/awarded/totalcount', getTotalNumberOfJAwardedjobsController)
jobsRoute.get('/filterd', getFilterdJobsController)
jobsRoute.get('/awarded/filterd', getFilterdAwardedJobsController)
jobsRoute.get('/dashboard/filterd', getFilterdProjectsController)
jobsRoute.post('/create/report', GenerateJobReportController)
jobsRoute.get('/dashboard', getJobDashboardController)
jobsRoute.get('/get/analytics', getMonthlyJobAnalyticsController)
jobsRoute.get('/dashboard/get/analytics', getMonthlyDashboardJobsAnalyticsController)
jobsRoute.get('/sales/perfomance', getEmployeeSalesPerfomanceController)
jobsRoute.get('/rebar/get', getRebarJobController)
jobsRoute.patch('/rebar/update', updateRebarJobController)
jobsRoute.get('/rebar/list',getRebarJobListController)
jobsRoute.get('/rebar/all',getRebarJobsController)
jobsRoute.delete('/submission/delete',deleteSubmissionsController)
jobsRoute.get('/submission/get',getSubmissionsController)
jobsRoute.post('/submission/create',createSubmissionsController)
jobsRoute.get('/get/orders',getChangeOrdersController)
jobsRoute.post('/create/orders',createChangeOrderController)
jobsRoute.patch('/update/orders',updateChangeOrderController)
jobsRoute.post('/dashboard/report/generate',generateDashboardReportController)
jobsRoute.post('/submission/report/generate',generateSubmissionsReportController)
jobsRoute.delete('/delete/orders',deleteChangeOrderController)
jobsRoute.post('/create/co/report',createChangeOrdersController)

module.exports = jobsRoute