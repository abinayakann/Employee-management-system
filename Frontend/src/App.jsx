import React from 'react'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import Home from './Home';
import HRLogin from './Pages/HRLogin';
import AdminLogin from './Pages/AdminLogin';
import EmployeeLogin from './Pages/EmployeeLogin';

import Admindash from './components/Admindash';
import AdminHomedash from './components/Adminhomedash.jsx';
import PayrollAd from './components/Adminpages/Payrollad.jsx';
import AttendanceAd from './components/Adminpages/Attendancead.jsx';
import Recruitmentad from './components/Adminpages/Recruitmentad.jsx';
import EmployeeAd from './components/Adminpages/EmployeeAd.jsx';
import TasksAd from './components/Adminpages/Tasksad.jsx';


import Hrdashboard from './components/HRdashboard';
import DashboardHome from "./components/HRhomedash";
import Attendancehr from './components/HRPages/Attendancehr.jsx';
import Payrollhr from './components/HRPages/Payrollhr.jsx';
import Recruitmenthr from './components/HRPages/Recruitmenthr.jsx';
import Taskshr from './components/HRPages/Taskhr.jsx';
import Listhr  from './components/HRPages/Employeelisthr.jsx';


import EmployeeDashboard from './components/Employeedash.jsx';
import EmployeeHomedash from './components/EmployeeHomedash.jsx';
import Payrollemp from './components/EmployeePages/MyPayroll.jsx';
import EmployeeAttendance from './components/EmployeePages/MyAttendance.jsx';
import EmployeeTasks from './components/EmployeePages/MyTasks.jsx';
import EmployeeProfile from './components/EmployeePages/MyProfile.jsx';



const App = () => {
  return (
    <BrowserRouter>
        <Routes>
            <Route path="/" element ={<Home/>} />
            <Route path ="/hr"element={<HRLogin/>}/>
            <Route path = "/admin"element={<AdminLogin/>}/>
            <Route path = "/employee"element={<EmployeeLogin/>}/> 

          <Route path = "/admin-dashboard"element={<Admindash/>}>
            <Route index element={<AdminHomedash />} />
            <Route path="payroll" element= {<PayrollAd/>}/>
            <Route path="AttendanceAd" element={<AttendanceAd />} />
            <Route path="Employee" element={<EmployeeAd/>} />
            <Route path="jobs" element={<Recruitmentad />} />
            <Route path="tasks" element={<TasksAd />} />
            
          </Route>

          <Route path = "/hr-dashboard"element={<Hrdashboard/>}>
            <Route index element={<DashboardHome />} />
            <Route path = "payrollhr" element={<Payrollhr />} />
            <Route path = "employeehr"element={<Listhr/>}/>
            <Route path = "jobs"element={<Recruitmenthr/>}/>
            <Route path = "attendancehr"element={<Attendancehr/>}/>
            <Route path = "taskshr"element={<Taskshr/>}/>

          </Route>

          <Route path = "/employee-dashboard"element={<EmployeeDashboard/>}>
            <Route index element={<EmployeeHomedash/>} /> 
            <Route path ="attendanceEmp"element={<EmployeeAttendance/>}/>
            <Route path= "payrollemp" element={< Payrollemp />} />
            <Route path ="tasks"element={<EmployeeTasks/>}/>
            <Route path ="profileEmp"element={<EmployeeProfile/>}/>

          </Route>

        </Routes>
    </BrowserRouter>
  )
}

export default App
