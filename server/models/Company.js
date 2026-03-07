import mongoose from "mongoose";

/* ================= EMPLOYEE SCHEMA ================= */

const employeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    position: {
      type: String,
      required: true,
      trim: true
    },

    experience: {
      type: Number,
      default: 0,      // prevents missing field bug
      min: 0
    },

    photo: {
      type: String,
      default: null
    }
  },
  {
    _id: false
  }
);

/* ================= COMPANY SCHEMA ================= */

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please use valid email"],
      index: true
    },

    password: {
      type: String,
      required: true
    },

    image: {
      type: String,
      required: true
    },

    /* ===== Verification ===== */

    isVerified: {
      type: Boolean,
      default: true
    },

    /* ===== Company Info ===== */

    address: {
      type: String,
      default: "",
      trim: true
    },

    founded: {
      type: Number,
      default: null
    },

    /* ===== CEO ===== */

    ceoName: {
      type: String,
      default: "",
      trim: true
    },

    ceoPhoto: {
      type: String,
      default: null
    },

    /* ===== Employees ===== */

    employees: {
      type: [employeeSchema],
      default: []
    }
  },
  {
    timestamps: true
  }
);

/* ================= MODEL ================= */

const Company = mongoose.model("Company", companySchema);

export default Company;