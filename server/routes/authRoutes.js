import express from 'express';
import { isAuthenticated, login, logOut, register, resetPassword, sendResetPassOTP, sendVerifiedOtp, verifyEmail } from '../controllers/authController.js';
import userAuth from '../middleware/middleware.js';
const authRouter = express.Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout', logOut);
authRouter.post('/send-verify-otp',userAuth, sendVerifiedOtp);
authRouter.post('/verify-account',userAuth, verifyEmail);
authRouter.post('/is-auth',userAuth, isAuthenticated);
authRouter.post('/send-reset-otp', sendResetPassOTP);
authRouter.post('/reset-password', resetPassword);

export default authRouter;
