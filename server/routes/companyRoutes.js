import express from 'express';
import { changeApplicationStatus, changeVisibility, companyLogin, getCompanyData, getCompanyPostedJobs, getJobApplicants, postJob, registerCompany } from '../controller/companyController.js';
import upload from '../config/multer.js';
import { protectCompany } from '../middleware/authMiddleware.js';

const router = express.Router();

// Register a company
router.post('/register',upload.single('image'), registerCompany);

// Company login
router.post('/login', companyLogin);

// Get company data
router.get('/company', protectCompany,  getCompanyData);

// Post a new job   
router.post('/post-job', protectCompany , postJob);

// Get job applicants data of company
router.get('/applicants', protectCompany , getJobApplicants); 

// Get Company Job List
router.get('/list-jobs', protectCompany, getCompanyPostedJobs);

// Change Job Application Status
router.post('/change-status', protectCompany, changeApplicationStatus);

// Change applications visibility
router.post('/change-visibility', protectCompany, changeVisibility);

export default router;
