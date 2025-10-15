const Tasks = require("../models/Tasks");
const mongoose = require("mongoose");
const EmployeeHR = require("../models/Employeehr");

// ✅ Create Task
const createTask = async (req, res) => {
  try {
    const { employeeId, title, description, deadline, status, priority } = req.body;

    if (!mongoose.Types.ObjectId.isValid(employeeId))
      return res.status(400).json({ message: "Invalid employee ID" });

    const employee = await EmployeeHR.findById(employeeId);
    if (!employee) return res.status(404).json({ message: "Employee not found" });

    const task = new Tasks({
      assignedTo: employee._id,          // reference EmployeeHR _id
      assignedBy: req.user.id,           // HR from JWT
      title,
      description,
      deadline,
      status,
      priority: priority || "Medium",
      department: employee.department,
    });

    await task.save();
    res.status(201).json(task);
  } catch (err) {
    console.error("Create Task Error:", err.message);
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get all tasks (HR)
const getTasks = async (req, res) => {
  try {
    const tasks = await Tasks.find({ assignedBy: req.user.id }).populate(
      "assignedTo",
      "name EmployeeID"
    );

    const tasksWithInfo = await Promise.all(
      tasks.map(async (task) => {
        const employeeID = task.assignedTo ? task.assignedTo.EmployeeID : null;

        let hrData = null;
        if (employeeID) {
          hrData = await EmployeeHR.findOne({ EmployeeID: employeeID });
        }

        return {
          _id: task._id,
          title: task.title,
          description: task.description,
          assignedTo: task.assignedTo ? task.assignedTo.name : "Unknown",
          department: hrData ? hrData.department : "-",
          status: task.status || "-",
          priority: task.priority || "Medium",
          deadline: task.deadline ? new Date(task.deadline).toLocaleDateString() : "-",
        };
      })
    );

    res.status(200).json(tasksWithInfo);
  } catch (err) {
    console.error("Get Tasks Error:", err.message);
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get task by filter (employee, status)
const getTasksByFilter = async (req, res) => {
  try {
    const { employeeId, status } = req.query;
    const query = { assignedBy: req.user.id };

    if (employeeId) query.assignedTo = employeeId;
    if (status) query.status = status;

    const tasks = await Tasks.find(query).populate("assignedTo", "name EmployeeID");

    const tasksWithInfo = await Promise.all(
      tasks.map(async (task) => {
        const employeeID = task.assignedTo ? task.assignedTo.EmployeeID : null;

        let hrData = null;
        if (employeeID) {
          hrData = await EmployeeHR.findOne({ EmployeeID: employeeID });
        }

        return {
          _id: task._id,
          title: task.title,
          description: task.description,
          assignedTo: task.assignedTo ? task.assignedTo.name : "Unknown",
          department: hrData ? hrData.department : "-",
          status: task.status || "-",
          priority: task.priority || "Medium",
          deadline: task.deadline ? new Date(task.deadline).toLocaleDateString() : "-",
        };
      })
    );

    res.status(200).json(tasksWithInfo);
  } catch (err) {
    console.error("Get Tasks By Filter Error:", err.message);
    res.status(500).json({ message: err.message });
  }
};

// ✅ Update Task
const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const task = await Tasks.findByIdAndUpdate(id, updatedData, { new: true });
    if (!task) return res.status(404).json({ message: "Task not found" });

    res.status(200).json(task);
  } catch (err) {
    console.error("Update Task Error:", err.message);
    res.status(500).json({ message: err.message });
  }
};

// ✅ Delete Task
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Tasks.findByIdAndDelete(id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (err) {
    console.error("Delete Task Error:", err.message);
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createTask, getTasks, getTasksByFilter, updateTask, deleteTask };
