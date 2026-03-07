import express from "express";

import {
  registerCompany,
  verifyCompanyOtp,
  companyLogin,
  getCompanyData,
  postJob,
  getCompanyPostedJobs,
  getJobApplicants,
  changeApplicationStatus,
  changeVisibility,
  updateCompanyProfile,
  updateCompanyEmployees
} from "../controller/companyController.js";

import upload from "../config/multer.js";
import { protectCompany } from "../middleware/authMiddleware.js";
import Company from "../models/Company.js";

const router = express.Router();


/* ================= AUTH ROUTES ================= */

router.post(
  "/register",
  upload.single("image"),
  registerCompany
);

router.post(
  "/verify-otp",
  verifyCompanyOtp
);

router.post(
  "/login",
  companyLogin
);


/* ================= COMPANY DATA ================= */

router.get(
  "/company",
  protectCompany,
  getCompanyData
);


/* ================= COMPANY PROFILE ================= */

router.post(
  "/update-profile",
  protectCompany,
  upload.single("ceoPhoto"),
  updateCompanyProfile
);


/* ================= COMPANY EMPLOYEES ================= */

router.post(
  "/update-employees",
  protectCompany,
  upload.array("employeePhotos", 20),
  updateCompanyEmployees
);


/* ================= JOB MANAGEMENT ================= */

router.post(
  "/post-job",
  protectCompany,
  postJob
);

router.get(
  "/list-jobs",
  protectCompany,
  getCompanyPostedJobs
);

router.get(
  "/applicants",
  protectCompany,
  getJobApplicants
);


/* ================= JOB ACTIONS ================= */

router.post(
  "/change-status",
  protectCompany,
  changeApplicationStatus
);

router.post(
  "/change-visibility",
  protectCompany,
  changeVisibility
);


/* ================= PUBLIC COMPANY ROUTES ================= */

// Get all companies
router.get("/", async (req, res) => {
  try {
    const companies = await Company.find().select("-password");
    res.json(companies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single company
router.get("/:id", async (req, res) => {
  try {
    const company = await Company.findById(req.params.id).select("-password");
    res.json(company);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;