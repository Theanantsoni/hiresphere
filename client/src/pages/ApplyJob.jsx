import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import Loading from "../components/Loading";
import Navbar from "../components/Navbar";
import kconvert from "k-convert";
import moment from "moment";
import JobCards from "../components/JobCards";
import Footer from "../components/Footer";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "@clerk/clerk-react";

const ApplyJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getToken } = useAuth();

  const {
    jobs,
    backendUrl,
    userData,
    authLoading,
    userApplications,
    fetchUserApplications,
  } = useContext(AppContext);

  const [jobData, setJobData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAlreadyApplied, setIsAlreadyApplied] = useState(false);

  /* ================= FETCH JOB ================= */

  const fetchJob = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/jobs/${id}`);
      if (data.success) setJobData(data.job);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchJob();
  }, [id]);

  /* ================= CHECK ALREADY APPLIED ================= */

  useEffect(() => {
    if (userApplications && userApplications.length > 0) {
      const applied = userApplications.some(
        (application) => application.jobId?._id === id
      );
      setIsAlreadyApplied(applied);
    }
  }, [userApplications, id]);

  /* ================= APPLY HANDLER ================= */

  const applyHandler = async () => {
    try {
      if (authLoading) return toast.warning("Authenticating...");
      if (!userData) return toast.warning("Login to apply");

      if (!userData.resume) {
        toast.warning("Please upload resume first");
        return navigate("/applications");
      }

      const token = await getToken();

      const { data } = await axios.post(
        `${backendUrl}/api/users/apply`,
        { jobId: id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        toast.success("Applied successfully");
        fetchUserApplications(); // refresh applications
        setIsAlreadyApplied(true);
      } else if (data.message === "Already Applied") {
        toast.info("Already Applied");
        setIsAlreadyApplied(true);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  if (loading) return <Loading />;
  if (!jobData) return <Loading />;

  return (
    <>
      <Navbar />

      <div className="min-h-screen flex flex-col py-10 container px-4 2xl:px-20 mx-auto">
        <div className="bg-white text-black rounded-lg w-full">

          {/* ================= TOP SECTION ================= */}

          <div className="flex justify-between flex-wrap gap-8 px-8 md:px-14 py-14 mb-6 bg-sky-50 border border-sky-400 rounded-xl">
            <div className="flex flex-col md:flex-row items-center">
              <img
                className="h-24 bg-white rounded-lg p-4 mr-4 border"
                src={jobData.companyId?.image}
                alt=""
              />

              <div>
                <h1 className="text-2xl sm:text-4xl font-medium">
                  {jobData.title}
                </h1>

                <div className="flex flex-wrap gap-6 items-center text-gray-600 mt-2">
                  <span className="flex items-center gap-1">
                    <img src={assets.suitcase_icon} alt="" />
                    {jobData.companyId?.name}
                  </span>

                  <span className="flex items-center gap-1">
                    <img src={assets.location_icon} alt="" />
                    {jobData.location}
                  </span>

                  <span className="flex items-center gap-1">
                    <img src={assets.person_icon} alt="" />
                    {jobData.level}
                  </span>

                  <span className="flex items-center gap-1">
                    <img src={assets.money_icon} alt="" />
                    CTC: {kconvert.convertTo(jobData.salary)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-center text-end">
              <button
                onClick={applyHandler}
                className={`p-2.5 px-10 text-white rounded ${
                  isAlreadyApplied
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-blue-600"
                }`}
              >
                {isAlreadyApplied ? "Already Applied" : "Apply Now"}
              </button>

              <p className="mt-1 text-gray-600">
                Posted {moment(jobData.date).fromNow()}
              </p>
            </div>
          </div>

          {/* ================= DESCRIPTION ================= */}

          <div>
            <h2 className="font-bold text-2xl mb-4">
              Job Description
            </h2>

            <div
              dangerouslySetInnerHTML={{
                __html: jobData.description,
              }}
            />
          </div>

          {/* ================= MORE JOBS ================= */}

          <div className="mt-10">
            <h2 className="text-lg font-semibold mb-4">
              More jobs from {jobData.companyId?.name}
            </h2>

            {jobs
              .filter(
                (job) =>
                  job._id !== jobData._id &&
                  job.companyId?._id === jobData.companyId?._id
              )
              .slice(0, 4)
              .map((job) => (
                <JobCards key={job._id} job={job} />
              ))}
          </div>

        </div>
      </div>

      <Footer />
    </>
  );
};

export default ApplyJob;