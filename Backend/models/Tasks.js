const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
  assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: "HR", required: true },
  department: { type: String },
  priority: { type: String, enum: ["Low", "Medium", "High"], default: "Medium" },
  status: { type: String, enum: ["Pending", "In Progress", "Completed"], default: "Pending" },
  deadline: { type: Date },
  remarks: { type: String },
}, { timestamps: true });


const Task = mongoose.model("Task", taskSchema);
module.exports = Task;
