import instance from "../../Axios/Axios.config";
import { communication } from "../../Constants/API/Endpoints";



const getUserNotifications = async (query) => {
    try {
        return await instance.get(communication.getNotifications, { params: query })
    } catch (err) {
        throw err
    }
}

const sendEmail = async ({ to, subject, html }) => {
    try {
        return await instance.post(communication.sendEmail, { to, subject, html })
    } catch (err) {
        throw err
    }
}

const createUserNotification = async (body) => {
    try {
        return await instance.post(communication.createNotification, body)
    } catch (err) {
        throw err
    }
}

export { getUserNotifications, sendEmail, createUserNotification };