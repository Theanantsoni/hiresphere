import { Webhook } from "svix";
import User from "../models/User.js";
import connectDB from "../config/db.js";

export const clerkWebhooks = async (req, res) => {
  try {
    console.log("🔥 Webhook route hit");

    // Ensure DB connection (IMPORTANT FOR VERCEL)
    await connectDB();

    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    const payload = req.body.toString(); // raw body
    const headers = {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    };

    const evt = whook.verify(payload, headers);

    const { data, type } = evt;

    console.log("Event Type:", type);

    switch (type) {
      case "user.created": {
        await User.create({
          _id: data.id,
          email: data.email_addresses[0].email_address,
          name: `${data.first_name || ""} ${data.last_name || ""}`,
          image: data.image_url,
          resume: "",
        });

        console.log("✅ User created in MongoDB");
        break;
      }

      case "user.updated": {
        await User.findByIdAndUpdate(data.id, {
          email: data.email_addresses[0].email_address,
          name: `${data.first_name || ""} ${data.last_name || ""}`,
          image: data.image_url,
        });
        break;
      }

      case "user.deleted": {
        await User.findByIdAndDelete(data.id);
        break;
      }

      default:
        break;
    }

    return res.status(200).json({ success: true });

  } catch (error) {
    console.error("❌ Webhook Error:", error.message);
    return res.status(400).json({ error: "Webhook failed" });
  }
};