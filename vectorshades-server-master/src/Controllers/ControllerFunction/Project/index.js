const { projects: { projectModel, taskModel, activityModel, taskActivityModel, drawingModel }, employee: { employeeModel }, rebarJobs, jobs: { jobModel, ProjectDashboardModel }, cloud: { projectCloudModel } } = require("../../../Models/Extractor/index");
const { timeSheetActivityModel } = require("../../../Models/Timesheet");
const { createNotification, sendEmailFunction } = require('../Communication/index')
const { getDate, nowInIST } = require("../../../Helpers/Functions/General/getDate");
const calculateRebarProjectProgress = require("../../../Helpers/Functions/General/rebarProjectProgress");
const NotifyTaskTemplate = require("../../../Config/Templates/notifyTaskTemplate");
const reportTemplate = require("../../../Config/Templates/reportTemplate");
const { generateCSVReport } = require("../Reports");
const sendEmail = require("../../../Helpers/Functions/Email/sendEmail");
const ActivityTemplate = require("../../../Config/Templates/ActivityTemplate");
const JWTtoDecoder = require("../../../Helpers/Functions/Authentication/JWTDecoder");
const notifyTaskTemplate = require("../../../Config/Templates/notifyTaskTemplate");
const { computeInProgressHours, finalTwoActivities } = require("../../../Helpers/Functions/General/timer");
const { withEmailBanner } = require("../../../Helpers/Functions/General/emailBanner");
const { trusted } = require("mongoose");
const { getWorkedSessionsForDay } = require("../../../Helpers/Functions/General/data");

const createProject = async (body, user) => {
    try {
        body.members = [...body.members, user.id]
        body.membersByName = await employeeModel.find({ _id: { $in: body.members } }).select('firstName lastName _id email department designation').lean()
        body.membersByName = body.membersByName.map((member) => ({ ...member, ['role']: "AD" }))
        body.createdBy = user.name
        body.createdById = user.id
        body.admin = user.name
        const project = await new projectModel(body).save();
        return project;
    } catch (err) {
        console.log(err)
        throw err;
    }
}

const refreshProjectMembersDetails = async (projectId) => {
    const project = await projectModel.findById(projectId).lean();

    const previousRolesMap = {};
    if (Array.isArray(project.membersByName)) {
        for (const member of project.membersByName) {
            if (member._id) {
                previousRolesMap[member._id.toString()] = member.role || null;
            }
        }
    }

    const updatedMembers = await employeeModel
        .find({ _id: { $in: project.members } })
        .select('firstName lastName _id email department designation')
        .lean();

    const mergedMembers = updatedMembers.map(member => ({
        ...member,
        role: previousRolesMap[member._id.toString()] || null
    }));

    await projectModel.findByIdAndUpdate(projectId, {
        membersByName: mergedMembers
    });

    return { message: "project refreshed successfully" };
};

const getAllProjectsByUser = async (body, pageNumber, user, query, useObj) => {
    try {
        let page = pageNumber && pageNumber >= 1 ? pageNumber : 1;
        page = page - 1;
        const limit = 6;

        const baseFilter = useObj.role === 'SA'
            ? {}
            : { members: user };

        let dateFilter = {};
        if (query.year && query.month) {
            const year = parseInt(query.year, 10);
            const month = parseInt(query.month, 10);
            const start = new Date(year, month - 1, 1);
            const end = new Date(year, month, 1);
            dateFilter.createdAt = { $gte: start, $lt: end };
        }

        const sortBy = query.updatedAt
            ? { updatedAt: -1 }
            : { createdAt: -1 };

        const projects = await projectModel
            .find({ ...baseFilter, ...dateFilter })
            .limit(limit)
            .skip(page * limit)
            .sort(sortBy);

        return projects;
    } catch (err) {
        throw err;
    }
};

const getTotalNumberOfProjectsByUser = async (user) => {
    try {
        let emp = await employeeModel.findById(user)
        const projects = await projectModel.find(emp.role === 'SA' ? {} : { members: user }).count()
        return projects
    }
    catch (err) {
        throw err;
    }
}

const getAllProjectsRaw = async (pageNumber) => {
    try {
        let page = pageNumber >= 1 ? pageNumber : 1;
        page = page - 1
        const limit = 15
        const projects = await projectModel.find().limit(limit).skip(page * limit).sort({ createdAt: -1 })
        return projects
    }
    catch (err) {
        throw err;
    }
}

const getSingleProjectByFilter = async (filter) => {
    try {
        const projectSingle = await projectModel.findOne(filter)
        return projectSingle
    }
    catch (err) {
        throw err;
    }
}

const getSingleProject = async (id) => {
    try {
        const projectSingle = await projectModel.findById(id).lean()
        let body = projectSingle
        if (projectSingle.rebar === true) {
            const linkedDepartments = await rebarJobs.jobModel.find({ $or: [{ _id: projectSingle.job }, { linkedId: projectSingle.job }], awarded: true }).select('rebarType total_breakpoints')
            const progress = calculateRebarProjectProgress(linkedDepartments)
            body = { ...body, progress, linkedDepartments }
        }
        return body
    }
    catch (err) {
        throw err;
    }
}

const searchProject = async (user, search) => {
    try {
        const filter = {}
        filter.projectName = { $regex: new RegExp(search, "i") }
        if (user.role === 'EMP') filter.members = user.id
        const searchedProjects = await projectModel.find(filter).sort({ updatedAt: -1 })
        return searchedProjects
    }
    catch (err) {
        throw err;
    }
}

const editSingleProject = async (body) => {
    try {
        const editedProject = await projectModel.findOneAndUpdate({ _id: body.id }, { $set: { ...body["body"], updatedAt: new Date() } });
        return editedProject
    }
    catch (err) {
        throw err;
    }
}

const deleteSingleProject = async (id) => {
    try {
        const deletedProject = await projectModel.deleteOne({ _id: id });
        return deletedProject
    }
    catch (err) {
        throw err;
    }
}

const checkProjectPermission = async (user, project) => {
    if (["PA", "SA", "STL", "REBAR"].includes(user.role)) return true
    const projectData = await projectModel.findById(project);
    if (projectData.members.includes(user.id)) return true;
    else throw { message: "You don't have permission to access this project" };
}

const createTask = async (body) => {
    try {
        const project = await projectModel.findById(body.projectId);
        body.type = project.rebar ? 'rebar' : 'steel'
        const task = await new taskModel(body).save();
        project.tasks.push(task._id);
        const employee = await employeeModel.findById(task.assignedTo).select('email')
        const assignedBy = await employeeModel.findById(task.assignedBy).select('email department')
        const templateCode = notifyTaskTemplate(await withEmailBanner({
            name: body.assignedToName,
            project: project.projectName,
            task: task.name,
            assignedTo: body.assignedToName,
            message: 'You have been assigned a new task. Please log in to dashboard for more details',
            link: `https://vectorshades-frontend.vercel.app/admin/dashboard/projects/${body.projectId}`
        }));

        const leadNotifyCodeCode = notifyTaskTemplate(await withEmailBanner({
            name: 'User',
            project: project.projectName,
            task: task.name,
            assignedTo: body.assignedToName,
            message: `New Task Created for ${project.projectName} Please log in to dashboard for more details`,
            link: `https://vectorshades-frontend.vercel.app/admin/dashboard/projects/${body.projectId}`
        }));

        let notifyEmails = []

        if (project.rebar) {
            const empMails = await employeeModel.find({ designation: { $in: ['Team Leader', 'Assistant Team Leader'] }, department: 'Rebar' }).select('email').lean()
            notifyEmails = empMails.map((e) => e.email)
            const forwardEmail = 'geetharajesh@vectorshades.com';
            if (!notifyEmails.includes(forwardEmail)) notifyEmails.push(forwardEmail)
        } else {
            if (assignedBy.department == 'Steel-QAQC') {
                const empMails = await employeeModel.find({ department: 'Steel-QAQC', designation: 'APM' }).select('email').lean()
                notifyEmails = empMails.map((e) => e.email)
            }
            // Need to clarify
        }

        await Promise.all([
            createNotification({ text: `New task has been allotted : ${task.name}`, reciever: body.assignedTo, link: `/admin/dashboard/projects/${body.projectId}` }),
            createActivity({ text: `New task added to project : ${task.name}`, projectId: body.projectId, type: 'TASK' }),
            project.save(),
            sendEmailFunction({
                to: employee.email,
                subject: `You have been assigned a new task`,
                html: templateCode
            }),
            ...notifyEmails.map((email) =>
                sendEmailFunction({
                    to: email,
                    subject: `New task assigned in ${project.projectName}`,
                    html: leadNotifyCodeCode
                })
            )
        ])
        return task;
    } catch (err) {
        throw err;
    }
}

const getAllTasks = async (project, pageNumber) => {
    try {
        let page = pageNumber >= 1 ? pageNumber : 1;
        page = page - 1
        const limit = 15
        const tasks = await taskModel.find({ projectId: project }).limit(limit).skip(page * limit).sort({ createdAt: -1 })
        return tasks
    }
    catch (err) {
        throw err;
    }
}

const getSingleTasks = async (id, page, type) => {
    try {
        const filter = type === 'index' ? { taskIndex: id } : { _id: id }
        const taskSingle = await taskModel.findOne(filter).lean();
        const obj = {
            ...taskSingle
        }
        obj.activities = await taskActivityModel.find({ taskId: id }).sort({ createdAt: -1 })
        return obj
    }
    catch (err) {
        throw err;
    }
}

const refreshTaskHrsFunction = async (id) => {
    try {
        const activity = await taskActivityModel.find({ taskId: id }).sort({ createdAt: -1 })
        const hrs = computeInProgressHours(activity)
        const task = await taskModel.findById(id).select('completedHours')
        task.completedHours = hrs
        await task.save()
        return hrs
    }
    catch (err) {
        throw err;
    }
}

const editSingleTasks = async (body, user, source) => {
    try {
        let userTask = await taskModel.findOne({ _id: body.id });
        const project = await projectModel.findById(userTask.projectId).select('projectName rebar')
        if (!project.rebar && userTask.status !== 'Review' && body.status === 'Completed') body.status === 'Review'
        if (userTask.assignedTo === user.id && userTask.status !== body.status) {
            if (userTask.status === 'In Progress' && body.status !== 'In Progress') {
                let currentActivity;
                const diffInMs = Math.abs(Date.now() - new Date(userTask.startedOn).getTime());
                const diffInHrs = Number((diffInMs / (1000 * 60 * 60)).toFixed(2));
            }
            body.startedOn = null
        }
        if (body.status === 'In Progress' && userTask.status !== 'In Progress') {
            const prevInProgressTasks = await taskModel
                .find({ status: 'In Progress', assignedTo: userTask.assignedTo, _id: { $ne: userTask._id } })
                .select('_id status projectId');

            const pauseTasksRecursively = async (i = 0) => {
                if (i >= prevInProgressTasks.length) return;
                const prevTask = prevInProgressTasks[i];

                await new taskActivityModel({
                    text: `Status Changed from ${prevTask.status} to Paused - ${source}`,
                    createdBy: user,
                    type: 'status',
                    projectId: prevTask.projectId,
                    taskId: prevTask._id
                }).save();

                await taskModel.updateOne(
                    { _id: prevTask._id },
                    { $set: { status: 'Paused', startedOn: null, updatedAt: new Date() } }
                );

                const prevActivities = await taskActivityModel.find({ taskId: prevTask._id }).sort({ createdAt: -1 });
                const prevCompletedHours = computeInProgressHours(prevActivities);
                await taskModel.updateOne(
                    { _id: prevTask._id },
                    { $set: { completedHours: prevCompletedHours } }
                );

                await pauseTasksRecursively(i + 1);
            };

            await pauseTasksRecursively(0);
        }
        if (body.status === "In Progress") body.startedOn = new Date()
        if (!body.cron) {
            if (body.actualHours) {
                const task = await taskModel.findById(body.id).select('projectId section')
                const project = await projectModel.findById(task.projectId).select('job')
                const linkedJob = await rebarJobs.jobModel.findOne({ rebarType: task.section, $or: [{ linkedId: project.job }, { _id: project.job }] }).select('_id total_breakpoints')
                await rebarJobs.jobModel.updateOne(
                    { _id: linkedJob._id },
                    { $set: { 'total_breakpoints.totalHours': linkedJob.total_breakpoints.totalHours + parseInt(body.actualHours) } }
                );
                const dashboard = await rebarJobs.ProjectDashboardModel.findOne({ $or: [{ jobId: project.job }, { linkedId: project.job }], 'awardedProjectData.rebar': task.section }).select('tonsDetailedTimesheet')
                await rebarJobs.ProjectDashboardModel.updateOne(
                    { _id: dashboard._id },
                    { $set: { 'tonsDetailedTimesheet': dashboard.tonsDetailedTimesheet + parseInt(body.tonsDetailed) } }
                );
            }
            async function sendTaskNotification({ status, previousStatus, recipientId, recipientName, subject, message }) {
                const employee = await employeeModel.findById(recipientId).select('email');
                const templateCode = NotifyTaskTemplate(await withEmailBanner({
                    name: recipientName,
                    project: project.projectName,
                    task: userTask.name,
                    assignedTo: userTask.assignedToName,
                    message,
                    link: `https://vectorshades-frontend.vercel.app/admin/dashboard/projects/${userTask.projectId}?taskpopup=${userTask._id}&group=${userTask.section}`
                }));
                await sendEmailFunction({ to: employee.email, subject, html: templateCode });
                await createNotification({ text: subject, reciever: employee._id, link: `/admin/dashboard/projects/${userTask.projectId}?taskpopup=${userTask._id}&group=${userTask.section}` })
            }

            if (body.status === "Review" && user.id === userTask.assignedTo) {
                await sendTaskNotification({
                    status: "Review",
                    recipientId: userTask.assignedBy,
                    recipientName: userTask.assignedByName,
                    subject: `Task ${userTask.name} has requested review`,
                    message: 'This Task has recently been updated to In Review. Please log in to the dashboard for more details.'
                });
            }

            if (body.status === "In Progress" && userTask.status === "Review" && user.id === userTask.assignedTo) {
                await sendTaskNotification({
                    status: "In Progress",
                    previousStatus: "Review",
                    recipientId: userTask.assignedBy,
                    recipientName: userTask.assignedByName,
                    subject: `Task ${userTask.name} has moved back to progress`,
                    message: 'This Task has been moved back from In Review to In Progress. Please log in to the dashboard for more details.'
                });
            }

            if (body.status === "Completed" && user.id === userTask.assignedBy) {
                await sendTaskNotification({
                    status: "Completed",
                    recipientId: userTask.assignedTo,
                    recipientName: userTask.assignedToName,
                    subject: `Task ${userTask.name} marked as completed`,
                    message: `Your Task has been marked as completed by ${userTask.assignedByName}. Please log in to the dashboard for more details.`
                });
            }

            if (body.status === "Paused" && userTask.status === "Review" && user.id === userTask.assignedBy) {
                await sendTaskNotification({
                    status: "Paused",
                    previousStatus: "Review",
                    recipientId: userTask.assignedTo,
                    recipientName: userTask.assignedToName,
                    subject: `Task ${userTask.name} has moved back to progress`,
                    message: 'This Task has been moved back from In Review to In Progress. Please log in to the dashboard for more details.'
                });
            }
        }
        if (body.status !== userTask.status) {
            const activityObj = {
                text: `Status Changed from ${userTask.status} to ${body.status} - ${source}`,
                createdBy: user,
                type: 'status',
                projectId: userTask.projectId,
                taskId: userTask._id
            }
            await new taskActivityModel(activityObj).save()
        }

        if (body.completedHours !== undefined && userTask.completedHours && userTask.completedHours !== 0 !== body.completedHours) {
            let activities = await taskActivityModel.find({ taskId: userTask._id }).sort({ createdAt: -1 }).lean()
            activities = finalTwoActivities(activities, parseFloat(body.completedHours)).map((e) => ({...e,edited:true}))

            const formattedDate = new Date(activities[0].createdAt)
                .toLocaleDateString('en-GB') // DD/MM/YYYY
                .replace(/\//g, '-');
            await taskActivityModel.deleteMany({ taskId: userTask._id })
            await taskActivityModel.insertMany(activities)
            body.completedHours = computeInProgressHours(activities)
            await taskModel.updateOne({ _id: userTask._id }, { $set: body })
            const logs = await getWorkedSessionsForDay(formattedDate, userTask.assignedTo);
            await timeSheetActivityModel.updateOne(
                { date: formattedDate, employeeId: userTask.assignedTo },
                { $set: { logs } }
            );
        }

        if (userTask.status !== body.status) {
            const activities = await taskActivityModel.find({ taskId: userTask._id }).sort({ createdAt: -1 })
            body.completedHours = computeInProgressHours(activities)
            body.updatedAt = new Date()
            await taskModel.updateOne({ _id: userTask._id }, { $set: body })
            const InProgressTasks = await taskModel.find({ status: 'In Progress', assignedTo: user.id }).select('_id')
            const employee = await employeeModel.findById(userTask.assignedTo)
            if (InProgressTasks.length === 0 && employee.timer === true) {
                employee.timer = false
                const diffInMs = Math.abs(new Date() - employee.lastTimerAt);
                const diffInMins = parseFloat(((diffInMs / (1000 * 60))).toFixed(2))
                employee.taskTime = employee.taskTime + diffInMins
                employee.lastTimerAt = null
                await employee.save()
                console.log('task Edit TIme', employee.email, employee.taskTime, diffInMins, new Date(), '+', employee.lastTimerAt)
            } else if (InProgressTasks.length === 1 && !employee.timer) {
                employee.timer = true
                employee.lastTimerAt = new Date()
                await employee.save()
            }
        } else await taskModel.updateOne({ _id: userTask._id }, { $set: body })

        // try {
        //     const logs = await getWorkedSessionsForDay(getDate(), userTask.assignedTo, userTask._id);
        //     console.log(logs)
        // } catch (err) {
        //     console.log(err)
        // }

        const dateStr = getDate()
        const logs = await getWorkedSessionsForDay(dateStr, userTask.assignedTo);
        await timeSheetActivityModel.updateOne(
            { date: dateStr, employeeId: userTask.assignedTo },
            { $set: { logs } }
        );

        return userTask
    }
    catch (err) {
        throw err
    }
}

const deleteSingleTasks = async (id) => {
    try {
        const deletedProject = await taskModel.deleteOne({ _id: id });
        return deletedProject
    }
    catch (err) {
        throw err;
    }
}

const AssignTasks = async (body) => {
    try {
        const task = await taskModel.findById(body.id);
        const idgroups = await employeeModel.find({ _id: { $in: body.assignedTo } }).select("firstName");
        body.assignedToName = idgroups
        task.assignedTo = [...body.assignedTo, ...task.assignedTo];
        task.assignedToName = [...body.assignedToName, ...task.assignedToName];
        task.assignedBy = body.assignedBy;
        task.assignedByName = body.assignedByName;
        await task.save();
        return task
    }
    catch (err) {
        throw err;
    }
}

const AddProjectMembersTasks = async (body, Nominy) => {
    try {
        const project = await projectModel.findById(body.id);
        let idgroups = await employeeModel.find({ _id: { $in: body.members } }).select("firstName lastName email designation _id").lean()
        idgroups = idgroups.map((data) => ({ ...data, 'role': body.role }))
        project.members = [...new Set(project.members.concat(body.members.filter(member => !project.members.includes(member))))];
        project.membersByName = [...idgroups, ...project.membersByName];
        await createNotification({ text: `you have been assigned a project : ${project.projectName}`, reciever: body.members[0], link: `/admin/dashboard/projects/${project._id}` }),
            await createActivity({ text: `New Member has been added to the project : ${idgroups.map((data) => data.firstName).join(' ')}`, projectId: body.id, type: 'MEMBER' }),
            await project.save();
        return project
    }
    catch (err) {
        throw err;
    }
}

const RemoveProjectMembers = async (projectId, user) => {
    try {
        const member = await employeeModel.findById(user).select("firstName lastName email designation _id");
        const project = await projectModel.findById(projectId);
        project.members = project.members.filter(member => member !== user);
        project.membersByName = project.membersByName.filter(member => member._id !== user)
        await createActivity({ text: `${member.firstName} ${member.lastName} has been removed from the project`, projectId: projectId, type: 'MEMBER' }),
            await project.save();
        return project
    }
    catch (err) {
        throw err;
    }
}

const getAllEmployees = async (query) => {
    try {
        const employees = await employeeModel.find(query, { _id: 1, firstName: 1, lastName: 1, designation: 1 })
        return employees
    }
    catch (err) {
        throw err;
    }
}

const validateTimerToken = async (token) => {
    try {
        const employee = await employeeModel.findOne({ timerToken: token })
        if (!employee) throw new Error('NO Employee matching')
        return employee
    }
    catch (err) {
        throw err;
    }
}

const getEmployeeTimerTasksFunction = async (auth) => {
    try {
        const { data } = await JWTtoDecoder(auth)
        const tasks = await taskModel.aggregate([
            {
                $match: {
                    assignedTo: data.empId,
                    status: { $in: ['Paused', 'In Progress'] },
                    section: { $nin: ['Closed'] }
                }
            },
            {
                $lookup: {
                    from: 'projects', // collection name in lowercase plural
                    localField: 'projectId',
                    foreignField: '_id',
                    as: 'project'
                }
            },
            {
                $unwind: '$project'
            },
            {
                $addFields: {
                    projectName: '$project.projectName'
                }
            },
            {
                $project: {
                    project: 0 // remove the full project object if you only want projectName
                }
            }
        ]);
        return tasks
    }
    catch (err) {
        throw err;
    }
}

const getAllProjectTasks = async (projectId, pageNumber, section) => {
    try {
        let page = pageNumber >= 1 ? pageNumber : 1;
        page = page - 1
        const limit = 6
        // no section (the "All" tab) - match every section for the project
        // instead of filtering on one, rather than relying on the driver
        // dropping an undefined key
        const filter = section ? { projectId, section } : { projectId }
        const tasks = await taskModel.find(filter).limit(limit).skip(page * limit).sort({ createdAt: -1 })
        return tasks
    }
    catch (err) {
        throw err;
    }
}

const getAllProjectTasksCount = async (projectId, section) => {
    try {
        const filter = section ? { projectId, section } : { projectId }
        const count = await taskModel.find(filter).count()
        return count
    }
    catch (err) {
        throw err;
    }
}

const getAllSectionsTasksCount = async (projectId, sections) => {
    try {
        const counts = await taskModel.aggregate([
            { $match: { projectId, section: { $in: sections } } },
            { $group: { _id: "$section", count: { $sum: 1 } } }
        ]);
        const resData = {}
        counts.forEach((c) => {
            resData[c._id] = c.count
        })
        return resData;
    }
    catch (err) {
        throw err;
    }
}

const createActivity = async (body) => {
    try {
        const activity = await new activityModel(body).save();
        return activity;
    } catch (err) {
        throw err;
    }
}

const getAllActivities = async (project, pageNumber, type) => {
    try {
        let page = pageNumber >= 1 ? pageNumber : 1;
        page = page - 1
        const limit = 10
        const activities = await activityModel.find({ projectId: project, type }).limit(limit).skip(page * limit).sort({ createdAt: -1 })
        return activities
    }
    catch (err) {
        throw err;
    }
}

const getAllTaskActivityForProject = async (project, pageNumber, type) => {
    try {
        const activities = await taskActivityModel.find({ projectId: project }).sort({ createdAt: -1 }).lean();
        const taskIds = [...new Set(activities.map(activity => activity.taskId))];
        const tasks = await taskModel.find({ _id: { $in: taskIds } }).select('_id name').lean();

        const taskNameMap = {};
        tasks.forEach(task => {
            taskNameMap[task._id] = task.name;
        });

        return activities.map(activity => {
            return {
                ...activity,
                taskName: taskNameMap[activity.taskId] || ''
            };
        });
    } catch (err) {
        throw err;
    }
};

const getSingleActivity = async (id) => {
    try {
        const activitySingle = await activityModel.findById(id)
        return activitySingle
    }
    catch (err) {
        throw err;
    }
}

const editSingleActivity = async (body) => {
    try {
        const editedActivity = await activityModel.findOneAndUpdate({ _id: body.id }, { $set: { ...body, updatedAt: new Date() } });
        return editedActivity
    }
    catch (err) {
        throw err;
    }
}

const deleteSingleActivity = async (id) => {
    try {
        const deletedActivity = await activityModel.deleteOne({ _id: id });
        return deletedActivity
    }
    catch (err) {
        throw err;
    }
}

const filterTasksProject = async (project, string) => {
    try {
        const tasks = await taskModel.find({ name: { $regex: string, $options: 'i' }, projectId: project }).sort({ createdAt: -1 });
        return { length: tasks.length, data: tasks }
    } catch (err) { throw err }
}

const getProjectMembers = async (projectId) => {
    try {
        const project = await projectModel.findOne({ _id: projectId })
        return project.membersByName
    } catch (err) { throw err }
}

const projectDashboardApi = async (currentUser, project) => {
    const response = { currentUserTasks: {}, taskAnalytics: {}, activityAnalytics: [], taskRecent: [] }
    response.currentUserTasks['totalSelfTasks'] = await taskModel.countDocuments({ assignedTo: { $in: [currentUser] }, projectId: project });
    response.currentUserTasks['completedSelfTasks'] = await taskModel.countDocuments({ assignedTo: { $in: [currentUser] }, completed: true, projectId: project });
    response.currentUserTasks['incompletedSelfTasks'] = await taskModel.countDocuments({ assignedTo: { $in: [currentUser] }, completed: false, projectId: project });
    response.currentUserTasks['total'] = response.currentUserTasks['totalSelfTasks'] + response.currentUserTasks['completedSelfTasks'] + response.currentUserTasks['incompletedSelfTasks'];
    response.taskAnalytics['totalTasks'] = await taskModel.countDocuments({ projectId: project });
    response.taskAnalytics['completed'] = await taskModel.countDocuments({ projectId: project, completed: true, active: true });
    response.taskAnalytics['in_progress'] = await taskModel.countDocuments({ projectId: project, completed: false, active: true });
    response.taskAnalytics['due'] = await taskModel.countDocuments({ projectId: project, completed: false, dueDate: { $lt: new Date() }, active: true });
    response.activityAnalytics = await getAllTaskActivityForProject(project);
    response.taskRecent = await taskModel.find({ projectId: project }).limit(5).select('name status priority completedHours allocatedHours assignedTo assignedToName createdAt dueDate').sort({ createdAt: -1 })
    response.sectionAnalytics = await taskModel.aggregate([
        { $match: { projectId: project } },
        {
            $group: {
                _id: '$section',
                totalCompletedHours: { $sum: '$completedHours' },
                totalAllocatedHours: { $sum: '$allocatedHours' }
            }
        }
    ]);
    return response
}

const projectListAnalytics = async (user) => {
    const response = { projectStatus: {} }
    const memberObj = user.role !== 'SA' ? { members: user.id } : {}
    response.projectStatus['total'] = await projectModel.countDocuments(memberObj);
    response.projectStatus['completed'] = await projectModel.countDocuments({ completed: true, ...memberObj });
    response.projectStatus['in_progress'] = await projectModel.countDocuments({ completed: false, active: true, ...memberObj });
    response.projectStatus['not_active'] = await projectModel.countDocuments({ completed: false, active: false, ...memberObj });
    return response
}

const createtaskActivity = async (body) => {
    try {
        const { assignedTo } = await taskModel.findById(body.taskId).select('assignedTo');
        const activity = await new taskActivityModel(body).save();
        await createNotification({ text: `@${body.createdBy.name} added a comment on your task`, reciever: assignedTo, link: `/admin/dashboard/projects/${body.projectId}?taskpopup=${body.taskId}` })
        return activity;
    } catch (err) {
        throw err;
    }
}

const getTaskActivities = async (taskId, type) => {
    try {
        const activities = await taskActivityModel.find({ taskId, type }).sort({ createdAt: -1 })
        return activities
    }
    catch (err) {
        throw err;
    }
}

const editTaskActivities = async (taskId, body) => {
    try {
        if (body.status == "Completed") body.completed = true
        const { assignedTo } = await taskModel.findById(taskId).select('assignedTo');
        const activities = await taskActivityModel.updateOne({ _id: taskId }, { $set: body })
        await createNotification({ text: `@${body.createdBy.fullName} updated a comment on your task`, reciever: assignedTo, link: `/admin/dashboard/projects/${body.projectId}` })
        return activities
    }
    catch (err) {
        throw err;
    }
}

const deleteTaskActivities = async (id) => {
    try {
        const activities = await taskActivityModel.deleteOne({ _id: id })
        return activities
    }
    catch (err) {
        throw err;
    }
}

const getProjectSummary = async (project) => {
    try {
        const projectData = await projectModel.findById(project);
        if (!project) throw 'project not found';
        const job = await jobModel.findById(projectData.job)
        const costPH = job.total_breakpoints.cost
        const tasks = await taskModel.find({ projectId: project }); // find all tasks with the current project's projectId
        const completedHours = tasks.reduce((acc, task) => acc + task.completedHours, 0);
        const remainingHours = job.total_breakpoints.hours - completedHours;
        const costUsed = costPH * completedHours
        const remainingBudget = costPH * remainingHours
        const groupBySectionsData = await taskModel.aggregate([
            { $match: { projectId: project } },
            {
                $group: {
                    _id: '$section',
                    totalCompletedHours: { $sum: '$completedHours' },
                    totalAllocatedHours: { $sum: '$allocatedHours' }
                }
            }
        ]);
        const groupedSectionAnalytics = groupBySectionsData.map((section) => {
            const obj = section
            obj.usedCost = costPH * section.totalCompletedHours
            obj.allocatedCost = costPH * section.totalAllocatedHours
            obj.remainingCost = obj.allocatedCost - obj.usedCost
            obj.section = section._id
            delete section._id
            return obj
        })
        const memberAnalytics = await Promise.all(projectData.members.map(async (id) => {
            const groupByMember = await taskModel.aggregate([
                { $match: { assignedTo: id, projectId: project } },
                {
                    $group: {
                        _id: '$section',
                        totalCompletedHours: { $sum: '$completedHours' },
                        totalAllocatedHours: { $sum: '$allocatedHours' }
                    }
                },
                { $project: { _id: 0, assignedTo: '$_id', totalCompletedHours: 1, totalAllocatedHours: 1 } }
            ]);
            const analyticsProcessed = groupByMember.map((analytics) => {
                const obj = analytics
                obj.usedCost = analytics.totalCompletedHours * costPH
                obj.allocatedCost = analytics.totalAllocatedHours * costPH
                obj.remainingCOst = obj.allocatedCost - obj.usedCost
                return obj
            })
            return { user: projectData.membersByName.filter(member => member._id === id)[0], analytics: analyticsProcessed }
        }));

        return {
            cost: costPH,
            completedHours,
            remainingHours,
            completed: projectData.completed,
            costUsed,
            remainingBudget,
            costOverboard: job.total_breakpoints.total_cost < costUsed,
            groupedSectionAnalytics,
            memberAnalytics
        }
    } catch (err) {
        throw err;
    }
}

const employeePerformanceBySA = async (user, query) => {
    try {
        const userId = query.user ? query.user : user.id
        const projects = await projectModel.find({ members: userId }).select('projectName members job createdById createdBy hours estimatedHours client completed createdAt rebar').lean()
        const employeeAnalytics = projects.map(async (project) => {
            const rebarProject = project.rebar
            const model = project.rebar ? rebarJobs.jobModel : jobModel
            let costPH = await model.findOne({ _id: project.job }).select('total_breakpoints perHour').lean()
            // a project can exist without a resolvable linked job (deleted/never-linked job) -
            // fall back to zeroed figures instead of throwing and breaking the whole response
            let revenue = 0
            if (costPH) {
                revenue = rebarProject ? costPH.total_breakpoints.amountBilled : costPH.total_breakpoints.cost * costPH.total_breakpoints.hours
                costPH = rebarProject ? costPH.perHour : costPH.total_breakpoints.cost
            } else {
                costPH = 0
            }
            const groupByMember = await taskModel.aggregate([
                { $match: { assignedTo: userId, projectId: project._id } },
                {
                    $group: {
                        _id: '$section',
                        totalCompletedHours: { $sum: '$completedHours' },
                        totalAllocatedHours: { $sum: '$allocatedHours' }
                    }
                },
                { $project: { _id: 0, assignedTo: '$_id', totalCompletedHours: 1, totalAllocatedHours: 1 } }
            ]);
            const analyticsProcessed = groupByMember.map((analytics) => {
                const obj = analytics
                obj.usedCost = (analytics.totalCompletedHours * costPH).toFixed(2)
                obj.allocatedCost = (analytics.totalAllocatedHours * costPH).toFixed(2)
                obj.remainingCost = (obj.allocatedCost - obj.usedCost).toFixed(2)
                return obj
            })
            const usedCost = analyticsProcessed.reduce((total, analytics) => total + analytics.usedCost, 0)
            const profitability = revenue - usedCost
            const profitabilityPercentage = (profitability / revenue) * 100
            const completedTasks = await taskModel.find({ assignedTo: user.id, projectId: project._id, completed: true }).select('allocatedHours completedHours')
            const totalAllocatedHours = completedTasks.reduce((acc, bcc) => acc + bcc.allocatedHours, 0)
            const totalCompletedHours = completedTasks.reduce((acc, bcc) => acc + bcc.completedHours, 0)
            const efficiency = totalCompletedHours / totalAllocatedHours;
            const efficiencyPercentage = efficiency * 100;

            return {
                project,
                analytics: analyticsProcessed,
                profitability: profitabilityPercentage,
                efficiency: efficiencyPercentage == null ? 0 : efficiencyPercentage
            }
        })
        return await Promise.all(employeeAnalytics)
    } catch (err) {
        console.log(err)
        throw err;
    }
}

const employeePerformanceByEMP = async (user, query) => {
    try {
        const userId = query.user ? query.user : user.id
        const projects = await projectModel.find({ members: userId }).select('projectName members job createdById createdBy hours estimatedHours client completed createdAt').lean()
        const employeeAnalytics = projects.map(async (project) => {
            const groupByMember = await taskModel.aggregate([
                { $match: { assignedTo: userId, projectId: project._id } },
                {
                    $group: {
                        _id: '$section',
                        totalCompletedHours: { $sum: '$completedHours' },
                        totalAllocatedHours: { $sum: '$allocatedHours' }
                    }
                },
                { $project: { _id: 0, assignedTo: '$_id', totalCompletedHours: 1, totalAllocatedHours: 1 } }
            ]);

            const analyticsProcessed = groupByMember.map((analytics) => {
                const obj = {}
                obj.remainingHours = (analytics.totalAllocatedHours - analytics.totalCompletedHours).toFixed(2)
                obj.totalCompletedHours = analytics.totalCompletedHours.toFixed(2)
                obj.totalAllocatedHours = analytics.totalAllocatedHours.toFixed(2)
                obj.assignedTo = analytics.assignedTo
                return obj
            })

            const totalHours = analyticsProcessed.reduce((acc, curr) => acc + parseInt(curr.totalAllocatedHours), 0)
            const totalUsedHours = analyticsProcessed.reduce((acc, curr) => acc + parseInt(curr.totalCompletedHours), 0)
            const completedHoursPercentage = (totalUsedHours / totalHours) * 100
            const remainingHoursPercentage = 100 - completedHoursPercentage

            return {
                project,
                analytics: analyticsProcessed,
                completedHoursPercentage,
                remainingHoursPercentage
            }
        })
        return await Promise.all(employeeAnalytics)
    } catch (err) {
        console.log(err)
        throw err;
    }
}

const completeProject = async (id) => {
    try {
        const project = await projectModel.findOne({ _id: id })
        project.completed = true
        await ProjectDashboardModel.updateOne({ jobId: project.job }, { $set: { toBeReviewedByAccounts: true } })
        for (const member of project.members) {
            await createNotification({ text: `${project.projectName} completed successfully`, reciever: member, link: `/admin/dashboard/projects/${project._id}` })
        }
        await createActivity({ text: `Project Marked Successfully`, projectId: project._id, type: 'PROJECT' })
        await project.save()
        return { id: project._id, project: project.projectName }
    } catch (err) {
        throw err
    }
}

const getAssignedTasks = async (id, pageNumber, project, filterObj) => {
    try {
        const employee = await employeeModel.findById(id).select('role');
        let page = pageNumber >= 1 ? parseInt(pageNumber, 10) : 1;
        const limit = 20;
        let filter = { assignedTo: id, projectId: project };

        if (employee.role === 'SA' && ['all', 'count'].includes(project)) {
            filter = {};
            if (filterObj?.statusFilter) {
                if (filterObj.statusFilter === 'Due') {
                    filter.$expr = { $gt: ["$completedHours", "$allocatedHours"] };
                } else {
                    filter.status = filterObj.statusFilter;
                }
            }
            if (filterObj?.assignedTo) {
                filter.assignedTo = filterObj.assignedTo;
            }
        } else if (employee.role === 'EMP' && ['all', 'count'].includes(project)) {
            if (filterObj?.statusFilter) {
                if (filterObj.statusFilter === 'Due') {
                    filter.$expr = { $gt: ["$completedHours", "$allocatedHours"] };
                } else {
                    filter.status = filterObj.statusFilter;
                }
            }
            delete filter.projectId;
        }

        if (project == 'count') {
            const total = await taskModel.countDocuments(filter);
            return total / limit;
        }

        if (project == 'all') {
            const agg = await taskModel.aggregate([
                { $match: filter },
                { $sort: { createdAt: -1 } },
                {
                    $facet: {
                        data: [
                            { $skip: (page - 1) * limit },
                            { $limit: limit },
                            {
                                $lookup: {
                                    from: 'projects',
                                    localField: 'projectId',
                                    foreignField: '_id',
                                    as: 'project'
                                }
                            },
                            {
                                $addFields: {
                                    projectName: { $ifNull: [{ $arrayElemAt: ["$project.projectName", 0] }, null] }
                                }
                            },
                            { $project: { project: 0 } }
                        ],
                        total: [{ $count: 'count' }],
                        statusCounts: [{ $group: { _id: '$status', count: { $sum: 1 } } }],
                        overdueCount: [
                            {
                                $project: {
                                    completedHoursNum: { $toDouble: { $ifNull: ['$completedHours', 0] } },
                                    allocatedHoursNum: { $toDouble: { $ifNull: ['$allocatedHours', 0] } }
                                }
                            },
                            { $match: { $expr: { $gt: ['$completedHoursNum', '$allocatedHoursNum'] } } },
                            { $count: 'count' }
                        ]
                    }
                }
            ]);

            const resObj = agg[0] || {};
            const response = resObj.data || [];
            const totalTasks = (resObj.total && resObj.total[0] && resObj.total[0].count) ? resObj.total[0].count : 0;
            const statusCountsArr = resObj.statusCounts || [];
            const overdue = (resObj.overdueCount && resObj.overdueCount[0] && resObj.overdueCount[0].count) ? resObj.overdueCount[0].count : 0;

            const statusMap = {};
            statusCountsArr.forEach((s) => { statusMap[String(s._id)] = s.count; });

            const analytics = {
                totalTasks,
                inProgress: statusMap['In Progress'] || statusMap['in_progress'] || statusMap['inProgress'] || 0,
                completed: statusMap['Completed'] || statusMap['completed'] || statusMap['done'] || 0,
                paused: statusMap['Paused'] || statusMap['paused'] || 0,
                review: statusMap['Review'] || statusMap['review'] || 0,
                queued: statusMap['Queue'] || statusMap['Queued'] || statusMap['queued'] || 0,
                overdue: overdue
            };

            return { response, analytics };
        }

        if (['all', 'count'].includes(project)) {
            const responseAgg = await taskModel.aggregate([
                { $match: filter },
                { $sort: { createdAt: -1 } },
                { $skip: (page - 1) * limit },
                { $limit: limit },
                {
                    $lookup: {
                        from: 'projects',
                        localField: 'projectId',
                        foreignField: '_id',
                        as: 'project'
                    }
                },
                {
                    $addFields: {
                        projectName: { $ifNull: [{ $arrayElemAt: ["$project.name", 0] }, null] }
                    }
                },
                { $project: { project: 0 } }
            ]);

            return responseAgg;
        }
        const response = await taskModel.find({ assignedTo: id, projectId: project }).sort({ createdAt: -1 })
        return response
    } catch (err) {
        throw err;
    }
};



const getGeneralProject = async () => {
    try {
        const project = await projectModel.findById('5d518d7a-77eb-4c93-a1db-e2011425a21b')
        return project
    } catch (err) {
        throw err
    }
}

const createProjectCloudFunction = async (body) => {
    try {
        const cloud = await new projectCloudModel(body).save()
        return cloud
    } catch (err) {
        throw err;
    }
}

const getProjectCloudFunction = async (query) => {
    try {
        let page = query.page >= 1 ? query.page : 1;
        page = page - 1
        const limit = 20
        const cloud = await projectCloudModel.find({ projectId: query.id, section: query.section }).limit(limit).skip(limit * page).sort({ createdAt: -1 })
        return cloud
    } catch (err) {
        throw err;
    }
}

const deleteProjectCloudFunction = async (id) => {
    try {
        const cloud = await projectCloudModel.deleteOne({ _id: id })
        return cloud
    } catch (err) {
        throw err;
    }
}

const getProjectAdminDashboardFunction = async () => {
    try {
        const pipeline = [
            {
                $match: {
                    toBeReviewedByAccounts: false,
                    completedStatus: false
                }
            },
            {
                $lookup: {
                    from: "projects",
                    localField: "awardedProjectData.jobId",
                    foreignField: "job",
                    as: "projectData"
                }
            },
            { $unwind: "$projectData" },
            {
                $project: {
                    profit: {
                        $subtract: ["$awardedProjectData.jobData.total_breakpoints.total_cost", {
                            $multiply: ["$awardedProjectData.jobData.total_breakpoints.cost", "$projectData.hours"]
                        }]
                    },
                    totalCost: "$awardedProjectData.jobData.total_breakpoints.total_cost",
                    completedCost: { $multiply: ["$awardedProjectData.jobData.total_breakpoints.cost", "$projectData.hours"] },
                    name: "$projectData.projectName",

                }
            },
            { $sort: { profit: -1 } },
            { $limit: 5 }
        ];
        const projectSorted = await ProjectDashboardModel.aggregate(pipeline);
        const usedCost = projectSorted.reduce((acc, cur) => acc + cur.completedCost, 0)
        const totalCost = projectSorted.reduce((acc, cur) => acc + cur.totalCost, 0)
        const usedPercent = (usedCost / totalCost) * 100
        const [ongoingProjects, pipelineProjects, toBeReviewedByAccounts, completedProjects, latestProjects] = await Promise.all([
            ProjectDashboardModel.countDocuments({ toBeReviewedByAccounts: false, completedStatus: false }),
            jobModel.countDocuments({ awarded: false }),
            ProjectDashboardModel.countDocuments({ toBeReviewedByAccounts: true, completedStatus: false }),
            ProjectDashboardModel.countDocuments({ toBeReviewedByAccounts: true, completedStatus: true }),
            projectModel.find().sort({ createdAt: -1 }).limit(3).lean()
        ]);
        return { ongoingProjects, pipelineProjects, usedPercent, toBeReviewedByAccounts, completedProjects, projectSorted, latestProjects };
    } catch (err) {
        throw err;
    }
};

const getProjectCloudAnalytics = async (query) => {
    try {
        const cloud = await projectCloudModel.aggregate([
            {
                $match: { projectId: query.id }
            },
            {
                $group: {
                    _id: "$section",
                    totalSize: { $sum: "$attributes.size" },
                    users: { $addToSet: "$employeeId" },
                    noOfFiles: { $sum: 1 }
                },
            },
        ])
        return cloud
    } catch (err) {
        throw err;
    }
}

const pinProjectCloud = async (query) => {
    try {
        const cloud = await projectCloudModel.findOne({ _id: query.id })
        const updated = await projectCloudModel.updateOne({ _id: query.id }, { $set: { pinned: !cloud.pinned } }, { new: true })
        return updated
    } catch (err) {
        throw err;
    }
}

const getPinnedProjectCloudFiles = async (query) => {
    try {
        const cloud = await projectCloudModel.find({ projectId: query.id, pinned: true })
        return cloud
    } catch (err) {
        throw err;
    }
}

const searchProjectCloud = async (query) => {
    try {
        const cloud = await projectCloudModel.aggregate([
            {
                $match: { projectId: query.id, section: query.section, fileName: { $regex: new RegExp(query.search, "i") } }
            }
        ]).limit(20)
        return cloud
    } catch (err) {
        throw err;
    }
}

const getProjectsByAdmin = async ({ search, page }) => {
    let cpp = 9
    if (!page) page = 1
    let skip = (page - 1) * cpp

    const [ongoingProjects, pipelineProjects, toBeReviewedByAccounts, completedProjects, latestProjects] = await Promise.all([
        ProjectDashboardModel.countDocuments({ toBeReviewedByAccounts: false, completedStatus: false }),
        jobModel.countDocuments({ awarded: false }),
        ProjectDashboardModel.countDocuments({ toBeReviewedByAccounts: true, completedStatus: false }),
        ProjectDashboardModel.countDocuments({ toBeReviewedByAccounts: true, completedStatus: true }),
        projectModel.find().sort({ createdAt: -1 }).limit(3).lean()
    ]);
    let projects
    if (search && search != '') projects = await projectModel.find({ projectName: { $regex: new RegExp(search, "i") } }).sort({ createdAt: -1 }).limit(cpp).skip(skip)
    else projects = await projectModel.find().sort({ createdAt: -1 }).limit(cpp).skip(skip)
    return { analytics: { ongoingProjects, pipelineProjects, toBeReviewedByAccounts, completedProjects, latestProjects }, projects, page: { currentPage: parseInt(page), maxPages: parseInt(((await projectModel.countDocuments()) / 10).toFixed()) } }
}

const toogleEmployeeRoleinProject = async (query) => {
    try {
        const project = await projectModel.findOne({ _id: query.projectId })
        const user = project.membersByName.find((obj) => obj._id == query.userId)
        if (!user) return
        if (user.role == "AD") {
            if (project.membersByName.filter((user) => user.role == "AD").length <= 1) return
            const response = await projectModel.updateOne({ _id: query.projectId, 'membersByName._id': query.userId }, { $set: { "membersByName.$.role": "EMP" } })
            await createNotification({ text: `You have been demoted to Employee in the ${project.projectName} project `, reciever: user._id, link: `/admin/dashboard/projects/${project._id}` })
            return response
        } else {
            const response = await projectModel.updateOne({ _id: query.projectId, 'membersByName._id': query.userId }, { $set: { "membersByName.$.role": "AD" } })
            await createNotification({ text: `Congratulations! You have been promoted to ADMIN in the ${project.projectName} project`, reciever: user._id, link: `/admin/dashboard/projects/${project._id}` })
            return response
        }
    } catch (err) {
        console.log(err)
        throw err
    }
}

const createDrawing = async ({ name, client, deuDate, estimatedHour, projectId }) => {
    try {
        return await new drawingModel({ name, client, deuDate, estimatedHour, projectId }).save()
    } catch (e) {
        throw e
    }
}

const updateDrawing = async (data) => {
    try {
        const { _id, name, client, deuDate, estimatedHours } = data;
        // 1) fetch and update the drawing record
        const drawing = await drawingModel.findById(_id);
        if (!drawing) throw new Error("Cannot find drawing");

        const oldName = drawing.name;
        if (name) drawing.name = name;
        if (client) drawing.client = client;
        if (deuDate) drawing.deuDate = deuDate;
        if (estimatedHours) drawing.estimatedHours = estimatedHours;
        await drawing.save();

        if (name && oldName !== name) {
            const tasks = await taskModel.find({
                projectId: drawing.projectId,
                drawing: { $regex: oldName }
            });

            for (const t of tasks) {
                t.drawing = t.drawing
                    .split(',')
                    .map(part => part.replace(new RegExp(oldName, 'g'), name))
                    .join(',');
                await t.save();
            }
        }

        return drawing;
    } catch (e) {
        throw e;
    }
};


const getAllDrawing = async ({ projectId }) => {
    try {
        return await drawingModel.find({ projectId })
    } catch (e) {
        throw e
    }
}

const deleteDrawing = async ({ id }) => {
    try {
        return await drawingModel.findByIdAndDelete(id)
    } catch (e) {
        throw e
    }
}

const generateProjectReportsFunction = async (body, user) => {
    try {
        if (body.type.startsWith('Project')) body['metaData'] = await projectModel.findById(body.id).select('projectName')
        const reportUrl = await generateCSVReport(body, user)
        return reportUrl
    } catch (e) {
        throw e
    }
}

const getEmployeeProjectStatsFunction = async () => {
    try {

        let employees = await employeeModel.find({ role: 'EMP' })
        let projects = await projectModel.find({})
        employees = employees.map((e) => {
            return { _id: e._id, projectStats: [], name: `${e.firstName} ${e.lastName}`, joining: e.joining, designation: e.designation }
        })

        projects.forEach((p) => {
            p.members.forEach((memberId) => {
                let search = employees.map((em, i) => { if (em._id == memberId) { return i } else { return -1 } })
                search = search.filter(index => index !== -1);

                if (search.length != 0) {
                    let empPosition = search[0]
                    employees[empPosition].projectStats.push(p)
                }
            })
        })
        return employees
    } catch (error) {
        throw error
    }
}

module.exports = {
    createProject,
    checkProjectPermission,
    getAllProjectsByUser,
    getProjectsByAdmin,
    getSingleProject,
    editSingleProject,
    deleteSingleProject,
    createTask,
    getAllTasks,
    getSingleTasks,
    editSingleTasks,
    deleteSingleTasks,
    AssignTasks,
    getAllEmployees,
    AddProjectMembersTasks,
    getAllProjectTasks,
    createActivity,
    getAllActivities,
    getSingleActivity,
    editSingleActivity,
    deleteSingleActivity,
    projectDashboardApi,
    projectListAnalytics,
    filterTasksProject,
    getSingleProjectByFilter,
    getAllProjectsRaw,
    getProjectMembers,
    RemoveProjectMembers,
    createtaskActivity,
    getTaskActivities,
    editTaskActivities,
    deleteTaskActivities,
    getProjectSummary,
    completeProject,
    getAssignedTasks,
    createProjectCloudFunction,
    getProjectCloudFunction,
    deleteProjectCloudFunction,
    getTotalNumberOfProjectsByUser,
    getProjectCloudAnalytics,
    pinProjectCloud,
    validateTimerToken,
    getPinnedProjectCloudFiles,
    searchProjectCloud,
    searchProject,
    employeePerformanceBySA,
    employeePerformanceByEMP,
    toogleEmployeeRoleinProject,
    getProjectAdminDashboardFunction,
    createDrawing,
    updateDrawing,
    getAllDrawing,
    deleteDrawing,
    getAllProjectTasksCount,
    getEmployeeProjectStatsFunction,
    refreshProjectMembersDetails,
    generateProjectReportsFunction,
    getAllSectionsTasksCount,
    getEmployeeTimerTasksFunction,
    getGeneralProject,
    refreshTaskHrsFunction
}
