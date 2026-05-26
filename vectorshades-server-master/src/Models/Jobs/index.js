const mongoose = require("mongoose")
const { v4: uuidv4 } = require('uuid');
const Schema = mongoose.Schema;
const { general: { decodeFormula } } = require("../../Helpers/Extractor/index");
const { db: { createJobActivity } } = require("../../Helpers/Extractor/index");
const jobActivityComparisonFunction = require("../../Helpers/Functions/General/comparison");

const jobsSchema = new Schema({
    _id: { type: String, default: uuidv4 },
    lastUpdated: { type: Date, default: Date.now },
    project: { type: String, required: true },
    jobNo: { type: Number, required: false, default: 0 },
    location: { type: String, required: false, default: '' },
    client: { type: String, required: true },
    projectId: { type: String, required: false },
    poNumber: { type: String, required: false },
    software: { type: String, required: false },
    total_breakpoints: { type: Object, required: false },
    sub_items: { type: Array, required: false },
    awarded: { type: Boolean, required: false, default: false },
    pending: { type: Boolean, required: false, default: false },
    awardedId: { type: String, required: false },
    estimate: { type: Date, required: false },
    date: { type: Date, required: false },
    assignedSales: { type: String, required: false },
    assignedSalesBYName: { type: String, required: false },
    assignedSecondarySales: { type: String, required: false },
    assignedSecondarySalesBYName: { type: String, required: false },
    assignedThirdSales: { type: String, required: false },
    assignedThirdSalesBYName: { type: String, required: false },
    assignedConnectionEngineer: { type: String, required: false },
    assignedConnectionEngineerBYName: { type: String, required: false },
    engineering_fee: { type: Number, required: false },
    createdAt: { type: Date, default: Date.now }
});

const awardedJobsSchema = new Schema({
    _id: { type: String, default: uuidv4 },
    serialNumber: { type: Number, required: false, default: 0 },
    location: { type: String, required: true },
    tonnage: { type: Number, required: false },
    jobNumber: { type: String, required: false, default: '' },
    notes: { type: String, required: false, default: "" },
    jobId: { type: String, required: true, unique: true },
    jobData: { type: Object, required: false },
    createdAt: { type: Date, default: Date.now },
    date: { type: Date, required: false }
})

const rebarJobsSchema = new Schema({
    _id: { type: String, default: uuidv4 },
    jobId: { type: String, required: true, unique: true },
    attributes: { type: Object, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
})

const projectDashboardSchema = new Schema({
    _id: { type: String, default: uuidv4 },
    awardedProjectId: { type: String, required: true },
    awardedProjectData: { type: Object, required: true },
    jobId: { type: String, required: true, unique: true },
    po_price: { type: Number, required: false },
    co_price: { type: Number, default: 0 },
    co_ph: { type: Number, default: 75 },
    billed: { type: Number, default: 0 },
    awardDate: { type: Date, default: Date.now },
    billing_backlog: { type: Number, default: 0 },
    OFABacklog: { type: Number, default: 0 },
    OFABacklogFormula: { type: String, default: '' },
    FABBacklog: { type: Number, default: 0 },
    FABBacklogFormula: { type: String, default: '' },
    bidHours: { type: Number, required: false },
    co_hours: { type: Number, required: false },
    usedHours: { type: Number, default: 0 },
    backlogHours: { type: Number, default: 0 },
    toBeReviewedByAccounts: { type: Boolean, default: false },
    completedStatus: { type: Boolean, default: false },
    finalBalance: { type: Number, default: 0 },
    created: { type: Date, default: Date.now }
})

const jobActivitySchema = new Schema({
    _id: { type: String, default: uuidv4 },
    jobId: { type: String, required: true },
    activity: { type: Object },
    createdAt: { type: Date, default: Date.now }
})

jobsSchema.pre('findOneAndUpdate', async function (next) {
    const data = this.getUpdate().$set;
    data['lastUpdated'] = new Date()
    const jobData = await jobModel.findById(data._id)
    Object.keys(data).forEach((key) => jobData[key] = data[key])
    if (Object.keys(data).length > 5) {
        const jobActivities = await jobActivityComparisonFunction(data, jobModel)
        const activity = await createJobActivity(jobActivitiesModel, { activity: jobActivities, jobId: data._id })
    } else {
        const obj = { direct: { project: 'Job Successfully awarded' }, total: null, added: null, removed: null, updated: null }
        await createJobActivity(jobActivitiesModel, { activity: obj, jobId: data._id })
    }

    const dashboardData = await ProjectDashboardModel.findOne({ jobId: data._id });
    if (dashboardData) {
        await awardedJobsModel.findOneAndUpdate({ jobId: data._id }, { $set: { jobData: jobData } });
        dashboardData.awardedProjectData['jobData'] = jobData
        await ProjectDashboardModel.findOneAndUpdate({ jobId: data._id }, { $set: dashboardData })
    }
    next()
});

jobsSchema.pre('save', async function (next) {
    if (!this.jobNo) {
        try {
            const jobCount = await jobModel.countDocuments();
            this.jobNo = jobCount + 1;
        } catch (error) {
            return next(error);
        }
    }
    next();
});


jobsSchema.pre('deleteOne', async function (next) {
    const dataID = this._conditions._id
    const jobData = await jobModel.findOne({ _id: dataID })
    if (jobData.awarded === true) {
        const { projectModel, taskModel } = require('../Projects/index')
        const project = await projectModel.findOne({ job: dataID }).select('_id')
        await Promise.all([
            awardedJobsModel.deleteOne({ jobId: dataID }),
            ProjectDashboardModel.deleteOne({ jobId: dataID }),
            projectModel.deleteOne({ job: dataID }),
            taskModel.deleteMany({ projectId: project._id })
        ])
    }
    next()
})

awardedJobsSchema.pre('save', async function (next) {
    const data = this
    // next()
})

jobsSchema.pre('save', function (next) {
    const data = this
    if (data?.sub_items.length == 0) data['pending'] = true
    next()
})

projectDashboardSchema.pre('save', async function (next) {
    const data = this
    data.usedHours = 0;
    data.co_hours = 0;
    data.billed = 0;
    data.backlogHours = data.bidHours - data.usedHours
    data.billing_backlog = (data.po_price + data.co_price) - data.billed;
    data.FABBacklog = decodeFormula(data.FABBacklogFormula, data);
    data.OFABacklog = decodeFormula(data.OFABacklogFormula, data);
})

projectDashboardSchema.pre('findOneAndUpdate', async function (next) {
    const data = this.getUpdate().$set;
    delete data._id
    data.awardedProjectId = data.awardedProjectData._id
    data.awardedProjectData = data.awardedProjectData
    data.co_price = data.co_hours * data.co_ph
    data.jobId = data.awardedProjectData.jobData._id
    data.po_price = data.awardedProjectData.jobData.total_breakpoints.bid
    data.bidHours = data.awardedProjectData.jobData.total_breakpoints.hours
    data.backlogHours = data.bidHours - data.usedHours
    data.finalBalance = (data.bidHours + data.co_hours) - (data.usedHours + data.backlogHours)
    data.billing_backlog = (data.po_price + data.co_price) - data.billed;
    data.FABBacklog = decodeFormula(data.FABBacklogFormula, data);
    data.OFABacklog = decodeFormula(data.OFABacklogFormula, data);
    data.OFABacklog = data.OFABacklog - data.billed
    if(data.OFABacklog < 0){
        data.FABBacklog = parseInt(data.FABBacklog) + data.OFABacklog
        if(data.FABBacklog < 0) data.FABBacklog = 0;
        data.OFABacklog = 0
    }
    if (data.completedStatus == false) {
        const { projectModel } = require('../Projects/index')
        await projectModel.findOneAndUpdate({ job: data.jobId }, { $set: { completed: false } })
    }
    data.awardDate = data.awardedProjectData.date
    next()
})

var jobModel = mongoose.model('jobs', jobsSchema);
var awardedJobsModel = mongoose.model('awarded_jobs', awardedJobsSchema);
var ProjectDashboardModel = mongoose.model('project_dashboard', projectDashboardSchema);
var jobActivitiesModel = mongoose.model('job_activities', jobActivitySchema)
var rebarJobsModel = mongoose.model('rebar_jobs', rebarJobsSchema)

module.exports = { jobModel, awardedJobsModel, ProjectDashboardModel, jobActivitiesModel, rebarJobsModel }