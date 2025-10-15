const express = require("express");
const router = express.Router();
const {getAllPayrolls,downloadPayslip} = require("../Controllers/payrollAdminController");
const  verifyAdmin  = require("../middleware/verifyAdmin");

// Admin can view all payrolls
router.get("/", verifyAdmin, getAllPayrolls);

// Download payslip
router.get("/download/:id", verifyAdmin, downloadPayslip);

module.exports = router;
