const express = require("express");
const router = express.Router();
const { getMyTasks, updateMyTaskStatus } = require("../Controllers/tasksCon-emp");
const verifyEmployee = require("../middleware/verifyEmployees"); 

router.get("/", verifyEmployee, getMyTasks);
router.put("/:id/status", verifyEmployee, updateMyTaskStatus);

module.exports = router;
