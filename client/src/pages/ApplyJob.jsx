import React, { useContext, useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import Loading from "../components/Loading";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import JobCards from "../components/JobCards";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "@clerk/clerk-react";
import kconvert from "k-convert";
import moment from "moment";

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

      if (data.success) {
        setJobData(data.job);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchJob();
  }, [id]);

  /* ================= FETCH USER APPLICATIONS ================= */

  useEffect(() => {
    if (userData) {
      fetchUserApplications();
    }
  }, [userData]);

  /* ================= CHECK APPLIED ================= */

  const appliedIds = useMemo(() => {
    return new Set((userApplications || []).map((app) => app?.jobId?._id));
  }, [userApplications]);

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
        },
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

  /* ================= CLEAN DESCRIPTION ================= */

  const descriptionHTML = useMemo(() => {
    if (!jobData?.description) return "";

    let html = jobData.description;

    // Remove quill editor UI spans
    html = html.replace(/<span class="ql-ui".*?>.*?<\/span>/g, "");

    // Remove inline styles
    html = html.replace(/ style="[^"]*"/g, "");

    return html;
  }, [jobData]);

  if (loading || !jobData) return <Loading />;

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-50 py-10 px-4 2xl:px-20">
        <div className="max-w-7xl mx-auto">
          {/* ================= JOB HEADER ================= */}

          <div className="bg-white shadow-lg rounded-2xl p-8 mb-10 border">
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

              <div className="flex items-center">
                <button
                  disabled={isAlreadyApplied}
                  onClick={!isAlreadyApplied ? applyHandler : undefined}
                  className={`px-12 py-3 rounded-xl text-white font-semibold transition
                  ${
                    isAlreadyApplied
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-lg"
                  }`}
                >
                  {isAlreadyApplied ? "Already Applied" : "Apply Now"}
                </button>
              </div>
            </div>
          </div>

          {/* ================= MAIN GRID ================= */}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* ================= DESCRIPTION ================= */}

            <div className="lg:col-span-2 bg-white rounded-2xl shadow-md p-8 border">
              <h2 className="text-2xl font-bold mb-6 border-b pb-3">
                Job Description
              </h2>

              <div
                className="
                max-w-none
                text-gray-700
                leading-relaxed
                [&_h1]:text-3xl
                [&_h1]:font-bold
                [&_h2]:text-2xl
                [&_h2]:font-semibold
                [&_h2]:mt-6
                [&_h2]:mb-2
                [&_p]:mb-3
                [&_ul]:list-disc
                [&_ul]:pl-6
                [&_li]:mb-1
                "
                dangerouslySetInnerHTML={{ __html: descriptionHTML }}
              />
            </div>

            {/* ================= MORE JOBS ================= */}

            <div className="bg-white p-6 rounded-2xl shadow-md border">
              <h2 className="text-lg font-semibold mb-5">
                More jobs from {jobData?.companyId?.name}
              </h2>

              <div className="space-y-4">
                {jobs
                  ?.filter(
                    (job) =>
                      job?._id !== jobData?._id &&
                      job?.companyId?._id === jobData?.companyId?._id,
                  )
                  ?.filter((job) => !appliedIds.has(job?._id))
                  ?.slice(0, 4)
                  ?.map((job) => (
                    <div
                      key={job?._id}
                      className="transition hover:-translate-y-1 hover:shadow-md rounded-xl"
                    >
                      <JobCards job={job} />
                    </div>
                  ))}
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
