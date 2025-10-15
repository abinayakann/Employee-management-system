import React, { useEffect, useState } from "react";
import axios from "axios";
import "./EmployeeAdmin.css";

const AdminEmployee = ({ theme = "dark" }) => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    department: "",
    designation: "",
    salary: "",
    email: "",
    phone: "",
    dob: "",
    address: "",
  });

  const token = localStorage.getItem("token")?.replace(/"/g, "");

  const fetchEmployees = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/employees", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmployees(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEmployees(); }, []);

  const handleDelete = async (emp) => {
    if (emp.isHR) return;
    if (!window.confirm("Are you sure you want to delete this employee?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/admin/employees/${emp._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmployees(prev => prev.filter(e => e._id !== emp._id));
    } catch (err) { console.error(err); }
  };

  const handleEdit = (emp) => {
    if (emp.isHR) return;
    setEditingEmployee(emp._id);
    setFormData({
      name: emp.name,
      department: emp.department,
      designation: emp.designation,
      salary: emp.salary,
      email: emp.email,
      phone: emp.phone || "",
      dob: emp.dob ? emp.dob.slice(0, 10) : "",
      address: emp.address || "",
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        `http://localhost:5000/api/admin/employees/${editingEmployee}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEmployees(prev => prev.map(emp => emp._id === editingEmployee ? res.data : emp));
      setEditingEmployee(null);
    } catch (err) { console.error(err); }
  };

  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(search.toLowerCase()) ||
    emp.department.toLowerCase().includes(search.toLowerCase()) ||
    emp.designation.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className={`loading ${theme}`}>Loading Employees...</div>;

  return (
    <div className={`admin-employee ${theme}-theme`}>
      <h2 className="page-title">👥 Employee Management</h2>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by name, department, designation..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="table-wrapper">
        <table className="employee-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Department</th>
              <th>Designation</th>
              <th>Salary</th>
              <th>Email</th>
              <th>Phone</th>
              <th>DOB</th>
              <th>Address</th>
              <th>Type</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.length === 0 ? (
              <tr>
                <td colSpan="10" className="no-data">No employees found</td>
              </tr>
            ) : filteredEmployees.map(emp => (
              <tr key={emp._id}>
                <td>{emp.name}</td>
                <td>{emp.department}</td>
                <td>{emp.designation}</td>
                <td>₹{emp.salary || "-"}</td>
                <td>{emp.email}</td>
                <td>{emp.phone || "-"}</td>
                <td>{emp.dob ? emp.dob.slice(0, 10) : "-"}</td>
                <td>{emp.address || "-"}</td>
                <td>
                  <span className={`badge ${emp.isHR ? "hr" : "admin"}`}>
                    {emp.isHR ? "HR Employee" : "Admin Employee"}
                  </span>
                </td>
                <td className="actions">
                  {!emp.isHR ? (
                    <>
                      <button onClick={() => handleEdit(emp)}>Edit</button>
                      <button onClick={() => handleDelete(emp)} className="danger">Delete</button>
                    </>
                  ) : <span className="readonly">Readonly</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editingEmployee && (
        <div className="modal">
          <div className="modal-content">
            <h3>Edit Employee</h3>
            <form onSubmit={handleUpdate}>
              {Object.keys(formData).map(key => (
                <input
                  key={key}
                  type={key === "dob" ? "date" : key === "email" ? "email" : "text"}
                  placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                  value={formData[key]}
                  onChange={e => setFormData({ ...formData, [key]: e.target.value })}
                  required={["name","department","designation","salary","email"].includes(key)}
                />
              ))}
              <div className="modal-actions">
                <button type="submit">Save</button>
                <button type="button" onClick={() => setEditingEmployee(null)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminEmployee;
