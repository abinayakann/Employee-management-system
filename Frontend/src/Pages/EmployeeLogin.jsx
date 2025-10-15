import React, { useState } from 'react';
import "./Login.css";
import API from "../services/api";
import { useNavigate } from 'react-router-dom';
import { FaUser, FaLock } from "react-icons/fa";

const EmployeeLogin = () => {
  const [username, setUsername] = useState("");
  const [employeeID, setEmployeeID] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log("Sending login request:", { EmployeeID: employeeID, password });
      const { data } = await API.post(
        "/employee/login",
        { EmployeeID: employeeID, password },
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("Login response:", data);
      setMessage("Login Successful");

      // Store token and employee info
      localStorage.setItem("token", data.token);
      localStorage.setItem("employeeName", data.employee.name);
      localStorage.setItem("employeeID", data.employee.EmployeeID);

      // Redirect after 1 second
      setTimeout(() => {
        navigate("/employee-dashboard");
      }, 1000);

    } catch (error) {
      console.log("Login error:", error);
      if (error.response && error.response.status === 400) {
        setMessage("Invalid Credentials");
      } else {
        setMessage("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='Login-page'>
      <h2>Employee Login</h2>
      <form onSubmit={handleLogin}>
        <div className="input-group">
          <FaUser className="input-icon" />
          <input
            type="text"
            placeholder='Username (optional)'
            value={username}
            onChange={(e) => { setUsername(e.target.value); setMessage(""); }}
          />
        </div>
        <div className="input-group">
          <FaUser className="input-icon" />
          <input
            type="text"
            placeholder='Employee ID'
            value={employeeID}
            onChange={(e) => { setEmployeeID(e.target.value); setMessage(""); }}
            required
          />
        </div>
        <div className="input-group">
          <FaLock className="input-icon" />
          <input
            type="password"
            placeholder='Password'
            value={password}
            onChange={(e) => { setPassword(e.target.value); setMessage(""); }}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      {message && <p className="login-message">{message}</p>}
    </div>
  );
};

export default EmployeeLogin;
