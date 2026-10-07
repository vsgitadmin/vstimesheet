const { createProject, getAllProjectsByUser, getAllProjectsRaw, getProjectSummary, RemoveProjectMembers, getProjectMembers, getSingleProject, editSingleProject, deleteSingleProject, checkProjectPermission, createTask, getAllTasks, getSingleTasks, editSingleTasks, deleteSingleTasks, AssignTasks, AddProjectMembersTasks, getAllEmployees, getAllProjectTasks, createActivity, getAllActivities, editSingleActivity, deleteSingleActivity, projectDashboardApi, projectListAnalytics, filterTasksProject, getTaskActivities, createtaskActivity, editTaskActivities, deleteTaskActivities, completeProject, getAssignedTasks, createProjectCloudFunction, getProjectCloudFunction, deleteProjectCloudFunction, getTotalNumberOfProjectsByUser, getProjectCloudAnalytics, pinProjectCloud, getPinnedProjectCloudFiles, searchProjectCloud, searchProject, employeePerformance, toogleEmployeeRoleinProject, getProjectAdminDashboardFunction, getProjectsByAdmin, employeePerformanceBySA, employeePerformanceByEMP, createDrawing, updateDrawing, getAllProjectTasksCount, getEmployeeProjectStatsFunction, generateProjectReports, generateProjectReportsFunction, getAllSectionsTasksCount, getEmployeeTimerTasksFunction, getGeneralProject, validateTimerToken, refreshTaskHrsFunction } = require("../ControllerFunction/Project/index")
const { response: { projectResponse } } = require("../../Classes/index")
const cloudResponse = require("../../Classes/Responses/cloud.type")
const { getAllDrawing, deleteDrawing } = require("../ControllerFunction/Project");
const { query } = require("express");

const createProjectController = async (req, res) => {
    const response = await createProject(req.body, req.headers.data)
        .then((data) => new projectResponse("project created successfully", { data }, false))
        .catch((err) => new projectResponse(err.message, null, true))
    res.status(response.failed ? 400 : 200).json(response)
}

const getAllProjectsByUserController = async (req, res) => {
    const response = await getAllProjectsByUser(req.body, req.query.page, req.headers.data.id, req.query, req.headers.data)
        .then((data) => new projectResponse(`all projects fetched for ${req.headers.data.name} successfully`, { data }, false))
        .catch((err) => new projectResponse(err.message, null, true))
    res.status(response.failed ? 400 : 200).json(response)
}

const getTotalNumberOfProjectsByUserController = async (req, res) => {
    const response = await getTotalNumberOfProjectsByUser(req.headers.data.id)
        .then((data) => new projectResponse(`Number of projects fetched successfully`, { count: data }, false))
        .catch((err) => new projectResponse(err.message, null, true))
    res.status(response.failed ? 400 : 200).json(response)
}

const getAllProjectsRawController = async (req, res) => {
    const response = await getAllProjectsRaw(req.query.page)
        .then((data) => new projectResponse("all projects fetched successfully", { data }, false))
        .catch((err) => new projectResponse(err.message, null, true))
    res.status(response.failed ? 400 : 200).json(response)
}

const getSingleProjectController = async (req, res) => {
    const response = await getSingleProject(req.query.id)
        .then((data) => new projectResponse("project fetched successfully", { data }, false))
        .catch((err) => new projectResponse(err.message, null, true))
    res.status(response.failed ? 400 : 200).json(response)
}

const searchProjectController = async (req, res) => {
    const response = await searchProject(req.headers.data, req.query.search)
        .then((data) => new projectResponse("project searched successfully", { data }, false))
        .catch((err) => new projectResponse(err.message, null, true))
    res.status(response.failed ? 400 : 200).json(response)
}

const editSingleProjectController = async (req, res) => {
    const response = await editSingleProject(req.body)
        .then((data) => new projectResponse("project updated successfully", { id: req.body.id }, false))
        .catch((err) => new projectResponse(err.message, null, true))
    res.status(response.failed ? 400 : 200).json(response)
}

const deleteProjectController = async (req, res) => {
    const response = await deleteSingleProject(req.query.id)
        .then((data) => new projectResponse("project deleted successfully", { data }, false))
        .catch((err) => new projectResponse(err.message, null, true))
    res.status(response.failed ? 400 : 200).json(response)
}

const createTaskController = async (req, res) => {
    checkProjectPermission(req.headers.data, req.body.projectId).then(async (data) => {
        const response = await createTask({ ...req.body, assignedBy: req.headers.data.id, assignedByName: req.headers.data.name, createdBy: req.headers.data.id })
            .then((data) => new projectResponse("task created successfully", { data }, false))
            .catch((err) => new projectResponse(err.message, null, true))
        res.status(response.failed ? 400 : 200).json(response)
    }).catch((err) => res.status(400).json(err))
}

const getAllTasksController = async (req, res) => {
    checkProjectPermission(req.headers.data, req.query.id).then(async (data) => {
        const response = await getAllTasks(req.query.id, req.query.page)
            .then((data) => new projectResponse("all tasks fetched successfully", { data }, false))
            .catch((err) => new projectResponse(err.message, null, true))
        res.status(response.failed ? 400 : 200).json(response)
    }).catch((err) => res.status(400).json(err))
}

const getSingleTasksController = async (req, res) => {
    checkProjectPermission(req.headers.data, req.query?.project ).then(async (data) => {
        const response = await getSingleTasks(req.query.index ? req.query.index : req.query.id, req.query.page , req.query.index ? 'index':'id')
            .then((data) => new projectResponse("task fetched successfully", { data }, false))
            .catch((err) => new projectResponse(err.message, null, true))
        res.status(response.failed ? 400 : 200).json(response)
    }).catch((err) => res.status(400).json(err))

}

const editSingleTasksController = async (req, res) => {
    checkProjectPermission(req.headers.data, req.query.project).then(async (data) => {
        const response = await editSingleTasks(req.body, req.headers.data,'++')
            .then((data) => new projectResponse("task updated successfully", { id: req.body.id }, false))
            .catch((err) => new projectResponse(err.message, null, true))
        res.status(response.failed ? 400 : 200).json(response)
    }).catch((err) => res.status(400).json(err))
}

const refreshTaskHrsController = async (req, res) => {
    const response = await refreshTaskHrsFunction(req.body.id)
        .then((data) => new projectResponse("task updated successfully", { id: req.body.id }, false))
        .catch((err) => new projectResponse(err.message, null, true))
    res.status(response.failed ? 400 : 200).json(response)
}

const getGeneralProjectController = async (req, res) => {
    const response = await getGeneralProject()
        .then((data) => new projectResponse("project fetched successfully", data, false))
        .catch((err) => new projectResponse(err.message, null, true))
    res.status(response.failed ? 400 : 200).json(response)
}

const editSingleTimerTasksController = async (req, res) => {
    const user = await validateTimerToken(req.body.user)
    const response = await editSingleTasks(req.body, { id: user._id },'++')
        .then((data) => new projectResponse("task updated successfully", { id: req.body.id }, false))
        .catch((err) => new projectResponse(err.message, null, true))
    res.status(response.failed ? 400 : 200).json(response)
}

const generateProjectReportController = async (req, res) => {
    const response = await generateProjectReportsFunction(req.body, req.headers.data)
        .then((data) => new projectResponse("project report generated successfully", data, false))
        .catch((err) => new projectResponse(err.message, null, true))
    res.status(response.failed ? 400 : 200).json(response)
}

const deleteTasksController = async (req, res) => {
    checkProjectPermission(req.headers.data, req.query.project).then(async (data) => {
        const response = await deleteSingleTasks(req.query.id)
            .then((data) => new projectResponse("task deleted successfully", { data }, false))
            .catch((err) => new projectResponse(err.message, null, true))
        res.status(response.failed ? 400 : 200).json(response)
    }).catch((err) => res.status(400).json(err))
}

const AssignTasksController = async (req, res) => {
    checkProjectPermission(req.headers.data, req.query.project).then(async (data) => {
        const response = await AssignTasks({ ...req.body, assignedBy: req.headers.data.id, assignedByName: req.headers.data.name })
            .then((data) => new projectResponse("task assigned successfully", { data }, false))
            .catch((err) => new projectResponse(err.message, null, true))
        res.status(response.failed ? 400 : 200).json(response)
    }).catch((err) => res.status(400).json(err))
}

const AddProjectMembersController = async (req, res) => {
    checkProjectPermission(req.headers.data, req.query.project).then(async (data) => {
        const response = await AddProjectMembersTasks({ ...req.body, id: req.query.project }, { addedBy: req.headers.data.name, id: req.headers.data.id })
            .then((data) => new projectResponse("members added successfully", { data }, false))
            .catch((err) => new projectResponse(err.message, null, true))
        res.status(response.failed ? 400 : 200).json(response)
    }).catch((err) => res.status(400).json(err))
}

const RemoveMembersController = async (req, res) => {
    checkProjectPermission(req.headers.data, req.query.project).then(async (data) => {
        const response = await RemoveProjectMembers(req.query.project, req.query.user)
            .then((data) => new projectResponse("members removed successfully", { data }, false))
            .catch((err) => new projectResponse(err.message, null, true))
        res.status(response.failed ? 400 : 200).json(response)
    }).catch((err) => res.status(400).json(err))
}

const getAllEmployeesController = async (req, res) => {
    const response = await getAllEmployees(req.query)
        .then((data) => new projectResponse("all employees fetched successfully", { data }, false))
        .catch((err) => new projectResponse(err.message, null, true))
    res.status(response.failed ? 400 : 200).json(response)
}

const getEmployeeTimerTasksController = async (req, res) => {
    const response = await getEmployeeTimerTasksFunction(req.headers.authorization)
        .then((data) => new projectResponse("all timer tasks fetched", { data }, false))
        .catch((err) => new projectResponse(err.message, null, true))
    res.status(response.failed ? 400 : 200).json(response)
}

const getAllProjectsTasksController = async (req, res) => {
    checkProjectPermission(req.headers.data, req.query.project).then(async (data) => {
        const response = await getAllProjectTasks(req.query.project, req.query.page, req.query.section)
            .then((data) => new projectResponse("all employees fetched successfully", { data }, false))
            .catch((err) => new projectResponse(err.message, null, true))
        res.status(response.failed ? 400 : 200).json(response)
    }).catch((err) => res.status(400).json(err))
}

const createActivityController = async (req, res) => {
    checkProjectPermission(req.headers.data, req.query.project).then(async (data) => {
        const response = await createActivity(req.body)
            .then((data) => new projectResponse("activity created successfully", { data }, false))
            .catch((err) => new projectResponse(err.message, null, true))
        res.status(response.failed ? 400 : 200).json(response)
    }).catch((err) => res.status(400).json(err))
}

const getAllActivitiesController = async (req, res) => {
    checkProjectPermission(req.headers.data, req.query.project).then(async (data) => {
        const response = await getAllActivities(req.query.project, req.query.page, req.query.type)
            .then((data) => new projectResponse("all activities fetched successfully", { data }, false))
            .catch((err) => new projectResponse(err.message, null, true))
        res.status(response.failed ? 400 : 200).json(response)
    }).catch((err) => res.status(400).json(err))
}

const getAllProjectTasksCountController = async (req, res) => {
    checkProjectPermission(req.headers.data, req.query.project).then(async (data) => {
        const response = await getAllProjectTasksCount(req.query.project, req.query.section)
            .then((count) => new projectResponse("Count fetched successfully", { count }, false))
            .catch((err) => new projectResponse(err.message, null, true))
        res.status(response.failed ? 400 : 200).json(response)
    }).catch((err) => { res.status(400).json(err) })
}

const getAllProjectSectionTasksCountController = async (req, res) => {
    checkProjectPermission(req.headers.data, req.query.project).then(async (data) => {
        const response = await getAllSectionsTasksCount(req.query.project, req.query.sections)
            .then((count) => new projectResponse("Count fetched successfully", { count }, false))
            .catch((err) => new projectResponse(err.message, null, true))
        res.status(response.failed ? 400 : 200).json(response)
    }).catch((err) => { res.status(400).json(err) })
}

const editSingleActivityController = async (req, res) => {
    checkProjectPermission(req.headers.data, req.query.project).then(async (data) => {
        const response = await editSingleActivity(req.body)
            .then((data) => new projectResponse("activity updated successfully", { id: req.body.id }, false))
            .catch((err) => new projectResponse(err.message, null, true))
        res.status(response.failed ? 400 : 200).json(response)
    }).catch((err) => res.status(400).json(err))
}

const deleteActivityController = async (req, res) => {
    checkProjectPermission(req.headers.data, req.query.project).then(async (data) => {
        const response = await deleteSingleActivity(req.query.id)
            .then((data) => new projectResponse("activity deleted successfully", { data }, false))
            .catch((err) => new projectResponse(err.message, null, true))
        res.status(response.failed ? 400 : 200).json(response)
    }).catch((err) => res.status(400).json(err))
}

const getProjectDashboardController = async (req, res) => {
    checkProjectPermission(req.headers.data, req.query.project).then(async (data) => {
        const response = await projectDashboardApi(req.headers.data.id, req.query.project)
            .then((data) => new projectResponse("dashboard data fetched successfully", { data }, false))
            .catch((err) => new projectResponse(err.message, null, true))
        res.status(response.failed ? 400 : 200).json(response)
    }).catch((err) => res.status(400).json(err))
}

const getProjectMembersController = async (req, res) => {
    checkProjectPermission(req.headers.data, req.query.project).then(async (data) => {
        const response = await getProjectMembers(req.query.project)
            .then((data) => new projectResponse("project members fetched", { data }, false))
            .catch((err) => new projectResponse(err.message, null, true))
        res.status(response.failed ? 400 : 200).json(response)
    }).catch((err) => res.status(400).json(err))
}

const getProjectListDashboardAnalyticsController = async (req, res) => {
    const response = await projectListAnalytics(req.headers.data)
        .then((data) => new projectResponse("project list analytics fetched successfully", { data }, false))
        .catch((err) => new projectResponse(err.message, null, true))
    res.status(response.failed ? 400 : 200).json(response)
}

const getProjectAdminDashboardController = async (req, res) => {
    const response = await getProjectAdminDashboardFunction()
        .then((data) => new projectResponse("project admin dashboard fetched", { data }, false))
        .catch((err) => new projectResponse(err.message, null, true))
    res.status(response.failed ? 400 : 200).json(response)
}

const getFilteredProjectTasksController = async (req, res) => {
    checkProjectPermission(req.headers.data, req.query.project).then(async (data) => {
        const response = await filterTasksProject(req.query.project, req.query.filter)
            .then((data) => new projectResponse("project tasks filtered successfully", { data }, false))
            .catch((err) => new projectResponse(err.message, null, true))
        res.status(response.failed ? 400 : 200).json(response)
    }).catch((err) => res.status(400).json(err))
}

const createTaskActivityController = async (req, res) => {
    checkProjectPermission(req.headers.data, req.query.project).then(async (data) => {
        const response = await createtaskActivity({ ...req.body, ['createdBy']: req.headers.data, ['projectId']: req.query.project })
            .then((data) => new projectResponse("Task Activity created successfully ", { data }, false))
            .catch((err) => new projectResponse(err.message, null, true))
        res.status(response.failed ? 400 : 200).json(response)
    }).catch((err) => res.status(400).json(err))
}

const getTaskActivityController = async (req, res) => {
    checkProjectPermission(req.headers.data, req.query.project).then(async (data) => {
        const response = await getTaskActivities(req.query.task, req.query.type)
            .then((data) => new projectResponse("task activity fetched successfully", { data }, false))
            .catch((err) => new projectResponse(err.message, null, true))
        res.status(response.failed ? 400 : 200).json(response)
    }).catch((err) => res.status(400).json(err))
}

const editTaskActivityController = async (req, res) => {
    checkProjectPermission(req.headers.data, req.query.project).then(async (data) => {
        const response = await editTaskActivities(req.query.id, req.body)
            .then((data) => new projectResponse("task activity updated successfully", { data }, false))
            .catch((err) => new projectResponse(err.message, null, true))
        res.status(response.failed ? 400 : 200).json(response)
    }).catch((err) => res.status(400).json(err))
}

const deleteTaskActivityController = async (req, res) => {
    checkProjectPermission(req.headers.data, req.query.project).then(async (data) => {
        const response = await deleteTaskActivities(req.query.id)
            .then((data) => new projectResponse("task activity deleted successfully", { data }, false))
            .catch((err) => new projectResponse(err.message, null, true))
        res.status(response.failed ? 400 : 200).json(response)
    }).catch((err) => res.status(400).json(err))
}

const getProjectSummaryController = async (req, res) => {
    const response = await getProjectSummary(req.query.project)
        .then((data) => new projectResponse("project summary fetched successfully", { data }, false))
        .catch((err) => new projectResponse(err.message, null, true))
    res.status(response.failed ? 400 : 200).json(response)
}

const getEmployeePerformanceController = async (req, res) => {
    // whichever controller actually runs determines the shape of the returned analytics
    // (cost-based fields for the SA view, hours-based fields for the EMP view) - the
    // reported `role` must track that choice so the frontend reads the matching fields
    const useSAView = req.headers.data.role !== 'PA' ? req.headers.data.role === 'SA' : req.query.metric === 'billing'
    const controller = useSAView ? employeePerformanceBySA : employeePerformanceByEMP
    const response = await controller(req.headers.data, req.query)
        .then((data) => new projectResponse("employee performance fetched successfully", { data, role: useSAView ? 'SA' : 'EMP' }, false))
        .catch((err) => new projectResponse(err.message, null, true))
    res.status(response.failed ? 400 : 200).json(response)
}

const completeProjectController = async (req, res) => {
    const response = await completeProject(req.query.id)
        .then((data) => new projectResponse("project marked as completed", { data }, false))
        .catch((err) => new projectResponse(err.message, null, true))
    res.status(response.failed ? 400 : 200).json(response)
}

const getAssignedTasksController = async (req, res) => {
    const response = await getAssignedTasks(req.headers.data.id, req.query.page, req.query.project,req?.query?.filter)
        .then((data) => new projectResponse("fetched assigned tasks ", { data }, false))
        .catch((err) => new projectResponse(err.message, null, true))
    res.status(response.failed ? 400 : 200).json(response)
}

const createProjectCloudController = async (req, res) => {
    const response = await createProjectCloudFunction({ ...req.body, employeeId: req.headers.data.id })
        .then((files) => new cloudResponse("project cloud  created", { files }, false))
        .catch((err) => new cloudResponse(err.message, null, true))
    res.status(response.failed ? 400 : 200).json(response)
}

const getAllProjectCloudDataController = async (req, res) => {
    const response = await getProjectCloudFunction(req.query)
        .then((files) => new cloudResponse("fetched Employee cloud", { files }, false))
        .catch((err) => new cloudResponse(err.message, null, true))
    res.status(response.failed ? 400 : 200).json(response)
}

const deleteProjectCloudDataController = async (req, res) => {
    const response = await deleteProjectCloudFunction(req.query.id)
        .then((files) => new cloudResponse("files deleted", { files }, false))
        .catch((err) => new cloudResponse(err.message, null, true))
    res.status(response.failed ? 400 : 200).json(response)
}

const getProjectCloudAnalyticsController = async (req, res) => {
    const response = await getProjectCloudAnalytics(req.query)
        .then((files) => new cloudResponse(" analytics fetched", { data: files }, false))
        .catch((err) => new cloudResponse(err.message, null, true))
    res.status(response.failed ? 400 : 200).json(response)
}

const pinProjectCloudController = async (req, res) => {
    const response = await pinProjectCloud(req.query)
        .then((files) => new cloudResponse("file pinned successfully", { data: files }, false))
        .catch((err) => new cloudResponse(err.message, null, true))
    res.status(response.failed ? 400 : 200).json(response)
}


const getpinnedProjectCloudController = async (req, res) => {
    const response = await getPinnedProjectCloudFiles(req.query)
        .then((files) => new cloudResponse(" pinned files fetched successfully", { data: files }, false))
        .catch((err) => new cloudResponse(err.message, null, true))
    res.status(response.failed ? 400 : 200).json(response)
}

const searchProjectCloudController = async (req, res) => {
    const response = await searchProjectCloud(req.query)
        .then((files) => new cloudResponse("  files fetched successfully", { data: files }, false))
        .catch((err) => new cloudResponse(err.message, null, true))
    res.status(response.failed ? 400 : 200).json(response)
}

const toogleEmployeeRoleinProjectController = async (req, res) => {
    const response = await toogleEmployeeRoleinProject(req.query, req.headers.data.id)
        .then((files) => new cloudResponse(" employee role changed successfully", { data: files }, false))
        .catch((err) => new cloudResponse(err.message, null, true))
    res.status(response.failed ? 400 : 200).json(response)
}

const getProjectListByAdminController = async (req, res) => {
    const response = await getProjectsByAdmin(req.query)
        .then((data) => new projectResponse("project list fetched successfully", { data }, false))
        .catch((err) => new projectResponse(err.message, null, true))
    res.status(response.failed ? 400 : 200).json(response)
}

const createDrawingController = async (req, res) => {
    const response = await createDrawing(req.body)
        .then((data) => new projectResponse("drawing created successfully", { data }, false))
        .catch((err) => new projectResponse(err.message, null, true))
    res.status(response.failed ? 400 : 200).json(response)
}

const updateDrawingController = async (req, res) => {
    const response = await updateDrawing(req.body)
        .then((data) => new projectResponse("drawing updated successfully", { data }, false))
        .catch((err) => new projectResponse(err.message, null, true))
    res.status(response.failed ? 400 : 200).json(response)
}

const getAllDrawingsController = async (req, res) => {
    const response = await getAllDrawing(req.query)
        .then((data) => new projectResponse("drawings fetched successfully", { data }, false))
        .catch((err) => new projectResponse(err.message, null, true))
    res.status(response.failed ? 400 : 200).json(response)
}

const deleteDrawingController = async (req, res) => {
    const response = await deleteDrawing(req.query)
        .then((data) => new projectResponse("drawing deleted successfully", { data }, false))
        .catch((err) => new projectResponse(err.message, null, true))
    res.status(response.failed ? 400 : 200).json(response)
}

const getEmployeeProjectStatsController = async (req, res) => {
    const response = await getEmployeeProjectStatsFunction()
        .then((data) => new projectResponse("stats fetched successfully", { data }, false))
        .catch((err) => new projectResponse(err.message, null, true))
    res.status(response.failed ? 400 : 200).json(response)
}


module.exports = {
    createProjectController,
    getAllProjectsByUserController,
    getSingleProjectController,
    editSingleProjectController,
    deleteProjectController,
    getProjectListByAdminController,
    getAllProjectsRawController,
    createTaskController,
    getAllTasksController,
    getSingleTasksController,
    editSingleTasksController,
    deleteTasksController,
    AssignTasksController,
    AddProjectMembersController,
    getAllEmployeesController,
    getAllProjectsTasksController,
    createActivityController,
    getAllActivitiesController,
    editSingleActivityController,
    deleteActivityController,
    getProjectDashboardController,
    getProjectListDashboardAnalyticsController,
    getFilteredProjectTasksController,
    getProjectMembersController,
    RemoveMembersController,
    createTaskActivityController,
    getTaskActivityController,
    editTaskActivityController,
    deleteTaskActivityController,
    getProjectSummaryController,
    completeProjectController,
    getAssignedTasksController,
    createProjectCloudController,
    getAllProjectCloudDataController,
    deleteProjectCloudDataController,
    getTotalNumberOfProjectsByUserController,
    getProjectCloudAnalyticsController,
    pinProjectCloudController,
    getpinnedProjectCloudController,
    searchProjectCloudController,
    searchProjectController,
    getEmployeePerformanceController,
    toogleEmployeeRoleinProjectController,
    getProjectAdminDashboardController,
    createDrawingController,
    updateDrawingController,
    deleteDrawingController,
    getAllDrawingsController,
    getGeneralProjectController,
    getAllProjectTasksCountController,
    getEmployeeProjectStatsController,
    generateProjectReportController,
    getAllProjectSectionTasksCountController,
    getEmployeeTimerTasksController,
    editSingleTimerTasksController,
    refreshTaskHrsController
}