const encryptDataToJwt = require("../Functions/Authentication/JWTEncoder");
const JWTtoDecoder = require("../Functions/Authentication/JWTDecoder");
const {decodeFormula} = require("../Functions/General/decodeformula");
const { createJobActivity } = require("../Functions/DB/createJobActivity");
const sendEmployeeActivationMail = require("../Functions/Employees/sendEmployeeActivation")
const sendEmployeeActivationReviewMail = require("../Functions/Employees/sendEmployeeActivationReview")
const {processEmployeeActivationRequest} = require("../Functions/Employees/ActivationDataProcessing")

module.exports = {
    auth:{
        encryptDataToJwt,
        JWTtoDecoder
    },
    general:{
        decodeFormula
    },
    db:{
        createJobActivity
    },
    employee:{
        sendEmployeeActivationMail,
        sendEmployeeActivationReviewMail,
        processEmployeeActivationRequest
    }
}