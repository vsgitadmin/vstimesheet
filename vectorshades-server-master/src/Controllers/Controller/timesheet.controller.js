const { markAttendence, getAttendence, updateAttendence, getSingleAttendence, getLeaveCount, getAllLeavByHR, ApproveLeave, markLeave, updateLeave, deleteLeave, getLeaveDetails, getAllLeave, createTimesheet, getTimeSheet, getAllLeaveRaw, updateTimeSheet, aggregateTimeSheet, getTimeSheetActivities, updateTimeSheetActivity, deleteTimeSheetActivity, getSingleDayActivityTimeSheet, createLeaveRequest, deleteTimeSheet, fetchAllUserTimeSheets, forwardLeave, cancelLeave, validateLeave, fetchAllForwardedLeaves, rejectLeave } = require('../ControllerFunction/Timesheet/index')
const { response: { attendenceResponse } } = require('../../Classes/index')

const createAttendenceController = async (req, res) => {
    const response = await markAttendence({ ...req.body, employeeId: req.headers.data.id })
        .then((data) => new attendenceResponse("Attendence Marked", { date: data.date }, false))
        .catch((err) => new attendenceResponse("Attendence Mark Failed", err.message, true))
    res.status(response.failed ? 400 : 200).json(response)
}

const getAttendenceController = async (req, res) => {
    const response = await getAttendence(req.headers.data.id)
        .then((attendence) => new attendenceResponse("Attendence Fetched Successfully", { log: attendence }, false))
        .catch((err) => new attendenceResponse("Attendence Fetch Failed", err.message, true))
    res.status(response.failed ? 400 : 200).json(response)
}

const updateAttendenceController = async (req, res) => {
    const response = await updateAttendence(req.query.id, req.body)
        .then((updatedattendence) => new attendenceResponse("Attendence Updated Successfully", { date: updatedattendence.date }, false))
        .catch((err) => new attendenceResponse("Attendence Update Failed", err.message, true))
    res.status(response.failed ? 400 : 200).json(response)
}

const getSingleAttendenceController = async (req, res) => {
    const response = await getSingleAttendence(req.query.id)
        .then((details) => new attendenceResponse("Attendence Details Fetched Successfully", { details: details }, false))
        .catch((err) => new attendenceResponse("Attendence Details Fetch Failed ", err.message, true))
    res.status(response.failed ? 400 : 200).json(response)
}

const createLeaveController = async (req, res) => {
    const response = await createLeaveRequest({ ...req.body, employeeId: (req.body.employeeId || req.headers.data.id) })
        .then((data) => new attendenceResponse("Leave Marked", { id: data._id }, false))
        .catch((err) => new attendenceResponse("Leave Mark Failed ", err.message, true))
    res.status(response.failed ? 400 : 200).json(response)
}

const updateLeaveController = async (req, res) => {
    const response = await updateLeave(req.query.id, req.body)
        .then((leave) => new attendenceResponse("Leave Details Updated Successfully", { date: leave.date }, false))
        .catch((err) => new attendenceResponse("Leave Update Failed", err.message, true))
    res.status(response.failed ? 400 : 200).json(response)
}

const deleteLeaveController = async (req, res) => {
    const response = await deleteLeave(req.query.id, req.headers.data.role)
        .then((response) => new attendenceResponse("Leave Unmarked Successfully", { date: response.date }, false))
        .catch((err) => new attendenceResponse("Leave Unmark Failed", err, true))
    res.status(response.failed ? 400 : 200).json(response)
}

const getLeaveDetailsController = async (req, res) => {
    const response = await getLeaveDetails(req.query.id)
        .then((leave) => new attendenceResponse("Leave Details Fetched Successfully", { details: leave }, false))
        .catch((err) => new attendenceResponse("Leave Fetch Failed", err.message, true))
    res.status(response.failed ? 400 : 200).json(response)
}

const getLeaveCountController = async (req, res) => {
    const response = await getLeaveCount(req.query)
        .then((count) => new attendenceResponse("Leave Count Fetched Successfully", { count }, false))
        .catch((err) => new attendenceResponse("Leave Fetch Failed", err.message, true))
    res.status(response.failed ? 400 : 200).json(response)
}

const getAllLeaveController = async (req, res) => {
    const response = await getAllLeave(req.headers.data.id, req.query)
        .then((leave) => new attendenceResponse("Leave Details Fetched Successfully", { logs: leave }, false))
        .catch((err) => new attendenceResponse("Leave Fetch Failed", err.message, true))
    res.status(response.failed ? 400 : 200).json(response)
}

const getAllLeaveRawController = async (req, res) => {
    const response = await getAllLeaveRaw(req.query, req.query.page)
        .then((leave) => new attendenceResponse("Leave Details Fetched Successfully", { logs: leave }, false))
        .catch((err) => new attendenceResponse("Leave Fetch Failed", err.message, true))
    res.status(response.failed ? 400 : 200).json(response)
}

const createTimeSheetController = async (req, res) => {
    const response = await createTimesheet(req.body)
        .then((timeSheet) => new attendenceResponse("TimeSheet Created Successfully", { details: timeSheet }, false))
        .catch((err) => new attendenceResponse("TimeSheet Creation Failed", err.message, true))
    res.status(response.failed ? 400 : 200).json(response)
}

const getTimeSheetDetailsController = async (req, res) => {
    const response = await getTimeSheet(req.query.id)
        .then((timeSheet) => new attendenceResponse("TimeSheet Fetched Successfully", { log: timeSheet }, false))
        .catch((err) => new attendenceResponse("TimeSheet Fetch Failed", err.message, true))
    res.status(response.failed ? 400 : 200).json(response)
}

const updateTimeSheetDetailsController = async (req, res) => {
    const response = await updateTimeSheet(req.query.id, req.body)
        .then((timeSheet) => new attendenceResponse("TimeSheet Updayed Successfully", { data: timeSheet }, false))
        .catch((err) => new attendenceResponse("TimeSheet Fetch Failed", err.message, true))
    res.status(response.failed ? 400 : 200).json(response)
}


const getAllLeavesByHRController = async (req, res) => {
    const response = await getAllLeavByHR(req.query)
        .then((timeSheet) => new attendenceResponse("Leaves Fetched Successfully", { data: timeSheet }, false))
        .catch((err) => new attendenceResponse("Leaves Fetched Failed", err.message, true))
    res.status(response.failed ? 400 : 200).json(response)
}

const approveLeavesByHRController = async (req, res) => {
    const response = await ApproveLeave(req.query.id, req.headers.data.id)
        .then((timeSheet) => new attendenceResponse("Leaves Approved Successfully", { approved: true }, false))
        .catch((err) => new attendenceResponse("Leaves Approved Failed", err.message, true))
    res.status(response.failed ? 400 : 200).json(response)
}

const timeSheetAggreagateController = async (req, res) => {
    const response = await aggregateTimeSheet(req.query)
        .then((timeSheet) => new attendenceResponse("TimeSheets Fetched Successfully", { timesheets: timeSheet }, false))
        .catch((err) => new attendenceResponse("TimeSheet Fetch Failed", err.message, true))
    res.status(response.failed ? 400 : 200).json(response)
}

const getTimeSheetActivitiesController = async (req, res) => {
    const response = await getTimeSheetActivities(req.query)
        .then((timeSheet) => new attendenceResponse("TimeSheet Activities Fetched Successfully", { timesheets: timeSheet }, false))
        .catch((err) => new attendenceResponse("TimeSheet Fetch Failed", err.message, true))
    res.status(response.failed ? 400 : 200).json(response)
}

const updateTimeSheetActivityController = async (req, res) => {
    const response = await updateTimeSheetActivity(req.body)
        .then((timeSheet) => new attendenceResponse("TimeSheet Activity updated  Successfully", { timesheets: timeSheet }, false))
        .catch((err) => new attendenceResponse("TimeSheet update Failed", err.message, true))
    res.status(response.failed ? 400 : 200).json(response)
}

const deleteTimeSheetActivityController = async (req, res) => {
    const response = await deleteTimeSheetActivity(req.query)
        .then((timeSheet) => new attendenceResponse("TimeSheet Activities deleted   Successfully", { timesheets: timeSheet }, false))
        .catch((err) => new attendenceResponse("TimeSheet delete Failed", err.message, true))
    res.status(response.failed ? 400 : 200).json(response)
}

const getSingleTimeSheetActivityController = async (req, res) => {
    const response = await getSingleDayActivityTimeSheet(req.query)
        .then((timeSheet) => new attendenceResponse("TimeSheet Activity Fetched Successfully", { logs: timeSheet }, false))
        .catch((err) => new attendenceResponse("TimeSheet Fetch Failed", err.message, true))
    res.status(response.failed ? 400 : 200).json(response)
}

const deleteTimeSheetController = async (req, res) => {
    const response = await deleteTimeSheet(req.query)
        .then((timeSheet) => new attendenceResponse("TimeSheet Deleted Successfully", { data: timeSheet }, false))
        .catch((err) => new attendenceResponse("TimeSheet Fetch Failed", err.message, true))
    res.status(response.failed ? 400 : 200).json(response)
}

const fetchAllUserTimeSheetsController = async (req, res) => {
    const response = await fetchAllUserTimeSheets(req.headers.data.id)
        .then((timeSheet) => new attendenceResponse("TimeSheet Fetched Successfully", { data: timeSheet }, false))
        .catch((err) => new attendenceResponse("TimeSheet Fetch Failed", err.message, true))
    res.status(response.failed ? 400 : 200).json(response)
}

const forwardLeaveController = async (req, res) => {
    const response = await forwardLeave(req.body)
        .then((leave) => new attendenceResponse("Leave Forwarded  Successfully", { data: leave }, false))
        .catch((err) => new attendenceResponse("Leave Forwarded Failed", err.message, true))
    res.status(response.failed ? 400 : 200).json(response)
}

const cancelLeaveController = async (req, res) => {
    const response = await cancelLeave(req.query.id, req.headers.data.id)
        .then((leave) => new attendenceResponse("Leave Cancelled  Successfully", { data: leave }, false))
        .catch((err) => new attendenceResponse("Leave Forwarded Failed", err.message, true))
    res.status(response.failed ? 400 : 200).json(response)
}

const validateLeaveController = async (req, res) => {
    const response = await validateLeave(req.query, (req.query.employeeId || req.headers.data.id))
        .then((leave) => new attendenceResponse("Leave Validated ", { data: leave }, false))
        .catch((err) => new attendenceResponse("Leave Validation Failed", err.message, true))
    res.status(response.failed ? 400 : 200).json(response)
}

const fetchAllForwardedLeavesController = async (req, res) => {
    const response = await fetchAllForwardedLeaves(req.query, req.headers.data.id)
        .then((leave) => new attendenceResponse("Leaves fetched ", { data: leave }, false))
        .catch((err) => new attendenceResponse("Leave fetched", err.message, true))
    res.status(response.failed ? 400 : 200).json(response)
}

const rejectLeaveController = async (req, res) => {
    const response = await rejectLeave(req.query, req.body)
        .then((leave) => new attendenceResponse("Leave Rejected ", { data: leave }, false))
        .catch((err) => new attendenceResponse("Leave update failed", err.message, true))
    res.status(response.failed ? 400 : 200).json(response)
}

module.exports = {
    createAttendenceController,
    getAttendenceController,
    updateAttendenceController,
    getSingleAttendenceController,
    createLeaveController,
    updateLeaveController,
    approveLeavesByHRController,
    getAllLeavesByHRController,
    deleteLeaveController,
    getLeaveDetailsController,
    getAllLeaveController,
    createTimeSheetController,
    getTimeSheetDetailsController,
    updateTimeSheetDetailsController,
    timeSheetAggreagateController,
    getAllLeaveRawController,
    getLeaveCountController,
    getTimeSheetActivitiesController,
    updateTimeSheetActivityController,
    deleteTimeSheetActivityController,
    getSingleTimeSheetActivityController,
    deleteTimeSheetController,
    fetchAllUserTimeSheetsController,
    forwardLeaveController,
    cancelLeaveController,
    validateLeaveController,
    fetchAllForwardedLeavesController,
    rejectLeaveController
}