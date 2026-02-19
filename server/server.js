import "./config/instrument.js";
import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/db.js";
import * as Sentry from "@sentry/node";
import { clerkWebhooks } from "./controller/webhooks.js";

// Initialize Express
const app = express();

// Connect to Database
await connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("API Working");
});

app.get("/debug-sentry", (req, res) => {
  throw new Error("My first Sentry error!");
});

app.post("/webhooks", clerkWebhooks);

// Sentry Error Handler (must be after routes)
Sentry.setupExpressErrorHandler(app);

// ✅ Only run server locally (NOT on Vercel)
const PORT = process.env.PORT || 5000;

if (process.env.VERCEL !== "1") {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export for Vercel
export default app;