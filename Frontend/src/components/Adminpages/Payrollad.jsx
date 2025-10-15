import React, { useEffect, useState } from "react";
import API from "../../services/api";
import "./AdminPayroll.css";

const AdminPayroll = () => {
  const [payrolls, setPayrolls] = useState([]);
  const getToken = () => localStorage.getItem("token")?.replace(/"/g, "");

  useEffect(() => {
    const fetchPayrolls = async () => {
      try {
        const token = getToken();
        const res = await API.get("/admin/payroll", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPayrolls(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchPayrolls();
  }, []);

  const handleDownload = async (id) => {
    try {
      const token = getToken();
      const res = await API.get(
        `/admin/payroll/download/${id}`,
        { headers: { Authorization: `Bearer ${token}` }, responseType: "blob" }
      );

      const filename = res.headers["content-disposition"]
        ? res.headers["content-disposition"].split("filename=")[1]
        : `Payslip_${id}.pdf`;

      const url = window.URL.createObjectURL(res.data);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename.replace(/"/g, ""));
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download error:", err);
      alert("Failed to download payslip.");
    }
  };

  return (
    <div className="admin-payroll">
      <h2 className="page-title">💰 Admin Payroll Dashboard</h2>

      <div className="table-wrapper">
        {payrolls.length === 0 ? (
          <div className="no-data">No payroll data available</div>
        ) : (
          <table className="payroll-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Department</th>
                <th>Designation</th>
                <th>Month</th>
                <th>Net Salary</th>
                <th>Status</th>
                <th>Download</th>
              </tr>
            </thead>
            <tbody>
              {payrolls.map((p) => (
                <tr key={p._id}>
                    <td>{p.name}</td>
                    <td>{p.department}</td>
                    <td>{p.designation}</td>
                    <td>{p.month}</td>
                    <td>₹{p.netSalary}</td>
                  <td>
                    <span className={`status-badge ${p.status.toLowerCase()}`}>
                      {p.status}
                    </span>
                  </td>
                  <td>
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
        )}
      </div>
    </div>
  );
};

export default AdminPayroll;
