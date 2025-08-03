import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Mail } from 'lucide-react';

const OtpModal = ({ email, onVerify, onClose, theme = 'glass' }) => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleVerify = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/verifyOtp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      });
      const data = await res.json();
      if (data.success) {
        onVerify();
      } else {
        setError(data.body || 'Invalid OTP');
      }
    } catch (err) {
      setError('Server error');
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-sm bg-white/10 dark:bg-slate-900/80 rounded-2xl shadow-xl border border-white/10 p-6 text-center backdrop-blur-md"
      >
        <ShieldCheck className="mx-auto mb-2 text-purple-500" size={32} />
        <h2 className="text-xl font-bold mb-1">Email Verification</h2>
        <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">Enter the OTP sent to <span className="font-mono text-purple-600">{email}</span></p>
        <div className="flex items-center gap-2 justify-center mb-4">
          <Mail size={20} className="text-purple-400" />
          <input
            type="text"
            maxLength={6}
            value={otp}
            onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
            className="w-24 px-3 py-2 rounded-lg bg-white/30 dark:bg-slate-800/40 text-center font-mono text-lg tracking-widest border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
            placeholder="OTP"
            autoFocus
          />
        </div>
        {error && <div className="text-red-500 mb-2 text-sm">{error}</div>}
        <button
          className="w-full py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold shadow-lg transition-all hover:scale-105 disabled:opacity-50"
          onClick={handleVerify}
          disabled={loading || otp.length !== 6}
        >
          {loading ? 'Verifying...' : 'Verify'}
        </button>
        <button
          className="mt-3 text-xs text-slate-400 hover:text-pink-500"
          onClick={onClose}
        >Cancel</button>
      </motion.div>
    </div>
  );
};

export default OtpModal;
