import express from "express";
import cors from "cors";
import "dotenv/config";
// import connectDB from "./config/db.js";
import * as Sentry from "@sentry/node";
import { clerkWebhooks } from "./controller/webhooks.js";

// Initialize Sentry (SAFE VERSION)
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
});

// Initialize Express
const app = express();

// Connect to Database
// connectDB();

// Middlewares
app.use(cors());

// IMPORTANT: Clerk webhook needs raw body
app.use(
  "/webhooks",
  express.raw({ type: "application/json" })
);

app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.status(200).send("API Working");
});

app.get("/debug-sentry", (req, res) => {
  throw new Error("Test Sentry error");
});

// Webhook Route
app.post("/webhooks", clerkWebhooks);

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