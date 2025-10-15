import React, { useState, useEffect } from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  FaUserCircle,
  FaMoneyCheckAlt,
  FaClipboardList,
  FaUsers,
  FaUserPlus,
  FaTasks,
  FaSearch,
  FaBars,
  FaTimes,
  FaMoon,
  FaSun,
} from "react-icons/fa";
import "./HRdashboard.css";

const HRdashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [theme, setTheme] = useState("light");
  const [searchTerm, setSearchTerm] = useState("");

  // Load theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem("hr-dashboard-theme");
    if (savedTheme) setTheme(savedTheme);
    else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setTheme(prefersDark ? "dark" : "light");
    }
  }, []);

  // Save theme to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("hr-dashboard-theme", theme);
  }, [theme]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

  return (
    <div className={`hr-dashboard ${isSidebarOpen ? "sidebar-open" : "sidebar-closed"} ${theme}-theme`}>
      {/* Sidebar */}
      <aside className={`sidebar ${isSidebarOpen ? "open" : "closed"}`}>
        <div className="sidebar-header">
          <button className="toggle-btn" onClick={toggleSidebar}>
            {isSidebarOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {isSidebarOpen && (
          <div className="profile">
            <FaUserCircle className="profile-pic" />
            <h3>HR Manager</h3>
            <p className="tagline">Welcome Back 👋</p>
          </div>
        )}

        <ul className="menu">
          <li>
            <NavLink to="/hr-dashboard">
              <FaUsers /> {isSidebarOpen && "Home"}
            </NavLink>
          </li>
          <li>
            <NavLink to="/hr-dashboard/payrollhr">
              <FaMoneyCheckAlt /> {isSidebarOpen && "Payroll"}
            </NavLink>
          </li>
          <li>
            <NavLink to="/hr-dashboard/attendancehr">
              <FaClipboardList /> {isSidebarOpen && "Attendance"}
            </NavLink>
          </li>
          <li>
            <NavLink to="/hr-dashboard/employeehr">
              <FaUsers /> {isSidebarOpen && "Employee List"}
            </NavLink>
          </li>
          <li>
            <NavLink to="/hr-dashboard/jobs">
              <FaUserPlus /> {isSidebarOpen && "Recruitment"}
            </NavLink>
          </li>
          <li>
            <NavLink to="/hr-dashboard/taskshr">
              <FaTasks /> {isSidebarOpen && "Tasks"}
            </NavLink>
          </li>
        </ul>
      </aside>

      
      <main className="main-content">
      <header className="topbar">
       {isSidebarOpen && <h3 className="dashboard-title">HR Dashboard</h3>}
        <button className="theme-toggle-btn" onClick={toggleTheme}>
       {theme === "light" ? <FaMoon /> : <FaSun />}
        </button>
      </header>

        {/* Scrollable content area */}
        <section className="content-area">
          <Outlet context={{ searchTerm }} />
        </section>

        {/* Footer */}
        <footer className="footer">
          <p>© {new Date().getFullYear()} Employee Management System | HR Dashboard</p>
        </footer>
      </main>
    </div>
  );
};

export default HRdashboard;
