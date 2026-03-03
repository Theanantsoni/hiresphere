import Company from "../models/Company.js";
import Job from "../models/Job.js";
import JobApplication from "../models/JobApplication.js";
import bcrypt from "bcrypt";
import cloudinary from "../config/cloudinary.js";
import generateToken from "../utils/generateToken.js";
import User from "../models/User.js";
import mongoose from "mongoose";

/* ================= REGISTER COMPANY ================= */

export const registerCompany = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const imageFile = req.file;

    if (!name || !email || !password || !imageFile) {
      return res.status(400).json({
        success: false,
        message: "All fields including image are required",
      });
    }

    const companyExists = await Company.findOne({ email });

    if (companyExists) {
      return res.status(400).json({
        success: false,
        message: "Company already registered",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
      folder: "hiresphere_companies",
    });

    const company = await Company.create({
      name,
      email,
      password: hashedPassword,
      image: imageUpload.secure_url,
    });

    res.status(201).json({
      success: true,
      company: {
        _id: company._id,
        name: company.name,
        email: company.email,
        image: company.image,
      },
      token: generateToken(company._id),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= COMPANY LOGIN ================= */

export const companyLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const company = await Company.findOne({ email });

    if (!company) {
      return res.json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, company.password);

    if (!isMatch) {
      return res.json({
        success: false,
        message: "Invalid email or password",
      });
    }

    res.json({
      success: true,
      company: {
        _id: company._id,
        name: company.name,
        email: company.email,
        image: company.image,
      },
      token: generateToken(company._id),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/* ================= GET COMPANY DATA ================= */

export const getCompanyData = async (req, res) => {
  try {
    res.json({
      success: true,
      company: req.company,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= POST JOB ================= */

export const postJob = async (req, res) => {
  try {
    const { title, description, location, salary, level, category } =
      req.body;

    const newJob = new Job({
      title,
      description,
      location,
      salary,
      level,
      category,
      companyId: req.companyId,
      date: Date.now(),
      visible: true,
    });

    await newJob.save();

    res.json({
      success: true,
      message: "Job posted successfully",
      job: newJob,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export const getCompanyPostedJobs = async (req, res) => {
  try {
    const companyId = req.companyId;

    const jobs = await Job.find({
      companyId,
    }).sort({ date: -1 });

    const jobsWithCount = await Promise.all(
      jobs.map(async (job) => {
        const applicantCount = await JobApplication.countDocuments({
          jobId: job._id,
          companyId: companyId,
          status: "Pending",
        });

        return {
          ...job._doc,
          applicantCount,
        };
      })
    );

    res.json({
      success: true,
      jobsData: jobsWithCount,
    });

  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Server Error",
    });
  }
};

/* ================= GET JOB APPLICANTS ================= */

export const getJobApplicants = async (req, res) => {
  try {

    const applications = await JobApplication.find({
      companyId: req.companyId,
    }).populate("jobId", "title location category level salary");

    // 🔥 Get all users in one query
    const users = await User.find({
      clerkId: { $in: applications.map(app => app.userId) }
    });

    // 🔥 Create lookup map
    const userMap = {};
    users.forEach(user => {
      userMap[user.clerkId] = user;
    });

    // 🔥 Attach user object
    const enrichedApplications = applications.map(app => ({
      ...app._doc,
      userId: userMap[app.userId]
    }));

    return res.json({
      success: true,
      applications: enrichedApplications,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= CHANGE APPLICATION STATUS ================= */

export const changeApplicationStatus = async (req, res) => {
  try {
    const { id, status } = req.body;

    if (!id || !status)
      return res.status(400).json({ success: false, message: "Missing data" });

    await JobApplication.findByIdAndUpdate(id, { status });

    res.json({ success: true, message: "Status Changed" });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ================= CHANGE JOB VISIBILITY ================= */

export const changeVisibility = async (req, res) => {
  try {
    const { id } = req.body;

    const job = await Job.findById(id);

    if (!job) {
      return res.json({
        success: false,
        message: "Job not found",
      });
    }

    if (job.companyId.toString() !== req.companyId.toString()) {
      return res.json({
        success: false,
        message: "Not authorized",
      });
    }

    job.visible = !job.visible;
    await job.save();

    res.json({
      success: true,
      message: "Job visibility updated",
      job,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};