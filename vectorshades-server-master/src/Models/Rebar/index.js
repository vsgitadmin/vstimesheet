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
    client: { type: String, required: true },
    projectId: { type: String, required: false },
    rebarType: { type: String, required: true },
    total_breakpoints: { type: Object, required: false },
    sub_items: { type: Array, required: false },
    awarded: { type: Boolean, required: false, default: false },
    pending: { type: Boolean, required: false, default: false },
    awardedId: { type: String, required: false },
    software: { type: String, required: false },
    perTon: { type: Number, default: 0 },
    perHour: { type: Number, default: 0 },
    onHold:{ type: Boolean, default: false },
    estimate: { type: Date, required: false },
    date: { type: Date, required: false },
    assignedSales: { type: String, required: false },
    assignedSalesBYName: { type: String, required: false },
    linked: { type: Boolean, default: false },
    linkedId: { type: String, required: false },
    engineering_fee: { type: Number, required: false },
    createdAt: { type: Date, default: Date.now }
});

const awardedJobsSchema = new Schema({
    _id: { type: String, default: uuidv4 },
    serialNumber: { type: Number, required: false, default: 0 },
    location: { type: String, required: true },
    jobNumber: { type: String, required: false, default: '' },
    notes: { type: String, required: false, default: "" },
    rebar: { type: String, required: true, default: "" },
    jobId: { type: String, required: true, unique: true },
    jobData: { type: Object, required: false },
    linked: { type: Boolean, default: false },
    linkedId: { type: String, required: false },
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
    toBeReviewedByAccounts: { type: Boolean, default: false },
    completedStatus: { type: Boolean, default: false },
    onHold:{ type: Boolean, default: false },
    workInProgress:{ type: Boolean, default: false },
    created: { type: Date, default: Date.now },
    tons: { type: Number, default: 0 },
    tonsDetailed: { type: Number, default: 0 },
    readyToBill: { type: Number, default: 0 },
    tonsDetailedTimesheet: { type: Number, default: 0 },
    tonsBillable: { type: Number, default: 0 },
    tonsBilled: { type: Number, default: 0 },
    tonPH: { type: Number, default: 0 },
    pendingTons: { type: Number, default: 0 },
    billingPending: { type: Number, default: 0 },
    billingBacklog: { type: Number, default: 0 },
    linked: { type: Boolean, default: false },
    linkedId: { type: String, required: false },
});

const jobActivitySchema = new Schema({
    _id: { type: String, default: uuidv4 },
    jobId: { type: String, required: true },
    activity: { type: Object },
    createdAt: { type: Date, default: Date.now }
})

const changeOrderSchema = new Schema({
    _id: { type: String, default: uuidv4 },
    jobId: { type: String, required: true },
    clientName: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    estimatedCOhours: { type: Number, default: 0 },
    actualCOhours: { type: Number, default: 0 },
    perHour: { type: Number, default: 0 },
    detailer: { type: Object, required: true },
    revisionStatus: { type: Boolean, default: true },
    readyToBill: { type: Boolean, default: false },
    jobName: { type: String, required: true },
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

jobsSchema.pre('deleteOne', async function (next) {
    const dataID = this._conditions._id
    const { projectModel, taskModel } = require('../Projects/index')
    const job = await jobModel.findById(dataID).select('awarded')
    const project = await projectModel.findOne({ job: dataID }).select('_id')
    if (job.awarded) {
        await Promise.all([
            awardedJobsModel.deleteOne({ jobId: dataID }),
            ProjectDashboardModel.deleteOne({ jobId: dataID }),
            projectModel.deleteOne({ job: dataID }),
            taskModel.deleteMany({ projectId: project._id }),
            changeOrderModel.deleteMany({jobId:dataID}),
            jobModel.deleteMany({linkedId:dataID})
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
})

projectDashboardSchema.pre('findOneAndUpdate', async function (next) {
    const data = this.getUpdate().$set;
    delete data._id
    data.awardedProjectId = data.awardedProjectData._id
    data.awardedProjectData = data.awardedProjectData
    data.jobId = data.awardedProjectData.jobData.jobId
    next()
})

var jobModel = mongoose.model('rebar_jobs_main', jobsSchema);
var awardedJobsModel = mongoose.model('awarded_rebar_jobs', awardedJobsSchema);
var ProjectDashboardModel = mongoose.model('rebar_project_dashboard', projectDashboardSchema);
var jobActivitiesModel = mongoose.model('rebar_job_activities', jobActivitySchema)
var rebarJobsModel = mongoose.model('rebar_jobs_del', rebarJobsSchema)
var changeOrderModel = mongoose.model('rebar_change_orders', changeOrderSchema)

module.exports = { jobModel, awardedJobsModel, ProjectDashboardModel, jobActivitiesModel, rebarJobsModel, changeOrderModel }