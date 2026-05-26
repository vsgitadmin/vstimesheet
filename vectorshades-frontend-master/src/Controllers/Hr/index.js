import instance from "../../Axios/Axios.config";
import {activationreq,employee,timesheet} from "../../Constants/API/Endpoints"

const getAllActivationReq = async (page) => {
    try{
        page = page || 1
        const response = await instance.get(`${activationreq.getallrequest}?page=${page}`)
        return response
    }
    catch(err){throw err}
}

const ActivationReqController = async (data) => {
    try{
        const response = await instance.post(activationreq.postRequest,data)
        return response
    }catch(err){throw err}
}

const getSingleActivationReqController = async (query) => {
    try{
        const response = await instance.get(activationreq.getSingleRequest,{params:query})
        return response
    }catch(err){throw err}
}

const UpdateSingleActivationReqController = async (id,data) => {
    try{
        const response = await instance.patch(`${activationreq.updateSingleActivationRequest}?id=${id}`,data)
        return response
    }catch(err){throw err}
}

const getTotalNumberOfActivationRequestController = async ()=>{
    try{
        const response = await instance.get(`${activationreq.getTotalNumber}`)
        return response
    }catch(err){throw err}
}

const filterActivationReqController = async (data) => {
    try{
        const response = await instance.get(`${activationreq.filterActivation}?name=${data}`)
        return response
    }catch(err){throw err}
}

const approveActivationReqController = async (id) => {
    try{
        const response = await instance.patch(`${activationreq.approveActivationRequest}?id=${id}`)
        return response
    }catch(err){throw err}
}

const forwardReqController = async (body) => {
    try{
        const response = await instance.patch(timesheet.forwardLeave,body)
        return response
    }catch(err){throw err}
}

const getHrActivities = async (query) =>{
    try{
        const response = await instance.get(employee.getEmployeeActivities,{params:query})
        return response
    }catch(err){throw err}
}

const getAllForwardedLeaves = async (query) =>{
    try{
        const response = await instance.get(timesheet.getAllForwardedLeaves,{params:query})
        return response
    }catch(err){throw err}
}

const createEmployeeActivity = async (body)=>{
    try{
        const response = await instance.post(employee.createEmployeeActivity,body)
        return response
    }catch(err){throw err}
}

module.exports = {createEmployeeActivity,getAllActivationReq,ActivationReqController,getSingleActivationReqController,UpdateSingleActivationReqController,getTotalNumberOfActivationRequestController,filterActivationReqController,approveActivationReqController,forwardReqController,getHrActivities,getAllForwardedLeaves}