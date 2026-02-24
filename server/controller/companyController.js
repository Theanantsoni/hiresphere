import Company from "../models/Company.js";
import bcrypt from "bcrypt";
import cloudinary from "../config/cloudinary.js";
import generateToken from "../utils/generateToken.js";
import Job from "../models/Job.js";

// Register a new company
export const registerCompany = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const imageFile = req.file;

        // Validation
        if (!name || !email || !password || !imageFile) {
            return res.status(400).json({
                success: false,
                message: "All fields including image are required",
            });
        }

        // Check existing company
        const companyExists = await Company.findOne({ email });
        if (companyExists) {
            return res.status(400).json({
                success: false,
                message: "Company already registered",
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Upload image to Cloudinary
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
            folder: "hiresphere_companies",
        });

        // Create company
        const company = await Company.create({
            name,
            email,
            password: hashedPassword,
            image: imageUpload.secure_url,
        });

        // Response
        return res.status(201).json({
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
        console.error("Register Error:", error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Company login
export const companyLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
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
    console.log("Login Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Get company data

export const getCompanyData = async (req, res) => {
    // Logic to get company data
    // res.send('Company data retrieved successfully');

    const company = req.company

    try {
        res.json({
            success: true,
            company
        })

    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })
    }
};

// Post a new job 

export const postJob = async (req, res) => {
    // Logic to post a new job
    // res.send('Job posted successfully');

    const { title, description, location, salary, level, category } = req.body;

    const companyId = req.company._id;

    // console.log(companyId, {title, description, location, salary});

    try {
        const newJob = new Job({
            title,
            description,
            location,
            salary,
            companyId,
            date: Date.now(),
            level,
            category
        })
        await newJob.save();
        res.json({ success: true, newJob });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }

};

// Get Company Job Applicants

export const getJobApplicants = async (req, res) => {
    // Logic to get job applicants for a specific job
    res.send('Job applicants retrieved successfully');
};

// Get Company Posted Jobs

export const getCompanyPostedJobs = async (req, res) => {

    // Logic to get all jobs posted by the company

    // res.send('Posted jobs retrieved successfully');

    try {
        const companyId = req.company._id

        const jobs = await Job.find({ companyId })

        // (ToDo) Adding No. of applicants info in data
        res.json({ success: true, jobsData: jobs })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
};

// Change Job Application Status

export const changeApplicationStatus = async (req, res) => {
    // Logic to change the status of a job application
    res.send('Job application status changed successfully');
};

// Change job visibility

export const changeVisibility = async (req, res) => {
    // Logic to change the visibility of a job posting
    // res.send('Job visibility changed successfully');

    try{
        const {id} = req.body
        const companyId = req.company._id
        const job = await Job.findById(id)

        if(companyId.toString() === job.companyId.toString()){
        
            job.visible = !job.visible
        
        }
        await job.save()
        res.json({success: true, job})

    } catch(error){
        res.json({
            success: false,
            message: error.message
        })

    }
};

