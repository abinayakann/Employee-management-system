const Task = require("../models/Tasks");
const Employee = require("../models/Employee")

const getMyTasks = async (req, res) => {
  try {
    const employeeId = req.employee.id; // comes from auth middleware
    const tasks = await Task.find({ assignedTo: employeeId })
      .populate("assignedBy", "HrID")
      .populate("assignedTo", "name EmployeeID") // optional, just to show name
      .lean();
    res.status(200).json({ tasks });
  } catch (err) {
    console.error("getMyTasks error:", err.message);
    res.status(500).json({ message: "Failed to fetch tasks", error: err.message });
  }
};

// Update task status by employee
const updateMyTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, remarks } = req.body;

    const task = await Task.findByIdAndUpdate(
      id,
      { status, remarks },
      { new: true }
    );
    res.status(200).json({ message: "Task updated", task });
  } catch (error) {
    res.status(500).json({ message: "Error updating task", error: error.message });
  }
};

module.exports = { getMyTasks, updateMyTaskStatus };