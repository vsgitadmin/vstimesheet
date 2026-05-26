const { createConstant,getConstant,updateConstant,deleteConstant,getAllConstant} = require("../ControllerFunction/Constants")
const {response:{ConstantResponse}} = require('../../Classes/index')

const createConstantController = async (req,res)=>{
    const response = await createConstant(req.body)
    .then((response)=>new ConstantResponse("Constant Created Successfully",{details:response},false))
    .catch((err)=>new ConstantResponse("Constant Creation Failed",null,true))
    res.status(response.failed?400:200).json(response)
}

const getConstantsController = async (req,res)=>{
    const response = await getConstant(req.query.name)
    .then((response)=>new ConstantResponse("Constant Details Fetched Successfully",{details:response},false))
    .catch((err)=>new ConstantResponse("Constant Details Fetch Failed",null,true))
    res.status(response.failed?400:200).json(response)
}

const updateConstantsController = async (req,res)=>{
    const response = await updateConstant(req.query.name,req.body)
    .then((response)=>new ConstantResponse("Constant Details Updated Successfully",{details:response},false))
    .catch((err)=>new ConstantResponse("Constant Update Failed",null,true))
    res.status(response.failed?400:200).json(response)
}

const deleteConstantsController = async (req,res)=>{
    const response = await deleteConstant(req.query.name)
    .then((response)=>new ConstantResponse("Constant Deleted Successfully",null,false))
    .catch((err)=>new ConstantResponse("Constant Deletion Failed",null,true))
    res.status(response.failed?400:200).json(response)
}

const getAllConstantsController = async (req,res)=>{
    const response = await getAllConstant()
    .then((response)=>new ConstantResponse("Constants Fetched Successfully",{data:response},false))
    .catch((err)=>new ConstantResponse("Constant Fetch Failed",null,true))
    res.status(response.failed?400:200).json(response)
}

module.exports={createConstantController,getConstantsController,updateConstantsController,deleteConstantsController,getAllConstantsController}