const { management: { noticeModel }, employee: { employeeModel } } = require('../../../Models/Extractor/index')
const { createNotification } = require('../Communication/index')

const createNotice = async (body) => {
    try {
        body.createdBy = body.createdByObj.id;
        let notice = await Promise.resolve(body.emps.map(async emp => {
            body.empName = emp.firstName + ' ' + emp.lastName;
            body.empId = emp._id;
            const notice = await new noticeModel(body).save()
            await createNotification({ text: `New Notice recieved : ${body.title}`, reciever: emp._id, link: `/admin/dashboard/employee/notices` })
            return notice
        }));
        return notice;
    } catch (err) {
        throw err;
    }
}
const getNoticeBYEmp = async (user, pageNumber, emp) => {
    try {
        let page = pageNumber >= 1 ? pageNumber : 1;
        page = page - 1
        const limit = 4
        const notice = await noticeModel.find({ empId: emp ? emp : user }).limit(limit).skip(limit * page).sort({ createdAt: -1 })
        return notice;
    } catch (err) {
        throw err;
    }
}
const getNoticeByHR = async (pageNumber) => {
    try {
        let page = pageNumber >= 1 ? pageNumber : 1;
        page = page - 1
        const limit = 4
        const notice = await noticeModel.find().limit(limit).skip(limit * page).sort({ createdAt: -1 })
        return notice;
    } catch (err) {
        throw err;
    }
}
const deleteNotice = async (id) => {
    try {
        const notice = await noticeModel.deleteOne({ _id: id })
        return notice;
    } catch (err) {
        throw err;
    }
}

const getTotalNumberOfNoticesByEmp = async (user) => {
    try {
        const notice = await noticeModel.find({ empId: user }).count()
        return notice;
    } catch (err) {
        throw err;
    }
}

const getTotalNumberOfNoticesByHr = async () => {
    try {
        const notice = await noticeModel.find().count()
        return notice;
    } catch (err) {
        throw err;
    }
}

module.exports = {
    createNotice,
    deleteNotice,
    getNoticeByHR,
    getNoticeBYEmp,
    getTotalNumberOfNoticesByEmp,
    getTotalNumberOfNoticesByHr
}