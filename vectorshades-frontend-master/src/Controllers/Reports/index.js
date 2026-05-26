import instance from "../../Axios/Axios.config";
import {reports} from "../../Constants/API/Endpoints"

const getAllReportsController = async (query) => {
    try {
        const response = await instance.get(reports.getReports,{params:query})
        return response
    } catch (err) { throw err }
}

const getAllReportsKeysController = async (query) => {
    try {
        const response = await instance.get(reports.keys)
        return response
    } catch (err) { throw err }
}

const viewFileController = async (location) => {
    try {
        const response = await instance.get(reports.viewFile,{params:{location}})
        return response
    } catch (err) { throw err }
}


const createReportsController = async (body) => {
    try {
        const response = await instance.post(reports.createReports, body)
        return response
    } catch (err) { throw err }
}

const deleteReportsController = async (query) => {
    try {
        const response = await instance.delete(reports.deleteReports, { params: query })
        return response
    } catch (err) { throw err }
}

const refreshReportsController = async (query) => {
    try {
        const response = await instance.patch(reports.refreshReports, {}, { params: query })
        return response
    } catch (err) { throw err }
}

const getTotalNumberOfReports = async () =>{
    try {
        return await instance.get(reports.getTotalNumberOfReports)
    } catch (err) { throw err }
}

const generateCsvReportController = async (body) => {
    try {
        return await instance.post(reports.generateCsv,body)
    }catch (e) {
        throw e
    }
}

const getCsvReportsController = async ()=>{
    try {
        return await  instance.get(reports.getCsvReports)
    }catch (e) {
        throw e
    }
}

const generateWorkHoursController = async (body) => {
    try {
        return await instance.post(reports.generateWorkHours, body)
    } catch (e) {
        throw e
    }
}

export { getAllReportsController, deleteReportsController,viewFileController, refreshReportsController, createReportsController, getAllReportsKeysController , getTotalNumberOfReports, generateCsvReportController,getCsvReportsController, generateWorkHoursController }