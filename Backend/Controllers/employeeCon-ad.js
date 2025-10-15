const Employeehr = require('../models/Employeehr');

// ✅ Get all employees (Admin)
const getEmployeesAdmin = async (req, res) => {
  try {
    const employees = await Employeehr.find().sort({ name: 1 }); // alphabetical
    res.status(200).json(employees);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Delete employee
const deleteEmployeeAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const emp = await Employeehr.findByIdAndDelete(id);
    if (!emp) return res.status(404).json({ message: "Employee not found" });
    res.status(200).json({ message: "Employee deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Update employee
const updateEmployeeAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body; // name, department, designation, salary, etc.
    const emp = await Employeehr.findByIdAndUpdate(id, updatedData, { new: true });
    if (!emp) return res.status(404).json({ message: "Employee not found" });
    res.status(200).json(emp);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getEmployeesAdmin,
  deleteEmployeeAdmin,
  updateEmployeeAdmin
};
