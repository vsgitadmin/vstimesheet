const { auth: { JWTtoDecoder } } = require("../../../Helpers/Extractor/index")
const PublicRoutes = require('../../../Config/constants/PublicRoutes')

const authenticationMiddleware = async (req, res, next) => {
    if (req.headers.authorization && PublicRoutes.includes(req._parsedUrl.pathname) === false && req._parsedUrl.path.startsWith('/public') === false) {
        try {
            const decoded = await JWTtoDecoder(req.headers.authorization.split(' ')[1])
            req.headers['data'] = decoded.data
            next()
        } catch (err) { res.status(400).json("token verification test failed") }
    }
    else if (PublicRoutes.includes(req._parsedUrl.pathname) === true || req._parsedUrl.path.startsWith('/public')) next()
    else res.status(403).json("please provide an authorization test token")
}

module.exports = { authenticationMiddleware }