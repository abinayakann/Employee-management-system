import React, { useEffect, useState } from "react";
import API from "../../services/api";
import "./AdminRecruitmentpage.css";

const AdminRecruitment = ({ theme = "dark" }) => {
  const [jobs, setJobs] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token")?.replace(/"/g, "");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const jobRes = await API.get("/admin/recruitment/jobs", { headers: { Authorization: `Bearer ${token}` } });
        const candidateRes = await API.get("/admin/recruitment/candidates", { headers: { Authorization: `Bearer ${token}` } });

        setJobs(Array.isArray(jobRes.data) ? jobRes.data : []);
        setCandidates(Array.isArray(candidateRes.data) ? candidateRes.data : []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const updateStatus = async (jobId, candidateId, status) => {
    try {
      await API.put(
        `/admin/recruitment/jobs/${jobId}/candidates/${candidateId}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCandidates(prev => prev.map(c => c._id === candidateId ? { ...c, status } : c));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className={`loading ${theme}`}>Loading Recruitment Data...</div>;

  return (
    <div className={`admin-recruitment ${theme}-theme`}>
      <h2 className="page-title">📌 Recruitment Overview</h2>

      {/* Jobs Section */}
      <section className="jobs-section">
        <h3>Job Openings</h3>
        <div className="jobs-grid">
          {jobs.length === 0 ? <p className="no-data">No job openings available</p> :
            jobs.map(job => (
              <div key={job._id} className="job-card">
                <h4>{job.jobTitle}</h4>
                <p><strong>Department:</strong> {job.department}</p>
                <p className="desc">{job.description}</p>
                <p className="candidate-count">Candidates: <span>{job.candidateCount || 0}</span></p>
                <small className="posted">Posted by: {job.postedBy}</small>
              </div>
            ))
          }
        </div>
      </section>

      {/* Candidates Section */}
      <section className="candidates-section">
        <h3>Candidates</h3>
        {candidates.length === 0 ? <p className="no-data">No candidates applied yet</p> :
          <div className="table-wrapper">
            <table className="candidates-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Job</th>
                  <th>Status</th>
                  <th>Applied At</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {candidates.map(c => (
                  <tr key={c._id}>
                    <td>{c.name}</td>
                    <td>{c.email}</td>
                    <td>{c.jobTitle || "Unknown"}</td>
                    <td><span className={`status ${c.status.toLowerCase()}`}>{c.status}</span></td>
                    <td>{new Date(c.appliedAt).toLocaleDateString()}</td>
                    <td>
                      <button className="approve-btn" onClick={() => updateStatus(c.jobId, c._id, "Hired")}>Approve</button>
                      <button className="reject-btn" onClick={() => updateStatus(c.jobId, c._id, "Rejected")}>Reject</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        }
      </section>
    </div>
  );
};

export default AdminRecruitment;
