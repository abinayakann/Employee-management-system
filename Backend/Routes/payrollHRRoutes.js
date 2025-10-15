const express = require("express");
const router = express.Router();
const {createPayroll,getAllPayroll,updatePayroll,deletePayroll,downloadPayslip} = require("../Controllers/payrollHRController");
const verifyHr = require("../middleware/verifyHr");

// HR can manage payroll
router.post("/", verifyHr, createPayroll);
router.get("/", verifyHr, getAllPayroll);
router.put("/:id", verifyHr,updatePayroll);
router.delete("/:id", verifyHr, deletePayroll);

// Download payslip
router.get("/download/:id", verifyHr, downloadPayslip);

module.exports = router;
