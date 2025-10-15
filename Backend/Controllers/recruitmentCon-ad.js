const RecruitmentAd = require("../models/Recruitment");

// ✅ Get all jobs with candidate count
const getAllJobs = async (req, res) => {
  try {
    const jobs = await RecruitmentAd.find().lean();
    const jobsWithCount = jobs.map((job) => ({
      ...job,
      candidateCount: job.candidates.length,
    }));
    res.status(200).json(jobsWithCount);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get all candidates across all jobs
const getAllCandidates = async (req, res) => {
  try {
    const jobs = await RecruitmentAd.find().lean();
    // Flatten candidates with job info
    const candidates = jobs.flatMap((job) =>
      job.candidates.map((candidate) => ({
        ...candidate,
        jobTitle: job.jobTitle,
        jobId: job._id,
      }))
    );
    res.status(200).json(candidates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Approve / Reject Candidate
const updateCandidateStatus = async (req, res) => {
  try {
    const { jobId, candidateId } = req.params;
    const { status } = req.body; // "Approved" or "Rejected"

    const job = await RecruitmentAd.findById(jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });

    const candidate = job.candidates.id(candidateId);
    if (!candidate)
      return res.status(404).json({ message: "Candidate not found" });

    candidate.status = status;
    await job.save();

    res.status(200).json(candidate);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllJobs,
  getAllCandidates,
  updateCandidateStatus,
};
