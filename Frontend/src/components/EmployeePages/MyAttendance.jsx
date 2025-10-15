import React, { useEffect, useState } from "react";
import axios from "axios";
import "./attendance.css";

const EmployeeAttendance = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkInDone, setCheckInDone] = useState(false);
  const [checkOutDone, setCheckOutDone] = useState(false);

  const token = localStorage.getItem("token");

  const fetchAttendance = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/employee/attendance/my",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRecords(res.data);

      // Check today's record
      const today = new Date().toLocaleDateString();
      const todayRecord = res.data.find(
        (r) => new Date(r.date).toLocaleDateString() === today
      );

      if (todayRecord) {
        setCheckInDone(true);
        setCheckOutDone(todayRecord.checkOut && todayRecord.checkOut !== "-");
      } else {
        setCheckInDone(false);
        setCheckOutDone(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  const handleCheckIn = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/employee/attendance/checkin",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("✅ Checked in successfully!");
      fetchAttendance();
    } catch (err) {
      alert(err.response?.data?.message || "Check-in failed");
    }
  };

  const handleCheckOut = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/employee/attendance/checkout",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("✅ Checked out successfully!");
      fetchAttendance();
    } catch (err) {
      alert(err.response?.data?.message || "Check-out failed");
    }
  };

  const formatWorkingHours = (wh) => {
    if (!wh || wh.includes("NaN")) return "-";
    return wh;
  };

  return (
    <div className="employee-attendance">
      <h2>📅 My Attendance</h2>

      <div className="button-group">
        <button className="checkin" onClick={handleCheckIn} disabled={checkInDone}>
          {checkInDone ? "Checked In" : "Mark Check-In"}
        </button>
        <button
          className="checkout"
          onClick={handleCheckOut}
          disabled={!checkInDone || checkOutDone}
        >
          {checkOutDone ? "Checked Out" : "Mark Check-Out"}
        </button>
      </div>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : records.length === 0 ? (
        <p className="text-center">No attendance records found.</p>
      ) : (
        <div className="cards-container">
          {records.map((rec) => (
            <div key={rec._id} className={`attendance-card ${rec.status.toLowerCase()}`}>
              <h3>{new Date(rec.date).toLocaleDateString()}</h3>
              <p className="status">
                Status: <span>{rec.status}</span>
              </p>
              <p>Check In: {rec.checkIn || "-"}</p>
              <p>Check Out: {rec.checkOut || "-"}</p>
              <p>Working Hours: {formatWorkingHours(rec.workingHours)}</p>
              <p>Remarks: {rec.remarks || "-"}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EmployeeAttendance;
