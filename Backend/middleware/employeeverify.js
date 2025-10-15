const jwt = require("jsonwebtoken");
const Employee = require("../models/Employee");

const verifyEmployee = async (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Access Denied. No Token Provided." });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    const employee = await Employee.findById(verified.id);
    if (!employee) return res.status(404).json({ message: "Employee not found" });

    req.user = employee;
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid Token" });
  }
};

module.exports = verifyEmployee;
