import React, { useState } from 'react';
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
      setStatus('If an account exists, a reset link has been sent to your email.');
    } catch (err) {
      setStatus('Error sending reset email.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg text-center">
        <h2 className="text-xl font-bold mb-4">Reset Password</h2>
        <p className="text-gray-600 mb-6 text-sm">Enter your email and we'll send you a recovery link.</p>
        <form onSubmit={handleReset}>
          <input type="email" placeholder="Enter email" className="w-full p-2 border rounded mb-4" 
            value={email} onChange={(e) => setEmail(e.target.value)} required />
          <button type="submit" className="w-full py-2 bg-gray-800 text-white rounded">Send Link</button>
        </form>
        {status && <p className="mt-4 text-sm text-blue-600">{status}</p>}
      </div>
    </div>
  );
};

export default ForgotPassword;