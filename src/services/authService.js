// =========================================================
//  Auth Service — POST /api/auth/...
// =========================================================

import api from './api';
import { delay } from '../utils/helpers';
import { MOCK_USER } from '../utils/mockData';

const USE_MOCK = false; // Connected to Django Backend

const authService = {
  /**
   * POST /api/auth/register/
   */
  async signup({ name, email, password }) {
    if (USE_MOCK) {
      await delay(1000);
      const user = { ...MOCK_USER, name, email };
      return { user, access: 'mock_access_token', refresh: 'mock_refresh_token' };
    }
    const { data } = await api.post('/auth/register/', { name, email, password });
    return data;
  },

  /**
   * POST /api/auth/login/
   */
  async login({ email, password }) {
    if (USE_MOCK) {
      await delay(800);
      if ((email === 'demo@withp.com' || email === 'demo@learnflow.com') && password === 'demo1234') {
        return { user: MOCK_USER, access: 'mock_access_token', refresh: 'mock_refresh_token' };
      }
      // For demo: accept any credentials
      const user = { ...MOCK_USER, email };
      return { user, access: 'mock_access_token', refresh: 'mock_refresh_token' };
    }
    const { data } = await api.post('/auth/login/', { email, password });
    return data;
  },

  /**
   * POST /api/auth/request-otp/
   */
  async requestOtp(email) {
    if (USE_MOCK) {
      await delay(600);
      return { success: true, message: 'Verification code sent to your email.' };
    }
    const { data } = await api.post('/auth/request-otp/', { email });
    return data;
  },

  /**
   * POST /api/auth/verify-otp/
   */
  async verifyOtp({ email, otp }) {
    if (USE_MOCK) {
      await delay(800);
      const user = { ...MOCK_USER, email };
      return { success: true, user, access: 'mock_access_token', refresh: 'mock_refresh_token' };
    }
    const { data } = await api.post('/auth/verify-otp/', { email, otp });
    return data;
  },

  /**
   * POST /api/auth/logout/
   */
  async logout() {
    if (USE_MOCK) {
      await delay(200);
      return;
    }
    const refreshToken = localStorage.getItem('refresh_token');
    await api.post('/auth/logout/', { refresh: refreshToken }).catch(() => {});
  },

  /**
   * GET /api/auth/me/
   */
  async getMe() {
    if (USE_MOCK) {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    }
    const { data } = await api.get('/auth/me/');
    return data;
  },
};

export default authService;

