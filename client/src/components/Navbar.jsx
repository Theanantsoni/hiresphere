import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { useClerk, UserButton, useUser } from "@clerk/clerk-react";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const Navbar = () => {
  const { openSignIn } = useClerk();
  const { user } = useUser();
  const navigate = useNavigate();
  const { setShowRecruiterLogin } = useContext(AppContext);

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 2xl:px-20 h-20 flex justify-between items-center">
        {/* LOGO */}
        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-2 cursor-pointer"
        >
          <img
            src={assets.logo}
            alt="HireSphere Logo"
            className="h-18 w-auto object-contain"
          />
        </div>

        {/* RIGHT SECTION */}
        {user ? (
          <div className="flex items-center gap-8 text-gray-700 font-medium">
            <Link
              to="/"
              className="relative group hover:text-blue-600 transition"
            >
              Home
              <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full"></span>
            </Link>

            <Link
              to="/companies"
              className="relative group hover:text-blue-600 transition"
            >
              About Companies
              <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full"></span>
            </Link>

            <Link
              to="/applications"
              className="relative group hover:text-blue-600 transition"
            >
              Applied Jobs
              <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full"></span>
            </Link>

            <div className="hidden sm:block text-sm text-gray-500">
              Hi,{" "}
              <span className="font-semibold text-gray-700">
                {user.firstName} {user.lastName}
              </span>
            </div>

            <UserButton afterSignOutUrl="/" />
          </div>
        ) : (
          <div className="flex items-center gap-6">
            <button
              onClick={() => setShowRecruiterLogin(true)}
              className="text-gray-600 hover:text-blue-600 transition font-medium"
            >
              Recruiter Login
            </button>

            <button
              onClick={() => openSignIn()}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-lg transition text-white px-6 py-2 rounded-full font-medium"
            >
              Login
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
