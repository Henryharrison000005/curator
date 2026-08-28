import { Routes, Route } from "react-router-dom";
import './styles/component.css';
import Home from "./pages/Home";
import RoleHome from "./pages/RoleHome";
import MainLayout from "./common/layouts/MainLayout";
import ProtectedRoute from "./common/components/ProtectedRoute";
import Login from "./modules/auth/Login";
import StudentRegistration from "./modules/registration/StudentRegsitration";
import StudentTask from "./modules/task/StudentTask";
import SupervisorAttendance from "./modules/attendance/SupervisorAttendance";
import InstructorAttendance from "./modules/attendance/InstructorAttendance";
import LogbookPage from "./modules/attendance/StudentLogbook";
import SupervisorTasks from "./modules/task/SupervisorTask";
import StudentSettings from "./modules/settings/StudentSettings";
import SupervisorSettings from "./modules/settings/SupervisorSettings";
import InstructorSettings from "./modules/settings/InstructorSettings";
import InstructorDepartmentManagement from "./modules/instructor/InstructorDepartmentManagement";
import InstructorApplications from "./modules/instructor/InstructorApplications";

function App() {
  return (
    <>
      <Routes>
        <Route path="/Login" element={<Login />} />
        <Route path="/StudentRegistration" element={<StudentRegistration />} />

        <Route element={<MainLayout />}>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <RoleHome />
              </ProtectedRoute>
            }
          />
          <Route
            path="/StudentTask"
            element={
              <ProtectedRoute roles={["student"]}>
                <StudentTask />
              </ProtectedRoute>
            }
          />
          <Route
            path="/StudentLogbook"
            element={
              <ProtectedRoute roles={["student"]}>
                <LogbookPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/SupervisorAttendance"
            element={
              <ProtectedRoute roles={["supervisor"]}>
                <SupervisorAttendance />
              </ProtectedRoute>
            }
          />
          <Route
            path="/SupervisorTasks"
            element={
              <ProtectedRoute roles={["supervisor"]}>
                <SupervisorTasks />
              </ProtectedRoute>
            }
          />
          <Route
            path="/InstructorAttendance"
            element={
              <ProtectedRoute roles={["instructor"]}>
                <InstructorAttendance />
              </ProtectedRoute>
            }
          />
          <Route
            path="/InstructorDepartmentManagement"
            element={
              <ProtectedRoute roles={["instructor"]}>
                <InstructorDepartmentManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/InstructorApplications"
            element={
              <ProtectedRoute roles={["instructor"]}>
                <InstructorApplications />
              </ProtectedRoute>
            }
          />
          <Route
            path="/StudentSettings"
            element={
              <ProtectedRoute roles={["student"]}>
                <StudentSettings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/SupervisorSettings"
            element={
              <ProtectedRoute roles={["supervisor"]}>
                <SupervisorSettings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/InstructorSettings"
            element={
              <ProtectedRoute roles={["instructor"]}>
                <InstructorSettings />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route path="*" element={<Home />} />
      </Routes>
    </>
  );
}

export default App;
