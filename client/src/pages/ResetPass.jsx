import React, { useContext, useState } from 'react';
import './stylesheets/VerifyEmail.css';
import { toast } from 'react-toastify';
import axios from 'axios';
import { AppContent } from '../context/appContext';
import { useNavigate } from 'react-router-dom';

export default function VerifyEmail() {
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { backendurl } = useContext(AppContent); // Assuming you're using "backendurl", not "localhost"

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (otp.length !== 6 || isNaN(otp)) {
      return toast.error("Please enter a valid 6-digit OTP");
    }

    try {
      const { data } = await axios.post(
        backendurl + '/api/auth/reset-password',
        { email, otp, newPassword: password},
        { withCredentials: true }
      );

      if (data.success) {
        toast.success(data.message);
        navigate('/');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="verify-container">
      <div className="verify-card">
        <h2 className="verify-title">Reset Password Verification</h2>
        <p className="verify-subtitle">Enter the 6-digit code sent to your email</p>

        <form onSubmit={handleSubmit}>
          <input
            className="verify-input"
            type="text"
            maxLength={6}
            value={otp}
            onChange={e => setOtp(e.target.value)}
            placeholder="Enter OTP"
            required
          />

          <input
            className="verify-input"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Enter Email"
            required
          />

          <input
            className="verify-input"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Enter new Password"
            required
          />

          <button className="verify-btn" type="submit">Verify</button>
        </form>
      </div>
    </div>
  );
}
