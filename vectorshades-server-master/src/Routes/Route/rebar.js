const express = require("express")
const rebarJobsRoute = express.Router();
const { getAllJobsController, CreateJobController,getAllPendingJobsController, patchDashboardJobController, GenerateJobReportController, getJobDashboardController, getMonthlyJobAnalyticsController, getMonthlyDashboardJobsAnalyticsController, updateJobController, DeleteJobController, GetJObDetailsController, AwardJobController, getAwardedJobsController, patchAwardedJobController, getProjectDashboardJobsController, getJobActivities, getTotalNumberOfJobsController, getTotalNumberOfJAwardedjobsController, getFilterdJobsController, getFilterdAwardedJobsController, getFilterdProjectsController, getEmployeeSalesPerfomanceController , getRebarJobController , updateRebarJobController, getRebarJobListController, getRebarJobsController, getChangeOrdersController, createChangeOrderController, updateChangeOrderController, deleteChangeOrderController} = require("../../Controllers/Controller/rebar.controller")

rebarJobsRoute.get('/all', getAllJobsController);
rebarJobsRoute.get('/pending/all', getAllPendingJobsController);
rebarJobsRoute.post('/create', CreateJobController);
rebarJobsRoute.patch('/update', updateJobController);
rebarJobsRoute.delete('/delete', DeleteJobController);
rebarJobsRoute.get('/details', GetJObDetailsController);
rebarJobsRoute.post('/award/job', AwardJobController);
rebarJobsRoute.get('/get/awarded/all', getAwardedJobsController);
rebarJobsRoute.get('/get/dashboard/all', getProjectDashboardJobsController);
rebarJobsRoute.patch('/awarded/update', patchAwardedJobController);
rebarJobsRoute.patch('/dashboard/update', patchDashboardJobController)
rebarJobsRoute.get('/activity', getJobActivities)
rebarJobsRoute.get('/get/totalcount', getTotalNumberOfJobsController)
rebarJobsRoute.get('/awarded/totalcount', getTotalNumberOfJAwardedjobsController)
rebarJobsRoute.get('/filterd', getFilterdJobsController)
rebarJobsRoute.get('/awarded/filterd', getFilterdAwardedJobsController)
rebarJobsRoute.get('/dashboard/filterd', getFilterdProjectsController)
rebarJobsRoute.post('/create/report', GenerateJobReportController)
rebarJobsRoute.get('/dashboard', getJobDashboardController)
rebarJobsRoute.get('/get/analytics', getMonthlyJobAnalyticsController)
rebarJobsRoute.get('/dashboard/get/analytics', getMonthlyDashboardJobsAnalyticsController)
rebarJobsRoute.get('/sales/perfomance', getEmployeeSalesPerfomanceController)
rebarJobsRoute.get('/rebar/get', getRebarJobController)
rebarJobsRoute.patch('/rebar/update', updateRebarJobController)
rebarJobsRoute.get('/rebar/list',getRebarJobListController)
rebarJobsRoute.get('/rebar/all',getRebarJobsController)
rebarJobsRoute.get('/get/orders',getChangeOrdersController)
rebarJobsRoute.post('/create/orders',createChangeOrderController)
rebarJobsRoute.patch('/update/orders',updateChangeOrderController)
rebarJobsRoute.delete('/delete/orders',deleteChangeOrderController)



module.exports = rebarJobsRoute