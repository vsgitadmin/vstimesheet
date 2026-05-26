const {getAllNotifications,createNotification,deleteNotification, sendEmailFunction} = require('../ControllerFunction/Communication/index')
const { response: { communicationResponse } } = require("../../Classes/index")

const getAllNotificationsController = async (req, res) => {
    const response = await getAllNotifications(req.headers.data.id,req.query.page)
    .then((data) => new communicationResponse("notification fetched successfully", { data }, false))
    .catch((err) => new communicationResponse(err.message, null, true))
    res.status(response.failed ? 400 : 200).json(response)
}

const createNotificationsController = async (req, res) => {
    const response = await createNotification(req.body)
    .then((data) => new communicationResponse("notification created successfully", { data }, false))
    .catch((err) => new communicationResponse(err.message, null, true))
    res.status(response.failed ? 400 : 200).json(response)
}

const deleteNotificationsController = async (req, res) => {
    const response = await deleteNotification(req.body)
    .then((data) => new communicationResponse("notification deleted successfully", { data }, false))
    .catch((err) => new communicationResponse(err.message, null, true))
    res.status(response.failed ? 400 : 200).json(response)
}

const sendEmailController = async(req,res) => {
    const response = await sendEmailFunction(req.body)
    .then((data) => new communicationResponse("Email send successfully", { data }, false))
    .catch((err) => new communicationResponse(err.message, null, true))
    res.status(response.failed ? 400 : 200).json(response)
}

// Public endpoint (no auth token required) to test SMTP email sending.
// POST /public/email/test
// Body: { to: string, subject?: string, html?: string }
const sendTestEmailController = async (req, res) => {
    const { to, subject, html } = req.body || {};

    if (!to) {
        const response = new communicationResponse('Missing required field: "to"', null, true);
        return res.status(400).json(response);
    }

    const response = await sendEmailFunction({
        to,
        subject: subject || "Vectorshades Email Test",
        html: html || "<p>This is a test email from Vectorshades backend.</p>",
    })
        .then((data) => new communicationResponse("Email sent successfully", { data }, false))
        .catch((err) => new communicationResponse(err.message || String(err), null, true));

    res.status(response.failed ? 400 : 200).json(response);
};


module.exports = {
    getAllNotificationsController,
    createNotificationsController,
    deleteNotificationsController,
    sendEmailController,
    sendTestEmailController
}
