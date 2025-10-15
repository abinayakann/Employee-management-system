const express = require("express");
const {
  createJob,
  getJobs,
  deleteJob,
  addCandidate,
  updateCandidateStatus,
  deleteCandidate
} = require("../Controllers/recruitmentcontroller-hr");

const router = express.Router();

// Job routes
router.post("/", createJob);         
router.get("/", getJobs);                  
router.delete("/:id", deleteJob);    

// Candidate routes
router.post("/:id/candidates", addCandidate);                        
router.put("/:jobId/candidate/:candidateId", updateCandidateStatus); 
router.delete("/:jobId/candidate/:candidateId", deleteCandidate);    

module.exports = router;
