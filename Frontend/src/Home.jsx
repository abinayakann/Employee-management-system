import React from "react";
import { Link } from "react-router-dom";
import { FaUserTie, FaUsers, FaUserShield, FaBriefcase } from "react-icons/fa";
import "./Home.css";

const Home = () => {
  return (
    <div className="home-page">
      <header className="home-header">
        <h1 className="home-title">
          <FaBriefcase className="title-icon" /> Employee Management System
        </h1>
      </header>

      <main className="home-content">
        <p className="welcome-text">
          Welcome to the <strong>Employee Management System</strong>.  
          Please choose your role to continue:
        </p>

        <div className="role-cards">
          <Link to="/hr" className="role-card">
            <FaUserTie className="role-icon" />
            <h3>HR</h3>
            <p>Manage employees, recruitments & reports.</p>
          </Link>

          <Link to="/employee" className="role-card">
            <FaUsers className="role-icon" />
            <h3>Employee</h3>
            <p>View tasks, update details, check attendance.</p>
          </Link>

          <Link to="/admin" className="role-card">
            <FaUserShield className="role-icon" />
            <h3>Admin</h3>
            <p>Full control over HR and Employee operations.</p>
          </Link>
        </div>
      </main>

      <footer className="home-footer">
        <p>
          © {new Date().getFullYear()} Employee Management System | Contact: XXYY@gmail.com
        </p>
      </footer>
    </div>
  );
};

export default Home;
