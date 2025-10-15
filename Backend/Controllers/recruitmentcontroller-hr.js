const Recruitmenthr = require("../models/Recruitment");

// ✅ Create a new job
const createJob = async (req, res) => {
  try {
    const { jobTitle, department, description } = req.body;

    const job = new Recruitmenthr({
      jobTitle,
      department,
      description,
      postedBy: "HR",
    });

    await job.save();
    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: "Error creating job", error: error.message });
  }
};

// ✅ Get all jobs
const getJobs = async (req, res) => {
  try {
    const jobs = await Recruitmenthr.find();
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching jobs", error: error.message });
  }
};


// ✅ Delete a job
const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedJob = await Recruitmenthr.findByIdAndDelete(id);

    if (!deletedJob) return res.status(404).json({ message: "Job not found" });
    res.status(200).json({ message: "Job deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting job", error: error.message });
  }
};

// ✅ Add a candidate to a job
const addCandidate = async (req, res) => {
  try {
    const { id } = req.params; // job id
    const { name, email, resume } = req.body;

    const job = await Recruitmenthr.findById(id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    job.candidates.push({ name, email, resume });
    await job.save();

    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: "Error adding candidate", error: error.message });
  }
};

// ✅ Update candidate status
const updateCandidateStatus = async (req, res) => {
  try {
    const { jobId, candidateId } = req.params;
    const { status } = req.body;

    const job = await Recruitmenthr.findById(jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });

    const candidate = job.candidates.id(candidateId);
    if (!candidate) return res.status(404).json({ message: "Candidate not found" });

    candidate.status = status;
    await job.save();

    res.status(200).json(candidate);
  } catch (error) {
    res.status(500).json({ message: "Error updating candidate status", error: error.message });
  }
};

// ✅ Delete a candidate
const deleteCandidate = async (req, res) => {
  try {
    const { jobId, candidateId } = req.params;

    const job = await Recruitmenthr.findById(jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });

    job.candidates.id(candidateId).remove();
    await job.save();

    res.status(200).json({ message: "Candidate removed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error removing candidate", error: error.message });
  }
};

module.exports = {
  createJob,
  getJobs,
  deleteJob,
  addCandidate,
  updateCandidateStatus,
  deleteCandidate
};
