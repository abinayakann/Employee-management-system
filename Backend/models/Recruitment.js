const mongoose = require("mongoose");

// Candidate subdocument schema
const candidateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  resume: { type: String }, // File name or URL
  status: {
    type: String,
    enum: ["Applied", "Interview", "Hired", "Rejected"],
    default: "Applied",
  },
  appliedAt: { type: Date, default: Date.now },
});

// Recruitment schema
const recruitmentSchema = new mongoose.Schema({
  jobTitle: { type: String, required: true }, // Title of job post
  department: { type: String, required: true },
  description: { type: String },
  postedBy: { type: String, required: true }, // HR/Admin name or ID
  createdAt: { type: Date, default: Date.now },
  candidates: [candidateSchema], // Array of candidates
});

// Create model
const Recruitment = mongoose.model("Recruitment", recruitmentSchema);

module.exports = Recruitment;
