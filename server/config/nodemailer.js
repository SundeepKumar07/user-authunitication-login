// config/mailer.js
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  auth: {
    user: process.env.SMTP_USER, // your verified sender email
    pass: process.env.SMTP_PASS,
  },
});

export default transporter;
