import instance from "../../Axios/Axios.config";
import {cloud} from "../../Constants/API/Endpoints"

const getAllCloudObject = async (query) => {
    try {
        return await instance.get(cloud.get, {params: query})
    } catch (err) {
        throw err
    }
}

const getCloudCount = async (props) => {
    try {
        return await instance.get(cloud.getCount,{params:props})
    } catch (err) {
        throw err
    }
}

const searchCloudObject = async (query) => {
    try {
        return await instance.get(cloud.search, {params: query})
    } catch (err) {
        throw err
    }
}

const createCloudObject = async (body) => {
    try {
        return await instance.post(cloud.create, body)
    } catch (err) {
        throw err
    }
}

const deleteCloudObject = async (query) => {
    try {
        return await instance.delete(cloud.delete, {params: query})
    } catch (err) {
        throw err
    }
}

const forwardCloudObject = async (query, body) => {
    try {
        return await instance.post(cloud.forward + `?id=${query.id}`, body)
    } catch (err) {
        throw err
    }
}

const getAllPublicCloudCOntroller = async () => {
    try {
        return await instance.get(cloud.getAllPublicCLoud)
    } catch (err) {
        throw err
    }
}

const createBulkBatchController = async (body) => {
    try {
        return await instance.post(cloud.createBulkBatch, body)
    } catch (err) {
        throw err
    }
}

const updateBulkBatchFileController = async (body) => {
    try {
        return await instance.post(cloud.updateBulkBatchFile, body)
    } catch (err) {
        throw err
    }
}

export {
    getAllCloudObject,
    createCloudObject,
    deleteCloudObject,
    searchCloudObject,
    forwardCloudObject,
    getAllPublicCloudCOntroller,
    createBulkBatchController,
    updateBulkBatchFileController,
    getCloudCount
}