const mongoose = require("mongoose")
const { v4: uuidv4 } = require('uuid');
const Schema = mongoose.Schema;

const codeSchema = new Schema(({
    code: { type: String, default: '000000' }, expiry: { type: String, default: new Date().toString() }
}))

const punchInSchema = new Schema({
    status: { type: Boolean, default: false },
    total: { type: new Schema({ inTime: { type: Number, default: 0 }, outTime: { type: Number, default: 0 }, current: { type: Date, required: true }, lastUpdate: { type: Date, default: Date.now } }) },
    month: { type: new Schema({ inTime: { type: Number, default: 0 }, outTime: { type: Number, default: 0 }, current: { type: Date, required: true }, lastUpdate: { type: Date, default: Date.now } }) },
    day: { type: new Schema({ inTime: { type: Number, default: 0 }, outTime: { type: Number, default: 0 }, current: { type: Date, required: true }, lastUpdate: { type: Date, default: Date.now } }) },
    logs: { type: [new Schema({ msg: { type: String, default: "" }, date: { type: Date, default: Date.now } })], default: [] }
})

const employeeSchema = new Schema({
    _id: { type: String, default: uuidv4 },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    role: { type: String, required: true },
    personalEmail: { type: String },
    designation: { type: String },
    location: { type: String, default: 'kochi' },
    department: { type: String },
    uid: { type: String, required: false, unique: true },
    created: { type: Date, default: Date.now },
    active: { type: Boolean, default: false },
    online: { type: Boolean, default: false },
    logedDate: { type: Date, default: Date.now },
    rebar: { type: Boolean, default: false },
    publicDetails: { type: Object, default: {} },
    privateDetails: { type: Object, default: {} },
    working: { type: Boolean, default: false },
    joining: { type: Date, default: Date.now },
    pwd: { type: String, default: "initial" },
    gender: { type: String, default: "" },
    icon: { type: Boolean, default: false },
    socket: { type: String, default: null },
    timer: { type: Boolean, default: false },
    lastTimerAt: { type: Date, required: false },
    lastLogedOut: { type: Date, required: false },
    loginTime: { type: Number, default: 0 },
    logedIn: { type: Boolean, default: false },
    taskTime: { type: Number, default: 0 },
    tokenLogin: { type: Boolean, default: false },
    loginToken: { type: String, default: "" },
    todayLoged: { type: Number, default: 0 },
    activationId: { type: String, default: uuidv4 },
    resigned: { type: Boolean, default: false },
    resignationMessage: { type: String, required: false },
    onBench: { type: Boolean, required: false, default: false },
    onBoarded: { type: Boolean, default: false },
    code: { type: codeSchema, default: null },
    punch: { type: punchInSchema, required: false },
    timerToken: { type: String, required: false },
    notification: { type: Boolean, default: false },
});

const timeLogs = new Schema({
    _id: { type: String, default: uuidv4 },
    employeeId: { type: String, required: true },
    loginMinutes: { type: Number, required: true },
    taskMinutes: { type: String, required: true },
    logDate: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now },
});

const employeeTODO = new Schema({
    _id: { type: String, default: uuidv4 },
    employeeId: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    priority: { type: String, default: 'Relaxed' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    status: { type: String, default: 'TD', options: ['TD', 'IP', 'CP'] },
});

const employeeBasicDetails = new Schema({
    _id: { type: String, default: uuidv4 },
    employeeId: { type: String, required: true },
    uid: { type: String, required: true, unique: true },
    city: { type: String, required: true },
    gender: { type: String, required: true },
    designation: { type: String, required: true },
    department: { type: String, required: true },
    age: { type: String, required: true },
    startTime: { type: String },
    endTime: { type: String },
    pan: { type: String, required: true },
    salary: { type: String, required: true },
    aadhar: { type: String, required: true },
    experience: { type: String, required: true },
    leavetypes: { type: Array, required: true }
});

const employeeActivities = new Schema({
    _id: { type: String, default: uuidv4 },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    type: { type: String, required: true },
    notificationType:{ type: String, required: true },
    employeeId: { type: String, required: true },
    employeeName: { type: String, required: true }
})

employeeSchema.pre('save', function (next) {
    if (this.taskTime > 1440) this.taskTime = 1440;
    if (this.timer === true && !this.lastTimerAt) this.lastTimerAt = new Date();
    next();
});
const employeeModel = mongoose.model('employee', employeeSchema);
const employeeLogsModel = mongoose.model('employee_logs', timeLogs);
const employeeTodoModel = mongoose.model('employeeTodo', employeeTODO);
const employeeBasicDetailsModel = mongoose.model('employeeBasicDetails', employeeBasicDetails)
const employeeActivityModel = mongoose.model('hr_activities', employeeActivities)

module.exports = { employeeModel, employeeLogsModel, employeeTodoModel, employeeBasicDetailsModel, employeeActivityModel }
