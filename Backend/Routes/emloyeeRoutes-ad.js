const express = require("express");
const router = express.Router();
const {
  getEmployeesAdmin,
  deleteEmployeeAdmin,
  updateEmployeeAdmin
} = require("../Controllers/employeeCon-ad");


const auth = require("../middleware/auth");

// Get all admin employees
router.get("/", auth, getEmployeesAdmin);

// Delete employee
router.delete("/:id", auth, deleteEmployeeAdmin);

// Update employee
router.put("/:id", auth, updateEmployeeAdmin);

module.exports = router;
