import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useUser, useAuth } from "@clerk/clerk-react";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const { user } = useUser();
  const { getToken } = useAuth();

  const [searchFilter, setSearchFilter] = useState({
    title: "",
    location: "",
  });

  const [isSearched, setIsSearched] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [showRecruiterLogin, setShowRecruiterLogin] = useState(false);

  const [companyToken, setCompanyToken] = useState(null);
  const [companyData, setCompanyData] = useState(null);

  const [authLoading, setAuthLoading] = useState(true); // 🔥 important

  const [userData, setUserData] = useState(null); // 🔹 for user profile data

  const [userApplications, setUserApplications] = useState([]); // 🔹 for user applications

  // 🔹 Fetch all jobs
  const fetchJobs = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/jobs`);

      if (data.success) {
        setJobs(data.jobs);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // 🔹 Fetch recruiter/company data
  const fetchCompanyData = async (token) => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/company/company`, {
        headers: { token },
      });

      if (data.success) {
        setCompanyData(data.company);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // 🔥 Restore token on page refresh
  useEffect(() => {
    const storedToken = localStorage.getItem("companytoken");

    if (storedToken) {
      setCompanyToken(storedToken);
      fetchCompanyData(storedToken); // directly fetch company data
    }

    setAuthLoading(false); // ✅ very important
  }, []);

  //Function to fetch user data
  const fetchUserData = async () => {
    try {
      const token = await getToken();

      if (!token) {
        console.log("No Clerk token found");
        return;
      }

      const { data } = await axios.get(`${backendUrl}/api/users/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (data.success) {
        setUserData(data.user);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // Fecth  user's applied application data

  const fetchUserApplications = async () => {
    try {
      const token = await getToken();

      const { data } = await axios.get(`${backendUrl}/api/users/applications`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (data.success) {
        setUserApplications(data.applications);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // 🔹 Fetch jobs once
  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const value = {
    searchFilter,
    setSearchFilter,
    isSearched,
    setIsSearched,
    jobs,
    setJobs,
    showRecruiterLogin,
    setShowRecruiterLogin,
    companyToken,
    setCompanyToken,
    companyData,
    setCompanyData,
    backendUrl,
    authLoading,
    userData,
    setUserData,
    userApplications,
    setUserApplications,
    fetchUserData,
    fetchUserApplications, // ✅ ADD THIS LINE
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
