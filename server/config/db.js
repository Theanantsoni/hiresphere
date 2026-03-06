import mongoose from "mongoose";

let isConnected = false;

const connectDB = async () => {
  try {
    // Prevent multiple connections (important for serverless)
    if (isConnected) {
      return;
    }

    const connection = await mongoose.connect(process.env.MONGODB_URI, {
      bufferCommands: false,
    });

    isConnected = connection.connections[0].readyState === 1;

    console.log("✅ MongoDB Connected");

  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    process.exit(1);
  }
};

export default connectDB;