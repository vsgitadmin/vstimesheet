import instance from "../../Axios/Axios.config";
import {project} from "../../Constants/API/Endpoints"

const getAllProjectsController = async (query) => {
    try {
        const response = await instance.get(project.getAllProjects, { params: query })
        return response
    } catch (err) { throw err }
}
const getTotalNumberOfUserProjects = async () => {
    try {
        const response = await instance.get(project.getTotalNumberOfUserProjects)
        return response
    } catch (err) { throw err }
}

const createProjectController = async (body) => {
    try {
        const response = await instance.post(project.createProject, body)
        return response
    } catch (err) { throw err }
}

const getProjectSummaryController = async (query) => {
    try {
        const response = await instance.get(project.getSummary, { params: query })
        return response
    } catch (err) { throw err }
}

const getEmployeesController = async (query) => {
    try {
        const response = await instance.get(project.getEmployees, { params: query })
        return response
    } catch (err) { throw err }
}

const editSingleProjectController = async (body) => {
    try {
        const response = await instance.patch(project.editProject, body)
        return response
    } catch (err) { throw err }
}

const getSingleProjectController = async (query) => {
    try {
        const response = await instance.get(project.getSingleProject, { params: query })
        return response
    } catch (err) { throw err }
}

const searchProjectController = async (query) => {
    try {
        const response = await instance.get(project.searchProject, { params: query })
        return response
    } catch (err) { throw err }
}

const deleteProjectController = async (query) => {
    try {
        const response = await instance.delete(project.deleteProject, { params: query })
        return response
    } catch (err) { throw err }
}

const getAllTasksController = async (query) => {
    try {
        const response = await instance.get(project.getAllProjectTasks, { params: query })
        return response
    } catch (err) { throw err }
}

const createTaskController = async (body) => {
    try {
        const response = await instance.post(project.createProjectTask, body)
        return response
    } catch (err) { throw err }
}

const AssignTasksController = async (body, query) => {
    try {
        const response = await instance.post(project.assignProjectTask, body, { params: query })
        return response
    } catch (err) { throw err }
}

const removeProjectMembersController = async (query) => {
    try {
        const response = await instance.delete(project.removeMembers, { params: query })
        return response
    } catch (err) { throw err }
}

const getProjectMembersController = async (query) => {
    try {
        const response = await instance.get(project.getProjectMembers, { params: query })
        return response
    } catch (err) { throw err }
}

const getGeneralProjectController = async (query) => {
    try {
        const response = await instance.get(project.getGeneralProject)
        return response
    } catch (err) { throw err }
}

const editSingleTasksController = async (body, query) => {
    try {
        const response = await instance.patch(project.editProjectTask, body, { params: query })
        return response
    } catch (err) { throw err }
}

const getSingleTasksController = async (query) => {
    try {
        const response = await instance.get(project.getProjectTask, { params: query })
        return response
    } catch (err) { throw err }
}

const deleteTasksController = async (query) => {
    try {
        const response = await instance.delete(project.deleteProjectTask, { params: query })
        return response
    } catch (err) { throw err }
}

const AddProjectMembersController = async (body, query) => {
    try {
        const response = await instance.patch(project.addProjectMembers, body, { params: query })
        return response
    } catch (err) { throw err }
}

const getProjectTasksController = async (query) => {
    try {
        const response = await instance.get(project.getProjectTasks, { params: query })
        return response
    } catch (err) { throw err }
}

const getProjectTasksCountController = async (query) => {
    try {
        return instance.get(project.getProjectTasksCount, {params: query})
    } catch (err) { throw err }
}

const getProjectSectionsTasksCountController = async (query) => {
    try {
        return instance.get(project.getProjectSectionTasksCount, {params: query})
    } catch (err) { throw err }
}

const getProjectListAnalyticsController = async (body) => {
    try {
        const response = await instance.get(project.getProjectListAnalytics, body)
        return response
    } catch (err) { throw err }
}
const getProjectDashboardController = async (query) => {
    try {
        const response = await instance.get(project.getProjectDashboard, { params: query })
        return response
    } catch (err) { throw err }
}

const getAddableUsersController = async (query) => {
    try {
        const response = await instance.get(project.getAddableUsers, { params: query })
        return response
    } catch (err) { throw err }
}

const getFilteredProjectTasks = async (query) => {
    try {
        const response = await instance.get(project.getFilteredProjectTasks, { params: query })
        return response
    } catch (err) { throw err }
}

const getTaskActivityController = async (query) => {
    try {
        const response = await instance.get(project.getTaskActivity, { params: query })
        return response
    } catch (err) { throw err }
}

const refreshTaskHrsController = async (id) => {
    try {
        const response = await instance.post(project.refreshTaskHrs, { id })
        return response
    } catch (err) { throw err }
}

const createTaskActivityController = async (body, query) => {
    try {
        const response = await instance.post(project.createTaskActivity, body, { params: query })
        return response
    } catch (err) { throw err }
}


const updateTaskActivityController = async (body, query) => {
    try {
        const response = await instance.patch(project.updateTaskActivity, body, { params: query })
        return response
    } catch (err) { throw err }
}


const deleteTaskActivityController = async (query) => {
    try {
        const response = await instance.delete(project.deleteTaskActivity, { params: query })
        return response
    } catch (err) { throw err }
}

const completeProjectController = async (projectId) => {
    try {
        const response = await instance.patch(`${project.completeProject}?id=${projectId}`)
        return response
    } catch (err) {
        throw err
    }
}

const getAssignedTasksController = async (query) => {
    try {
        const response = await instance.get(project.getAssignedTasks, { params: query })
        return response
    } catch (err) {
        throw err
    }
}

const createProjectCloud = async (body) => {
    try {
        const response = await instance.post(project.createProjectCloud, body)
        return response
    } catch (err) {
        throw err
    }
}

const getAllProjectCloud = async (query) => {
    try {
        const response = await instance.get(project.getAllProjectCloud, { params: query })
        return response
    } catch (err) {
        throw err
    }
}
const deleteProjectCloudController = async (query) => {
    try {
        const response = await instance.delete(project.deleteProjectCloud, { params: query })
        return response
    } catch (err) {
        throw err
    }
}

const getProjectCloudAnalytics = async (query) => {
    try {
        const response = await instance.get(project.getProjectCloudAnalytics, { params: query })
        return response
    } catch (err) {
        throw err
    }
}

const getPinnedProjectCloudsController = async (query) => {
    try {
        const response = await instance.get(project.getPinnedProjects, { params: query })
        return response
    } catch (err) {
        throw err
    }
}

const searchProjectCloudController = async (query) => {
    try {
        const response = await instance.get(project.searchProjectCloud, { params: query })
        return response
    } catch (err) {
        throw err
    }
}

const toogleProjectCloudPinController = async (query) => {
    try {
        const response = await instance.patch(project.toogleProjectCloudPin, null, { params: query })
        return response
    } catch (err) {
        throw err
    }
}

const getEmployeePerformanceController = async (query) => {
    try {
        const response = await instance.get(project.getPerformance, { params: query })
        return response
    } catch (err) {
        throw err
    }
}

const toogleEmployeeRoleInProjectController = async (query) => {
    try {
        const response = await instance.patch(project.toogleEmployeeRoleInProject, null, { params: query })
        return response
    } catch (err) {
        throw err
    }
}

const getProjectListByAdminController = async (query) => {
    try {
        const response = await instance.get(project.getAllProjectsByAdmin, { params: query })
        return response
    } catch (err) {
        throw err
    }
}

const getProjectAdminDashboardController = async () => {
    try {
        const response = await instance.get(project.projectAdminDashboard)
        return response
    } catch (err) {
        throw err
    }
}

const createDrawingController = async ({name, deuDate, client, estimatedHour, projectId}) => {
    try {
        return await instance.post(project.createDrawing, {name, deuDate, client, estimatedHour, projectId})
    } catch (e) {
        throw e
    }
}

const updateDrawingController = async (data) => {
    try {
        return await instance.post(project.updateDrawing, data)
    } catch (e) {
        throw e
    }
}

const getAllDrawingController = async ({projectId}) => {
    try {
        return await instance.get(project.getAllDrawing, {params: {projectId}})
    } catch (e) {
        throw e
    }
}

const deleteDrawingController = async ({id}) => {
    try {
        return await instance.delete(project.deleteDrawing, {params: {id}})
    } catch (e) {
        throw e
    }
}

const getProjectStatsController = async ()=>{
    try {
        return await instance.get(project.getEmpStats)
    }catch (e){
        throw e
    }
}

const generateProjectReportsController = async (body)=>{
    try {
        return await instance.post(project.generateProjectReport,body)
    }catch (e){
        throw e
    }
}

export {
    getProjectStatsController,
    getAllProjectsController,
    createProjectController,
    getSingleProjectController,
    deleteProjectController,
    getAllTasksController,
    createTaskController,
    AssignTasksController,
    editSingleProjectController,
    getProjectMembersController,
    deleteTasksController,
    AddProjectMembersController,
    getSingleTasksController,
    editSingleTasksController,
    getEmployeesController,
    getProjectTasksController,
    getProjectListAnalyticsController,
    getProjectDashboardController,
    getAddableUsersController,
    getFilteredProjectTasks,
    removeProjectMembersController,
    getTaskActivityController,
    createTaskActivityController,
    updateTaskActivityController,
    deleteTaskActivityController,
    getProjectSummaryController,
    completeProjectController,
    getAssignedTasksController,
    createProjectCloud,
    getAllProjectCloud,
    getTotalNumberOfUserProjects,
    deleteProjectCloudController,
    getProjectCloudAnalytics,
    getPinnedProjectCloudsController,
    searchProjectCloudController,
    toogleProjectCloudPinController,
    searchProjectController,
    getEmployeePerformanceController,
    toogleEmployeeRoleInProjectController,
    getProjectAdminDashboardController,
    getProjectListByAdminController,
    getAllDrawingController,
    createDrawingController,
    updateDrawingController,
    deleteDrawingController,
    getProjectTasksCountController,
    generateProjectReportsController,
    getProjectSectionsTasksCountController,
    getGeneralProjectController,
    refreshTaskHrsController
}