const express = require("express");
const {
  getAllJobs,
  getAllCandidates,
  updateCandidateStatus,
} = require("../Controllers/recruitmentCon-ad");

const router = express.Router();

// Admin endpoints
router.get("/jobs", getAllJobs);
router.get("/candidates", getAllCandidates);
router.put("/jobs/:jobId/candidates/:candidateId/status", updateCandidateStatus);

module.exports = router;
