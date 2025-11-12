"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.smsService = void 0;
const config_1 = require("../config");
class MockSMSProvider {
    async sendSMS(mobile, message) {
        console.log(`📱 Mock SMS to +91${mobile}: ${message}`);
        return true;
    }
}
class TwilioSMSProvider {
    constructor(accountSid, authToken, fromNumber) {
        this.accountSid = accountSid;
        this.authToken = authToken;
        this.fromNumber = fromNumber;
    }
    async sendSMS(mobile, message) {
        try {
            console.log(`📱 Twilio SMS to +91${mobile}: ${message}`);
            return true;
        }
        catch (error) {
            console.error('Twilio SMS Error:', error);
            return false;
        }
    }
}
class SMSService {
    constructor() {
        if (config_1.config.NODE_ENV === 'production' && config_1.config.TWILIO_ACCOUNT_SID) {
            this.provider = new TwilioSMSProvider(config_1.config.TWILIO_ACCOUNT_SID, config_1.config.TWILIO_AUTH_TOKEN || '', config_1.config.TWILIO_PHONE_NUMBER || '');
        }
        else {
            this.provider = new MockSMSProvider();
        }
    }
    async sendOTP(mobile, otp) {
        const message = `Your SAC Helpdesk verification code is: ${otp}. This code will expire in 10 minutes. Do not share this code with anyone.`;
        return this.provider.sendSMS(mobile, message);
    }
    async sendPasswordResetNotification(mobile) {
        const message = `Your SAC Helpdesk password has been successfully reset. If you did not request this change, please contact support immediately.`;
        return this.provider.sendSMS(mobile, message);
    }
}
exports.smsService = new SMSService();
//# sourceMappingURL=smsService.js.map