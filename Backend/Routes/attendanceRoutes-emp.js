const express = require("express");
const {
  getMyAttendance,
  markCheckIn,
  markCheckOut,
} = require("../Controllers/attendanceCon-emp");
const auth = require("../middleware/auth");

const router = express.Router();

console.log(getMyAttendance, markCheckIn, markCheckOut);

router.get("/my", auth, getMyAttendance);
router.post("/checkin", auth, markCheckIn);
router.post("/checkout", auth, markCheckOut);

module.exports = router;
