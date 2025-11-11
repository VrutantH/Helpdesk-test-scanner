import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      // App Title
      appTitle: "Government of India",
      appSubtitle: "Digital India Initiative",
      
      // Login Page
      welcomeTitle: "Welcome to Helpdesk",
      welcomeSubtitle: "Super Admin Portal",
      secureAccess: "Secure access to government helpdesk services",
      
      // Form Labels
      emailLabel: "Email Address",
      passwordLabel: "Password",
      emailPlaceholder: "Enter your official email address",
      passwordPlaceholder: "Enter your password",
      passwordMinLength: "Minimum 6 characters required",
      
      // Buttons
      loginButton: "Login",
      signingIn: "Signing in...",
      forgotPassword: "Forgot your password?",
      sendOtp: "Send OTP",
      sendingOtp: "Sending OTP...",
      verifyOtp: "Verify OTP",
      verifyingOtp: "Verifying...",
      resetPassword: "Reset Password",
      resettingPassword: "Resetting...",
      backToLogin: "Back to Login",
      
      // Validation Messages
      required: "This field is required",
      emailRequired: "Email address is required",
      emailInvalid: "Please enter a valid email address",
      passwordRequired: "Password is required",
      passwordMinLengthError: "Password must be at least 6 characters",
      otpRequired: "OTP is required",
      otpInvalid: "Please enter a valid 6-digit OTP",
      passwordMismatch: "Passwords do not match",
      
      // Error Messages
      loginFailed: "Invalid credentials. Please try again.",
      networkError: "Network error. Please check your connection.",
      emailNotFound: "Email address not found in our records.",
      invalidOtp: "Invalid or expired OTP. Please try again.",
      passwordResetFailed: "Password reset failed. Please try again.",
      
      // Success Messages
      otpSent: "OTP has been sent to your email address.",
      passwordResetSuccess: "Password reset successfully. Please login with your new password.",
      
      // Forgot Password
      forgotPasswordTitle: "Reset Your Password",
      forgotPasswordSubtitle: "Enter your email to receive an OTP",
      otpVerificationTitle: "Verify OTP",
      otpVerificationSubtitle: "Enter the 6-digit code sent to your email",
      newPasswordTitle: "Set New Password",
      newPasswordSubtitle: "Create a strong password for your account",
      newPasswordLabel: "New Password",
      confirmPasswordLabel: "Confirm Password",
      
      // Security & Trust
      sslSecured: "Secured with 256-bit SSL encryption",
      privacyPolicy: "Privacy Policy",
      termsOfService: "Terms of Service",
      helpSupport: "Help & Support",
      
      // Footer
      copyright: "© 2025 Government of India. All rights reserved.",
      digitalIndia: "Developed under Digital India Initiative | Version 1.0.0",
      
      // Accessibility
      requiredField: "Required field",
      showPassword: "Show password",
      hidePassword: "Hide password",
      skipToMain: "Skip to main content",
      selectLanguage: "Select your preferred language",
      governmentEmblem: "Government of India National Emblem",
      
      // Language
      language: "Language",
      english: "English",
      marathi: "मराठी",
      
      // Mobile-based Forgot Password
      resetPasswordTitle: "Reset Password",
      mobileNumber: "Mobile Number",
      enterMobileDesc: "Enter your registered mobile number",
      sendOtpBtn: "Send OTP",
      sendingOtpBtn: "Sending OTP...",
      resendOtpBtn: "Resend OTP",
      resendOtpTimer: "Resend OTP in {{seconds}}s",
      enterOtpLabel: "Enter OTP",
      verifyOtpBtn: "Verify OTP",
      verifyingOtpBtn: "Verifying...",
      changeMobileBtn: "Change mobile number",
      otpSentToMobile: "OTP sent to +91 {{mobile}}",
      createNewPasswordTitle: "Create New Password",
      newPasswordDesc: "Enter a strong password for your account",
      confirmNewPasswordLabel: "Confirm your new password",
      resettingPasswordBtn: "Resetting...",
      mobileValidationErr: "Please enter a valid 10-digit mobile number",
      otpValidationErr: "Please enter 6-digit OTP",
      passwordResetSuccessMsg: "Password reset successfully. You can now login with your new password.",
      invalidMobileErr: "No account found with this mobile number",
      otpExpiredErr: "OTP has expired. Please request a new one",
      invalidOtpErr: "Invalid OTP. Please check and try again",
      tooManyAttemptsErr: "Too many failed attempts. Please try again later",
      enterMobilePlaceholder: "Enter 10-digit mobile number",
      enterOtpPlaceholder: "Enter 6-digit OTP"
    }
  },
  mr: {
    translation: {
      // App Title
      appTitle: "भारत सरकार",
      appSubtitle: "डिजिटल इंडिया उपक्रम",
      
      // Login Page
      welcomeTitle: "हेल्पडेस्कमध्ये आपले स्वागत",
      welcomeSubtitle: "सुपर अॅडमिन पोर्टल",
      secureAccess: "सरकारी हेल्पडेस्क सेवांमध्ये सुरक्षित प्रवेश",
      
      // Form Labels
      emailLabel: "ईमेल पत्ता",
      passwordLabel: "पासवर्ड",
      emailPlaceholder: "आपला अधिकृत ईमेल पत्ता टाका",
      passwordPlaceholder: "आपला पासवर्ड टाका",
      passwordMinLength: "किमान ६ अक्षरे आवश्यक",
      
      // Buttons
      loginButton: "लॉग इन",
      signingIn: "साइन इन करत आहे...",
      forgotPassword: "आपला पासवर्ड विसरलात?",
      sendOtp: "OTP पाठवा",
      sendingOtp: "OTP पाठवत आहे...",
      verifyOtp: "OTP तपासा",
      verifyingOtp: "तपासत आहे...",
      resetPassword: "पासवर्ड रीसेट करा",
      resettingPassword: "रीसेट करत आहे...",
      backToLogin: "लॉगिनकडे परत जा",
      
      // Validation Messages
      required: "हे फील्ड आवश्यक आहे",
      emailRequired: "ईमेल पत्ता आवश्यक आहे",
      emailInvalid: "कृपया वैध ईमेल पत्ता टाका",
      passwordRequired: "पासवर्ड आवश्यक आहे",
      passwordMinLengthError: "पासवर्डमध्ये किमान ६ अक्षरे असावीत",
      otpRequired: "OTP आवश्यक आहे",
      otpInvalid: "कृपया वैध ६-अंकी OTP टाका",
      passwordMismatch: "पासवर्ड जुळत नाहीत",
      
      // Error Messages
      loginFailed: "अवैध क्रेडेन्शियल्स. कृपया पुन्हा प्रयत्न करा.",
      networkError: "नेटवर्क त्रुटी. कृपया आपले कनेक्शन तपासा.",
      emailNotFound: "आमच्या रेकॉर्डमध्ये ईमेल पत्ता सापडला नाही.",
      invalidOtp: "अवैध किंवा कालबाह्य OTP. कृपया पुन्हा प्रयत्न करा.",
      passwordResetFailed: "पासवर्ड रीसेट अयशस्वी. कृपया पुन्हा प्रयत्न करा.",
      
      // Success Messages
      otpSent: "OTP आपल्या ईमेल पत्त्यावर पाठवला गेला आहे.",
      passwordResetSuccess: "पासवर्ड यशस्वीरित्या रीसेट झाला. कृपया आपल्या नवीन पासवर्डसह लॉगिन करा.",
      
      // Forgot Password
      forgotPasswordTitle: "आपला पासवर्ड रीसेट करा",
      forgotPasswordSubtitle: "OTP मिळवण्यासाठी आपला ईमेल टाका",
      otpVerificationTitle: "OTP तपासा",
      otpVerificationSubtitle: "आपल्या ईमेलवर पाठवलेला ६-अंकी कोड टाका",
      newPasswordTitle: "नवीन पासवर्ड सेट करा",
      newPasswordSubtitle: "आपल्या खात्यासाठी मजबूत पासवर्ड तयार करा",
      newPasswordLabel: "नवीन पासवर्ड",
      confirmPasswordLabel: "पासवर्डची पुष्टी करा",
      
      // Security & Trust
      sslSecured: "२५६-बिट SSL एन्क्रिप्शनसह सुरक्षित",
      privacyPolicy: "गोपनीयता धोरण",
      termsOfService: "सेवा अटी",
      helpSupport: "मदत आणि सहाय्य",
      
      // Footer
      copyright: "© २०२५ भारत सरकार. सर्व हक्क राखीव.",
      digitalIndia: "डिजिटल इंडिया उपक्रमाअंतर्गत विकसित | आवृत्ती १.०.०",
      
      // Accessibility
      requiredField: "आवश्यक फील्ड",
      showPassword: "पासवर्ड दाखवा",
      hidePassword: "पासवर्ड लपवा",
      skipToMain: "मुख्य सामग्रीकडे जा",
      selectLanguage: "आपली पसंतीची भाषा निवडा",
      governmentEmblem: "भारत सरकार राष्ट्रीय चिन्ह",
      
      // Language
      language: "भाषा",
      english: "English",
      marathi: "मराठी",
      
      // Mobile-based Forgot Password
      resetPasswordTitle: "पासवर्ड रीसेट करा",
      mobileNumber: "मोबाइल नंबर",
      enterMobileDesc: "आपला नोंदणीकृत मोबाइल नंबर टाका",
      sendOtpBtn: "OTP पाठवा",
      sendingOtpBtn: "OTP पाठवत आहे...",
      resendOtpBtn: "OTP पुन्हा पाठवा",
      resendOtpTimer: "{{seconds}} सेकंदात OTP पुन्हा पाठवा",
      enterOtpLabel: "OTP टाका",
      verifyOtpBtn: "OTP तपासा",
      verifyingOtpBtn: "तपासत आहे...",
      changeMobileBtn: "मोबाइल नंबर बदला",
      otpSentToMobile: "+91 {{mobile}} वर OTP पाठवला",
      createNewPasswordTitle: "नवीन पासवर्ड तयार करा",
      newPasswordDesc: "आपल्या खात्यासाठी मजबूत पासवर्ड टाका",
      confirmNewPasswordLabel: "आपल्या नवीन पासवर्डची पुष्टी करा",
      resettingPasswordBtn: "रीसेट करत आहे...",
      mobileValidationErr: "कृपया वैध १०-अंकी मोबाइल नंबर टाका",
      otpValidationErr: "कृपया ६-अंकी OTP टाका",
      passwordResetSuccessMsg: "पासवर्ड यशस्वीरित्या रीसेट झाला. कृपया आपल्या नवीन पासवर्डसह लॉगिन करा.",
      invalidMobileErr: "या मोबाइल नंबरसह कोणतेही खाते सापडले नाही",
      otpExpiredErr: "OTP कालबाह्य झाला आहे. कृपया नवीन विनंती करा",
      invalidOtpErr: "अवैध OTP. कृपया तपासा आणि पुन्हा प्रयत्न करा",
      tooManyAttemptsErr: "बरेच अयशस्वी प्रयत्न. कृपया नंतर प्रयत्न करा",
      enterMobilePlaceholder: "१०-अंकी मोबाइल नंबर टाका",
      enterOtpPlaceholder: "६-अंकी OTP टाका"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;