import { Webhook } from "svix";
import User from "../models/User.js";

export const clerkWebhooks = async (req, res) => {
  try {
    console.log("🔥 Webhook route hit");

    // 1️⃣ Raw body ko string me convert karna zaroori hai
    const payload = req.body.toString();

    // 2️⃣ Svix instance
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    // 3️⃣ Verify webhook signature
    await whook.verify(payload, {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    });

    // 4️⃣ Parse payload AFTER verification
    const { data, type } = JSON.parse(payload);

    console.log("Event Type:", type);

    // ===============================
    //  USER CREATED
    // ===============================
    if (type === "user.created") {
      await User.create({
        _id: data.id,
        email: data.email_addresses[0].email_address,
        name: `${data.first_name || ""} ${data.last_name || ""}`,
        image: data.image_url,
        resume: "",
      });

      console.log("✅ User created in MongoDB");
    }

    // ===============================
    //  USER UPDATED
    // ===============================
    if (type === "user.updated") {
      await User.findByIdAndUpdate(data.id, {
        email: data.email_addresses[0].email_address,
        name: `${data.first_name || ""} ${data.last_name || ""}`,
        image: data.image_url,
      });

      console.log("🔄 User updated in MongoDB");
    }

    // ===============================
    //  USER DELETED
    // ===============================
    if (type === "user.deleted") {
      await User.findByIdAndDelete(data.id);
      console.log("❌ User deleted from MongoDB");
    }

    return res.status(200).json({ success: true });

  } catch (error) {
    console.log("❌ Webhook Error:", error.message);
    return res.status(400).json({ success: false });
  }
};