// =========================================================
//  My Learning Page — Instant Student Access & Progress
// =========================================================

import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useCourseContext } from '../../hooks/useCourses';
import { MOCK_COURSES } from '../../utils/mockData';
import { getInitials } from '../../utils/helpers';
import CourseProgress from '../../components/course/CourseProgress';
import EmptyState from '../../components/common/EmptyState';
import PasswordlessAuthCard from '../../components/auth/PasswordlessAuthCard';
import toast from 'react-hot-toast';
import styles from './MyCourses.module.css';

export default function MyCourses() {
  const { currentUser, isAuthenticated, logout } = useAuth();
  const { enrollments, enrollmentsLoading, fetchEnrollments, courses, fetchCourses } = useCourseContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      fetchEnrollments();
      fetchCourses();
    }
  }, [isAuthenticated, fetchEnrollments, fetchCourses]);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
    } catch {
      toast.error('Failed to logout');
    }
  };

  const handleAuthSuccess = () => {
    fetchEnrollments();
  };

  const allCourses = courses.length > 0 ? courses : MOCK_COURSES;
  const enrolledCourses = allCourses.filter((c) =>
    enrollments.some((e) => String(e.course_id) === String(c.id))
  );

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
            {/* User Account Bar & Logout */}
            <div className={styles.userBar}>
              <div className={styles.userProfile}>
                <div className={styles.avatar}>
                  {currentUser?.avatar ? (
                    <img src={currentUser.avatar} alt={currentUser.name} />
                  ) : (
                    <span>{getInitials(currentUser?.name || currentUser?.email || 'User')}</span>
                  )}
                </div>
                <div className={styles.userDetails}>
                  <div className={styles.userNameRow}>
                    <span className={styles.userName}>{currentUser?.name || 'Student Account'}</span>
                    <span className={styles.userBadge}>
                      {enrolledCourses.length > 0 ? 'Active Student' : 'Student Account'}
                    </span>
                  </div>
                  <span className={styles.userEmail}>{currentUser?.email || 'Logged in'}</span>
                </div>
              </div>

              <div className={styles.userActions}>
                <Link to="/" className={styles.homeBtn}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                  <span>Explore Masterclasses</span>
                </Link>

                <button onClick={handleLogout} className={styles.logoutBtn} title="Sign Out of your account">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                  <span>Log Out</span>
                </button>
              </div>
            </div>

            <div className={styles.header}>
              <h1 className={styles.title}>My Learning</h1>
              <p className={styles.sub}>
                Pick up right where you left off. All your purchased courses with automatic progress tracking.
              </p>
            </div>

            {enrollmentsLoading ? (
              <div className={styles.loading}>
                {[1, 2].map((i) => (
                  <div key={i} className={styles.skeletonCard} aria-hidden="true">
                    <div className={styles.skeletonThumb} />
                    <div style={{ flex: 1, padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div className={styles.skeletonLine} style={{ width: '70%', height: '16px' }} />
                      <div className={styles.skeletonLine} style={{ width: '50%', height: '12px' }} />
                      <div className={styles.skeletonLine} style={{ height: '6px' }} />
                      <div className={styles.skeletonLine} style={{ width: '80px', height: '12px' }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : enrolledCourses.length === 0 ? (
              <EmptyState
                icon={
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M4 19.5A2.5 2.5 0 016.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
                  </svg>
                }
                title="No active course enrollments found for this email"
                description={`Logged in as ${currentUser?.email}. If you purchased under a different email address, log out and enter that email address.`}
                actionLabel="Browse Available Masterclasses"
                onAction={() => navigate('/')}
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
