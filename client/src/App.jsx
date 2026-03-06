import React, { useContext } from "react";
import { Route, Routes, Navigate } from "react-router-dom";

import ApplyJob from "./pages/ApplyJob";
import Home from "./pages/Home";
import Application from "./pages/Application";
import RecruiterLogin from "./components/RecruiterLogin";

import Dashboard from "./pages/Dashboard";
import DashboardHome from "./pages/DashboardHome";

import AddJob from "./pages/AddJob";
import ManageJobs from "./pages/ManageJobs";
import ViewApplications from "./pages/ViewApplications";

import { AppContext } from "./context/AppContext";

import "quill/dist/quill.snow.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import CompanyProfile from "./pages/CompanyProfile";
import CompanyEmployees from "./pages/CompanyEmployees";

/* ================= PROTECTED ROUTE ================= */

const RecruiterProtectedRoute = ({ children }) => {

  const { companyToken, authLoading } = useContext(AppContext);

  if (authLoading) return null;

  if (!companyToken) {
    return <Navigate to="/" replace />;
  }

  return children;
};

/* ================= APP ================= */

const App = () => {

  const { showRecruiterLogin } = useContext(AppContext);

  return (

    <div>

      {showRecruiterLogin && <RecruiterLogin />}

      <ToastContainer />

      <Routes>

        {/* ================= PUBLIC ROUTES ================= */}

        <Route path="/" element={<Home />} />

        <Route path="/apply-job/:id" element={<ApplyJob />} />

        <Route path="/applications" element={<Application />} />

        {/* ================= DASHBOARD ================= */}

        <Route
          path="/dashboard"
          element={
            <RecruiterProtectedRoute>
              <Dashboard />
            </RecruiterProtectedRoute>
          }
        >

          {/* Dashboard Home */}
          <Route index element={<DashboardHome />} />

          {/* Jobs */}
          <Route path="add-jobs" element={<AddJob />} />
          <Route path="manage-jobs" element={<ManageJobs />} />

          {/* Applications */}
          <Route path="view-applications" element={<ViewApplications />} />

          {/* Company */}
          <Route path="profile" element={<CompanyProfile />} />

          {/* Employees */}
          <Route path="company-employees" element={<CompanyEmployees />} />

        </Route>

        {/* ================= FALLBACK ================= */}

        <Route path="*" element={<Navigate to="/" />} />

      </Routes>

    </div>

  );

};

export default App;