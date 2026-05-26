const express = require("express");
const { sendTestEmailController } = require("../../Controllers/Controller/communication.controller");

const publicRoute = express.Router();

// Public endpoint (no auth token required) to verify SMTP/email sending.
// POST /public/email/test
publicRoute.post("/email/test", sendTestEmailController);

module.exports = publicRoute;

