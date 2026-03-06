import mongoose from "mongoose";

/* ================= EMPLOYEE SCHEMA ================= */

const employeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    position: {
      type: String,
      required: true,
      trim: true,
    },

    experience: {
      type: String,
      required: true,
      trim: true,
    },

    photo: {
      type: String, // Cloudinary URL
      default: "",
    },
  },
  {
    _id: false, // prevents unnecessary MongoDB subdocument ids
  }
);

/* ================= COMPANY SCHEMA ================= */

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },

    password: {
      type: String,
      required: true,
    },

    image: {
      type: String, // company logo
      required: true,
    },

    /* ===== Email Verification ===== */

    isVerified: {
      type: Boolean,
      default: true,
    },

    /* ===== Company Profile ===== */

    address: {
      type: String,
      default: "",
      trim: true,
    },

    founded: {
      type: String,
      default: "",
      trim: true,
    },

    /* ===== CEO ===== */

    ceoName: {
      type: String,
      default: "",
      trim: true,
    },

    ceoPhoto: {
      type: String,
      default: "", // Cloudinary URL
    },

    /* ===== Employees ===== */

    employees: {
      type: [employeeSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

/* ================= MODEL ================= */

const Company = mongoose.model("Company", companySchema);

export default Company;