import React, { useContext } from "react";
import { Outlet, useNavigate, NavLink } from "react-router-dom";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";

const Dashboard = () => {

  const navigate = useNavigate();

  const { companyData, setCompanyData, setCompanyToken } =
    useContext(AppContext);

  const logout = () => {

    setCompanyToken(null);
    localStorage.removeItem("companytoken");
    setCompanyData(null);
    navigate("/");

  };

  const navStyle = ({ isActive }) =>
    `flex items-center gap-3 px-6 py-3 mx-3 rounded-xl transition-all font-medium
    ${
      isActive
        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
        : "text-gray-600 hover:bg-gray-100"
    }`;

  return (

    <div className="min-h-screen bg-gray-50">

      {/* ================= TOP NAVBAR ================= */}

      <header className="sticky top-0 z-50 bg-white border-b shadow-sm">

        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">

          {/* LOGO */}

          <img
            onClick={() => navigate("/")}
            className="h-12 cursor-pointer"
            src={assets.logo}
            alt="HireSphere"
          />

          {/* COMPANY INFO */}

          {companyData && (

            <div className="flex items-center gap-6">

              <div className="hidden sm:block text-gray-600 text-sm">

                Welcome,
                <span className="ml-1 font-semibold text-gray-800">
                  {companyData.name}
                </span>

              </div>

              {/* COMPANY LOGO */}

              <div className="w-28 h-12 flex items-center justify-center border rounded-lg bg-white overflow-hidden">

                <img
                  src={companyData.image}
                  alt="company"
                  className="w-full h-full object-contain"
                />

              </div>

            </div>

          )}

        </div>

      </header>

      {/* ================= MAIN LAYOUT ================= */}

      <div className="flex">

        {/* ================= SIDEBAR ================= */}

        <aside className="w-64 min-h-screen bg-white border-r hidden md:flex flex-col justify-between">

          <nav className="mt-8 space-y-2">

            {/* DASHBOARD */}

            <NavLink end to="" className={navStyle}>

              <img className="w-5" src={assets.home_icon} alt="" />
              Dashboard

            </NavLink>

            {/* JOB SECTION */}

            <div className="pt-4 px-6 text-xs font-semibold text-gray-400 uppercase">
              Jobs
            </div>

            <NavLink to="add-jobs" className={navStyle}>

              <img className="w-5" src={assets.add_icon} alt="" />
              Add Job

            </NavLink>

            <NavLink to="manage-jobs" className={navStyle}>

              <img className="w-5" src={assets.home_icon} alt="" />
              Manage Jobs

            </NavLink>

            <NavLink to="view-applications" className={navStyle}>

              <img className="w-5" src={assets.person_tick_icon} alt="" />
              Applications

            </NavLink>

            {/* COMPANY SECTION */}

            <div className="pt-6 px-6 text-xs font-semibold text-gray-400 uppercase">
              Company
            </div>

            <NavLink to="profile" className={navStyle}>

              <img className="w-5" src={assets.person_tick_icon} alt="" />
              Company Profile

            </NavLink>

            {/* ⭐ NEW MENU */}

            <NavLink to="company-employees" className={navStyle}>

              <img className="w-5" src={assets.person_tick_icon} alt="" />
              Company Employees

            </NavLink>

            <NavLink to="analytics" className={navStyle}>

              <img className="w-5" src={assets.home_icon} alt="" />
              Analytics

            </NavLink>

            <NavLink to="settings" className={navStyle}>

              <img className="w-5" src={assets.home_icon} alt="" />
              Settings

            </NavLink>

          </nav>

          {/* LOGOUT */}

          <div className="p-6">

            <button
              onClick={logout}
              className="w-full bg-red-50 text-red-600 py-2 rounded-lg hover:bg-red-100 transition"
            >
              Logout
            </button>

          </div>

        </aside>

        {/* ================= CONTENT ================= */}

        <main className="flex-1 p-6 md:p-10">

          <div className="bg-white rounded-2xl shadow-md p-6 min-h-[80vh]">

            <Outlet />

          </div>

        </main>

      </div>

    </div>

  );

};

export default Dashboard;