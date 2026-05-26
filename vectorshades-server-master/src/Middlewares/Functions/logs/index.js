// logRequestMiddleware.js

const { RequestLogModel } = require("../../../Models/Config");

function getClientIp(req) {
    let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || null;
    
    if (ip && ip.startsWith('::ffff:')) {
        ip = ip.substring(7); // strip IPv6 prefix for IPv4
    }
    if (ip === '::1') {
        ip = '127.0.0.1'; // localhost in IPv4
    }
    return ip;
}

const logRequestMiddleware = (req, res, next) => {
    res.on('finish', async () => {
        try {
            const logData = {
                userId: req.headers.data ? req.headers.data.id : 'PUBLIC REQ',
                method: req.method,
                url: req.originalUrl,
                params: req.params,
                query: req.query,
                body: req.body,
                origin: req.headers.origin || null,
                ip: getClientIp(req),
                userAgent: req.headers['user-agent'] || null,
                statusCode: res.statusCode,
                timestamp: new Date()
            };

            await RequestLogModel.create(logData)
        } catch (err) {
            console.error('Error logging request:', err);
        }
    });

    next();
};

module.exports = { logRequestMiddleware };
