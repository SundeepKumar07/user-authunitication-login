import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/home'
import LOGIN from './pages/LOGIN.JSX'
import ResetPass from './pages/ResetPass'
import VerifyEmail from './pages/VerifyEmail'
import { ToastContainer, toast } from 'react-toastify';

export default function App() {
  return (
    <div>
      <ToastContainer/>
      <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/login' element={<LOGIN/>}/>
          <Route path='/reset-password' element={<ResetPass/>}/>
          <Route path='/verify-email' element={<VerifyEmail/>}/>
      </Routes> 
    </div>
  )
}
