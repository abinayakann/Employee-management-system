import React, { useState, useEffect } from "react";
import axios from "axios";
import "./dashpagehr.css";

const HRAttendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;

  const token = localStorage.getItem("token");

  const fetchAttendance = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/hr/attendancehr", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAttendance(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  // Filter attendance records
  const filteredAttendance = attendance.filter((record) => {
    const employeeName = record.employeeId?.name || "";
    const status = record.status || "";

    const matchesSearch = employeeName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || status === statusFilter;
    const matchesDate =
      dateFilter === "" ||
      new Date(record.date).toISOString().split("T")[0] === dateFilter;

    return matchesSearch && matchesStatus && matchesDate;
  });

  // Pagination
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredAttendance.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredAttendance.length / recordsPerPage);

  return (
    <div className="page">
      <h2>HR Attendance Dashboard</h2>

      {/* Filters */}
      <div className="filters">
        <input
          type="text"
          placeholder="Search by employee..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="All">All Status</option>
          <option value="Present">Present</option>
          <option value="Absent">Absent</option>
          <option value="Leave">Leave</option>
          <option value="Late">Late</option>
        </select>
        <input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} />
      </div>

      {/* Attendance Table */}
      <table className="table">
        <thead>
          <tr>
            <th>Employee</th>
            <th>Date</th>
            <th>Status</th>
            <th>Check In</th>
            <th>Check Out</th>
            <th>Working Hours</th>
            <th>Remarks</th>
          </tr>
        </thead>
        <tbody>
          {currentRecords.length > 0 ? (
            currentRecords.map((record) => (
              <tr key={record._id}>
                <td>{record.employeeId?.name || "-"}</td>
                <td>{new Date(record.date).toLocaleDateString()}</td>
                <td>{record.status || "-"}</td>
                <td>{record.checkIn || "-"}</td>
                <td>{record.checkOut || "-"}</td>
                <td>{record.workingHours || "-"}</td>
                <td>{record.remarks || "-"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" style={{ textAlign: "center" }}>
                No records found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentPage(idx + 1)}
              className={currentPage === idx + 1 ? "active-page" : ""}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default HRAttendance;
