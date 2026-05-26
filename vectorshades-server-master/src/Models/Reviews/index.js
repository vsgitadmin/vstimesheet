const mongoose = require("mongoose")
const Schema = mongoose.Schema;
const { v4: uuidv4 } = require('uuid');


const employeeAnalyticsSchema = new Schema({
    _id: { type: String, default: uuidv4 },
    year:{ type: String, required: true },
    employeeId: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    punctuality: { type: Number, default:0 },
    efficiency: { type: Number, default:0 },
    communication: { type: Number, default:0 },
    performance: { type: Number, default:0 },
    skills: { type: Number, default:0 },
    overallScore : {type:Number,default:0},
    totalHoursAssigned : {type:Number,default:0},
    totalHoursWorked : {type:Number,default:0},
    totalTasks : {type:Number,default:0},
    totalTasksCompleted : {type:Number,default:0},
    leaveAnalytics : {type:[Object],default:[]}
})

const employeeReviewsSchema = new Schema({
    _id: { type: String, default: uuidv4 },
    employeeId: { type: String, required: true },
    requestId : {type:String,required:true},
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    starRating:{type:Number},
    reviewTitle:{type:String,required:true},
    reviewText:{type:String},
    punctuality: { type: Number, default:0 },
    efficiency: { type: Number, default:0 },
    communication: { type: Number, default:0 },
    performance: { type: Number, default:0 },
    skills: { type: Number, default:0 },
    reviewBy:{type:String,required:true},
    ratingObj:{type:Object,required:true}
})

const reviewRequestsSchema = new Schema({
    _id: { type: String, default: uuidv4 },
    requestedBy: { type: String, required: true },
    requestedByName:{type:String,required:true},
    requestedToName:{type:String,required:true},
    requestedFrom:{type:String,required:true},
    requestedFromName:{type:String,required:true},
    requestedTo: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    expired: { type: Boolean, default: false },
    reviewSubmitted: {type:Boolean,default:false}
})

const employeeAnalyticsModel = mongoose.model('analytics',employeeAnalyticsSchema)
const employeeReviewsModel = mongoose.model('reviews',employeeReviewsSchema)
const reviewRequestsModel = mongoose.model('review_requests',reviewRequestsSchema)

module.exports = { employeeAnalyticsModel,employeeReviewsModel,reviewRequestsModel }