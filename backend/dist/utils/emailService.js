"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendWelcomeEmail = exports.sendOTPEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const createTransporter = () => {
    return nodemailer_1.default.createTransport({
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.EMAIL_PORT || '587'),
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
};
const sendOTPEmail = async (email, otp) => {
    const transporter = createTransporter();
    const mailOptions = {
        from: `"Government Helpdesk" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Password Reset OTP - Government Helpdesk Portal',
        html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset OTP</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5; }
          .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
          .header { background: linear-gradient(135deg, #f97316 0%, #0ea5e9 100%); padding: 30px; text-align: center; }
          .header h1 { color: #ffffff; margin: 0; font-size: 24px; }
          .content { padding: 40px 30px; }
          .otp-container { background-color: #f8fafc; border: 2px solid #e2e8f0; border-radius: 8px; padding: 30px; text-align: center; margin: 30px 0; }
          .otp-code { font-size: 36px; font-weight: bold; color: #0ea5e9; letter-spacing: 8px; margin: 20px 0; font-family: 'Courier New', monospace; }
          .footer { background-color: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0; }
          .footer p { margin: 5px 0; color: #64748b; font-size: 14px; }
          .security-notice { background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; }
          .govt-emblem { width: 32px; height: 32px; margin-right: 10px; vertical-align: middle; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🛡️ Government Helpdesk Portal</h1>
            <p style="color: #ffffff; margin: 10px 0 0 0; opacity: 0.9;">Digital India Initiative</p>
          </div>
          
          <div class="content">
            <h2 style="color: #1f2937; margin-bottom: 20px;">Password Reset Request</h2>
            
            <p style="color: #374151; line-height: 1.6; margin-bottom: 20px;">
              You have requested to reset your password for the Government Helpdesk Portal. 
              Please use the following One-Time Password (OTP) to complete the password reset process.
            </p>
            
            <div class="otp-container">
              <p style="color: #6b7280; margin: 0 0 10px 0; font-size: 14px;">Your OTP Code:</p>
              <div class="otp-code">${otp}</div>
              <p style="color: #ef4444; margin: 10px 0 0 0; font-size: 14px;">
                ⏰ This OTP will expire in 10 minutes
              </p>
            </div>
            
            <div class="security-notice">
              <p style="margin: 0; color: #92400e; font-size: 14px;">
                <strong>Security Notice:</strong> This OTP is confidential and should not be shared with anyone. 
                If you did not request this password reset, please ignore this email and contact system administrator.
              </p>
            </div>
            
            <p style="color: #374151; line-height: 1.6; margin-top: 30px;">
              If you're having trouble with the password reset process, please contact our support team 
              or visit the help section in the portal.
            </p>
          </div>
          
          <div class="footer">
            <p><strong>Government of India</strong></p>
            <p>Digital India Initiative</p>
            <p>This is an automated message. Please do not reply to this email.</p>
            <p>© 2025 Government of India. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
        text: `
      Government Helpdesk Portal - Password Reset OTP
      
      You have requested to reset your password for the Government Helpdesk Portal.
      
      Your OTP Code: ${otp}
      
      This OTP will expire in 10 minutes.
      
      Security Notice: This OTP is confidential and should not be shared with anyone.
      If you did not request this password reset, please ignore this email.
      
      © 2025 Government of India. All rights reserved.
    `
    };
    try {
        await transporter.sendMail(mailOptions);
        console.log(`OTP email sent successfully to ${email}`);
    }
    catch (error) {
        console.error('Error sending OTP email:', error);
        throw new Error('Failed to send OTP email');
    }
};
exports.sendOTPEmail = sendOTPEmail;
const sendWelcomeEmail = async (email, firstName) => {
    const transporter = createTransporter();
    const mailOptions = {
        from: `"Government Helpdesk" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Welcome to Government Helpdesk Portal',
        html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Government Helpdesk Portal</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5; }
          .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
          .header { background: linear-gradient(135deg, #f97316 0%, #0ea5e9 100%); padding: 30px; text-align: center; }
          .header h1 { color: #ffffff; margin: 0; font-size: 24px; }
          .content { padding: 40px 30px; }
          .footer { background-color: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🛡️ Government Helpdesk Portal</h1>
            <p style="color: #ffffff; margin: 10px 0 0 0; opacity: 0.9;">Digital India Initiative</p>
          </div>
          
          <div class="content">
            <h2 style="color: #1f2937;">Welcome, ${firstName}!</h2>
            <p style="color: #374151; line-height: 1.6;">
              Your account has been successfully created for the Government Helpdesk Portal. 
              You can now access the system using your credentials.
            </p>
          </div>
          
          <div class="footer">
            <p><strong>Government of India</strong></p>
            <p>© 2025 Government of India. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
    };
    try {
        await transporter.sendMail(mailOptions);
        console.log(`Welcome email sent successfully to ${email}`);
    }
    catch (error) {
        console.error('Error sending welcome email:', error);
        throw new Error('Failed to send welcome email');
    }
};
exports.sendWelcomeEmail = sendWelcomeEmail;
//# sourceMappingURL=emailService.js.map