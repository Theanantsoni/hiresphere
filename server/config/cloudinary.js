import { v2 as cloudinary } from "cloudinary";

const connectCloudinary = () => {
  try {

    if (
      !process.env.CLOUDINARY_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      throw new Error("Cloudinary environment variables are missing");
    }

    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
    });

    console.log("☁️ Cloudinary Connected");

  } catch (error) {
    console.error("❌ Cloudinary Connection Error:", error.message);
  }
};

export default connectCloudinary;