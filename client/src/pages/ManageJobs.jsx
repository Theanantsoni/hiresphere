import moment from "moment";
import React, { useContext, useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import Loading from "../components/Loading";

const ManageJobs = () => {

  const navigate = useNavigate();
  const { backendUrl, companyToken } = useContext(AppContext);

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  /* ================= FETCH JOBS ================= */

  const fetchCompanyJobs = async () => {

    if (!companyToken) return;

    try {

      setLoading(true);

      const { data } = await axios.get(
        `${backendUrl}/api/company/list-jobs`,
        {
          headers: { token: companyToken }
        }
      );

      if (data.success) {
        setJobs(data.jobsData);
      } else {
        toast.error(data.message);
      }

    } catch (error) {
      toast.error("Failed to fetch jobs");
    } finally {
      setLoading(false);
    }
  };

  /* ================= CHANGE JOB VISIBILITY ================= */

  const changeJobVisibility = async (id) => {

    try {

      const { data } = await axios.post(
        `${backendUrl}/api/company/change-visibility`,
        { id },
        {
          headers: { token: companyToken }
        }
      );

      if (data.success) {
        fetchCompanyJobs();
      } else {
        toast.error(data.message);
      }

    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchCompanyJobs();
  }, [companyToken]);

  /* ================= SEARCH FILTER ================= */

  const filteredJobs = useMemo(() => {

    if (!search) return jobs;

    const query = search.toLowerCase();

    return jobs.filter((job) => {

      const title = job.title?.toLowerCase() || "";
      const location = job.location?.toLowerCase() || "";

      return (
        title.includes(query) ||
        location.includes(query)
      );
    });

  }, [jobs, search]);

  /* ================= LOADING ================= */

  if (loading) return <Loading />;

  return (

    <div className="max-w-6xl mx-auto px-4 py-8">

      {/* HEADER */}

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">

        <h2 className="text-2xl font-bold text-gray-800">
          Manage Jobs
        </h2>

        <div className="flex gap-3 w-full md:w-auto">

          <input
            type="text"
            placeholder="Search by title or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border px-4 py-2 rounded-lg w-full md:w-64 focus:ring-2 focus:ring-black outline-none"
          />

          <button
            onClick={() => navigate("/dashboard/add-jobs")}
            className="bg-black text-white px-5 py-2 rounded-lg hover:bg-gray-800 transition"
          >
            + Add Job
          </button>

        </div>

      </div>

      {/* EMPTY STATE */}

      {filteredJobs.length === 0 ? (

        <div className="bg-white rounded-2xl shadow-md p-10 text-center">

          <p className="text-gray-500 text-lg mb-4">
            No Jobs Found
          </p>

          <button
            onClick={() => navigate("/dashboard/add-jobs")}
            className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition"
          >
            Post a Job
          </button>

        </div>

      ) : (

        <div className="bg-white rounded-2xl shadow-md overflow-hidden">

          <div className="overflow-x-auto">

            <table className="min-w-full text-sm">

              <thead className="bg-gray-50 border-b">

                <tr>
                  <th className="py-3 px-4 text-left">#</th>
                  <th className="py-3 px-4 text-left">Job</th>
                  <th className="py-3 px-4 text-left">Posted</th>
                  <th className="py-3 px-4 text-left">Location</th>
                  <th className="py-3 px-4 text-center">Applicants</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>

              </thead>

              <tbody>

                {filteredJobs.map((job, index) => (

                  <tr
                    key={job._id}
                    className="border-b hover:bg-gray-50 transition"
                  >

                    <td className="py-3 px-4">
                      {index + 1}
                    </td>

                    <td className="py-3 px-4 font-medium text-gray-800">
                      {job.title}
                    </td>

                    <td className="py-3 px-4 text-gray-600">
                      {moment(job.date).format("ll")}
                    </td>

                    <td className="py-3 px-4 text-gray-600">
                      {job.location}
                    </td>

                    <td className="py-3 px-4 text-center font-semibold">
                      {job.applicantCount || 0}
                    </td>

                    {/* STATUS TOGGLE */}

                    <td className="py-3 px-4 text-center">

                      <div className="flex justify-center items-center gap-3">

                        <span
                          className={`text-xs px-3 py-1 rounded-full font-medium
                          ${
                            job.visible
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {job.visible ? "Active" : "Hidden"}
                        </span>

                        <button
                          onClick={() => changeJobVisibility(job._id)}
                          className={`w-10 h-5 flex items-center rounded-full p-1 transition
                          ${
                            job.visible
                              ? "bg-green-500"
                              : "bg-gray-300"
                          }`}
                        >

                          <div
                            className={`bg-white w-4 h-4 rounded-full shadow-md transform transition
                            ${
                              job.visible
                                ? "translate-x-5"
                                : ""
                            }`}
                          />

                        </button>

                      </div>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>

      )}

    </div>

  );
};

export default ManageJobs;