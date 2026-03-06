import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useUser, useAuth } from "@clerk/clerk-react";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const { user } = useUser();
  const { getToken } = useAuth();

  /* ================= AXIOS INSTANCE ================= */

  const api = axios.create({
    baseURL: backendUrl,
  });

  /* ================= STATES ================= */

  const [searchFilter, setSearchFilter] = useState({
    title: "",
    location: "",
  });

  const [isSearched, setIsSearched] = useState(false);

  const [jobs, setJobs] = useState([]);

  const [showRecruiterLogin, setShowRecruiterLogin] = useState(false);

  const [companyToken, setCompanyToken] = useState(
    localStorage.getItem("companytoken") || null
  );

  const [companyData, setCompanyData] = useState(null);

  const [authLoading, setAuthLoading] = useState(true);

  const [userData, setUserData] = useState(null);

  const [userApplications, setUserApplications] = useState([]);

  /* ================= FETCH JOBS ================= */

  const fetchJobs = async () => {
    try {

      const { data } = await api.get("/api/jobs");

      if (data.success) {
        setJobs(data.jobs);
      }

    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  /* ================= FETCH COMPANY DATA ================= */

  const fetchCompanyData = async (token) => {
    try {

      const { data } = await api.get("/api/company/company", {
        headers: { token },
      });

      if (data.success) {
        setCompanyData(data.company);
      }

    } catch (error) {

      toast.error(error.response?.data?.message || error.message);

      localStorage.removeItem("companytoken");
      setCompanyToken(null);

    }
  };

  /* ================= FETCH USER DATA ================= */

  const fetchUserData = async () => {
    try {

      const token = await getToken();

      if (!token) return;

      const { data } = await api.get("/api/users/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (data.success) {
        setUserData(data.user);
      }

    } catch (error) {

      toast.error(error.response?.data?.message || error.message);

    }
  };

  /* ================= FETCH USER APPLICATIONS ================= */

  const fetchUserApplications = async () => {
    try {

      const token = await getToken();

      if (!token) return;

      const { data } = await api.get("/api/users/applications", {
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

  /* ================= COMPANY TOKEN RESTORE ================= */

  useEffect(() => {

    const storedToken = localStorage.getItem("companytoken");

    if (storedToken) {

      setCompanyToken(storedToken);
      fetchCompanyData(storedToken);

    }

    setAuthLoading(false);

  }, []);

  /* ================= FETCH JOBS ================= */

  useEffect(() => {
    fetchJobs();
  }, []);

  /* ================= FETCH USER DATA ================= */

  useEffect(() => {

    if (user) {

      fetchUserData();
      fetchUserApplications();

    }

  }, [user]);

  /* ================= CONTEXT VALUE ================= */

  const value = {

    backendUrl,

    searchFilter,
    setSearchFilter,

    isSearched,
    setIsSearched,

    jobs,
    setJobs,
    fetchJobs,

    showRecruiterLogin,
    setShowRecruiterLogin,

    companyToken,
    setCompanyToken,

    companyData,
    setCompanyData,
    fetchCompanyData,

    authLoading,

    userData,
    setUserData,
    fetchUserData,

    userApplications,
    setUserApplications,
    fetchUserApplications,

  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};