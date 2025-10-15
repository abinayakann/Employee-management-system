const Employeehr = require("../models/Employeehr");

// Get all employees
const getEmployeeshr = async (req, res) => {
  try {
    const employeeshr = await Employeehr.find();
    res.json(employeeshr);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add new employee
const addEmployeehr = async (req, res) => {
  try {
    const newEmployee = new Employeehr(req.body);
    await newEmployee.save();
    res.status(201).json(newEmployee);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update employee
const updateEmployeehr = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedEmployee = await Employeehr.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedEmployee) {
      return res.status(404).json({ error: "Employee not found" });
    }
    res.json(updatedEmployee);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete employee
const deleteEmployeehr = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedEmployee = await Employeehr.findByIdAndDelete(id);
    if (!deletedEmployee) {
      return res.status(404).json({ error: "Employee not found" });
    }
    res.json({ message: "Employee deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getEmployeeshr,
  addEmployeehr,
  updateEmployeehr,
  deleteEmployeehr,
};
