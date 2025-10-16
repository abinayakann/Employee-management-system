import React, { useState, useEffect } from "react";
import API from "../../services/api";
import "./dashpagehr.css";

const Listhr = () => {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All");

  // Form states for add/update
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

  const [editingId, setEditingId] = useState(null);

  // Fetch employees
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.get("/hr/employeehr", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmployees(res.data);
    } catch (err) {
      console.error("Error fetching employees:", err);
    }
  };

  // Add or Update employee (with optimistic UI update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      if (editingId) {
        const res = await API.put(`/hr/employeehr/${editingId}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Update the employee locally
        setEmployees((prev) =>
          prev.map((emp) => (emp._id === editingId ? res.data : emp))
        );
      } else {
        const res = await API.post("/hr/employeehr", formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Add the new employee immediately
        setEmployees((prev) => [...prev, res.data]);
      }

      // Reset form
      setFormData({
        name: "",
        department: "",
        designation: "",
        salary: "",
        email: "",
        phone: "",
        dob: "",
        address: "",
      });
      setEditingId(null);
    } catch (err) {
      console.error("Error saving employee:", err);
    }
  };

  // Delete employee
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await API.delete(`/hr/employeehr/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmployees((prev) => prev.filter((emp) => emp._id !== id));
    } catch (err) {
      console.error("Error deleting employee:", err);
    }
  };

  // Edit employee
  const handleEdit = (emp) => {
    setFormData(emp);
    setEditingId(emp._id);
  };

  // Apply filters
  const filteredEmployees = employees.filter(
    (emp) =>
      (departmentFilter === "All" || emp.department === departmentFilter) &&
      (emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.department.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="page">
      <h2>Employee List</h2>
      <p>Manage employees (Add, Edit, Delete)</p>

      {/* Form */}
      <form className="employee-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Department"
          value={formData.department}
          onChange={(e) =>
            setFormData({ ...formData, department: e.target.value })
          }
          required
        />
        <input
          type="text"
          placeholder="Designation"
          value={formData.designation}
          onChange={(e) =>
            setFormData({ ...formData, designation: e.target.value })
          }
          required
        />
        <input
          type="number"
          placeholder="Salary"
          value={formData.salary}
          onChange={(e) =>
            setFormData({ ...formData, salary: e.target.value })
          }
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) =>
            setFormData({ ...formData, email: e.target.value })
          }
          required
        />
        <input
          type="text"
          placeholder="Phone"
          value={formData.phone}
          onChange={(e) =>
            setFormData({ ...formData, phone: e.target.value })
          }
        />
        <input
          type="date"
          placeholder="DOB"
          value={formData.dob ? formData.dob.split("T")[0] : ""}
          onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
        />
        <input
          type="text"
          placeholder="Address"
          value={formData.address}
          onChange={(e) =>
            setFormData({ ...formData, address: e.target.value })
          }
        />
        <button type="submit">{editingId ? "Update" : "Add"} Employee</button>
      </form>

      {/* Filters */}
      <div className="filters">
        <input
          type="text"
          placeholder="Search employees..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
        >
          <option value="All">All Departments</option>
          <option value="IT">IT</option>
          <option value="Finance">Finance</option>
          <option value="HR">HR</option>
          <option value="Marketing">Marketing</option>
        </select>
      </div>

      {/* Employee Cards */}
      <div className="employee-cards">
        {filteredEmployees.length > 0 ? (
          filteredEmployees.map((emp) => (
            <div className="employee-card" key={emp._id}>
              <h3>{emp.name}</h3>
              <p>
                <strong>Department:</strong> {emp.department}
              </p>
              <p>
                <strong>Designation:</strong> {emp.designation}
              </p>
              <p>
                <strong>Salary:</strong> ${emp.salary}
              </p>
              <p>
                <strong>Email:</strong> {emp.email}
              </p>
              <p>
                <strong>Phone:</strong> {emp.phone}
              </p>
              <p>
                <strong>DOB:</strong>{" "}
                {emp.dob ? new Date(emp.dob).toLocaleDateString() : "-"}
              </p>
              <p>
                <strong>Address:</strong> {emp.address}
              </p>
              <div className="card-actions">
                <button onClick={() => handleEdit(emp)}>Edit</button>
                <button onClick={() => handleDelete(emp._id)}>Delete</button>
              </div>
            </div>
          ))
        ) : (
          <p>No employees found</p>
        )}
      </div>
    </div>
  );
};

export default Listhr;
