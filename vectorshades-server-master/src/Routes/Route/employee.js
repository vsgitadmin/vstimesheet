const express = require("express")
const employeeRoute = express.Router();
const { getAllEmployeeController, getEmployeeProfileController, createEmployeeController, getEmployeePrivateDetailsController, getEmployeeDashboardController, getHRDashboardController, updateEmpByEmpController, deleteEmployeeController, validateAccountActivationIDController, getEmployeeDetailsController, getTotalNumberOfJobsController, FilterEmployeeController, getEmployeeDetailsSingleController, getEmployeeTodoController, createEmployeeTodoController, deleteEmployeeTodoController, editEmployeeTodoController, filterEmployeeTodoController, getEmployeeTodoCountController, createEmployeeActivitiesController, getSingleEmployeeActivitiesController, getAllEmployeeActivitiesController, updateEmployeeDetailsAndBasicDetailsController, getLatestEmployeeActvitiesController, getEmployeeWithUidController,
    updatePasswordController,
    requestUpdatePasswordController,
    updatePunchStatusController,
    getPunchStatsController,
    getAllEmployeesBasicDataController,
    getClientListController,
    generateTimerTokenController,
    getEmployeesWorkStatusController,
    updateEmployeeProfilePictureController
} = require("../../Controllers/Controller/employee.controller");

employeeRoute.get('/all', getAllEmployeeController);
employeeRoute.post('/create', createEmployeeController);
employeeRoute.post('/generate/timer/token', generateTimerTokenController);
employeeRoute.post('/update/public', updateEmpByEmpController);
employeeRoute.get('/get', getEmployeeDetailsController);
employeeRoute.get('/get/single', getEmployeeDetailsSingleController);
employeeRoute.get('/get/activation', validateAccountActivationIDController);
employeeRoute.get('/get/totalcount', getTotalNumberOfJobsController);
employeeRoute.get('/filterd', FilterEmployeeController);
employeeRoute.delete('/delete', deleteEmployeeController)
employeeRoute.get('/todo/all', getEmployeeTodoController);
employeeRoute.post('/todo/create', createEmployeeTodoController);
employeeRoute.delete('/todo/delete', deleteEmployeeTodoController);
employeeRoute.patch('/todo/edit', editEmployeeTodoController);
employeeRoute.get('/todo/filter', filterEmployeeTodoController);
employeeRoute.get('/hr/dashboard', getHRDashboardController);
employeeRoute.get('/dashboard', getEmployeeDashboardController);
employeeRoute.get('/profile', getEmployeeProfileController);
employeeRoute.post('/profile/picture', updateEmployeeProfilePictureController);
employeeRoute.get('/details', getEmployeePrivateDetailsController);
employeeRoute.get('/todo/count', getEmployeeTodoCountController)
employeeRoute.get('/activities/all', getAllEmployeeActivitiesController)
employeeRoute.get('/uid/verify', getEmployeeWithUidController)
employeeRoute.get("/activities/latest", getLatestEmployeeActvitiesController);
employeeRoute.post('/activities/create', createEmployeeActivitiesController)
employeeRoute.get('/activities/get', getSingleEmployeeActivitiesController)
employeeRoute.patch('/update', updateEmployeeDetailsAndBasicDetailsController)
employeeRoute.post('/update/password', updatePasswordController)
employeeRoute.post('/update/password/request', requestUpdatePasswordController)
employeeRoute.post('/update/punch', updatePunchStatusController)
employeeRoute.get('/get/punch', getPunchStatsController)
employeeRoute.get('/all', getAllEmployeeController);
employeeRoute.get('/get/employees/basic', getAllEmployeesBasicDataController)
employeeRoute.get('/get/clients', getClientListController)
employeeRoute.get('/get/work/status', getEmployeesWorkStatusController)

module.exports = employeeRoute;
