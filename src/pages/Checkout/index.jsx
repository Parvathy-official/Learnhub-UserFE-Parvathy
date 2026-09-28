// =========================================================
//  Checkout Page — 1-Step Instant Access & Checkout
//  No login required: enter Name & Email to unlock access
// =========================================================

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useCourseContext } from '../../hooks/useCourses';
import courseService from '../../services/courseService';
import paymentService from '../../services/paymentService';
import Button from '../../components/common/Button';
import { formatPrice, discountPercent } from '../../utils/helpers';
import toast from 'react-hot-toast';
import styles from './Checkout.module.css';

export default function Checkout() {
  const { courseId } = useParams();
  const validId = courseId || '1';
  const { currentUser, updateUser, setAuthSession, isAuthenticated } = useAuth();
  const { addEnrollment, addPurchase, fetchEnrollments } = useCourseContext();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);

  // Buyer details
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    if (currentUser?.name && !name) setName(currentUser.name);
    if (currentUser?.email && !email) setEmail(currentUser.email);
  }, [currentUser]);

  useEffect(() => {
    courseService
      .getCourseById(validId)
      .then(setCourse)
      .catch(() => {
        // Fallback to first course in mockData
        import('../../utils/mockData').then((m) => {
          setCourse(m.MOCK_COURSES[0]);
        });
      })
      .finally(() => setLoading(false));
  }, [validId]);

  // Complete purchase, authenticate user, refresh enrollments, and redirect
  const completeSuccessfulCheckout = async (userData, accessToken, refreshToken, orderRef) => {
    if (setAuthSession) {
      setAuthSession({
        user: userData,
        access: accessToken,
        refresh: refreshToken,
      });
    } else {
      if (accessToken) localStorage.setItem('access_token', accessToken);
      if (refreshToken) localStorage.setItem('refresh_token', refreshToken);
      if (userData) {
        localStorage.setItem('user', JSON.stringify(userData));
        if (updateUser) updateUser(userData);
      }
    }

    const finalPrice = course?.discounted_price || 499;

    // Record purchase in context state
    addPurchase({
      id: orderRef,
      course_id: validId,
      course_title: course?.title || 'Performance Marketing Masterclass',
      purchase_date: new Date().toISOString(),
      amount: finalPrice,
      status: 'paid',
      payment_method: 'UPI / Online Instant',
    });

    // Update enrollment state and fetch fresh enrollments from backend
    addEnrollment({
      course_id: validId,
      progress_percentage: 0,
      completed_lessons: [],
      last_watched_lesson: 'l1',
      last_position_seconds: 0,
    });

    if (fetchEnrollments) {
      try {
        await fetchEnrollments();
      } catch {
        // Continue navigation even if background fetch hits network lag
      }
    }

    toast.success('Instant Access Granted! Welcome to the Masterclass! 🎉');
    navigate(`/course/${validId}/learn`);
  };

  const handlePayment = async (e) => {
    if (e) e.preventDefault();

    if (!name.trim() || !email.trim()) {
      toast.error('Please enter your Name and Email Address.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address.');
      return;
    }

    setPaying(true);

    let poller = null;
    let isFinished = false;

    try {
      // Save buyer profile in storage
      const buyerData = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        avatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80',
      };
      if (updateUser) updateUser(buyerData);
      localStorage.setItem('user', JSON.stringify(buyerData));

      // Step 1: Create order on backend (Guest / Authenticated)
      console.log('[Checkout] Creating Razorpay order for course:', validId);
      const order = await paymentService.createOrder(validId, {
        name: buyerData.name,
        email: buyerData.email,
        phone: buyerData.phone,
      });

      if (!order || !order.order_id) {
        throw new Error('Failed to create payment order. Please try again.');
      }

      console.log('[Checkout] Razorpay order created successfully:', {
        order_id: order.order_id,
        amount: order.amount,
        currency: order.currency,
      });

      // Start background polling every 2.5 seconds to auto-detect payment completion
      poller = setInterval(async () => {
        if (isFinished) {
          if (poller) clearInterval(poller);
          return;
        }
        try {
          const statusRes = await paymentService.getPaymentStatus(order.order_id);
          if (statusRes && statusRes.status === 'paid' && !isFinished) {
            isFinished = true;
            if (poller) clearInterval(poller);
            console.log('[Checkout] Background poller detected payment completed for order:', order.order_id);
            await completeSuccessfulCheckout(
              statusRes.user || buyerData,
              statusRes.access,
              statusRes.refresh,
              order.order_id
            );
          }
        } catch {
          // Ignore background polling errors
        }
      }, 2500);

      // Step 2: Open Razorpay modal
      const paymentResult = await paymentService.openRazorpay({
        key: order?.key,
        amount: order?.amount,
        currency: order?.currency || 'INR',
        name: 'LearnFlow Academy',
        description: course?.title || 'Performance Marketing Masterclass',
        order_id: order?.order_id,
        prefill: { name: buyerData.name, email: buyerData.email, contact: phone },
        theme: { color: '#06B6D4' },
      });

      // If user dismissed modal, check if payment succeeded in background
      if (paymentResult?.dismissed) {
        console.log('[Checkout] Modal closed, checking final order status for:', order.order_id);
        try {
          const checkStatus = await paymentService.getPaymentStatus(order.order_id);
          if (checkStatus && checkStatus.status === 'paid' && !isFinished) {
            isFinished = true;
            if (poller) clearInterval(poller);
            await completeSuccessfulCheckout(
              checkStatus.user || buyerData,
              checkStatus.access,
              checkStatus.refresh,
              order.order_id
            );
            return;
          }
        } catch {}

        if (!isFinished) {
          if (poller) clearInterval(poller);
          setPaying(false);
          return;
        }
      }

      // Step 3: Verify payment signature server-side
      const targetOrderId = paymentResult?.razorpay_order_id || order?.order_id;
      if (paymentResult?.razorpay_payment_id && !isFinished) {
        console.log('[Checkout] Razorpay modal succeeded. Verifying payment server-side for order:', targetOrderId);
        const verification = await paymentService.verifyPayment({
          razorpay_order_id: targetOrderId,
          razorpay_payment_id: paymentResult.razorpay_payment_id,
          razorpay_signature: paymentResult.razorpay_signature,
          course_id: validId,
        });

        console.log('[Checkout] Server verification response received:', {
          success: verification?.success,
          enrollment_id: verification?.enrollment_id,
        });

        if (verification && verification.success && !isFinished) {
          isFinished = true;
          if (poller) clearInterval(poller);
          await completeSuccessfulCheckout(
            verification.user || buyerData,
            verification.access,
            verification.refresh,
            targetOrderId
          );
        } else if (!isFinished) {
          throw new Error(verification?.error || 'Payment verification failed');
        }
      }
    } catch (err) {
      if (!isFinished) {
        const errMsg = err?.response?.data?.error || err?.response?.data?.detail || err?.message || 'Payment could not be completed. Please try again.';
        console.error('[Checkout] Checkout/Payment error:', errMsg);
        toast.error(errMsg);
      }
    } finally {
      if (poller) clearInterval(poller);
      if (!isFinished) {
        setPaying(false);
      }
    }
  };


  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner} />
      </div>
    );
  }

  if (!course) return null;

  const discount = discountPercent(course.price, course.discounted_price || 499);
  const final = course.discounted_price || 499;
  const original = course.price || 2499;
  const savings = original - final;

  return (
    <div className={styles.page}>
      <div className={['container', styles.layout].join(' ')}>
        {/* Left Column: Order Summary */}
        <div className={styles.summary}>
          <div className={styles.courseCard}>
            <img src={course.thumbnail} alt={course.title} className={styles.thumb} />
            <div className={styles.courseInfo}>
              <p className={styles.courseCategory}>Practical Masterclass</p>
              <h3 className={styles.courseTitle}>{course.title}</h3>
              <p className={styles.courseSubtitle}>{course.subtitle || 'A 3-Hour Practical Session to Take You From Idea to Your First Digital Product'}</p>
              <div className={styles.courseMeta}>
                <span>⚡ 3-Hour Session</span>
                <span>•</span>
                <span>🤖 AI Prompts Included</span>
                <span>•</span>
                <span>📈 Meta Ads Blueprints</span>
              </div>
            </div>
          </div>

          {/* Value inclusions checklist */}
          <div className={styles.inclusionsCard}>
            <h4 className={styles.inclusionsTitle}>What you receive immediately:</h4>
            <div className={styles.inclusionsList}>
              <div className={styles.inclusionItem}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                <span>Full 3-Hour practical on-demand video session</span>
              </div>
              <div className={styles.inclusionItem}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                <span>Ready-to-use AI prompts for niche discovery & product creation</span>
              </div>
              <div className={styles.inclusionItem}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                <span>Meta Ads launch & scaling SOPs</span>
              </div>
              <div className={styles.inclusionItem}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                <span>Full lifetime access with all future updates</span>
              </div>
            </div>
          </div>

          {/* Pricing Breakdown */}
          <div className={styles.priceBreakdown}>
            <div className={styles.priceRow}>
              <span>Original Value</span>
              <span className={styles.strikethrough}>{formatPrice(original)}</span>
            </div>
            {discount > 0 && (
              <div className={[styles.priceRow, styles.discount].join(' ')}>
                <span>Special Instant Discount ({discount}% OFF)</span>
                <span>- {formatPrice(savings)}</span>
              </div>
            )}
            <div className={[styles.priceRow, styles.total].join(' ')}>
              <span>Total Investment</span>
              <span className={styles.totalPriceText}>{formatPrice(final)}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Direct Buyer Details & Payment Panel */}
        <div className={styles.paymentPanel}>
          <div className={styles.panelHeader}>
            <h2 className={styles.paymentTitle}>Buyer Information</h2>
            <p className={styles.paymentSubtitle}>Enter your details for instant access delivery</p>
          </div>

          <form onSubmit={handlePayment} className={styles.checkoutForm}>
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel} htmlFor="buyer-name">
                Full Name <span className={styles.req}>*</span>
              </label>
              <input
                id="buyer-name"
                type="text"
                className={styles.inputField}
                placeholder="e.g. Alex Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.inputLabel} htmlFor="buyer-email">
                Email Address <span className={styles.req}>*</span>
              </label>
              <input
                id="buyer-email"
                type="email"
                className={styles.inputField}
                placeholder="e.g. alex@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <span className={styles.inputHelp}>Access links & session files will be sent here</span>
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.inputLabel} htmlFor="buyer-phone">
                Phone / WhatsApp <span className={styles.opt}>(Optional)</span>
              </label>
              <input
                id="buyer-phone"
                type="tel"
                className={styles.inputField}
                placeholder="e.g. +91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className={styles.totalBox}>
              <div>
                <span className={styles.totalLabel}>Total Amount:</span>
                <span className={styles.oneTimeTag}>One-Time Payment</span>
              </div>
              <span className={styles.totalAmount}>{formatPrice(final)}</span>
            </div>

            <Button
              variant="primary"
              size="lg"
              fullWidth
              loading={paying}
              type="submit"
              id="pay-now-btn"
            >
              {paying ? 'Processing Instant Access…' : `GET INSTANT ACCESS — ${formatPrice(final)}`}
            </Button>
          </form>

          <div className={styles.guarantees}>
            <div className={styles.guarantee}>
              <span>🔒</span>
              <span>100% Secure & Encrypted Payment</span>
            </div>
            <div className={styles.guarantee}>
              <span>⚡</span>
              <span>Instant Access Granted Immediately</span>
            </div>
            <div className={styles.guarantee}>
              <span>♾️</span>
              <span>Lifetime Unlimited Access</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
