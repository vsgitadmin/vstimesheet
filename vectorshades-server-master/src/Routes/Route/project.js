const express = require("express")
const projectsRoute = express.Router();
const {createProjectController,editSingleProjectController,RemoveMembersController,getProjectSummaryController,getProjectMembersController,getAllProjectsRawController,getAllProjectsByUserController,getProjectDashboardController,getAllProjectsTasksController,getProjectListDashboardAnalyticsController,getSingleProjectController,deleteProjectController, getAllTasksController, createTaskController, editSingleTasksController, getSingleTasksController, deleteTasksController, AssignTasksController, AddProjectMembersController, getAllEmployeesController,createActivityController, getAllActivitiesController, editSingleActivityController, deleteActivityController, getFilteredProjectTasksController, createTaskActivityController, getTaskActivityController, editTaskActivityController, deleteTaskActivityController,completeProjectController,getAssignedTasksController, createProjectCloudController, getAllProjectCloudDataController, deleteProjectCloudDataController, searchProjectCloudDataController,getTotalNumberOfProjectsByUserController,getProjectCloudAnalyticsController,pinProjectCloudController,getpinnedProjectCloudController, searchProjectCloudController, searchProjectController, getEmployeePerformanceController,toogleEmployeeRoleinProjectController, getProjectAdminDashboardController, getProjectListByAdminController,
    createDrawingController,
    updateDrawingController,
    getAllDrawingsController,
    deleteDrawingController,
    getAllProjectTasksCountController,
    getEmployeeProjectStatsController,
    generateProjectReportController,
    getAllProjectSectionTasksCountController,
    getEmployeeTimerTasksController,
    editSingleTimerTasksController,
    getGeneralProjectController,
    refreshTaskHrsController
} = require("../../Controllers/Controller/project.controller");

projectsRoute.get("/all",getAllProjectsByUserController)
projectsRoute.get("/all/raw",getAllProjectsRawController)
projectsRoute.post("/create",createProjectController)
projectsRoute.patch("/edit",editSingleProjectController)
projectsRoute.get("/single",getSingleProjectController)
projectsRoute.delete("/delete",deleteProjectController)
projectsRoute.get("/task/all",getAllTasksController)
projectsRoute.post("/task/create",createTaskController)
projectsRoute.post("/task/assign",AssignTasksController)
projectsRoute.patch("/task/edit",editSingleTasksController)
projectsRoute.post("/task/refresh/hrs",refreshTaskHrsController)
projectsRoute.patch("/timer/task/edit",editSingleTimerTasksController)
projectsRoute.get("/task/get",getSingleTasksController)
projectsRoute.delete("/task/delete",deleteTasksController)
projectsRoute.patch("/add/members",AddProjectMembersController)
projectsRoute.get("/get/employees",getAllEmployeesController)
projectsRoute.get("/get/tasks",getAllProjectsTasksController)
projectsRoute.get("/get/tasks/count",getAllProjectTasksCountController)
projectsRoute.get("/get/tasks/section/count",getAllProjectSectionTasksCountController)
projectsRoute.post("/activity/create", createActivityController)
projectsRoute.get("/activity/get/all", getAllActivitiesController)
projectsRoute.patch("/activity/edit", editSingleActivityController)
projectsRoute.delete("/activity/delete", deleteActivityController)
projectsRoute.get("/dashboard",getProjectDashboardController)
projectsRoute.get("/dashboard/list/analytics",getProjectListDashboardAnalyticsController)
projectsRoute.get("/filter/tasks",getFilteredProjectTasksController)
projectsRoute.get("/get/members",getProjectMembersController)
projectsRoute.delete("/remove/members",RemoveMembersController)
projectsRoute.post("/task/activity/create",createTaskActivityController)
projectsRoute.get("/task/activity/get",getTaskActivityController)
projectsRoute.patch("/task/activity/update",editTaskActivityController)
projectsRoute.delete("/task/activity/delete",deleteTaskActivityController)
projectsRoute.get("/timer/tasks",getEmployeeTimerTasksController)
projectsRoute.get("/summary",getProjectSummaryController)
projectsRoute.patch('/complete',completeProjectController)
projectsRoute.get('/task/assigned',getAssignedTasksController)
projectsRoute.post('/cloud/create',createProjectCloudController)
projectsRoute.get('/cloud/get',getAllProjectCloudDataController)
projectsRoute.delete('/cloud/delete',deleteProjectCloudDataController)
projectsRoute.get('/all/count',getTotalNumberOfProjectsByUserController)
projectsRoute.get('/cloud/get/analytics',getProjectCloudAnalyticsController)
projectsRoute.patch('/cloud/pin',pinProjectCloudController)
projectsRoute.get('/cloud/get/pinned',getpinnedProjectCloudController)
projectsRoute.get('/cloud/search',searchProjectCloudController)
projectsRoute.get('/search',searchProjectController)
projectsRoute.get('/employee/performance',getEmployeePerformanceController)
projectsRoute.patch('/toogle/employeerole',toogleEmployeeRoleinProjectController)
projectsRoute.get('/admin/dashboard',getProjectAdminDashboardController)
projectsRoute.get('/admin/projects',getProjectListByAdminController)
projectsRoute.post('/drawing/new',createDrawingController)
projectsRoute.post('/drawing/update',updateDrawingController)
projectsRoute.get('/general',getGeneralProjectController)
projectsRoute.get('/drawing/get',getAllDrawingsController)
projectsRoute.delete('/drawing/remove', deleteDrawingController)
projectsRoute.get("/get/stats",getEmployeeProjectStatsController)
projectsRoute.post("/generate/project/report",generateProjectReportController)

module.exports = projectsRoute