const HR = require("../models/Hr"); 
const jwt = require("jsonwebtoken");

// ✅ HR Registration
const HRRegister = async (req, res) => {
  try {
    const { HrID, password } = req.body;

    // Check if HR already exists
    const existing = await HR.findOne({ HrID });
    if (existing) {
      return res.status(400).json({ message: "HRID already exists" });
    }

    const newHR = new HR({ HrID, password });
    await newHR.save();

    res.status(201).json({ message: "HR registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error registering HR", error: error.message });
  }
};

// ✅ HR Login
const HRLogin = async (req, res) => {
  try {
    const { HrID, password } = req.body;

    const hr = await HR.findOne({ HrID });
    if (!hr) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await hr.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: hr._id, role: "hr", name: hr.name, HrID: hr.HrID },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      hr: { id: hr._id, HrID: hr.HrID }
    });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
};

// ✅ Get all HR (for testing GET)
const GetHRs = async (req, res) => {
  try {
    const hrs = await HR.find({}, "-password"); // exclude passwords
    res.status(200).json(hrs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching HRs", error: error.message });
  }
};

module.exports = { HRRegister, HRLogin, GetHRs };
