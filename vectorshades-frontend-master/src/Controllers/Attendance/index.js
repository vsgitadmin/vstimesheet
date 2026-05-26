import instance from "../../Axios/Axios.config";
import {attendance,leave, timesheet} from "../../Constants/API/Endpoints"

const getAllAttendance = async () => {
    try{
        const response = await instance.get(attendance.getAllAttendance)
        return response
    }catch(err){throw err}
}

const createAttendance = async (data) => {
    try{
        const response = await instance.post(attendance.createAttendance, data)
        return response
    }catch(err){throw err}
}

const updateAttendance = async (data) => {
    try{
        const response = await instance.patch(`${attendance.updateAttendance}`,data)
        return response
    }catch(err){throw err}
}

const getSingleAttendance = async () => {
    try{
        const response = await instance.get(attendance.getSingleAttandence)
        return response
    }catch(err){throw err}
}

const createLeave = async(body) => {
    try{
        const response = await instance.post(leave.createLeave,body)
        return response
    }catch(err){throw err}
}

const validateLeave = async (query) =>{
    try{
        const response = await instance.get(timesheet.validateLeave,{params:query})
        return response
    }catch(err) {throw err}
}

export { getAllAttendance, createAttendance, updateAttendance, getSingleAttendance ,createLeave,validateLeave}