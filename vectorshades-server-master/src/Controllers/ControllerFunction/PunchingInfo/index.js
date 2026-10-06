const { punchingInfoModel } = require("../../../Models/PunchingInfo/index")

const createPunchingInfo = async (data) => {
    const record = await punchingInfoModel.create(data)
    return record
}

const getPunchingInfoList = async ({ uid, from, to } = {}) => {
    const filter = {}
    if (uid) filter.uid = uid
    if (from || to) {
        filter.date = {}
        if (from) filter.date.$gte = new Date(from)
        if (to) filter.date.$lte = new Date(to)
    }
    return await punchingInfoModel.find(filter).sort({ date: -1 })
}

const getPunchingInfoById = async (id) => {
    return await punchingInfoModel.findById(id)
}

const updatePunchingInfo = async (id, data) => {
    data.updatedAt = new Date()
    return await punchingInfoModel.findByIdAndUpdate(id, data, { new: true })
}

module.exports = { createPunchingInfo, getPunchingInfoList, getPunchingInfoById, updatePunchingInfo }
