import instance from "../../Axios/Axios.config";
import { notice } from "../../Constants/API/Endpoints"

const getNoticeBYHRController = async (query) => {
    try {
        const response = await instance.get(notice.getNoticeBYHR, { params: query })
        return response
    } catch (err) { throw err }
}

const getNoticeBYEMPController = async (query) => {
    try {
        const response = await instance.get(notice.getNoticeBYEMP, { params: query })
        return response
    } catch (err) { throw err }
}

const createNoticeController = async (body) => {
    try {
        const response = await instance.post(notice.createNotice, body)
        return response
    } catch (err) { throw err }
}

const deleteNoticeController = async (query) => {
    try {
        const response = await instance.delete(notice.deleteNotice, { params: query })
        return response
    } catch (err) { throw err }
}

const getTotalNumberOfNoticesByEmp = async ()=>{
    try {
        const response = await instance.get(notice.getTotalNumberbyEmp)
        return response
    } catch (err) { throw err }
}

const getTotalNumberOfNoticesByHr = async ()=>{
    try {
        const response = await instance.get(notice.getTotalNumberByHr)
        return response
    } catch (err) { throw err }
}

module.exports = {
    getNoticeBYHRController,
    deleteNoticeController,
    createNoticeController,
    getNoticeBYEMPController,
    getTotalNumberOfNoticesByEmp,
    getTotalNumberOfNoticesByHr
}