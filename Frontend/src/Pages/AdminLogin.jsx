import React, { useState } from "react";
import axios from "axios";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock } from "react-icons/fa";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/admin/login",
        { username, password },
        { headers: { "Content-Type": "application/json" } }
      );

      // If login is successful
      setMessage("Login Successful");
      localStorage.setItem("token", data.token); // save token

      setTimeout(() => {
        navigate("/admin-dashboard");
      }, 1000);
    } catch (error) {
      // Handle errors
      if (error.response && error.response.status === 400) {
        setMessage("Invalid Credentials");
      } else {
        setMessage("Something went wrong");
      }
    }
  };

  return (
    <div className="Login-page">
      <h2>Admin Login</h2>
      <form onSubmit={handleLogin}>
        <div className="input-group">
          <FaUser className="input-icon" />
          <input
            type="text"
            placeholder="Admin Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <FaLock className="input-icon" />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit">Login</button>
      </form>
      {message && <p className="login-message">{message}</p>}
    </div>
  );
};

export default AdminLogin;
