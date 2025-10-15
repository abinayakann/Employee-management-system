const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const AdminRoutes = require("./Routes/AdminRoutes");
const recruitmentAd = require("./Routes/recruitmentRoutes-ad");
const payroll = require("./Routes/payrollAdminRoutes")
const attendancead = require('./Routes/attendanceRoutes-ad');
const TasksAd = require('./Routes/taskRoutes-ad');
const EmployeeAd= require('./Routes/emloyeeRoutes-ad');


const EmployeeRoutes = require("./Routes/EmployeeRoutes");
const EmployeeAttendance = require("./Routes/attendanceRoutes-emp");
const Tasks = require("./Routes/tasksRoutes-emp");
const payrollEmp = require("./Routes/payrollEmployeeRoutes")
const EmployeeProfile = require("./Routes/profileRoutes-emp");


const HRRoutes = require("./Routes/HRRoutes");
const employeeRouteshr = require("./Routes/employeeRoutes-hr");
const attendancehr = require("./Routes/attendanceRoutes-hr");
const payrollhr = require("./Routes/payrollHRRoutes")
const recruitmenthr = require("./Routes/recruitmentRoutes-hr");
const taskshr = require("./Routes/tasksRoutes-hr");


require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());



app.use("/api/admin",AdminRoutes);
app.use("/api/admin/recruitment",recruitmentAd);
app.use("/api/admin/payroll", payroll);
app.use("/api/admin/attendancead",attendancead);
app.use("/api/admin/tasks",TasksAd);
app.use("/api/admin/Employees",EmployeeAd);


app.use("/api/employee",EmployeeRoutes);
app.use("/api/employee/attendance",EmployeeAttendance);
app.use("/api/employee/tasks",Tasks);
app.use("/api/employee/payrollemp",payrollEmp);
app.use("/api/employee/profile",EmployeeProfile);


app.use("/api/hr",HRRoutes);
app.use("/api/hr/employeehr",employeeRouteshr);
app.use("/api/hr/attendancehr",attendancehr);
app.use("/api/hr/payrollhr",payrollhr);
app.use("/api/hr/jobs",recruitmenthr);
app.use("/api/hr/taskshr",taskshr);



const PORT = process.env.PORT || 5000

const Admin = require("./models/Admin");
const HR = require("./models/Hr");
const Employee = require("./models/Employee");
const Recruitment = require("./models/Recruitment");

mongoose.connect("mongodb://127.0.0.1:27017/employeeDB")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.listen(5000, () => {
  console.log("Server running on port 5000");
});