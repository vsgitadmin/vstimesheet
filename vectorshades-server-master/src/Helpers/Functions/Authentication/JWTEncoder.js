var jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET

const encryptDataToJwt = async (data) => {
    if (!JWT_SECRET) throw new Error('Missing environment variable: JWT_SECRET')
    const token = jwt.sign({
        expiresIn:'8h' ,
        data: data
    },JWT_SECRET);
    return token
}

module.exports = encryptDataToJwt