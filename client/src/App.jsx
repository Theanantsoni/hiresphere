import React, { useContext } from "react";
import { Route, Routes } from "react-router-dom";
import ApplyJob from "./pages/ApplyJob";
import Home from "./pages/Home";
import Application from "./pages/Application";
import RecruiterLogin from "./components/RecruiterLogin";
import { AppContext } from "./context/AppContext";
import Dashboard from "./pages/Dashboard";
import AddJob from "./pages/AddJob";
import ManageJobs from "./pages/ManageJobs";
import ViewApplications from "./pages/ViewApplications";
import "quill/dist/quill.snow.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const { showRecruiterLogin, companyToken } = useContext(AppContext);
  return (
    <div>
      {showRecruiterLogin && <RecruiterLogin />}
      <ToastContainer />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/apply-job/:id" element={<ApplyJob />} />
        <Route path="/applications" element={<Application />} />
        {/* Nested Dashboard Routes */}
        <Route path="/dashboard" element={<Dashboard />}>
          <Route
            path="add-jobs"
            element={companyToken ? <AddJob /> : <Home />}
          />
          <Route
            path="manage-jobs"
            element={companyToken ? <ManageJobs /> : <Home />}
          />
          <Route
            path="view-applications"
            element={companyToken ? <ViewApplications /> : <Home />}
          />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
