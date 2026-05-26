const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { v4: uuidv4 } = require('uuid');
const roles = require('../../Config/constants/roles');
const { getWorkedSessionsForDay } = require("../../Helpers/Functions/General/data");
const { getDate } = require("../../Helpers/Functions/General/getDate");

const projectSchema = new Schema({
    _id: { type: String, default: uuidv4 },
    projectName: { type: String, required: true },
    job: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    projectNo: { type: Number, required: false },
    members: { type: Array, required: true },
    membersByName: { type: Array, default: [] },
    createdById: { type: String, required: true },
    createdBy: { type: String, default: "" },
    admin: { type: Array, required: true },
    location: { type: String, default: 'Kochi' },
    rebar: { type: Boolean, required: false, default: false },
    adminByNames: { type: Array, default: [] },
    hours: { type: Number, default: 0 },
    tasks: { type: Array, default: [] },
    estimatedHours: { type: Number, required: true },
    client: { type: String, required: true },
    description: { type: String, required: true },
    completed: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
    status: { type: String, default: "In Progress" },
})

const taskSchema = new Schema({
    _id: { type: String, default: uuidv4 },
    createdBy: { type: String, required: true },
    type: { type: String, required: true },
    taskIndex: { type: Number, default: 0 },
    projectId: { type: String, required: true },
    assignedTo: { type: String, required: true },
    assignedBy: { type: String, default: '' },
    assignedByName: { type: String, default: '' },
    assignedToName: { type: String, default: '' },
    actualHours: { type: Number },
    billable: { type: Boolean, default: false },
    tonsDetailed: { type: Number },
    processedHours: { type: Number },
    name: { type: String, required: true },
    description: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    allocatedHours: { type: Number, default: 0 },
    completedHours: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
    startedOn: { type: Date, default: null },
    priority: { type: String, default: 'Relaxed' },
    completed: { type: Boolean, default: false },
    status: { type: String, default: 'queued' },
    dueDate: { type: Date, default: null },
    section: { type: String, required: true },
    resumedAt: { type: Date },
    drawing: { type: String, default: 'null' },
    activity: { type: String, required: false, default: null },
    subTask: { type: String, required: false, default: null },
    task: { type: String, required: false, default: null },
});

taskSchema.pre('save', async function (next) {
    if (!this.isNew) return next();
    if (this.taskIndex && this.taskIndex > 0) return next();

    try {
        const count = await this.constructor.countDocuments();
        this.taskIndex = count + 1;
        next();
    } catch (err) {
        next(err);
    }
});

const taskActivitySchema = new Schema({
    _id: { type: String, default: uuidv4 },
    text: { type: String, required: true },
    type: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    taskId: { type: String, required: true },
    projectId: { type: String, required: true },
    edited: { type: Boolean, default: false },
    createdBy: { type: Object, required: true },
})

const activitySchema = new Schema({
    _id: { type: String, default: uuidv4 },
    text: { type: String, required: true },
    type: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    projectId: { type: String, required: true },
})

const drawingSchema = new Schema({
    _id: { type: String, default: uuidv4 },
    name: { type: String, required: true },
    client: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    lastUpdated: { type: Date, default: Date.now },
    deuDate: { type: Date, required: true },
    estimatedHour: { type: String, required: true },
    projectId: { type: String, required: true }
})

activitySchema.post('save', async (doc, next) => {
    await projectModel.findOneAndUpdate({ _id: doc.projectId }, { $set: { updatedAt: new Date() } })
    next()
})


taskSchema.pre('findOneAndUpdate', async function (next) {
    const data = this.getUpdate().$set;
    const { employeeModel } = require('../Employee/index');
    const taskData = await taskModel.findOne({ _id: data.id });
    const employee = await employeeModel.findOne({ _id: taskData.assignedTo });
    if (employee && roles[employee.designation]) {
        const designationDetails = roles[employee.designation];
        const completedHours = data.completedHours;
        const trackingPercentage = designationDetails.tracking;
        if (typeof completedHours === 'number' && typeof trackingPercentage === 'number' && !isNaN(completedHours) && !isNaN(trackingPercentage)) {
            const processedHours = (completedHours * trackingPercentage) / 100;
            const processedHoursTwoDecimal = processedHours.toFixed(2);
            const processedHoursTwoDecimalNumber = parseFloat(processedHoursTwoDecimal);
            data.processedHours = processedHoursTwoDecimalNumber;
        } else data.processedHours = 0;
    }
    next();
});

projectSchema.pre('save', async function (next) {
    if (!this.projectNo) {
        try {
            const projectCount = await projectModel.countDocuments();
            this.projectNo = projectCount + 1;
        } catch (error) {
            return next(error);
        }
    }
    next();
});

var projectModel = mongoose.model('projects', projectSchema);
var taskModel = mongoose.model('tasks', taskSchema);
var activityModel = mongoose.model('activities', activitySchema);
var taskActivityModel = mongoose.model('taskActivity', taskActivitySchema);
var drawingModel = mongoose.model('drawing', drawingSchema)

module.exports = { projectModel, taskModel, activityModel, taskActivityModel, drawingModel }
