import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

interface ForgotPasswordProps {
  onBack?: () => void
}

type Step = 'mobile' | 'otp' | 'reset' | 'success'

interface AccountHolder {
  name: string
  email: string
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onBack }) => {
  const { t, i18n } = useTranslation()
  const [currentStep, setCurrentStep] = useState<Step>('mobile')
  const [mobile, setMobile] = useState('')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [timer, setTimer] = useState(0)
  const [accountHolder, setAccountHolder] = useState<AccountHolder | null>(null)

  // Start countdown timer for OTP resend
  const startTimer = () => {
    setTimer(30)
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  // Handle mobile number submission
  const handleMobileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    // Validate Indian mobile number
    const mobileRegex = /^[6-9]\d{9}$/
    if (!mobileRegex.test(mobile)) {
      setError(i18n.language === 'en' ? 'Please enter a valid 10-digit mobile number' : 'कृपया वैध १०-अंकी मोबाइल नंबर टाका')
      return
    }

    setIsLoading(true)
    try {
      // Call the backend API to send OTP
      const response = await fetch('http://localhost:3003/api/auth/forgot-password/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mobile }),
      })

      const data = await response.json()
      
      if (response.ok && data.success) {
        // Save account holder info from the response
        if (data.accountHolder) {
          setAccountHolder({ 
            name: data.accountHolder.name || 'User', 
            email: data.accountHolder.email || 'ad***@helpdesk.gov.in' 
          })
        }
        
        setCurrentStep('otp')
        startTimer()
      } else {
        setError(data.message || (i18n.language === 'en' ? 'Failed to send OTP' : 'OTP पाठवण्यात अयशस्वी'))
      }
    } catch (err) {
      console.error('Network error:', err)
      setError(i18n.language === 'en' ? 'Network error. Please try again.' : 'नेटवर्क त्रुटी. कृपया पुन्हा प्रयत्न करा.')
    } finally {
      setIsLoading(false)
    }
  }

  // Handle OTP verification
  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (otp.length !== 6) {
      setError(i18n.language === 'en' ? 'Please enter 6-digit OTP' : 'कृपया ६-अंकी OTP टाका')
      return
    }

    setIsLoading(true)
    try {
      // Call the backend API to verify OTP
      const response = await fetch('http://localhost:3003/api/auth/forgot-password/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mobile, otp }),
      })

      const data = await response.json()
      
      if (response.ok && data.success) {
        setCurrentStep('reset')
      } else {
        setError(data.message || (i18n.language === 'en' ? 'Invalid OTP' : 'अवैध OTP'))
      }
    } catch (err) {
      setError(i18n.language === 'en' ? 'Network error. Please try again.' : 'नेटवर्क त्रुटी. कृपया पुन्हा प्रयत्न करा.')
    } finally {
      setIsLoading(false)
    }
  }

  // Handle password reset
  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    // Password length validation
    if (newPassword.length < 8) {
      setError(i18n.language === 'en' ? 
        'Password must be at least 8 characters long' : 
        'पासवर्डमध्ये किमान ८ अक्षरे असावीत')
      return
    }
    
    // Password strength validation
    const hasUpperCase = /[A-Z]/.test(newPassword)
    const hasLowerCase = /[a-z]/.test(newPassword)
    const hasNumber = /[0-9]/.test(newPassword)
    
    if (!hasUpperCase || !hasLowerCase || !hasNumber) {
      setError(i18n.language === 'en' ? 
        'Password must contain at least one uppercase letter, one lowercase letter, and one number' : 
        'पासवर्डमध्ये किमान एक मोठे अक्षर, एक लहान अक्षर आणि एक संख्या असणे आवश्यक आहे')
      return
    }
    
    // Password match validation
    if (newPassword !== confirmPassword) {
      setError(i18n.language === 'en' ? 'Passwords do not match' : 'पासवर्ड जुळत नाहीत')
      return
    }

    setIsLoading(true)
    try {
      console.log('Resetting password with data:', { mobile, otp: otp.substring(0, 2) + '****', passwordLength: newPassword.length })
      // Call the backend API to reset password
      const response = await fetch('http://localhost:3003/api/auth/forgot-password/reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mobile, otp, newPassword }),
      })

      console.log('Password reset response status:', response.status)
      const data = await response.json()
      console.log('Password reset response:', data)
      
      if (response.ok && data.success) {
        // Navigate to success step
        setCurrentStep('success')
      } else {
        setError(data.message || (i18n.language === 'en' ? 'Failed to reset password' : 'पासवर्ड रीसेट करण्यात अयशस्वी'))
      }
    } catch (err) {
      console.error('Password reset error:', err)
      setError(i18n.language === 'en' ? 'Network error. Please try again.' : 'नेटवर्क त्रुटी. कृपया पुन्हा प्रयत्न करा.')
    } finally {
      setIsLoading(false)
    }
  }

  // Resend OTP
  const handleResendOtp = async () => {
    if (timer > 0) return
    setError('')
    setIsLoading(true)
    
    try {
      // Call the backend API to resend OTP (this will refresh the OTP in database)
      const response = await fetch('http://localhost:3003/api/auth/forgot-password/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mobile }),
      })

      const data = await response.json()
      
      if (response.ok && data.success) {
        // Update the current OTP from database
        if (data.developmentOTP) {
          // OTP is refreshed in database - user will access it directly from DB
        }
        startTimer()
      } else {
        setError(data.message || (i18n.language === 'en' ? 'Failed to resend OTP' : 'OTP पुन्हा पाठवण्यात अयशस्वी'))
      }
    } catch (err) {
      setError(i18n.language === 'en' ? 'Failed to resend OTP' : 'OTP पुन्हा पाठवण्यात अयशस्वी')
    } finally {
      setIsLoading(false)
    }
  }

  const renderMobileStep = () => (
    <>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div style={{
          width: '64px',
          height: '64px',
          backgroundColor: '#f97316',
          borderRadius: '16px',
          margin: '0 auto 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '32px',
          color: 'white'
        }}>
          📱
        </div>
        <h1 style={{ 
          fontSize: '24px', 
          fontWeight: '600', 
          color: '#1f2937',
          margin: '0 0 8px 0'
        }}>
          {i18n.language === 'en' ? 'Reset Password' : 'पासवर्ड रीसेट करा'}
        </h1>
        <p style={{ 
          fontSize: '16px', 
          color: '#6b7280',
          margin: '0'
        }}>
          {i18n.language === 'en' ? 'Enter your registered mobile number' : 'आपला नोंदणीकृत मोबाइल नंबर टाका'}
        </p>
      </div>

      <form onSubmit={handleMobileSubmit} style={{ width: '100%' }}>
        <div style={{ marginBottom: '16px' }}>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: '500',
            color: '#374151',
            marginBottom: '6px'
          }}>
            📱 {i18n.language === 'en' ? 'Mobile Number' : 'मोबाइल नंबर'}
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type="tel"
              value={mobile}
              onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
              placeholder={i18n.language === 'en' ? 'Enter 10-digit mobile number' : '१०-अंकी मोबाइल नंबर टाका'}
              style={{
                width: '100%',
                padding: '12px 12px 12px 40px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '16px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
              maxLength={10}
              required
            />
            <span style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#6b7280',
              fontSize: '14px'
            }}>
              +91
            </span>
          </div>
        </div>

        {error && (
          <div style={{
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '6px',
            padding: '12px',
            marginBottom: '16px',
            color: '#dc2626',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading || mobile.length !== 10}
          style={{
            width: '100%',
            backgroundColor: (isLoading || mobile.length !== 10) ? '#9ca3af' : '#f97316',
            color: 'white',
            padding: '12px',
            border: 'none',
            borderRadius: '6px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: (isLoading || mobile.length !== 10) ? 'not-allowed' : 'pointer',
            marginBottom: '16px'
          }}
        >
          {isLoading ? 
            (i18n.language === 'en' ? '📤 Sending OTP...' : '📤 OTP पाठवत आहे...') : 
            (i18n.language === 'en' ? '📤 Send OTP' : '📤 OTP पाठवा')
          }
        </button>
      </form>
    </>
  )

  const renderOtpStep = () => (
    <>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div style={{
          width: '64px',
          height: '64px',
          backgroundColor: '#f97316',
          borderRadius: '16px',
          margin: '0 auto 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '32px',
          color: 'white'
        }}>
          🔐
        </div>
        <h1 style={{ 
          fontSize: '24px', 
          fontWeight: '600', 
          color: '#1f2937',
          margin: '0 0 8px 0'
        }}>
          {i18n.language === 'en' ? 'Verify OTP' : 'OTP तपासा'}
        </h1>
        <p style={{ 
          fontSize: '16px', 
          color: '#6b7280',
          margin: '0 0 8px 0'
        }}>
          {i18n.language === 'en' ? `OTP sent to +91 ${mobile}` : `+91 ${mobile} वर OTP पाठवला`}
        </p>
        
        {/* Account Holder Information */}
        {accountHolder && (
          <div style={{
            backgroundColor: '#f0f9ff',
            border: '1px solid #0ea5e9',
            borderRadius: '6px',
            padding: '12px',
            margin: '8px 0',
            fontSize: '14px'
          }}>
            <div style={{ 
              fontWeight: '600', 
              color: '#1e40af',
              marginBottom: '4px' 
            }}>
              {i18n.language === 'en' ? 'Account Holder:' : 'खाताधारक:'}
            </div>
            <div style={{ color: '#1f2937' }}>
              👤 {accountHolder.name}
            </div>
            <div style={{ color: '#6b7280', fontSize: '12px' }}>
              📧 {accountHolder.email}
            </div>
          </div>
        )}
        
        <button
          onClick={() => setCurrentStep('mobile')}
          style={{
            background: 'none',
            border: 'none',
            color: '#f97316',
            textDecoration: 'underline',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          {i18n.language === 'en' ? 'Change mobile number' : 'मोबाइल नंबर बदला'}
        </button>
      </div>

      <form onSubmit={handleOtpSubmit} style={{ width: '100%' }}>
        <div style={{ marginBottom: '16px' }}>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: '500',
            color: '#374151',
            marginBottom: '6px'
          }}>
            🔐 {i18n.language === 'en' ? 'Enter OTP' : 'OTP टाका'}
          </label>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder={i18n.language === 'en' ? 'Enter 6-digit OTP' : '६-अंकी OTP टाका'}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '18px',
              outline: 'none',
              boxSizing: 'border-box',
              textAlign: 'center',
              letterSpacing: '4px'
            }}
            maxLength={6}
            required
          />
        </div>

        {error && (
          <div style={{
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '6px',
            padding: '12px',
            marginBottom: '16px',
            color: '#dc2626',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading || otp.length !== 6}
          style={{
            width: '100%',
            backgroundColor: (isLoading || otp.length !== 6) ? '#9ca3af' : '#f97316',
            color: 'white',
            padding: '12px',
            border: 'none',
            borderRadius: '6px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: (isLoading || otp.length !== 6) ? 'not-allowed' : 'pointer',
            marginBottom: '16px'
          }}
        >
          {isLoading ? 
            (i18n.language === 'en' ? '🔍 Verifying...' : '🔍 तपासत आहे...') : 
            (i18n.language === 'en' ? '🔍 Verify OTP' : '🔍 OTP तपासा')
          }
        </button>

        <div style={{ textAlign: 'center' }}>
          {timer > 0 ? (
            <span style={{ color: '#6b7280', fontSize: '14px' }}>
              {i18n.language === 'en' ? `Resend OTP in ${timer}s` : `${timer} सेकंदात OTP पुन्हा पाठवा`}
            </span>
          ) : (
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={isLoading}
              style={{
                background: 'none',
                border: 'none',
                color: '#f97316',
                textDecoration: 'underline',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              {i18n.language === 'en' ? '📤 Resend OTP' : '📤 OTP पुन्हा पाठवा'}
            </button>
          )}
        </div>
      </form>
    </>
  )

  const renderResetStep = () => (
    <>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div style={{
          width: '64px',
          height: '64px',
          backgroundColor: '#f97316',
          borderRadius: '16px',
          margin: '0 auto 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '32px',
          color: 'white'
        }}>
          🔑
        </div>
        <h1 style={{ 
          fontSize: '24px', 
          fontWeight: '600', 
          color: '#1f2937',
          margin: '0 0 8px 0'
        }}>
          {i18n.language === 'en' ? 'Create New Password' : 'नवीन पासवर्ड तयार करा'}
        </h1>
        <p style={{ 
          fontSize: '16px', 
          color: '#6b7280',
          margin: '0'
        }}>
          {i18n.language === 'en' ? 'Enter a strong password for your account' : 'आपल्या खात्यासाठी मजबूत पासवर्ड टाका'}
        </p>
      </div>

      <form onSubmit={handlePasswordReset} style={{ width: '100%' }}>
        <div style={{ marginBottom: '16px' }}>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: '500',
            color: '#374151',
            marginBottom: '6px'
          }}>
            🔒 {i18n.language === 'en' ? 'New Password' : 'नवीन पासवर्ड'}
          </label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder={i18n.language === 'en' ? 'Enter new password' : 'नवीन पासवर्ड टाका'}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '16px',
              outline: 'none',
              boxSizing: 'border-box'
            }}
            minLength={8}
            required
          />
          <div style={{ 
            marginTop: '8px',
            fontSize: '12px',
            color: '#6b7280',
            lineHeight: '1.6'
          }}>
            {i18n.language === 'en' ? (
              <>
                <div>• At least 8 characters</div>
                <div>• One uppercase letter (A-Z)</div>
                <div>• One lowercase letter (a-z)</div>
                <div>• One number (0-9)</div>
              </>
            ) : (
              <>
                <div>• किमान ८ अक्षरे</div>
                <div>• एक मोठे अक्षर (A-Z)</div>
                <div>• एक लहान अक्षर (a-z)</div>
                <div>• एक संख्या (0-9)</div>
              </>
            )}
          </div>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: '500',
            color: '#374151',
            marginBottom: '6px'
          }}>
            🔒 {i18n.language === 'en' ? 'Confirm Password' : 'पासवर्डची पुष्टी करा'}
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder={i18n.language === 'en' ? 'Confirm your new password' : 'आपल्या नवीन पासवर्डची पुष्टी करा'}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '16px',
              outline: 'none',
              boxSizing: 'border-box'
            }}
            required
          />
        </div>

        {error && (
          <div style={{
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '6px',
            padding: '12px',
            marginBottom: '16px',
            color: '#dc2626',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading || !newPassword || !confirmPassword}
          style={{
            width: '100%',
            backgroundColor: (isLoading || !newPassword || !confirmPassword) ? '#9ca3af' : '#f97316',
            color: 'white',
            padding: '12px',
            border: 'none',
            borderRadius: '6px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: (isLoading || !newPassword || !confirmPassword) ? 'not-allowed' : 'pointer',
            marginBottom: '16px'
          }}
        >
          {isLoading ? 
            (i18n.language === 'en' ? '🔄 Resetting...' : '🔄 रीसेट करत आहे...') : 
            (i18n.language === 'en' ? '✅ Reset Password' : '✅ पासवर्ड रीसेट करा')
          }
        </button>
      </form>
    </>
  )

  const renderSuccessStep = () => (
    <>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div style={{
          width: '80px',
          height: '80px',
          backgroundColor: '#10b981',
          borderRadius: '50%',
          margin: '0 auto 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '48px',
          color: 'white'
        }}>
          ✓
        </div>
        <h1 style={{ 
          fontSize: '28px', 
          fontWeight: '600', 
          color: '#1f2937',
          margin: '0 0 12px 0'
        }}>
          {i18n.language === 'en' ? 'Password Reset Successful!' : 'पासवर्ड यशस्वीरित्या रीसेट झाला!'}
        </h1>
        <p style={{ 
          fontSize: '16px', 
          color: '#6b7280',
          margin: '0 0 32px 0',
          lineHeight: '1.5'
        }}>
          {i18n.language === 'en' ? 
            'Your password has been successfully reset. You can now login with your new password.' : 
            'आपला पासवर्ड यशस्वीरित्या रीसेट केला गेला आहे. आता आपण आपल्या नवीन पासवर्डसह लॉगिन करू शकता.'}
        </p>
        
        <Link
          to="/login"
          style={{
            display: 'inline-block',
            width: '100%',
            backgroundColor: '#f97316',
            color: 'white',
            padding: '14px 24px',
            border: 'none',
            borderRadius: '6px',
            fontSize: '16px',
            fontWeight: '600',
            textDecoration: 'none',
            cursor: 'pointer',
            textAlign: 'center'
          }}
        >
          {i18n.language === 'en' ? '🔐 Go to Login Page' : '🔐 लॉगिन पृष्ठावर जा'}
        </Link>
      </div>
    </>
  )

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f8fafc',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: i18n.language === 'mr' ? '"Noto Sans Devanagari", "Noto Sans", sans-serif' : '"Inter", "Noto Sans", sans-serif'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '48px',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '400px'
      }}>
        {currentStep === 'mobile' && renderMobileStep()}
        {currentStep === 'otp' && renderOtpStep()}
        {currentStep === 'reset' && renderResetStep()}
        {currentStep === 'success' && renderSuccessStep()}
        
        {/* Debug info */}
        {!['mobile', 'otp', 'reset', 'success'].includes(currentStep) && (
          <div>Invalid step: {currentStep}</div>
        )}

        {currentStep !== 'success' && (
          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <Link 
              to="/login"
              style={{
                color: '#6b7280',
                textDecoration: 'none',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              ← {i18n.language === 'en' ? 'Back to Login' : 'लॉगिनकडे परत'}
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default ForgotPassword