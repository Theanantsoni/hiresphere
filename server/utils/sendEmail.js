import nodemailer from "nodemailer";

/* ================= TRANSPORT ================= */

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/* ================= EMAIL TEMPLATE ================= */

const generateOTPTemplate = (otp) => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>
      body {
        margin: 0;
        padding: 0;
        background-color: #f4f7fb;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      }
      .container {
        max-width: 520px;
        margin: 40px auto;
        background: #ffffff;
        border-radius: 16px;
        overflow: hidden;
        box-shadow: 0 10px 25px rgba(0,0,0,0.08);
      }
      .header {
        background: linear-gradient(135deg, #2563eb, #1e3a8a);
        color: #fff;
        padding: 30px;
        text-align: center;
      }
      .header h1 {
        margin: 0;
        font-size: 24px;
        letter-spacing: 1px;
      }
      .content {
        padding: 30px;
        text-align: center;
        color: #333;
      }
      .content h2 {
        margin-bottom: 10px;
        color: #111;
      }
      .otp-box {
        margin: 25px auto;
        display: inline-block;
        padding: 15px 25px;
        font-size: 28px;
        font-weight: bold;
        letter-spacing: 8px;
        color: #2563eb;
        background: #eef2ff;
        border-radius: 10px;
      }
      .message {
        font-size: 14px;
        color: #666;
        margin-top: 10px;
      }
      .footer {
        text-align: center;
        padding: 20px;
        font-size: 12px;
        color: #999;
        border-top: 1px solid #eee;
      }
      .brand {
        font-weight: bold;
        color: #2563eb;
      }
      @media (max-width: 600px) {
        .container {
          margin: 20px;
        }
      }
    </style>
  </head>

  <body>

    <div class="container">

      <div class="header">
        <h1>HireSphere</h1>
        <p>Secure Authentication System</p>
      </div>

      <div class="content">
        <h2>Password Reset Request</h2>

        <p>Use the OTP below to reset your password</p>

        <div class="otp-box">${otp}</div>

        <p class="message">
          This OTP is valid for <strong>5 minutes</strong>.<br/>
          Do not share this code with anyone.
        </p>
      </div>

      <div class="footer">
        © ${new Date().getFullYear()} <span class="brand">HireSphere</span><br/>
        All rights reserved.
      </div>

    </div>

  </body>
  </html>
  `;
};

/* ================= SEND EMAIL ================= */

const sendEmail = async (to, subject, otp) => {
  try {
    await transporter.sendMail({
      from: `"HireSphere" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html: generateOTPTemplate(otp), // ✅ HTML mail
    });
  } catch (error) {
    console.error("Email Error:", error);
  }
};

export default sendEmail;