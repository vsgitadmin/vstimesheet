const { createNoticeController, getNoticeByEmpController, getNoticeByHRController, deleteNoticeController,getTotalNoOfNoticesByEmpController, getTotalNoOfNoticesByHrController} = require('../../Controllers/Controller/notice.controller')
const express = require("express")
const noticeRoute = express.Router();

noticeRoute.post('/create',createNoticeController)
noticeRoute.get('/get/emp',getNoticeByEmpController)
noticeRoute.get('/get/hr',getNoticeByHRController)
noticeRoute.delete('/delete',deleteNoticeController)
noticeRoute.get('/get/emp/totalcount',getTotalNoOfNoticesByEmpController)
noticeRoute.get('/get/hr/totalcount',getTotalNoOfNoticesByHrController)

module.exports = noticeRoute;