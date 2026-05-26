const { jobs: { jobModel, awardedJobsModel, ProjectDashboardModel, jobActivitiesModel, rebarJobsModel }, projects: { projectModel }, employee: { employeeTodoModel, employeeModel }, submissions } = require("../../../Models/Extractor/index")
const { general: { decodeFormula } } = require("../../../Helpers/Extractor/index");
const { createProject, AddProjectMembersTasks } = require('../Project/index')
const { createNotification, sendEmailFunction } = require('../Communication/index')
const generateJobCSV = require("../../../Helpers/Functions/General/generateJobCSV");
const { changeOrderModel } = require("../../../Models/Rebar");
const notifyTaskTemplate = require("../../../Config/Templates/notifyTaskTemplate");
const reportTemplate = require("../../../Config/Templates/reportTemplate");
const getRebarJobDashboard = require('../Rebar/index').getJobDashboard
const { createReportAndUpload , createExcelReportAndUpload } = require('../../../Helpers/Functions/General/reportIntelligence')
const { getPresignedGetUrl } = require('../../../Helpers/Functions/S3/index')
const { withEmailBanner } = require('../../../Helpers/Functions/General/emailBanner')
const { parse } = require('json2csv');
const { taskModel, taskActivityModel, activityModel } = require("../../../Models/Projects");
const { randomUUID } = require("crypto");
const sendEmail = require("../../../Helpers/Functions/Email/sendEmail");

const GetAllJobs = async (query) => {
    try {
        const year = query.year || new Date().getFullYear();
        const jobs = await jobModel.aggregate([
            { $match: { date: { $gte: new Date(year, 0, 1), $lt: new Date(parseInt(year) + 1, 0, 1) } } },
            { $group: { _id: { $month: '$date' }, jobs: { $push: '$$ROOT' } } },
            { $sort: { _id: 1 } },
        ]);
        const jobsProccessed = await Promise.all(jobs.map(async (jobsByMonth) => {
            const monthObj = jobsByMonth
            monthObj.analytics = await getMonthlyJobAnalytics(monthObj._id)
            monthObj.monthName = new Date(2000, monthObj._id - 1).toLocaleString('en-US', { month: 'long' });
            return monthObj
        }))
        const yearlyRevenue = jobsProccessed.reduce((acc, curr) => acc + curr.analytics.total_cost, 0)
        return [jobsProccessed, yearlyRevenue];
    } catch (err) {
        throw err;
    }
};

const GetAllPendingJobs = async (query) => {
    try {
        const year = query.year || new Date().getFullYear();
        const jobs = await jobModel.aggregate([
            { $match: { date: { $gte: new Date(year, 0, 1), $lt: new Date(parseInt(year) + 1, 0, 1) }, pending: true } },
            { $group: { _id: { $month: '$date' }, jobs: { $push: '$$ROOT' } } },
            { $sort: { _id: 1 } },
        ]);
        const jobsProccessed = await Promise.all(jobs.map(async (jobsByMonth) => {
            const monthObj = jobsByMonth
            monthObj.monthName = new Date(2000, monthObj._id - 1).toLocaleString('en-US', { month: 'long' });
            return monthObj
        }))
        return [jobsProccessed];
    } catch (err) {
        throw err;
    }
};

const getMonthlyJobAnalytics = async (month) => {
    const jobs = await jobModel.find({
        pending: false,
        $expr: {
            $eq: [{ $month: '$date' }, month]
        }
    }).select('total_breakpoints')
    const sumObject = jobs.reduce((acc, curr) => {
        Object.keys(curr.total_breakpoints).forEach(key => {
            acc[key] = (acc[key] || 0) + curr.total_breakpoints[key];
            acc[key] = parseInt(acc[key])
        });
        delete acc.percent
        return acc;
    }, {});
    sumObject.count = jobs.length
    return sumObject
}

const CreateJob = async (body) => {
    try {
        const job = new jobModel(body).save();
        [body.assignedSales, body.assignedSecondarySales, body.assignedThirdSales, body.assignedConnectionEngineer]
            .filter(Boolean)
            .forEach(async (id) => {
            const employee = await employeeModel.findById(id).select('email firstName lastName')
            const templateCode = notifyTaskTemplate(
                await withEmailBanner({
                    name: employee.firstName + ' ' + employee.lastName,
                    project: body.project,
                    task: '',
                    message: `New Job Assigned ${body.project} . Please log in to dashboard for more details`,
                    link: `https://vectorshades-frontend.vercel.app`
                }))
            await sendEmailFunction({ to: employee.email, subject: `New Job Assigned ${body.project}`, html: templateCode })
        })
        return job;
    } catch (err) {
        throw err;
    }
}

const patchJob = async (body, id) => {
    try {
        body.lastUpdated = new Date().now
        const updatedJob = await jobModel.findOneAndUpdate({ _id: body._id }, { $set: body });
        const job = await jobModel.findOne({ _id: body._id });
        if (job.awarded === true && body.yetToBeAwarded === undefined) {
            await projectModel.findOneAndUpdate({ job: body._id }, { $set: { projectName: body.project } });
            const addMembers = []
            const project = await projectModel.findOne({ job: body._id })
            if (!project.members.includes(body.assignedSales)) addMembers.push(body.assignedSales)
            if (!project.members.includes(body.assignedSecondarySales)) addMembers.push(body.assignedSecondarySales)
            if (!project.members.includes(body.assignedThirdSales)) addMembers.push(body.assignedThirdSales)
            if (!project.members.includes(body.assignedConnectionEngineer)) addMembers.push(body.assignedConnectionEngineer)
            let members = await employeeModel.find({ _id: { $in: addMembers } }).select("firstName lastName email designation _id").lean()
            members = members.map(async (data) => {
                await createNotification({ text: `you have been assigned a project : ${project.projectName}`, reciever: data._id, link: `/admin/dashboard/projects/${project._id}` })
                return { ...data, role: 'AD' }
            })
            project.members = project.members.concat(addMembers)
            project.membersByName = project.membersByName.concat(members)
            await project.save()
        }
        return updatedJob
    } catch (err) {
        throw err;
    }
}

const DeleteJob = async (query) => {
    try {
        const jobId = query.id
        const job = await jobModel.findByIdAndDelete(jobId);
        if (!job) throw { message: "Job not found" };
        await awardedJobsModel.deleteOne({ jobId });
        await ProjectDashboardModel.deleteOne({ jobId });
        await jobActivitiesModel.deleteMany({ jobId });
        const project = await projectModel.findOneAndDelete({ job: jobId });
        if (project) {
            await taskModel.deleteMany({ projectId: project._id });
            await taskActivityModel.deleteMany({ projectId: project._id });
            await activityModel.deleteMany({ projectId: project._id });
        }

        return { message: "Job and all related data successfully deleted" };
    } catch (error) {
        console.error("Error deleting job and related data:", error);
        throw error;
    }
}

const GetJob = async (query) => {
    try {
        let document = await jobModel.findOne({ _id: query.id })
        let activity = await getJobActivity(query.id)
        return { job: document, activity }
    } catch (err) {
        throw err
    }
}

const generateDashboardReport = async (user, body) => {
    const query = {};

    if (body.month && body.year) {
        const startDate = new Date(body.year, body.month - 1, 1); // Start of the month
        const endDate = new Date(body.year, body.month, 0, 23, 59, 59, 999); // End of the month
        query.createdAt = { $gte: startDate, $lte: endDate };
    }

    const dashboardProjects = await ProjectDashboardModel.find(query)
        .sort('-createdAt')
        .lean()
        .select('-__v -_id -awardedProjectId');

    const cleanedProjects = dashboardProjects.map(project => {
        const { awardedProjectData, ...filteredProject } = project;
        const additionalFields = {
            name: awardedProjectData?.jobData?.project || '',
            jobNumber: awardedProjectData.jobNumber || '',
            client: awardedProjectData?.jobData?.client || '',
            location: awardedProjectData?.location || '',
        };
        const finalObj = {
            ...additionalFields,
            ...filteredProject,
        };
        delete finalObj.OFABacklogFormula
        delete finalObj.FABBacklogFormula
        delete finalObj.awardedProjectData
        return finalObj
    });

    const id = randomUUID()

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const fileLocation = await createExcelReportAndUpload(cleanedProjects, {
        createdBy: user.id,
        file: !body.month && !body.year ? `dashboard-report-${new Date().getFullYear()}.xlsx` : `dashboard-report-${monthNames[body.month - 1]}`
    });

    // const messagePayload = {
    //     name: user.name,
    //     message: `Your Dashboard Report is generated successfully with Unique ID ${id} . Please Reference this email to view the report .`,
    //     reportType: 'Project Dashboard Steel',
    //     generatedAt: new Date().toDateString(),
    //     url: fileLocation
    // }

    // const template = reportTemplate(messagePayload)

    // await sendEmailFunction({ to: user.email, subject: `Your Dashboard Report Generated - ${id}`, html: template })
    return getPresignedGetUrl(fileLocation);
}

const generateSubmissionsReport = async (user) => {
    try {
        const submissionsData = await submissions.submissionsModel.find().lean()
        const id = randomUUID()

        const fileLocation = await createExcelReportAndUpload(submissionsData, {
            createdBy: user.id,
            file: `submission-report-${new Date().getFullYear()}.xlsx`
        });

        const messagePayload = {
            name: user.name,
            message: `Your Submissions Report is generated successfully with Unique ID ${id} . Please Reference this email to view the report .`,
            reportType: 'Submissions Steel',
            generatedAt: new Date().toDateString(),
            url: getPresignedGetUrl(fileLocation)
        }

        const template = reportTemplate(await withEmailBanner(messagePayload))
        return getPresignedGetUrl(fileLocation);
    } catch (err) {
        console.log(err)
        throw err
    }
}

const generateReportJob = async (id) => {
    try {
        const job = await jobModel.findOne({ _id: id }).lean();
        const activity = await getJobActivity(id);
        const changeOrders = await changeOrderModel.find({ jobId: id }).lean();

        const { total_breakpoints = {}, sub_items = [], ...jobDetails } = job;

        const totalSection = [{
            Hours: String(total_breakpoints.hours || 0),
            TotalCost: String(total_breakpoints.total_cost || 0),
            Bid: String(total_breakpoints.bid || 0),
            BidHour: String(total_breakpoints.bid_hour || 0),
            EngFee: String(total_breakpoints.eng_fee || 0),
            Percent: String(total_breakpoints.percent || 0),
            Cost: String(total_breakpoints.cost || 0)
        }];

        const jobPointsSection = sub_items.map((point) => ({
            Cost: String(point.cost || 0),
            Point: String(point.point || ''),
            Hours: String(point.hours || 0),
            TotalCost: String(point.total_cost || 0),
            Bid: String(point.bid || 0),
            BidHour: String(point.bid_hour || 0),
            EngFee: String(point.eng_fee || 0),
            Percent: String(point.percent || 0)
        }));

        const activitySection = activity.map((act) => ({
            ...act,
            createdAt: new Date(act.createdAt).toLocaleString()
        }));

        const changeOrderSection = changeOrders.map((order) => ({
            ...order,
            createdAt: new Date(order.createdAt).toLocaleString()
        }));

        let fullCSV = '';

        if (Object.keys(jobDetails).length > 0) {
            const csvJobDetails = parse([jobDetails], { header: true });
            fullCSV += 'Job Details\n' + csvJobDetails + '\n\n';
        } else {
            fullCSV += 'Job Details\nNo job data available\n\n';
        }

        if (jobPointsSection.length > 0) {
            const csvJobPoints = parse(jobPointsSection, { header: true });
            fullCSV += 'Job Points\n' + csvJobPoints + '\n\n';
        } else {
            fullCSV += 'Job Points\nNo job points available\n\n';
        }

        if (totalSection.length > 0) {
            const csvTotal = parse(totalSection, { header: true });
            fullCSV += 'Total\n' + csvTotal + '\n\n';
        } else {
            fullCSV += 'Total\nNo total data available\n\n';
        }

        if (activitySection.length > 0) {
            const csvActivity = parse(activitySection, { header: true });
            fullCSV += 'Job Activity\n' + csvActivity + '\n\n';
        } else {
            fullCSV += 'Job Activity\nNo activity data available\n\n';
        }

        if (changeOrderSection.length > 0) {
            const csvChangeOrders = parse(changeOrderSection, { header: true });
            fullCSV += 'Change Orders\n' + csvChangeOrders + '\n\n';
        } else {
            fullCSV += 'Change Orders\nNo change order data available\n\n';
        }

        const report = await generateJobCSV(job, fullCSV);
        return report;

    } catch (err) {
        throw err;
    }
}

const awardJob = async (body, user) => {
    try {
        const { job } = await GetJob({ id: body.jobId })
        if (job) {
            body.jobData = job
            body.total = job.total_breakpoints
            const awardCount = await awardedJobsModel.countDocuments()
            body.serialNumber = awardCount + 1
            const jobAwarded = new awardedJobsModel(body).save().then(async (res) => {
                const job = await jobModel.findById(body.jobId)
                job.awarded = true
                job.location = body.location
                job.awardedId = res._id
                await job.save()
                let dashboardData = Object.assign(body, {})
                delete dashboardData._id
                dashboardData.awardedProjectId = res._id
                dashboardData.awardedProjectData = res
                dashboardData.jobId = body.jobId
                dashboardData.po_price = job.total_breakpoints.bid
                dashboardData.co_price = 0
                dashboardData.assignedTo = body.user
                dashboardData.awardDate = res.date
                dashboardData.bidHours = job.total_breakpoints.hours
                const newProjectDashboardData = await new ProjectDashboardModel(dashboardData).save()
                const ids = [dashboardData.assignedTo, body.jobData.assignedSales, body.jobData.assignedSecondarySales,body.jobData.assignedThirdSales,body.jobData.assignedConnectionEngineer];
                const userObjects = await employeeModel
                    .find({ _id: { $in: ids } })
                    .select("firstName lastName email designation _id")
                    .lean();
                const updatedUserObjects = userObjects.map(user => ({ ...user, role: 'AD' }));
                const projectData = { job: job._id, members: ids,location:job.location, membersByName: updatedUserObjects, estimatedHours: newProjectDashboardData.bidHours, client: job.client, projectName: job.project, description: res.notes }
                const data = await createProject(projectData, user)
                await createNotification({ text: `You have been assigned a project : ${job.project}`, reciever: dashboardData.assignedTo, link: `/admin/dashboard/projects/${data._id}` })

                const employees = await employeeModel.find({ _id: { $in: ['805aea60-d2c9-4466-a302-1789a0e78b15', 'd3c6a0b9-37fd-4a7a-9b2d-7f55e4ac786d'] } }).select('email firstName lastName');

                await Promise.all(
                    employees.map(async (employee) => {
                        const fullName = `${employee.firstName} ${employee.lastName}`;

                        await createNotification({
                            text: `You have been assigned a project : ${job.project}`,
                            reciever: employee._id,
                            link: `/admin/dashboard/projects/${data._id}`
                        });

                        const templateCode = notifyTaskTemplate(
                            await withEmailBanner({
                            name: fullName,
                            project: job.project,
                            task: job.project,
                            message: 'You have been awarded a project. Please log in to dashboard for more details',
                            link: `https://vectorshades-frontend.vercel.app/admin/dashboard/projects/${data._id}`
                        }));

                        await sendEmailFunction({
                            to: employee.email,
                            subject: `You Have been Awarded a project`,
                            html: templateCode
                        });
                    })
                );

                return res
            })
            return jobAwarded
        } else throw { message: "job not found : " + body.jobId }
    }
    catch (err) {
        console.log(err)
        throw err
    }
}

const GetAwardedJobs = async (pageNumber, query) => {
    try {
        const year = query.year || new Date().getFullYear();
        let page = pageNumber >= 1 ? pageNumber : 1;
        page = page - 1;
        const jobsPerPage = 15;
        const awarded = await awardedJobsModel
            .aggregate([
                { $match: { date: { $gte: new Date(year, 0, 1), $lt: new Date(parseInt(year) + 1, 0, 1) } } },
                { $group: { _id: { $month: '$date' }, jobs: { $push: '$$ROOT' } } },
                { $sort: { createdAt: -1 } },
            ])
        const jobsProccessed = await Promise.all(awarded.map(async (jobsByMonth) => {
            const monthObj = jobsByMonth
            monthObj.analytics = await getMonthlyAwardedJobAnalytics(monthObj._id)
            monthObj.monthName = new Date(2000, monthObj._id - 1).toLocaleString('en-US', { month: 'long' });
            return monthObj
        }))
        const result = await awardedJobsModel.aggregate([
            {
                $group: {
                    _id: null,
                    totalCost: { $sum: { $ifNull: ["$jobData.total_breakpoints.total_cost", 0] } }
                }
            }
        ]);

        const totalCost = result.length > 0 ? result[0].totalCost : 0;
        return { data: jobsProccessed, cost: totalCost };
    } catch (err) {
        throw err;
    }
};

// const GetDashbBoardJobs = async (query) => {
//     try {
//         // let page = pageNumber >= 1 ? pageNumber : 1;
//         // page = page - 1
//         // const jobsPerPage = 15
//         const awarded = await ProjectDashboardModel.find({
//             $expr: {
//                 $eq: [{ $month: '$created' }, query.month]
//             }
//         }).sort({ created: -1 })
//         return awarded
//     }
//     catch (err) { throw err }
// }

const GetDashbBoardJobs = async (query, user) => {
    try {
        const year = query.year || new Date().getFullYear();
        const jobs = await ProjectDashboardModel.aggregate([
            { $match: { "awardDate": { $gte: new Date(year, 0, 1), $lt: new Date(parseInt(year) + 1, 0, 1) }, completedStatus: query.completed ? true : false } },
            { $group: { _id: { $month: '$awardDate' }, jobs: { $push: '$$ROOT' } } },
            { $sort: { _id: -1 } },
        ]);

        const jobsProcessed = await Promise.all(jobs.map(async (jobsByMonth) => {
            const monthObj = jobsByMonth
            monthObj.analytics = await getMonthlyDashboardJobAnalytics(monthObj._id)
            monthObj.monthName = new Date(2000, monthObj._id - 1).toLocaleString('en-US', { month: 'long' });
            return monthObj
        }))
        const yearlyBill = 42500
        return [jobsProcessed, yearlyBill];
    } catch (err) {
        throw err;
    }
};

const getMonthlyDashboardJobAnalytics = async (month) => {
    const jobs = await ProjectDashboardModel.find({
        $expr: {
            $eq: [{ $month: '$created' }, month]
        }
    }).select('finalBalance backlogHours usedHours co_hours bidHours FABBacklog OFABacklog billed billing_backlog co_price po_price').lean()

    const sumObject = jobs.reduce((acc, curr) => {
        Object.keys(curr).forEach(key => {
            acc[key] = (acc[key] || 0) + curr[key];
        });
        delete acc._id
        return acc;
    }, {});
    return sumObject
}

const getMonthlyAwardedJobAnalytics = async (month) => {
    const jobs = await jobModel.find({
        awarded: true,
        $expr: {
            $eq: [{ $month: '$date' }, month]
        }
    }).select('total_breakpoints')
    const sumObject = jobs.reduce((acc, curr) => {
        Object.keys(curr.total_breakpoints).forEach(key => {
            acc[key] = (acc[key] || 0) + curr.total_breakpoints[key];
            acc[key] = parseInt(acc[key])
        });
        delete acc.percent
        return acc;
    }, {});
    sumObject.count = jobs.length
    return sumObject
}


const patchAwardedJob = async (body, id) => {
    try {
        const updatedAwardedJob = await awardedJobsModel.findOneAndUpdate({ _id: body._id }, { $set: body });
        const dashboardJob = await ProjectDashboardModel.findOne({ jobId: body.jobId })
        dashboardJob.awardedProjectData = body
        await ProjectDashboardModel.findOneAndUpdate({ jobId: body.jobId }, { $set: dashboardJob })
        return updatedAwardedJob
    } catch (err) {
        throw err;
    }
}

const patchDashboardJob = async (body, id) => {
    try {
        const updatedDashboardJob = await ProjectDashboardModel.findOneAndUpdate({ _id: body._id }, { $set: body });
        return updatedDashboardJob;
    } catch (err) {
        throw err;
    }
}

const getAwardedJobByJob = async (id) => {
    try {
        const detailedAwardedJob = await awardedJobsModel.findOne({ jobId: id });
        return detailedAwardedJob
    } catch (err) {
        throw err;
    }
}

const getAwardedJob = async (id) => {
    try {
        const detailedAwardedJob = await awardedJobsModel.findOne({ _id: id });
        return detailedAwardedJob
    } catch (err) {
        throw err;
    }
}

const getJobActivity = async (id) => {
    try {
        const jobActivity = await jobActivitiesModel.find({ jobId: id }).sort({ createdAt: -1 }).lean()
        return jobActivity
    } catch (err) {
        throw err
    }
}

const getTotalNumberofJobs = async (query) => {
    try {
        if (!query.month) query.month = new Date().getMonth()
        const count = jobModel.find({
            $expr: {
                $eq: [{ $month: '$createdAt' }, query.month]
            }
        }).count()
        return count
    } catch (err) { throw err }
}


const getTotalNumberofAwardedJobs = async () => {
    try {
        const count = await awardedJobsModel.count()
        return count
    } catch (err) { throw err }
}

// const getFilterdJobs = async (query) => {
//     try {
//         const jobs = await jobModel.find({ project: { $regex: query.job, "$options": "i" } }).sort({ date: query.sortkey })
//         return jobs
//     } catch (err) { throw err }
// }

const getFilterdJobs = async (query) => {
    try {
        const year = query.year || new Date().getFullYear();
        const jobs = await jobModel.aggregate([
            {
                $match: {
                    date: {
                        $gte: new Date(year, 0, 1),
                        $lt: new Date(parseInt(year) + 1, 0, 1),
                    },
                    project: { $regex: query.job, $options: "i" },
                },
            },
        ]);

        const jobsProcessed = await Promise.all(
            jobs.map(async (job) => {
                const monthObj = {
                    _id: new Date(job.date).getMonth() + 1,
                    jobs: [job],
                };
                monthObj.analytics = await getMonthlyJobAnalytics(monthObj._id)
                monthObj.monthName = new Date(2000, monthObj._id).toLocaleString(
                    "en-US",
                    { month: "long" }
                );
                return monthObj;
            })
        );

        return jobsProcessed
    } catch (err) {
        throw err;
    }
};

// const getFilterdAwardedJobs = async (query) => {
//     try {
//         const jobs = await awardedJobsModel.find({ 'jobData.project': { $regex: query.job, "$options": "i" } }).sort({ date: query.sortkey })
//         return jobs
//     } catch (err) { throw err }
// }

const getFilterdAwardedJobs = async (query) => {
    try {
        const awarded = await awardedJobsModel.find({
            'jobData.project': { $regex: query.job, $options: 'i' },
        });

        const groupedByMonth = {};

        awarded.forEach((job) => {
            const date = new Date(job.date);
            const month = date.getMonth() + 1;
            const monthName = date.toLocaleString('default', { month: 'long' });

            if (!groupedByMonth[month]) {
                groupedByMonth[month] = {
                    monthNumber: month,
                    monthName: monthName,
                    jobs: [],
                };
            }

            groupedByMonth[month].jobs.push(job);
        });

        const groupedArray = Object.values(groupedByMonth);
        return groupedArray;
    } catch (err) {
        throw err;
    }
};

const getJobDashboard = async (user) => {
    try {
        const isSuperAdmin = user.role === 'SA'
        const startOfMonth = new Date()
        startOfMonth.setDate(1)
        startOfMonth.setHours(0, 0, 0, 0);
        const endOfMonth = new Date();
        endOfMonth.setMonth(endOfMonth.getMonth() + 1);
        endOfMonth.setDate(1);
        endOfMonth.setHours(0, 0, 0, 0);
        const startYear = new Date(`${startOfMonth.getFullYear()}-01-01`);
        const endYear = new Date(`${startOfMonth.getFullYear()}-12-31`);
        const endYearMonthly = startOfMonth.getFullYear();
        const endMonthMonthly = startOfMonth.getMonth();
        const projectCondition = isSuperAdmin ? {} : { rebar: false }

        let [totalSales, totalJobs, awardedJobs, ongoingProjects, completedProjects, latestProjects, employeeTODO, latestSingleProject, yearlySales, monthlySales, pendingAwarded, profitProjects, allProjects] = await Promise.all([
            jobModel.aggregate([{ $group: { _id: null, totalCost: { $sum: "$total_breakpoints.total_cost" } } }]),
            jobModel.find({ createdAt: { $gte: startOfMonth, $lt: endOfMonth } }).count(),
            jobModel.find({ createdAt: { $gte: startOfMonth, $lt: endOfMonth }, awarded: true }).count(),
            projectModel.find({ completed: false, active: true, ...projectCondition }).count(),
            projectModel.find({ completed: true, ...projectCondition }).count(),
            projectModel.find(projectCondition).sort({ createdAt: -1 }).limit(5).select('createdAt status client estimatedHours hours createdBy projectName'),
            employeeTodoModel.find({ status: 'TD', employeeId: user.id }).sort({ createdAt: -1 }).limit(5).select('title createdAt'),
            projectModel.findOne({ completed: true, ...projectCondition }).sort({ updatedAt: -1 }).select('projectName client hours estimatedHours createdBy'),
            jobModel.aggregate([{ $match: { createdAt: { $gte: startYear, $lte: endYear } } }, { $group: { _id: null, totalCost: { $sum: "$total_breakpoints.total_cost" } } }]),
            jobModel.aggregate([{ $match: { createdAt: { $gte: startOfMonth, $lt: endOfMonth } } }, { $group: { _id: null, totalCost: { $sum: "$total_breakpoints.total_cost" } } }]),
            jobModel.aggregate([{ $match: { awarded: false } }, { $group: { _id: null, totalCost: { $sum: "$total_breakpoints.total_cost" } } }]),
            projectModel.find({ completed: true, ...projectCondition }).select('hours estimatedHours job _id'),
            projectModel.find({ active: true, completed: false, ...projectCondition }).select('hours estimatedHours job projectName'),
            getRebarJobDashboard(user.id)
        ])

        let rebarDashboard;

        if (isSuperAdmin) rebarDashboard = await getRebarJobDashboard(user.id)

        let profitGenerated = profitProjects.map(async (project) => {
            const job = await jobModel.findById(project.job)
            const cost = job.total_breakpoints.cost
            const savedHours = project.estimatedHours - project.hours
            const saved = savedHours * cost
            return saved
        })

        profitGenerated = await (await Promise.all(profitGenerated)).reduce((acc, curr) => acc + curr, 0)

        const totalClient = 5;

        let projectProfits = await Promise.all(allProjects.map((project) => {
            if (project.estimatedHours > project.hours) {
                const response = jobModel.findOne({ _id: project.job }).select('total_breakpoints').then((job, err) => {
                    const costPH = job !== null ? job.total_breakpoints.cost : 0;
                    const profit = (project.estimatedHours - project.hours) * costPH
                    const percent = (profit / (project.estimatedHours * costPH)) * 100
                    return { project: project.projectName, profit: profit, range: project.estimatedHours, percent };
                })
                return response
            } else null
        }
        ))

        projectProfits = projectProfits.filter((e) => e !== null).sort((a, b) => b.percent - a.percent).slice(0, 3)


        const returnObject = {
            totalSales: totalSales.length > 0 ? totalSales : [{ totalCost: 0 }],
            totalJobs,
            awardedJobs,
            ongoingProjects,
            totalClient,
            completedProjects,
            latestProjects,
            employeeTODO,
            latestSingleProject,
            yearlySales: yearlySales.length > 0 ? yearlySales[0].totalCost : 0,
            monthlySales: monthlySales.length > 0 ? monthlySales[0].totalCost : 0,
            pendingAwarded: pendingAwarded.length > 0 ? pendingAwarded[0].totalCost : 0,
            profitGenerated,
            projectProfits
        }

        if (isSuperAdmin) {
            returnObject.totalSales = [{ totalCost: returnObject.totalSales[0].totalCost + rebarDashboard.totalSales[0].totalCost }]
            returnObject.totalJobs = returnObject.totalJobs + rebarDashboard.totalJobs
            returnObject.awardedJobs = returnObject.awardedJobs + rebarDashboard.awardedJobs
            returnObject.yearlySales = returnObject.yearlySales + rebarDashboard.yearlySales[0].totalCost
            returnObject.monthlySales = returnObject.monthlySales + rebarDashboard.monthlySales[0].totalCost,
                returnObject.pendingAwarded = returnObject.pendingAwarded + rebarDashboard.pendingAwarded,
                returnObject.profitGenerated = returnObject.profitGenerated + rebarDashboard.profitGenerated
        }

        return returnObject
    } catch (err) {
        console.log(err)
        throw err
    }
}

// const getFilterdProjects = async (query) => {
//     try {
//         const jobs = await ProjectDashboardModel.find({ 'awardedProjectData.jobData.project': { $regex: query.job, "$options": "i" } })
//         return jobs
//     } catch (err) { throw err }
// }

const createChangeOrderReport = async (query) => {
    try {
        const changeOrders = await changeOrderModel.find({ jobId: query.id }).lean()
        const updatedArray = changeOrders.map(item => ({
            ...item,
            detailer: `${item.detailer.firstName.trim()} ${item.detailer.lastName.trim()}`
        }));
        const report = await createReportAndUpload(updatedArray, { createdBy: randomUUID(), file: query.file + '.xlsx' })
        return report
    } catch (err) {
        throw err;
    }
};

const getFilterdProjects = async (query) => {
    try {
        const jobs = await ProjectDashboardModel.aggregate([
            {
                $match: {
                    completedStatus: query.completed ? true : false,
                    'awardedProjectData.jobData.project': {
                        $regex: query.job,
                        $options: 'i',
                    },
                },
            },
            { $group: { _id: { $month: '$created' }, jobs: { $push: '$$ROOT' } } },
        ]);

        const jobsProcessed = await Promise.all(
            jobs.map(async (jobsByMonth) => {
                const monthObj = jobsByMonth;
                monthObj.analytics = await getMonthlyDashboardJobAnalytics(monthObj._id);
                monthObj.monthName = new Date(2000, monthObj._id - 1).toLocaleString('en-US', { month: 'long' });
                return monthObj;
            })
        );

        return jobsProcessed
    } catch (err) {
        throw err;
    }
};

const getEmployeeSalesPerfomance = async (query, user) => {
    try {
        const data = await jobModel.aggregate([
            { $match: {} },
            {
                $group: {
                    _id: "$assignedSales",
                    jobCount: { $sum: 1 },
                    totalCost: { $sum: "$total_breakpoints.total_cost" }
                }
            },
            {
                $lookup: {
                    from: "projects",
                    localField: "_id",
                    foreignField: "members",
                    as: "projects"
                }
            },
            {
                $addFields: {
                    completedProjectCount: {
                        $size: {
                            $filter: {
                                input: "$projects",
                                as: "project",
                                cond: { $eq: ["$$project.completed", true] }
                            }
                        }
                    },
                    notCompletedProjectCount: {
                        $size: {
                            $filter: {
                                input: "$projects",
                                as: "project",
                                cond: { $eq: ["$$project.completed", false] }
                            }
                        }
                    }
                }
            },
            {
                $lookup: {
                    from: "employees",
                    localField: "_id",
                    foreignField: "_id",
                    as: "employee"
                }
            },
            {
                $project: {
                    _id: 1,
                    jobCount: 1,
                    totalCost: 1,
                    completedProjectCount: 1,
                    notCompletedProjectCount: 1,
                    employeeDetails: {
                        $arrayElemAt: ["$employee", 0]
                    }
                }
            },
            {
                $project: {
                    _id: 1,
                    "employeeDetails.firstName": 1,
                    "employeeDetails.lastName": 1,
                    "employeeDetails.email": 1,
                    jobCount: 1,
                    totalCost: 1,
                    completedProjectCount: 1,
                    notCompletedProjectCount: 1,

                }
            }
        ]);

        let updatedData = data.map(({ _id, ...rest }) => { if (rest.employeeDetails) return { ...rest } }).filter(Boolean);

        if (query.report) {
            const processedData = updatedData.map((obj) => {
                const responseObj = {
                    employee: obj.employeeDetails.firstName + ' ' + obj.employeeDetails.lastName,
                ...obj
                }
                delete responseObj.employeeDetails


                return responseObj
            })
            const id = randomUUID()
            const fileLocation = await createReportAndUpload(processedData, {
                createdBy: '',
                file: `${id}-sales-report.xlsx`
            });

            const messagePayload = {
                name: user.name,
                message: `Your Sales Performance Report is generated successfully with Unique ID ${id} . Please Reference this email to view the report .`,
                reportType: 'Sales Performance Steel',
                generatedAt: new Date().toDateString(),
                url: getPresignedGetUrl(fileLocation)
            }

            const template = reportTemplate(await withEmailBanner(messagePayload))
            await sendEmailFunction({ to: user.email, subject: `Your Sales Performance Report Generated - ${id}`, html: template })
            return {}
        }

        return updatedData
    } catch (err) { throw err }
}

const getRebarJobList = async () => {
    try {
        const rebarList = await rebarJobsModel.find().limit(10)
        return rebarList
    } catch (err) {
        throw err;
    }
}


const getRebarJob = async (id) => {
    try {
        const rebarDetails = await rebarJobsModel.findOne({ jobId: id });
        const jobDetails = await jobModel.findOne({ _id: id })
        return { rebarDetails, jobDetails }
    } catch (err) {
        throw err;
    }
}

const updateRebarJob = async (id, payload) => {
    try {
        const updatedRebarDetails = await rebarJobsModel.updateOne({ jobId: id }, { $set: payload });
        return updatedRebarDetails
    } catch (err) {
        throw err;
    }
}

const getRebarJobs = async () => {
    try {
        let updatedRebarDetails = await rebarJobsModel.find().lean()
        updatedRebarDetails = await Promise.all(
            updatedRebarDetails.map(async (job) => {
                job['jobDetails'] = await jobModel.findOne({ _id: job.jobId }).select('client  lastUpdated date project sub_items');
                return job;
            })
        );
        return updatedRebarDetails;
    } catch (err) {
        throw err;
    }
}

const getSubmissions = async (query) => {
    try {
        const filter = {}
        const sort = {}
        if (query.id) filter.jobId = query.id
        if (query.sortKey) sort[query.sortKey] = query.sortOrder === 'asc' ? 1 : -1
        if (query.search) filter.$or = [{ client: { $regex: query.search, $options: 'i' } }, { Project: { $regex: query.search, $options: 'i' } }, { location: { $regex: query.search, $options: 'i' } }]
        if (query.client) filter.client = query.client
        if (query.project) filter.Project = query.project
        if (query.location) filter.location = query.location
        const page = query.page ? parseInt(query.page) : 1;
        const perPage = 15;
        const skip = (page - 1) * perPage;
        const totalSubmissions = await submissions.submissionsModel.countDocuments(filter);
        const totalPages = Math.ceil(totalSubmissions / perPage);
        let data = await submissions.submissionsModel.find(filter).limit(perPage).skip(skip).sort(sort);
        return {
            data,
            page: {
                currentPage: page,
                totalPages
            }
        };
    } catch (err) {
        throw err;
    }
}

const createSubmission = async (body) => {
    try {
        const job = await jobModel.findOne({ _id: body.jobId })
        const project = await projectModel.findOne({ job: job._id })
        body.projectNo = project.projectNo
        body.client = job.client
        body.jobNo = job.jobNo
        body.Project = project.projectName
        let data = await new submissions.submissionsModel(body).save()
        return { data }
    } catch (err) {
        throw err
    }
}

const deleteSubmission = async (id) => {
    try {
        let data = await submissions.submissionsModel.deleteOne({ id })
        return data
    } catch (err) {
        throw err
    }
}

const getChangeOrders = async (jobId) => {
    try {
        const changeOrders = await changeOrderModel.find({ jobId })
        return changeOrders
    } catch (err) {
        throw err;
    }
}

const createChangeOrder = async (body) => {
    try {
        const jobData = await jobModel.findById(body.jobId)
        body.clientName = jobData.client
        body.jobName = jobData.project
        if (!body.perHour) body.perHour = jobData.perHour
        const newChangeOrder = await new changeOrderModel(body).save()
        return newChangeOrder
    } catch (err) {
        throw err;
    }
}

const updateChangeOrder = async (body) => {
    try {
        const updatedChangeOrder = await changeOrderModel.updateOne({ _id: body._id }, { $set: body })
        return updatedChangeOrder
    } catch (err) {
        throw err;
    }
}

const deleteChangeOrder = async (id) => {
    try {
        const deletedChangeorder = await changeOrderModel.deleteOne({ _id: id })
        return deletedChangeorder
    } catch (err) {
        throw err;
    }
}

module.exports = {
    GetAllJobs,
    CreateJob,
    patchJob,
    DeleteJob,
    GetJob,
    awardJob,
    GetAwardedJobs,
    patchAwardedJob,
    getAwardedJobByJob,
    getAwardedJob,
    GetDashbBoardJobs,
    patchDashboardJob,
    getJobActivity,
    getTotalNumberofJobs,
    getTotalNumberofAwardedJobs,
    getFilterdJobs,
    getFilterdAwardedJobs,
    getFilterdProjects,
    generateReportJob,
    getJobDashboard,
    getMonthlyJobAnalytics,
    getMonthlyDashboardJobAnalytics,
    getEmployeeSalesPerfomance,
    getRebarJob,
    updateRebarJob,
    getRebarJobList,
    getRebarJobs,
    GetAllPendingJobs,
    getSubmissions,
    createSubmission,
    deleteSubmission,
    createChangeOrder,
    deleteChangeOrder,
    updateChangeOrder,
    getChangeOrders,
    createChangeOrderReport,
    generateDashboardReport,
    generateSubmissionsReport
}