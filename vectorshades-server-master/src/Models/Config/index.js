const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { v4: uuidv4 } = require('uuid');

const configSchema = new Schema({
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    type: { type: String, required: true },
    multiConfig: { type: Boolean, required: true },
    value: { type: String, default: '' },
    configObjects: { type: [Object], default: [] }
})

const requestLogSchema = new mongoose.Schema({
    _id: { type: String, default: uuidv4 },
    userId: { type: String, default: 'PUBLIC REQ' },
    method: { type: String, required: true },
    url: { type: String, required: true },
    params: { type: mongoose.Schema.Types.Mixed }, // can store object
    query: { type: mongoose.Schema.Types.Mixed },  // can store object
    body: { type: mongoose.Schema.Types.Mixed },   // can store object
    origin: { type: String, default: null },
    ip: { type: String, default: null },
    userAgent: { type: String, default: null },
    statusCode: { type: Number, required: true },
     timestamp: { type: Date, default: Date.now, index: { expires: '365d' } }
}, {
    collection: 'request_logs',
    versionKey: false
});

const RequestLogModel = mongoose.model('RequestLog', requestLogSchema);

const configModel = mongoose.model('config', configSchema)

module.exports = { configModel, RequestLogModel }