const mongoose = require("mongoose")
const Schema = mongoose.Schema;
const { v4: uuidv4 } = require('uuid');

const cloudFileSchema = new Schema({
    _id: { type: String, default: uuidv4 },
    employeeId: { type: String, required: true },
    fileName: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    location: { type: String, required: true },
    attributes: { type: Object, required: true },
    forwarded: { type: Boolean, default: false },
    forwardedAttributes: { type: Object, default: {} },
    public: { type: Boolean, default: false },
    lms: { type: Boolean, default: false },
    bulk: { type: Boolean, default: false },
    batch: { type: String, default: null }
})

const projectCloudSchema = new Schema({
    _id: { type: String, default: uuidv4 },
    employeeId: { type: String, required: true },
    fileName: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    location: { type: String, required: true },
    attributes: { type: Object, required: true },
    section: { type: String, required: false },
    projectId: { type: String, required: true },
    pinned: { type: Boolean, default: false },
    batchId: { type: String, default: null }
})

const companyDocumentsSchema = new Schema({
    _id: { type: String, default: uuidv4 },
    fileName: { type: String, required: true },
    employeeId: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    location: { type: String, required: true },
    attributes: { type: Object, required: true },
    public: { type: Boolean, required: true }
})

const BulkBatchSchema = new Schema({
    _id: { type: String, default: uuidv4 },
    title: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, required: true },
    batchId: { type: String, required: true },
    fileCount: { type: Number, default: 0 },
    fileSize: { type: Number, default: 0 },
    files: { type: [cloudFileSchema], default: [] }
})

const cloudFilesModel = mongoose.model('cloudFiles', cloudFileSchema);
const projectCloudModel = mongoose.model('projectCloudFiles', projectCloudSchema)
const companyDocumentsModel = mongoose.model('companydocuments', companyDocumentsSchema)
const bulkBatchModel = mongoose.model('bulkbatch', BulkBatchSchema)

module.exports = { cloudFilesModel, projectCloudModel, companyDocumentsModel, bulkBatchModel }
