// =========================================================
//  PaymentSuccess Page — Simple Paid Online Course Platform
// =========================================================

import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { useCourseContext } from '../../hooks/useCourses';
import courseService from '../../services/courseService';
import Button from '../../components/common/Button';
import styles from './PaymentSuccess.module.css';

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { courses, enrollments } = useCourseContext();

  const queryCourseId = searchParams.get('courseId') || searchParams.get('course');
  const stateCourseId = location.state?.courseId || location.state?.course_id;
  const fallbackCourseId = enrollments?.[0]?.course_id ? String(enrollments[0].course_id) : '1';

  const courseId = queryCourseId || stateCourseId || fallbackCourseId;
  const orderId = searchParams.get('orderId') || searchParams.get('order_id') || location.state?.orderId || location.state?.order_id;

  const [course, setCourse] = useState(() => {
    return courses?.find((c) => String(c.id) === String(courseId)) || null;
  });

  useEffect(() => {
    if (!course && courseId) {
      courseService
        .getCourseById(courseId)
        .then((data) => {
          if (data) setCourse(data);
        })
        .catch(() => {
          // Keep current fallback
        });
    }
  }, [courseId, course]);

  const handleContinue = () => {
    const targetId = courseId || '1';
    navigate(`/course/${targetId}/learn`);
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        {/* Success Icon */}
        <div className={styles.successIcon} aria-hidden="true">
          <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        {/* Title */}
        <h1 className={styles.title}>Payment Successful!</h1>

        {/* Primary Confirmation Text */}
        <p className={styles.desc}>
          Your payment has been completed successfully and your course access is ready.
        </p>

        {/* Purchased Course Card (if available) */}
        {course && (
          <div className={styles.courseBadge}>
            <span className={styles.courseBadgeLabel}>Enrolled Course</span>
            <span className={styles.courseBadgeTitle}>{course.title}</span>
          </div>
        )}

        {/* Email Instruction Callout Box */}
        <div className={styles.emailNoticeBox}>
          <div className={styles.emailNoticeHeader}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary, #06B6D4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            <span className={styles.emailNoticeTitle}>Course Details & Confirmation</span>
          </div>
          <p className={styles.emailNoticeText}>
            Please check your registered email for the course details and confirmation.
          </p>
          <div className={styles.spamAlert}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>
              If you don't see the email in your inbox, please check your <strong>Spam</strong>, <strong>Junk</strong>, or <strong>Promotions</strong> folder as well.
            </span>
          </div>
        </div>

        {/* Order Reference if present */}
        {orderId && (
          <div className={styles.orderRef}>
            <span className={styles.orderRefLabel}>Order Reference:</span>
            <span className={styles.orderRefCode}>{orderId}</span>
          </div>
        )}

        {/* Prominent Action Button */}
        <div className={styles.actions}>
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={handleContinue}
            id="ok-continue-btn"
            className={styles.continueBtn}
          >
            OK / Continue
          </Button>
        </div>
      </div>
    </div>
  );
}
