// sendOtp.js - Cloud Function/Serverless API for sending OTP to email
// You can deploy this as a Firebase Cloud Function or use with Netlify Functions

const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

// Configure nodemailer (use your SMTP provider or Gmail)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.OTP_EMAIL_USER,
    pass: process.env.OTP_EMAIL_PASS
  }
});

exports.handler = async function(event, context) {
  const { email } = JSON.parse(event.body);
  if (!email) return { statusCode: 400, body: 'Email required' };

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  console.log(`[DEBUG] OTP for ${email}: ${otp}`);

  // Store OTP in Firestore with expiry
  await admin.firestore().collection('otp_verifications').doc(email).set({
    otp,
    expires: Date.now() + 10 * 60 * 1000 // 10 min
  });

  // Send OTP email
  await transporter.sendMail({
    from: process.env.OTP_EMAIL_USER,
    to: email,
    subject: 'Your Visiora OTP Code',
    html: `<div style="font-family:sans-serif;font-size:1.2em;padding:2em;background:#f9f9f9;border-radius:12px;text-align:center;">
      <h2>Visiora Email Verification</h2>
      <p>Your OTP code is:</p>
      <div style="font-size:2em;font-weight:bold;letter-spacing:0.2em;background:#fff;padding:0.5em 1em;border-radius:8px;display:inline-block;">${otp}</div>
      <p>This code will expire in 10 minutes.</p>
    </div>`
  });

  return { statusCode: 200, body: JSON.stringify({ success: true }) };
};
