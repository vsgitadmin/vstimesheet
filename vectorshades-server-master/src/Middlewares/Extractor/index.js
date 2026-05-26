const {authenticationMiddleware} = require("../Functions/Authentication/index")
const { roleAuth } = require("../Functions/Role/Role.Auth")

const middlewares = {
    auth:{
        authenticationMiddleware,
        roleAuth
    }
}


module.exports = middlewares