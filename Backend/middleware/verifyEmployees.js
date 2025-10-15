const jwt = require("jsonwebtoken");
const EmployeeHr = require("../models/Employeehr");
const Employee = require("../models/Employee");

const verifyEmployee = async (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token)
    return res.status(401).json({ message: "Access Denied. No Token Provided." });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);

    // Try both collections
    let employee = await Employee.findById(verified.id) || await EmployeeHr.findById(verified.id);

    if (!employee)
      return res.status(404).json({ message: "Employee not found" });

    req.employee = { id: employee._id };
    next();
  } catch (error) {
    console.error("verifyEmployee error:", error.message);
    res.status(400).json({ message: "Invalid Token" });
  }
};

module.exports = verifyEmployee;
