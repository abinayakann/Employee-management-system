import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "./AdminAttendance.css";

const AdminAttendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("All");

  useEffect(() => {
    fetch("http://localhost:5000/api/admin/attendancead")
      .then((res) => res.json())
      .then((data) => setAttendance(data));
  }, []);

  // Filter & compute working hours
  const filteredData = attendance
    .map((record) => {
      let workingHours = "-";
      let remarks = "-";
      if (record.checkIn && record.checkOut) {
        const checkInTime = new Date(`1970-01-01T${record.checkIn}`);
        const checkOutTime = new Date(`1970-01-01T${record.checkOut}`);
        workingHours = ((checkOutTime - checkInTime) / 1000 / 60 / 60).toFixed(2);
      }

      switch (record.status) {
        case "Late":
          remarks = "Arrived late";
          break;
        case "Leave":
          remarks = "On leave";
          break;
        case "Absent":
          remarks = "Absent";
          break;
        case "Present":
          remarks = "On time";
          break;
        default:
          remarks = "-";
      }

      return { ...record, workingHours, remarks };
    })
    .filter((record) => {
      const month = new Date(record.date).toLocaleString("default", { month: "short" });
      return selectedMonth === "All" || month === selectedMonth;
    });

  // Stats
  const totalPresent = filteredData.filter((a) => a.status === "Present").length;
  const totalAbsent = filteredData.filter((a) => a.status === "Absent").length;
  const totalLate = filteredData.filter((a) => a.status === "Late").length;
  const totalLeave = filteredData.filter((a) => a.status === "Leave").length;

  // Chart data
  const monthlyData = filteredData.reduce((acc, record) => {
    const month = new Date(record.date).toLocaleString("default", { month: "short" });
    if (!acc[month]) acc[month] = { month, Present: 0, Absent: 0, Late: 0, Leave: 0 };
    acc[month][record.status] += 1;
    return acc;
  }, {});
  const chartData = Object.values(monthlyData);

  return (
    <div className="attendance-container">
      <h2 className="header">📊 Admin Attendance Dashboard</h2>

      {/* Month Filter */}
      <div className="filters">
        <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
          <option value="All">All Months</option>
          {["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>

      {/* Overview Cards */}
      <div className="cards-grid">
        <div className="attendance-card present">
          <i className="fas fa-user-check"></i>
          <span>Present: {totalPresent}</span>
        </div>
        <div className="attendance-card absent">
          <i className="fas fa-user-times"></i>
          <span>Absent: {totalAbsent}</span>
        </div>
        <div className="attendance-card late">
          <i className="fas fa-clock"></i>
          <span>Late: {totalLate}</span>
        </div>
        <div className="attendance-card leave">
          <i className="fas fa-plane-departure"></i>
          <span>Leave: {totalLeave}</span>
        </div>
      </div>

      {/* Chart */}
      <div className="chart-container">
        <h3>Monthly Attendance Trends</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={chartData} barCategoryGap="20%">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Present" fill="#28a745" barSize={20} />
            <Bar dataKey="Absent" fill="#dc3545" barSize={20} />
            <Bar dataKey="Late" fill="#fd7e14" barSize={20} />
            <Bar dataKey="Leave" fill="#007bff" barSize={20} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Attendance Table */}
      <table className="attendance-table">
        <thead>
          <tr>
            <th>Employee</th>
            <th>Date</th>
            <th>Status</th>
            <th>Working Hours</th>
            <th>Remarks</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((record) => (
            <tr key={record._id}>
              <td>{record.employeeId?.name || "N/A"}</td>
              <td>{new Date(record.date).toLocaleDateString()}</td>
              <td className={`status ${record.status.toLowerCase()}`}>{record.status}</td>
              <td>{record.workingHours}</td>
              <td>{record.remarks}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminAttendance;
