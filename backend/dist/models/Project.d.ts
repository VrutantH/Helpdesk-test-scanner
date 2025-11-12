import mongoose, { Document } from 'mongoose';
export interface IProject extends Document {
    projectId: string;
    name: string;
    code: string;
    description?: string;
    address?: {
        street?: string;
        city?: string;
        state?: string;
        country?: string;
        pincode?: string;
    };
    contactInfo?: {
        phone?: string;
        email?: string;
        website?: string;
    };
    region?: string;
    primaryContact?: {
        name?: string;
        email?: string;
        phone?: string;
        designation?: string;
    };
    branding?: {
        logo?: string;
        colorTheme?: {
            primary?: string;
            secondary?: string;
            accent?: string;
            background?: string;
        };
        headerText?: string;
        footerText?: string;
        domainUrl?: string;
        favicon?: string;
        customUrlPath?: string;
    };
    modules?: {
        tickets?: boolean;
        knowledgeBase?: boolean;
        reports?: boolean;
        assets?: boolean;
        communication?: boolean;
        analytics?: boolean;
        userManagement?: boolean;
        workflows?: boolean;
        approvals?: boolean;
        notifications?: boolean;
    };
    settings?: {
        defaultLanguage?: string;
        timezone?: string;
        dateFormat?: string;
        timeFormat?: string;
        currency?: string;
        firstDayOfWeek?: number;
    };
    configuration?: {
        maxUsers?: number;
        maxStorage?: number;
        allowedDomains?: string[];
        customFields?: Array<{
            name: string;
            type: string;
            required: boolean;
            options?: string[];
        }>;
        slaSettings?: {
            enabled: boolean;
            defaultResponseTime?: number;
            defaultResolutionTime?: number;
        };
        securitySettings?: {
            mfaRequired?: boolean;
            passwordPolicy?: {
                minLength?: number;
                requireUppercase?: boolean;
                requireLowercase?: boolean;
                requireNumbers?: boolean;
                requireSpecialChars?: boolean;
                expiryDays?: number;
            };
            sessionTimeout?: number;
            ipWhitelist?: string[];
            allowUserSignup?: boolean;
            restrictSignupViaSocial?: boolean;
        };
        loginSettings?: {
            enableFormLogin?: boolean;
            enableGoogleRecaptcha?: boolean;
            socialLogins?: {
                google?: boolean;
                facebook?: boolean;
                microsoft?: boolean;
            };
            ssoSettings?: {
                oauth20?: boolean;
                openIdConnect?: boolean;
                jwt?: boolean;
            };
        };
        knowledgeBaseSettings?: {
            enabled?: boolean;
            kbHomeConfiguration?: any;
            articleConfiguration?: any;
            enableAIAssistance?: boolean;
            enableSatisfactionFeedback?: boolean;
            satisfactionFeedback?: any;
            seoSettings?: any;
        };
        customizationSettings?: {
            loginPageBackgroundImage?: string;
            themeMode?: 'light' | 'dark';
            themeColor?: string;
            customCSS?: string;
            customJS?: string;
        };
    };
    status: 'active' | 'inactive' | 'suspended';
    isActive: boolean;
    users: number;
    createdBy?: mongoose.Types.ObjectId;
    updatedBy?: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
export declare const Project: mongoose.Model<IProject, {}, {}, {}, mongoose.Document<unknown, {}, IProject> & IProject & {
    _id: mongoose.Types.ObjectId;
}, any>;
//# sourceMappingURL=Project.d.ts.map