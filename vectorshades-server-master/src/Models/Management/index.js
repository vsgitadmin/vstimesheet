const mongoose = require("mongoose")
const Schema = mongoose.Schema;
const { v4: uuidv4 } = require('uuid');

const employeeActivationRequestSchema = new Schema({
    _id:{type:String,default:uuidv4},
    empId:{type:String,required:true,unique:true},
    empName:{type:String,required:true},
    designation:{type:String,required:true},
    department:{type:String,required:true},
    updatedDetails:{type:Object,required:true},
    approved:{type:Boolean,default:false},
    requestedDate:{type:Date,default:Date.now}
})

const employeeActivationRequest = mongoose.model('employee activation request',employeeActivationRequestSchema);

module.exports = {employeeActivationRequest}