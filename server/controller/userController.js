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
        message: "Unauthorized",
      });
    }

    // 🔥 Fetch Clerk user safely
    const clerkUser = await clerkClient.users.getUser(userId);

    if (!clerkUser) {
      return res.status(404).json({
        success: false,
        message: "Clerk user not found",
      });
    }

    const email =
      clerkUser.emailAddresses?.[0]?.emailAddress || "";

    const name =
      `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim();

    const image = clerkUser.imageUrl || "";

    // 🔥 STEP 1: Try finding by clerkId first
    let user = await User.findOne({ clerkId: userId });

    if (!user) {
      // 🔥 STEP 2: If not found, try finding by email
      user = await User.findOne({ email });

      if (user) {
        // Attach clerkId if missing
        user.clerkId = userId;
        user.name = name;
        user.image = image;
        user.email = email;
        await user.save();
      } else {
        // 🔥 STEP 3: Create new user
        user = await User.create({
          clerkId: userId,
          name,
          email,
          image,
        });
      }
    } else {
      // 🔥 STEP 4: Update existing clerk user info
      user.name = name;
      user.image = image;
      user.email = email;
      await user.save();
    }

    return res.status(200).json({
      success: true,
      user,
    });

  } catch (error) {
    console.error("GET USER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching user",
    });
  }
};

/* ================= APPLY FOR JOB ================= */

export const applyForJob = async (req, res) => {
  try {
    const { jobId } = req.body;
    const userId = req.auth.userId;

    const job = await Job.findById(jobId);

    if (!job) {
      return res.json({
        success: false,
        message: "Job not found",
      });
    }

    // Check already applied
    const alreadyApplied = await JobApplication.findOne({
      jobId,
      userId,
    });

    if (alreadyApplied) {
      return res.json({
        success: false,
        message: "Already Applied",
      });
    }

    // Create application
    await JobApplication.create({
      userId,
      jobId,
      companyId: job.companyId,
      date: Date.now(),
      // status default = Pending (model handles it)
    });

    return res.json({
      success: true,
      message: "Applied successfully",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= GET USER APPLICATIONS ================= */

export const getUserJobApplications = async (req, res) => {
  try {
    const userId = req.auth.userId;

    const applications = await JobApplication.find({ userId })
      .populate("companyId", "name email image")
      .populate(
        "jobId",
        "title description location category level salary"
      );

    return res.json({
      success: true,
      applications,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= UPDATE USER RESUME ================= */

export const updateUserResume = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const resumeFile = req.file;

    if (!resumeFile) {
      return res.json({
        success: false,
        message: "No file uploaded",
      });
    }

    const resumeUpload = await cloudinary.uploader.upload(
      resumeFile.path,
      { folder: "hiresphere_resumes" }
    );

    // ✅ Update using clerkId (NOT _id)
    const user = await User.findOneAndUpdate(
      { clerkId: userId },
      { resume: resumeUpload.secure_url },
      { new: true }
    );

    return res.json({
      success: true,
      message: "Resume updated successfully",
      user,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};