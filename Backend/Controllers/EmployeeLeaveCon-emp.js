const EmployeeLeave = require("../models/EmployeeLeave-emp");

// Apply for leave
exports.applyLeave = async (req, res) => {
  try {
    const { leaveType, startDate, endDate, reason } = req.body;
    const employeeId = req.user.id;

    const newLeave = new EmployeeLeave({
      employeeId,
      leaveType,
      startDate,
      endDate,
      reason,
    });

    await newLeave.save();
    res.status(201).json({ message: "Leave applied successfully", newLeave });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// View own leaves
exports.getMyLeaves = async (req, res) => {
  try {
    const employeeId = req.user.id;
    const leaves = await EmployeeLeave.find({ employeeId }).sort({ appliedOn: -1 });
    res.status(200).json(leaves);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
