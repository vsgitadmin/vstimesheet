const messagingResponse = require("../../Classes/Responses/messaging.type")
const { createChatList, getChatListOfEmployee, getAllChatList, updateChatListOfEmployee, deleteChatListOfEmployee, createNewChatMessage, getChatsBetweenSenderAndReciver, createGroup, getAllJoinedGroups, joinGroup, getAllGroups, deleteGroup, getGroupDetails, addNewMemberToGroup, createPublicDocument, getAllPublicDocuments, getAllDocuments, deleteDocument } = require("../ControllerFunction/Messaging")

const createChatListController = async (req, res) => {
    const response = await createChatList({ ...req.body, employeeId: req.headers.data.id })
        .then((response) => new messagingResponse("ChatList Created Successfully", response, false, 200))
        .catch((err) => new messagingResponse("ChatList Creation Failed", null, true, 400))
    res.status(response.status).send(response)
}

const getChatListOfEmployeeController = async (req, res) => {
    const response = await getChatListOfEmployee(req.query)
        .then((response) => new messagingResponse("ChatList Fetched Successfully", response, false, 200))
        .catch((err) => new messagingResponse("ChatList Fetch Failed", null, true, 400))
    res.status(response.status).send(response)
}

const getAllChatListController = async (req, res) => {
    const response = await getAllChatList()
        .then((response) => new messagingResponse("ChatList Fetched Successfully", response, false, 200))
        .catch((err) => new messagingResponse("ChatList Fetch Failed", null, true, 400))
    res.status(response.status).send(response)
}

const updateEmplotyeeChatListController = async (req, res) => {
    const response = await updateChatListOfEmployee(req.query, req.body)
        .then((response) => new messagingResponse("ChatList Updated Successfully", response, false, 200))
        .catch((err) => new messagingResponse("ChatList Update Failed", null, true, 400))
    res.status(response.status).send(response)
}

const deleteEmplotyeeChatListController = async (req, res) => {
    const response = await deleteChatListOfEmployee(req.query)
        .then((response) => new messagingResponse("ChatList Delete Successfully", response, false, 200))
        .catch((err) => new messagingResponse("ChatList Delete Failed", null, true, 400))
    res.status(response.status).send(response)
}

const createNewChatMessageController = async (req, res) => {
    const response = await createNewChatMessage({ ...req.body, employeeId: req.headers.data.id })
        .then((response) => new messagingResponse("Chat Saved Successfully", response, false, 200))
        .catch((err) => new messagingResponse("Chat Save Failed", null, true, 400))
    res.status(response.status).send(response)
}

const getChatsBetweenSenderAndReciveController = async (req, res) => {
    const response = await getChatsBetweenSenderAndReciver(req.query)
        .then((response) => new messagingResponse("Chat Fetched Successfully", response, false, 200))
        .catch((err) => new messagingResponse("Chat  Fetch Failed", null, true, 400))
    res.status(response.status).send(response)
}

const createNewGroupController = async (req, res) => {
    const response = await createGroup(req.body)
        .then((response) => new messagingResponse("Group Created Successfully", response, false, 200))
        .catch((err) => new messagingResponse("Group Creation  Failed", null, true, 400))
    res.status(response.status).send(response)
}

const getAllJoinedGroupsCOntroller = async (req, res) => {
    const response = await getAllJoinedGroups(req.query.id)
        .then((response) => new messagingResponse("Groups Fetched Successfully", response, false, 200))
        .catch((err) => new messagingResponse("Groups  Fetch Failed", null, true, 400))
    res.status(response.status).send(response)
}

const joinGroupController = async (req, res) => {
    const response = await joinGroup(req.query, req.body)
        .then((response) => new messagingResponse("Joined Group Successfully", response, false, 200))
        .catch((err) => new messagingResponse("Failed", null, true, 400))
    res.status(response.status).send(response)
}

const getAllGroupsController = async (req, res) => {
    const response = await getAllGroups()
        .then((response) => new messagingResponse("Joined Group Successfully", response, false, 200))
        .catch((err) => new messagingResponse("Failed", null, true, 400))
    res.status(response.status).send(response)
}

const deleteGroupController = async (req, res) => {
    const response = await deleteGroup(req.query)
        .then((response) => new messagingResponse("Group Deleted Successfully", response, false, 200))
        .catch((err) => new messagingResponse("Failed", null, true, 400))
    res.status(response.status).send(response)
}

const getGroupDetailsController = async (req, res) => {
    const response = await getGroupDetails(req.query)
        .then((response) => new messagingResponse("Group Details Fetched Successfully", response, false, 200))
        .catch((err) => new messagingResponse("Failed", null, true, 400))
    res.status(response.status).send(response)
}

const addNewMemberToGroupController = async (req, res) => {
    const response = await addNewMemberToGroup(req.query,req.body)
        .then((response) => new messagingResponse("New Member Added ", response, false, 200))
        .catch((err) => new messagingResponse("Failed", null, true, 400))
    res.status(response.status).send(response)
}

const createPublicDocumentController = async (req, res) => {
    const response = await createPublicDocument(req.body)
        .then((response) => new messagingResponse("New Document Added ", response, false, 200))
        .catch((err) => new messagingResponse("Failed", null, true, 400))
    res.status(response.status).send(response)
}

const getAllPublicDocumentsController = async (req, res) => {
    const response = await getAllPublicDocuments()
        .then((response) => new messagingResponse("Fetched ", response, false, 200))
        .catch((err) => new messagingResponse("Failed", null, true, 400))
    res.status(response.status).send(response)
}

const getAllDocumentsController = async (req, res) => {
    const response = await getAllDocuments()
        .then((response) => new messagingResponse("Fetched ", response, false, 200))
        .catch((err) => new messagingResponse("Failed", null, true, 400))
    res.status(response.status).send(response)
}

const deleteDocumentController = async (req, res) => {
    const response = await deleteDocument(req.query)
        .then((response) => new messagingResponse("Deleted ", response, false, 200))
        .catch((err) => new messagingResponse("Failed", null, true, 400))
    res.status(response.status).send(response)
}

module.exports = {
    createChatListController,
    getChatListOfEmployeeController,
    getAllChatListController,
    updateEmplotyeeChatListController,
    deleteEmplotyeeChatListController,
    createNewChatMessageController,
    getChatsBetweenSenderAndReciveController,
    createNewGroupController,
    getAllJoinedGroupsCOntroller,
    joinGroupController,
    getAllGroupsController,
    deleteGroupController,
    getGroupDetailsController,
    addNewMemberToGroupController,
    createPublicDocumentController,
    getAllPublicDocumentsController,
    getAllDocumentsController,
    deleteDocumentController
}