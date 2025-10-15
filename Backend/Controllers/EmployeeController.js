const Employee = require("../models/Employee");
const jwt = require("jsonwebtoken");

// ✅ Employee Registration
const EmployeeRegister = async (req, res) => {
  try {
    const { name, EmployeeID, password } = req.body;

    // Check if employee already exists
    const existing = await Employee.findOne({ EmployeeID });
    if (existing) {
      return res.status(400).json({ message: "EmployeeID already exists" });
    }

    const newEmployee = new Employee({ name, EmployeeID, password });
    await newEmployee.save();

    res.status(201).json({ message: "Employee registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error registering employee", error: error.message });
  }
};

// ✅ Employee Login
const EmployeeLogin = async (req, res) => {
  try {
    const { EmployeeID, password } = req.body;

    const employee = await Employee.findOne({ EmployeeID });
    if (!employee) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await employee.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: employee._id, name: employee.name, EmployeeID: employee.EmployeeID },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      employee: { id: employee._id, name: employee.name, EmployeeID: employee.EmployeeID }
    });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
};

// ✅ Get all employees (for testing GET)
const GetEmployees = async (req, res) => {
  try {
    const employees = await Employee.find({}, "-password"); // exclude passwords
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ message: "Error fetching employees", error: error.message });
  }
};

module.exports = { EmployeeRegister, EmployeeLogin, GetEmployees };
