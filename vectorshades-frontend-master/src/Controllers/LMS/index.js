import instance from "../../Axios/Axios.config";
import { lms } from "../../Constants/API/Endpoints"

const getAllTraining = async (query) => {
    try {
        return await instance.get(lms.getAll, { params: query })
    } catch (error) {
        throw error
    }
}

const createLms = async (body) => {
    try {
        return await instance.post(lms.createTraining, body)
    } catch (error) {
        throw error
    }
}

const getHrCount = async () => {
    try {
        return await instance.get(lms.getHrCount)
    }catch (e) {
        throw e
    }
}

const markAsComplete = async (query) => {
    try {
        return await instance.patch(lms.markAsComplete + `?id=${query.id}`)
    } catch (error) {
        throw error
    }
}

const deleteTraining = async (id) => {
    try {
        return await instance.delete(lms.delete ,{params:{id}})
    } catch (error) {
        throw error
    }
}

const markAsActive = async (query) => {
    try {
        return await instance.patch(lms.markAsActive + `?id=${query.id}&status=${query.status}`)
    } catch (error) {
        throw error
    }
}

const searchTraining = async (query) => {
    try {
        return await instance.get(lms.search + `?query=${query.query}`)
    } catch (error) {
        throw error
    }
}

export { getAllTraining, createLms, markAsComplete, markAsActive, searchTraining, getHrCount , deleteTraining }