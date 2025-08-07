import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY); // keep your key in .env

export const sendEmail = async (email, sub, description) => {
  try {
    const response = await resend.emails.send({
        from: process.env.COMPANY,
        to: email,
        subject: sub,
        text: description 
    });
    console.log('Email sent:', response);
    return response;
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
  }
};

// import transporter from '../config/nodemailer.js';

// export const sendEmail = async (email, sub, description) => {
//   try {
//     const response = {
//       from: process.env.SENDER_EMAIL,  // ✅ This must be verified in Brevo
//       to: email,
//       subject: sub,
//       text: description 
//     };
    
//     console.log('Email sent:', response);
//     return await transporter.sendMail(response);

//   } catch (error) {
//     console.error('Failed to send email:', error);
//     throw error;
//   }
// };