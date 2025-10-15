const express = require("express");
const router = express.Router();
const {getMyPayroll,downloadPayslip} = require("../Controllers/payrollEmployeeController");
const verifyEmployee  = require("../middleware/employeeverify");

// Employee can view own payrolls
router.get("/my", verifyEmployee, getMyPayroll);

// Download payslip
router.get("/download/:id", verifyEmployee, downloadPayslip);

module.exports = router;
