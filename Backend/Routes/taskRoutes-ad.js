const express = require("express");
const { getAllTasks } = require("../Controllers/tasksCon-ad");

const verifyAdmin = require("../middleware/verifyAdmin");

const router = express.Router();

router.get("/", verifyAdmin, getAllTasks); 

module.exports = router;
