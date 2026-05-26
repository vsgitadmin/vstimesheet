const { config: { configModel } } = require("../../../Models/Extractor/index")

const readConfigFunction = async () => {
    try {
        return await configModel.find({})
    } catch (e) {
        throw e
    }
}

const updateConfigFunction = async ({ type, value }) => {
    try {
        if (!type || !value) throw new Error('Invalid body')
        let config = (await configModel.findOne({ type }))
        if (!config) throw new Error("Invalid type")
        if (config.multiConfig) config.configObjects.push(value)
        else config.value = value
        config.updatedAt = new Date()
        return await config.save()
    } catch (e) {
        throw e
    }
}

const deleteConfigFunction = async ({ type }) => {
    try {
        return await configModel.findOneAndDelete({ type })
    } catch (e) {
        throw e
    }
}

const createConfigFunction = async (body) => {
    try {
        return await new configModel(body).save()
    } catch (e) {
        throw e
    }
}

module.exports = { readConfigFunction, updateConfigFunction, deleteConfigFunction, createConfigFunction }