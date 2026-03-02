import React, { useContext, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import moment from "moment";
import { useAuth } from "@clerk/clerk-react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const Application = () => {
  const { getToken } = useAuth();
  const [isEdit, setIsEdit] = useState(false);
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);

  const {
    backendUrl,
    userData,
    fetchUserData,
    userApplications,
    fetchUserApplications,
    authLoading,
  } = useContext(AppContext);

  /* ================= FETCH APPLICATIONS ================= */

  useEffect(() => {
    const loadData = async () => {
      if (authLoading) return;        // wait for Clerk
      if (!userData) return;          // wait for user

      await fetchUserApplications();
      setLoading(false);
    };

    loadData();
  }, [authLoading, userData]);

  /* ================= UPDATE RESUME ================= */

  const updateResume = async () => {
    try {
      if (!resume) {
        return toast.error("Please select a resume");
      }

      const formData = new FormData();
      formData.append("resume", resume);

      const token = await getToken();

      const { data } = await axios.post(
        `${backendUrl}/api/users/update-resume`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        toast.success("Resume updated successfully");
        await fetchUserData();
        setIsEdit(false);
        setResume(null);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <>
      <Navbar />

      <div className="container px-4 min-h-[65vh] 2xl:px-20 mx-auto my-10">

        {/* ================= RESUME SECTION ================= */}

        <h2 className="text-xl font-semibold">Your Resume</h2>

        <div className="flex gap-2 mb-8 mt-3">
          {isEdit || (userData && !userData.resume) ? (
            <label className="flex items-center gap-2">
              <p className="bg-blue-100 text-blue-600 px-4 py-2 rounded-lg cursor-pointer">
                {resume ? resume.name : "Select Resume"}
              </p>

              <input
                type="file"
                accept="application/pdf"
                hidden
                onChange={(e) => setResume(e.target.files[0])}
              />

              <button
                onClick={updateResume}
                className="bg-green-100 border border-green-400 rounded-lg px-4 py-2"
              >
                Save
              </button>
            </label>
          ) : (
            <div className="flex gap-2">
              <a
                href={userData?.resume}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-100 text-blue-600 px-4 py-2 rounded-lg"
              >
                View Resume
              </a>

              <button
                onClick={() => setIsEdit(true)}
                className="border border-gray-300 px-4 py-2 rounded-lg"
              >
                Edit
              </button>
            </div>
          )}
        </div>

        {/* ================= APPLIED JOBS ================= */}

        <h2 className="text-xl font-semibold mb-4">
          Jobs Applied
        </h2>

        {authLoading || loading ? (
          <p>Loading...</p>
        ) : userApplications.length === 0 ? (
          <p className="text-gray-500">
            No applications found
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left">Company</th>
                  <th className="px-4 py-3 text-left">Job Title</th>
                  <th className="px-4 py-3 text-left">Location</th>
                  <th className="px-4 py-3 text-left">Date</th>
                  <th className="px-4 py-3 text-left">Status</th>
                </tr>
              </thead>

              <tbody>
                {userApplications.map((item) => (
                  <tr key={item._id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3 flex items-center gap-2">
                      <img
                        src={item.companyId?.image}
                        className="h-6 w-6 rounded"
                        alt=""
                      />
                      {item.companyId?.name}
                    </td>

                    <td className="px-4 py-3">
                      {item.jobId?.title}
                    </td>

                    <td className="px-4 py-3">
                      {item.jobId?.location}
                    </td>

                    <td className="px-4 py-3">
                      {moment(item.date).format("MMM DD, YYYY")}
                    </td>

                    <td className="px-4 py-3">
                      <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm">
                        {item.status || "Pending"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>

      <Footer />
    </>
  );
};

export default Application;