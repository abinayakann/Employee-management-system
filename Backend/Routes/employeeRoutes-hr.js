const express = require("express");
const {
  getEmployeeshr,
  addEmployeehr,
  updateEmployeehr,
  deleteEmployeehr,
} = require("../Controllers/employeecontroller-hr");

const router = express.Router();

router.get("/", getEmployeeshr);       
router.post("/", addEmployeehr);       
router.put("/:id", updateEmployeehr);  
router.delete("/:id", deleteEmployeehr); 

module.exports = router;
