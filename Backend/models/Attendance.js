const mongoose = require("mongoose");

const AttendanceSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
  date: { type: Date, required: true },
  status: { type: String, enum: ["Present", "Absent", "Leave", "Late"], required: true },
  checkIn: { type: String, default: "-" },
  checkOut: { type: String, default: "-" },
  workingHours: { type: String, default: "-" }, 
  remarks: { type: String, default: "" },
}, { timestamps: true });

const Attendance = mongoose.model("Attendance", AttendanceSchema);
module.exports = Attendance;
