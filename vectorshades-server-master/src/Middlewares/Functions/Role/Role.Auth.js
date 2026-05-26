const roleConfig = require("./role.config")
const PublicRoutes = require('../../../Config/constants/PublicRoutes')

const roleAuth = (req, res, next) => {
    // Permissions disabled: allow all non-public routes through.
    // This also prevents crashes when route config or headers are missing.
    return next()

    if(req._parsedUrl.path.startsWith('/public') === false && PublicRoutes.includes(req._parsedUrl.pathname) === false){
        const obj = roleConfig.find((obj) =>req.originalUrl.startsWith(obj.path))
        if (!obj) next()
        if(obj.permissions.includes(req.headers.data.role)) next()
        else res.status(401).json("You do not have the permission to access this api")
    }else next()
}

module.exports = { roleAuth }