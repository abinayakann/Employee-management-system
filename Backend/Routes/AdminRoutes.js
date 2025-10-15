const express = require("express");
const { AdminLogin } = require("../Controllers/AdminController");
const Admin = require("../models/Admin"); // <- Added import

const router = express.Router();

// Admin Login Route
router.post("/login", AdminLogin);

// Temporary route to create an admin
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    // Create new admin
    const newAdmin = new Admin({ username, password });
    await newAdmin.save();

    res.status(201).json({ message: "Admin created successfully" });
  } catch (error) {
    console.log("Register Error:", error); // <- Log the real error
    res.status(500).json({
      message: "Error creating admin",
      error: error.message, // <- Return only the error message
    });
  }
});

module.exports = router;
