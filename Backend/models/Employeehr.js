const mongoose = require("mongoose");

const EmployeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  EmployeeID: { type: String, required: true },
  department: { type: String, required: true },
  designation: { type: String, required: true },
  salary: { type: Number, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  dob: { type: Date },
  address: { type: String },
}, { timestamps: true });




module.exports = mongoose.models.EmployeeHr || mongoose.model("EmployeeHr", EmployeeSchema, "employeehrs");
