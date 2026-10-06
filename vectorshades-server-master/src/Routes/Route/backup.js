const express = require("express")
const {
    createBackupController, listBackupsController, restoreBackupController, backupProgressController, downloadBackupController,
    uploadBackupController, deleteBackupController,
} = require("../../Controllers/Controller/backup.controller")
const backupRoute = express.Router();

backupRoute.post("/create", createBackupController)
backupRoute.get("/list", listBackupsController)
backupRoute.post("/restore", restoreBackupController)
backupRoute.get("/progress", backupProgressController)
backupRoute.get("/download", downloadBackupController)
// The multipart body is already parsed by the globally-mounted
// express-fileupload middleware (src/app.js) - req.files.file is available
// by the time uploadBackupController runs, no extra route middleware needed.
backupRoute.post("/upload", uploadBackupController)
backupRoute.delete("/delete", deleteBackupController)

module.exports = backupRoute
