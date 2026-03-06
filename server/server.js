import express from "express";
import cors from "cors";
import "dotenv/config";

import * as Sentry from "@sentry/node";

import connectDB from "./config/db.js";
import connectCloudinary from "./config/cloudinary.js";

import { clerkMiddleware } from "@clerk/express";
import { clerkWebhooks } from "./controller/webhooks.js";

import companyRoutes from "./routes/companyRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import userRoutes from "./routes/userRoutes.js";

/* ================= SENTRY INIT ================= */

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
});

/* ================= EXPRESS APP ================= */

const app = express();

/* ================= DATABASE ================= */

connectDB();
connectCloudinary();

/* ================= WEBHOOK RAW BODY ================= */
/* Must be before json parser */

app.use(
  "/webhooks",
  express.raw({ type: "application/json" })
);

/* ================= MIDDLEWARE ================= */

app.use(cors());

app.use(
  express.json({
    limit: "10mb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb",
  })
);

/* ================= CLERK AUTH ================= */

app.use(clerkMiddleware());

/* ================= HEALTH CHECK ================= */

app.get("/", (req, res) => {
  res.status(200).send("API Working");
});

/* ================= SENTRY TEST ================= */

app.get("/debug-sentry", () => {
  throw new Error("Test Sentry Error");
});

/* ================= WEBHOOK ================= */

app.post("/webhooks", clerkWebhooks);

/* ================= API ROUTES ================= */

app.use("/api/company", companyRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/users", userRoutes);

/* ================= SENTRY ERROR HANDLER ================= */

Sentry.setupExpressErrorHandler(app);

/* ================= GLOBAL ERROR HANDLER ================= */

app.use((err, req, res, next) => {

  console.error("SERVER ERROR:", err);

  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });

});

/* ================= SERVER START ================= */

if (!process.env.VERCEL) {

  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });

}

/* ================= EXPORT ================= */

export default app;