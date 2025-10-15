const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  department: { type: String },
  designation: { type: String },
  dateOfJoining: { type: Date },
  address: { type: String },
  avatar: { type: String }, // optional profile picture
  password: { type: String, required: true },
}, { timestamps: true });

const Employee =
  mongoose.models.Employee || mongoose.model("Employee", employeeSchema);

module.exports = Employee;
