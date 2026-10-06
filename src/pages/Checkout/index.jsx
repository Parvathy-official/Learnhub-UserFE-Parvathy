// =========================================================
//  Checkout Page — 1-Step Instant Access & Checkout
//  No login required: enter Name & Email to unlock access
// =========================================================

import { useEffect, useState, useRef } from 'react';
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
  const { currentUser, updateUser, setAuthSession } = useAuth();
  const { addEnrollment, addPurchase, fetchEnrollments, isEnrolled } = useCourseContext();
  const navigate = useNavigate();

  const pollerRef = useRef(null);
  const isFinishedRef = useRef(false);
  const completedRef = useRef(false);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser?.name, currentUser?.email]);

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

  useEffect(() => {
    return () => {
      isFinishedRef.current = true;
      completedRef.current = true;
      if (pollerRef.current) {
        clearInterval(pollerRef.current);
        pollerRef.current = null;
      }
    };
  }, []);

  // Complete purchase, authenticate user, refresh enrollments, and redirect
  const completeSuccessfulCheckout = async (userData, accessToken, refreshToken, orderRef) => {
    if (completedRef.current) return;
    completedRef.current = true;
    isFinishedRef.current = true;

    if (pollerRef.current) {
      clearInterval(pollerRef.current);
      pollerRef.current = null;
    }

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

    console.log('[Payment] navigating to payment-success');
    toast.success('Instant Access Granted! Welcome to the Masterclass! 🎉');
    navigate(`/payment-success?courseId=${validId}${orderRef ? `&orderId=${encodeURIComponent(orderRef)}` : ''}`, {
      state: { courseId: validId, orderId: orderRef },
    });
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
    isFinishedRef.current = false;
    completedRef.current = false;
    if (pollerRef.current) {
      clearInterval(pollerRef.current);
      pollerRef.current = null;
    }

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

      // Priority 1: When paymentResult contains razorpay_payment_id (standard handler response)
      const targetOrderId = paymentResult?.razorpay_order_id || order?.order_id;
      if (paymentResult?.razorpay_payment_id && !isFinishedRef.current && !completedRef.current) {
        console.log('[Payment] verifying payment');
        const verification = await paymentService.verifyPayment({
          razorpay_order_id: targetOrderId,
          razorpay_payment_id: paymentResult.razorpay_payment_id,
          razorpay_signature: paymentResult.razorpay_signature,
          course_id: validId,
        });
        console.log('[Payment] verification response:', verification?.success ? 'success: true' : 'success: false');

        if (verification && verification.success && !isFinishedRef.current && !completedRef.current) {
          console.log('[Payment] verification successful');
          if (pollerRef.current) {
            clearInterval(pollerRef.current);
            pollerRef.current = null;
          }
          await completeSuccessfulCheckout(
            verification.user || buyerData,
            verification.access,
            verification.refresh,
            targetOrderId
          );
          return;
        } else if (!isFinishedRef.current && !completedRef.current) {
          console.log('[Payment] verification failed');
          throw new Error(verification?.error || 'Payment verification failed');
        }
      }

      // Priority 2: Fallback if modal was dismissed without direct handler resolution
      if (paymentResult?.dismissed && !paymentResult?.razorpay_payment_id && !isFinishedRef.current && !completedRef.current) {
        console.log('[Payment] checking order status');
        let confirmedPaid = false;
        let finalStatusRes = null;
        const MAX_STATUS_RETRIES = 5;
        const RETRY_INTERVAL_MS = 1500;

        for (let attempt = 1; attempt <= MAX_STATUS_RETRIES; attempt++) {
          if (isFinishedRef.current || completedRef.current) break;
          try {
            if (attempt > 1) {
              console.log(`[Payment] retrying order status (attempt ${attempt}/${MAX_STATUS_RETRIES})`);
            }
            finalStatusRes = await paymentService.getPaymentStatus(order.order_id);
            if (finalStatusRes && finalStatusRes.status === 'paid') {
              confirmedPaid = true;
              break;
            }
          } catch (statusErr) {
            console.warn(`[Payment] Status check error on attempt ${attempt}:`, statusErr?.message);
          }

          if (attempt < MAX_STATUS_RETRIES && !isFinishedRef.current && !completedRef.current) {
            await new Promise((resolve) => setTimeout(resolve, RETRY_INTERVAL_MS));
          }
        }

        if (confirmedPaid && finalStatusRes && !isFinishedRef.current && !completedRef.current) {
          console.log('[Payment] payment confirmed');
          console.log('[Payment] verification successful');
          if (pollerRef.current) {
            clearInterval(pollerRef.current);
            pollerRef.current = null;
          }
          await completeSuccessfulCheckout(
            finalStatusRes.user || buyerData,
            finalStatusRes.access,
            finalStatusRes.refresh,
            order.order_id
          );
          return;
        }

        if (!isFinishedRef.current && !completedRef.current) {
          console.log('[Payment] payment not confirmed');
          if (pollerRef.current) {
            clearInterval(pollerRef.current);
            pollerRef.current = null;
          }
          setPaying(false);
          return;
        }
      }
    } catch (err) {
      if (!isFinishedRef.current && !completedRef.current) {
        const errMsg = err?.response?.data?.error || err?.response?.data?.detail || err?.message || 'Payment could not be completed. Please try again.';
        console.error('[Checkout] Checkout/Payment error:', errMsg);
        if (errMsg?.toLowerCase().includes('already enrolled')) {
          toast.success('You already own this course!');
          if (fetchEnrollments) fetchEnrollments().catch(() => {});
          navigate(`/payment-success?courseId=${validId}`, { replace: true, state: { courseId: validId } });
          return;
        }
        toast.error(errMsg);
      }
    } finally {
      if (pollerRef.current) {
        clearInterval(pollerRef.current);
        pollerRef.current = null;
      }
      if (!isFinishedRef.current && !completedRef.current) {
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
