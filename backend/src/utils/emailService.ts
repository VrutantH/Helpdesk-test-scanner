import nodemailer from 'nodemailer';
import EmailConfig from '../models/EmailConfig';

// Get email transporter from database configuration
const getEmailTransporter = async (projectId?: string) => {
  try {
    const emailConfig = await EmailConfig.findOne(projectId ? { projectId } : {});
    
    if (!emailConfig || !emailConfig.smtpHost || !emailConfig.smtpUser || !emailConfig.smtpPassword) {
      console.log('⚠️  Email configuration not found or incomplete, using simulation mode');
      return null;
    }

    return nodemailer.createTransport({
      host: emailConfig.smtpHost,
      port: emailConfig.smtpPort || 587,
      secure: emailConfig.smtpSecure || false,
      auth: {
        user: emailConfig.smtpUser,
        pass: emailConfig.smtpPassword,
      },
    });
  } catch (error) {
    console.error('Failed to get email transporter:', error);
    return null;
  }
};

export const sendOTPEmail = async (email: string, otp: string, projectId?: string): Promise<boolean> => {
  try {
    console.log(`📧 [EMAIL SERVICE] Sending OTP to ${email}`);
    console.log(`🔑 OTP: ${otp}`);
    
    const transporter = await getEmailTransporter(projectId);
    
    if (!transporter) {
      console.log('✅ Email sent successfully (simulated)');
      return true;
    }

    const emailConfig = await EmailConfig.findOne(projectId ? { projectId } : {});
    
    // Get the student OTP trigger settings
    const trigger = emailConfig?.triggers?.studentOTP;
    
    // Check if email trigger is enabled
    if (!trigger?.enabled) {
      console.log('⚠️  Student OTP email trigger is disabled');
      return false;
    }
    
    // Default templates
    const defaultSubject = `Your OTP for {{projectName}}`;
    const defaultBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Password Reset Request</h2>
        <p>Hello {{studentName}},</p>
        <p>Your OTP for login is: {{otp}}</p>
        <div style="background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
          {{otp}}
        </div>
        <p>This OTP is valid for 10 minutes.</p>
        <p>If you did not request this, please ignore this email.</p>
        <p>Thank you!</p>
        <hr style="margin: 30px 0;">
        <p style="color: #666; font-size: 12px;">This is an automated message, please do not reply.</p>
      </div>
    `;
    
    // Get project name for replacement
    const projectName = emailConfig?.fromName || 'SAC Helpdesk';
    
    // Use template from config or default, then replace variables
    let subject = (trigger.subject || defaultSubject)
      .replace(/\{\{otp\}\}/g, otp)
      .replace(/\{\{projectName\}\}/g, projectName);
      
    let body = (trigger.body || defaultBody)
      .replace(/\{\{studentName\}\}/g, email.split('@')[0])
      .replace(/\{\{otp\}\}/g, otp)
      .replace(/\{\{projectName\}\}/g, projectName);
    
    console.log(`📧 Sending OTP email with subject: ${subject}`);
    
    await transporter.sendMail({
      from: `"${emailConfig?.fromName || 'SAC Helpdesk'}" <${emailConfig?.fromEmail || emailConfig?.smtpUser}>`,
      to: email,
      subject: subject,
      html: body,
    });
    
    console.log('✅ OTP email sent successfully via SMTP');
    return true;
  } catch (error) {
    console.error('❌ [EMAIL SERVICE] Failed to send OTP email:', error);
    console.error('Error details:', error);
    return false;
  }
};

export const sendVerificationEmail = async (email: string, token: string): Promise<boolean> => {
  try {
    console.log(`📧 [EMAIL SERVICE] Sending verification email to ${email}`);
    console.log(`🔗 Verification token: ${token}`);
    console.log('✅ Email sent successfully (simulated)');
    
    return true;
  } catch (error) {
    console.error('❌ [EMAIL SERVICE] Failed to send verification email:', error);
    return false;
  }
};

export const sendWelcomeEmail = async (email: string, name: string): Promise<boolean> => {
  try {
    console.log(`📧 [EMAIL SERVICE] Sending welcome email to ${name} (${email})`);
    console.log('✅ Email sent successfully (simulated)');
    
    return true;
  } catch (error) {
    console.error('❌ [EMAIL SERVICE] Failed to send welcome email:', error);
    return false;
  }
};

export const sendTicketCreatedEmail = async (
  email: string, 
  ticketNumber: string, 
  ticketTitle: string,
  projectId?: string,
  additionalData?: {
    studentName?: string;
    status?: string;
    priority?: string;
  }
): Promise<boolean> => {
  try {
    console.log(`📧 [EMAIL SERVICE] Sending ticket confirmation to ${email}`);
    console.log(`🎫 Ticket Number: ${ticketNumber}`);
    console.log(`📄 Ticket Title: ${ticketTitle}`);
    console.log(`🏢 Project ID: ${projectId}`);
    
    const transporter = await getEmailTransporter(projectId);
    
    if (!transporter) {
      console.log('✅ Email sent successfully (simulated)');
      return true;
    }

    const emailConfig = await EmailConfig.findOne(projectId ? { projectId } : {});
    
    // Get the ticket created trigger settings
    const trigger = emailConfig?.triggers?.ticketCreatedStudent || emailConfig?.triggers?.ticketCreatedOnline;
    
    // Check if email trigger is enabled
    if (!trigger?.enabled) {
      console.log('⚠️  Ticket creation email trigger is disabled');
      return false;
    }
    
    // Default templates
    const defaultSubject = `Ticket Created - {{ticketNumber}}`;
    const defaultBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Ticket Created Successfully</h2>
        <p>Hello {{studentName}},</p>
        <p>Your support ticket has been created and our team will review it shortly.</p>
        <div style="background-color: #f4f4f4; padding: 20px; margin: 20px 0;">
          <p><strong>Ticket Number:</strong> {{ticketNumber}}</p>
          <p><strong>Subject:</strong> {{ticketTitle}}</p>
          <p><strong>Status:</strong> {{ticketStatus}}</p>
          <p><strong>Priority:</strong> {{ticketPriority}}</p>
        </div>
        <p>We will update you via email when there are any changes to your ticket.</p>
        <p>Thank you for contacting us!</p>
        <hr style="margin: 30px 0;">
        <p style="color: #666; font-size: 12px;">This is an automated message, please do not reply.</p>
      </div>
    `;
    
    // Prepare replacement values
    const studentName = additionalData?.studentName || 'Student';
    const status = additionalData?.status || 'Open';
    const priority = additionalData?.priority || 'Medium';
    
    // Use template from config or default, then replace variables
    let subject = (trigger.subject || defaultSubject)
      .replace(/\{\{ticketNumber\}\}/g, ticketNumber)
      .replace(/\{\{ticketTitle\}\}/g, ticketTitle)
      .replace(/\{\{ticketSubject\}\}/g, ticketTitle);
      
    let body = (trigger.body || defaultBody)
      .replace(/\{\{ticketNumber\}\}/g, ticketNumber)
      .replace(/\{\{ticketTitle\}\}/g, ticketTitle)
      .replace(/\{\{ticketSubject\}\}/g, ticketTitle)
      .replace(/\{\{studentName\}\}/g, studentName)
      .replace(/\{\{ticketStatus\}\}/g, status)
      .replace(/\{\{ticketPriority\}\}/g, priority);
    
    console.log(`📧 Sending email with subject: ${subject}`);
    
    await transporter.sendMail({
      from: `"${emailConfig?.fromName || 'SAC Helpdesk'}" <${emailConfig?.fromEmail || emailConfig?.smtpUser}>`,
      to: email,
      subject: subject,
      html: body,
    });
    
    console.log('✅ Ticket creation email sent successfully via SMTP');
    return true;
  } catch (error) {
    console.error('❌ [EMAIL SERVICE] Failed to send ticket creation email:', error);
    console.error('Error details:', error);
    return false;
  }
};

export const sendStudentWelcomeEmail = async (
  email: string,
  studentName: string,
  projectName: string,
  loginUrl: string,
  projectId?: string
): Promise<boolean> => {
  try {
    console.log(`📧 [EMAIL SERVICE] Sending welcome email to new student: ${email}`);
    console.log(`👤 Student Name: ${studentName}`);
    console.log(`🏢 Project Name: ${projectName}`);
    console.log(`🔗 Login URL: ${loginUrl}`);
    
    const transporter = await getEmailTransporter(projectId);
    
    if (!transporter) {
      console.log('✅ Welcome email sent successfully (simulated)');
      return true;
    }

    const emailConfig = await EmailConfig.findOne(projectId ? { projectId } : {});
    
    // Get the account created trigger settings
    const trigger = emailConfig?.triggers?.accountCreated;
    
    // Check if email trigger is enabled
    if (!trigger?.enabled) {
      console.log('⚠️  Account creation email trigger is disabled');
      return false;
    }
    
    // Default templates with placeholders
    const defaultSubject = `Welcome to {{projectName}} - Account Created`;
    const defaultBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Welcome to {{projectName}}!</h2>
        <p>Dear {{studentName}},</p>
        <p>Your account has been created successfully. You can now track and manage your support tickets online.</p>
        
        <div style="background-color: #f4f4f4; padding: 20px; margin: 20px 0; border-left: 4px solid #4CAF50;">
          <h3 style="margin-top: 0;">Your Login Details</h3>
          <p><strong>Email:</strong> {{email}}</p>
          <p><strong>Login URL:</strong> <a href="{{loginUrl}}" style="color: #4CAF50;">{{loginUrl}}</a></p>
        </div>
        
        <div style="background-color: #fff3cd; padding: 15px; margin: 20px 0; border-left: 4px solid #ffc107;">
          <h4 style="margin-top: 0; color: #856404;">📌 Set Your Password</h4>
          <p style="color: #856404; margin-bottom: 0;">To set up your password and access your account:</p>
          <ol style="color: #856404;">
            <li>Click on the login link above</li>
            <li>Click on "Forgot Password"</li>
            <li>Enter your email address ({{email}})</li>
            <li>You will receive an OTP to create your password</li>
          </ol>
        </div>
        
        <p>Once you log in, you will be able to:</p>
        <ul>
          <li>View and track all your support tickets</li>
          <li>Create new support requests</li>
          <li>Communicate with support staff</li>
          <li>Upload documents and attachments</li>
        </ul>
        
        <p>If you have any questions, please don't hesitate to contact our support team.</p>
        
        <p>Best regards,<br>{{projectName}} Support Team</p>
        
        <hr style="margin: 30px 0;">
        <p style="color: #666; font-size: 12px;">This is an automated message, please do not reply.</p>
      </div>
    `;
    
    // Use template from config or default, then replace ALL variables
    let subject = (trigger.subject || defaultSubject)
      .replace(/\{\{projectName\}\}/g, projectName)
      .replace(/\{\{studentName\}\}/g, studentName)
      .replace(/\{\{email\}\}/g, email)
      .replace(/\{\{loginUrl\}\}/g, loginUrl);
      
    let body = (trigger.body || defaultBody)
      .replace(/\{\{studentName\}\}/g, studentName)
      .replace(/\{\{email\}\}/g, email)
      .replace(/\{\{loginUrl\}\}/g, loginUrl)
      .replace(/\{\{projectName\}\}/g, projectName);
    
    console.log(`📧 Sending welcome email with subject: ${subject}`);
    
    await transporter.sendMail({
      from: `"${emailConfig?.fromName || projectName}" <${emailConfig?.fromEmail || emailConfig?.smtpUser}>`,
      to: email,
      subject: subject,
      html: body,
    });
    
    console.log('✅ Student welcome email sent successfully via SMTP');
    return true;
  } catch (error) {
    console.error('❌ [EMAIL SERVICE] Failed to send welcome email:', error);
    console.error('Error details:', error);
    return false;
  }
};
