const { cloud: { cloudFilesModel } } = require("../../../Models/Extractor/index");
const { createNotification } = require("../Communication");
const { bulkBatchModel } = require("../../../Models/Cloud");
const { employeeModel } = require("../../../Models/Employee");

const createCloudFunction = async (body) => {
    try {
        const cloud = await new cloudFilesModel(body).save()
        return cloud
    } catch (err) {
        throw err;
    }
}

const getCloudFunction = async (query, headerId) => {
    try {
        let page = query.page >= 1 ? query.page : 1;
        page = page - 1
        const limit = 10
        const cloud = await cloudFilesModel.find({ employeeId: query.id || headerId, public: false }).limit(limit).skip(limit * page).sort({ createdAt: -1 })
        return cloud
    } catch (err) {
        throw err;
    }
}

const getCloudCountFunction = async (user) => {
    try {
        return await cloudFilesModel.find({ employeeId: user }).count()
    } catch (err) {
        throw err;
    }
}

const deleteCloudFunction = async (id) => {
    try {
        const cloud = await cloudFilesModel.deleteOne({ _id: id })
        return cloud
    } catch (err) {
        throw err;
    }
}


const searchCloud = async (query, empId) => {
    try {
        const cloud = await cloudFilesModel.aggregate([
            {
                $match: { employeeId: empId, fileName: { $regex: new RegExp(query.search, "i") }, public: false }
            }
        ]).limit(20).sort({ createdAt: -1 })
        return cloud
    } catch (err) {
        throw err;
    }
}

const forwardCloud = async (query, body) => {
    try {
        const cloudObj = await cloudFilesModel.findById(query.id).lean()
        if (!cloudObj) throw { message: 'invalid cloud ID provided' }
        delete cloudObj._id
        const forwardPromise = await Promise.resolve(body.forwardTo.map(async (user) => {
            const obj = Object.assign(cloudObj)
            obj.forwardedAt = new Date()
            obj.employeeId = user._id
            obj.forwarded = true
            obj.forwardedAttributes = body.forwardedAttributes
            await new cloudFilesModel(obj).save()
            await createNotification({ text: `New File Forwarded : ${obj.fileName}`, reciever: user._id, link: `/admin/dashboard/cloud` })
        }))
        return forwardPromise
    } catch (err) {
        throw err;
    }
}

const getAllPublicCloud = async () => {
    try {
        const cloud = await cloudFilesModel.find({ public: true }).sort({ createdAt: -1 })
        return cloud
    } catch (err) {
        throw err;
    }
}

const createBulkBatchFunction = async (body) => {
    try {
        if (body.uploadType === 'batch') {
            const queryFilter = {
                working: true
            };

            const batch = body.batchId
            if (batch && typeof batch === 'string') {
                const parts = batch.split('-');
                const department = parts[0];
                const designation = parts.slice(1).join('-');

                if (department) {
                    queryFilter.department = department;
                }

                if (designation) {
                    queryFilter.designation = designation;
                }
            }
            const employees = await employeeModel.find(queryFilter).select('_id firstName lastName uid')
            files = employees.map(async (emp) => {
                body.files.map(async (file) => {
                    await forwardCloud({ id: file._id }, {
                        forwardTo: [emp], forwardedAttributes: {
                            employeeId: '',
                            employeeName: 'Vectorshades HR Automation'
                        }
                    })
                })

            })
            await Promise.resolve(files)
            const response = await new bulkBatchModel(body).save()
            return response
        }
        else if (body.uploadType === 'intelligent') {
            files = body.files.map(async (file) => {
                const uid = file.fileName.split('-')[0]
                const employee = await employeeModel.findOne({ uid }).select('_id firstName lastName uid')
                await forwardCloud({ id: file._id }, {
                    forwardTo: [employee], forwardedAttributes: {
                        employeeId: '',
                        employeeName: 'Vectorshades HR Automation'
                    }
                })
            })
            await Promise.resolve(files)
            const response = await new bulkBatchModel(body).save()
            return response
        }
        else {
            throw new Error('no upload type specifid')
        }
    } catch (e) {
        throw e
    }
}

const updateBulkFileFunction = async (body) => {
    try {
        if (body.batchId == null || body.file == null) throw new Error("Invalid request")
        let batch = await bulkBatchModel.findOne({ batchId: body.batchId })
        if (batch == null) throw new Error("Invalid id")
        batch.files.push(body.file)
        batch.fileCount = batch.files.length
        batch.fileSize = batch.fileSize + body.file.size
        return await batch.save()
    } catch (e) {
        throw e
    }
}

const getAllBulkBatchesFunction = async () => {
    try {
        return await bulkBatchModel.find({})
    } catch (e) {
        throw e
    }
}

module.exports = { createCloudFunction, deleteCloudFunction, getCloudFunction, getCloudCountFunction, searchCloud, forwardCloud, getAllPublicCloud, createBulkBatchFunction, updateBulkFileFunction, getAllBulkBatchesFunction }