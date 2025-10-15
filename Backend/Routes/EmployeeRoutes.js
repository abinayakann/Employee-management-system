const express = require("express");
const { EmployeeRegister, EmployeeLogin, GetEmployees } = require("../Controllers/EmployeeController");

const router = express.Router();

// Register employee
router.post("/register", EmployeeRegister);

// Login employee
router.post("/login", EmployeeLogin);

// Get all employees
router.get("/", GetEmployees);

module.exports = router;
