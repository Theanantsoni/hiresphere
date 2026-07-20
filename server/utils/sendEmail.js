import SibApiV3Sdk from "sib-api-v3-sdk";

/* ================= CLIENT ================= */

const client = SibApiV3Sdk.ApiClient.instance;

const apiKey = client.authentications["api-key"];
apiKey.apiKey = process.env.BREVO_API_KEY;

const tranEmailApi = new SibApiV3Sdk.TransactionalEmailsApi();

/* ================= EMAIL TEMPLATE ================= */

const generateOTPTemplate = (otp) => {
  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<title>HireSphere OTP</title>
</head>

<body style="margin:0;padding:30px;background:#f5f5f5;font-family:Arial,sans-serif;">

<div style="max-width:520px;margin:auto;background:#ffffff;border-radius:12px;padding:30px;box-shadow:0 5px 20px rgba(0,0,0,.08);">

<h2 style="margin-top:0;color:#2563eb;">
HireSphere Password Reset
</h2>

<p>Hello,</p>

<p>Your password reset OTP is:</p>

<div
style="
font-size:36px;
font-weight:bold;
letter-spacing:8px;
color:#2563eb;
text-align:center;
margin:30px 0;
">
${otp}
</div>

<p>This OTP will expire in <b>10 minutes</b>.</p>

<p>Please do not share this OTP with anyone.</p>

<hr style="margin:30px 0;border:none;border-top:1px solid #eee;">

<p style="font-size:13px;color:#777;">
This is an automated email from HireSphere.
</p>

</div>

</body>
</html>
`;
};

/* ================= SEND EMAIL ================= */

const sendEmail = async (to, subject, otp) => {
  try {
    console.log("📧 Sending email to:", to);

    const result = await tranEmailApi.sendTransacEmail({
      sender: {
        name: "HireSphere",
        email: "mranantsoni7@gmail.com",
      },

      to: [
        {
          email: to,
        },
      ],

      subject,

      htmlContent: generateOTPTemplate(otp),
    });

    console.log("✅ Email Sent Successfully");
    console.log(result);

    return result;
  } catch (err) {
    console.error("❌ Email Error");
    console.error(err.response?.body || err);

    throw err;
  }
};

export default sendEmail;