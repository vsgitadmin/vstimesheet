const {
    reports: { reportModel }, employee: { employeeModel }, jobs: { awardedJobsModel, jobModel, ProjectDashboardModel }
} = require("../../../Models/Extractor/index")
const filterFunctionsObject = require("../Filters/index")
const { createReportAndUpload, generateReportData, createExcelReportAndUpload } = require('../../../Helpers/Functions/General/reportIntelligence')
const generateCSV = require('../../../Helpers/Functions/General/generateCSV')
const { writeFileSync } = require("fs");
const { projectModel, taskModel } = require("../../../Models/Projects");
const { TrainingModel } = require("../../../Models/Training");
const { reportsCsvModel, fileModel } = require("../../../Models/Reports");
const fs = require("fs");
const { deleteS3Document, getPresignedGetUrl, s3KeyFromLocationOrKey } = require("../../../Helpers/Functions/S3/index");
const reportKeysConstant = require("../../../Config/constants/reportKeys");
const reportTemplate = require("../../../Config/Templates/reportTemplate");
const { sendEmailFunction } = require("../Communication");
const { randomUUID } = require("crypto");
const { formatHours } = require("../../../Helpers/Functions/General/getDate");
const { convertHrsStrToDecimal } = require("../../../Helpers/Functions/General/decodeformula");

const createReports = async (body) => {
    try {
        if (!body.file.endsWith('.xlsx')) body.file = body.file + '.xlsx'
        body.url = await generateReportData(body.type, body.queryObject, body)
        const saved = await new reportModel(body).save();
        const out = saved.toObject();
        out.url = getPresignedGetUrl(saved.url);
        return out;
    } catch (err) {
        console.log(err)
        throw err;
    }
}

const viewFileData = async (location) => {
    try {
        const key = s3KeyFromLocationOrKey(location);
        const safe = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const file = await fileModel.findOne({
            $or: [
                { location: location },
                { location: key },
                { location: { $regex: new RegExp(`${safe}$`) } },
            ],
        });
        if (!file) throw new Error('File record not found');
        const data = JSON.parse(file.fileData)
        return data
    } catch (err) {
        throw err;
    }
}

const getReports = async (pageNumber, user) => {
    try {
        let page = pageNumber >= 1 ? pageNumber : 1;
        page = page - 1
        const limit = 9
        const rows = await reportModel.find({ createdBy: user }).limit(limit).skip(page * limit).sort({ createdAt: -1 }).lean();
        return rows.map((r) => ({
            ...r,
            url: getPresignedGetUrl(r.url),
        }));
    } catch (err) {
        throw err;
    }
}

const getReportKeys = async () => {
    try {
        const extractKeys = (path) => {
            return Object.keys(path)
                .filter(path => !path.startsWith('_'))
                .map(path => path.split('.').pop());
        }
        const employee = extractKeys(employeeModel.schema.paths).filter(key => !['publicDetails', 'publicDetails', 'pwd'].includes(key))
        const jobs = extractKeys(jobModel.schema.paths).filter(key => !['total_breakpoints', 'sub_items', 'awardedId'].includes(key))
        const awardedJobs = extractKeys(awardedJobsModel.schema.paths).filter(key => !['jobData'].includes(key))
        const projectJobs = extractKeys(ProjectDashboardModel.schema.paths).filter(key => !['awardedProjectData'].includes(key))
        const employeeProductionHrs = reportKeysConstant['employeeProductionHrs']
        const employeeBillingReport = reportKeysConstant['employeeBillingReport']
        const employeeLogsReport = reportKeysConstant['employeeLogsReport']
        const CompanyLogsFilter = reportKeysConstant['CompanyLogsFilter']
        const projectProduction = reportKeysConstant['projectProduction']
        const rebarJobs = reportKeysConstant['rebarJobs']
        const projectBilling = reportKeysConstant['projectBilling']
        const rebarAwardedJobs = reportKeysConstant['rebarAwardedJobs']
        const rebarAwardedDashboardJobs = reportKeysConstant['rebarAwardedDashboardJobs']

        return { employee, jobs,rebarJobs,rebarAwardedDashboardJobs,rebarAwardedJobs, awardedJobs, projectJobs,projectBilling, employeeProductionHrs,projectProduction, employeeBillingReport, employeeLogsReport, CompanyLogsFilter }
    } catch (err) {
        throw err;
    }
}

const refreshReports = async (id, body) => {
    try {
        const report = await reportModel.findById(id);
        await deleteS3Document(report.url)
        const newUrl = await generateReportData(report.type, report.queryObject, report)
        report.url = newUrl
        report.lastUpdated = new Date()
        await report.save()
        const out = report.toObject();
        out.url = getPresignedGetUrl(report.url);
        return out;
    } catch (err) {
        throw err;
    }
}

const deleteReports = async (id) => {
    try {
        let report = await reportModel.findById(id)
        await deleteS3Document(report.url)
        return await reportModel.deleteOne({ _id: id });
    } catch (err) {
        throw err;
    }
}

const getTotalNumberOfReports = (user) => {
    try {
        return reportModel.find({ createdBy: user }).count()
    } catch (err) {
        throw err;
    }
}

const generateCsvReportFunction = async (body, userId) => {
    return new Promise(async (r, j) => {
        try {
            let user = await employeeModel.findById(userId)
            let filters = { employee: employeeModel, projects: projectModel, jobs: jobModel, lms: TrainingModel }
            let filename = body.fileName
            if (!filename) return r(new Error("Filename not given"))
            let search = await reportsCsvModel.findOne({ fileName: filename })
            let csvData = await generateCSV(filters[body.type])
            let path = process.cwd() + `/public`
            fs.access(path, fs.constants.F_OK, async (err) => {
                if (!err) {
                    fs.writeFileSync(`${path}/${filename.replace(' ', '')}.xlsx`, csvData, 'utf8');
                    let doc = {
                        createdBy: { name: `${user.firstName} ${user.lastName}`, userId },
                        fileName: filename,
                        url: `http://localhost:50000/public/` + filename.replace(' ', '') + '.xlsx',
                        type: body.type
                    }
                    if (search) {
                        search.createdAt = new Date()
                        await search.save()
                        r(search)
                    } else r(await new reportsCsvModel(doc).save())
                } else {
                    j(err)
                }
            });
        } catch (e) {
            j(e)
        }
    })
}



const getCsvReportsFunction = async () => {
    try {
        return await reportsCsvModel.find({})
    } catch (e) {
        throw e
    }
}

const generateCSVReport = async (body, user) => {
    try {
        body = { ...body, createdBy: user.id, file: `${body.type}.xlsx` }
        // if(body.type.startsWith('Project')) body.file = `${body.metaData.projectName}\\${body.type}.xlsx`
        let data = null;
        let url;
        if (body.type === 'employeeProductionHrs') data = await employeeProductionHrsFunction(body)
        if (body.type === 'projectReport') data = await projectTaskReport(body)
        if (body.type === 'projectEmployeeReport') data = await projectEmployeeReport(body)
        if (body.type === 'projectEmployeeTasksReport') data = await employeeProjectTasks(body)
        if (body.type === 'projectEmployeeTasksBillingReport') data = await employeeProjectTasksBilling(body)
        if (body.type === 'ProjectTasksBilling') data = await ProjectTasksBilling(body)
        if (body.type === 'ProjectProductionList') data = await ProjectProductionList(body)
        if (body.type === 'projectBillingReport') data = await projectBillingReport(body)
        if (body.type === 'ProjectProductionBilling') data = await ProjectProductionBilling(body)
        if (body.type === 'projectEmployeeBillingReport') data = await projectEmployeeBillingReport(body)
        if (body.type === 'employeeBillingReport') data = await employeeBillingReport(body)
        if (data !== null) url = await createExcelReportAndUpload(data, body);
        else return { message: "Invalid Data Arguments" };
        // const id = randomUUID()
        // const messagePayload = {
        //     name : user.name,
        //     message: `Your ${body.type} is generated successfully with Unique ID ${id} . Please Reference this email to view the report .`,
        //     reportType:body.type,
        //     generatedAt: new Date().toDateString(),
        //     url
        // }
        // const template = reportTemplate(messagePayload)
        return { url: getPresignedGetUrl(url), data }
    } catch (err) {
        console.log(err)
        throw err
    }
}

const employeeBillingReport = async (body) => {
    try {
        const employeeId = body.id;
        const result = await projectModel.aggregate([
            {
                $match: {
                    "members": employeeId
                }
            },
            {
                $lookup: {
                    from: "tasks",
                    localField: "_id",
                    foreignField: "projectId",
                    as: "tasks"
                }
            },
            {
                $addFields: {
                    totalTasks: { $size: "$tasks" },
                    completedTasks: {
                        $size: {
                            $filter: {
                                input: "$tasks",
                                as: "task",
                                cond: { $eq: ["$$task.completed", true] }
                            }
                        }
                    },
                    pendingTasks: {
                        $size: {
                            $filter: {
                                input: "$tasks",
                                as: "task",
                                cond: { $eq: ["$$task.completed", false] }
                            }
                        }
                    },
                    totalHoursAssigned: {
                        $sum: "$tasks.allocatedHours"
                    },
                    totalHoursCompleted: {
                        $sum: "$tasks.completedHours"
                    },
                    // Calculate allocated cost and used cost
                    allocatedCost: {
                        $multiply: [{ $sum: "$tasks.allocatedHours" }, 16]
                    },
                    usedCost: {
                        $multiply: [{ $sum: "$tasks.completedHours" }, 16]
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    projectName: 1,
                    totalTasks: 1,
                    completedTasks: 1,
                    pendingTasks: 1,
                    totalHoursAssigned: 1,
                    totalHoursCompleted: 1,
                    allocatedCost: 1,  // Include allocated cost in the projection
                    usedCost: 1       // Include used cost in the projection
                }
            }
        ]);

        return result;
    } catch (error) {
        console.error("Error fetching employee production hours:", error);
        return { message: "Error fetching employee production hours" };
    }
};

const projectEmployeeBillingReport = async (body) => {
    try {
        const report = await taskModel.aggregate([
            {
                $match: {
                    projectId: body.id  // Filter by project ID
                }
            },
            {
                $lookup: {
                    from: "employees",                   // Assuming 'employees' collection contains employee details
                    localField: "assignedTo",            // Join field for the employee
                    foreignField: "_id",
                    as: "employeeDetails"
                }
            },
            {
                $unwind: { path: "$employeeDetails", preserveNullAndEmptyArrays: true }
            },
            {
                $group: {
                    _id: "$assignedTo",                             // Group by employee ID
                    employeeName: {
                        $first: {
                            $concat: [
                                "$employeeDetails.firstName",
                                " ",
                                "$employeeDetails.lastName"
                            ]
                        }
                    },
                    totalTasks: { $sum: 1 },                       // Count total tasks
                    completedTasks: {
                        $sum: { $cond: [{ $eq: ["$completed", true] }, 1, 0] }
                    },
                    pendingTasks: {
                        $sum: { $cond: [{ $eq: ["$completed", false] }, 1, 0] }
                    },
                    totalHours: { $sum: "$allocatedHours" },       // Sum of allocated hours
                    completedHours: { $sum: "$completedHours" },   // Sum of completed hours
                    allocatedCost: { $sum: { $multiply: ["$allocatedHours", 16] } },  // Calculate allocated cost
                    usedCost: { $sum: { $multiply: ["$completedHours", 16] } }          // Calculate used cost
                }
            },
            {
                $project: {
                    _id: 0,                  // Exclude _id
                    employeeName: 1,
                    totalTasks: 1,
                    completedTasks: 1,
                    pendingTasks: 1,
                    totalHours: 1,
                    completedHours: 1,
                    allocatedCost: {
                        $concat: ["$", { $toString: "$allocatedCost" }]  // Add $ symbol to allocatedCost
                    },
                    usedCost: {
                        $concat: ["$", { $toString: "$usedCost" }]      // Add $ symbol to usedCost
                    }
                }
            }
        ]);

        return report;
    } catch (error) {
        console.error("Error generating employee task report:", error);
        return { message: "Error generating employee task report" };
    }
};


const projectBillingReport = async (body) => {
    try {
        const report = await taskModel.aggregate([
            {
                $match: {
                    projectId: body.id  // Filter by project ID
                }
            },
            {
                $lookup: {
                    from: "employees",                    // Assuming 'employees' collection contains employee details
                    localField: "assignedTo",             // Join field for the employee
                    foreignField: "_id",
                    as: "employeeDetails"
                }
            },
            {
                $unwind: { path: "$employeeDetails", preserveNullAndEmptyArrays: true }
            },
            {
                $group: {
                    _id: "$assignedTo",                            // Group by employee ID
                    employeeName: {
                        $first: {
                            $concat: [
                                { $toString: "$employeeDetails.firstName" },
                                " ",
                                { $toString: "$employeeDetails.lastName" }
                            ]
                        }
                    },
                    totalTasks: { $sum: 1 },                      // Count total tasks
                    completedTasks: {
                        $sum: { $cond: [{ $eq: ["$completed", true] }, 1, 0] }
                    },
                    pendingTasks: {
                        $sum: { $cond: [{ $eq: ["$completed", false] }, 1, 0] }
                    },
                    totalHours: { $sum: "$allocatedHours" },      // Sum of allocated hours
                    completedHours: { $sum: "$completedHours" },  // Sum of completed hours
                    allocatedCost: { $sum: { $multiply: ["$allocatedHours", 16] } },  // Calculate allocated cost
                    usedCost: { $sum: { $multiply: ["$completedHours", 16] } }         // Calculate used cost
                }
            },
            {
                $project: {
                    _id: 0,                 // Exclude _id
                    employeeName: 1,
                    totalTasks: 1,
                    completedTasks: 1,
                    pendingTasks: 1,
                    totalHours: 1,
                    completedHours: 1,
                    allocatedCost: 1,
                    usedCost: 1
                }
            }
        ]);
        return report.map((item) => ({
            ...item,
            totalHours: formatHours(item.totalHours),
            completedHours: formatHours(item.completedHours)
        }));
    } catch (error) {
        console.error("Error generating project billing report:", error);
        return { message: "Error generating project billing report" };
    }
};


const projectEmployeeReport = async (body) => {
    try {
        let report = await taskModel.aggregate([
            {
                $match: {
                    projectId: body.id  // Filter by project ID
                }
            },
            {
                $lookup: {
                    from: "employees",                    // Assuming 'employees' collection contains employee details
                    localField: "assignedTo",             // Join field for the employee
                    foreignField: "_id",
                    as: "employeeDetails"
                }
            },
            {
                $unwind: { path: "$employeeDetails", preserveNullAndEmptyArrays: true }
            },
            {
                $group: {
                    _id: "$assignedTo",                         // Group by employee ID
                    firstName: { $first: "$employeeDetails.firstName" },
                    lastName: { $first: "$employeeDetails.lastName" },
                    totalTasks: { $sum: 1 },                     // Count total tasks
                    completedTasks: {
                        $sum: { $cond: [{ $eq: ["$completed", true] }, 1, 0] }
                    },
                    pendingTasks: {
                        $sum: { $cond: [{ $eq: ["$completed", false] }, 1, 0] }
                    },
                    totalHours: { $sum: "$allocatedHours" },     // Sum of allocated hours
                    completedHours: { $sum: "$completedHours" }  // Sum of completed hours
                }
            },
            {
                $addFields: {
                    employeeName: { $concat: ["$firstName", " ", "$lastName"] }
                }
            },
            {
                $project: {
                    _id: 0,                 // Exclude _id
                    employeeName: 1,        // Employee name comes first
                    totalTasks: 1,
                    completedTasks: 1,
                    pendingTasks: 1,
                    totalHours: 1,
                    completedHours: 1
                }
            }
        ]);

        report = report.map(obj => {
            const reversedObj = {};
            const keys = Object.keys(obj).reverse();
            keys.forEach(key => {
                reversedObj[key] = obj[key];
            });
            return reversedObj;
        });

        return report.map((item) => ({
            ...item,
            totalHours: formatHours(item.totalHours),
            completedHours: formatHours(item.completedHours)
        }));
    } catch (error) {
        console.error("Error generating employee task report:", error);
        return { message: "Error generating employee task report" };
    }
};

const projectTaskReport = async (body) => {
    try {
        const tasks = await taskModel.aggregate([
            {
                $match: {
                    projectId: body.id
                }
            },
            {
                $project: {
                    _id: 0,
                    name: 1,
                    description: 1,
                    assignedToName: 1,
                    assignedByName: 1,
                    allocatedHours: 1,
                    completedHours: 1,
                    active: 1,
                    priority: 1,
                    completed: 1,
                    status: 1,
                    section: 1,
                    dueDate: 1,
                    createdAt: 1,
                    updatedAt: 1
                }
            }
        ]);

        return tasks.map((item) => ({
            ...item,
            allocatedHours: formatHours(item.allocatedHours),
            completedHours: formatHours(item.completedHours)
        }));

    } catch (error) {
        console.error("Error fetching tasks for project:", error);
        return { message: "Error fetching tasks for project" };
    }
}

const employeeProjectTasks = async (body) => {
    try {
        const tasks = await taskModel.aggregate([
            {
                $match: {
                    assignedTo: body.id,
                    projectId: body.project
                }
            },
            {
                $project: {
                    _id: 0,
                    name: 1,
                    description: 1,
                    assignedByName: 1,
                    allocatedHours: 1,
                    completedHours: 1,
                    active: 1,
                    priority: 1,
                    completed: 1,
                    status: 1,
                    section: 1,
                    dueDate: 1,
                    createdAt: 1,
                    updatedAt: 1
                }
            }
        ]);

        return tasks.map((item) => ({
            ...item,
            allocatedHours: formatHours(item.allocatedHours),
            completedHours: formatHours(item.completedHours)
        }));

    } catch (error) {
        console.error("Error fetching tasks for project:", error);
        return { message: "Error fetching tasks for project" };
    }
}

const employeeProjectTasksBilling = async (body) => {
    try {
        const tasks = await taskModel.aggregate([
            {
                $match: {
                    assignedTo: body.id,
                    projectId: body.project

                }
            },
            {
                $project: {
                    _id: 0,
                    name: 1,
                    description: 1,
                    assignedByName: 1,
                    allocatedHours: 1,
                    completedHours: 1,
                    active: 1,
                    priority: 1,
                    completed: 1,
                    status: 1,
                    section: 1,
                    dueDate: 1,
                    createdAt: 1,
                    updatedAt: 1
                }
            }
        ]);

        // Add allocatedCost and usedCost
        const tasksWithCost = tasks.map(task => {
            const hourlyRate = 16;
            return {
                ...task,
                allocatedCost: (task.allocatedHours || 0) * hourlyRate,
                usedCost: (task.completedHours || 0) * hourlyRate,
                allocatedHours: formatHours(task.allocatedHours),
                completedHours: formatHours(task.completedHours)
            };
        });

        return tasksWithCost;
    } catch (error) {
        console.error("Error fetching tasks for project:", error);
        return { message: "Error fetching tasks for project" };
    }
};

const ProjectTasksBilling = async (body) => {
    try {
        const tasks = await taskModel.aggregate([
            {
                $match: {
                    projectId: body.id
                }
            },
            {
                $project: {
                    _id: 0,
                    name: 1,
                    description: 1,
                    assignedByName: 1,
                    allocatedHours: 1,
                    completedHours: 1,
                    active: 1,
                    priority: 1,
                    completed: 1,
                    status: 1,
                    section: 1,
                    dueDate: 1,
                    createdAt: 1,
                    updatedAt: 1
                }
            }
        ]);

        // Add allocatedCost and usedCost
        const tasksWithCost = tasks.map(task => {
            const hourlyRate = 16;
            return {
                ...task,
                allocatedCost: (task.allocatedHours || 0) * hourlyRate,
                usedCost: (task.completedHours || 0) * hourlyRate,
                allocatedHours: formatHours(task.allocatedHours),
                completedHours: formatHours(task.completedHours)
            };
        });

        return tasksWithCost;
    } catch (error) {
        console.error("Error fetching tasks for project:", error);
        return { message: "Error fetching tasks for project" };
    }
};

const employeeProductionHrsFunction = async (body) => {
    try {
        const employeeId = body.id;
        const result = await projectModel.aggregate([
            {
                $match: {
                    "members": employeeId
                }
            },
            {
                $lookup: {
                    from: "tasks",
                    localField: "_id",
                    foreignField: "projectId",
                    as: "tasks"
                }
            },
            {
                $addFields: {
                    totalTasks: { $size: "$tasks" },
                    completedTasks: {
                        $size: {
                            $filter: {
                                input: "$tasks",
                                as: "task",
                                cond: { $eq: ["$$task.completed", true] }
                            }
                        }
                    },
                    pendingTasks: {
                        $size: {
                            $filter: {
                                input: "$tasks",
                                as: "task",
                                cond: { $eq: ["$$task.completed", false] }
                            }
                        }
                    },
                    totalHoursAssigned: {
                        $sum: "$tasks.allocatedHours"
                    },
                    totalHoursCompleted: {
                        $sum: "$tasks.completedHours"
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    projectName: 1,
                    totalTasks: 1,
                    completedTasks: 1,
                    pendingTasks: 1,
                    totalHoursAssigned: 1,
                    totalHoursCompleted: 1
                }
            }
        ]);

        return result.map((item) => ({
            ...item,
            totalHoursAssigned: formatHours(item.totalHoursAssigned),
            totalHoursCompleted: formatHours(item.totalHoursCompleted)
        }));

    } catch (error) {
        console.error("Error fetching employee production hours:", error);
        return { message: "Error fetching employee production hours" };
    }
};


module.exports = {
    createReports,
    getReports,
    refreshReports,
    deleteReports,
    getReportKeys,
    getTotalNumberOfReports,
    generateCsvReportFunction,
    getCsvReportsFunction,
    generateCSVReport,
    employeeProductionHrsFunction,
    viewFileData
}