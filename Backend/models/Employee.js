const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const EmployeeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    EmployeeID : { type: String, required: true, unique: true },
    password: { type: String, required: true },
}, { timestamps: true });


EmployeeSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare plain password with hashed password
EmployeeSchema.methods.comparePassword = async function (plain) {
  return bcrypt.compare(plain, this.password);
};

const Employee =
  mongoose.models.Employee || mongoose.model("Employee", EmployeeSchema);

module.exports = Employee;