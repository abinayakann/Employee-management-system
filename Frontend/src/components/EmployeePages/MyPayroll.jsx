import React, { useEffect, useState } from "react";
import axios from "axios";

const EmployeePayroll = () => {
  const [payrolls, setPayrolls] = useState([]);
  const [error, setError] = useState("");

  const getToken = () => {
    const token = localStorage.getItem("token");
    return token ? token.replace(/"/g, "") : null;
  };

  const fetchPayroll = async () => {
    try {
      const token = getToken();
      if (!token) throw new Error("No token found. Please login again.");

      const res = await axios.get(
        "http://localhost:5000/api/employee/payrollemp/my",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPayrolls(res.data);
    } catch (err) {
      console.error("Error fetching payroll:", err);
      setError(err.response?.data?.message || err.message);
    }
  };

  useEffect(() => {
    fetchPayroll();
  }, []);

  const handleDownload = async (id, month) => {
    try {
      const token = getToken();
      const res = await axios.get(
        `http://localhost:5000/api/employee/payrollemp/download/${id}`,
        { headers: { Authorization: `Bearer ${token}` }, responseType: "blob" }
      );
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Payslip_${month}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Error downloading payslip:", err);
      alert(err.response?.data?.message || "Failed to download payslip");
    }
  };

  return (
    <div style={{ color: "#fff", background: "#1e1e2f", minHeight: "100vh", padding: "20px", textAlign: "center" }}>
      <h2>My Payroll</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {payrolls.length === 0 ? (
        <p>No payroll records found.</p>
      ) : (
        <table style={{ margin: "20px auto", borderCollapse: "collapse", width: "90%", background: "#2a2a40" }}>
          <thead>
            <tr style={{ background: "#333" }}>
              <th style={thStyle}>Month</th>
              <th style={thStyle}>Base Salary</th>
              <th style={thStyle}>Bonus</th>
              <th style={thStyle}>Deductions</th>
              <th style={thStyle}>Net Salary</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Download</th>
            </tr>
          </thead>
          <tbody>
            {payrolls.map((p) => (
              <tr key={p._id} style={{ borderBottom: "1px solid #444" }}>
                <td style={tdStyle}>{p.month}</td>
                <td style={tdStyle}>₹{p.baseSalary}</td>
                <td style={tdStyle}>₹{p.bonus}</td>
                <td style={tdStyle}>₹{p.deductions}</td>
                <td style={tdStyle}>₹{p.netSalary}</td>
                <td style={{ ...tdStyle, color: p.status === "Paid" ? "lightgreen" : "orange" }}>{p.status}</td>
                <td style={tdStyle}>
                  <button style={btnStyle} onClick={() => handleDownload(p._id, p.month)}>Download</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

const thStyle = { padding: "10px", border: "1px solid #555" };
const tdStyle = { padding: "8px", border: "1px solid #555" };
const btnStyle = { background: "#4CAF50", color: "#fff", border: "none", padding: "6px 12px", cursor: "pointer", borderRadius: "4px" };

export default EmployeePayroll;
