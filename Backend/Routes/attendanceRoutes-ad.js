const express = require("express");
const router = express.Router();
const {
  getAllAttendance,
  addAttendance,
  updateAttendance,
  deleteAttendance,
} = require("../Controllers/attendanceCon-ad");

// CRUD for admin attendance
router.get("/", getAllAttendance);
router.post("/", addAttendance);
router.put("/:id", updateAttendance);
router.delete("/:id", deleteAttendance);

module.exports = router;
