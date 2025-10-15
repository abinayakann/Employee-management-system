import React, { useEffect, useState } from "react";
import axios from "axios";
import "./payrollhr.css";

const PayrollHR = () => {
  const [payrolls, setPayrolls] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const getToken = () => {
    const token = localStorage.getItem("token");
    return token ? token.replace(/"/g, "") : null;
  };

  const fetchPayrolls = async () => {
    try {
      const token = getToken();
      const res = await axios.get("http://localhost:5000/api/hr/payrollhr", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPayrolls(res.data);
    } catch (err) {
      console.error("Error fetching payrolls:", err);
    }
  };

  useEffect(() => {
    fetchPayrolls();
  }, []);

  const handleDownload = async (id) => {
    try {
      const token = getToken();
      const res = await axios.get(
        `http://localhost:5000/api/hr/payrollhr/download/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob",
        }
      );
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Payslip_${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Error downloading payslip:", err);
    }
  };

  const handleMarkPaid = async (id) => {
    try {
      const token = getToken();
      await axios.put(
        `http://localhost:5000/api/hr/payrollhr/${id}`,
        { status: "Paid" },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setPayrolls((prev) =>
        prev.map((p) => (p._id === id ? { ...p, status: "Paid" } : p))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const filteredPayrolls = payrolls.filter((p) => {
    const name = p.employeeId?.name || "";
    const dept = p.department || "";
    const status = p.status || "Pending";
    return (
      (name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dept.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (statusFilter === "All" || status === statusFilter)
    );
  });

  return (
    <div className="payroll-container">
      <h2 className="payroll-title">HR Payroll Management</h2>

      <div className="filter-bar">
        <input
          type="text"
          placeholder="🔍 Search employee or department..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="filter-select"
        >
          <option value="All">All</option>
          <option value="Paid">Paid</option>
          <option value="Pending">Pending</option>
        </select>
      </div>

      <table className="payroll-table">
        <thead>
          <tr>
            <th>Employee Name</th>
            <th>Department</th>
            <th>Status</th>
            <th style={{ textAlign: "center" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredPayrolls.map((p) => (
            <tr key={p._id}>
              <td>{p.employeeId?.name}</td>
              <td>{p.department}</td>
              <td>
                <span
                  className={`status ${
                    p.status === "Paid" ? "paid" : "pending"
                  }`}
                >
                  {p.status}
                </span>
              </td>
              <td className="action-buttons">
                {p.status !== "Paid" && (
                  <button
                    className="mark-paid-btn"
                    onClick={() => handleMarkPaid(p._id)}
                  >
                    Mark Paid
                  </button>
                )}
                <button
                  className="download-btn"
                  onClick={() => handleDownload(p._id)}
                >
                  Download
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PayrollHR;
