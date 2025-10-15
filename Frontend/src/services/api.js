import axios from "axios";

const API = axios.create({
  baseURL: "https://employee-management-systems-4a9a.onrender.com/api", 
});

export default API;
