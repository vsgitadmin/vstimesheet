const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { v4: uuidv4 } = require('uuid');

const constantsSchema = new Schema({
    _id:{type:String,default:uuidv4},
    name:{type:String,required:true},
    createdDate:{type:Date,default:Date.now},
    data:{type:Object,required:true},
})

var constantModel = mongoose.model('constants',constantsSchema)

module.exports={constantModel}