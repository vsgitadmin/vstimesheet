const { constantModel } = require("../../../Models/Constants")

const createConstant = async (body) => {
    try {
        const document = await new constantModel(body).save()
        return document
    } catch (err) { throw err }
}

const getConstant = async(name)=>{
    try {
        const document = await  constantModel.findOne({name:name})
        return document
    } catch (err) { throw err }
}

const updateConstant = async (name,body)=>{
    try {
        const document = await  constantModel.findOneAndUpdate({name:name},{$set:body},{new:true})
        return document
    } catch (err) { throw err }
}

const deleteConstant = async (name)=>{
    try {
        const document = await  constantModel.findOneAndDelete({name:name})
        return document
    } catch (err) { throw err }
}

const getAllConstant = async ()=>{
    try {
        const document = await  constantModel.find()
        return document
    } catch (err) { throw err }
}


module.exports = { createConstant,getConstant,updateConstant,deleteConstant,getAllConstant}