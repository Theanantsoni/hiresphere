import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  clerkId: {            // 🔥 MUST EXIST
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  image: {
    type: String,
    default: "",
  },
  resume: {
    type: String,
    default: "",
  },
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;