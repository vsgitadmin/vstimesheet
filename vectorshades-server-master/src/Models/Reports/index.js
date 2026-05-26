const mongoose = require("mongoose")
const Schema = mongoose.Schema;
const { v4: uuidv4 } = require('uuid');

const reportSchema = new Schema({
    _id:{type:String,default:uuidv4},
    name:{type:String,required:true},
    file:{type:String,required:true},
    url:{type:String,required:true},
    type:{type:String,required:true},
    filename:{type:String,default:""},
    queryObject:{type:Object,required:true},
    createdBy:{type:String,required:true},
    lastUpdated:{type:Date,default:Date.now},
    createdAt:{type:Date,default:Date.now},
    keys:{type:Array,default:[]},
    createdBy:{type:String,required:true},
})

const createdBySchema = new Schema({
    userId:{type:String,required:true},
    name:{type:String,required:true}
})

const csvReportSchema = new Schema({
    _id:{type:String,default:uuidv4},
    fileName:{type:String,required:true},
    createdBy:{type:createdBySchema,required:true},
    url:{type:String,required:true},
    createdAt:{type:Date,default:Date.now},
    type:{type:String,required:true}
})

const fileSchema = new Schema({
    _id:{type:String,default:uuidv4},
    location:{type:String,required:true},
    fileData:{type:String,required:true},
    createdAt:{type:Date,default:Date.now},
})


const reportModel = mongoose.model('reports',reportSchema);
const fileModel = mongoose.model('files',fileSchema);
const reportsCsvModel = mongoose.model('csv_reports',csvReportSchema)

module.exports = {reportModel, reportsCsvModel , fileModel }
