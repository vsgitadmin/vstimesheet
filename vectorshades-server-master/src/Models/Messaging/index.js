const mongoose = require("mongoose")
const { v4: uuidv4 } = require('uuid');
const Schema = mongoose.Schema;

const chatListSchema = new Schema({
    _id: { type: String, default: uuidv4 },
    employeeId: { type: String, required: true },
    employeeName: { type: String, required: true },
    unReadMessages: { type: Array, default: [] },
    communications: { type: Array, default: [] },
    updatedAt: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now }
})

const messagesSchema = new Schema({
    _id: { type: String, default: uuidv4 },
    employeeId: { type: String, required: true },
    updatedAt: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now },
    reciver: { type: String, required: true },
    group: { type: Boolean, required: true },
    type: { type: String, required: true },
    message: { type: String, required: true },
    reciverName : {type:String,required:true},
    senderName : {type:String,required:true},
})

const groupSchema = new Schema({
    _id: { type: String, default: uuidv4 },
    updatedAt: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now },
    groupName: { type: String, required: true },
    groupDescription: {type:String,required:false},
    groupAdmins: { type: Array, default: [] },
    createdBy: { type: Object, required: true },
    groupMembers: { type: Array, default: [] },
    imgUrl : {type:String,required:false}
})

const chatFilesSchema = new Schema({
    _id: { type: String, default: uuidv4 },
    updatedAt: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now },
    group: { type: Boolean, required: true },
    stationId:{type:String,required:true},
    fileAttributes:{type:Object,required:true},
    fileUrl:{type:String,require:true},
    fileName:{type:String,required:true},
    employeeId: { type: String, required: true },
    public : {type:Boolean,default:false}
})


groupSchema.pre('save', function (next) {
    const data = this
    data.groupAdmins = [{...data.createdBy}]
    next()
})

const chatListModel = mongoose.model('chatlists', chatListSchema)
const messagesModel = mongoose.model('messages', messagesSchema)
const groupModel = mongoose.model('groups', groupSchema)
const chatFilesModel = mongoose.model('chatfiles',chatFilesSchema)

module.exports = { chatListModel, messagesModel, groupModel,chatFilesModel}