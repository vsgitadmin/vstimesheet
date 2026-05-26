const generateProductionHoursCSVData = require("../../../Helpers/Functions/DB/generateProductionWorkHrsCSVData");
const { employeeLogsModel, employeeBasicDetailsModel } = require("../../../Models/Employee");
const { employee: { employeeModel }, rebarJobs, jobs: { jobModel, awardedJobsModel, ProjectDashboardModel }, reports, projects: { projectModel } } = require("../../../Models/Extractor/index");
const { taskModel } = require("../../../Models/Projects");
const { absenteesModel, timeSheetActivityModel } = require("../../../Models/Timesheet");
const { getDatesArray, toIsoDate, formatHours } = require("../../../Helpers/Functions/General/getDate");
const generateProductionHoursExcelData = require("../../../Helpers/Functions/DB/generateProductionWorkHrsExcelData");
const { convertHrsStrToDecimal } = require("../../../Helpers/Functions/General/decodeformula");
const generateProductionHoursExcelDataFromValidated = require("../../../Helpers/Functions/DB/generateEmployeePersonalWorkHrsExcelData");

const filterEmployeeFunction = async (query, pageNumber, keys) => {
  const page = pageNumber ? parseInt(pageNumber) : 1;
  const empPerPage = 15;
  const skip = (page - 1) * empPerPage;

  const { joining, department, role, active, working, fields } = query;
  const filter = {
    ...(joining && { joining: { $gte: new Date(joining['$gte']), $lte: new Date(joining['$lte']) } }),
    ...(department && { department }),
    ...(role && { role }),
    ...(active && { active }),
    ...(working && { working }),
  };
  const projection = fields ? fields.reduce((p, c) => { p[c] = 1; return p; }, {}) : null;
  const response = await employeeModel.find(filter, projection).limit(pageNumber == 0 ? 6000 * 60 * 60 : empPerPage).skip(pageNumber == 0 ? 0 : skip).sort({ createdAt: -1 }).select('-publicDetails -privateDetails')
  return { employees: response, count };
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
      $lte: endDate ? new Date(endDate) : new Date()
    };
    if (working !== undefined) filter.working = working;
    if (department !== undefined) filter.department = department;
    if (designation !== undefined) filter.designation = designation;
    if (online !== undefined) filter.logedIn = online;
    const projection = fields ? fields.reduce((p, c) => {
      p[c] = 1;
      return p;
    }, {}) : null;
    let employees = await employeeModel.find(filter, projection).sort({ created: -1 }).select('-publicDetails -privateDetails -pwd').lean()
    // employees = employees.map((employee) => {
    //     employee.created = new Date(employee.created).toLocaleDateString() + ' ' + new Date(employee.created).toLocaleTimeString()
    //     employee.logedDate = new Date(employee.logedDate).toLocaleDateString() + ' ' + new Date(employee.logedDate).toLocaleTimeString()
    //     employee.joining = new Date(employee.joining).toLocaleDateString() + ' ' + new Date(employee.joining).toLocaleTimeString()
    //     return employee;
    // });
    return employees;
  } catch (err) {
    throw err;
  }
}

const filterJobs = async (query, pageNumber, report) => {
  if (query.rebar) return filterRebarJobs(query, pageNumber, report)
  else return filterSteelJobs(query, pageNumber, report)
}

const filterRebarJobs = async (query) => {
  try {
    const { client, awarded, pending, start, end, location, onHold } = query;
    const filter = {};

    if (client) {
      if (Array.isArray(client)) {
        filter.client = { $in: client };
      } else {
        filter.client = client;
      }
    }

    if (awarded !== undefined) {
      filter.awarded = awarded === 'true' || awarded === true;
    }
    if (onHold !== undefined) {
      filter.onHold = onHold === 'true' || onHold === true;
    }
    if (start && end) filter.date = { $gte: new Date(start), $lte: new Date(end) };

    let jobs = await rebarJobs.jobModel.find(filter)
      .sort({ createdAt: -1 })
      .lean();

    if (query.report) {
      return jobs.map((e) => {
        const { total_breakpoints = {}, sub_items, ...rest } = e;
        return {
          ...rest,
          ...total_breakpoints,
        };
      });
    }

    return jobs

  } catch (err) {
    throw err;
  }
}

const filterSteelJobs = async (query, pageNumber, report) => {
  try {
    const { client, awarded, pending, start, end, fields, location } = query;
    const page = pageNumber ? parseInt(pageNumber) : 1;
    const empPerPage = 15;
    const skip = (page - 1) * empPerPage;
    const filter = {};

    // Updated client filtering
    if (client) {
      if (Array.isArray(client)) {
        filter.client = { $in: client };
      } else {
        filter.client = client;
      }
    }

    if (location) filter.location = location;
    if (awarded) filter.awarded = awarded;
    if (pending) filter.pending = pending === 'true';
    if (start && end) filter.date = { $gte: new Date(start), $lte: new Date(end) };

    // const projection = fields ? fields.reduce((p, c) => { p[c] = 1; return p; }, {}) : null;

    let jobs = await jobModel.find(filter)
      .limit(pageNumber == 0 ? 6000 * 60 * 60 : empPerPage)
      .skip(pageNumber == 0 ? 0 : skip)
      .sort({ createdAt: -1 })
      .lean();


    if (query.monthFilter) {
      jobs = jobs.filter((j) => new Date(j.date).getMonth() + 1 == query.monthFilter);
    }

    if (query.yearFilter) {
      jobs = jobs.filter((j) => new Date(j.date).getFullYear() == query.yearFilter);
    }

    jobs = jobs.map((j) => {
      j.createdAt = new Date(j.createdAt).toLocaleDateString();
      return j;
    });

    if (report) {
      return jobs.map(obj => {
        const { _id, sub_items, awardedId, assignedSales, total_breakpoints = {}, ...rest } = obj;

        const {
          hours = 0,
          total_cost = 0,
          bid = 0,
          bid_hour = 0,
          eng_fee = 0,
          percent = 0,
          cost = 0
        } = total_breakpoints;

        const flattenedBreakpoints = {
          Hours: hours,
          TotalCost: total_cost,
          Bid: bid,
          BidHour: bid_hour,
          EngFee: eng_fee,
          Percent: percent,
          Cost: cost
        };

        return { ...rest, ...flattenedBreakpoints };
      });
    }

    return jobs;
  } catch (err) {
    throw err;
  }
}



const leavesFilter = async (query) => {
  try {
    const { _id, canceledByEmployee, type, duration, partOfDay, name, note, approved, startDate, endDate, employeeId, rejected, date } = query
    let keys = filterNullKeys({ _id, canceledByEmployee, type, duration, partOfDay, name, note, approved, startDate, endDate, employeeId, rejected, date })
    const projection = {};
    keys.forEach(key => {
      projection[key] = 1;
    });

    let leaves
    if (keys.length == 0) {
      leaves = await absenteesModel.find({});
    } else {
      leaves = await absenteesModel.find({}).select(projection);
    }

    leaves = leaves.map((l) => {
      l._doc.startDate = new Date(l.startDate).toLocaleDateString()
      l._doc.endDate = new Date(l.endDate).toLocaleDateString()
      l._doc.date = new Date(l.date).toLocaleDateString()
      return l._doc
    })

    return leaves

  } catch (e) {
    throw e
  }
}

function filterNullKeys(query) {
  const nonNullKeys = [];
  for (const key in query) {
    if (query[key] !== null) {
      nonNullKeys.push(key);
    }
  }
  return nonNullKeys;
}

const filterAwardedJobs = async (query, pageNumber, report) => {
  if (query.rebar) return filterRebarAwardedJobs(query, pageNumber, report)
  else return filterSteelAwardedJobs(query, pageNumber, report)
}


const filterSteelAwardedJobs = async (query, pageNumber, report) => {
  try {
    const { location, tonnageStart, tonnageEnd, start, end, fields, client } = query;
    const page = pageNumber ? parseInt(pageNumber) : 1;
    let limit = 15;
    let skip = (page - 1) * limit;
    const filter = {};

    // Support for array or string
    if (location) {
      if (Array.isArray(location)) {
        filter.location = { $in: location.map(l => l[0].toUpperCase() + l.slice(1)) };
      } else {
        filter.location = location[0].toUpperCase() + location.slice(1);
      }
    }

    if (tonnageStart && tonnageEnd) {
      filter.tonnage = { $gte: tonnageStart, $lte: tonnageEnd };
    }

    // Support for client as array or string
    if (client) {
      if (Array.isArray(client)) {
        filter['jobData.client'] = { $in: client };
      } else {
        filter['jobData.client'] = client;
      }
    }

    if (start && end) {
      filter.date = { $gte: new Date(start), $lte: new Date(end) };
    }

    if (pageNumber == 0) {
      skip = 0;
      limit = 6000 * 60 * 60;
    }

    let awardeJobs = await awardedJobsModel.find(filter)
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 })
      .select('-awarded')
      .lean();

    if (query.monthFilter) {
      awardeJobs = awardeJobs.filter(j => new Date(j.date).getMonth() + 1 == query.monthFilter);
    }

    if (query.yearFilter) {
      awardeJobs = awardeJobs.filter(j => new Date(j.date).getFullYear() == query.yearFilter);
    }

    if (report) {
      return awardeJobs.map(job => {
        const { jobData, _id, __v, ...rest } = job;
        const flattenedJobData = Object.entries(jobData)
          .filter(([key]) => !["_id", "__v", "assignedSales"].includes(key))
          .reduce((acc, [key, value]) => {

            if (key === "total_breakpoints") {
              Object.entries(value).forEach(([bpKey, bpValue]) => {
                const pascalKey = bpKey.charAt(0).toUpperCase() + bpKey.slice(1);
                acc[pascalKey] = bpValue;
              });
            } else if (key !== "sub_items") {
              const pascalKey = key.charAt(0).toUpperCase() + key.slice(1);
              acc[pascalKey] = value;
            }
            return acc;
          }, {});
        return { ...rest, ...flattenedJobData };
      });
    }

    return awardeJobs;

  } catch (err) {
    throw err;
  }
}

const filterRebarAwardedJobs = async (query, pageNumber, report) => {
  try {
    const { location, tonnageStart, tonnageEnd, start, end, fields, client } = query;
    const filter = {};

    // Support for array or string
    if (location) {
      if (Array.isArray(location)) {
        filter.location = { $in: location.map(l => l[0].toUpperCase() + l.slice(1)) };
      } else {
        filter.location = location[0].toUpperCase() + location.slice(1);
      }
    }

    if (tonnageStart && tonnageEnd) {
      filter['jobData.total_breakpoints.estimatedTons'] = { $gte: parseInt(tonnageStart), $lte: parseInt(tonnageEnd) };
    }


    // Support for client as array or string
    if (client) {
      if (Array.isArray(client)) {
        filter['jobData.client'] = { $in: client };
      } else {
        filter['jobData.client'] = client;
      }
    }

    if (start && end) {
      filter.date = { $gte: new Date(start), $lte: new Date(end) };
    }


    let awardeJobs = await rebarJobs.awardedJobsModel.find(filter)
      .sort({ createdAt: -1 })
      .select('-awarded')
      .lean();

    if (query.monthFilter) {
      awardeJobs = awardeJobs.filter(j => new Date(j.date).getMonth() + 1 == query.monthFilter);
    }

    if (query.yearFilter) {
      awardeJobs = awardeJobs.filter(j => new Date(j.date).getFullYear() == query.yearFilter);
    }

    if (report) {
      return awardeJobs.map(job => {
        const { jobData, _id, __v, ...rest } = job;
        const flattenedJobData = Object.entries(jobData)
          .filter(([key]) => !["_id", "__v", "assignedSales"].includes(key))
          .reduce((acc, [key, value]) => {

            if (key === "total_breakpoints") {
              Object.entries(value).forEach(([bpKey, bpValue]) => {
                const pascalKey = bpKey.charAt(0).toUpperCase() + bpKey.slice(1);
                acc[pascalKey] = bpValue;
              });
            } else if (key !== "sub_items") {
              const pascalKey = key.charAt(0).toUpperCase() + key.slice(1);
              acc[pascalKey] = value;
            }
            return acc;
          }, {});
        return { ...rest, ...flattenedJobData };
      });
    }

    return awardeJobs;

  } catch (err) {
    throw err;
  }
}


const selectProjectFunction = async (query) => {
  const { search } = query;
  let data;
  try {
    if (search || search && search.length === 0) {
      const pattern = new RegExp(search, "i");
      const query = { $or: [{ projectName: pattern }] };
      data = await projectModel.find(query).limit(5).sort({ createdAt: -1 });
    } else {
      data = await projectModel.find().limit(5).sort({ createdAt: -1 });
    }
    return data;
  } catch (err) {
    throw err;
  }
}

const normalizeIdList = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return [];
    // support JSON array string
    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) return parsed.filter(Boolean);
      } catch (e) {
        // ignore
      }
    }
    // support comma separated list
    if (trimmed.includes(',')) return trimmed.split(',').map(s => s.trim()).filter(Boolean);
    return [trimmed];
  }
  return [];
}

const selectEmployeeFunction = async (query) => {
  const { search, exclusions, limitedUsers, projectId } = query;
  const rebar = query.rebar === 'true'

  try {
    if (rebar === true && search === 'allRebar') {
      return await employeeModel
        .find({ rebar: true })
        .select('firstName lastName email designation department role')
        .sort({ createdAt: -1 });
    }

    const filters = [];

    if (rebar === true) {
      filters.push({ rebar: true });
    }

    // Prefer server-side project member limiting (more reliable than large query strings)
    if (projectId) {
      const project = await projectModel.findById(projectId).select('members').lean();
      const memberIds = project && Array.isArray(project.members) ? project.members : [];
      if (memberIds.length > 0) {
        filters.push({ _id: { $in: memberIds } });
      }
    } else {
      const limited = normalizeIdList(limitedUsers);
      const excluded = normalizeIdList(exclusions);

      if (limited.length > 0) {
        filters.push({ _id: { $in: limited } });
      } else if (excluded.length > 0) {
        filters.push({ _id: { $nin: excluded } });
      }
    }

    if (search && search.length > 0 && search !== 'allRebar') {
      const pattern = new RegExp(search, 'i');
      filters.push({
        $or: [
          { firstName: pattern },
          { lastName: pattern }
        ]
      });
    }

    const finalQuery = filters.length === 0
      ? {}
      : filters.length === 1
        ? filters[0]
        : { $and: filters };

    const limit = (search && search.length > 0) ? 5 : 10;

    const data = await employeeModel
      .find(finalQuery)
      .select('firstName lastName email designation department role')
      .limit(limit)
      .sort({ createdAt: -1 });

    return data;
  } catch (err) {
    throw err;
  }
};

const filterProjectJobs = async (query, pageNumber) => {
  if (query.rebar) return filterRebarDashbaordJobs(query, pageNumber)
  else return filterSteelDashbaordJobs(query, pageNumber)
}

const filterSteelDashbaordJobs = async (query, pageNumber) => {
  let {
    po_price_start,
    po_price_end,
    co_price_start,
    co_price_end,
    billed_start,
    billed_end,
    billing_backlog_start,
    billing_backlog_end,
    ofa_backlog_start,
    ofa_backlog_end,
    fab_backlog_start,
    fab_backlog_end,
    bid_hours_start,
    bid_hours_end,
    co_hours_start,
    co_hours_end,
    used_hours_start,
    used_hours_end,
    backlog_hours_start,
    backlog_hours_end,
    created_start,
    created_end,
    client,
    fields
  } = query;

  if (po_price_end && !po_price_start) po_price_start = 0;
  if (co_price_end && !co_price_start) co_price_start = 0;
  if (billed_end && !billed_start) billed_start = 0;
  if (billing_backlog_end && !billing_backlog_start) billing_backlog_start = 0;
  if (ofa_backlog_end && !ofa_backlog_start) ofa_backlog_start = 0;
  if (fab_backlog_end && !fab_backlog_start) fab_backlog_start = 0;
  if (bid_hours_end && !bid_hours_start) bid_hours_start = 0;
  if (co_hours_end && !co_hours_start) co_hours_start = 0;
  if (used_hours_end && !used_hours_start) used_hours_start = 0;
  if (backlog_hours_end && !backlog_hours_start) backlog_hours_start = 0;
  if (created_end && !created_start) created_start = 0;

  const filter = {};

  const page = pageNumber ? parseInt(pageNumber) : 1;
  const limit = 15;
  const skip = (page - 1) * limit;

  if (po_price_start && po_price_end) {
    filter.po_price = {
      $gte: parseFloat(po_price_start),
      $lte: parseFloat(po_price_end),
    };
  }

  if (co_price_start && co_price_end) {
    filter.co_price = {
      $gte: parseFloat(co_price_start),
      $lte: parseFloat(co_price_end),
    };
  }

  if (billed_start && billed_end) {
    filter.billed = {
      $gte: parseFloat(billed_start),
      $lte: parseFloat(billed_end),
    };
  }

  if (billing_backlog_start && billing_backlog_end) {
    filter.billing_backlog = {
      $gte: parseFloat(billing_backlog_start),
      $lte: parseFloat(billing_backlog_end),
    };
  }

  if (ofa_backlog_start && ofa_backlog_end) {
    filter.OFABacklog = {
      $gte: parseFloat(ofa_backlog_start),
      $lte: parseFloat(ofa_backlog_end),
    };
  }

  if (fab_backlog_start && fab_backlog_end) {
    filter.FABBacklog = {
      $gte: parseFloat(fab_backlog_start),
      $lte: parseFloat(fab_backlog_end),
    };
  }

  if (bid_hours_start && bid_hours_end) {
    filter.bidHours = {
      $gte: parseFloat(bid_hours_start),
      $lte: parseFloat(bid_hours_end),
    };
  }

  if (co_hours_start && co_hours_end) {
    filter.co_hours = {
      $gte: parseFloat(co_hours_start),
      $lte: parseFloat(co_hours_end),
    };
  }

  if (used_hours_start && used_hours_end) {
    filter.usedHours = {
      $gte: parseFloat(used_hours_start),
      $lte: parseFloat(used_hours_end),
    };
  }

  if (backlog_hours_start && backlog_hours_end) {
    filter.backlogHours = {
      $gte: parseFloat(backlog_hours_start),
      $lte: parseFloat(backlog_hours_end),
    };
  }

  if (created_start && !created_end) {
    created_end = new Date(); // Default to the current date
  } else if (!created_start && created_end) {
    created_start = 0; // Default to earliest timestamp
  }

  if (client && Array.isArray(client)) {
    filter["awardedProjectData.jobData.client"] = { $in: client };
  } else if (client) {
    filter["awardedProjectData.jobData.client"] = client;
  }

  try {
    const projection = fields ? fields.reduce((p, c) => { p[c] = 1; return p; }, {}) : null;
    if (projection !== null) projection['awardedProjectData'] = 1
    let projects;
    if (projection == null) {
      projects = await ProjectDashboardModel.find(filter).sort({ created: -1 });
      projects = projects.map((p) => {
        p.created = new Date(p.created).toDateString()
        return p;
      });
    }
    else projects = await ProjectDashboardModel.find(filter, projection).sort({ created: -1 }).lean();
    if (projection === null) return projects
    else return projects.map((p) => {
      const data = {
        project: p.awardedProjectData.jobData.project,
        jobNo: p.awardedProjectData.jobNumber,
        ...p,
      }
      delete data['awardedProjectData']
      return data
    });
  } catch (err) {
    throw err;
  }
}

const filterRebarDashbaordJobs = async (query, pageNumber) => {
  let {
    billing_backlog_start,
    billing_backlog_end,
    workInProgress,
    onHold,
    client,
    location
  } = query;

  if (billing_backlog_end && !billing_backlog_start) billing_backlog_start = 0;

  const filter = {};

  if (workInProgress) filter.workInProgress = workInProgress
  if (onHold) filter.onHold = onHold
  if (billing_backlog_start && billing_backlog_end) {
    filter.billingBacklog = {
      $gte: parseFloat(billing_backlog_start),
      $lte: parseFloat(billing_backlog_end),
    };
  }

  if (client && Array.isArray(client)) {
    filter["awardedProjectData.jobData.client"] = { $in: client };
  } else if (client) {
    filter["awardedProjectData.jobData.client"] = client;
  }

  if (location) {
    if (Array.isArray(location)) {
      filter["awardedProjectData.location"] = { $in: location.map(l => l[0].toUpperCase() + l.slice(1)) };
    } else {
      filter["awardedProjectData.location"] = location[0].toUpperCase() + location.slice(1);
    }
  }

  try {
    // const projection = fields ? fields.reduce((p, c) => { p[c] = 1; return p; }, {}) : null;
    // if (projection !== null) projection['awardedProjectData'] = 1
    // let projects;
    // if (projection == null) {
    //   projects = await ProjectDashboardModel.find(filter).sort({ created: -1 });
    //   projects = projects.map((p) => {
    //     p.created = new Date(p.created).toDateString()
    //     return p;
    //   });
    // }
    projects = await rebarJobs.ProjectDashboardModel.find(filter).sort({ created: -1 }).lean();


    if (query.report) {
      const processed = projects.map((e) => {
        const { awardedProjectData, ...rest } = e;
        return {
          ...rest
        };
      });
      return processed

    }

    // return projects.map((p) => {
    //   const data = {
    //     project: p.awardedProjectData.jobData.project,
    //     jobNo: p.awardedProjectData.jobNumber,
    //     ...p,
    //   }
    //   return data
    // });
    return projects
  } catch (err) {
    throw err;
  }
}



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

    return result;
  } catch (error) {
    console.error("Error fetching employee production hours:", error);
    return { message: "Error fetching employee production hours" };
  }
};

const employeeBillingReportFunction = async (body) => {
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

const employeeLogsReport = async (body) => {
  const { created_start, created_end, id } = body;
  const endDate = created_end ? new Date(created_end) : new Date();
  const filter = {
    employeeId: id,
  };
  if (created_start) {
    const startDate = new Date(created_start);
    filter.logDate = {
      $gte: startDate,
      $lte: endDate,
    };
  } else {
    filter.logDate = { $lte: endDate };
  }
  try {
    const logs = await employeeLogsModel.find(filter);
    const report = logs.map(log => ({
      ...log.toObject()
    }));
    return report;
  } catch (error) {
    console.error('Error fetching employee logs report:', error);
    return [];
  }
};

const CompanyLogsFilter = async (body) => {
  const { created_start, created_end, department, designation, location } = body;
  // If created_start is provided but created_end is not, set created_end to current date
  const endDate = created_end || new Date().toISOString().split('T')[0]; // Current date in 'YYYY-MM-DD' format
  // Build the match stage of the aggregation pipeline based on the provided filters
  const match = {};
  // Add created_start and created_end to the match stage if present
  if (created_start) {
    match['logDate'] = { ...match['logDate'], $gte: new Date(created_start) };
  }
  if (created_end) {
    match['logDate'] = { ...match['logDate'], $lte: new Date(endDate) };
  }
  // Aggregation pipeline
  const aggregationPipeline = [
    {
      $match: match, // Match the logs based on the filters
    },
    {
      $lookup: {
        from: 'employees', // Assuming employees is the collection name
        localField: 'employeeId', // Field in logs collection that references employee
        foreignField: '_id', // Field in employees collection
        as: 'employeeDetails' // Alias for the joined data
      }
    },
    {
      $unwind: {
        path: '$employeeDetails',
        preserveNullAndEmptyArrays: true // Allow logs without matching employees
      }
    },
    {
      $match: {
        ...match, // Apply filters again after the lookup (if needed for employee-specific filters)
        ...(department && { 'employeeDetails.department': department }),
        ...(designation && { 'employeeDetails.designation': designation }),
        // ...(location && { 'employeeDetails.location': location }),
      }
    },
    {
      $project: {
        _id: 1, // Include log ID
        employeeId: 1, // Include employeeId in the result
        logDate: 1, // Include logDate
        taskMinutes: 1, // Include taskMinutes
        loginMinutes: 1, // Include loginMinutes
        createdAt: 1, // Include createdAt
        firstName: '$employeeDetails.firstName',
        lastName: '$employeeDetails.lastName',
        // location: '$employeeDetails.location',
        designation: '$employeeDetails.designation',
        department: '$employeeDetails.department',
        email: '$employeeDetails.email'
      }
    }
  ];

  const results = await employeeLogsModel.aggregate(aggregationPipeline).exec(); // `exec()` will return the result as an array in Mongoose
  return results;
};

// Main Function
async function generateTimesheetDataFromDB(body) {
  try {
    const { employees, fromDate, toDate } = body;
    const employeeIds = employees.map(emp => emp._id);
    const dates = getDatesArray(fromDate, toDate);

    let workLogs = await timeSheetActivityModel.find({
      employeeId: { $in: employeeIds },
      date: { $in: dates }
    }).lean();

    workLogs = workLogs.map(entry => {
      const seen = new Set();
      const dedupedLogs = (entry.logs || []).filter(log => {
        const key = `${log.taskId}::${log.workedTime}::${log.date}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
      return { ...entry, logs: dedupedLogs };
    });

    const taskIds = [
      ...new Set(
        workLogs.flatMap(w => (w.logs || []).map(entry => entry.taskId)).filter(Boolean)
      )
    ];
    if (taskIds.length === 0) {
      // nothing to map — return blank structure
      return employees.map(emp => ({
        date: fromDate,
        id: emp.uid,
        name: `${emp.firstName} ${emp.lastName}`,
        entries: []
      }));
    }

    // fetch tasks with taskIndex
    const tasks = await taskModel.find({ _id: { $in: taskIds } })
      .select('_id projectId taskIndex')
      .lean();

    const projectIds = [...new Set(tasks.map(t => t.projectId).filter(Boolean))];
    const projects = await projectModel.aggregate([
      { $match: { _id: { $in: projectIds } } },
      {
        $lookup: {
          from: 'awarded_jobs',
          localField: 'job',
          foreignField: 'jobId',
          as: 'awardedJobDetails'
        }
      },
      { $unwind: { path: '$awardedJobDetails', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 1,
          projectName: 1,
          poNumber: '$awardedJobDetails.jobNumber'
        }
      }
    ]);

    const projectMap = projects.reduce((m, p) => { m[p._id] = p.projectName; return m; }, {});
    const projectCodeMap = projects.reduce((m, p) => { m[p._id] = p.poNumber; return m; }, {});

    // map tasks including their taskIndex
    const taskMap = tasks.reduce((map, task) => {
      const projectName = projectMap[task.projectId] || 'Unknown Project';
      const projectNo = projectCodeMap[task.projectId] || 'Unknown Project No';
      map[task._id] = {
        projectId: task.projectId,
        projectName,
        projectNo,
        taskIndex: (typeof task.taskIndex === 'number' ? task.taskIndex : null)
      };
      return map;
    }, {});

    const startDate = new Date(fromDate);
    const endDate = new Date(toDate);
    if (endDate < startDate) throw new Error('fromDate must be on or before toDate');
    const msPerDay = 86400000;
    const dayCount = Math.floor((endDate - startDate) / msPerDay) + 1;
    const dateList = Array.from({ length: dayCount }, (_, i) => {
      const d = new Date(startDate);
      d.setDate(startDate.getDate() + i);
      return d.toISOString().split('T')[0];
    });

    const logsByEmployee = employees.reduce((acc, emp) => {
      acc[emp._id] = dateList.reduce((dAcc, date) => { dAcc[date] = []; return dAcc; }, {});
      return acc;
    }, {});

    workLogs.forEach(({ employeeId, logs, date }) => {
      const dateKey = toIsoDate(date);
      if (!logsByEmployee[employeeId] || !logsByEmployee[employeeId][dateKey]) return;
      (logs || []).forEach(({ taskId, name, workedTime }) => {
        const projectInfo = taskMap[taskId] || { projectName: 'Unknown Project', projectNo: 'Unknown', taskIndex: null };
        const idx = projectInfo.taskIndex;
        const activityLabel = idx ? `${name} #${idx}` : `${name}`;
        logsByEmployee[employeeId][dateKey].push({
          project: projectInfo.projectName,
          projectNo: projectInfo.projectNo,
          activityName: activityLabel,
          isBillable: "Y",
          hours: workedTime
        });
      });
    });

    const timesheetData = employees.map(emp => {
      const dailyLogs = logsByEmployee[emp._id] || {};
      const activityMap = {};

      dateList.forEach((date, idx) => {
        const tasksForDate = dailyLogs[date] || [];
        if (tasksForDate.length === 0) {
          Object.values(activityMap).forEach(act => { act.days[idx] = act.days[idx] || 0; });
        } else {
          tasksForDate.forEach(t => {
            const key = `${t.project}|${t.activityName}`; // activityName already includes #taskIndex
            if (!activityMap[key]) {
              activityMap[key] = {
                project: t.project,
                projectNo: t.projectNo,
                activityName: t.activityName,
                isBillable: t.isBillable,
                days: new Array(dayCount).fill(0)
              };
            }
            activityMap[key].days[idx] += t.hours;
          });
        }
      });

      return {
        date: dateList[0],
        id: emp.uid,
        name: `${emp.firstName} ${emp.lastName}`,
        entries: Object.values(activityMap)
      };
    });

    return timesheetData;
  } catch (err) {
    console.log(err);
  }
}


function validateTimesheetData(timesheetArray, startDateStr, endDateStr) {
  const startDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);

  const daysCount = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;

  const dummyEntry = {
    project: "",
    projectNo: "",
    activityName: "",
    isBillable: "NA",
    days: Array(daysCount).fill(0),
  };

  return timesheetArray.map(user => {
    if (!user.entries || user.entries.length === 0) {
      return {
        ...user,
        entries: [dummyEntry]
      };
    }
    return user;
  });
}

async function getFilteredEmployeeIds(filters) {
  const { department, designation, location } = filters;

  const query = {};
  if (department) query.department = department;
  if (designation) query.designation = designation;
  if (location) query.location = location;

  const employees = await employeeModel
    .find(query)
    .select('_id')
    .lean();


  return employees.map(emp => emp._id.toString());
}

// async function syncEmployeeLocations() {
//   try {
//     // 1) fetch all basic‐details documents (we only need employeeId & city)
//     const details = await employeeBasicDetailsModel.find({}, 'employeeId city').lean();

//     if (details.length === 0) {
//       console.log('No basic‐details found; nothing to do.');
//       return;
//     }

//     // 2) build a bulkWrite payload to update all at once
//     const ops = details.map(({ employeeId, city }) => ({
//       updateOne: {
//         filter: { employeeId },        // or { _id: employeeId } if you use _id
//         update: { $set: { location: city } },
//         upsert: false
//       }
//     }));

//     // 3) execute
//     const result = await employeeModel.bulkWrite(ops);
//     console.log(`Locations synced: ${result.nModified} document(s) updated.`);
//   }
//   catch (err) {
//     console.error('Error while syncing locations:', err);
//     throw err;
//   }
// }

const setDepartmts = async () => {
  const employees = [{ 'email': 'geetharajesh@vectorshades.com', 'rebar': true, 'location': 'Cochin' }, { 'email': 'linomol.mp@vectorshades.com', 'rebar': true, 'location': 'Cochin' }, { 'email': 'r.rajan@vectorshades.com', 'rebar': true, 'location': 'Cochin' }, { 'email': 'bindu@vectorshades.com', 'rebar': true, 'location': 'Cochin' }, { 'email': 'alex.aj@vectorshades.com', 'rebar': true, 'location': 'Cochin' }, { 'email': 'ambily.mohan@vectorshades.com', 'rebar': true, 'location': 'Cochin' }, { 'email': 'rinila.kb@vectorshades.com', 'rebar': true, 'location': 'Cochin' }, { 'email': 'alphonseraj.p@vectorshades.com', 'rebar': true, 'location': 'Cochin' }, { 'email': 'ronimon.kv@vectorshades.com', 'rebar': true, 'location': 'Cochin' }, { 'email': 'pretty.thomas@vectorshades.com', 'rebar': true, 'location': 'Cochin' }, { 'email': 'anju.sasidharan@vectorshades.com', 'rebar': true, 'location': 'Cochin' }, { 'email': 'megha.cs@vectorshades.com', 'rebar': true, 'location': 'Cochin' }, { 'email': 'vibinbose.pk@vectorshades.com', 'rebar': true, 'location': 'Cochin' }, { 'email': 'akila.p@vectorshades.com', 'rebar': true, 'location': 'Chennai' }, { 'email': 'harikrishnan.m@vectorshades.com', 'rebar': false, 'location': 'Cochin' }, { 'email': 'shijina.kp@vectorshades.com', 'rebar': false, 'location': 'Cochin' }, { 'email': 'priyaja.ap@vectorshades.com', 'rebar': false, 'location': 'Cochin' }, { 'email': 'chinchu.abraham@vectorshades.com', 'rebar': false, 'location': 'Cochin' }, { 'email': 'archana.s@vectorshades.com', 'rebar': false, 'location': 'Cochin' }, { 'email': 'nibu.chacko@vectorshades.com', 'rebar': false, 'location': 'Cochin' }, { 'email': 'sujilal.sabin@vectorshades.com', 'rebar': false, 'location': 'Cochin' }, { 'email': 'akhildas@vectorshades.com', 'rebar': false, 'location': 'Cochin' }, { 'email': 'murugan.r@vectorshades.com', 'rebar': false, 'location': 'Cochin' }, { 'email': 'dhanilkumar.m@vectorshades.com', 'rebar': false, 'location': 'Cochin' }, { 'email': 'praveen.ac@vectorshades.com', 'rebar': false, 'location': 'Cochin' }, { 'email': 'anzilrahman.pi@vectorshades.com', 'rebar': false, 'location': 'Cochin' }, { 'email': 'jisnaj.kalathiparambil@vectorshades.com', 'rebar': false, 'location': 'Cochin' }, { 'email': 'nandagopal.s@vectorshades.com', 'rebar': false, 'location': 'Cochin' }, { 'email': 'rinisha.pk@vectorshades.com', 'rebar': false, 'location': 'Cochin' }, { 'email': 'jinesh.t@vectorshades.com', 'rebar': false, 'location': 'Cochin' }, { 'email': 'sreerag.harish@vectorshades.com', 'rebar': false, 'location': 'Cochin' }, { 'email': 'krishnapriya@vectorshades.com', 'rebar': false, 'location': 'Cochin' }, { 'email': 'saranya_s@vectorshades.com', 'rebar': false, 'location': 'Cochin' }, { 'email': 'muhammadnishad.n@vectorshades.com', 'rebar': false, 'location': 'Cochin' }, { 'email': 'fathima.mn@vectorshades.com', 'rebar': false, 'location': 'Cochin' }, { 'email': 'jomoned@vectorshades.com', 'rebar': false, 'location': 'Cochin' }, { 'email': 'jithin.r@vectorshades.com', 'rebar': false, 'location': 'Cochin' }, { 'email': 'haripriya.s@vectorshades.com', 'rebar': false, 'location': 'Cochin' }, { 'email': 'gopika.g@vectorshades.com', 'rebar': false, 'location': 'Cochin' }, { 'email': 'mohammedshibili.t@vectorshades.com', 'rebar': false, 'location': 'Cochin' }, { 'email': 'reshma.m@vectorshades.com', 'rebar': false, 'location': 'Cochin' }, { 'email': 'arunamuthan.m@vectorshades.com', 'rebar': false, 'location': 'Cochin' }, { 'email': 'geethuraj.kr@vectorshades.com', 'rebar': false, 'location': 'Cochin' }, { 'email': 'vidyanath.pk@vectorshades.com', 'rebar': false, 'location': 'Cochin' }, { 'email': 'arjun.pr@vectorshades.com', 'rebar': false, 'location': 'Cochin' }, { 'email': 'akshara.raj@vectorshades.com', 'rebar': false, 'location': 'Cochin' }, { 'email': 'anju.kh@vectorshades.com', 'rebar': false, 'location': 'Cochin' }, { 'email': 'ajith.v@vectorshades.com', 'rebar': false, 'location': 'Cochin' }, { 'email': 'deepak.u@vectorshades.com', 'rebar': false, 'location': 'Cochin' }, { 'email': 'geetha.s@vectorshades.com', 'rebar': false, 'location': 'Chennai' }, { 'email': 'kamalkumar@vectorshades.com', 'rebar': false, 'location': 'Chennai' }, { 'email': 'meenakshisundharam.m@vectorshades.com', 'rebar': false, 'location': 'Chennai' }, { 'email': 'raghu.m@vectorshades.com', 'rebar': false, 'location': 'Chennai' }, { 'email': 'keerthivasan.r@vectorshades.com', 'rebar': false, 'location': 'Chennai' }, { 'email': 'abinaya.a@vectorshades.com', 'rebar': false, 'location': 'Chennai' }, { 'email': 'mathavan.n@vectorshades.com', 'rebar': false, 'location': 'Chennai' }, { 'email': 'saravanan.s@vectorshades.com', 'rebar': false, 'location': 'Chennai' }, { 'email': 'harish.s@vectorshades.com', 'rebar': false, 'location': 'Chennai' }, { 'email': 'patturajan.g@vectorshades.com', 'rebar': false, 'location': 'Chennai' }, { 'email': 'ashok.ns@vectorshades.com', 'rebar': false, 'location': 'Chennai' }, { 'email': 'boopathi.mani@vectorshades.com', 'rebar': false, 'location': 'Chennai' }, { 'email': 'praveenkumar.r@vectorshades.com', 'rebar': false, 'location': 'Chennai' }, { 'email': 'suganthi.s@vectorshades.com', 'rebar': false, 'location': 'Chennai' }, { 'email': 'divya.s@vectorshades.com', 'rebar': false, 'location': 'Chennai' }, { 'email': 'lokesh.r@vectorshades.com', 'rebar': false, 'location': 'Chennai' }, { 'email': 'boopathi.p@vectorshades.com', 'rebar': false, 'location': 'Chennai' }, { 'email': 'sakthivel.m@vectorshades.com', 'rebar': false, 'location': 'Chennai' }, { 'email': 'praveenkumar.sehkar@vectorshades.com', 'rebar': false, 'location': 'Chennai' }, { 'email': 'prathap.sengagoundar@vectorshades.com', 'rebar': false, 'location': 'Chennai' }, { 'email': 'aiswarya.bhuyan@vectorshades.com', 'rebar': false, 'location': 'Chennai' }, { 'email': 'maharajan.n@vectorshades.com', 'rebar': false, 'location': 'Chennai' }, { 'email': 'ramya.kennady@vectorshades.com', 'rebar': false, 'location': 'Chennai' }, { 'email': 'karthikeyan.r@vectorshades.com', 'rebar': false, 'location': 'Chennai' }, { 'email': 'poondhalir.s@vectorshades.com', 'rebar': false, 'location': 'Chennai' }, { 'email': 'sivabharathi.s@vectorshades.com', 'rebar': false, 'location': 'Chennai' }, { 'email': 'abhilash.sekar@vectorshades.com', 'rebar': false, 'location': 'Chennai' }];
  for (const emp of employees) {
    await employeeModel.updateOne(
      { email: emp.email },
      {
        $set: {
          rebar: emp.rebar,
          location: emp.location
        }
      },
      { upsert: false }
    );
  }
}

const employeesWorkHrsFunction = async (body) => {
  let employees;
  if (body.filterByDept === 'rebarOrSteel') {
    employees = await employeeModel
      .find({ rebar: body.department === 'rebar', role: 'EMP' ,active:true})
      .select('_id firstName uid lastName email code role designation department')
      .lean();
  }
  else if (body.employees === undefined) {
    employeesIds = await getFilteredEmployeeIds(body)
    employees = await employeeModel
      .find({ _id: { $in: employeesIds } , active:true })
      .select('_id firstName uid code lastName email role designation department')
      .lean();
  }
  else {
    employees = await employeeModel
      .find({ _id: { $in: body.employees.map((emp) => emp._id) } })
      .select('_id firstName uid code lastName email role designation department')
      .lean();
  }
  body.employees = employees.sort((a, b) => {
    const nameA = a.firstName.toLowerCase();
    const nameB = b.firstName.toLowerCase();
    return nameA.localeCompare(nameB);
  });
  const timesheetData = await generateTimesheetDataFromDB(body)
  const validatedData = validateTimesheetData(timesheetData, body.fromDate, body.toDate)
  const excelData = await generateProductionHoursExcelData(validatedData)
  return excelData
}

async function getEmployeeProjectTimesheet(employeeId, projectId) {
  try {
    const tasks = await taskModel.find({ projectId, assignedTo: employeeId }).select('-assignedByName -assignedToName -type').lean()
    return tasks
  } catch (err) {
    console.error(`Error generating timesheet for employee ${employeeId} on project ${projectId}:`, err);
    throw err; // Re-throw for proper error handling
  }
}

function validateTimesheetDataWithoutDateRange(timesheetData) {
  // If no timesheet data provided, return empty structure
  if (!timesheetData) {
    return {
      employeeId: '',
      employeeName: '',
      projectId: '',
      projectName: '',
      activities: []
    };
  }

  // Collect all unique dates from all activities
  const allDates = new Set();
  (timesheetData.activities || []).forEach(activity => {
    (activity.entries || []).forEach(entry => {
      if (entry.date) {
        allDates.add(entry.date);
      }
    });
  });

  // Convert to sorted array
  const sortedDates = Array.from(allDates).sort();

  // If no dates found, return with empty activities
  if (sortedDates.length === 0) {
    return {
      ...timesheetData,
      activities: [{
        activityName: 'No activities recorded',
        isBillable: 'NA',
        entries: []
      }]
    };
  }

  // Process activities
  const validatedActivities = (timesheetData.activities || []).map(activity => {
    // Create a map of existing entries by date for quick lookup
    const entriesMap = new Map();
    (activity.entries || []).forEach(entry => {
      if (!entry.date) return;

      // Validate hours (fix extremely large values)
      let hours = entry.hours;
      if (typeof hours !== 'number' || hours > 24 || hours < 0) {
        console.warn(`Invalid hours value (${hours}) for activity "${activity.activityName}" on ${entry.date}`);
        hours = Math.min(24, Math.max(0, hours || 0)); // Clamp to 0-24 range
      }
      entriesMap.set(entry.date, hours);
    });

    // Create entries array for all found dates
    const fullEntries = sortedDates.map(date => ({
      date,
      hours: entriesMap.get(date) || 0 // Default to 0 if no entry exists
    }));

    return {
      activityName: activity.activityName || 'Unknown Activity',
      isBillable: activity.isBillable || 'Y',
      entries: fullEntries
    };
  });

  return {
    employeeId: timesheetData.employeeId || '',
    employeeName: timesheetData.employeeName || '',
    projectId: timesheetData.projectId || '',
    projectName: timesheetData.projectName || '',
    activities: validatedActivities,
    dateRange: {
      startDate: sortedDates[0],
      endDate: sortedDates[sortedDates.length - 1]
    }
  };
}

const employeesProjectPersonalWorkHrsFunction = async (body) => {
  const timesheetData = await getEmployeeProjectTimesheet(body.employee, body.project)
  return timesheetData
}


const ProjectProductionBilling = async (body) => {
  try {
    const projects = await ProjectProductionList(body)
    const projectsWithCost = projects.map(project => {
      const hourlyRate = 16;
      project.totalAllocatedCost = '$' + convertHrsStrToDecimal(project.totalHours) * hourlyRate
      project.totalUsedCost = '$' + convertHrsStrToDecimal(project.completedHours) * hourlyRate

      return project
    });

    return projectsWithCost;
  } catch (error) {
    console.error("Error fetching project summary with cost:", error);
    return { message: "Error fetching project summary with cost" };
  }
};

const ProjectProductionList = async (body) => {
  try {
    const matchStage = {};
    if (body.location) {
      matchStage.location = body.location;
    }
    if (typeof body.rebar === "boolean") {
      matchStage.rebar = body.rebar;
    }
    if (body.year) {
      const yearNum = Number(body.year);
      if (!isNaN(yearNum)) {
        const startOfYear = new Date(Date.UTC(yearNum, 0, 1, 0, 0, 0));
        const startOfNextYear = new Date(Date.UTC(yearNum + 1, 0, 1, 0, 0, 0));
        matchStage.createdAt = {
          $gte: startOfYear,
          $lt: startOfNextYear,
        };
      }
    }

    const pipeline = [];
    if (Object.keys(matchStage).length > 0) {
      pipeline.push({ $match: matchStage });
    }
    pipeline.push({
      $lookup: {
        from: "tasks",
        localField: "_id",
        foreignField: "projectId",
        as: "tasks",
      },
    });
    pipeline.push({
      $project: {
        projectName: 1,
        location: 1,
        rebar: 1,
        createdAt: 1,
        updatedAt: 1,
        projectNo: 1,
        createdBy: 1,
        client: 1,
        description: 1,
        status: 1,
        active: 1,
        completed: 1,
        totalTasks: { $size: "$tasks" },
        pendingTasks: {
          $size: {
            $filter: { input: "$tasks", as: "task", cond: { $eq: ["$$task.completed", false] } },
          },
        },
        completedTasks: {
          $size: {
            $filter: { input: "$tasks", as: "task", cond: { $eq: ["$$task.completed", true] } },
          },
        },
        totalHours: { $sum: "$tasks.allocatedHours" },
        completedHours: { $sum: "$tasks.completedHours" },
        estimatedHours: 1,
      },
    });

    const projects = await projectModel.aggregate(pipeline);

    return projects.map((item) => {
      const data = {
        ...item,
        totalHours: formatHours(item.totalHours),
        completedHours: formatHours(item.completedHours),
        estimatedHours: formatHours(item.estimatedHours),
      };
      delete data._id;
      return data;
    });
  } catch (error) {
    console.error("Error fetching project summary:", error);
    return { message: "Error fetching project summary" };
  }
};


const filterFunctionsObject = {
  employee: filterEmployeeFunction
}

module.exports = { ProjectProductionBilling, ProjectProductionList, employeesWorkHrsFunction, employeesProjectPersonalWorkHrsFunction, filterFunctionsObject, filterEmployee, selectEmployeeFunction, selectProjectFunction, filterJobs, filterAwardedJobs, filterProjectJobs, filterEmployeeFunction, leavesFilter, employeeProductionHrsFunction, employeeBillingReportFunction, employeeLogsReport, CompanyLogsFilter }