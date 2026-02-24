import React, { useContext, useEffect, useRef, useState } from "react";
import Quill from "quill";
import { useNavigate } from "react-router-dom";
import { JobCategories, JobLocations } from "../assets/assets";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";

const AddJob = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("Bangalore"); // ✅ fixed spelling
  const [category, setCategory] = useState("Programming");
  const [level, setLevel] = useState("Beginner level");
  const [salary, setSalary] = useState("");

  const editorRef = useRef(null);
  const quillRef = useRef(null);

  const { backendUrl, companyToken } = useContext(AppContext);

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
          salary: Number(salary), // ✅ convert to number
          category,
          level,
        },
        {
          headers: { token: companyToken },
        }
      );

      if (data.success) {
        toast.success(data.message);

        // Reset form
        setTitle("");
        setSalary("");
        quillRef.current.root.innerHTML = "";

        // ✅ Redirect to Manage Jobs
        navigate("/dashboard/manage-jobs");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to add job");
    }
  };

  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
      });
    }
  }, []);

  return (
    <form
      onSubmit={onsubmitHandler}
      className="container p-4 flex flex-col w-full items-start gap-4"
    >
      {/* Job Title */}
      <div className="w-full max-w-lg">
        <p className="mb-2 font-medium">Job Title</p>
        <input
          className="w-full px-3 py-2 border-2 border-gray-300 rounded"
          type="text"
          placeholder="Enter job title"
          onChange={(e) => setTitle(e.target.value)}
          value={title}
          required
        />
      </div>

      {/* Description */}
      <div className="w-full max-w-lg">
        <p className="mb-2 font-medium">Job Description</p>
        <div ref={editorRef} className="bg-white" />
      </div>

      {/* Category / Location / Level */}
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-lg">
        <div className="flex-1">
          <p className="mb-2 font-medium">Category</p>
          <select
            className="w-full px-3 py-2 border-2 border-gray-300 rounded"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {JobCategories.map((item, index) => (
              <option key={index} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1">
          <p className="mb-2 font-medium">Location</p>
          <select
            className="w-full px-3 py-2 border-2 border-gray-300 rounded"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          >
            {JobLocations.map((item, index) => (
              <option key={index} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1">
          <p className="mb-2 font-medium">Level</p>
          <select
            className="w-full px-3 py-2 border-2 border-gray-300 rounded"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
          >
            <option value="Beginner level">Beginner level</option>
            <option value="Intermediate level">Intermediate level</option>
            <option value="Senior level">Senior level</option>
          </select>
        </div>
      </div>

      {/* Salary */}
      <div className="w-full max-w-lg">
        <p className="mb-2 font-medium">Salary</p>
        <input
          className="w-full sm:w-[200px] px-3 py-2 border-2 border-gray-300 rounded"
          type="number"
          min={0}
          placeholder="Enter salary"
          value={salary}
          onChange={(e) => setSalary(e.target.value)}
          required
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-32 py-3 mt-4 bg-black text-white rounded hover:bg-gray-800 transition"
      >
        Add Job
      </button>
    </form>
  );
};

export default AddJob;