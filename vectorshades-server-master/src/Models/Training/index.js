const { Schema, model } = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const trainingSchema = new Schema({
  _id: { type: String, default: uuidv4 },
  name: { type: String, required: true },
  type: { type: String, required: true },
  description: { type: String },
  lastActive: { type: Date, default: Date.now },
  timeSpent: { type: Number, default: 0 }, // in seconds;
  duration: { type: Number, required: true }, // maximum time allowed (in hours)
  dueDate: { type: Date, required: true }, // last date
  assignedBy: { type: String, required: true },
  assignedById: { type: String, required: true },
  assignedTo: { type: [String], default: [] },
  assignedToNames: { type: [{ id: String, name: String }], default: [] },
  active: { type: Boolean, default: false },
  completed: { type: Boolean, default: false },
  files: { type: Array, default: [] },
});

const TrainingModel = model("training", trainingSchema);

module.exports = { TrainingModel };
