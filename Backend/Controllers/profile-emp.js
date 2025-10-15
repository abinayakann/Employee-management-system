const Employee = require("../models/Employee");      // your employee login collection
const EmployeeHR = require("../models/Employeehr");  // your HR details collection

// ✅ Get merged profile
exports.getProfile = async (req, res) => {
  try {
    const employeeId = req.user.EmployeeID; // from token middleware
    if (!employeeId) return res.status(400).json({ message: "Invalid Employee ID" });

    // Find employee from both collections
    const basic = await Employee.findOne({ EmployeeID: employeeId });
    const hr = await EmployeeHR.findOne({ EmployeeID: employeeId });

    if (!basic && !hr) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Merge both documents
    const mergedProfile = {
      _id: basic?._id || hr?._id,
      name: basic?.name || hr?.name,
      EmployeeID: employeeId,
      email: hr?.email || "",
      phone: hr?.phone || "",
      department: hr?.department || "",
      designation: hr?.designation || "",
      salary: hr?.salary || "",
      dob: hr?.dob || "",
      address: hr?.address || "",
    };

    res.status(200).json(mergedProfile);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Server error while fetching profile" });
  }
};

// ✅ Update profile (updates HR collection only)
exports.updateProfile = async (req, res) => {
  try {
    const employeeId = req.user.EmployeeID;
    const { email, phone, department, designation, salary, dob, address, } = req.body;

    let hr = await EmployeeHR.findOne({ EmployeeID: employeeId });
    if (!hr) {
      return res.status(404).json({ message: "Employee HR record not found" });
    }

    // Update fields
    hr.email = email || hr.email;
    hr.phone = phone || hr.phone;
    hr.department = department || hr.department;
    hr.designation = designation || hr.designation;
    hr.salary = salary || hr.salary;
    hr.dob = dob || hr.dob;
    hr.address = address || hr.address;

    await hr.save();

    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Server error while updating profile" });
  }
};
