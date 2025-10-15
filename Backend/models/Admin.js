const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const AdminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, { timestamps: true });

// Hash password before saving
AdminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare plain password with hashed password
AdminSchema.methods.comparePassword = async function (plain) {
  return bcrypt.compare(plain, this.password);
};

const Admin =
  mongoose.models.Admin || mongoose.model("Admin", AdminSchema);

module.exports = Admin;
