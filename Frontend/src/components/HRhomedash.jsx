import React, { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import API from "../services/api";
import {
  FaUsers,
  FaClipboardList,
  FaTasks,
  FaMoneyCheckAlt,
  FaCalendarCheck,
} from "react-icons/fa";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "./HRhomedash.css";

const HRDashboardHome = () => {
  const navigate = useNavigate();
  const { searchTerm } = useOutletContext(); // receive search term from parent

  const [stats, setStats] = useState({
    totalEmployees: 0,
    attendancePercent: 0,
    pendingTasks: 0,
    payrollRecords: 0,
    totalJobs: 0,
  });

  const [attendanceData, setAttendanceData] = useState([]);
  const [payrollData, setPayrollData] = useState([]);

  useEffect(() => {
    const fetchHRDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return navigate("/login");

        const headers = { headers: { Authorization: `Bearer ${token}` } };

        const safeGet = async (url) => {
          try {
            const res = await API.get(url, headers);
            return res.data;
          } catch {
            return [];
          }
        };

        const [
          employeesRes,
          attendanceRes,
          tasksRes,
          payrollRes,
          jobsRes,
        ] = await Promise.all([
          safeGet("/hr/employeehr"),
          safeGet("/hr/attendancehr"),
          safeGet("/hr/taskshr"),
          safeGet("/hr/payrollhr"),
          safeGet("/hr/jobs"),
        ]);

        const totalEmployees = employeesRes.length || 0;
        const totalPresent = attendanceRes.filter((a) => a.status === "Present").length || 0;
        const attendancePercent = totalEmployees > 0 ? ((totalPresent / totalEmployees) * 100).toFixed(1) : 0;
        const pendingTasks = tasksRes.filter((t) => t.status === "Pending").length || 0;
        const payrollRecords = payrollRes.length || 0;
        const totalJobs = jobsRes.length || 0;

        const attendanceTrend = [
          { day: "Mon", Present: 12, Absent: 2 },
          { day: "Tue", Present: 14, Absent: 1 },
          { day: "Wed", Present: 11, Absent: 3 },
          { day: "Thu", Present: 15, Absent: 0 },
          { day: "Fri", Present: 13, Absent: 2 },
        ];

        const payrollSummary = [
          { department: "IT", Paid: 20000, Pending: 5000 },
          { department: "HR", Paid: 15000, Pending: 2000 },
          { department: "Finance", Paid: 18000, Pending: 0 },
        ];

        setStats({ totalEmployees, attendancePercent, pendingTasks, payrollRecords, totalJobs });
        setAttendanceData(attendanceTrend);
        setPayrollData(payrollSummary);
      } catch (err) {
        console.error("Error fetching HR dashboard data:", err);
      }
    };

    fetchHRDashboardData();
  }, [navigate]);

  const quickStats = [
    { title: "Total Employees", value: stats.totalEmployees, color: "#4CAF50", icon: <FaUsers size={24} />, path: "/hr-dashboard/employeehr" },
    { title: "Attendance %", value: `${stats.attendancePercent}%`, color: "#F44336", icon: <FaCalendarCheck size={24} />, path: "/hr-dashboard/attendancehr" },
    { title: "Pending Tasks", value: stats.pendingTasks, color: "#FF9800", icon: <FaTasks size={24} />, path: "/hr-dashboard/taskshr" },
    { title: "Payroll Records", value: stats.payrollRecords, color: "#2196F3", icon: <FaMoneyCheckAlt size={24} />, path: "/hr-dashboard/payrollhr" },
    { title: "Total Jobs", value: stats.totalJobs, color: "#9C27B0", icon: <FaClipboardList size={24} />, path: "/hr-dashboard/jobs" },
  ];

  return (
    <div className="hr-home-inner">
      <h2>Welcome to the HR Dashboard</h2>

      {/* Quick Stats */}
      <div className="quick-stats-container">
        {quickStats
          .filter((stat) => stat.title.toLowerCase().includes(searchTerm.toLowerCase()))
          .map((stat, index) => (
            <div
              key={index}
              className="quick-stat-card"
              style={{ borderTop: `5px solid ${stat.color}` }}
              onClick={() => navigate(stat.path)}
            >
              <div className="quick-stat-icon">{stat.icon}</div>
              <div className="quick-stat-title">{stat.title}</div>
              <div className="quick-stat-value">{stat.value}</div>
            </div>
          ))}
      </div>

      {/* Charts */}
      <div className="charts-container">
        <div className="chart-card">
          <h3>Attendance Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={attendanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="Present" stroke="#4CAF50" />
              <Line type="monotone" dataKey="Absent" stroke="#F44336" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Payroll Summary</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={payrollData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="department" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Paid" fill="#4CAF50" />
              <Bar dataKey="Pending" fill="#F44336" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default HRDashboardHome;
