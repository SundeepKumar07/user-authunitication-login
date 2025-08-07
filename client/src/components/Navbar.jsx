import React, { useContext } from 'react';
import './styleSheets/Navbar.css';
import { Link, useNavigate } from "react-router-dom";
import { assets } from '../assets/assets'
import { AppContent } from '../context/appContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const Navbar = () => {
  const navigate = useNavigate();
  const { UserData, setUserData,setIsLoggedIn, backendurl } = useContext(AppContent);

  const logout = async() => {
    try {
      axios.defaults.withCredentials = true;
      const {data} = await axios.post(backendurl + '/api/auth/logout');
      data.success && setIsLoggedIn(false);
      data.success && setUserData(false);
      toast.success(toast.message)
    } catch (error) {
      toast.error(error.message)
    }
  }

  const verifyEmail = async () => {
    try {
      axios.defaults.withCredentials = true;
      const {data} = await axios.post(backendurl + '/api/auth/send-verify-otp');
      if(data.success){
        navigate('/verify-email');
        toast.success("An otp sent to your email. Check Inbox");
      }
    } catch (error) {
      toast.error(error.message)
    }
  }
  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          {/* Logo on the left */}
          <Link to="/">
            <img src={assets.logo} alt="" className="navbar-logo" />
          </Link>

          {/* Navigation items on the right */}
          {UserData ? <div className='profile'>
            <div className="icon">
              {UserData.name.split("")[0].toUpperCase()}
              <div className="listItem">
                {!UserData.isAccountVerified?<li onClick={verifyEmail}>Verify</li> : <li className='notvisible'></li>}
                <li onClick={logout}>Logout</li>
              </div>
            </div>
          </div>
            : <div className="navbar-buttons">
              <button className="signin-btn" onClick={() => navigate('/login')}>Sign In</button>
            </div>}
        </div>
      </nav>
    </>
  );
};

export default Navbar;