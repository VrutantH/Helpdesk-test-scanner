# Database OTP System - User Guide

## ✅ Implementation Complete

The helpdesk portal now uses **database-stored OTP** system instead of SMS. Here's how it works:

### 🔧 **How to Get Current OTP from Database:**

#### Method 1: Using the Check OTP Script
```bash
cd "d:\Niraj\SAC\SAC Helpdesk\backend"
npx ts-node src/scripts/checkOTP.ts
```

#### Method 2: Using API Endpoint
```bash
# PowerShell
Invoke-RestMethod -Uri "http://localhost:3003/api/auth/forgot-password/get-otp" -Method POST -ContentType "application/json" -Body '{"mobile":"9876543210"}'
```

#### Method 3: Direct Database Query (MongoDB Shell)
```javascript
// Connect to MongoDB
use sac_helpdesk

// Find user and show OTP info
db.users.findOne(
  { mobile: "9876543210" },
  { firstName: 1, lastName: 1, mobile: 1, resetPasswordOTP: 1, resetPasswordOTPExpires: 1 }
)
```

### 🔄 **OTP Flow:**

1. **Send OTP**: User enters mobile number → OTP generated and saved to database
2. **Check OTP**: Admin/Developer can check current OTP using above methods
3. **Resend OTP**: Generates new OTP and overwrites the previous one in database
4. **Verify OTP**: User enters OTP → System verifies against database
5. **Reset Password**: After verification, OTP is cleared from database

### 📱 **Test User:**
- **Mobile**: `9876543210`
- **Name**: Super Admin
- **Email**: admin@helpdesk.gov.in

### 🚀 **Server Status:**
- **Backend**: http://localhost:3003 ✅
- **Frontend**: http://localhost:3002 ✅
- **Database**: MongoDB (sac_helpdesk) ✅

### 🔍 **Console Logs:**
All OTP operations are logged to the backend console with emojis:
- `📱 OTP for mobile XXXXX: 123456 (expires in 10 minutes)`
- `🔐 Password reset successful for mobile XXXXX`

### ⚠️ **Security Features:**
- ✅ Mobile number validation (only registered numbers)
- ✅ OTP expiry (10 minutes)
- ✅ Rate limiting (prevents spam)
- ✅ Account lockout after multiple failed attempts
- ✅ OTP auto-clear after successful password reset

**No SMS service needed!** 📧➡️💾