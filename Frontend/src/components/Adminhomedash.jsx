import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaMoneyCheckAlt,
  FaClipboardList,
  FaUsers,
  FaUserPlus,
  FaTasks,
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
import "./Adminhomedash.css";

const AdminHome = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalTasks: 0,
    pendingTasks: 0,
    salaryPaid: 0,
    attendancePercent: 0,
    totalJobs: 0,
    totalCandidates: 0,
  });

  const [attendanceData, setAttendanceData] = useState([]);
  const [payrollData, setPayrollData] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.warn("No token found — redirecting to login");
          navigate("/login");
          return;
        }

        const headers = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const [
          empRes,
          taskRes,
          attendanceRes,
          payrollRes,
          jobRes,
          candidateRes,
        ] = await Promise.all([
          axios.get("http://localhost:5000/api/admin/employees", headers),
          axios.get("http://localhost:5000/api/admin/tasks", headers),
          axios.get("http://localhost:5000/api/admin/attendancead", headers),
          axios.get("http://localhost:5000/api/admin/payroll", headers),
          axios.get("http://localhost:5000/api/admin/recruitment/jobs", headers),
          axios.get(
            "http://localhost:5000/api/admin/recruitment/candidates",
            headers
          ),
        ]);

        // Employees
        const totalEmployees = empRes.data?.length || 0;

        // Tasks
        const totalTasks = taskRes.data?.length || 0;
        const pendingTasks =
          taskRes.data?.filter(
            (t) => t.status?.toLowerCase() === "pending"
          ).length || 0;

        // Attendance
        const totalPresent =
          attendanceRes.data?.filter(
            (a) => a.status?.toLowerCase() === "present"
          ).length || 0;
        const attendancePercent =
          totalEmployees > 0
            ? ((totalPresent / totalEmployees) * 100).toFixed(1)
            : 0;

        // Payroll
        const salaryPaid =
          payrollRes.data?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0;

        // Jobs & Candidates
        const totalJobs = jobRes.data?.length || 0;
        const totalCandidates = candidateRes.data?.length || 0;

        // Sample chart data (you can replace with real analytics later)
        const attendanceTrend = [
          { day: "Mon", Present: 12, Absent: 2 },
          { day: "Tue", Present: 13, Absent: 1 },
          { day: "Wed", Present: 14, Absent: 0 },
          { day: "Thu", Present: 11, Absent: 3 },
          { day: "Fri", Present: 15, Absent: 0 },
        ];

        const payrollSummary = [
          { department: "IT", Paid: 25000, Pending: 5000 },
          { department: "HR", Paid: 20000, Pending: 2000 },
          { department: "Finance", Paid: 30000, Pending: 0 },
        ];

        setStats({
          totalEmployees,
          totalTasks,
          pendingTasks,
          salaryPaid,
          attendancePercent,
          totalJobs,
          totalCandidates,
        });
        setAttendanceData(attendanceTrend);
        setPayrollData(payrollSummary);
      } catch (err) {
        console.error("Error fetching admin dashboard data:", err);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  const quickStats = [
    {
      title: "Total Employees",
      value: stats.totalEmployees,
      color: "#4CAF50",
      icon: <FaUsers size={24} />,
      path: "/admin-dashboard/Employee",
    },
    {
      title: "Pending Tasks",
      value: stats.pendingTasks,
      color: "#FF9800",
      icon: <FaTasks size={24} />,
      path: "/admin-dashboard/Tasks",
    },
    {
      title: "Salary Paid",
      value: `₹${stats.salaryPaid}`,
      color: "#2196F3",
      icon: <FaMoneyCheckAlt size={24} />,
      path: "/admin-dashboard/payroll",
    },
    {
      title: "Attendance %",
      value: `${stats.attendancePercent}%`,
      color: "#F44336",
      icon: <FaCalendarCheck size={24} />,
      path: "/admin-dashboard/AttendanceAd",
    },
    {
      title: "Total Jobs",
      value: stats.totalJobs,
      color: "#9C27B0",
      icon: <FaClipboardList size={24} />,
      path: "/admin-dashboard/recruitment/jobs",
    },
    {
      title: "Total Candidates",
      value: stats.totalCandidates,
      color: "#607D8B",
      icon: <FaUserPlus size={24} />,
      path: "/admin-dashboard/recruitment/candidates",
    },
  ];

  return (
    <div className="admin-home">
      <h2>Welcome to the Admin Dashboard</h2>

      {/* Quick Stats */}
      <div className="quick-stats-container">
        {quickStats.map((stat, index) => (
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
              <Bar dataKey="Paid" fill="#4CAF50" />
              <Bar dataKey="Pending" fill="#F44336" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
