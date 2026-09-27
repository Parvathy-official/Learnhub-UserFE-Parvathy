// =========================================================
//  GlobalUserBar Component — Floating Student Session Bar
//  Visible across all pages ONLY when student is logged in
// =========================================================

import { Link, useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';
import { useCourseContext } from '../../hooks/useCourses';
import styles from './GlobalUserBar.module.css';

export default function GlobalUserBar() {
  const { isAuthenticated, currentUser, logout } = useAuth();
  const { isEnrolled } = useCourseContext();
  const navigate = useNavigate();
  const location = useLocation();

  if (!isAuthenticated) {
    return (
      <div className={styles.wrapper} id="global-user-bar">
        <Link to="/my-learning" className={styles.guestAccessBtn} id="student-access-top-btn" title="Access your purchased courses">
          <div className={styles.guestIconWrap}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
          </div>
          <span>Student Access</span>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </Link>
      </div>
    );
  }

  const hasCourse1 = isEnrolled('1');
  const isPlayerPage = location.pathname.includes('/learn');

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/');
    } catch {
      toast.error('Failed to log out');
    }
  };

  return (
    <div className={styles.wrapper} id="global-user-bar">
      <div className={styles.bar}>
        {/* Student identity */}
        <div className={styles.userSection}>
          <div className={styles.onlineDot} />
          <div className={styles.avatar}>
            {currentUser?.avatar ? (
              <img src={currentUser.avatar} alt="User" />
            ) : (
              <span>{(currentUser?.name || currentUser?.email || 'U')[0].toUpperCase()}</span>
            )}
          </div>
          <span className={styles.userName}>
            {currentUser?.name || currentUser?.email?.split('@')[0] || 'Student'}
          </span>
        </div>

        {/* Quick Navigation Links */}
        <div className={styles.navSection}>
          {hasCourse1 && !isPlayerPage && (
            <Link to="/course/1/learn" className={styles.resumeLink} title="Resume Masterclass Video Player">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
              <span>Resume Masterclass</span>
            </Link>
          )}

          {location.pathname !== '/my-learning' && (
            <Link to="/my-learning" className={styles.myCoursesLink}>
              <span>My Courses</span>
            </Link>
          )}

          {/* Global Log Out Button */}
          <button onClick={handleLogout} className={styles.logoutBtn} id="global-logout-btn" title="Sign out from this device">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            <span>Log Out</span>
          </button>
        </div>
      </div>
    </div>
  );
}
