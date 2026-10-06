import instance from "../../Axios/Axios.config";

const getPunchingInfoListController = async (query) => {
    try {
        const response = await instance.get('/punching-info/list', { params: query })
        return response
    } catch (err) { throw err }
}

const createPunchingInfoController = async (body) => {
    try {
        const response = await instance.post('/punching-info/create', body)
        return response
    } catch (err) { throw err }
}

const getPunchingInfoByIdController = async (id) => {
    try {
        const response = await instance.get(`/punching-info/${id}`)
        return response
    } catch (err) { throw err }
}

const updatePunchingInfoController = async (id, body) => {
    try {
        const response = await instance.patch(`/punching-info/update/${id}`, body)
        return response
    } catch (err) { throw err }
}

export {
    getPunchingInfoListController,
    createPunchingInfoController,
    getPunchingInfoByIdController,
    updatePunchingInfoController,
}
