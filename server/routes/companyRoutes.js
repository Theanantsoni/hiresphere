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
} from "../controller/companyController.js";

import upload from "../config/multer.js";
import { protectCompany } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ================= AUTH ROUTES ================= */

// Register Company (Send OTP)
router.post("/register", upload.single("image"), registerCompany);

// Verify Email OTP
router.post("/verify-otp", verifyCompanyOtp);

// Company Login
router.post("/login", companyLogin);


/* ================= COMPANY DATA ================= */

// Get company profile data
router.get("/company", protectCompany, getCompanyData);


/* ================= JOB MANAGEMENT ================= */

// Post new job
router.post("/post-job", protectCompany, postJob);

// Get company posted jobs
router.get("/list-jobs", protectCompany, getCompanyPostedJobs);

// Get applicants for company jobs
router.get("/applicants", protectCompany, getJobApplicants);


/* ================= JOB ACTIONS ================= */

// Change application status
router.post("/change-status", protectCompany, changeApplicationStatus);

// Toggle job visibility
router.post("/change-visibility", protectCompany, changeVisibility);


export default router;