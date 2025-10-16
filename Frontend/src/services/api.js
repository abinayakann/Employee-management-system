import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL.replace(/\/$/, "") 
  : "https://employee-management-systems-4a9a.onrender.com";

const API = axios.create({
  baseURL: `${BASE_URL}/api`, 

});

export default API;
