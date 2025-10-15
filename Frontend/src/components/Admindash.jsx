import React, { useState, useEffect } from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  FaUserShield,
  FaMoneyCheckAlt,
  FaClipboardList,
  FaUsers,
  FaUserPlus,
  FaHome,
  FaTasks,
  FaBars,
  FaTimes,
  FaMoon,
  FaSun
} from "react-icons/fa";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [theme, setTheme] = useState("light");

  
  useEffect(() => {
    const savedTheme = localStorage.getItem("admin-dashboard-theme");
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setTheme(prefersDark ? "dark" : "light");
    }
  }, []);

  
  useEffect(() => {
    localStorage.setItem("admin-dashboard-theme", theme);
  }, [theme]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

  return (
    <div
      className={`admin-dashboard ${isSidebarOpen ? "sidebar-open" : "sidebar-closed"} ${theme}-theme`}
    >
      {/* Sidebar */}
      <aside className={`sidebar ${isSidebarOpen ? "open" : "closed"}`}>
        <div className="sidebar-header">
          <button className="toggle-btn" onClick={toggleSidebar}>
            {isSidebarOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Profile Section */}
        {isSidebarOpen && (
          <div className="profile">
            <FaUserShield className="profile-pic" />
            <h3>Admin</h3>
            <p className="tagline">System Control Panel </p>
          </div>
        )}

        {/* Sidebar Menu */}
        <ul className="menu">
          <li>
              <NavLink to="/admin-dashboard" end>
                 <FaHome /> {isSidebarOpen && "Home"}
              </NavLink>
         </li>

          <li>
            <NavLink to="/admin-dashboard/payroll">
              <FaMoneyCheckAlt /> {isSidebarOpen && "Payroll"}
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin-dashboard/AttendanceAd">
              <FaClipboardList /> {isSidebarOpen && "Attendance"}
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin-dashboard/Employee">
              <FaUsers /> {isSidebarOpen && "Employee "}
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin-dashboard/jobs">
              <FaUserPlus /> {isSidebarOpen && "Recruitment"}
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin-dashboard/Tasks">
              <FaTasks /> {isSidebarOpen && "Tasks"}
            </NavLink>
          </li>
          
        </ul>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        
        <header className="topbar">
        {isSidebarOpen && <h3 className="dashboard-title">Admin Dashboard</h3>}
        <button className="theme-toggle-btn" onClick={toggleTheme}></button>
          <button className="theme-toggle-btn" onClick={toggleTheme}>
            {theme === "light" ? <FaMoon /> : <FaSun />}
          </button>
        </header>

        {/* Dynamic Page */}
        <section className="content-area">
          <Outlet />
        </section>

        {/* Footer */}
        <footer className="footer">
          <p>© {new Date().getFullYear()} Employee Management System | Admin Dashboard</p>
        </footer>
      </main>
    </div>
  );
};

export default AdminDashboard;
