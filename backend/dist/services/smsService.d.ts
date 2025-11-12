export interface SMSProvider {
    sendSMS(mobile: string, message: string): Promise<boolean>;
}
declare class SMSService {
    private provider;
    constructor();
    sendOTP(mobile: string, otp: string): Promise<boolean>;
    sendPasswordResetNotification(mobile: string): Promise<boolean>;
}
export declare const smsService: SMSService;
export {};
//# sourceMappingURL=smsService.d.ts.map