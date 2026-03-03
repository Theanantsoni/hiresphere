import React, { useContext, useState, useEffect, useMemo } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import Loading from "../components/Loading";

const ViewApplications = () => {
  const { backendUrl, companyToken } = useContext(AppContext);

  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(false);

  // NEW STATES
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  /* ================= FETCH APPLICATIONS ================= */

  const fetchCompanyApplications = async () => {
    try {
      setLoading(true);

      const { data } = await axios.get(
        `${backendUrl}/api/company/applicants`,
        { headers: { token: companyToken } }
      );

      if (data.success) {
        setApplicants(data.applications.reverse());
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  /* ================= CHANGE STATUS ================= */

  const changeJobApplicationStatus = async (id, status) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/company/change-status`,
        { id, status },
        { headers: { token: companyToken } }
      );

      if (data.success) {
        fetchCompanyApplications();
        toast.success(`Application ${status}`);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (companyToken) {
      fetchCompanyApplications();
    }
  }, [companyToken]);

  /* ================= FILTER LOGIC ================= */

  const filteredApplicants = useMemo(() => {
    return applicants.filter((app) => {
      const matchesSearch =
        app.jobId?.title
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        app.jobId?.location
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "All" || app.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [applicants, searchTerm, statusFilter]);

  /* ================= RENDER ================= */

  if (loading) return <Loading />;

  return (
    <div className="container mx-auto px-4 py-6">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Job Applications
        </h2>

        {/* SEARCH */}
        <input
          type="text"
          placeholder="Search by Title or Location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border rounded-lg px-4 py-2 w-full md:w-72 focus:ring-2 focus:ring-blue-400 outline-none"
        />
      </div>

      {/* STATUS FILTER */}
      <div className="flex gap-3 mb-6 flex-wrap">
        {["All", "Pending", "Accepted", "Rejected"].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition 
              ${
                statusFilter === status
                  ? "bg-blue-600 text-white shadow"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* EMPTY STATE */}
      {filteredApplicants.length === 0 ? (
        <div className="text-center py-16 text-gray-500 bg-white rounded-xl shadow">
          No Applications Found
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="py-3 px-4">#</th>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Job</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Resume</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>

            <tbody>
              {filteredApplicants.map((applicant, index) => (
                <tr
                  key={applicant._id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-3">{index + 1}</td>

                  <td className="px-4 py-3 flex items-center gap-3">
                    <img
                      src={applicant.userId?.image || "/default-avatar.png"}
                      className="w-9 h-9 rounded-full object-cover"
                      alt=""
                    />
                    <span className="font-medium">
                      {applicant.userId?.name}
                    </span>
                  </td>

                  <td className="px-4 py-3 font-medium">
                    {applicant.jobId?.title}
                  </td>

                  <td className="px-4 py-3 text-gray-600">
                    {applicant.jobId?.location}
                  </td>

                  <td className="px-4 py-3">
                    <a
                      href={applicant.userId?.resume}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      View Resume
                    </a>
                  </td>

                  <td className="px-4 py-3">
                    {applicant.status === "Pending" ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            changeJobApplicationStatus(
                              applicant._id,
                              "Accepted"
                            )
                          }
                          className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded-full hover:bg-green-200 transition"
                        >
                          Accept
                        </button>

                        <button
                          onClick={() =>
                            changeJobApplicationStatus(
                              applicant._id,
                              "Rejected"
                            )
                          }
                          className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded-full hover:bg-red-200 transition"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium
                          ${
                            applicant.status === "Accepted"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }
                        `}
                      >
                        {applicant.status}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ViewApplications;