const express = require('express')
const punchingInfoRoute = express.Router()

const {
    createPunchingInfoController,
    getPunchingInfoListController,
    getPunchingInfoByIdController,
    updatePunchingInfoController
} = require('../../Controllers/Controller/punchingInfo.controller')

punchingInfoRoute.post('/create', createPunchingInfoController)
punchingInfoRoute.get('/list', getPunchingInfoListController)
punchingInfoRoute.get('/:id', getPunchingInfoByIdController)
punchingInfoRoute.patch('/update/:id', updatePunchingInfoController)

module.exports = punchingInfoRoute
