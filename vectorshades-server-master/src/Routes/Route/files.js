const express = require("express")
const fileRoutes = express.Router();
const {documentUploadActivationController,getFile,getEmployeeActivatedDocumentController,deleteFileController} = require('../../Controllers/Controller/files.controller')

fileRoutes.post('/activation/documents',documentUploadActivationController)
fileRoutes.get('/download/file',getFile)
fileRoutes.post('/generate/activation',getEmployeeActivatedDocumentController)
fileRoutes.delete('/delete/files',deleteFileController)


module.exports = fileRoutes;