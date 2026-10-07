const { employee: { employeeModel }, projects: { taskModel } } = require("../../../Models/Extractor/index")
const { auth: { encryptDataToJwt } } = require('../../../Helpers/Extractor/index');
const { timesheet: { timeSheetActivityModel } } = require('../../../Models/Extractor/index');
const { getDate } = require("../../../Helpers/Functions/General/getDate");
const { comparePassword } = require("../../../Helpers/Functions/General/crypter");
const { updatePunchInStateFunction } = require("../Employees");
const { taskActivityModel } = require("../../../Models/Projects");
const { editSingleTasks } = require("../Project");
const { computeInProgressHours } = require("../../../Helpers/Functions/General/timer");
const { employeeBasicDetailsModel, employeeLogsModel } = require("../../../Models/Employee");
const socketData = require("../../../Classes/Socket/index");
const { getWorkedSessionsForDay } = require("../../../Helpers/Functions/General/data");
const socketManager = socketData.getInstance();

const { generateWorkHours } = require("../../../Helpers/Functions/Cron/generateWorkHours");
const { formatTaskForClient } = require("../../../Helpers/Functions/Email/inProgressTasksReminder");

async function getInProgressTasksForEmployee(employeeId) {
    return taskModel
        .find({ status: 'In Progress', assignedTo: employeeId })
        .select('_id name projectId section taskIndex')
        .lean();
}

async function checkLogoutEligibility(emp) {
    const tasks = await getInProgressTasksForEmployee(emp.id);
    const inProgressTasks = tasks.map(formatTaskForClient);
    return {
        canLogout: inProgressTasks.length === 0,
        inProgressTasks,
    };
}

const validateUserloginDetails = async ({ type, email, pwd, token }) => {
    try {
        let queryObj = {};
        if (type == "cred") queryObj = { email: email }
        else queryObj = { loginToken: token }
        const user = await employeeModel.findOne(queryObj);
        if (!user.active && user.onBoarded && !user.working) throw new Error("Incorrect password")
        if (user !== null) {
            // let matchPassword = await comparePassword(pwd, user.pwd)
            if (user.pwd !== pwd) {
                throw new Error("Incorrect password")
            }
            const token = encryptDataToJwt({ id: user._id, email: user.email, role: user.role, name: user.firstName + " " + user.lastName });
            if (user.logedIn) {
                // if (user.logedDate) {
                //     const diffInMs = Math.abs(new Date() - user.logedDate);
                //     const diffInMins = parseFloat(((diffInMs / (1000 * 60))).toFixed(2))
                //     user.todayLoged = user.todayLoged + diffInMins
                //     console.log('login', user.email, user.todayLoged, new Date(), '+', user.logedDate)
                // }
                if (user.timer === true) {
                    const diffInMs = Math.abs(new Date() - user.lastTimerAt);
                    const diffInMins = parseFloat(((diffInMs / (1000 * 60))).toFixed(2))
                    await employeeModel.findByIdAndUpdate(
                        user._id,
                        { $inc: { taskTime: diffInMins }, $set: { lastTimerAt: new Date() } })
                    if (diffInMins > 1440) {
                        console.log('login Issue')
                        console.log(diffInMins, user.lastTimerAt, new Date())
                    }
                }
            }
            user.logedDate = new Date()
            user.logedIn = true
            user.online = true;
            await user.save();
            return token
        } else throw { message: "incorrect data" }
    } catch (err) { throw err; }
}

const logoutUser = async (emp) => {
    try {
        const user = await employeeModel.findOne({ _id: emp.id });
        let diffInMins;
        if (user.logedDate !== null) {
            const diffInMs = Math.abs(new Date() - user.logedDate);
            diffInMins = parseFloat(((diffInMs / (1000 * 60))).toFixed(2))
        } else diffInMins = 0
        if (emp.role === "EMP") {
            let currentActivity;
            currentActivity = await timeSheetActivityModel.findOne({ employeeId: emp.id, date: getDate() })
            if (!currentActivity) {
                currentActivity = await new timeSheetActivityModel({ employeeId: emp.id, date: getDate() }).save()
            }
            // const logs = activeTask.map((task) => {
            //     const TaskTInMs = Math.abs(new Date() - task.resumedAt);
            //     const TaskInHrs = TaskTInMs / (1000 * 60 * 60);
            //     return {
            //         name: task.name,
            //         taskId: task._id,
            //         workedTime: TaskInHrs,
            //         startTime: task.resumedAt,
            //         endTime: new Date(),
            //         automaticLogout: !user.online ? false : true,
            //         date: getDate()
            //     }
            // })
            // currentActivity.logs = [...logs, ...currentActivity.logs]
            // await Promise.all([
            //     taskModel.updateMany({ assignedTo: emp.id, status: 'In Progress' }, { $inc: { completedHours: roundedDiff } }),
            //     taskModel.updateMany({ assignedTo: emp.id, status: 'In Progress' }, { $set: { status: 'Paused' } })
            // ])
        }
        user.lastLogedOut = new Date()
        if (user.lastLogedOut && user.logedDate) {
            const LogIndiffInMs = Math.abs(user.lastLogedOut - user.logedDate);
            const LogIndiffInMins = parseFloat(((LogIndiffInMs / (1000 * 60))).toFixed(2))
            await employeeModel.findByIdAndUpdate(
                user.id,
                { $inc: { todayLoged: LogIndiffInMins } })
            console.log('logout', user.email, LogIndiffInMins, new Date(), '+', user.logedDate)

        }

        const { canLogout, inProgressTasks } = await checkLogoutEligibility({ id: user._id });
        if (!canLogout) {
            throw new Error(
                `Pause ${inProgressTasks.length} in-progress task(s) before logging out`
            );
        }
        user.online = false;
        user.socket = null;
        user.logedDate = null;
        user.logedIn = false
        await user.save()
        // await updatePunchInStateFunction({ id: user._id }, { status: false })
        return { message: "user logged out" }
    } catch (err) { throw err; }
}

function minutesToDecimalHours(totalMinutes, decimals = 2) {
    if (typeof totalMinutes !== 'number' || isNaN(totalMinutes)) {
        throw new TypeError('minutes must be a number');
    }
    const value = totalMinutes / 60;
    return Number(value.toFixed(decimals));
}

function hoursToMinutes(h, { round } = {}) {
    const v = typeof h === 'string' ? parseFloat(h.replace(/[^\d.-]/g, '')) : Number(h);
    if (Number.isNaN(v)) throw new TypeError('invalid hours');
    const mins = v * 60;
    if (round === 'round') return Math.round(mins);
    if (round === 'floor') return Math.floor(mins);
    if (round === 'ceil') return Math.ceil(mins);
    return Number(mins.toFixed(2));
}

async function logOutAllEmployees(body = {}) {
    // If verifyWorkHours is enabled, limit generation scope to avoid long-running requests.
    // This keeps the endpoint responsive while you debug edge cases.
    const verify = body && body.verifyWorkHours ? body.verifyWorkHours : null;
    const generationBody = { ...(body || {}) };
    if (verify && verify.employeeId) {
        generationBody.employeeIds = [String(verify.employeeId)];
        // If dates are provided, constrain start/end to that range.
        if (Array.isArray(verify.dates) && verify.dates.length) {
            const dates = verify.dates.map(String);
            generationBody.startDate = generationBody.startDate || dates[0];
            generationBody.endDate = generationBody.endDate || dates[dates.length - 1];
        }
    }

    const generation = await generateWorkHours(generationBody);

    // Temporary verification helper for work-hours generation edge cases.
    // Enable by passing:
    // { verifyWorkHours: { employeeId, taskIndex, dates: ["DD-MM-YYYY", ...] } }
    try {
        if (!verify) return generation;

        const employeeId = verify.employeeId;
        const taskIndex = verify.taskIndex;
        const dates = Array.isArray(verify.dates) ? verify.dates : [];

        if (!employeeId || !taskIndex || dates.length === 0) {
            return {
                ...generation,
                verifyWorkHours: {
                    error: 'Missing verifyWorkHours.employeeId, verifyWorkHours.taskIndex, or verifyWorkHours.dates[]',
                }
            };
        }

        const task = await taskModel.findOne({ taskIndex: Number(taskIndex) }).select('_id taskIndex name assignedTo status').lean();
        const taskId = task ? String(task._id) : null;

        const activityDocs = await timeSheetActivityModel.find({
            employeeId: String(employeeId),
            date: { $in: dates.map(String) }
        }).select('date employeeId logs').lean();

        // Pull only the target task log entries for easier inspection.
        const activityByDate = (activityDocs || []).map((doc) => ({
            date: doc.date,
            employeeId: doc.employeeId,
            taskLogs: taskId ? (Array.isArray(doc.logs) ? doc.logs.filter((l) => String(l.taskId) === taskId) : []) : [],
            logsCount: Array.isArray(doc.logs) ? doc.logs.length : 0,
        }));

        const parseDdMmYyyyToUtcStart = (dateStr) => {
            const parts = String(dateStr).split('-').map((n) => Number(n));
            if (parts.length !== 3) return null;
            const [dd, mm, yyyy] = parts;
            if (!dd || !mm || !yyyy) return null;
            return new Date(Date.UTC(yyyy, mm - 1, dd, 0, 0, 0, 0));
        };

        const starts = dates.map(parseDdMmYyyyToUtcStart).filter(Boolean);
        const minStart = starts.length ? new Date(Math.min(...starts.map((d) => d.getTime()))) : null;
        const maxStart = starts.length ? new Date(Math.max(...starts.map((d) => d.getTime()))) : null;
        const rangeStart = minStart ? new Date(minStart.getTime() - 24 * 60 * 60 * 1000) : null; // -1 day buffer
        const rangeEnd = maxStart ? new Date(maxStart.getTime() + 2 * 24 * 60 * 60 * 1000) : null;   // +2 days buffer

        let taskActivities = [];
        if (taskId && rangeStart && rangeEnd) {
            taskActivities = await taskActivityModel.find({
                taskId,
                'createdBy.id': String(employeeId),
                createdAt: { $gte: rangeStart, $lte: rangeEnd }
            }).select('createdAt text createdBy type taskId projectId').sort({ createdAt: 1 }).lean();
        }

        return {
            ...generation,
            verifyWorkHours: {
                input: { employeeId: String(employeeId), taskIndex: Number(taskIndex), dates },
                task: task || null,
                timesheet_activity: activityByDate,
                taskActivity: taskActivities,
                note: 'timesheet_activity.taskLogs should contain entries for the task on each day if cross-day splitting is working.',
            }
        };
    } catch (e) {
        return {
            ...generation,
            verifyWorkHours: { error: e && e.message ? e.message : String(e) }
        };
    }
}

module.exports = {
    validateUserloginDetails,
    logoutUser,
    logOutAllEmployees,
    checkLogoutEligibility,
}
