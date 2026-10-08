// =========================================================
//  Login Page — Passwordless Email OTP + Password Login
// =========================================================

import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import toast from 'react-hot-toast';
import styles from './Login.module.css';

export default function Login() {
  const { login, requestOtp, verifyOtp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/my-learning';

  // Mode: 'otp' (Passwordless Email Code) or 'password' (Traditional/Admin)
  const [authMode, setAuthMode] = useState('otp');

  // OTP flow states
  const [otpStep, setOtpStep] = useState(1); // 1: Enter email, 2: Enter OTP
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [resendTimer, setResendTimer] = useState(0);

  // Password flow states
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Countdown timer for OTP resend
  useEffect(() => {
    let timer;
    if (resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendTimer]);

  const validateEmail = (val) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(val);
  };

  // 1. Request OTP Code
  const handleRequestOtp = async (e) => {
    if (e) e.preventDefault();
    setErrors({});

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      setErrors({ email: 'Please enter your purchase email address' });
      return;
    }
    if (!validateEmail(cleanEmail)) {
      setErrors({ email: 'Please enter a valid email address' });
      return;
    }

    setLoading(true);
    try {
      const res = await requestOtp(cleanEmail);
      toast.success(res?.message || 'Verification code sent to your email! ✉️');
      setOtpStep(2);
      setResendTimer(60);
    } catch (err) {
      const msg = err?.response?.data?.error || err?.message || 'Failed to send verification code. Please try again.';
      toast.error(msg);
      setErrors({ email: msg });
    } finally {
      setLoading(false);
    }
  };

  // 2. Verify OTP Code
  const handleVerifyOtp = async (e) => {
    if (e) e.preventDefault();
    setErrors({});

    const cleanOtp = otp.trim();
    if (!cleanOtp) {
      setErrors({ otp: 'Please enter the 6-digit verification code' });
      return;
    }
    if (cleanOtp.length < 4) {
      setErrors({ otp: 'Enter the full verification code' });
      return;
    }

    setLoading(true);
    try {
      await verifyOtp({ email: email.trim().toLowerCase(), otp: cleanOtp });
      toast.success('Successfully authenticated! Welcome to LearnFlow! 🎉');
      navigate(from, { replace: true });
    } catch (err) {
      const msg = err?.response?.data?.error || err?.message || 'Invalid or expired verification code.';
      toast.error(msg);
      setErrors({ otp: msg });
    } finally {
      setLoading(false);
    }
  };

  // 3. Password Login
  const handlePasswordLogin = async (e) => {
    if (e) e.preventDefault();
    setErrors({});

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      setErrors({ email: 'Email is required' });
      return;
    }
    if (!password) {
      setErrors({ password: 'Password is required' });
      return;
    }

    setLoading(true);
    try {
      await login({ email: cleanEmail, password });
      toast.success('Welcome back! 👋');
      navigate(from, { replace: true });
    } catch (err) {
      const msg = err?.response?.data?.error || err?.response?.data?.detail || err?.message || 'Invalid email or password';
      toast.error(msg);
      setErrors({ password: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        {/* Logo */}
        <div className={styles.logo}>
          <div className={styles.logoIcon}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0B0B0B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className={styles.logoText}>Flair Academy</span>
        </div>

        <div className={styles.header}>
          <h1 className={styles.title}>Student Course Access</h1>
          <p className={styles.sub}>
            Access all your purchased masterclasses instantly without needing a password.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className={styles.tabs} role="tablist">
          <button
            type="button"
            className={[styles.tab, authMode === 'otp' ? styles.tabActive : ''].filter(Boolean).join(' ')}
            onClick={() => { setAuthMode('otp'); setErrors({}); }}
            role="tab"
            aria-selected={authMode === 'otp'}
          >
            <span>✉️ Passwordless Code</span>
          </button>
          <button
            type="button"
            className={[styles.tab, authMode === 'password' ? styles.tabActive : ''].filter(Boolean).join(' ')}
            onClick={() => { setAuthMode('password'); setErrors({}); }}
            role="tab"
            aria-selected={authMode === 'password'}
          >
            <span>🔑 Password / Admin</span>
          </button>
        </div>

        {/* Passwordless OTP Flow */}
        {authMode === 'otp' && (
          <div>
            {otpStep === 1 ? (
              <form onSubmit={handleRequestOtp} className={styles.form} noValidate>
                <div className={styles.infoBox}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0, marginTop: 1 }}>
                    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <span>Enter the email address you used when purchasing your course. We'll send you a temporary 6-digit access code.</span>
                </div>

                <Input
                  id="otp-email"
                  label="Purchase Email Address"
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors({}); }}
                  placeholder="e.g. alex@example.com"
                  error={errors.email}
                  required
                  autoComplete="email"
                  leftIcon={
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  }
                />

                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  size="lg"
                  loading={loading}
                  id="request-otp-btn"
                >
                  Send Verification Code →
                </Button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className={styles.form} noValidate>
                <div className={styles.otpSentBanner}>
                  <div>
                    <span>Code sent to: <strong>{email}</strong></span>
                  </div>
                  <button
                    type="button"
                    className={styles.changeEmailBtn}
                    onClick={() => { setOtpStep(1); setOtp(''); setErrors({}); }}
                  >
                    Change Email
                  </button>
                </div>

                <Input
                  id="otp-code"
                  label="6-Digit Verification Code"
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => { setOtp(e.target.value.replace(/\D/g, '')); if (errors.otp) setErrors({}); }}
                  placeholder="e.g. 123456"
                  error={errors.otp}
                  required
                  autoFocus
                  leftIcon={
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0110 0v4" />
                    </svg>
                  }
                />

                <div className={styles.resendRow}>
                  <span>Didn't receive code?</span>
                  <button
                    type="button"
                    className={styles.resendBtn}
                    disabled={resendTimer > 0 || loading}
                    onClick={handleRequestOtp}
                  >
                    {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend Code'}
                  </button>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  size="lg"
                  loading={loading}
                  id="verify-otp-btn"
                >
                  Verify Code & Access Courses →
                </Button>
              </form>
            )}
          </div>
        )}

        {/* Password Login Flow */}
        {authMode === 'password' && (
          <form onSubmit={handlePasswordLogin} className={styles.form} noValidate>
            <Input
              id="login-email"
              label="Email address"
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors({}); }}
              placeholder="you@example.com"
              error={errors.email}
              required
              autoComplete="email"
              leftIcon={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              }
            />

            <Input
              id="login-password"
              label="Password"
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); if (errors.password) setErrors({}); }}
              placeholder="Enter your password"
              error={errors.password}
              required
              autoComplete="current-password"
              leftIcon={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0110 0v4" />
                </svg>
              }
            />

            <Button type="submit" variant="primary" fullWidth size="lg" loading={loading} id="login-submit-btn">
              Log In
            </Button>
          </form>
        )}

        <p className={styles.switchText}>
          Need help with your order?{' '}
          <Link to="/" className={styles.switchLink}>Return to Home</Link>
        </p>
      </div>
    </div>
  );
}
