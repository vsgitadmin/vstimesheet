const mongoose = require("mongoose")
const { MONGODBSRV } = process.env

module.exports.connectDb = async () => {
    if (!MONGODBSRV) throw new Error('Missing environment variable: MONGODBSRV')
    const connection = await mongoose.connect(MONGODBSRV)
    return connection
}
