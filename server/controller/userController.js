import User from "../models/User.js";
import Job from "../models/Job.js";
import JobApplication from "../models/JobApplication.js";
import { v2 as cloudinary } from "cloudinary";
import { clerkClient } from "@clerk/express";

/* ================= GET USER DATA ================= */

export const getUserData = async (req, res) => {
  try {

    const userId = req.auth?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    /* ===== FETCH CLERK USER ===== */

    const clerkUser = await clerkClient.users.getUser(userId);

    if (!clerkUser) {
      return res.status(404).json({
        success: false,
        message: "Clerk user not found"
      });
    }

    const email =
      clerkUser.emailAddresses?.[0]?.emailAddress || "";

    const name =
      `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim();

    const image =
      clerkUser.imageUrl || "";

    /* ===== FIND USER ===== */

    let user = await User.findOne({ clerkId: userId });

    if (!user) {

      user = await User.findOne({ email });

      if (user) {

        user.clerkId = userId;
        user.name = name;
        user.email = email;
        user.image = image;

        await user.save();

      } else {

        user = await User.create({
          clerkId: userId,
          name,
          email,
          image
        });

      }

    } else {

      user.name = name;
      user.email = email;
      user.image = image;

      await user.save();

    }

    return res.status(200).json({
      success: true,
      user
    });

  } catch (error) {

    console.error("GET USER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching user"
    });

  }
};

/* ================= APPLY FOR JOB ================= */

export const applyForJob = async (req, res) => {

  try {

    const { jobId } = req.body;
    const clerkId = req.auth.userId;

    /* ===== FIND USER FROM DATABASE ===== */

    const user = await User.findOne({ clerkId });

    if (!user) {
      return res.json({
        success: false,
        message: "User not found"
      });
    }

    /* ===== FIND JOB ===== */

    const job = await Job.findById(jobId);

    if (!job) {
      return res.json({
        success: false,
        message: "Job not found"
      });
    }

    /* ===== CHECK IF ALREADY APPLIED ===== */

    const alreadyApplied = await JobApplication.findOne({
      jobId,
      userId: user._id
    });

    if (alreadyApplied) {
      return res.json({
        success: false,
        message: "Already Applied"
      });
    }

    /* ===== CREATE JOB APPLICATION ===== */

    await JobApplication.create({

      userId: user._id,
      jobId,
      companyId: job.companyId,

      /* STORE USER DATA */

      name: user.name,
      email: user.email,
      image: user.image,
      resume: user.resume || "",

      status: "Pending",
      date: Date.now()

    });

    return res.json({
      success: true,
      message: "Applied successfully"
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message
    });

  }

};

/* ================= GET USER APPLICATIONS ================= */

export const getUserJobApplications = async (req, res) => {

  try {

    const clerkId = req.auth.userId;

    const user = await User.findOne({ clerkId });

    if (!user) {
      return res.json({
        success: false,
        message: "User not found"
      });
    }

    const applications = await JobApplication.find({
      userId: user._id
    })
      .populate("companyId", "name email image")
      .populate(
        "jobId",
        "title description location category level salary"
      );

    return res.json({
      success: true,
      applications
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message
    });

  }

};

/* ================= UPDATE USER RESUME ================= */

export const updateUserResume = async (req, res) => {

  try {

    const clerkId = req.auth.userId;
    const resumeFile = req.file;

    if (!resumeFile) {
      return res.json({
        success: false,
        message: "No file uploaded"
      });
    }

    const resumeUpload = await cloudinary.uploader.upload(
      resumeFile.path,
      {
        folder: "hiresphere_resumes"
      }
    );

    const user = await User.findOneAndUpdate(
      { clerkId },
      {
        resume: resumeUpload.secure_url
      },
      { new: true }
    );

    return res.json({
      success: true,
      message: "Resume updated successfully",
      user
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message
    });

  }

};