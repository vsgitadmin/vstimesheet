const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { v4: uuidv4 } = require('uuid');
const { employeeModel } = require('../Employee');

const attendenceSchema = new Schema({
    _id:{type:String,default:uuidv4},
    working:{type:Boolean,default:true},
    hours:{type:Number,default:0},
    loginHours:{type:Number,default:0},
    projectId:{type:String,required:true},
    date:{type:Date,default:Date.now},
    employeeId:{type:String,required:true}
})

const absenteesSchema = new Schema({
    _id:{type:String,default:uuidv4},
    date:{type:Date,default:Date.now},
    canceledByEmployee:{type:Boolean,default:false},
    forwardedTo:{type:String,required:false},
    message:{type:String,required:false},
    type:{type:String,required:true},
    duration:{type:Number,required:true},
    partOfDay:{type:String,required:false},
    name:{type:String,required:false},
    note:{type:String},
    approved:{type:Boolean,default:false},
    startDate:{type:Date,required:true},
    endDate:{type:Date,required:true},
    employeeId:{type:String,required:true},
    createdAt:{type:Date,default:Date.now},
    rejected:{type:Boolean,default:false},
    rejectionReason:{type:String}
})

const timeSheetSchema = new Schema({
    _id:{type:String,default:uuidv4},
    empId:{type:String,required:true},
    month:{type:String},
    year:{type:String},
    timeSheet:{type:Array,default:[]}
})

const activitySchema = new Schema({
    _id:{type:String,default:uuidv4},
    employeeId:{type:String,required:true},
    date:{type:String,required:true}, 
    logs:{type:Array,default:[]},
    logedDate:{type:Date,default:Date.now},
})

activitySchema.path('logedDate').get(dt => {
    return dt
      ? new Date(dt).toLocaleString('en-GB', { timeZone: 'Asia/Kolkata' })
      : dt;
  });

attendenceSchema.post('save',async(doc,next)=>{
    var AllMonths = ["january", "jebruary", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
    const month= new Date().getMonth()
    const year= new Date().getFullYear()
    const timesheet = await timeSheetModel.findOne({empId:doc.employeeId,month:AllMonths[month]})
    if(!timesheet){
        new timeSheetModel({empId:doc.employeeId,month:AllMonths[month].toLowerCase(),year:year,timeSheet:[{type:'AT',id:doc._id,date:doc.date}]}).save()
    }else await timesheet.update({$push:{timeSheet:{type:'AT',id:doc._id,date:doc.date}}})
   
   next()
})

absenteesSchema.post('save',async(doc,next)=>{
    var AllMonths = ["january", "jebruary", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
    const month= new Date().getMonth()
    const year= new Date().getFullYear()
    const timesheet = await timeSheetModel.findOne({empId:doc.employeeId,month:AllMonths[month]})
    const startDate = parseInt(doc.startDate.toString().split(' ')[2])
    const EndDate = parseInt(doc.endDate.toString().split(' ')[2])
    const LeaveRegression = []
    for (var i = startDate; i <= EndDate; i++) {
        LeaveRegression.push(i);
    }
    const LeaveMap = LeaveRegression.map((date) => {
        const currentDate = new Date()
        currentDate.setDate(date)
        return {type:'LV',id:doc._id,date:currentDate,approved:doc.approved}
    })
    if(!timesheet){
        new timeSheetModel({empId:doc.employeeId,month:AllMonths[month].toLowerCase(),year:year,timeSheet:LeaveMap}).save()
        next()
    }else{
        await timeSheetModel.updateOne({_id:timesheet._id},{$set:{timeSheet:[...timesheet.timeSheet,...LeaveMap]}})
    }
   next()
})

absenteesSchema.post('findOneAndDelete',async(doc,next)=>{
    var AllMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul","Aug", "Sep", "Oct", "Nov", "Dec"];
    const month= new Date().getMonth()
    await timeSheetModel.updateOne({empId:doc.employeeId,month:AllMonths[month]},{$pull:{timeSheet:{type:"LV",id:doc._id}}})
    next()
})

const attendenceModel = mongoose.model('attendence',attendenceSchema);
const absenteesModel = mongoose.model('absentees',absenteesSchema)
const timeSheetModel = mongoose.model('timesheet',timeSheetSchema)
const timeSheetActivityModel = mongoose.model('timesheet_activity',activitySchema)

module.exports={attendenceModel,absenteesModel,timeSheetModel,timeSheetActivityModel};