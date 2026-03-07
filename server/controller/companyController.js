import Company from "../models/Company.js";
import Job from "../models/Job.js";
import JobApplication from "../models/JobApplication.js";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import generateToken from "../utils/generateToken.js";
import sendEmail from "../utils/sendEmail.js";
import streamifier from "streamifier";

/* ================= CLOUDINARY BUFFER UPLOAD ================= */

const uploadToCloudinary = (buffer, folder) => {
  return new Promise((resolve, reject) => {

    if (!buffer) return resolve({ secure_url: "" });

    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );

    streamifier.createReadStream(buffer).pipe(stream);

  });
};

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

    const imageUpload = await uploadToCloudinary(
      imageFile.buffer,
      "hiresphere_companies"
    );

    const hashedPassword = await bcrypt.hash(password, 10);

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await sendEmail(
      email,
      "HireSphere Email Verification",
      `Your OTP is ${otp}`
    );

    res.json({
      success: true,
      otp,
      tempCompany: {
        name,
        email,
        password: hashedPassword,
        image: imageUpload.secure_url,
      },
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

/* ================= VERIFY COMPANY OTP ================= */

export const verifyCompanyOtp = async (req, res) => {
  try {

    const { otp, userOtp, tempCompany } = req.body;

    if (otp !== userOtp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    const company = await Company.create({
      name: tempCompany.name,
      email: tempCompany.email,
      password: tempCompany.password,
      image: tempCompany.image,
      isVerified: true,
    });

    res.json({
      success: true,
      token: generateToken(company._id),
      company,
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
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, company.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    res.json({
      success: true,
      token: generateToken(company._id),
      company,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
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

/* ================= UPDATE COMPANY PROFILE ================= */

export const updateCompanyProfile = async (req, res) => {

  try {

    const company = await Company.findById(req.company._id);

    if (!company) {
      return res.json({ success: false, message: "Company not found" });
    }

    const { address, founded, ceoName } = req.body;

    let ceoPhotoUrl = company.ceoPhoto;

    if (req.file) {

      const upload = await uploadToCloudinary(
        req.file.buffer,
        "hiresphere_ceo"
      );

      ceoPhotoUrl = upload.secure_url;

    }

    company.address = address;
    company.founded = founded;
    company.ceoName = ceoName;
    company.ceoPhoto = ceoPhotoUrl;

    await company.save();

    res.json({
      success: true,
      message: "Company profile updated",
      company
    });

  } catch (error) {

    res.json({
      success: false,
      message: error.message,
    });

  }
};

/* ================= UPDATE COMPANY EMPLOYEES ================= */

export const updateCompanyEmployees = async (req, res) => {

  try {

    const company = await Company.findById(req.company._id);

    if (!company) {
      return res.json({
        success: false,
        message: "Company not found"
      });
    }

    /* ===== Parse Employees ===== */

    let employees = [];

    try {
      employees = JSON.parse(req.body.employees || "[]");
    } catch {
      employees = [];
    }

    /* ===== Upload Employee Photos ===== */

    const uploadedPhotos = [];

    if (req.files && req.files.length > 0) {

      for (const file of req.files) {

        const upload = await uploadToCloudinary(
          file.buffer,
          "hiresphere_employees"
        );

        uploadedPhotos.push(upload.secure_url);

      }

    }

    let photoIndex = 0;

    /* ===== Build Final Employees ===== */

    const finalEmployees = employees.map((emp) => {

      let photo = emp.photo || "";

      if (uploadedPhotos[photoIndex]) {
        photo = uploadedPhotos[photoIndex];
        photoIndex++;
      }

      /* ===== SAFE EXPERIENCE PARSE ===== */

      let experience = parseInt(emp.experience ?? 0);

      if (isNaN(experience) || experience < 0) {
        experience = 0;
      }

      return {
        name: emp.name?.trim() || "",
        position: emp.position?.trim() || "",
        experience: experience,
        photo: photo
      };

    });

    /* ===== Save To Database ===== */

    const updatedCompany = await Company.findByIdAndUpdate(
      req.company._id,
      { employees: finalEmployees },
      { new: true }
    );

    res.json({
      success: true,
      message: "Employees updated successfully",
      employees: updatedCompany.employees
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};

/* ================= POST JOB ================= */

export const postJob = async (req, res) => {

  try {

    const { title, description, location, salary, level, category } = req.body;

    const newJob = new Job({
      title,
      description,
      location,
      salary,
      level,
      category,
      companyId: req.company._id,
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

    const jobs = await Job.find({ companyId: req.company._id }).sort({ date: -1 });

    res.json({
      success: true,
      jobsData: jobs,
    });

  } catch (error) {

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
      companyId: req.company._id
    })

    .populate("jobId", "title location")

    .sort({ date: -1 });

    res.json({
      success: true,
      applications
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};

/* ================= CHANGE APPLICATION STATUS ================= */

export const changeApplicationStatus = async (req, res) => {

  try {

    const { id, status } = req.body;

    await JobApplication.findByIdAndUpdate(id, { status });

    res.json({
      success: true,
      message: "Status Changed",
    });

  } catch (error) {

    res.status(500).json({
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

/* ================= GET COMPANIES ================= */

export const getCompanies = async (req, res) => {
  try {

    const companies = await Company.find().select("-password");

    res.json(companies);

  } catch (error) {

    res.status(500).json({ message: error.message });

  }
};

/* ================= GET COMPANY BY ID ================= */

export const getCompanyById = async (req, res) => {
  try {

    const company = await Company.findById(req.params.id).select("-password");

    res.json(company);

  } catch (error) {

    res.status(500).json({ message: error.message });

  }
};