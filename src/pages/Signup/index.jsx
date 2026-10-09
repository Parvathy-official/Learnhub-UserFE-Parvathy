// =========================================================
//  Signup Page
// =========================================================

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import toast from 'react-hot-toast';
import styles from './Signup.module.css';

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Full name is required';
    if (!form.email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email address';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 8) e.password = 'Password must be at least 8 characters';
    if (!form.confirm) e.confirm = 'Please confirm your password';
    else if (form.password !== form.confirm) e.confirm = 'Passwords do not match';
    return e;
  };

  const handleChange = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    if (errors[field]) setErrors((err) => ({ ...err, [field]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      await signup({ name: form.name.trim(), email: form.email, password: form.password });
      toast.success('Account created! Welcome to with P 🎉');
      navigate('/my-learning');
    } catch (err) {
      const msg = err?.response?.data?.email?.[0] || err?.response?.data?.detail || err?.message || 'Signup failed';
      toast.error(msg);
      setErrors({ email: msg });
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = () => {
    const p = form.password;
    if (!p) return 0;
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    return score;
  };

  const strength = passwordStrength();
  const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['', '#EF4444', '#F59E0B', '#F59E0B', '#22C55E'];

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logo}>
          <img src="/logo.png" alt="with P" className={styles.logoImg} />
          <span className={styles.logoText}>with <span style={{ color: 'var(--primary)' }}>P</span></span>
        </div>

        <div className={styles.header}>
          <h1 className={styles.title}>Create your account</h1>
          <p className={styles.sub}>Join 50,000+ learners advancing their careers</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          <Input
            id="signup-name"
            label="Full name"
            type="text"
            value={form.name}
            onChange={handleChange('name')}
            placeholder="Your full name"
            error={errors.name}
            required
            autoComplete="name"
            leftIcon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
              </svg>
            }
          />

          <Input
            id="signup-email"
            label="Email address"
            type="email"
            value={form.email}
            onChange={handleChange('email')}
            placeholder="you@example.com"
            error={errors.email}
            required
            autoComplete="email"
            leftIcon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            }
          />

          <div>
            <Input
              id="signup-password"
              label="Password"
              type="password"
              value={form.password}
              onChange={handleChange('password')}
              placeholder="Min. 8 characters"
              error={errors.password}
              required
              autoComplete="new-password"
              leftIcon={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
                </svg>
              }
            />
            {form.password && (
              <div className={styles.strengthWrap}>
                <div className={styles.strengthBars}>
                  {[1, 2, 3, 4].map((n) => (
                    <div
                      key={n}
                      className={styles.strengthBar}
                      style={{ background: n <= strength ? strengthColors[strength] : 'var(--border)' }}
                    />
                  ))}
                </div>
                <span className={styles.strengthLabel} style={{ color: strengthColors[strength] }}>
                  {strengthLabels[strength]}
                </span>
              </div>
            )}
          </div>

          <Input
            id="signup-confirm"
            label="Confirm password"
            type="password"
            value={form.confirm}
            onChange={handleChange('confirm')}
            placeholder="Re-enter your password"
            error={errors.confirm}
            required
            autoComplete="new-password"
            leftIcon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
              </svg>
            }
          />

          <Button type="submit" variant="primary" fullWidth size="lg" loading={loading} id="signup-submit-btn">
            Create Account
          </Button>
        </form>

        <p className={styles.terms}>
          By signing up, you agree to our{' '}
          <a href="#" className={styles.termsLink}>Terms</a> &{' '}
          <a href="#" className={styles.termsLink}>Privacy Policy</a>
        </p>

        <p className={styles.switchText}>
          Already have an account?{' '}
          <Link to="/login" className={styles.switchLink}>Log in</Link>
        </p>
      </div>
    </div>
  );
}
