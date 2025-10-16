import axios from "axios";

// Use environment variable if present, otherwise fallback to hardcoded URL
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL 
    ? import.meta.env.VITE_API_URL + "/api"
    : "https://employee-management-systems-4a9a.onrender.com/api",
});

export default API;
