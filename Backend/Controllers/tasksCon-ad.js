const Task = require("../models/Tasks");
const HR = require("../models/Hr");
const Employee = require("../models/Employee")

// Admin can view all tasks
const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate("assignedTo", "name EmployeeID department") // Employee info
      .populate("assignedBy", "HrID")          // HR info
      .lean(); // optional: returns plain JS objects, safer

    res.status(200).json(tasks);
  } catch (err) {
    console.error("Admin getAllTasks error:", err.message);
    res.status(500).json({ message: "Failed to fetch tasks", error: err.message });
  }
};

module.exports = { getAllTasks };
