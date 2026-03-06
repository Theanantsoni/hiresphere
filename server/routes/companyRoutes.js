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

const router = express.Router();


/* ================= AUTH ROUTES ================= */

// Register Company (with logo)
router.post(
  "/register",
  upload.single("image"),
  registerCompany
);

// Verify OTP
router.post(
  "/verify-otp",
  verifyCompanyOtp
);

// Login
router.post(
  "/login",
  companyLogin
);


/* ================= COMPANY DATA ================= */

// Get logged in company data
router.get(
  "/company",
  protectCompany,
  getCompanyData
);


/* ================= COMPANY PROFILE ================= */

// Update company profile (CEO only)
router.post(
  "/update-profile",
  protectCompany,
  upload.single("ceoPhoto"),
  updateCompanyProfile
);


/* ================= COMPANY EMPLOYEES ================= */

// Update company employees
router.post(
  "/update-employees",
  protectCompany,
  upload.array("employeePhotos", 20),
  updateCompanyEmployees
);


/* ================= JOB MANAGEMENT ================= */

// Post new job
router.post(
  "/post-job",
  protectCompany,
  postJob
);

// List company jobs
router.get(
  "/list-jobs",
  protectCompany,
  getCompanyPostedJobs
);

// Get job applicants
router.get(
  "/applicants",
  protectCompany,
  getJobApplicants
);


/* ================= JOB ACTIONS ================= */

// Change application status
router.post(
  "/change-status",
  protectCompany,
  changeApplicationStatus
);

// Toggle job visibility
router.post(
  "/change-visibility",
  protectCompany,
  changeVisibility
);


export default router;