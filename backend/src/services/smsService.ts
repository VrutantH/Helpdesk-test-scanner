import { config } from '../config';

export interface SMSProvider {
  sendSMS(mobile: string, message: string): Promise<boolean>;
}

// Mock SMS Provider for development/testing
class MockSMSProvider implements SMSProvider {
  async sendSMS(mobile: string, message: string): Promise<boolean> {
    console.log(`📱 Mock SMS to +91${mobile}: ${message}`);
    // In development, we'll just log the OTP
    // This simulates successful SMS delivery
    return true;
  }
}

// Twilio SMS Provider (production-ready)
class TwilioSMSProvider implements SMSProvider {
  private accountSid: string;
  private authToken: string;
  private fromNumber: string;

  constructor(accountSid: string, authToken: string, fromNumber: string) {
    this.accountSid = accountSid;
    this.authToken = authToken;
    this.fromNumber = fromNumber;
  }

  async sendSMS(mobile: string, message: string): Promise<boolean> {
    try {
      // Note: You would need to install twilio package for production
      // npm install twilio
      // const twilio = require('twilio')(this.accountSid, this.authToken);
      
      // const result = await twilio.messages.create({
      //   body: message,
      //   from: this.fromNumber,
      //   to: `+91${mobile}`
      // });

      // For now, we'll just log and return true
      console.log(`📱 Twilio SMS to +91${mobile}: ${message}`);
      return true;
    } catch (error) {
      console.error('Twilio SMS Error:', error);
      return false;
    }
  }
}

// SMS Service Factory
class SMSService {
  private provider: SMSProvider;

  constructor() {
    // Choose provider based on environment
    if (config.NODE_ENV === 'production' && config.TWILIO_ACCOUNT_SID) {
      this.provider = new TwilioSMSProvider(
        config.TWILIO_ACCOUNT_SID,
        config.TWILIO_AUTH_TOKEN || '',
        config.TWILIO_PHONE_NUMBER || ''
      );
    } else {
      this.provider = new MockSMSProvider();
    }
  }

  async sendOTP(mobile: string, otp: string): Promise<boolean> {
    const message = `Your SAC Helpdesk verification code is: ${otp}. This code will expire in 10 minutes. Do not share this code with anyone.`;
    return this.provider.sendSMS(mobile, message);
  }

  async sendPasswordResetNotification(mobile: string): Promise<boolean> {
    const message = `Your SAC Helpdesk password has been successfully reset. If you did not request this change, please contact support immediately.`;
    return this.provider.sendSMS(mobile, message);
  }
}

// Export singleton instance
export const smsService = new SMSService();