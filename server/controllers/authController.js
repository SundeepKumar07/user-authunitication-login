import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';
// import transporter from '../config/nodemailer.js';
import { sendEmail } from '../utils/sendEmail.js';

export const register = async (req, res) => {

    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.json({ success: "false", message: "Missing Details" });
    }

    try {
        const existingUser = await userModel.findOne({ email });

        if (existingUser) {
            return res.json({ success: false, message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new userModel({ name, email, password: hashedPassword });
        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '7d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 3600 * 1000 // 7 days
        });

        // Sending welcome email
        // const mailOption = {
        //     from: process.env.SENDER_EMAIL, // ✅ fixed typo
        //     to: email,
        //     subject: 'Welcome to GreatStack',
        //     text: `Welcome to GreatStack. You are going to achieve one of the most successful platforms with ${email}.`,
        // };

        // await transporter.sendMail(mailOption);
        const mailBody = "Welcome to Sun Bright Web. Welcome to the Gate way and thank you for reaching us. You signed up with email: " + email;
        sendEmail(email, 'Welcome to Sun-Bright Web', mailBody);

        return res.json({ success: true, message: "Account Created Successfully" });

    } catch (error) {
        console.error("Registration error:", error.message); // helpful for debugging
        return res.json({ success: false, message: "Something Went Wrong" });
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.json({ success: "false", message: "Email and Password are Required" });
    }

    try {
        const user = await userModel.findOne({ email })
        if (!user) {
            return res.json({ success: "false", message: "User not found" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.json({ success: "false", message: "Invalid Password" })
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '7d' });
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            samesite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 3600 * 1000
        });
        return res.json({ success: true, message: "login successfully" });
    } catch(error) {
        res.json({ success: "false", message: error.message });
    }
}

export const logOut = (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            samesite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        })
        return res.json({ success: true, message: "Logged Out" });
    } catch {
        res.json({ success: false, message: error.message });
    }
}

export const sendVerifiedOtp = async (req, res)=>{
    try {
        const userId = req.userId; // ✅ Correct
        const user = await userModel.findById(userId);

        if(user.isAccountVerified){
            res.json({success: false, message: "user already verified"});
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));
        user.verifyOtp = otp;
        user.verifyOtpExpired = Date.now() + 24 * 3600 * 1000;
        await user.save();

        const mailBody = "your verification otp for sign up is " + otp + " for the email: " + user.email + " expiry time for otp is 24 hours";
        sendEmail(user.email,'Email Vefication OTP', mailBody);

        res.json({success: true, message: `Verification OTP send on ${user.email}. Check inbox`});

    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ success: false, message: "Session expired, please login again" });
        }
        return res.status(401).json({ success: false, message: "Invalid or missing token" });
    }
}

export const verifyEmail = async (req, res) => {
    const {otp} = req.body;
    const userId = req.userId;

    if(!userId || !otp){
        return res.json({success: false, message: "All field required"});
    }

    try {
        const user = await userModel.findById(userId);
        if(!user){
            return res.json({success: false, message: "user not found"});
        }

        if (user.verifyOtp === '' || user.verifyOtp !== otp) {
            return res.json({ success: false, message: "Invalid OTP" });
        }


        if(user.verifyOtpExpired < Date.now()){
            return res.json({success: false, message: "OTP Expired"});
        }

        user.isAccountVerified = true;
        user.verifyOtp = '';
        user.verifyOtpExpired = 0;

        await user.save();
        return res.json({success: true, message: "Email Verified Successfully"});

    } catch (error) {
        res.status(500).json({success: false, message: error.message});
    }
}

export const isAuthenticated = async (req, res)=>{
    try {
        return res.json({success: true})
    } catch (error) {
        res.status(500).json({success: false, message: error.message})   
    }
}

export const sendResetPassOTP = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ success: false, message: "Email is required" });
    }

    try {
        // ❌ Wrong: findOne(email) → ✅ Correct: findOne({ email })
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Generate 6-digit OTP
        const otp = String(Math.floor(100000 + Math.random() * 900000));
        user.resetOtp = otp;
        user.resetOtpExpired = Date.now() + 15 * 60 * 1000; // 15 minutes
        await user.save();

        const mailBody = `
            Your password reset OTP is <b>${otp}</b><br/>
            Email: <b>${user.email}</b><br/>
            OTP expires in <b>15 minutes</b>.
        `;

        await sendEmail(user.email, 'Reset Password OTP', mailBody);

        return res.json({
            success: true,
            message: `Verification OTP sent to ${user.email}. Check your inbox.`
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};


export const resetPassword = async (req,res) =>{
    const {email, otp, newPassword} = req.body;
    if(!email || !otp || !newPassword){
        res.status(401).json({success: false, message: "All field required"});
    }

    try {
        const user = await userModel.findOne({ email });

        if(!user){
            res.json({success: false, message: "User not found"});
        }

        if (user.resetOtp === '' || user.resetOtp !== otp) {
            return res.json({ success: false, message: "Invalid OTP" });
        }


        if(user.resetOtpExpired < Date.now()){
            return res.json({success: false, message: "OTP Expired"});
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetOtp = '';
        user.resetOtpExpired = 0;

        await user.save();
        return res.json({success: true, message: "Password has been changed Successfully"});

    } catch (error) {
        res.json({success: false, message: error.message});
    }
}