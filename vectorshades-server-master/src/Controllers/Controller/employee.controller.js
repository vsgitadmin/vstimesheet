const { getAllEmployees, createEmployee, updateEmpByEmp, employeeDashboard, getEmployeeProfileData, fetchEmployeeAccountActivationID, fetchEmployeeAccountSingle, fetchEmployeeAccount, getTotalNumberofEmployee, FilterEmployees, deleteEmployee, createTODO, getEmployeeTODO, editEmployeeTODO, deleteEmployeeTODO, filterEmployeeTODO, getHRDashboard, getEmployeePrivateDetails, getEmployeeTodoCount, getEmployeeActivities, createEmployeeActivity, getSingleEmployeeActivities, updateEmployeeDetailsAndBasicDetails, getLatestEmployeeActivites, getEmployeeWithUid, updatePunchInStateFunction, getPunchStats, getAllEmployeesBasicData, getClientList, generateTimerToken, getWorkStats, updateEmployeeProfilePicture } = require("../ControllerFunction/Employees/index");
const { response: { employeeResponse } } = require("../../Classes/index")
const { updatePasswordFunction, requestUpdatePasswordFunction } = require("../ControllerFunction/Employees");

const getAllEmployeeController = async (req, res) => {
    const employees = await getAllEmployees(req.query.page);
    res.json(employees);
}

const createEmployeeController = async (req, res) => {
    const response = await createEmployee(req.body)
        .then((emp) => new employeeResponse("employee created", { id: emp._id, activation_id: emp.activationId }, false))
        .catch((err) => new employeeResponse(err.message, null, true))
    res.status(response.failed ? 400 : 200).json(response)
}

const generateTimerTokenController = async (req, res) => {
    const response = await generateTimerToken(req.headers.data.id)
        .then((token) => new employeeResponse("Token Generated", { token }, false))
        .catch((err) => new employeeResponse(err.message, null, true))
    res.status(response.failed ? 400 : 200).json(response)
}

const deleteEmployeeController = async (req, res) => {
    // Deletion cascades across every record tied to the employee, so it is
    // restricted to HR/Super Admin here regardless of the (currently disabled)
    // global role middleware - this endpoint is too destructive to leave open.
    if (!['HR', 'SA'].includes(req.headers.data?.role)) {
        return res.status(403).json(new employeeResponse("You do not have permission to delete an employee", null, true))
    }
    const response = await deleteEmployee(req.query.id)
        .then((emp) => new employeeResponse("employee deleted", { id: req.query.id }, false))
        .catch((err) => new employeeResponse(err.message, null, true))
    res.status(response.failed ? 400 : 200).json(response)
}

const validateAccountActivationIDController = async (req, res) => {
    const response = await fetchEmployeeAccountActivationID(req.query.id)
        .then((id) => new employeeResponse("employee data fetched by ID", { employee: id }, false))
        .catch((err) => new employeeResponse(err.message, null, true))
    res.status(response.failed ? 400 : 200).json(response)
}

const updateEmpByEmpController = async (req, res) => {
    const response = await updateEmpByEmp(req.body)
        .then((emp) => new employeeResponse("employee public details updated", { activationId: req.body.activationId }, false))
        .catch((err) => new employeeResponse(err.message, null, true))
    res.status(response.failed ? 400 : 200).json(response)
}

const getEmployeeDetailsController = async (req, res) => {
    const response = await fetchEmployeeAccount(req.headers.authorization)
        .then((emp) => new employeeResponse("employee details fetched", { emp: emp }, false))
        .catch((err) => new employeeResponse(err.message, null, true))
    res.status(response.failed ? 400 : 200).json(response)
}

const getEmployeeDetailsSingleController = async (req, res) => {
    const response = await fetchEmployeeAccountSingle(req.query.id)
        .then((emp) => new employeeResponse("employee details fetched", { emp: emp }, false))
        .catch((err) => new employeeResponse(err.message, null, true))
    res.status(response.failed ? 400 : 200).json(response)
}

const getTotalNumberOfJobsController = async (req, res) => {
    const response = await getTotalNumberofEmployee()
        .then((count) => new employeeResponse("success", { total: count }, false))
        .catch((err) => new employeeResponse(err.message, null, true))
    res.status(response.failed ? 400 : 200).json(response)
}

const FilterEmployeeController = async (req, res) => {
    const response = await FilterEmployees(req.query)
        .then((emps) => new employeeResponse("success", { data: emps }, false))
        .catch((err) => new employeeResponse(err.message, null, true))
    res.status(response.failed ? 400 : 200).json(response)
}

const createEmployeeTodoController = async (req, res) => {
    const response = await createTODO({ ...req.body, ['employeeId']: req.headers.data.id })
        .then((emps) => new employeeResponse("TO DO created successfully", { data: emps }, false))
        .catch((err) => new employeeResponse(err.message, null, true))
    res.status(response.failed ? 400 : 200).json(response)
}

const getEmployeeTodoController = async (req, res) => {
    const response = await getEmployeeTODO(req.headers.data.id)
        .then((emps) => new employeeResponse("TO DO fetched successfully", { data: emps }, false))
        .catch((err) => new employeeResponse(err.message, null, true))
    res.status(response.failed ? 400 : 200).json(response)
}

const deleteEmployeeTodoController = async (req, res) => {
    const response = await deleteEmployeeTODO(req.query.id)
        .then((emps) => new employeeResponse("TO DO deleted successfully", { data: emps }, false))
        .catch((err) => new employeeResponse(err.message, null, true))
    res.status(response.failed ? 400 : 200).json(response)
}

const editEmployeeTodoController = async (req, res) => {
    const response = await editEmployeeTODO(req.body)
        .then((emps) => new employeeResponse("TO DO updated successfully", { data: emps }, false))
        .catch((err) => new employeeResponse(err.message, null, true))
    res.status(response.failed ? 400 : 200).json(response)
}

const filterEmployeeTodoController = async (req, res) => {
    const response = await filterEmployeeTODO(req.query.filter, req.headers.data.id)
        .then((emps) => new employeeResponse("TO DO filtered successfully", { data: emps }, false))
        .catch((err) => new employeeResponse(err.message, null, true))
    res.status(response.failed ? 400 : 200).json(response)
}

const getHRDashboardController = async (req, res) => {
    const response = await getHRDashboard(req.headers.data.id)
        .then((data) => new employeeResponse("HR dashboard data fetched successfully", { data }, false))
        .catch((err) => new employeeResponse(err.message, null, true))
    res.status(response.failed ? 400 : 200).json(response)
}

const getEmployeeDashboardController = async (req, res) => {
    const response = await employeeDashboard(req.headers.data.id, req.query)
        .then((data) => new employeeResponse("EMP dashboard data fetched successfully", { data }, false))
        .catch((err) => new employeeResponse(err.message, null, true))
    res.status(response.failed ? 400 : 200).json(response)
}

const getEmployeeProfileController = async (req, res) => {
    const response = await getEmployeeProfileData(req.query.employee, req.query.month)
        .then((data) => new employeeResponse("EMP profile data fetched successfully", { data }, false))
        .catch((err) => new employeeResponse(err.message, null, true))
    res.status(response.failed ? 400 : 200).json(response)
}

const getEmployeePrivateDetailsController = async (req, res) => {
    const response = await getEmployeePrivateDetails(req.query)
        .then((data) => new employeeResponse("EMP basic details fetched successfully", { data }, false))
        .catch((err) => new employeeResponse(err.message, null, true))
    res.status(response.failed ? 400 : 200).json(response)
}

const getEmployeeTodoCountController = async (req, res) => {
    const response = await getEmployeeTodoCount(req.headers.data.id)
        .then((count) => new employeeResponse("TO DO COunt fetched successfully", { count }, false))
        .catch((err) => new employeeResponse(err.message, null, true))
    res.status(response.failed ? 400 : 200).json(response)
}

const getAllEmployeeActivitiesController = async (req, res) => {
    const response = await getEmployeeActivities(req.query)
        .then((data) => new employeeResponse("fetched successfully", { data }, false))
        .catch((err) => new employeeResponse(err.message, null, true))
    res.status(response.failed ? 400 : 200).json(response)
}

const getLatestEmployeeActvitiesController = async (req, res) => {
    const response = await getLatestEmployeeActivites(req.query.page, req.query.employee_id)
        .then((data) => new employeeResponse("Latest activities fetched", { data }, false))
        .catch((error) => new employeeResponse(error.message, null, true));
    res.status(response.failed ? 400 : 200).json(response);
};

const createEmployeeActivitiesController = async (req, res) => {
    const response = await createEmployeeActivity(req.body)
        .then((data) => new employeeResponse("success", { data }, false))
        .catch((err) => new employeeResponse(err.message, null, true))
    res.status(response.failed ? 400 : 200).json(response)
}

const getSingleEmployeeActivitiesController = async (req, res) => {
    const response = await getSingleEmployeeActivities(req.query)
        .then((data) => new employeeResponse("fetched successfully", { data }, false))
        .catch((err) => new employeeResponse(err.message, null, true))
    res.status(response.failed ? 400 : 200).json(response)
}

const updateEmployeeDetailsAndBasicDetailsController = async (req, res) => {
    const response = await updateEmployeeDetailsAndBasicDetails(req.body, req.query, req.headers.data)
        .then((data) => new employeeResponse("updated successfully", { data }, false))
        .catch((err) => new employeeResponse(err.message, null, true))
    res.status(response.failed ? 400 : 200).json(response)
}

const getEmployeeWithUidController = async (req, res) => {
    const response = await getEmployeeWithUid(req.query.id)
        .then((data) => new employeeResponse("employee UID status fetched successfully", { data }, false))
        .catch((err) => new employeeResponse(err.message, null, true))
    res.status(response.failed ? 400 : 200).json(response)
}

const updatePasswordController = async (req, res) => {
    const response = await updatePasswordFunction(req.body)
        .then((data) => new employeeResponse("Password updated successfully", null, false))
        .catch((err) => new employeeResponse(err.message, null, true))
    res.status(response.failed ? 400 : 200).json(response)
}

const requestUpdatePasswordController = async (req, res) => {
    const response = await requestUpdatePasswordFunction(req.body)
        .then((data) => new employeeResponse("Code send to your email", { data }, false))
        .catch((err) => new employeeResponse(err.message, null, true))
    res.status(response.failed ? 400 : 200).json(response)
}

const updatePunchStatusController = async (req, res) => {
    const response = await updatePunchInStateFunction(req.headers.data, req.body)
        .then((data) => new employeeResponse("Status updated", null, false))
        .catch((err) => new employeeResponse(err.message, null, true))
    res.status(response.failed ? 400 : 200).json(response)
}

const getPunchStatsController = async (req, res) => {
    const response = await getPunchStats(req.headers.data)
        .then((data) => new employeeResponse("Data fetched", { data }, false))
        .catch((err) => new employeeResponse(err.message, null, true))
    res.status(response.failed ? 400 : 200).json(response)
}

const getAllEmployeesBasicDataController = async (req, res) => {
    const response = await getAllEmployeesBasicData(req.query)
        .then((data) => new employeeResponse("Data fetched", { data }, false))
        .catch((err) => new employeeResponse(err.message, null, true))
    res.status(response.failed ? 400 : 200).json(response)
}

const getEmployeesWorkStatusController = async (req, res) => {
    const response = await getWorkStats(req.query)
        .then((data) => new employeeResponse("Data fetched", { data }, false))
        .catch((err) => new employeeResponse(err.message, null, true))
    res.status(response.failed ? 400 : 200).json(response)
}

const getClientListController = async (req, res) => {
    const response = await getClientList()
        .then((data) => new employeeResponse("Data fetched", { data }, false))
        .catch((err) => new employeeResponse(err.message, null, true))
    res.status(response.failed ? 400 : 200).json(response)
}

const updateEmployeeProfilePictureController = async (req, res) => {
    const response = await updateEmployeeProfilePicture(req.headers.data, req.body)
        .then((data) => new employeeResponse('Profile picture updated', { data }, false))
        .catch((err) => new employeeResponse(err.message, null, true))
    res.status(response.failed ? 400 : 200).json(response)
}

module.exports = {
    updatePunchStatusController,
    getAllEmployeeController,
    createEmployeeController,
    deleteEmployeeController,
    updateEmpByEmpController,
    validateAccountActivationIDController,
    getEmployeeDetailsController,
    getTotalNumberOfJobsController,
    FilterEmployeeController,
    getEmployeeDetailsSingleController,
    createEmployeeTodoController,
    getEmployeeTodoController,
    deleteEmployeeTodoController,
    editEmployeeTodoController,
    filterEmployeeTodoController,
    getHRDashboardController,
    getEmployeeDashboardController,
    getEmployeeProfileController,
    getEmployeePrivateDetailsController,
    getEmployeeTodoCountController,
    getAllEmployeeActivitiesController,
    createEmployeeActivitiesController,
    getSingleEmployeeActivitiesController,
    updateEmployeeDetailsAndBasicDetailsController,
    getLatestEmployeeActvitiesController,
    getEmployeeWithUidController,
    updatePasswordController,
    requestUpdatePasswordController,
    getPunchStatsController,
    getAllEmployeesBasicDataController,
    getClientListController,
    generateTimerTokenController,
    getEmployeesWorkStatusController,
    updateEmployeeProfilePictureController,
}
