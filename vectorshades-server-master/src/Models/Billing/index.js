const mongoose = require("mongoose")
const Schema = mongoose.Schema;
const { v4: uuidv4 } = require('uuid');

const billingSchema = new Schema({
    _id: { type: String, default: uuidv4 },
    type: { type: String, required: true },
    billing_data: { type: Object, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    attributes: { type: String, required: true },
    public: { type: Boolean, default: false },
    billingDate: {type: Date, default: Date.now},
    billingSummary:{type:Array,default:[]},
    accessIds : {type:Array,default:[]}
})

const billingModel = mongoose.model('billings', billingSchema);

module.exports = { billingModel }
