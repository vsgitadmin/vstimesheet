var jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET

const JWTtoDecoder = async (token) => {
    try{
        if (!JWT_SECRET) throw new Error('Missing environment variable: JWT_SECRET')
        const decoded = await jwt.verify(token,JWT_SECRET);
        return decoded;
    }catch(err){throw err}
}

module.exports = JWTtoDecoder;