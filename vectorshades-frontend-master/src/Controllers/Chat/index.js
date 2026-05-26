import instance from "../../Axios/Axios.config";
import { chat } from "../../Constants/API/Endpoints"

module.exports = {
    createChat: async (props) => {
        try {
            const response = await instance.post(chat.newChat, props)
            return response
        } catch (err) { throw err }
    },
    createChatList: async (props) => {
        try {
            const response = await instance.post(chat.createChatList, props)
            return response
        } catch (err) { throw err }
    },
    getChatList: async (query) => {
        try {
            const response = await instance.get(chat.getEmployeeChatList, { params: query })
            return response
        } catch (err) { throw err }
    },
    getAllChatList: async (query) => {
        try {
            const response = await instance.get(chat.getAllChatList, { params: query })
            return response
        } catch (err) { throw err }
    },
    createNewChat: async (props) => {
        try {
            const response = await instance.post(chat.newChat, props)
            return response
        } catch (err) { throw err }
    },
    getChatHistory: async (query) => {
        try {
            const response = await instance.get(chat.getChats, { params: query })
            return response
        } catch (err) { throw err }
    },
    createNewGroup: async (props) => {
        try {
            const response = await instance.post(chat.newGroup, props)
            return response
        } catch (err) { throw err }
    },
    getAllGroups: async () => {
        try {
            const response = await instance.get(chat.getGroups)
            return response
        } catch (err) { throw err }
    },
    joinGroup: async (props) => {
        try {
            const response = await instance.post(chat.joinGroup, props)
            return response
        } catch (err) { throw err }
    },
    getAllJoinedGroups: async (query) => {
        try {
            const response = await instance.get(chat.joinedGroups, { params: query })
            return response
        } catch (err) { throw err }
    },
    getGroupInfo: async (query) => {
        try {
            const response = await instance.get(chat.groupInfo, { params: query })
            return response
        } catch (err) { throw err }
    },
    addNewGroupMember: async (body, query) => {
        try {
            const response = await instance.patch(chat.addNewGroupMember, {members:body}, { params: query })
            return response
        } catch (err) { throw err }
    },
    getAllDocs: async () => {
        try {
            const response = await instance.get(chat.getAllDocuments)
            return response
        } catch (err) { throw err }
    },
    createNewDocumentController: async (body) =>{
        try {
            const response = await instance.post(chat.createNewDocument,body)
            return response
        } catch (err) { throw err }
    }

}