import React, { useEffect, useState } from "react";
import API from "../../services/api";
import "./dashpagehr.css";

const Taskshr = () => {
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    employeeId: "",
    title: "",
    description: "",
    deadline: "",
    status: "Pending",
    priority: "Medium",
  });

  useEffect(() => {
    fetchEmployees();
    fetchTasks();
  }, []);

  const getToken = () => localStorage.getItem("token");

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const token = getToken();
      const res = await API.get("/hr/taskshr", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(res.data);
      setError("");
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setError("Failed to fetch tasks.");
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const token = getToken();
      const res = await API.get("/hr/employeehr", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmployees(res.data);
    } catch (err) {
      console.error("Error fetching employees:", err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = getToken();
      await API.post("/hr/taskshr", form, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setForm({
        employeeId: "",
        title: "",
        description: "",
        deadline: "",
        status: "Pending",
        priority: "Medium",
      });

      fetchTasks();
    } catch (err) {
      console.error("Error adding task:", err);
      setError("Failed to add task. Make sure you are logged in.");
    }
  };

  return (
    <div className="page">
      <h2>Task Management</h2>
      <p>Track HR-related tasks, pending approvals, and reminders here.</p>

      {/* Add Task Form */}
      <form className="form-section" onSubmit={handleSubmit}>
        <h3>Add New Task</h3>

        <label>Employee</label>
        <select
          name="employeeId"
          value={form.employeeId}
          onChange={handleChange}
          required
        >
          <option value="">Select Employee</option>
          {employees.map((emp) => (
            <option key={emp._id} value={emp._id}>
              {emp.name} ({emp.EmployeeID}) - {emp.department}
            </option>
          ))}
        </select>

        <label>Title</label>
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          required
        />

        <label>Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
        ></textarea>

        <label>Deadline</label>
        <input
          type="date"
          name="deadline"
          value={form.deadline}
          onChange={handleChange}
        />

        <label>Status</label>
        <select name="status" value={form.status} onChange={handleChange}>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>

        <button type="submit">Add Task</button>
      </form>

      {/* Task List */}
      <h3>Task List</h3>
      {loading ? (
        <p>Loading tasks...</p>
      ) : error ? (
        <p className="text-red-400">{error}</p>
      ) : tasks.length === 0 ? (
        <p>No tasks assigned yet.</p>
      ) : (
        <ul className="task-list">
          {tasks.map((task) => (
            <li key={task._id}>
              <strong>{task.title}</strong> - {task.status} <br />
              <small>
                {task.description} | Assigned to: {task.assignedTo || "Unknown"} | Department:{" "}
                {task.department || "-"} | Deadline: {task.deadline || "No deadline"}
              </small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Taskshr;
