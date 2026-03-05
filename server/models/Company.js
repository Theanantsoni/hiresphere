import mongoose from "mongoose";

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
    },

    image: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },

    // Email verification
    isVerified: {
      type: Boolean,
      default: true,
    }

  },
  {
    timestamps: true, // 👈 automatically adds createdAt & updatedAt
  }
);

const Company = mongoose.model("Company", companySchema);

export default Company;