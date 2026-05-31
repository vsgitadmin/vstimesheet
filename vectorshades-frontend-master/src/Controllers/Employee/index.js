import instance from "../../Axios/Axios.config";
import { activationreq, employee, timesheet } from "../../Constants/API/Endpoints";

const getEmployeeController = async (token) => {
    try {
        instance.interceptors.request.clear()
        const employeeDetails = await instance.get(employee.getEmployee, { headers: { authorization: 'Bearer ' + token } })
        instance.interceptors.request.use(function (config) {
            config.headers.Authorization = 'Bearer ' + `${token}`
            return config;
        });
        return employeeDetails
    } catch (err) { throw err }
}

const getEmployeeUIDStatusController = async (id) => {
    try {
        const employeeDetails = await instance.get(employee.getEmployeeUIDStatus,{params:{id}})
        return employeeDetails
    } catch (err) { throw err }
}

const getEmployeeSingleController = async (id) => {
    try {
        const employeeDetails = await instance.get(`${employee.getEmployeeSingle}?id=${id}`)
        return employeeDetails
    } catch (err) { throw err }
}

const getEmployeeDashboardController = async (query) => {
    try {
        const employeeDetails = await instance.get(employee.employeeDashboard, { params: query })
        return employeeDetails
    } catch (err) { throw err }
}

const checkLogoutEligibilityController = async () => {
    try {
        return await instance.get('/auth/logout/check')
    } catch (err) { throw err }
}

const logoutEmployeeController = async () => {
    try {
        const logOut = await instance.post(`/auth/logout`, {})
        localStorage.clear()
        return logOut
    } catch (err) { throw err }
}

/** Check for in-progress tasks, then logout when clear. */
const performEmployeeLogoutController = async () => {
    const checkRes = await checkLogoutEligibilityController()
    const payload = checkRes?.data?.response
    if (!payload?.canLogout) {
        const err = new Error('Pause in-progress tasks before logging out')
        err.inProgressTasks = payload?.inProgressTasks || []
        err.blocked = true
        throw err
    }
    return logoutEmployeeController()
}

const updateEmployeeController = async (body) => {
    try {
        const employeeDetails = await instance.post(`${employee.updateEmployee}`, body)
        return employeeDetails
    } catch (err) { throw err }
}

const getLeaveCountController = async (query) => {
    try {
        const employeeDetails = await instance.get(`${timesheet.getLeaveCount}`, { params: query })
        return employeeDetails
    } catch (err) { throw err }
}

const getEmployeeByActivationIdController = async (id) => {
    try {
        const employeeDetails = await instance.get(`${employee.getEmployeeByActivation}?id=${id}`)
        return employeeDetails
    } catch (err) { throw err }
}

const sendEmployeeActivationReviewController = async (body) => {
    try {
        const employeeDetails = await instance.post(activationreq.sendEmployeeActivationReview, body)
        return employeeDetails
    } catch (err) { throw err }
}

const getEmployeeLeaveController = async (query) => {
    try {
        const employeeDetails = await instance.get(`${timesheet.getEmployeeLeaveByEMP}`, { params: query })
        return employeeDetails
    } catch (err) { throw err }
}

const getEmployeeLeaveByHRController = async (query) => {
    try {
        const employeeDetails = await instance.get(`${timesheet.getEmployeeLeaveByHR}`, { params: query })
        return employeeDetails
    } catch (err) { throw err }
}


const getAllemployeesController = async (page) => {
    try {
        page = page || 1
        const response = await instance.get(`${employee.getallemployees}?page=${page}`)
        return response
    }
    catch (err) { throw err }
}

const getEmployeeTimeSheetController = async (id) => {
    try {
        const response = await instance.get(`${timesheet.getEmployeeTimeSheet}?id=${id}`)
        return response
    } catch (err) { throw err }
}

const aggregateEmployeeTimeSheetController = async (query) => {
    try {
        const response = await instance.get(`${timesheet.aggregateTimesheet}`, { params: query })
        return response
    } catch (err) { throw err }
}


const CreateEmployeeController = async (data) => {
    try {
        const response = await instance.post(employee.postEmployee, data)
        return response
    }
    catch (err) { throw err }
}

const getTotalNumberOfEmployeeController = async () => {
    try {
        const response = await instance.get(employee.getTotalEmployeeCount)
        return response
    } catch (err) { throw err }
}


const getAllLeavesByHRController = async (query) => {
    try {
        const response = await instance.get(timesheet.getAllLeavesByHR, { params: query })
        return response
    } catch (err) { throw err }
}


const ApproveLeavesByHRController = async (id) => {
    try {
        const response = await instance.post(timesheet.approveLeaves, {}, { params: { id } })
        return response
    } catch (err) { throw err }
}

const filterEmployeeController = async (search) => {
    try {
        const response = await instance.get(`${employee.filterEmployee}?name=${search}&sortkey=-1`)
        return response
    } catch (err) { throw err }
}

const deleteEmployeeController = async (id) => {
    try {
        const response = await instance.delete(employee.deleteEmployee, { params: { id: id } })
        return response
    } catch (err) { throw err }
}

const getEmployeeTODOController = async () => {
    try {
        const response = await instance.get(employee.getEmployeeTODO)
        return response
    } catch (err) { throw err }
}

const createEmployeeTODOController = async (body) => {
    try {
        const response = await instance.post(employee.createEmployeeTODO, body)
        return response
    } catch (err) { throw err }
}

const deleteEmployeeTODOController = async (id) => {
    try {
        const response = await instance.delete(employee.deleteEmployeeTODO, { params: { id: id } })
        return response
    } catch (err) { throw err }
}

const editEmployeeTODOController = async (body) => {
    try {
        const response = await instance.patch(employee.editEmployeeTODO, body)
        return response
    } catch (err) { throw err }
}

const filterEmployeeTODOController = async (query) => {
    try {
        const response = await instance.get(employee.filterEmployeeTODO, { params: query })
        return response
    } catch (err) { throw err }
}
const getEmployeeHRDashboardController = async (query) => {
    try {
        const response = await instance.get(employee.getEmployeeHRDashboard, { params: query })
        return response
    } catch (err) { throw err }
}

const getEmployeeProfileController = async (query) => {
    try {
        const response = await instance.get(employee.getProfile, { params: query })
        return response
    } catch (err) { throw err }
}

const generateTimerTokenController = async (query) => {
    try {
        const response = await instance.post(employee.generateTimerToken)
        return response
    } catch (err) { throw err }
}

const getEmployeeSingleTimeSheetActivity = async (query) => {
    try {
        const response = await instance.get(`${timesheet.getSingleTimeSheetActivityLog}?id=${query.id}&date=${query.date}`)
        return response
    } catch (err) { throw err }
}

const getEmployeeBasicDetailsController = async (query) => {
    try {
        const response = await instance.get(employee.basicDeatils, { params: query })
        return response
    } catch (err) { throw err }
}

const getEmployeeTODOCountController = async () => {
    try {
        const response = await instance.get(employee.getEmployeeTodoCount)
        return response
    } catch (err) { throw err }
}

const updateEmployeeWithBasicDataController = async (body, params) => {
    try {
        const response = await instance.patch(`${employee.updateEmployeeWithBasicData}?id=${params.id}`, body)
        return response
    } catch (err) { throw err }
}

const updateLeaveController = async (query, body) => {
    try {
        const response = await instance.patch(`${timesheet.updateLeave}?id=${query.id}`, body)
        return response
    } catch (err) { throw err }
}

const cancelLeaveController = async (query) => {
    try {
        const response = await instance.patch(timesheet.cancelLeave, null, { params: query })
        return response
    } catch (err) { throw err }
}

const getEmployeeWorkStatusController = async (query) => {
    try {
        const response = await instance.get(employee.getEmployeeWorkStatus, { params: query })
        return response
    } catch (err) { throw err }
}

const rejectLeaveController = async (query, message) => {
    try {
        const response = await instance.patch(timesheet.rejectLeave, { rejected: true, rejectionReason: message }, { params: query })
        return response
    } catch (err) { throw err }
}

const getSingleEmployeeActivity = async (query) => {
    try {
        const response = await instance.get(employee.getSingleEmployeeActivity, { params: query })
        return response
    } catch (err) { throw err }
}

const updatePasswordController = async (body) => {
    try {
        return await instance.post(employee.updatePassword, body)
    } catch (err) { throw err }
}

const requestUpdatePasswordController = async (body) => {
    try {
        return await instance.post(employee.requestUpdatePassword, body)
    } catch (err) { throw err }
}

const updatePunchStatus = async ({ status }) => {
    try {
        return await instance.post('/employee/update/punch', { status })
    } catch (e) { throw e }
}

const getPunchStats = async () => {
    try {
        return await instance.get('/employee/get/punch')
    } catch (e) { throw e }
}

const getAllBasicEmployees = async (query) => {
    try {
        return await instance.get(employee.getAllBasicEmployees, { params: query })
    } catch (e) { throw e }
}

const updateEmployeeProfilePictureController = async (body) => {
    try {
        return await instance.post(employee.updateProfilePicture, body)
    } catch (err) { throw err }
}

export {
    updatePunchStatus,
    getPunchStats,
    getSingleEmployeeActivity,
    getEmployeeTODOController,
    getEmployeeProfileController,
    getEmployeeBasicDetailsController,
    getEmployeeDashboardController,
    getEmployeeHRDashboardController,
    logoutEmployeeController,
    checkLogoutEligibilityController,
    performEmployeeLogoutController,
    filterEmployeeTODOController,
    deleteEmployeeTODOController,
    editEmployeeTODOController,
    createEmployeeTODOController,
    getEmployeeController,
    ApproveLeavesByHRController,
    getAllLeavesByHRController,
    deleteEmployeeController,
    getEmployeeLeaveController,
    sendEmployeeActivationReviewController,
    getLeaveCountController,
    getEmployeeLeaveByHRController,
    filterEmployeeController,
    updateEmployeeController,
    getEmployeeByActivationIdController,
    getEmployeeTimeSheetController,
    getAllemployeesController,
    CreateEmployeeController,
    getTotalNumberOfEmployeeController,
    getEmployeeSingleController,
    aggregateEmployeeTimeSheetController,
    getEmployeeSingleTimeSheetActivity,
    getEmployeeTODOCountController,
    updateEmployeeWithBasicDataController,
    updateLeaveController,
    cancelLeaveController,
    rejectLeaveController,
    updatePasswordController,
    requestUpdatePasswordController,
    getAllBasicEmployees,
    generateTimerTokenController,
    getEmployeeWorkStatusController,
    getEmployeeUIDStatusController,
    updateEmployeeProfilePictureController,
}
