const express = require("express");
const { 
  createTask, 
  getTasks, 
  getTasksByFilter, 
  updateTask, 
  deleteTask 
} = require ("../Controllers/taskscontroller-hr");

const verifyHR = require("../middleware/verifyHr");

const router = express.Router();

// CRUD routes
router.post("/", verifyHR, createTask);           
router.get("/", verifyHR, getTasks);             
router.get("/filter", verifyHR, getTasksByFilter); 
router.put("/:id", verifyHR, updateTask);        
router.delete("/:id", verifyHR, deleteTask);     

module.exports = router;
