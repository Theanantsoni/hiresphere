import React, { useContext, useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
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
    jobs = [],
    backendUrl,
    userData,
    authLoading,
    userApplications = [],
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

  /* ================= FETCH APPLICATIONS ================= */

  useEffect(() => {
    if (userData) {
      fetchUserApplications();
    }
  }, [userData]);

  /* ================= MEMOIZED APPLIED IDS ================= */

  const appliedIds = useMemo(() => {
    return new Set(
      (userApplications || []).map((app) => app?.jobId?._id)
    );
  }, [userApplications]);

  /* ================= CHECK ALREADY APPLIED ================= */

  useEffect(() => {
    if (id) {
      setIsAlreadyApplied(appliedIds.has(id));
    }
  }, [appliedIds, id]);

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
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (data.success) {
        toast.success("Applied successfully");
        fetchUserApplications();
        setIsAlreadyApplied(true);
      } else if (data.message === "Already Applied") {
        toast.info("Already Applied");
        setIsAlreadyApplied(true);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  if (loading || !jobData) return <Loading />;

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-50 py-10 px-4 2xl:px-20">
        <div className="max-w-7xl mx-auto">

          {/* ================= JOB HEADER ================= */}

          <div className="bg-white shadow-xl rounded-2xl p-8 mb-10 border border-gray-100 hover:shadow-2xl transition">

            <div className="flex flex-col lg:flex-row justify-between gap-8">

              <div className="flex gap-5">
                <img
                  className="h-24 w-24 object-contain bg-gray-50 p-4 rounded-xl border"
                  src={jobData?.companyId?.image}
                  alt=""
                />

                <div>
                  <h1 className="text-3xl font-bold text-gray-800">
                    {jobData?.title}
                  </h1>

                  <div className="flex flex-wrap gap-3 mt-4 text-sm">

                    <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-medium">
                      {jobData?.companyId?.name}
                    </span>

                    <span className="bg-gray-100 px-3 py-1 rounded-full">
                      📍 {jobData?.location}
                    </span>

                    <span className="bg-gray-100 px-3 py-1 rounded-full">
                      🎯 {jobData?.level}
                    </span>

                    <span className="bg-green-50 text-green-600 px-3 py-1 rounded-full font-semibold">
                      💰 {kconvert.convertTo(jobData?.salary)}
                    </span>

                  </div>

                  <p className="mt-4 text-gray-400 text-sm">
                    Posted {moment(jobData?.date).fromNow()}
                  </p>
                </div>
              </div>

              <div className="flex flex-col justify-center items-start lg:items-end">
                <button
                  disabled={isAlreadyApplied}
                  onClick={!isAlreadyApplied ? applyHandler : undefined}
                  className={`px-12 py-3 rounded-xl text-white font-semibold transition-all duration-300 transform
                  ${
                    isAlreadyApplied
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:scale-105 hover:shadow-lg"
                  }`}
                >
                  {isAlreadyApplied ? "Already Applied" : "Apply Now"}
                </button>
              </div>

            </div>
          </div>

          {/* ================= MAIN GRID ================= */}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

            {/* LEFT DESCRIPTION */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-md p-8 border border-gray-100">

              <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-3">
                Job Description
              </h2>

              <div
                className="prose max-w-none text-gray-700"
                dangerouslySetInnerHTML={{
                  __html: jobData?.description,
                }}
              />
            </div>

            {/* RIGHT SIDEBAR */}
            <div className="space-y-6">

              <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 sticky top-24 hidden lg:block">
                <h3 className="font-semibold text-lg mb-4">
                  Quick Apply
                </h3>

                <button
                  disabled={isAlreadyApplied}
                  onClick={!isAlreadyApplied ? applyHandler : undefined}
                  className={`w-full py-3 rounded-xl text-white font-semibold transition-all duration-300
                  ${
                    isAlreadyApplied
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-lg"
                  }`}
                >
                  {isAlreadyApplied ? "Already Applied" : "Apply Now"}
                </button>

                <p className="text-xs text-gray-400 mt-3">
                  Make sure your resume is updated.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">

                <h2 className="text-lg font-semibold mb-5">
                  More jobs from {jobData?.companyId?.name}
                </h2>

                <div className="space-y-4">

                  {jobs
                    ?.filter(
                      (job) =>
                        job?._id !== jobData?._id &&
                        job?.companyId?._id === jobData?.companyId?._id
                    )
                    ?.filter((job) => !appliedIds.has(job?._id))
                    ?.slice(0, 4)
                    ?.map((job) => (
                      <div
                        key={job?._id}
                        className="transition transform hover:-translate-y-1 hover:shadow-md rounded-xl"
                      >
                        <JobCards job={job} />
                      </div>
                    ))}

                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

      <Footer />
    </>
  );
};

export default ApplyJob;