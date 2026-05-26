const express = require("express");
const { createConstantController,getConstantsController,updateConstantsController,deleteConstantsController,getAllConstantsController} = require("../../Controllers/Controller/constants.controller");
const constantRoute = express.Router();

constantRoute.post('/create',createConstantController)
constantRoute.get('/get',getConstantsController)
constantRoute.patch('/update',updateConstantsController)
constantRoute.delete('/delete',deleteConstantsController)
constantRoute.get('/get/all',getAllConstantsController)

module.exports=constantRoute