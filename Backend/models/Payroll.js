const mongoose = require("mongoose");

const payrollSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee", // link to Employee model
      required: true,
    },
    month: { type: String, required: true },
    baseSalary: { type: Number, required: true },
    bonus: { type: Number, default: 0 },
    deductions: { type: Number, default: 0 },
    netSalary: { type: Number, required: true },
    status: { type: String, enum: ["Paid", "Pending"], default: "Pending" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payroll", payrollSchema);
