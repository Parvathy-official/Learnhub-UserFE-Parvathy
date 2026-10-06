// =========================================================
//  Payment Service — Designed for Razorpay + Django backend
// =========================================================

import api from './api';
import { delay } from '../utils/helpers';

const USE_MOCK = false; // Connected to Django Backend

const paymentService = {
  /**
   * POST /api/payments/create-order/
   * Creates a payment order on the backend (Razorpay order ID)
   * Supports guest checkout by passing buyerData { name, email, phone }
   */
  async createOrder(courseId, buyerData = {}) {
    if (USE_MOCK) {
      await delay(800);
      return {
        order_id: `mock_order_${Date.now()}`,
        amount: 499900,
        currency: 'INR',
        key: 'rzp_test_mock',
      };
    }
    const payload = {
      course_id: courseId,
      ...(buyerData.name ? { name: buyerData.name } : {}),
      ...(buyerData.email ? { email: buyerData.email } : {}),
      ...(buyerData.phone ? { phone: buyerData.phone } : {}),
    };
    const { data } = await api.post('/payments/create-order/', payload);
    return data;
  },

  /**
   * POST /api/payments/verify/
   * Verifies payment signature with the backend
   */
  async verifyPayment({ razorpay_order_id, razorpay_payment_id, razorpay_signature, course_id }) {
    if (USE_MOCK) {
      await delay(1000);
      return { success: true, enrollment_id: `enroll_${Date.now()}` };
    }
    console.log('[PaymentService] Sending payment verification to /api/payments/verify/ for order:', razorpay_order_id);
    const { data } = await api.post('/payments/verify/', {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      course_id,
    });
    console.log('[PaymentService] Verification API response:', data?.success ? 'Success' : data);
    return data;
  },

  /**
   * GET /api/payments/status/:orderId/
   * Checks payment status from backend
   */
  async getPaymentStatus(orderId) {
    if (USE_MOCK) {
      await delay(400);
      return { status: 'paid', course_id: '1' };
    }
    const { data } = await api.get(`/payments/status/${orderId}/`);
    return data;
  },

  /**
   * Opens Razorpay checkout modal
   */
  openRazorpay(options) {
    return new Promise((resolve, reject) => {
      if (window.Razorpay && options.key && !options.key.startsWith('rzp_test_mock')) {
        let isResolved = false;
        let isDismissed = false;
        let dismissTimer = null;

        console.log('[Razorpay] Launching checkout popup for order:', options.order_id);
        const rzp = new window.Razorpay({
          ...options,
          handler: (response) => {
            if (dismissTimer) {
              clearTimeout(dismissTimer);
              dismissTimer = null;
            }
            if (isResolved) return;
            isResolved = true;

            console.log('[Razorpay] handler received');
            if (isDismissed) {
              console.log('[Razorpay] success handler arrived after dismiss');
            }
            console.log('[Razorpay] payment_id received:', response?.razorpay_payment_id);

            resolve({
              razorpay_payment_id: response?.razorpay_payment_id,
              razorpay_order_id: response?.razorpay_order_id || options.order_id,
              razorpay_signature: response?.razorpay_signature,
            });
          },
          modal: {
            ondismiss: () => {
              console.log('[Razorpay] modal dismissed');
              if (isResolved) return;

              isDismissed = true;
              console.log('[Razorpay] waiting for success handler');

              // Grace period: wait 2.5s for Razorpay's handler(response) before treating as user cancellation
              dismissTimer = setTimeout(() => {
                if (!isResolved) {
                  isResolved = true;
                  console.log('[Razorpay] resolving as dismissed');
                  resolve({
                    dismissed: true,
                    order_id: options.order_id,
                  });
                }
              }, 2500);
            },
          },
        });

        rzp.on('payment.failed', (response) => {
          if (dismissTimer) {
            clearTimeout(dismissTimer);
            dismissTimer = null;
          }
          if (isResolved) return;
          isResolved = true;
          const desc = response?.error?.description || 'Payment was unsuccessful';
          console.warn('[PaymentService] Razorpay payment failed callback:', desc);
          reject(new Error(desc));
        });

        rzp.open();
      } else {
        // Fallback for test / dev environment without Razorpay SDK script
        console.log('[PaymentService] Using dev fallback for Razorpay modal');
        setTimeout(() => {
          resolve({
            razorpay_payment_id: `pay_test_${Date.now()}`,
            razorpay_order_id: options.order_id,
            razorpay_signature: 'mock_signature',
          });
        }, 1200);
      }
    });
  },
};

export default paymentService;
