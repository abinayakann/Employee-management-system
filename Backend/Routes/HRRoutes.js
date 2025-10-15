const express = require("express");
const { HRRegister, HRLogin, GetHRs } = require("../Controllers/HrController");

const router = express.Router();

// Register HR
router.post("/register", HRRegister);

// Login HR
router.post("/login", HRLogin);

// Get all HR
router.get("/", GetHRs);

module.exports = router;
