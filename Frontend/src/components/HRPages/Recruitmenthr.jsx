import React, { useState, useEffect } from "react";
import axios from "axios";
import "./dashpagehr.css";

const Recruitmenthr = () => {
  const [jobs, setJobs] = useState([]);
  const [jobTitle, setJobTitle] = useState("");
  const [department, setDepartment] = useState("");
  const [description, setDescription] = useState("");

  const [candidates, setCandidates] = useState([]);
  const [candidateName, setCandidateName] = useState("");
  const [candidateEmail, setCandidateEmail] = useState("");
  const [candidateJobId, setCandidateJobId] = useState("");
  const [candidateResume, setCandidateResume] = useState("");

  // Fetch Jobs
  const fetchJobs = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/hr/jobs");
      setJobs(res.data);
    } catch (err) {
      console.error("Error fetching jobs:", err);
    }
  };

  // Fetch Candidates (aggregate from all jobs)
  const fetchCandidates = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/hr/jobs");
      const allCandidates = res.data.flatMap(job =>
        job.candidates.map(c => ({ ...c, jobId: job._id }))
      );
      setCandidates(allCandidates);
    } catch (err) {
      console.error("Error fetching candidates:", err);
    }
  };

  useEffect(() => {
    fetchJobs();
    fetchCandidates();
  }, []);

  // Add Job
  const handleAddJob = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/hr/jobs", {
        jobTitle,
        department,
        description,
        postedBy: "HR", // replace with actual HR user info if needed
      });
      setJobs([...jobs, res.data]);
      setJobTitle("");
      setDepartment("");
      setDescription("");
    } catch (err) {
      console.error("Error adding job:", err);
    }
  };

  // Add Candidate
  const handleAddCandidate = async (e) => {
    e.preventDefault();
    if (!candidateJobId) return alert("Please select a job");

    try {
      const res = await axios.post(
        `http://localhost:5000/api/hr/jobs/${candidateJobId}/candidates`,
        {
          name: candidateName,
          email: candidateEmail,
          resume: candidateResume,
        }
      );
      setCandidates([...candidates, { ...res.data, jobId: candidateJobId }]);
      setCandidateName("");
      setCandidateEmail("");
      setCandidateJobId("");
      setCandidateResume("");
    } catch (err) {
      console.error("Error adding candidate:", err);
    }
  };

  // Update Candidate Status
  const updateCandidateStatus = async (jobId, candidateId, status) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/hr/jobs/${jobId}/candidate/${candidateId}`,
        { status }
      );
      setCandidates(candidates.map(c =>
        c._id === candidateId ? { ...res.data, jobId } : c
      ));
    } catch (err) {
      console.error("Error updating candidate status:", err);
    }
  };

  // Delete Job
  const deleteJob = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/hr/jobs/${id}`);
      setJobs(jobs.filter(j => j._id !== id));
      setCandidates(candidates.filter(c => c.jobId !== id));
    } catch (err) {
      console.error("Error deleting job:", err);
    }
  };

  // Delete Candidate
  const deleteCandidate = async (jobId, candidateId) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/hr/jobs/${jobId}/candidate/${candidateId}`
      );
      setCandidates(candidates.filter(c => c._id !== candidateId));
    } catch (err) {
      console.error("Error deleting candidate:", err);
    }
  };

  return (
    <div className="page">
      <h2>Recruitment Management</h2>
      <p>Manage job openings, applicants, and hiring stages.</p>

      {/* Add Job Form */}
      <h3>Add New Job</h3>
      <form onSubmit={handleAddJob} className="filters">
        <input
          type="text"
          placeholder="Job Title"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Department"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button type="submit" className="download-btn">
          Add Job
        </button>
      </form>

      {/* Jobs List */}
      <h3>Open Positions</h3>
      <ul>
        {jobs.map((job) => (
          <li key={job._id}>
            {job.jobTitle} - {job.department}{" "}
            <button
              onClick={() => deleteJob(job._id)}
              className="download-btn"
              style={{ backgroundColor: "#f44336" }}
            >
              Delete
            </button>
          </li>
        ))}
        {jobs.length === 0 && <li>No jobs available</li>}
      </ul>

      {/* Add Candidate Form */}
      <h3>Add Candidate</h3>
      <form onSubmit={handleAddCandidate} className="filters">
        <input
          type="text"
          placeholder="Candidate Name"
          value={candidateName}
          onChange={(e) => setCandidateName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Candidate Email"
          value={candidateEmail}
          onChange={(e) => setCandidateEmail(e.target.value)}
          required
        />
        <select
          value={candidateJobId}
          onChange={(e) => setCandidateJobId(e.target.value)}
          required
        >
          <option value="">Select Job</option>
          {jobs.map((job) => (
            <option key={job._id} value={job._id}>
              {job.jobTitle} - {job.department}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Resume URL or filename"
          value={candidateResume}
          onChange={(e) => setCandidateResume(e.target.value)}
        />
        <button type="submit" className="download-btn">
          Add Candidate
        </button>
      </form>

      {/* Candidates List */}
      <h3>Applicants</h3>
      <ul>
        {candidates.map((c) => (
          <li key={`${c.jobId}-${c._id}`}>
            {c.name} - Applied for{" "}
            {jobs.find((job) => job._id === c.jobId)?.jobTitle || "Unknown Job"} (
            <select
              value={c.status}
              onChange={(e) =>
                updateCandidateStatus(c.jobId, c._id, e.target.value)
              }
            >
              <option value="Applied">Applied</option>
              <option value="Interview">Interview</option>
              <option value="Hired">Hired</option>
              <option value="Rejected">Rejected</option>
            </select>
            )
            <button
              onClick={() => deleteCandidate(c.jobId, c._id)}
              className="download-btn"
              style={{ backgroundColor: "#f44336", marginLeft: "8px" }}
            >
              Delete
            </button>
          </li>
        ))}
        {candidates.length === 0 && <li>No applicants yet</li>}
      </ul>
    </div>
  );
};

export default Recruitmenthr;
