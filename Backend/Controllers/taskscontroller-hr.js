const mongoose = require("mongoose");
const Tasks = require("../models/Tasks");
const EmployeeHR = require("../models/Employeehr");
const Employee = require("../models/Employee"); 

// ✅ Create Task
const createTask = async (req, res) => {
  try {
    const { employeeId, title, description, deadline, status, priority } = req.body;

    if (!mongoose.Types.ObjectId.isValid(employeeId))
      return res.status(400).json({ message: "Invalid employee ID" });

    // ✅ Find employee in HR collection
    const employeeHR = await EmployeeHR.findById(employeeId);
    if (!employeeHR)
      return res.status(404).json({ message: "Employee not found in HR records" });

    // ✅ Find corresponding employee in Employee (login) collection using EmployeeID
    const employeeLogin = await Employee.findOne({ EmployeeID: employeeHR.EmployeeID });
    if (!employeeLogin)
      return res.status(404).json({ message: "Employee not found in login collection" });

    // ✅ Create new task linked to Employee login _id
    const task = new Tasks({
      assignedTo: employeeLogin._id, // reference login Employee _id
      assignedBy: req.user.id, // HR _id from JWT
      title,
      description,
      deadline,
      status,
      priority: priority || "Medium",
      department: employeeHR.department,
    });

    await task.save();
    res.status(201).json({ message: "Task created successfully", task });
  } catch (err) {
    console.error("Create Task Error:", err.message);
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get all tasks created by HR
const getTasks = async (req, res) => {
  try {
    const tasks = await Tasks.find({ assignedBy: req.user.id })
      .populate("assignedTo", "name EmployeeID"); // get name + EmployeeID

    const tasksWithInfo = await Promise.all(
      tasks.map(async (task) => {
        const hrData = await EmployeeHR.findOne({
          EmployeeID: task.assignedTo?.EmployeeID,
        });

        return {
          _id: task._id,
          title: task.title,
          description: task.description || "-",
          assignedTo: task.assignedTo ? task.assignedTo.name : "Unknown",
          department: hrData ? hrData.department : "-",
          status: task.status || "-",
          priority: task.priority || "Medium",
          deadline: task.deadline
            ? new Date(task.deadline).toLocaleDateString()
            : "-",
        };
      })
    );

    res.status(200).json(tasksWithInfo);
  } catch (err) {
    console.error("Get Tasks Error:", err.message);
    res.status(500).json({ message: err.message });
  }
};

// ✅ Filter tasks (by employee, status)
const getTasksByFilter = async (req, res) => {
  try {
    const { employeeId, status } = req.query;
    const query = { assignedBy: req.user.id };

    if (employeeId) query.assignedTo = employeeId;
    if (status) query.status = status;

    const tasks = await Tasks.find(query).populate("assignedTo", "name EmployeeID");

    const tasksWithInfo = await Promise.all(
      tasks.map(async (task) => {
        const hrData = await EmployeeHR.findOne({
          EmployeeID: task.assignedTo?.EmployeeID,
        });

        return {
          _id: task._id,
          title: task.title,
          description: task.description || "-",
          assignedTo: task.assignedTo ? task.assignedTo.name : "Unknown",
          department: hrData ? hrData.department : "-",
          status: task.status || "-",
          priority: task.priority || "Medium",
          deadline: task.deadline
            ? new Date(task.deadline).toLocaleDateString()
            : "-",
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

    res.status(200).json({ message: "Task updated successfully", task });
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

module.exports = {
  createTask,
  getTasks,
  getTasksByFilter,
  updateTask,
  deleteTask,
};
