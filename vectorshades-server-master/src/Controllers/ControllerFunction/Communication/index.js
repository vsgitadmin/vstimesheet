const {communication:{notificationModel},employee:{employeeModel}} = require("../../../Models/Extractor/index")
const socketData = require("../../../Classes/Socket/index");
const sendEmail = require("../../../Helpers/Functions/Email/sendEmail");
const socketManager = socketData.getInstance();

const getAllNotifications = async (id,pageNumber) => {
    try{
        const notifications = await notificationModel.find({reciever:id}).limit(100).sort({ createdAt: -1 })
        return notifications
    }catch(err){
        throw err
    }
}

const createNotification = async (data) => {
    try{
        const notifications = await new notificationModel(data).save()
        const io = socketManager.getIo()
        const emp = await employeeModel.findById(data.reciever).select('socket')
        if (io && emp?.socket) {
            const payload = typeof notifications.toObject === 'function' ? notifications.toObject() : notifications
            io.to(emp.socket).emit('notification', payload)
        }
        return notifications
    }catch(err){
        throw err
    }
}

const deleteNotification = async (id) => {
    try{
        const notifications = await notificationModel.deleteOne(id)
        return notifications
    }catch(err){
        throw err
    }
}

const sendEmailFunction = async({to,subject,html}) =>{
    try{
        return await sendEmail(to,subject,html)
    }catch(err){
        console.log(err)
        throw err
    }
}

module.exports = {
    sendEmailFunction,
    getAllNotifications,
    createNotification,
    deleteNotification
}