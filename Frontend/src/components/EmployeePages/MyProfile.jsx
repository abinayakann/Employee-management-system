import React, { useEffect, useState } from "react";
import API from "../../services/api";
import { 
  FaUser, FaEnvelope, FaPhone, FaBuilding, 
  FaUserTie, FaMapMarkerAlt, FaBirthdayCake, FaUserCircle 
} from "react-icons/fa";
import "./profile.css";

const MyProfile = () => {
  const [profile, setProfile] = useState({});
  const [formData, setFormData] = useState({});
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  // Format Date of Birth
  const formatDate = (dob) => {
    if (!dob) return "-";
    const date = new Date(dob);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Fetch profile from backend
  const fetchProfile = async () => {
    try {
      const res = await API.get(
        "/employee/profile/myprofile",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const emp = res.data.employee || res.data;

      setProfile(emp);
      setFormData({
        name: emp.name || "",
        email: emp.email || "",
        phone: emp.phone || "",
        department: emp.department || "",
        designation: emp.designation || "",
        address: emp.address || "",
        dob: emp.dob || "",
        gender: emp.gender || "male", // optional, just for display
      });
    } catch (err) {
      console.error("Error fetching profile:", err);
      setMessage("Failed to fetch profile");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Update profile
  const handleUpdate = async () => {
    try {
      const payload = { ...formData };
      delete payload.gender; // keep gender frontend-only if you want

      const res = await API.put(
        "/employee/profile/myprofile",
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const emp = res.data.employee || res.data;
      setProfile(emp);
      setFormData(prev => ({
        ...prev,
        name: emp.name || "",
        email: emp.email || "",
        phone: emp.phone || "",
        department: emp.department || "",
        designation: emp.designation || "",
        address: emp.address || "",
        dob: emp.dob || "",
      }));
      setEditing(false);
      setMessage(res.data.message || "Profile updated successfully");
    } catch (err) {
      console.error("Error updating profile:", err);
      setMessage("Failed to update profile");
    }
  };

  return (
    <div className="profile-container">
      <h2>My Profile</h2>
      {message && <p className="message">{message}</p>}

      <div className="profile-picture">
        {/* Use a common icon for all employees */}
        <FaUserCircle size={120} color="#ddd" />
      </div>

      {editing ? (
        <div className="profile-form">
          <input name="name" value={formData.name} onChange={handleChange} placeholder="Name" />
          <input name="email" value={formData.email} onChange={handleChange} placeholder="Email" />
          <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" />
          <input name="department" value={formData.department} onChange={handleChange} placeholder="Department" />
          <input name="designation" value={formData.designation} onChange={handleChange} placeholder="Designation" />
          <textarea name="address" value={formData.address} onChange={handleChange} placeholder="Address" />
          <input type="date" name="dob" value={formData.dob?.split("T")[0] || ""} onChange={handleChange} />
          
          <div className="button-group">
            <button className="save" onClick={handleUpdate}>Save</button>
            <button className="cancel" onClick={() => setEditing(false)}>Cancel</button>
          </div>
        </div>
      ) : (
        <div className="profile-details">
          <p className="hover-icon"><FaUser /> <strong>Name:</strong> {profile.name || "-"}</p>
          <p className="hover-icon"><FaEnvelope /> <strong>Email:</strong> {profile.email || "-"}</p>
          <p className="hover-icon"><FaPhone /> <strong>Phone:</strong> {profile.phone || "-"}</p>
          <p className="hover-icon"><FaBuilding /> <strong>Department:</strong> {profile.department || "-"}</p>
          <p className="hover-icon"><FaUserTie /> <strong>Designation:</strong> {profile.designation || "-"}</p>
          <p className="hover-icon"><FaMapMarkerAlt /> <strong>Address:</strong> {profile.address || "-"}</p>
          <p className="hover-icon"><FaBirthdayCake /> <strong>Date of Birth:</strong> {formatDate(profile.dob)}</p>
          <button onClick={() => setEditing(true)}>Edit Profile</button>
        </div>
      )}
    </div>
  );
};

export default MyProfile;
