const { chatListModel, messagesModel, groupModel,chatFilesModel } = require("../../../Models/Messaging")
const { employeeModel } = require("../../../Models/Employee");
const { companyDocumentsModel } = require("../../../Models/Cloud");

const createChatList = async (body) => {
    try {
        let response;
        let existingChatList = await chatListModel.findOne({ employeeId: body.employeeId });
        let reciverChatList = await chatListModel.findOne({ employeeId: body.communications[0].employeeId });

        if (!existingChatList) {
            existingChatList = await new chatListModel(body).save();
            response = existingChatList; // Assign the saved chatListModel to the response variable
        }

        if (!existingChatList.communications.find((obj) => obj.employeeId === body.communications[0].employeeId)) {
            await existingChatList.updateOne({ $addToSet: { communications: body.communications[0] } });
        }

        if (reciverChatList == null || reciverChatList == undefined) {
            await new chatListModel({employeeName: body.communications[0].employeeName,employeeId: body.communications[0].employeeId,communications: [{ employeeName: existingChatList.employeeName, employeeId: existingChatList.employeeId }]}).save();
        }

        if (!reciverChatList.communications.find((obj) => obj.employeeId === existingChatList.employeeId)) {
            await reciverChatList.updateOne({ $addToSet: { communications: { employeeId: existingChatList.employeeId, employeeName: existingChatList.employeeName } } });
        }

        return response; // Return the response variable
    } catch (err) { throw err }
}

const getChatListOfEmployee = async (query) => {
    try {
        let response = await chatListModel.findOne({ employeeId: query.id })
        return response
    } catch (err) { throw err }
}

const getAllChatList = async () => {
    try {
        let response = await chatListModel.find()
        return response
    } catch (err) { throw err }
}

const updateChatListOfEmployee = async (query, body) => {
    try {
        let response = await chatListModel.findOneAndUpdate({ employeeId: query.id }, { $set: body }, { new: true })
        return response
    } catch (err) { throw err }
}


const deleteChatListOfEmployee = async (query) => {
    try {
        let response = await chatListModel.deleteOne({ employeeId: query.id })
        return response
    } catch (err) { throw err }
}

const createNewChatMessage = async (body) => {
    try {
        let response = await new messagesModel(body).save()
        return response
    } catch (err) { throw err }
}

const getChatsBetweenSenderAndReciver = async (query) => {
    try {
        let response = await messagesModel.find({$or: [{ sender: query.sender, receiver: query.receiver },{ sender: query.receiver, receiver: query.sender }]})
        return response
    } catch (err) { throw err }
}

const createGroup = async (body) => {
    try {
        let response = await new groupModel(body).save()
        return response
    } catch (err) { throw err }
}

const getAllJoinedGroups = async (employeeId) => {
    try {
        let response = await groupModel.find({ 'groupMembers.id': employeeId })
        return response
    } catch (err) { throw err }
}

const joinGroup = async (query,body) => {
    try {
        let response = await groupModel.updateOne({_id:query.id},{$addToSet:{groupMembers:body}})
        return response
    } catch (err) { throw err }
}

const getAllGroups = async () => {
    try {
        let response = await groupModel.find({})
        return response
    } catch (err) { throw err }
}

const deleteGroup = async (query)=>{
    try {
        let response = await groupModel.deleteOne({_id:query.id})
        return response
    } catch (err) { throw err }
}

const getGroupDetails = async (query) =>{
    try {
        let response = await groupModel.findOne({_id:query.id})
        response.groupMembers = await Promise.all(response.groupMembers.map(async (userId) => {
            return await employeeModel.findOne({ _id: userId }).select('firstName lastName _id email role designation')
          }));
        return response
    } catch (err) { throw err }
}

const addNewMemberToGroup = async (query, body) => {
    try {
        let response
        if (body.members instanceof Array) {
            response = await groupModel.findOneAndUpdate({ _id: query.id }, { $addToSet: { groupMembers: { $each: body.members } } }, { new: true })
        } else response = groupModel.findOneAndUpdate({ _id: query.id }, { $addToSet: { groupMembers: body.members } }, { new: true })
        return response
    } catch (err) { throw err }
}

const createPublicDocument = async (body)=>{
    try {
        let response = await new companyDocumentsModel(body).save()
        return response
    } catch (err) {throw err }
}

const getAllPublicDocuments = async ()=>{
    try {
        let response = await companyDocumentsModel.find({public:true}).sort({createdAt:-1})
        return response
    } catch (err) { throw err }
}

const getAllDocuments = async ()=>{
    try {
        let response = await companyDocumentsModel.find().sort({createdAt:-1})
        return response
    } catch (err) { throw err }
}

const deleteDocument = async (query)=>{
    try {
        let response = await chatFilesModel.deleteOne({id:query.id})
        return response
    } catch (err) { throw err }
}

module.exports = {
    createChatList,
    getChatListOfEmployee,
    getAllChatList,
    updateChatListOfEmployee,
    deleteChatListOfEmployee,
    createNewChatMessage,
    getChatsBetweenSenderAndReciver,
    createGroup,
    getAllJoinedGroups,
    joinGroup,
    getAllGroups,
    deleteGroup,
    getGroupDetails,
    addNewMemberToGroup,
    createPublicDocument,
    getAllPublicDocuments,
    getAllDocuments,
    deleteDocument
}