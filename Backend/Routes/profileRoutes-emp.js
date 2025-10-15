const express = require("express");
const router = express.Router();
const { getProfile, updateProfile } = require("../Controllers/profile-emp");
const verifyEmployee = require("../middleware/employees");

// Protected routes
router.get("/myprofile", verifyEmployee, getProfile);
router.put("/myprofile", verifyEmployee, updateProfile);

module.exports = router;
