import React, { useContext, useEffect, useRef, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { useNavigate } from "react-router-dom";
import { JobCategories, JobLocations } from "../assets/assets";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";

const AddJob = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("Bangalore");
  const [category, setCategory] = useState("Programming");
  const [level, setLevel] = useState("Beginner");
  const [salary, setSalary] = useState("");

  const editorRef = useRef(null);
  const quillRef = useRef(null);

  const { backendUrl, companyToken } = useContext(AppContext);

  /* ================= SUBMIT ================= */

  const onsubmitHandler = async (e) => {
    e.preventDefault();

    if (!companyToken) {
      toast.error("Please login again");
      return;
    }

    const description = quillRef.current.root.innerHTML;

    if (!description || description === "<p><br></p>") {
      toast.error("Job description is required");
      return;
    }

    try {
      const { data } = await axios.post(
        `${backendUrl}/api/company/post-job`,
        {
          title,
          description,
          location,
          salary: Number(salary),
          category,
          level,
        },
        {
          headers: { token: companyToken },
        }
      );

      if (data.success) {
        toast.success("Job Added Successfully");
        setTitle("");
        setSalary("");
        quillRef.current.root.innerHTML = "";
        navigate("/dashboard/manage-jobs");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to add job");
    }
  };

  /* ================= QUILL INIT ================= */

  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
        modules: {
          toolbar: [
            [{ header: [1, 2, 3, false] }],
            ["bold", "italic", "underline"],
            ["link"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["clean"],
          ],
        },
      });
    }
  }, []);

  /* ================= UI ================= */

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <form
        onSubmit={onsubmitHandler}
        className="w-full max-w-3xl bg-white p-8 rounded-2xl shadow-lg space-y-6"
      >
        <h2 className="text-2xl font-semibold text-gray-800">
          Add New Job
        </h2>

        {/* Job Title */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-600">
            Job Title
          </label>
          <input
            type="text"
            placeholder="React Developer"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-black outline-none"
          />
        </div>

        {/* Job Description */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-600">
            Job Description
          </label>

          <div className="border rounded-xl overflow-hidden">
            <div
              ref={editorRef}
              className="min-h-[150px] bg-white"
            />
          </div>
        </div>

        {/* Category / Location / Level */}
        <div className="grid sm:grid-cols-3 gap-4">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-4 py-3 border rounded-xl focus:ring-2 focus:ring-black outline-none"
          >
            {JobCategories.map((item, index) => (
              <option key={index} value={item}>
                {item}
              </option>
            ))}
          </select>

          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="px-4 py-3 border rounded-xl focus:ring-2 focus:ring-black outline-none"
          >
            {JobLocations.map((item, index) => (
              <option key={index} value={item}>
                {item}
              </option>
            ))}
          </select>

          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="px-4 py-3 border rounded-xl focus:ring-2 focus:ring-black outline-none"
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Senior">Senior</option>
          </select>
        </div>

        {/* Salary */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-600">
            Salary
          </label>
          <input
            type="number"
            min={0}
            placeholder="500000"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
            required
            className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-black outline-none"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition"
        >
          Add Job
        </button>
      </form>
    </div>
  );
};

export default AddJob;