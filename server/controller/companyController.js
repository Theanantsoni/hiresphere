import Company from "../models/Company.js";
import Job from "../models/Job.js";
import JobApplication from "../models/JobApplication.js";
import bcrypt from "bcrypt";
import cloudinary from "../config/cloudinary.js";
import generateToken from "../utils/generateToken.js";

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

/* ================= GET COMPANY POSTED JOBS ================= */

export const getCompanyPostedJobs = async (req, res) => {
  try {
    const jobs = await Job.find({
      companyId: req.companyId,
    }).sort({ date: -1 });

    res.json({
      success: true,
      jobsData: jobs,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= GET JOB APPLICANTS ================= */

export const getJobApplicants = async (req, res) => {
  try {
    const applications = await JobApplication.find({
      companyId: req.companyId,
    })
      .populate("userId", "name email resume")
      .populate("jobId", "title location");

    res.json({
      success: true,
      applications,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= CHANGE APPLICATION STATUS ================= */

export const changeApplicationStatus = async (req, res) => {
  try {
    const { id, status } = req.body;

    const application = await JobApplication.findById(id);

    if (!application) {
      return res.json({
        success: false,
        message: "Application not found",
      });
    }

    application.status = status;
    await application.save();

    res.json({
      success: true,
      message: "Application status updated",
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
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