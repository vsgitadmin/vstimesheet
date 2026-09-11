const {
    employee: { employeeModel, employeeTodoModel, employeeBasicDetailsModel, employeeActivityModel },
    timesheet: { absenteesModel, attendenceModel },
    management: { employeeActivationRequest },
    projects: { projectModel, taskModel }
} = require("../../../Models/Extractor/index")
const { auth: { JWTtoDecoder }, employee: { sendEmployeeActivationMail } } = require("../../../Helpers/Extractor/index");
const moment = require("moment");
const getBusinessDays = require("../../../Helpers/Functions/General/getBussinessDays");
const { getWeekSuffix } = require("../../../Helpers/Functions/General/getWeekSuffix");
const { randomInt } = require("crypto");
const { encryptPassword } = require("../../../Helpers/Functions/General/crypter");
const ForgotPasswordOtpTemplate = require("../../../Config/Templates/ForgotPasswordOtpTemplate");
const PasswordChangeSuccessTemplate = require("../../../Config/Templates/PasswordChangeSuccessTemplate");
const VerificationTemplate = require("../../../Config/Templates/VerificationTemplate");
const onboardingTemplate = require("../../../Config/Templates/OnboardingSuccessTemplate");
const clients = require("../../../Config/constants/clients")
const { refreshProjectMembersDetails } = require("../Project/index");
const sendEmail = require("../../../Helpers/Functions/Email/sendEmail");
const JWT_SECRET = process.env.JWT_SECRET;
var jwt = require('jsonwebtoken');
const { createNotification } = require("../Communication");
const ActivityTemplate = require("../../../Config/Templates/ActivityTemplate");
const { withEmailBanner } = require("../../../Helpers/Functions/General/emailBanner");
const ACTIVITIES_PER_PAGE = 20;
const {
    syncProfilePictureToEmployeeKey,
    setEmployeeProfileImageKey,
    employeeProfilePictureKey,
} = require('../../../Helpers/Functions/S3/profilePicture');

const getAllEmployees = (pageNumber) => {
    let page = pageNumber >= 1 ? pageNumber : 1;
    page = page - 1
    const empPerPage = 15
    const employees = employeeModel.find().limit(empPerPage).skip(page * empPerPage).sort({ created: -1 })
    return employees;
}


const createEmployee = async (body) => {
    try {
        const employeeWithUID = await employeeBasicDetailsModel
            .findOne({ uid: body.basicDetails.uid });
        const employeeExists = await employeeModel
            .findOne({ email: body.email });
        if (employeeWithUID != null || employeeExists !== null) {
            throw { message: "Employee with a same UID already exists. UID must be unique" };
        }

        body.publicDetails = {}
        body.rebar = body.department == "Rebar"
        await new employeeModel(body).save();
        const employee = await employeeModel.findOne({ email: body.email });
        await new employeeBasicDetailsModel({ ['employeeId']: employee._id, ...body.basicDetails }).save();
        // await createEmployeeActivity({
        //     text: 'New Employee Added',
        //     employeeId: employee._id,
        //     type: 'newentry',
        //     employeeName: employee.firstName + " " + employee.lastName
        // });
        body.activation = employee.activationId
        const to = employee.personalEmail || employee.email;
        const link = `https://tsm.vectorshades.com?id=${body.activation}`;
        try {
            await sendEmail(
                to,
                'Welcome to vectorshades - Complete Your Employee Verification',
                onboardingTemplate(await withEmailBanner({
                    link,
                    name: `${employee.firstName} ${employee.lastName}`,
                    email: employee.email
                }))
            )
        } catch (e) {
            // Do not fail employee creation just because SMTP failed.
            console.log('[onboarding-email] failed to send:', e && e.message ? e.message : e)
        }
        return employee;
    } catch (err) {
        throw err;
    }
}

const deleteEmployee = async (id) => {
    try {
        const response = await employeeModel.deleteOne({ _id: id })
        return response;
    } catch (err) {
        throw err;
    }
}

const updateEmpByEmp = async (body) => {
    try {
        const EmpByEmp = await employeeModel.findOneAndUpdate({ _id: body.id }, {
            publicDetails: body.data,
            active: true,
            working: true
        });
        const activities = getUpdateActivities(EmpByEmp.toObject(), body.data);
        // await createMultipleEmployeeActivities(activities);
        return EmpByEmp
    } catch (err) {
        throw err;
    }
}

function activityMessage(field, existing, updated) {
    switch (field) {
        case "firstName":
            return `Updated first name ${existing} to ${updated}.`
        case "lastName":
            return `Updated last name ${existing} to ${updated}.`;
        case "email":
            return `Updated E-mail address ${existing} to ${updated}.`;
        case "role":
            return `Role was updated to ${updated} from being ${existing}.`;
        case "personalEmail":
            return `Updated personal E-mail to ${updated}.`;
        case "designation":
            return `Designation was changed to ${updated} from ${existing}.`;
        case "department":
            return `Re-assigned department to ${updated}.`;
        case "pwd":
            return "Password was updated to a new one.";
        case "icon":
            return `Updated user icon`;
        case "active":
            return existing == true && updated == false ? "Employee became inactive." : existing == false && updated == true ? "Employee has been activated" : undefined;
        case "resigned":
            return updated == true ? `Resigned from the job.` : undefined;
        case "city":
            return `Updated city to ${updated} from ${existing}.`;
        case "salary":
            return `Salary has been changed from ${existing} to ${updated}.`;
        case "aadhar":
            return `Changed Aadhaar Card number to ${updated} from ${existing}.`;
        default:
            return;
    }
}

function getUpdateActivities(employee, changes) {
    const activities = [];
    const employeeName = (changes.firstName ?? employee.firstName) + " " + (changes.lastName ?? employee.lastName)

    for (const field of Object.keys(changes)) {
        const existing = employee[field], updated = changes[field];
        if (existing === updated) continue;
        const message = activityMessage(field, existing, updated);
        if (message == null) continue;
        activities.push({
            type: "updated-details", employeeId: employee._id, text: message, employeeName,
        });
    }

    return activities;
}

const updateEmployeeDetailsAndBasicDetails = async (body, params, authUser) => {
    try {
        if (authUser?.role !== 'HR' && body.role) {
            delete body.role;
        }
        body.rebar = body.department == "Rebar"
        const employee = await employeeModel.findByIdAndUpdate(params.id, { $set: { ...body, uid: body.basicDetails ? body.basicDetails.uid : '' } });
        const activities = getUpdateActivities(employee.toObject(), body);
        if (!("basicDetails" in body) || body.basicDetails == null) {
            // await createMultipleEmployeeActivities(activities);
            return employee;
        }
        delete body.basicDetails._id
        const updatedDetails = await employeeBasicDetailsModel
            .findOneAndUpdate({ employeeId: params.id }, { $set: body.basicDetails }, { new: true });
        // await createMultipleEmployeeActivities([...activities, ...getUpdateActivities(basicDetails.toObject(), body.basicDetails)]);
        const projects = await projectModel.find({ members: params.id });
        await Promise.resolve(projects.map((data) => refreshProjectMembersDetails(data._id)))
        return { employee, basicDetails: updatedDetails };
    } catch (error) {
        console.error(error);
        throw error;
    }
}

const fetchEmployeeAccountActivationID = async (id) => {
    try {
        const EmpID = await employeeModel.findOne({ activationId: id });
        const activation = await employeeActivationRequest.findOne({ empId: EmpID._id })
        return { emp: EmpID, activation };
    } catch (err) {
        throw err;
    }
}

const fetchEmployeeAccount = async (token) => {
    try {
        const tokenDecoded = await JWTtoDecoder(token.split(" ")[1]);
        const EmpID = await employeeModel.findOne({ _id: tokenDecoded.data.id });
        delete EmpID.pwd
        return EmpID;
    } catch (err) {
        throw err;
    }
}

const fetchEmployeeAccountSingle = async (id) => {
    try {
        const EmpID = await employeeModel.findOne({ _id: id });
        // delete EmpID.pwd
        return EmpID;
    } catch (err) {
        console.log(err)
        throw err;
    }
}

const getTotalNumberofEmployee = async () => {
    try {
        const count = await employeeModel.count()
        return count
    } catch (err) {
        throw err
    }
}

const FilterEmployees = async (query) => {
    try {
        const employees = await employeeModel.find({
            $or: [
                {
                    $expr: {
                        $regexMatch: {
                            input: { $toLower: "$firstName" },
                            regex: query.name.toLowerCase(),
                            options: "i"
                        }
                    }
                },
                {
                    $expr: {
                        $regexMatch: {
                            input: { $toLower: "$lastName" },
                            regex: query.name.toLowerCase(),
                            options: "i"
                        }
                    }
                },
                {
                    $expr: {
                        $regexMatch: {
                            input: { $toLower: "$email" },
                            regex: query.name.toLowerCase(),
                            options: "i"
                        }
                    }
                },
                {
                    $expr: {
                        $regexMatch: {
                            input: { $toLower: "$uid" },
                            regex: query.name.toLowerCase(),
                            options: "i"
                        }
                    }
                }
            ]
        }).sort({ created: query.sortkey });

        return employees;
    } catch (err) {
        throw err;
    }
};

const createTODO = async (body) => {
    try {
        const TODO = await new employeeTodoModel(body).save()
        return TODO
    } catch (err) {
        throw err
    }
}

const getEmployeeTODO = async (id) => {
    try {
        const TODO = await employeeTodoModel.find({ employeeId: id }).sort({ updatedAt: -1 })
        return TODO
    } catch (err) {
        throw err
    }
}

const deleteEmployeeTODO = async (id) => {
    try {
        const TODO = await employeeTodoModel.deleteOne({ _id: id })
        return TODO
    } catch (err) {
        throw err
    }
}

const editEmployeeTODO = async (body) => {
    try {
        body.updatedAt = new Date()
        const TODO = await employeeTodoModel.findOneAndUpdate({ _id: body._id }, { $set: body });
        return TODO
    } catch (err) {
        throw err
    }
}

const updateEmployeeProfilePicture = async (authUser, body) => {
    const targetId = body?.employeeId && ['HR', 'SA'].includes(authUser?.role)
        ? body.employeeId
        : authUser?.id;
    if (!targetId) throw new Error('Employee not found');

    const profileKey = body?.profileKey || employeeProfilePictureKey(targetId);
    return setEmployeeProfileImageKey(targetId, profileKey);
};

const getEmployeePrivateDetails = async (prop) => {
    try {
        if (prop.user) {
            const details = await employeeBasicDetailsModel.findOne({ employeeId: prop.user });
            const emp = await employeeModel.findOne({ _id: prop.user }).select('-pwd -publicDetails')
            return { details, emp }
        } else if (prop.uid) {
            const response = await employeeBasicDetailsModel.findOne({ uid: prop.uid })
            const emp = await employeeModel.findOne({ _id: response.employeeId }).select('-pwd -publicDetails')
            return { ...response._doc, personalEmail: emp.personalEmail }
        } else {
            throw new Error('invalid request')
        }
    } catch (err) {
        throw err
    }
}

const filterEmployeeTODO = async (title, user) => {
    try {
        const TODO = await employeeTodoModel.find({
            title: { $regex: title, $options: 'i' },
            employeeId: user
        }).sort({ createdAt: -1 });
        return { length: TODO.length, data: TODO }
    } catch (err) {
        throw err
    }
}

const employeeDashboard = async (user, query) => {
    try {
        if (query.id) user = query.id
        const startDate = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        const endDate = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);
        const daysInMonth = getBusinessDays()
        const dashboardYear = new Date().getFullYear();
        const yearRangeStart = new Date(dashboardYear, 0, 1);
        const yearRangeEndExclusive = new Date(dashboardYear + 1, 0, 1);
        const promises = [projectModel.find({ members: user }).countDocuments(), taskModel.find({ assignedTo: user }).countDocuments(), taskModel.find({
            status: 'Completed',
            assignedTo: user
        }).countDocuments(), taskModel.find({
            status: 'In Progress',
            assignedTo: user
        }).countDocuments(), absenteesModel.find({
            employeeId: user,
            createdAt: { $gte: startDate, $lte: endDate }
        }).select('endDate startDate'), attendenceModel.find({
            employeeId: user,
            date: { $gte: startDate, $lte: endDate }
        }).countDocuments(), attendenceModel.aggregate([{
            $match: {
                date: { $gte: yearRangeStart, $lt: yearRangeEndExclusive },
                employeeId: user
            }
        }, { $group: { _id: { year: { $year: "$date" }, month: { $month: "$date" } }, total: { $sum: 1 } } }]), taskModel.aggregate([{
            $match: {
                createdAt: { $gte: yearRangeStart, $lt: yearRangeEndExclusive },
                assignedTo: user
            }
        }, { $group: { _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } }, goal: { $sum: 1 } } }])];

        let totalLeaves = 0;

        const [totalProjects, totalTasks, completedTasks, inProgressTasks, totalLeaveData, totalAttendance, latestMonthsAttendenceRaw, monthlyAssignedTasks] = await Promise.all(promises);

        const monthSortKey = (y, m) => y * 100 + m;
        const attByMonth = new Map();
        for (const row of latestMonthsAttendenceRaw) {
            attByMonth.set(monthSortKey(row._id.year, row._id.month), row.total);
        }
        const tasksByMonth = new Map();
        for (const row of monthlyAssignedTasks) {
            tasksByMonth.set(monthSortKey(row._id.year, row._id.month), row.goal);
        }
        const latestMonthsAttendence = Array.from({ length: 12 }, (_, i) => {
            const month = i + 1;
            const key = monthSortKey(dashboardYear, month);
            return {
                _id: { year: dashboardYear, month },
                total: attByMonth.get(key) ?? 0,
                goal: tasksByMonth.get(key) ?? 0
            };
        });

        totalLeaveData.forEach((leave) => {
            const startDate = new Date(leave.startDate);
            const endDate = new Date(leave.endDate);
            const diffTime = Math.abs(endDate - startDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            totalLeaves += diffDays;
        });

        const yetToMark = daysInMonth - (totalLeaves + totalAttendance)

        const tasksRaw = await taskModel
            .find({ assignedTo: user, section: { $ne: 'Closed' }, status: { $ne: 'Completed' } })
            .sort({ createdAt: -1 })
            .limit(5)
            .select('assignedTo assignedToName createdAt name priority dueDate status projectId');

        const tasksWithProjectName = [];
        for (const task of tasksRaw) {
            const project = await projectModel.findById(task.projectId).select('projectName').lean();
            tasksWithProjectName.push({
                ...task.toObject(),
                projectName: project ? project.projectName : null
            });
        }



        return {
            totalProjects,
            daysInMonth,
            totalTasks,
            completedTasks,
            inProgressTasks,
            latestTasks: tasksWithProjectName,
            totalLeaves,
            totalAttendance,
            yetToMark,
            latestMonthsAttendence
        }

    } catch (err) {
        throw err
    }
}

const getEmployeeProfileData = async (employee, month) => {
    const year = new Date().getFullYear();
    const monthStart = new Date(year, month, 1);
    const monthEnd = new Date(year, month + 1, 1);
    const employeeQuery = { employeeId: employee };
    try {
        const [MonthAttendence, MonthLeaves] = await Promise.all([attendenceModel.aggregate([{
            $match: {
                date: {
                    $gte: monthStart,
                    $lt: monthEnd
                }, ...employeeQuery
            }
        }, { $group: { _id: null, count: { $sum: 1 } } }]), absenteesModel.find({
            ...employeeQuery, startDate: { $lt: monthEnd }, endDate: { $gte: monthStart }
        }).select('endDate startDate')]);
        let totalLeaves = 0;
        MonthLeaves.forEach((leave) => {
            const startDate = new Date(leave.startDate);
            const endDate = new Date(leave.endDate);
            const diffTime = Math.abs(endDate - startDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            totalLeaves += diffDays;
        });
        const TotalTasksMonthly = await taskModel.aggregate([{
            $match: {
                createdAt: { $gte: monthStart, $lt: monthEnd },
                assignedTo: employee
            }
        }, { $group: { _id: null, count: { $sum: 1 } } }]);
        const totalProjects = await projectModel.countDocuments({ members: employee });
        const employeeDetails = await employeeBasicDetailsModel.findOne({ employeeId: employee })
        return {
            MonthAttendence: MonthAttendence.length > 0 ? MonthAttendence[0].count : 0,
            totalLeaves,
            TotalTasksMonthly: TotalTasksMonthly.length > 0 ? TotalTasksMonthly[0].count : 0,
            totalProjects,
            employeeDetails
        };
    } catch (err) {
        throw err;
    }
}

const getHRDashboard = async (empId, query, pageNumber) => {
    try {
        const startOfMonth = new Date()
        startOfMonth.setDate(1)
        startOfMonth.setHours(0, 0, 0, 0);
        const endOfMonth = new Date();
        endOfMonth.setMonth(endOfMonth.getMonth() + 1);
        endOfMonth.setDate(1);
        endOfMonth.setHours(0, 0, 0, 0);
        let [totalEmployees, totalLeaves, totalNewEmployees, totalTodayLeaves, employeeWorkingToday, latestFewEmployees, activationRequest, leaveRequest, department, recruitement, onlineEmployees] = await Promise.all([employeeModel.count(), absenteesModel.find({
            createdAt: {
                $gte: startOfMonth,
                $lt: endOfMonth
            }
        }).count(), employeeModel.find({
            created: {
                $gte: startOfMonth,
                $lt: endOfMonth
            }
        }).count(), absenteesModel.find({
            createdAt: {
                $gte: new Date(),
                $lt: new Date()
            }
        }).count(), employeeModel.find({ working: true }).count(), employeeModel.find().sort({ created: -1 }).select('firstName lastName designation department working').limit(5), employeeActivationRequest.find({ approved: false }).count(), absenteesModel.find({ approved: false }).count(), employeeModel.aggregate([{
            $group: {
                _id: "$department",
                count: { $sum: 1 }
            }
        }]), employeeModel.find({ working: false }).select('firstName lastName designation _id').limit(4).sort({ created: -1 }), employeeModel.find({
            online: true,
            _id: { $ne: empId }
        }).count(),]);
        onlineEmployees++
        const circleChartData = { onlineEmployees, offlineEmployees: totalEmployees - onlineEmployees }

        const output = {
            totalEmployees,
            totalLeaves,
            totalNewEmployees,
            totalTodayLeaves,
            employeeWorkingToday,
            circleChartData,
            latestFewEmployees,
            activationRequest,
            leaveRequest,
            department,
            recruitement,
            onlineEmployees
        };

        return output;

    } catch (err) {
        throw err;
    }
}

const getEmployeeTodoCount = async (id) => {
    try {
        const TODO = await employeeTodoModel.find({ employeeId: id, status: 'TD' }).count()
        return TODO
    } catch (err) {
        throw err
    }
}

const getEmployeeActivities = async (query) => {
    try {
        const year = query.year;
        const month = query.month;
        const startDate = moment({ year, month: month - 1 });
        const endDate = moment({ year, month }).subtract(1, 'day');
        const response = await employeeActivityModel.find({
            ...(query.type && String(query.type).trim().toLowerCase() !== 'all' ? { type: query.type } : {})
        }).sort({ createdAt: -1 }).limit(100)
        const groupedActivities = {};
        response.forEach((activityObject) => {
            const activityDate = moment(activityObject.createdAt);
            const weekNumber = Math.ceil(activityDate.date() / 7);
            const weekText = `${activityDate.format('MMMM')} ${weekNumber}${getWeekSuffix(weekNumber)} week`;

            if (!groupedActivities.hasOwnProperty(weekText)) {
                groupedActivities[weekText] = [];
            }

            groupedActivities[weekText].push(activityObject);
        });
        return groupedActivities;
    } catch (err) {
        throw err
    }
}

const getLatestEmployeeActivites = (page, employeeId) => {
    try {
        page = (page != null && page >= 1 ? page : 1) - 1;
        return employeeActivityModel.find(employeeId != null ? { employeeId } : {})
            .limit(ACTIVITIES_PER_PAGE)
            .skip(page * ACTIVITIES_PER_PAGE)
            .sort({ createdAt: -1 });
    } catch (error) {
        throw error;
    }
}

const createEmployeeActivity = async (body) => {
    try {
        const response = await new employeeActivityModel(body).save()
        const employees = await employeeModel.find({ active: true, role: 'EMP' }).select('email _id firstName').lean()
        if (body.notificationType === 'app') {
            await Promise.resolve(employees.map(async (e) => {
                await createNotification({ text: `Birthday Coming ! ${body.text}`, reciever: e._id, link: `/admin/dashboard/activity` })
            }))
        } else if (body.notificationType === 'mail') {
            await Promise.resolve(employees.map(async (e) => {
                const template = ActivityTemplate(await withEmailBanner({
                    name: e.firstName,
                    type: body.type,
                    message: body.text
                }))
                await sendEmail(e.email, `New ${body.type} Activity in company`, template)
            }))
        }
        return response
    } catch (err) {
        throw err
    }
}

async function createMultipleEmployeeActivities(activities) {
    try {
        await employeeActivityModel.insertMany(activities)
    } catch (err) {
        throw err
    }
}

const getSingleEmployeeActivities = async (query) => {
    try {
        const response = await employeeActivityModel.find({ employeeId: query.id })
        return response
    } catch (err) {
        throw err
    }
}

const updatePasswordFunction = async (body) => {
    try {
        if (!body.password) throw new Error("password must not be null")
        if (body.password.length < 6) throw new Error("password must not be less than 6 chars")
        if (body.token) {
            let jwtData = await JWTtoDecoder(body.token);
            let employee = await employeeModel.findById(jwtData.data._id);
            if (employee.pwd !== 'initial') throw new Error("failed to add password")
            employee.pwd = await body.password;
            await employee.save();
            await sendEmail(employee.personalEmail, 'Password updated', PasswordChangeSuccessTemplate(await withEmailBanner({ name: employee.firstName })))
            return "password updated"
        } else if (body.code) {
            let email = body.email
            if (email) {
                let user = await employeeModel.findOne({ email });
                if (user) {
                    let code = user.code
                    if (code.code !== "000000") {
                        if (new Date(code.expiry).getTime() - new Date().getTime() > 0) {
                            if (body.code === code.code) {
                                user.code = { code: "000000", expiry: new Date().toString() }
                                user.pwd = await body.password
                                await user.save()
                                await sendEmail(user.personalEmail, 'Password updated', PasswordChangeSuccessTemplate(await withEmailBanner({ name: user.firstName })))
                                return "password updated"
                            } else throw new Error("codes isn't matched")
                        } else throw new Error("Code is expired")
                    } else throw new Error("invalid code")
                } else throw new Error("Cannot find email")
            } else throw new Error("Email must not be null")
        } else throw new Error("Bad request")
    } catch (err) {
        throw err
    }
}

const requestUpdatePasswordFunction = async (body) => {
    try {
        let email = body.email
        if (!email) {
            throw new Error("email must not be null")
        }
        let user = await employeeModel.findOne({ email })
        if (user.working === false && user.active === false) return { notOnboarded: true, activation: user.activationId }
        else if (user && user.working === true && user.active === true) {
            let code = randomInt(1000, 9999)
            let expiry = new Date((new Date().getTime() + 1000 * 60 * 5)).toString()
            user.code = { code: `${code}`, expiry }
            await user.save()
            await sendEmail(user.email, "Vectorshades verification code", ForgotPasswordOtpTemplate(await withEmailBanner({ name: user.firstName, code })))
        } else {
            throw new Error("Cannot find this email")
        }
    } catch (e) {
        throw e
    }
}

const updatePunchInStateFunction = async ({ id }, { status }) => {
    try {

        if (status == null || typeof (status) != 'boolean') throw new Error("bad request")

        let user = await employeeModel.findById(id);

        if (!user) {
            throw new Error("inavalid user")
        }

        if (!user.punch) {
            user.punch = { status: false, logs: [], day: { inTime: 0, outTime: 0, current: new Date() }, month: { inTime: 0, outTime: 0, current: new Date() }, total: { inTime: 0, outTime: 0, current: new Date() } }
            await user.save()
        }

        if (status) {
            if (user.punch.status == status) return "updated"

            let today = new Date()

            user.punch.logs.push({ msg: 'Punched in', date: today })
            user.punch.status = true

            //validate day
            if (today.getUTCDay() == new Date(user.punch.day.current).getUTCDay()) {
                user.punch.day.outTime += today.getTime() - new Date(user.punch.day.lastUpdate).getTime()
                user.punch.day.lastUpdate = today
            } else {
                user.punch.day = { current: today, inTime: 0, outTime: 0, lastUpdate: today }
                user.punch.day.outTime += today.getTime() - new Date(user.punch.day.lastUpdate).getTime()
                user.punch.day.lastUpdate = today
            }

            //validate month
            if (today.getUTCMonth() == new Date(user.punch.month.current).getUTCMonth()) {
                user.punch.month.outTime += today.getTime() - new Date(user.punch.month.lastUpdate).getTime()
                user.punch.month.lastUpdate = today
            } else {
                user.punch.month = { current: today, inTime: 0, outTime: 0, lastUpdate: today }
                user.punch.month.outTime += today.getTime() - new Date(user.punch.month.lastUpdate).getTime()
                user.punch.month.lastUpdate = today
            }

            //validate total
            user.punch.total.outTime += today.getTime() - new Date(user.punch.total.lastUpdate).getTime()
            user.punch.total.lastUpdate = today
        } else {
            if (user.punch.status == status) return "updated"

            let today = new Date()

            user.punch.logs.push({ msg: 'Punched out', date: today })
            user.punch.status = false

            //validate day
            if (today.getUTCDay() == new Date(user.punch.day.current).getUTCDay()) {
                user.punch.day.inTime += today.getTime() - new Date(user.punch.day.lastUpdate).getTime()
                user.punch.day.lastUpdate = today
            } else {
                user.punch.day = { current: today, inTime: 0, outTime: 0, lastUpdate: today }
                user.punch.day.inTime += today.getTime() - new Date(user.punch.day.lastUpdate).getTime()
                user.punch.day.lastUpdate = today
            }

            //validate month
            if (today.getUTCMonth() == new Date(user.punch.month.current).getUTCMonth()) {
                user.punch.month.inTime += today.getTime() - new Date(user.punch.month.lastUpdate).getTime()
                user.punch.month.lastUpdate = today
            } else {
                user.punch.month = { current: today, inTime: 0, outTime: 0, lastUpdate: today }
                user.punch.month.inTime += today.getTime() - new Date(user.punch.month.lastUpdate).getTime()
                user.punch.month.lastUpdate = today
            }

            //validate total
            user.punch.total.inTime += today.getTime() - new Date(user.punch.total.lastUpdate).getTime()
            user.punch.total.lastUpdate = today
        }

        await user.save()
        return "updated"

    } catch (error) {
        console.log(error);
        throw error
    }
}

const getPunchStats = async ({ id }) => {
    try {
        return (await employeeModel.findById(id)).punch
    } catch (e) { throw e }
}

const getWorkStats = async (query) => {
    try {
        const searchQuery = query.search?.trim();
        const findCondition = {
            active: true,
            ...(searchQuery !== '' && {
                $or: [
                    { firstName: { $regex: searchQuery, $options: "i" } },
                    { fullName: { $regex: searchQuery, $options: "i" } },
                ],
            }),
        };

        let employees = await employeeModel.find(findCondition);
        const statusResults = await Promise.all(
            employees.map(async (employee) => {
                const employeeId = employee._id;
                const totalProjects = await projectModel.countDocuments({ members: employeeId });
                const tasks = await taskModel.find({ assignedTo: employeeId });
                const totalTasks = tasks.length;
                const isWorking = tasks.filter(task => task.status === "In Progress").length > 0 ? true : false

                return {
                    employee: {
                        id: employee._id,
                        firstName: employee.firstName,
                        lastName: employee.lastName,
                        designation: employee.designation,
                        email: employee.email,
                    },
                    totalProjects,
                    totalTasks,
                    isWorking,
                    currentTask: tasks.find(task => task.status === "In Progress") || null,
                };
            })
        );

        return statusResults;
    } catch (e) { throw e }
}

const getAllEmployeesBasicData = async ({ search }) => {
    try {
        let employees;
        const projects = await projectModel.find({}).select('members');
        const tasks = await taskModel.find({}).select('assignedTo');
        if (search) employees = await employeeModel.find({ role: 'EMP', $or: [{ firstName: { $regex: search, $options: 'i' } }, { lastName: { $regex: search, $options: 'i' } }] }).select('firstName lastName designation department online personalEmail');
        else employees = await employeeModel.find({ role: 'EMP' }).select('firstName lastName designation department online personalEmail');

        employees = employees.map((employee) => {
            let projectsAssigned = projects.filter((project) => project.members.includes(employee._id)).length;
            let tasksAssigned = tasks.filter((task) => task.assignedTo == employee._id).length;
            return { ...employee._doc, projectsAssigned, tasksAssigned };
        });

        return employees
    } catch (e) { throw e }
}

const getClientList = async () => {
    try {
        return clients
    } catch (e) { throw e }
}

const getEmployeeWithUid = async (uid) => {
    try {
        const emp = await employeeModel.countDocuments({ uid })
        if (emp === 0) return true // UID available
        else return false
    } catch (e) { throw e }
}


const filterEmployee = async (query, pageNumber) => {
    try {
        const page = pageNumber ? parseInt(pageNumber) : 1;
        const empPerPage = 15;
        const skip = (page - 1) * empPerPage;
        const { startDate, endDate, working, department, designation, search, online, fields } = query;
        let filter = {};
        if (startDate !== undefined && endDate !== undefined) filter.joining = {
            $gte: new Date(startDate),
            $lte: new Date(endDate)
        };
        if (working !== undefined) filter.working = working;
        if (department !== undefined) filter.department = department;
        if (designation !== undefined) filter.designation = designation;
        if (online !== undefined) filter.online = online;
        const projection = fields ? fields.reduce((p, c) => {
            p[c] = 1;
            return p;
        }, {}) : null;
        let employees = await employeeModel.find(filter, projection).limit(pageNumber === 0 ? 6000 * 60 * 60 : empPerPage).skip(pageNumber === 0 ? 0 : skip).sort({ created: -1 }).select('-publicDetails -privateDetails -pwd').lean()
        employees = employees.map((employee) => {
            employee.created = new Date(employee.created).toLocaleDateString() + ' ' + new Date(employee.created).toLocaleTimeString()
            employee.logedDate = new Date(employee.logedDate).toLocaleDateString() + ' ' + new Date(employee.logedDate).toLocaleTimeString()
            employee.joining = new Date(employee.joining).toLocaleDateString() + ' ' + new Date(employee.joining).toLocaleTimeString()

            return employee;
        });
        return employees;
    } catch (err) {
        throw err;
    }
}

const generateTimerToken = async (emp) => {
    if (!JWT_SECRET) throw new Error('Missing environment variable: JWT_SECRET');
    const token = jwt.sign({
        data: {
            empId: emp,
            generatedAt: new Date()
        }
    }, JWT_SECRET);
    await employeeModel.updateOne({ _id: emp }, { $set: { timerToken: token } })
    return token;
}


module.exports = {
    getPunchStats,
    getAllEmployees,
    getEmployeePrivateDetails,
    getEmployeeProfileData,
    getHRDashboard,
    filterEmployee,
    employeeDashboard,
    createTODO,
    filterEmployeeTODO,
    editEmployeeTODO,
    getEmployeeTODO,
    deleteEmployeeTODO,
    createEmployee,
    updateEmpByEmp,
    deleteEmployee,
    fetchEmployeeAccountSingle,
    fetchEmployeeAccountActivationID,
    fetchEmployeeAccount,
    getTotalNumberofEmployee,
    FilterEmployees,
    getEmployeeTodoCount,
    createEmployeeActivity,
    getEmployeeActivities,
    getSingleEmployeeActivities,
    updateEmployeeDetailsAndBasicDetails,
    getLatestEmployeeActivites,
    updatePasswordFunction,
    requestUpdatePasswordFunction,
    updatePunchInStateFunction,
    getAllEmployeesBasicData,
    getClientList,
    getEmployeeWithUid,
    generateTimerToken,
    getWorkStats,
    updateEmployeeProfilePicture,
    syncProfilePictureToEmployeeKey,
}
