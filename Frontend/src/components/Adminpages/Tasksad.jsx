import React, { useEffect, useState } from "react";
import axios from "axios";
import "./TasksAd.css";

const TasksAd = ({ theme = "light" }) => {
  const [summary, setSummary] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, [search]);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`http://localhost:5000/api/admin/tasks?search=${search}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const tasksData = res.data.tasks || res.data;
      setTasks(tasksData);

      setSummary({
        totalTasks: tasksData.length,
        completed: tasksData.filter((t) => t.status === "Completed").length,
        pending: tasksData.filter((t) => t.status === "Pending").length,
        overdue: tasksData.filter(
          (t) => t.status === "Pending" && new Date(t.deadline) < new Date()
        ).length,
      });
    } catch (err) {
      console.error("Error fetching tasks", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`admin-tasks ${theme}-theme`}>
      <h2 className="page-title">Admin Task Dashboard</h2>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="card total-tasks">
          <h4>Total Tasks</h4>
          <p>{summary?.totalTasks ?? "—"}</p>
        </div>
        <div className="card completed">
          <h4>Completed</h4>
          <p>{summary?.completed ?? "—"}</p>
        </div>
        <div className="card pending">
          <h4>Pending</h4>
          <p>{summary?.pending ?? "—"}</p>
        </div>
        {/* <div className="card overdue">
          <h4>Overdue</h4>
          <p>{summary?.overdue ?? "—"}</p>
        </div> */}
      </div>

      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="🔍 Search by task title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Task Table */}
      <div className="table-wrapper">
        {loading ? (
          <p className="loading-text">Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <p className="no-tasks">No tasks found</p>
        ) : (
          <table className="task-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Assigned To</th>
                <th>Department</th>
                <th>Assigned By</th>
                <th>Deadline</th>
                <th>Priority</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task, index) => (
                <tr
                  key={task._id}
                  className={index % 2 === 0 ? "even-row" : "odd-row"}
                >
                  <td>{task.title || "—"}</td>
                  <td>
                    {task.assignedTo?.name
                      ? `${task.assignedTo.name} (${task.assignedTo.EmployeeID})`
                      : "—"}
                  </td>
                  <td>{task.department || "—"}</td>
                  <td>{task.assignedBy?.HrID || "—"}</td>
                  <td>
                    {task.deadline
                      ? new Date(task.deadline).toLocaleDateString()
                      : "—"}
                  </td>
                  <td>{task.priority || "—"}</td>
                  <td>
                    <span
                      className={`badge ${task.status
                        ?.replace(/\s+/g, "-")
                        .toLowerCase()}`}
                    >
                      {task.status || "—"}
                    </span>
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

export default TasksAd;
