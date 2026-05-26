const mongoose = require("mongoose")
const Schema = mongoose.Schema;
const { v4: uuidv4 } = require('uuid');

const submissionsSchema = new Schema({
    _id:{type:String,default:uuidv4},
    location:{type:String,required:true},
    client:{type:String,required:true},
    jobNo:{type:String,required:true},
    jobId:{type:String,default:""},
    projectNo:{type:String,required:true},
    Project:{type:String,default:""},
    description:{type:String,default:""},
    aging:{type:Number,default:0},
    transmittalDate:{type:Date,default:Date.now},
    projectedBilling:{type:Number,default:0},
    cd:{type:Number,default:0},
    billed:{type:Number,default:0},
    invoiceNo:{type:Number,default:0},
    remarks:{type:String,required:false},
    rebar:{type:Boolean,default:false}
})

const submissionsModel = mongoose.model('submissions',submissionsSchema)

module.exports = {submissionsModel}