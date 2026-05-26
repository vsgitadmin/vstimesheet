import jwt from "jsonwebtoken";

let ACCESS_KEY = "J(@H*(983289h89"

const generateToken = (payload,expiry) => {
    payload.expiresIn = new Date().getTime() + (expiry ? expiry : 15 * 60)
    return jwt.sign(payload, ACCESS_KEY, {algorithm: 'HS256', expiresIn: (expiry ? expiry : 15 * 60)});
};

const validateToken = (token) => {
    try {
        const decodedToken = jwt.verify(token, ACCESS_KEY);
        return decodedToken;
    } catch (error) {
        console.log(ACCESS_KEY, error.message);
        return null;
    }
};

module.exports = { generateToken, validateToken }