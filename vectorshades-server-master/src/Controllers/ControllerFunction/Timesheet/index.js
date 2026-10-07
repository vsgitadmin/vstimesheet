const { query } = require('express')
const { data } = require('../../../Config/constants/EmployeeActivationData')
const { employeeModel } = require('../../../Models/Employee')
const { timesheet: { attendenceModel, absenteesModel, timeSheetActivityModel }, timesheet } = require('../../../Models/Extractor/index')
const { timeSheetModel } = require('../../../Models/Timesheet')
const { createNotification } = require('../Communication')
const { taskActivityModel, taskModel, projectModel } = require('../../../Models/Projects')

const markAttendence = async (body) => {
    try {
        const attendence = new attendenceModel(body).save()
        return attendence
    } catch (err) {
        throw err
    }
}

const getAttendence = async (id) => {
    try {
        const attendence = await attendenceModel.find({ employeeid: id })
        return attendence
    } catch (err) {
        throw err
    }
}

const updateAttendence = async (id, body) => {
    try {
        const updatedAttendence = await attendenceModel.findOneAndUpdate({ _id: id }, { $set: body })
        return updatedAttendence
    } catch (err) {
        throw err
    }
}

const getSingleAttendence = async (id) => {
    try {
        const attendence = await attendenceModel.findOne({ _id: id })
        return attendence
    } catch (err) {
        throw err
    }
}

const createLeaveRequest = async (body) => {
    try {
        const employee = await employeeModel.findById(body.employeeId)
        body.name = `${employee.firstName} ${employee.lastName}`
        const absent = new absenteesModel(body).save()
        return absent
    } catch (err) {
        throw err
    }
}

const updateLeave = async (id, body) => {
    try {
        const leave = await absenteesModel.findOneAndUpdate({ _id: id }, { $set: body })
        return leave
    } catch (err) {
        throw err
    }
}

const deleteLeave = async (id, role) => {
    try {
        const response = await absenteesModel.findOne({ _id: id })
        if (role == "EMP") {
            if (response.startDate > new Date()) return absenteesModel.findOneAndDelete({ _id: id })
            else throw { message: "You are not allowed to delete past date" }
        }
        else return absenteesModel.findOneAndDelete({ _id: id })
    } catch (err) {
        throw err
    }
}

const getLeaveDetails = async (id) => {
    try {
        const response = absenteesModel.findOne({ _id: id })
        return response
    } catch (err) {
        throw err
    }
}

const getLeaveCount = async (query) => {
    try {
        const response = absenteesModel.find(query).count()
        return response
    } catch (err) {
        throw err
    }
}

const ApproveLeave = async (id, empId) => {
    try {
        var AllMonths = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
        const month = new Date().getMonth()
        const leaveData = await absenteesModel.findOneAndUpdate({ _id: id }, { $set: { approved: true } })
        let [timeSheetObj] = await timeSheetModel.find({ empId: leaveData.employeeId, month: AllMonths[month] })
        timeSheetObj.timeSheet = timeSheetObj.timeSheet.map((data) => {
            let [startDate, endDate, currentDate, dayData] = [leaveData.startDate.getDay(), leaveData.endDate.getDay(), data.date.getDay(), data]
            if (currentDate >= startDate && currentDate <= endDate) dayData.approved = true
            return dayData
        })
        await timeSheetModel.updateOne({ empId: leaveData.employeeId, month: AllMonths[month] }, { $set: { timeSheet: timeSheetObj.timeSheet } })
        await createNotification({ text: "Your Leave Has Been Approved", reciever: leaveData.employeeId, link: `/admin/dashboard/` })
        return leaveData
    } catch (err) {
        console.log(err);
        throw err
    }
}

const getAllLeavByHR = async (query) => {
    let pageNumber = query.page
    let filterMode = query.filter
    try {
        let page = pageNumber >= 1 ? pageNumber : 1;
        page = page - 1
        const limit = 16

        let response
        if (filterMode) response = await absenteesModel.find()
        else response = await absenteesModel.find().limit(limit).skip(page * limit).sort({ createdAt: -1 })

        if (query.pod) {
            response = response.filter((d) => {
                return d.partOfDay != null
            })
        }
        if (query.approved) {
            response = response.filter((d) => {
                return d.approved
            })
        }
        if (query.leaveType) {
            response = response.filter((d) => {
                return d.type == query.leaveType
            })
        }
        let search = query.searchKey
        if (search) {
            response = response.filter((d) => {
                return d.name?.toLocaleLowerCase().includes(search) || d.type?.toLocaleLowerCase().includes(search) || d.message?.toLocaleLowerCase().includes(search)
            })
        }
        if (query.dateFilter && query.dateFilter.startDate && query.dateFilter.endDate) {
            const startDate = new Date(query.dateFilter.startDate);
            const endDate = new Date(query.dateFilter.endDate);

            response = response.filter((d) => {
                const date = new Date(d.date);
                return date >= startDate && date <= endDate;
            });
        }
        return response
    } catch (err) {
        throw err
    }
}

const getAllLeave = async (id, query) => {
    try {
        if (query.filter) {
            if (query.search) {
                let leave = await absenteesModel.find({ employeeId: id }).sort({ date: -1 })
                leave = leave.map((l) => {
                    return l._doc
                })
                leave = leave.filter((l) => {
                    return l.note?.includes(query.search) || l.name?.includes(query.search)
                })
                return leave
            } else {
                let leave = await absenteesModel.find({ employeeId: id }).sort({ date: -1 })
                leave = leave.map((l) => {
                    return l._doc
                })

                if (query.leaveTypes) {
                    leave = leave.filter((l) => {
                        return query.leaveTypes.includes(l.type)
                    })
                }

                if (query.pod) {
                    leave = leave.filter((l) => {
                        return l.partOfDay
                    })
                }

                if (query.approved) {
                    leave = leave.filter((l) => {
                        return l.approved
                    })
                }

                if (query.dateFilter) {
                    if (query.dateFilter.startDate) {
                        leave = leave.filter((l) => {
                            let startDate = new Date(query.dateFilter.startDate)
                            let leaveDate = new Date(l.date)
                            return leaveDate >= startDate
                        })
                    }

                    if (query.dateFilter.endDate) {
                        leave = leave.filter((l) => {
                            let endDate = new Date(query.dateFilter.endDate)
                            let leaveDate = new Date(l.date)
                            return leaveDate <= endDate
                        })
                    }
                }

                return leave
            }
        } else {
            let page = query.page >= 1 ? query.page : 1;
            page = page - 1
            const PerPage = 10
            const leave = await absenteesModel.find({ employeeId: id }).limit(PerPage).skip(page * PerPage).sort({ date: -1 })
            return leave
        }
    } catch (err) {
        throw err
    }
}

const getAllLeaveRaw = async (query, pageNumber) => {
    try {
        let page = pageNumber >= 1 ? pageNumber : 1;
        page = page - 1
        const PerPage = 10
        const leave = await absenteesModel.find(query).skip(page * PerPage).limit(PerPage).sort({ date: -1 })
        return leave
    } catch (err) {
        throw err
    }
}


const createTimesheet = async (body) => {
    try {
        const response = new timeSheetModel(body).save()
        return response
    } catch (err) {
        throw err
    }
}

const getTimeSheet = async (id) => {
    try {
        const timesheet = await timeSheetModel.find({ empId: id })
        return timesheet
    } catch (err) {
        throw err
    }
}

const updateTimeSheet = async (id, body) => {
    try {
        const timesheet = await timeSheetModel.findOneAndUpdate({ _id: id }, { $set: body }, { new: true })
        return timesheet
    } catch (err) {
        throw err
    }
}

const aggregateTimeSheet = async (query) => {
    try {
        const aggreGatedData = await timeSheetModel.findOne(query)
        return aggreGatedData
    } catch (err) {
        console.log(err);
        throw err
    }
}

const getTimeSheetActivities = async (query) => {
    try {
        const response = await timeSheetActivityModel.find({ employeeId: query.id })
        return response
    } catch (err) {
        throw err
    }
}

const updateTimeSheetActivity = async (body) => {
    try {
        const response = await timeSheetActivityModel.findOneAndUpdate({ _id: body.id }, { $set: body })
        return response
    } catch (err) {
        console.log(err);
        throw err
    }
}

const deleteTimeSheetActivity = async (body) => {
    try {
        const response = await timeSheetActivityModel.findOneAndDelete({ _id: body.id })
        return response
    } catch (err) {
        throw err
    }
}

const getSingleDayActivityTimeSheet = async (query) => {
    try {
        const inputDate = query.date;
        const [day, month, year] = inputDate.split("-");

        const startOfDay = new Date(`${year}-${month}-${day}T00:00:00.000Z`);
        const endOfDay = new Date(`${year}-${month}-${day}T23:59:59.999Z`);

        const userTasks = await taskModel.aggregate([
            {
                $match: {
                    assignedTo: query.id,
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
        ])
        const taskIds = userTasks.map(task => task._id);
        const taskMap = new Map(userTasks.map(task => [String(task._id), task]));

        if (taskIds.length === 0) return [];

        const activities = await taskActivityModel.find({
            taskId: { $in: taskIds },
            createdAt: { $gte: startOfDay, $lte: endOfDay }
        }).lean()

        const processed = activities.map((activity) => {
            activity.task = userTasks.filter((data) => data._id == activity.taskId)[0]
            // const project = await projectModel.findOne({_id:activity.task.projectId}).select('projectName').lean()
            // activity.projectName = project.projectName
            return activity
        });

        return processed;
    } catch (err) {
        console.log(err)
        throw err
    }
}

const deleteTimeSheet = async (query) => {
    try {
        const response = await timeSheetModel.deleteOne({ _id: query.id })
        return response
    } catch (err) {
        throw err
    }
}

const fetchAllUserTimeSheets = async (id) => {
    try {
        const response = await timeSheetActivityModel.find({ employeeId: id })
        return response
    } catch (err) {
        throw err
    }
}

const forwardLeave = async (body) => {
    try {
        const response = await absenteesModel.findOneAndUpdate({ _id: body.id }, { $set: { forwardedTo: body.user } }, { new: true })
        return response
    } catch (err) {
        throw err
    }
}

const cancelLeave = async (id, empId) => {
    try {
        var AllMonths = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
        const month = new Date().getMonth();
        const leaveData = await absenteesModel.findOneAndUpdate({ _id: id }, { $set: { canceledByEmployee: true } });
        let [timeSheetObj] = await timeSheetModel.find({ empId: leaveData.employeeId, month: AllMonths[month] });
        timeSheetObj.timeSheet = timeSheetObj.timeSheet.map((data) => {
            let [startDate, endDate, currentDate, dayData] = [leaveData.startDate.getDay(), leaveData.endDate.getDay(), data.date.getDay(), data];
            if (currentDate >= startDate && currentDate <= endDate) {
                return null; // Mark the element for removal
            }
            return dayData;
        });
        timeSheetObj.timeSheet = timeSheetObj.timeSheet.filter((data) => data !== null); // Remove marked elements

        await timeSheetModel.updateOne({ empId: leaveData.employeeId, month: AllMonths[month] }, { $set: { timeSheet: timeSheetObj.timeSheet } });
        return leaveData;
    } catch (err) {
        console.log(err);
        throw err
    }
}

const validateLeave = async (query, empId) => {
    try {
        let user_leaves = await absenteesModel.find({ employeeId: empId, rejected: false });
        const today = new Date();
        const startDate = new Date(query.startDate);
        const endDate = new Date(query.endDate);
        // if (!(startDate >= today && endDate > today)) return { valid: false, message: 'Invalid Dates' }
        const hasLeaveToday = user_leaves.some((leave) => leave.startDate <= today && leave.endDate >= today);
        if (hasLeaveToday) return { valid: false, message: 'Leave already requested for today' }

        const hasPartOfDayLeave = user_leaves.some((leave) =>
            leave.startDate <= startDate &&
            leave.endDate >= startDate &&
            leave.partOfDay === query.partOfDay
        );

        if (hasPartOfDayLeave) return { valid: false, message: 'Part of day already requested for the selected date' };

        const overlappingLeave = user_leaves.some((leave) =>
            (leave.startDate <= endDate && leave.endDate >= startDate) ||
            (startDate <= leave.endDate && endDate >= leave.startDate)
        );
        if (overlappingLeave) return { valid: false, message: 'Overlapping leave requests' };
        return { valid: true, message: 'Leave request is valid' };
    } catch (err) {
        throw err;
    }
};

const fetchAllForwardedLeaves = (query, headerId) => {
    try {
        let leaves = absenteesModel.find({ forwardedTo: query.id || headerId }).sort({ createdAt: -1 })
        return leaves
    } catch (err) { throw err }
}

const rejectLeave = async (query, body) => {
    try {
        var AllMonths = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
        const month = new Date().getMonth();
        const leaveData = await absenteesModel.findOneAndUpdate({ _id: query.id }, { $set: body }, { new: true });
        let [timeSheetObj] = await timeSheetModel.find({ empId: leaveData.employeeId, month: AllMonths[month] });
        timeSheetObj.timeSheet = timeSheetObj.timeSheet.map((data) => {
            let [startDate, endDate, currentDate, dayData] = [leaveData.startDate.getDay(), leaveData.endDate.getDay(), data.date.getDay(), data];
            if (currentDate >= startDate && currentDate <= endDate) {
                return null;
            }
            return dayData;
        });
        timeSheetObj.timeSheet = timeSheetObj.timeSheet.filter((data) => data !== null);
        await timeSheetModel.updateOne({ empId: leaveData.employeeId, month: AllMonths[month] }, { $set: { timeSheet: timeSheetObj.timeSheet } });
        return leaveData;
    } catch (err) {
        console.log(err);
        throw err
    }
}

module.exports = {
    markAttendence,
    getAllLeavByHR,
    ApproveLeave,
    getAllLeaveRaw,
    getAttendence,
    getLeaveCount,
    updateAttendence,
    getSingleAttendence,
    createLeaveRequest,
    updateLeave,
    deleteLeave,
    getLeaveDetails,
    getAllLeave,
    createTimesheet,
    getTimeSheet,
    updateTimeSheet,
    aggregateTimeSheet,
    getTimeSheetActivities,
    updateTimeSheetActivity,
    deleteTimeSheetActivity,
    getSingleDayActivityTimeSheet,
    deleteTimeSheet,
    fetchAllUserTimeSheets,
    forwardLeave,
    cancelLeave,
    validateLeave,
    fetchAllForwardedLeaves,
    rejectLeave
}