import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/db.js";
import * as Sentry from "@sentry/node";
import { clerkWebhooks } from "./controller/webhooks.js";
import companyRoutes from "./routes/companyRoutes.js";
// import connectCloudinary from "./config/cloudinary.js";
import jobRoutes from "./routes/jobRoutes.js";
import userRoutes from "./routes/userRoutes.js";
// import {clerkMiddleware} from "@clerk/express";



// Initialize Sentry (SAFE VERSION)
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
});

// Initialize Express
const app = express();

// Connect to Database
connectDB();

// await connectCloudinary()



// IMPORTANT: Clerk webhook needs raw body
app.use(
  "/webhooks",
  express.raw({ type: "application/json" })
);

// Middlewares
app.use(cors());
app.use(express.json());
// app.use(clerkMiddleware());

// Routes
app.get("/", (req, res) => {
  res.status(200).send("API Working");
});

app.get("/debug-sentry", (req, res) => {
  throw new Error("Test Sentry error");
});

// Webhook Route
app.post("/webhooks", clerkWebhooks);
app.use("/api/company", companyRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/users', userRoutes);

// Sentry Error Handler (must be last)
Sentry.setupExpressErrorHandler(app);

// Global Error Handler (VERY IMPORTANT FOR VERCEL)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal Server Error" });
});

// Only run locally (not on Vercel)
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export for Vercel
export default app;