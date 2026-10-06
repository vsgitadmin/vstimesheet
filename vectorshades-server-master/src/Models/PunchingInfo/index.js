const mongoose = require("mongoose")
const Schema = mongoose.Schema

const punchEntrySchema = new Schema({
    type: { type: String, enum: ['in', 'out'], required: true },
    time: { type: Date, required: true }
}, { _id: false })

const breakAdjustmentSchema = new Schema({
    reason: { type: String, default: "" },
    minutes: { type: Number, default: 0 },
    adjustedBy: { type: String, default: "" },
    adjustedAt: { type: Date, default: Date.now }
}, { _id: false })

const punchingInfoSchema = new Schema({
    uid: { type: String, required: true },
    user: { type: String, required: true },
    date: { type: Date, required: true },
    inTime: { type: String, default: "" },
    outTime: { type: String, default: "" },
    isPresent: { type: Boolean, default: false },
    status: { type: String, default: "none" },
    approvalStatus: { type: String, default: "none" },
    lateBy: { type: Number, default: 0 },
    breakDuration: { type: Number, default: 0 },
    breakAdjustments: { type: [breakAdjustmentSchema], default: [] },
    actualWorkSeconds: { type: Number, default: 0 },
    grossDuration: { type: Number, default: null },
    totalDurationSeconds: { type: Number, default: 0 },
    totalMinutes: { type: Number, default: 0 },
    workDuration: { type: Number, default: null },
    punchLog: { type: String, default: "" },
    punches: { type: [punchEntrySchema], default: [] },
    source: { type: String, default: "" },
    uploadBatch: { type: String, default: null },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
})

const punchingInfoModel = mongoose.model('punching_info', punchingInfoSchema)

module.exports = { punchingInfoModel }
