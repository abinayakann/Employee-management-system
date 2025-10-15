import React, { useState, useEffect } from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  FaUser,
  FaMoneyCheckAlt,
  FaClipboardList,
  FaTasks,
  FaBars,
  FaTimes,
  FaMoon,
  FaSun,
  FaHome,
} from "react-icons/fa";
import "./EmployeeDashboard.css";

const EmployeeDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [theme, setTheme] = useState("light");
  const [employeeName, setEmployeeName] = useState("Employee");

  useEffect(() => {
    const name = localStorage.getItem("employeeName");
    if (name) setEmployeeName(name);
  }, []);

  useEffect(() => {
    const savedTheme = localStorage.getItem("employee-dashboard-theme");
    if (savedTheme) setTheme(savedTheme);
    else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setTheme(prefersDark ? "dark" : "light");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("employee-dashboard-theme", theme);
  }, [theme]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

  return (
    <div
      className={`employee-dashboard ${
        isSidebarOpen ? "sidebar-open" : "sidebar-closed"
      } ${theme}-theme`}
    >
      {/* Sidebar */}
      <aside className={`sidebar ${isSidebarOpen ? "open" : "closed"}`}>
        <div className="sidebar-header">
          <button className="toggle-btn" onClick={toggleSidebar}>
            {isSidebarOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {isSidebarOpen && (
          <div className="profile">
            <FaUser className="profile-pic" />
            <h3>{employeeName}</h3>
            <p className="tagline">Welcome back!</p>
          </div>
        )}

        <ul className="menu">
          <li>
            <NavLink to="/employee-dashboard" end>
              <FaHome /> {isSidebarOpen && "Home"}
            </NavLink>
          </li>
          <li>
            <NavLink to="/employee-dashboard/attendanceEmp">
              <FaClipboardList /> {isSidebarOpen && "My Attendance"}
            </NavLink>
          </li>
          <li>
            <NavLink to="/employee-dashboard/tasks">
              <FaTasks /> {isSidebarOpen && "My Tasks"}
            </NavLink>
          </li>
          <li>
            <NavLink to="/employee-dashboard/payrollemp">
              <FaMoneyCheckAlt /> {isSidebarOpen && "My Payroll"}
            </NavLink>
          </li>
          <li>
            <NavLink to="/employee-dashboard/profileEmp">
              <FaUser /> {isSidebarOpen && "My Profile"}
            </NavLink>
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="topbar">
          <h2>Employee Dashboard</h2>
          <button className="theme-toggle-btn" onClick={toggleTheme}>
            {theme === "light" ? <FaMoon /> : <FaSun />}
          </button>
        </header>

        <section className="content-area">
          <Outlet />
        </section>

        <footer className="footer">
          <p>© {new Date().getFullYear()} Employee Management System</p>
        </footer>
      </main>
    </div>
  );
};

export default EmployeeDashboard;
