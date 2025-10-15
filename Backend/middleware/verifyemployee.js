const jwt = require("jsonwebtoken");
const Employee = require("../models/Employeehr");

const verifyEmployee = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded JWT:", decoded);

    // ✅ Find by EmployeeID instead of _id
    const employee = await Employee.findOne({ EmployeeID: decoded.EmployeeID });
    if (!employee) return res.status(404).json({ message: "Employee not found" });

    // ✅ Attach info to req.user for later use
    req.user = {
      id: employee._id,
      EmployeeID: employee.EmployeeID
      // name: employee.name,
      // role: decoded.role,
    };

    next();
  } catch (err) {
    console.error("Error verifying employee token:", err);
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = verifyEmployee;
