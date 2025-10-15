import React from "react";
import "./EmployeeHomedash.css";

const EmployeeHome = () => {
  return (
    <div className="employee-home">
      <div className="content-container">
        <div className="dashboard-card">
          <h2>Welcome to Your Dashboard</h2>
          <p>
            This is your Employee Home page. You can navigate to your tasks, payroll,
            or attendance using the menu options.
          </p>
        </div>

        {/* Extra dummy content for testing scroll */}
        <div className="dashboard-card">
          <h2>Announcements</h2>
          <p>
            Keep an eye on upcoming events, HR announcements, and company-wide updates
            that will be posted here soon.
          </p>
        </div>

        <div className="dashboard-card">
          <h2>Performance Summary</h2>
          <p>
            Your monthly performance, completed tasks, and feedback will appear here.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmployeeHome;
