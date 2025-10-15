const express = require("express");
const router = express.Router();
const { applyLeave, getMyLeaves } = require("../Controllers/EmployeeLeaveCon-emp");
const verifyEmployee = require("../middleware/verifyemployee");

router.post("/apply", verifyEmployee, applyLeave);
router.get("/my-leaves", verifyEmployee, getMyLeaves);

module.exports = router;
