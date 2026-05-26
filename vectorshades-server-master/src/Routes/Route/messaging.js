const express = require("express");
const { createChatListController, getChatListOfEmployeeController, getAllChatListController, updateEmplotyeeChatListController, deleteEmplotyeeChatListController, createNewChatMessageController, getChatsBetweenSenderAndReciveController, createNewGroupController, getAllJoinedGroupsCOntroller, getAllGroupsController, joinGroupController, deleteGroupController, getGroupDetailsController, addNewMemberToGroupController, createPublicDocumentController, getAllPublicDocumentsController, getAllDocumentsController, deleteDocumentController } = require("../../Controllers/Controller/messaging.controller");
const messagingRoute = express.Router();

messagingRoute.post('/chatlist/create',createChatListController)
messagingRoute.get('/chatlist/get',getChatListOfEmployeeController)
messagingRoute.get('/chatlist/get/all',getAllChatListController)
messagingRoute.patch('/chatlist/update',updateEmplotyeeChatListController)
messagingRoute.delete('/chatlist/delete',deleteEmplotyeeChatListController)
messagingRoute.post('/chat/create',createNewChatMessageController)
messagingRoute.get('/chat/fetch',getChatsBetweenSenderAndReciveController)
messagingRoute.post('/group/create',createNewGroupController)
messagingRoute.get('/group/joined/all',getAllJoinedGroupsCOntroller)
messagingRoute.get('/group/all',getAllGroupsController)
messagingRoute.post('/group/join',joinGroupController)
messagingRoute.delete('/group/delete',deleteGroupController)
messagingRoute.get('/group/get',getGroupDetailsController)
messagingRoute.patch('/group/add/member',addNewMemberToGroupController)
messagingRoute.post('/chatfiles/document/create',createPublicDocumentController)
messagingRoute.get('/chatfiles/document/public',getAllPublicDocumentsController)
messagingRoute.get('/chatfiles/document/all',getAllDocumentsController)
messagingRoute.delete('/chatfiles/document/delete',deleteDocumentController)

module.exports = messagingRoute