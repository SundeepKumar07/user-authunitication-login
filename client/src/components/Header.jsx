import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import './styleSheets/Header.css'
import { AppContent } from '../context/appContext'

export default function Header() {
  const { UserData } = useContext(AppContent);
  const name = UserData?.name?.split(" ")[0];
  console.log(name);
  return (
    <div className="home-container">
      <div className="home-content">
        <img src={assets.header_img} alt="Welcome illustration" className="home-image" />
        <h1>Hey {name ? name.charAt(0).toUpperCase() + name.slice(1).toLowerCase(): "Developer"}!</h1>
        <h2>Welcome to our app</h2>
        <p className="home-description">
          Let's start with a quick product tour and we will have you up and
          <br />
          running in no time!
        </p>
        <div className="home-buttons">
          <button className="view-products-btn">View products</button>
          <button className="get-started-btn">Get Started</button>
        </div>
      </div>
    </div>
  )
}
