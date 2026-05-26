const mongoose = require("mongoose")
const Schema = mongoose.Schema;
const { v4: uuidv4 } = require('uuid');

const noticeSchema = new Schema({
    _id: { type: String, default: uuidv4 },
    empId: { type: String, required: true,unique:false },
    empName: { type: String, required: true},
    createdAt: { type: Date, default: Date.now },
    title:{type: String, required: true},
    body: { type: String, required: true },
    createdBy: { type: String, required: true },
    createdByObj: { type: Object, required: true },
})

const noticeModel = mongoose.model('notices_management', noticeSchema);

module.exports = { noticeModel }