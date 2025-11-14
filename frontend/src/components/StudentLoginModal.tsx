import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface StudentLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  primaryColor: string;
  customUrlPath: string;
}

type Step = 'email' | 'otp' | 'password' | 'set-password';

export const StudentLoginModal: React.FC<StudentLoginModalProps> = ({
  isOpen,
  onClose,
  primaryColor,
  customUrlPath,
}) => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [requirePasswordSetup, setRequirePasswordSetup] = useState(false);
  const [tempToken, setTempToken] = useState('');
  const [firstName, setFirstName] = useState('');

  const resetForm = () => {
    setStep('email');
    setEmail('');
    setOtp('');
    setPassword('');
    setConfirmPassword('');
    setError(null);
    setRequirePasswordSetup(false);
    setTempToken('');
    setFirstName('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Check if user exists
      const response = await axios.post('http://localhost:3003/api/student-auth/check-user', {
        email,
      });

      const { userExists, requirePasswordSetup: needsSetup, firstName: name } = response.data.data;

      if (!userExists) {
        setError('No account found. Please submit a ticket first to create an account.');
        setLoading(false);
        return;
      }

      setFirstName(name);
      setRequirePasswordSetup(needsSetup);

      if (needsSetup) {
        // First time user - send OTP
        await axios.post('http://localhost:3003/api/student-auth/send-otp', { email });
        setStep('otp');
      } else {
        // Returning user - show password input
        setStep('password');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to check user. Please try again.');
    }

    setLoading(false);
  };

  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('http://localhost:3003/api/student-auth/verify-otp', {
        email,
        otp,
      });

      const { tempToken: token } = response.data.data;
      setTempToken(token);
      setStep('set-password');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid or expired OTP. Please try again.');
    }

    setLoading(false);
  };

  const handleSetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('🔐 Setting password for:', email);
      const response = await axios.post(
        'http://localhost:3003/api/student-auth/set-password',
        { password, confirmPassword },
        {
          headers: {
            Authorization: `Bearer ${tempToken}`,
          },
        }
      );

      const { token } = response.data.data;
      console.log('✅ Password set successfully, token received');
      
      // Clear old token first
      localStorage.removeItem('authToken');
      
      // Store new token
      localStorage.setItem('authToken', token);
      console.log('💾 Token stored in localStorage');
      
      // Close modal first
      handleClose();
      
      // Navigate to student dashboard with a small delay to ensure token is stored
      setTimeout(() => {
        console.log('🚀 Navigating to dashboard');
        navigate(`/${customUrlPath}/student/dashboard`);
      }, 100);
    } catch (err: any) {
      console.error('❌ Set password failed:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Failed to set password. Please try again.');
    }

    setLoading(false);
  };

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      console.log('🔐 Attempting login with:', email);
      const response = await axios.post('http://localhost:3003/api/student-auth/login', {
        email,
        password,
      });

      const { token } = response.data.data;
      console.log('✅ Login successful, token received');
      
      // Clear old token first
      localStorage.removeItem('authToken');
      
      // Store new token
      localStorage.setItem('authToken', token);
      console.log('💾 Token stored in localStorage');
      
      // Close modal first
      handleClose();
      
      // Navigate to student dashboard with a small delay to ensure token is stored
      setTimeout(() => {
        console.log('🚀 Navigating to dashboard');
        navigate(`/${customUrlPath}/student/dashboard`);
      }, 100);
    } catch (err: any) {
      console.error('❌ Login failed:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Invalid email or password');
    }

    setLoading(false);
  };

  const handleResendOTP = async () => {
    setLoading(true);
    setError(null);

    try {
      await axios.post('http://localhost:3003/api/student-auth/send-otp', { email });
      setError(null);
      // Show success message
      alert('OTP sent successfully!');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to resend OTP');
    }

    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
        {/* Header */}
        <div
          className="px-6 py-4 flex items-center justify-between"
          style={{ background: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}dd 100%)` }}
        >
          <h2 className="text-xl font-bold text-white">
            {step === 'email' && 'Student Login'}
            {step === 'otp' && 'Verify OTP'}
            {step === 'password' && 'Welcome Back!'}
            {step === 'set-password' && 'Set Your Password'}
          </h2>
          <button
            onClick={handleClose}
            className="text-white/80 hover:text-white transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Step 1: Email Input */}
          {step === 'email' && (
            <form onSubmit={handleEmailSubmit}>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-opacity-50 focus:outline-none"
                  placeholder="Enter your email"
                  required
                  disabled={loading}
                />
                <p className="mt-2 text-xs text-gray-500">
                  Enter the email you used to submit your first ticket
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg text-white font-semibold transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: primaryColor }}
              >
                {loading ? 'Checking...' : 'Continue'}
              </button>
            </form>
          )}

          {/* Step 2: OTP Verification */}
          {step === 'otp' && (
            <form onSubmit={handleOTPSubmit}>
              <div className="mb-2">
                <p className="text-sm text-gray-600 mb-4">
                  Hi <span className="font-semibold">{firstName}</span>! We've sent a 6-digit OTP to{' '}
                  <span className="font-semibold">{email}</span>
                </p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter OTP
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-opacity-50 focus:outline-none text-center text-2xl tracking-widest"
                  placeholder="000000"
                  maxLength={6}
                  required
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full py-3 rounded-lg text-white font-semibold transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed mb-3"
                style={{ backgroundColor: primaryColor }}
              >
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>

              <button
                type="button"
                onClick={handleResendOTP}
                disabled={loading}
                className="w-full py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                Didn't receive OTP? Resend
              </button>
            </form>
          )}

          {/* Step 3a: Password Login (Returning Users) */}
          {step === 'password' && (
            <form onSubmit={handlePasswordLogin}>
              <div className="mb-2">
                <p className="text-sm text-gray-600 mb-4">
                  Welcome back, <span className="font-semibold">{firstName}</span>!
                </p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-opacity-50 focus:outline-none"
                  placeholder="Enter your password"
                  required
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg text-white font-semibold transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: primaryColor }}
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>
          )}

          {/* Step 3b: Set Password (First Time Users) */}
          {step === 'set-password' && (
            <form onSubmit={handleSetPasswordSubmit}>
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-4">
                  Hi <span className="font-semibold">{firstName}</span>! Please set a password for your account.
                </p>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-opacity-50 focus:outline-none"
                  placeholder="Minimum 8 characters"
                  required
                  disabled={loading}
                  minLength={8}
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-opacity-50 focus:outline-none"
                  placeholder="Re-enter password"
                  required
                  disabled={loading}
                  minLength={8}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg text-white font-semibold transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: primaryColor }}
              >
                {loading ? 'Setting Password...' : 'Set Password & Login'}
              </button>
            </form>
          )}

          {/* Back Button (except on email step) */}
          {step !== 'email' && (
            <button
              onClick={() => {
                if (step === 'otp' || step === 'password') {
                  setStep('email');
                  setError(null);
                } else if (step === 'set-password') {
                  setStep('otp');
                  setError(null);
                }
              }}
              className="w-full mt-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
              disabled={loading}
            >
              ← Back
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
