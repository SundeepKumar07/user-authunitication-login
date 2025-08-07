import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './stylesheets/Login.css'
import { AppContent } from '../context/appContext.jsx';
import axios from 'axios';
import { toast } from 'react-toastify';

const LoginSignup = () => {

  const navigate = useNavigate()

  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { backendurl, setIsLoggedIn, getUserData } = useContext(AppContent);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      axios.defaults.withCredentials = true;
      if(!isLogin){
        const {data} =  await axios.post(backendurl + '/api/auth/register', {name, email, password});
        
        if(data.success === true){
          toast.success("Account created successful");
          getUserData();
          navigate('/');
          setIsLoggedIn(true)
        }
        else{
          toast.error(data.message);
        }
      }
      else{
        const {data} =  await axios.post(backendurl + '/api/auth/login', {email, password});
        
        if(data.success === true){
          toast.success("Login successful");
          getUserData();
          navigate('/');
          setIsLoggedIn(true)
        }
        else{
          toast.error(data.message);
        }
      }
    } catch (error) {
      // const message =
      //   error.data?.message || "Registration failed. Try again!";
      toast.error(error.message);
    }
  };

  const handleResetOtp = async () => {
    try {
      axios.defaults.withCredentials = true;
      const {data} = await axios.post(backendurl + '/api/auth/send-reset-otp', { email });
      if(data.success){
        navigate('/reset-password');
        toast.success("An otp sent to your email. Check Inbox");
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>{isLogin ? 'Login' : 'Create Account'}</h1>
        <p className="subtitle">{isLogin ? 'Welcome back!' : 'Create your account'}</p>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="fullName"
                placeholder="Enter your full name"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            {isLogin && (
              <div className="forgot-password">
                <a onClick={handleResetOtp}>Forgot password?</a>
              </div>
            )}
          </div>

          <button type="submit" className="auth-btn">
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>

        <div className="auth-switch">
          {isLogin ? (
            <p>Don't have an account? <span onClick={() => setIsLogin(false)}>Sign up</span></p>
          ) : (
            <p>Already have an account? <span onClick={() => setIsLogin(true)}>Login here</span></p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;