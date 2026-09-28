// =========================================================
//  My Learning Page — Instant Student Access & Progress
// =========================================================

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useCourseContext } from '../../hooks/useCourses';
import { MOCK_COURSES } from '../../utils/mockData';
import { getInitials } from '../../utils/helpers';
import CourseProgress from '../../components/course/CourseProgress';
import EmptyState from '../../components/common/EmptyState';
import PasswordlessAuthCard from '../../components/auth/PasswordlessAuthCard';
import styles from './MyCourses.module.css';

export default function MyCourses() {
  const { currentUser, isAuthenticated } = useAuth();
  const { enrollments, enrollmentsLoading, fetchEnrollments, courses, fetchCourses } = useCourseContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      fetchEnrollments();
      fetchCourses();
    }
  }, [isAuthenticated, fetchEnrollments, fetchCourses]);

  const handleAuthSuccess = () => {
    fetchEnrollments();
  };

  const allCourses = courses.length > 0 ? courses : MOCK_COURSES;
  const enrolledCourses = allCourses.filter((c) =>
    enrollments.some((e) => String(e.course_id) === String(c.id))
  );

  const hasEnrollments = enrolledCourses.length > 0;
  const badgeText = hasEnrollments ? 'ACTIVE STUDENT' : 'STUDENT';

  return (
    <div className={styles.page}>
      <div className="container">
        {/* If user is NOT authenticated, show Passwordless Access Verification */}
        {!isAuthenticated ? (
          <div style={{ paddingTop: '20px', paddingBottom: '40px' }}>
            <PasswordlessAuthCard
              title="Access Your Purchased Courses"
              subtitle="Enter the email address you used at checkout. We'll send you a 6-digit verification code for instant passwordless access."
              actionText="Verify & View My Courses"
              onSuccess={handleAuthSuccess}
            />
          </div>
        ) : (
          <>
            {/* Clean User Identity Profile Card (No duplicate action buttons) */}
            <div className={styles.profileCard}>
              <div className={styles.avatar}>
                {currentUser?.avatar ? (
                  <img src={currentUser.avatar} alt={currentUser.name || 'User'} />
                ) : (
                  <span>{getInitials(currentUser?.name || currentUser?.email || 'User')}</span>
                )}
              </div>
              <div className={styles.profileInfo}>
                <div className={styles.nameRow}>
                  <span className={styles.userName}>{currentUser?.name || 'Student Account'}</span>
                  <span className={hasEnrollments ? styles.badgeActive : styles.badgeInactive}>
                    {badgeText}
                  </span>
                </div>
                <span className={styles.userEmail}>{currentUser?.email || 'Logged in'}</span>
              </div>
            </div>

            {/* Section Header */}
            <div className={styles.sectionHeader}>
              <h1 className={styles.title}>My Learning</h1>
              <p className={styles.sub}>
                Pick up right where you left off. All your purchased courses with automatic progress tracking.
              </p>
            </div>

            {/* Content: Loading Skeleton | Empty State | Enrolled Courses */}
            {enrollmentsLoading ? (
              <div className={styles.loading}>
                {[1, 2].map((i) => (
                  <div key={i} className={styles.skeletonCard} aria-hidden="true">
                    <div className={styles.skeletonThumb} />
                    <div style={{ flex: 1, padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div className={styles.skeletonLine} style={{ width: '60%', height: '18px' }} />
                      <div className={styles.skeletonLine} style={{ width: '40%', height: '14px' }} />
                      <div className={styles.skeletonLine} style={{ height: '8px', margin: '8px 0' }} />
                      <div className={styles.skeletonLine} style={{ width: '120px', height: '14px' }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : enrolledCourses.length === 0 ? (
              <EmptyState
                icon={
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
                  </svg>
                }
                title="No courses yet"
                description="Your purchased courses will appear here."
                actionLabel="Browse Masterclasses"
                onAction={() => navigate('/courses')}
              />
            ) : (
              <div className={styles.coursesList}>
                {enrolledCourses.map((course) => {
                  const enrollment = enrollments.find((e) => String(e.course_id) === String(course.id));
                  return <CourseProgress key={course.id} course={course} enrollment={enrollment} />;
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
