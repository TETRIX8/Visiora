// verifyOtp.js - Cloud Function/Serverless API for verifying OTP
const admin = require('firebase-admin');

exports.handler = async function(event, context) {
  const { email, otp } = JSON.parse(event.body);
  if (!email || !otp) return { statusCode: 400, body: 'Email and OTP required' };

  const doc = await admin.firestore().collection('otp_verifications').doc(email).get();
  if (!doc.exists) return { statusCode: 400, body: 'No OTP found for this email' };

  const data = doc.data();
  if (Date.now() > data.expires) return { statusCode: 400, body: 'OTP expired' };
  if (data.otp !== otp) return { statusCode: 400, body: 'Invalid OTP' };

  // Mark user as verified (custom claim or Firestore field)
  await admin.firestore().collection('users').doc(email).set({ verified: true }, { merge: true });
  await admin.firestore().collection('otp_verifications').doc(email).delete();

  return { statusCode: 200, body: JSON.stringify({ success: true }) };
};
