const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { v4: uuidv4 } = require('uuid');

const notificationSchema = new Schema({
    _id:{type:String,default:uuidv4},
    reciever:{type:String,required:true},
    type:{type:String,default:'general'},
    metaData:{type:Object,default:{}},
    text:{type:String,required:true},
    createdAt:{type:Date,default:Date.now},
    link:{type:String,required:true,default:''}
})

var notificationModel = mongoose.model('notifications',notificationSchema)

module.exports={notificationModel}