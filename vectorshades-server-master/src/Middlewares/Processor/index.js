const {auth:{authenticationMiddleware,roleAuth}} =require("../Extractor/index")
const { logRequestMiddleware } = require("../Functions/logs")
const { truncateResponseDecimalsMiddleware } = require("../Functions/response")
let middleware = []

const PushMiddleWare = (func) => middleware.push({"middleware":func})

PushMiddleWare(truncateResponseDecimalsMiddleware)
PushMiddleWare(authenticationMiddleware)
PushMiddleWare(logRequestMiddleware)
PushMiddleWare(roleAuth)

module.exports = middleware