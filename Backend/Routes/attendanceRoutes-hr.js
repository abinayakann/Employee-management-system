const express = require("express");
const { getAllAttendance } = require("../Controllers/attendancecontroller-hr");

const router = express.Router();

// Get all attendance records
router.get("/", getAllAttendance);




module.exports = router;
