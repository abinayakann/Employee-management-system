import React,{useState} from 'react';
import axios from "axios";
import "./Login.css"
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock, FaSignInAlt } from "react-icons/fa";

const HRLogin = () => {
    const [HrID, setHrID] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post("http://localhost:5000/api/hr/login",
              { HrID,password },
              { headers: { "Content-Type": "application/json" } }
            );

      setMessage("Login Successful");
      localStorage.setItem("token", data.token); 

      setTimeout(() => {
        navigate("/Hr-dashboard");
      }, 1000);
    } catch (error) {

      if (error.response && error.response.status === 400) {
        setMessage("Invalid Credentials");
      } else {
        setMessage("Something went wrong");
      }
    }
  };
  return (
    <div className="Login-page">
        <h2>HR Login</h2>
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <FaUser className="input-icon" />
            <input type = "text" placeholder="HR ID" value={HrID}
            onChange={(e) => setHrID(e.target.value)}
            required/>
          </div>

          <div className="input-group">
            <FaLock className="input-icon" />
            <input type = "password" placeholder ="password" value={password}
            onChange={(e) => setPassword(e.target.value)}
            required/>
          </div>
          
            <button type="submit" className="login-btn">
            <FaSignInAlt style={{ marginRight: "8px" }} />
             Login
            </button>
            
        </form>
        {message && <p className="login-message">{message}</p>}
    </div>
  );
};

export default HRLogin
