import React, { useContext } from "react";
import { Route, Routes, Navigate } from "react-router-dom";

import ApplyJob from "./pages/ApplyJob";
import Home from "./pages/Home";
import Application from "./pages/Application";
import RecruiterLogin from "./components/RecruiterLogin";
import Dashboard from "./pages/Dashboard";
import AddJob from "./pages/AddJob";
import ManageJobs from "./pages/ManageJobs";
import ViewApplications from "./pages/ViewApplications";

import { AppContext } from "./context/AppContext";

import "quill/dist/quill.snow.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


// 🔐 Protected Route for Recruiter
const RecruiterProtectedRoute = ({ children }) => {
  const { companyToken } = useContext(AppContext);

  if (!companyToken) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const App = () => {
  const { showRecruiterLogin } = useContext(AppContext);

  return (
    <div>
      {showRecruiterLogin && <RecruiterLogin />}
      <ToastContainer />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/apply-job/:id" element={<ApplyJob />} />
        <Route path="/applications" element={<Application />} />

        {/* 🔐 Recruiter Dashboard Routes */}
        <Route
          path="/dashboard"
          element={
            <RecruiterProtectedRoute>
              <Dashboard />
            </RecruiterProtectedRoute>
          }
        >
          {/* Default page when visiting /dashboard */}
          <Route index element={<ManageJobs />} />

          <Route path="add-jobs" element={<AddJob />} />
          <Route path="manage-jobs" element={<ManageJobs />} />
          <Route path="view-applications" element={<ViewApplications />} />
        </Route>

        {/* Optional: Handle unknown routes */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
};

export default App;