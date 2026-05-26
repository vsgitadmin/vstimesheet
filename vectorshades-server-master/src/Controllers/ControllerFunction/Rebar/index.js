const { rebarJobs: { jobModel, awardedJobsModel, ProjectDashboardModel, jobActivitiesModel, rebarJobsModel }, projects: { projectModel }, employee: { employeeTodoModel, employeeModel } } = require("../../../Models/Extractor/index")
const { general: { decodeFormula } } = require("../../../Helpers/Extractor/index");
const { createProject } = require('../Project/index')
const { createNotification } = require('../Communication/index')
const generateJobCSV = require("../../../Helpers/Functions/General/generateJobCSV");
const { changeOrderModel } = require("../../../Models/Rebar");

// const GetAllJobs = async (query) => {
//     try {
//         let page = query.page >= 1 ? query.page : 1;
//         page = page - 1
//         const jobsPerPage = 9
//         if (!query.month) query.month = new Date().getMonth()
//         const jobs = jobModel.find({
//             $expr: {
//                 $eq: [{ $month: '$date' }, query.month]
//             }
//         }).limit(jobsPerPage).skip(page * jobsPerPage).sort({ createdAt: -1 })
//         return jobs
//     }
//     catch (err) {
//         throw err;
//     }
// }

const GetAllJobs = async (query) => {
    try {
        const year = query.year || new Date().getFullYear();
        const jobs = await jobModel.aggregate([
            { $match: { date: { $gte: new Date(year, 0, 1), $lt: new Date(parseInt(year) + 1, 0, 1) } , linked:false} },
            { $group: { _id: { $month: '$date' }, jobs: { $push: '$$ROOT' } } },
            { $sort: { _id: 1 } },
        ]);
        const jobsProccessed = await Promise.all(jobs.map(async (jobsByMonth) => {
            const monthObj = jobsByMonth
            monthObj.analytics = await getMonthlyJobAnalytics(monthObj._id)
            monthObj.monthName = new Date(2000, monthObj._id-1).toLocaleString('en-US', { month: 'long' });
            return monthObj
        }))
        const yearlyRevenue = jobsProccessed.reduce((acc, curr) => acc + curr.analytics.amountBilled, 0)
        return [jobsProccessed, yearlyRevenue];
    } catch (err) {
        throw err;
    }
};

const GetAllPendingJobs = async (query) => {
    try {
        const year = query.year || new Date().getFullYear();
        const jobs = await jobModel.aggregate([
            { $match: { date: { $gte: new Date(year, 0, 1), $lt: new Date(parseInt(year) + 1, 0, 1) } , pending:true} },
            { $group: { _id: { $month: '$date' }, jobs: { $push: '$$ROOT' } } },
            { $sort: { _id: 1 } },
        ]);
        const jobsProccessed = await Promise.all(jobs.map(async (jobsByMonth) => {
            const monthObj = jobsByMonth
            monthObj.monthName = new Date(2000, monthObj._id-1).toLocaleString('en-US', { month: 'long' });
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
    const dimensionalJobs = await jobModel.find({
        pending: false,
        rebarType:'Dimensional Drawing',
        $expr: {
            $eq: [{ $month: '$date' }, month]
        }
    }).select('total_breakpoints')
    const jobIds = jobs.map((data) => data._id)
    const projects = await projectModel.find({job:{ $in: jobIds }}).select('members')
    const rawMembers = projects.map(item => item.members).flat()
    const processedMembers = Array.from(new Set(rawMembers))
    const changeOrders = await changeOrderModel.find({jobId: { $in: jobIds }}).select('actualCOhours')
    const totalHoursSum = dimensionalJobs.reduce((sum, job) => sum + job.total_breakpoints.totalHours, 0);
    const totalChangeOrderHours = changeOrders.reduce((sum, job) => sum + job.actualCOhours, 0);
    sumObject.resourceCount = processedMembers.length
    sumObject.count = jobs.length
    sumObject.dimensionalHours = totalHoursSum
    sumObject.coHours = totalChangeOrderHours
    sumObject.billingHead = sumObject.amountBilled / sumObject.resourceCount
    return sumObject
}

const CreateJob = async (body) => {
    try {
        if(body.linked && body.linked === true){
            const linkedJob = await jobModel.findOne({_id:body.linkedId})
            body.client = linkedJob.client
            body.project = linkedJob.project
            body.date = linkedJob.date
            body.estimate = linkedJob.estimate
            body.assignedSales = linkedJob.assignedSales
            body.assignedSalesBYName = linkedJob.assignedSalesBYName
        } 
        const job = new jobModel(body).save();
        return job;
    } catch (err) {
        throw err;
    }
}

const patchJob = async (body, id) => {
    try {
        const prevData = await jobModel.findOne({ _id: body._id }).select('total_breakpoints')
        if(body.total_breakpoints){
            body.total_breakpoints.totalHours = prevData.total_breakpoints.totalHours
            body.total_breakpoints.tonsDetailed = prevData.total_breakpoints.tonsDetailed
            body.total_breakpoints.amountBilled = prevData.total_breakpoints.resourceCount
            body.total_breakpoints.resourceCount = prevData.total_breakpoints.resourceCount
        }
        const updatedJob = await jobModel.findOneAndUpdate({ _id: body._id }, { $set: body });
        if(updatedJob.awarded){
            await ProjectDashboardModel.updateOne({jobId:updatedJob._id},{$set:{onHold:!updatedJob.onHold}})
        }
        return updatedJob
    } catch (err) {
        console.log(err)
        throw err;
    }
}

const DeleteJob = async (query) => {
    try {
        let document = await jobModel.deleteOne({ _id: query.id })
        if (document.deletedCount === 0) throw { message: "Invalid ID submitted" }
        else return document
    } catch (err) {
        console.log(err)
        throw err;
    }
}

const GetJob = async (query) => {
    try {
        let document = await jobModel.findOne({ _id: query.id })
        let activity = await getJobActivity(query.id)
        let jobLinks = await jobModel.find({linkedId:query.id}).select('_id rebarType')
        return { job:document, activity , jobLinks}
    } catch (err) {
        throw err
    }
}

const generateReportJob = async (id) => {
    try {
        const job = await jobModel.findOne({ _id: id })
        const report = await generateJobCSV(job)
        return report
    } catch (err) {
        throw err
    }
}

const awardJob = async (body, user) => {
    try {
        const { job } = await GetJob({ id: body.jobId })
        if (job) {
            body.jobData = job
            body.total = job.total_breakpoints
            if(job.linked){
                body.linked = true
                body.linkedId = job.linkedId
            }
            const jobAwarded = new awardedJobsModel(body).save().then(async (res) => {
                let patchData = {}
                patchData._id = body.jobId
                patchData.awarded = true
                patchData.awardedId = res._id
                await patchJob(patchData)
                let dashboardData = Object.assign(body, {})
                delete dashboardData._id
                dashboardData.awardedProjectId = res._id
                dashboardData.awardedProjectData = res
                dashboardData.jobId = body.jobId
                dashboardData.assignedTo = body.user
                dashboardData.tons = res.jobData.total_breakpoints.estimatedTons
                dashboardData.tonPH = res.jobData.total_breakpoints.tonPH
                if(job.linked){
                    dashboardData.linked = true
                    dashboardData.linkedId = job.linkedId
                }
                const newProjectDashboardData = await new ProjectDashboardModel(dashboardData).save()
                const createdDashboard = await ProjectDashboardModel.findById(newProjectDashboardData._id).lean()
                if (createdDashboard) await patchDashboardJob(createdDashboard)
                const userObject = await employeeModel.findOne({ _id: dashboardData.assignedTo }).select("firstName lastName email designation _id").lean()
                userObject['role'] = 'ADM'
                const projectData = { job: job._id, members: [dashboardData.assignedTo], membersByName: [], estimatedHours: body.total.estimatedHours, client: job.client, projectName: job.project, description: res.notes , rebar:true}
                if(!job.linked){
                    const data = await createProject(projectData, user)
                    await createNotification({ text: `You have been assigned a project : ${job.project}`, reciever: dashboardData.assignedTo, link: `/admin/dashboard/projects/${data._id}` })
                }
                
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
            { $match: { date: { $gte: new Date(year, 0, 1), $lt: new Date(parseInt(year) + 1, 0, 1) } , linked:false} },
            { $group: { _id: { $month: '$date' }, jobs: { $push: '$$ROOT' } } },
            { $sort: { createdAt: -1 } },
        ])
        const jobsProccessed = await Promise.all(awarded.map(async (jobsByMonth) => {
            const monthObj = jobsByMonth
            monthObj.analytics = await getMonthlyAwardedJobAnalytics(monthObj._id)
            monthObj.monthName = new Date(2000, monthObj._id-1).toLocaleString('en-US', { month: 'long' });
            return monthObj
        }))
      return jobsProccessed;
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

const GetDashbBoardJobs = async (query) => {
    try {
        const hold = query.hold !== undefined ? true : false
        const year = query.year || new Date().getFullYear();
        const linkFilter = query.linkId ? { $or: [{ jobId: query.linkId }, { linkedId: query.linkId }] } : { linked: false };
        const jobs = await ProjectDashboardModel.aggregate([
            { $match: { created: { $gte: new Date(year, 0, 1), $lt: new Date(parseInt(year) + 1, 0, 1) },...linkFilter,onHold:hold, completedStatus: query.completed ? true : false } },
            { $group: { _id: { $month: '$created' }, jobs: { $push: '$$ROOT' } } },
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
        return updatedAwardedJob
    } catch (err) {
        throw err;
    }
}

const patchDashboardJob = async (body, id) => {
    try {
        const previosData = await ProjectDashboardModel.findById(body._id)
        const linkedJob = await jobModel.findOne({ $or: [{ _id: body.jobId }, { linkedId: body.jobId }] ,rebarType:previosData.awardedProjectData.jobData.rebarType}).select('_id')
        const perTon = previosData.awardedProjectData.jobData.perTon
        const TonDetailedChange = body.tonsDetailed - previosData.tonsDetailed
        const tonsBillable = TonDetailedChange 
        const pendingTons = previosData.tonsDetailed - body.tonsBilled
        body.tonsBillable = tonsBillable
        body.tonsBilled = body.tonsBilled
        body.pendingTons = pendingTons
        body.billingPending = perTon * pendingTons
        body.billingBacklog =  (body.tons - body.tonsDetailed) * perTon
        const updateJob = await jobModel.updateOne({_id:linkedJob._id},{$set:{ 'total_breakpoints.tonsDetailed': body.tonsDetailed,'total_breakpoints.amountBilled': body.tonsBilled * perTon }})
        const updatedDashboardJob = await ProjectDashboardModel.findOneAndUpdate({ _id: body._id }, { $set: body });
        return previosData;
    } catch (err) {
        console.log(err)
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
        const jobActivity = await jobActivitiesModel.find({ jobId: id }).sort({ createdAt: -1 })
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
        const startYearMonthly = endMonthMonthly > 2 ? endYearMonthly : endYearMonthly - 1;
        const startMonthMonthly = endMonthMonthly > 2 ? endMonthMonthly - 2 : endMonthMonthly + 10;

        let [totalSales, totalJobs, awardedJobs, ongoingProjects, completedProjects, latestProjects, employeeTODO, latestSingleProject, yearlySales, monthlySales, pendingAwarded, profitProjects,holdJobs,dashboardJobs,InProgressJobs] = await Promise.all([
            jobModel.aggregate([{ $group: { _id: null, totalCost: { $sum: "$total_breakpoints.tonsDetailed" } } }]),
            jobModel.find({ createdAt: { $gte: startOfMonth, $lt: endOfMonth } }).count(),
            jobModel.find({ createdAt: { $gte: startOfMonth, $lt: endOfMonth }, awarded: true }).count(),
            projectModel.find({ completed: false, active: true ,rebar:true}).count(),
            projectModel.find({ completed: true ,rebar:true}).count(),
            projectModel.find({rebar:true}).sort({ createdAt: -1 }).limit(5).select('createdAt status client estimatedHours hours createdBy projectName'),
            employeeTodoModel.find({ status: 'TD', employeeId: user }).sort({ createdAt: -1 }).limit(5).select('title createdAt'),
            projectModel.findOne({ completed: true ,rebar:true}).sort({ updatedAt: -1 }).select('projectName client hours estimatedHours createdBy'),
            jobModel.aggregate([{ $match: { createdAt: { $gte: startYear, $lte: endYear } } }, { $group: { _id: null, totalCost: { $sum: "$total_breakpoints.amountBilled" } } }]),
            jobModel.aggregate([{ $match: { createdAt: { $gte: startOfMonth, $lt: endOfMonth } } }, { $group: { _id: null, totalCost: { $sum: "$total_breakpoints.amountBilled" } } }]),
            jobModel.count({awarded:false,linked:false}),
            projectModel.find({ completed: true ,rebar:true}).select('hours estimatedHours job _id'),
            ProjectDashboardModel.countDocuments({onHold:true}),
            ProjectDashboardModel.find({onHold:false}).select('billingBacklog'),
            ProjectDashboardModel.find({workInProgress:true}).select('billingBacklog')
        ])

        let profitGenerated = profitProjects.map(async (project) => {
            const job = await jobModel.findById(project.job)
            const saved = job.total_breakpoints.amountBilled
            return saved
        })

        profitGenerated = await (await Promise.all(profitGenerated)).reduce((acc, curr) => acc + curr, 0)

        const billingBacklog = dashboardJobs.reduce((acc,curr) => acc + curr.billingBacklog,0)
        const workInProgress = InProgressJobs.reduce((acc,curr) => acc + curr.billingBacklog,0)
        const workableBacklog = billingBacklog - workInProgress

        return {
            totalSales: totalSales.length > 0 ? totalSales : [{ totalCost: 0 }],
            totalJobs,
            awardedJobs,
            ongoingProjects,
            completedProjects,
            latestProjects,
            holdJobs,
            employeeTODO,
            latestSingleProject,
            billingBacklog,
            workInProgress,
            workableBacklog,
            yearlySales:yearlySales.length > 0 ? yearlySales : [{ totalCost: 0 }],
            monthlySales:monthlySales.length > 0 ? monthlySales : [{ totalCost: 0 }],
            pendingAwarded,
            profitGenerated
        };
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

const getEmployeeSalesPerfomance = async () => {
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
                    jobCount: 1,
                    totalCost: 1,
                    completedProjectCount: 1,
                    notCompletedProjectCount: 1,
                    "employeeDetails.firstName": 1,
                    "employeeDetails.lastName": 1,
                    "employeeDetails.email": 1
                }
            }
        ]);

        let updatedData = data.map(({ _id, ...rest }) => { if (rest.employeeDetails) return { employeeId: _id, ...rest } }).filter(Boolean);
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

const getRebarJobs = async () =>{
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

const getRebarChangeOrders = async (jobId) =>{
    try {
        const changeOrders = await changeOrderModel.find({jobId})
        return changeOrders
    } catch (err) {
        throw err;
    }
}

const createRebarChangeOrder = async (body) =>{
    try {
        const jobData = await jobModel.findById(body.jobId)
        body.clientName = jobData.client
        body.jobName = jobData.project
        if(!body.perHour) body.perHour = jobData.perHour
        const newChangeOrder = await new changeOrderModel(body).save()
        return newChangeOrder
    } catch (err) {
        throw err;
    }
}

const updateRebarChangeOrder = async (body) =>{
    try {
        const updatedChangeOrder = await changeOrderModel.updateOne({_id:body._id},{$set:body})
        return updatedChangeOrder
    } catch (err) {
        throw err;
    }
}

const deleteChangeOrder = async (id) =>{
    try {
        const deletedChangeorder = await changeOrderModel.deleteOne({_id:id})
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
    getRebarChangeOrders,
    updateRebarChangeOrder,
    createRebarChangeOrder,
    deleteChangeOrder
}