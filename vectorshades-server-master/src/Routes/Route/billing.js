const express = require("express");
const { createBillingController, getBillingDataController, deleteBillingDataController, updateBillingDataController, getBillingDataListController } = require("../../Controllers/Controller/billing.controller");
const billingRoute = express.Router();

billingRoute.post('/create', createBillingController)
billingRoute.get('/get', getBillingDataController)
billingRoute.delete('/delete', deleteBillingDataController)
billingRoute.patch('/update', updateBillingDataController)
billingRoute.get('/get/list', getBillingDataListController)

module.exports = billingRoute