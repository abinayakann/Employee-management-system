const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const HRSchema = new mongoose.Schema({
  HrID: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, { timestamps: true });

HRSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

HRSchema.methods.comparePassword = async function (plain) {
  return bcrypt.compare(plain, this.password);
};

const HR =
  mongoose.models.HR || mongoose.model("HR", HRSchema);

module.exports = HR;
