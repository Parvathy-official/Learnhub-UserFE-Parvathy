import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useCourseContext } from '../../hooks/useCourses';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { currentUser, isAuthenticated } = useAuth();
  const { isEnrolled } = useCourseContext();

  const userHasAccess = isAuthenticated || isEnrolled('1');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const scrollToPricing = (e) => {
    if (location.pathname === '/') {
      e.preventDefault();
      const el = document.getElementById('pricing');
      if (el) {
        const offset = 80;
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = el.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });
      }
    }
  };

  return (
    <nav
      className={[styles.navbar, scrolled ? styles.scrolled : ''].filter(Boolean).join(' ')}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className={[styles.inner, 'container'].join(' ')}>
        {/* Logo */}
        <Link to="/" className={styles.logo} aria-label="Flair Academy home">
          <div className={styles.logoIcon}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#030708" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <div className={styles.brandText}>
            <span className={styles.logoText}>
              Flair <span className={styles.logoAccent}>Academy</span>
            </span>
            <span className={styles.logoSubtext}>Performance & AI Masterclass</span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div className={styles.navLinks}>
          <Link
            to="/"
            className={[styles.navLink, location.pathname === '/' ? styles.navLinkActive : ''].join(' ')}
          >
            Home
          </Link>
          <Link
            to="/courses"
            className={[styles.navLink, location.pathname.startsWith('/courses') ? styles.navLinkActive : ''].join(' ')}
            id="nav-all-courses-link"
          >
            All Courses
          </Link>
          <a
            href="/#curriculum"
            onClick={(e) => {
              if (location.pathname === '/') {
                e.preventDefault();
                const el = document.getElementById('curriculum') || document.getElementById('modules');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className={styles.navLink}
          >
            Curriculum
          </a>
          <Link
            to="/my-learning"
            className={[styles.navLink, location.pathname.startsWith('/my-learning') ? styles.navLinkActive : ''].join(' ')}
          >
            My Learning
          </Link>
        </div>

        {/* Action Buttons */}
        <div className={styles.actions}>
          <Link to="/my-learning" className={styles.loginLink} id="nav-my-learning-link">
            <span>{currentUser?.name ? `👤 ${currentUser.name.split(' ')[0]}` : 'Student Access'}</span>
          </Link>

          {userHasAccess ? (
            <Link
              to="/course/1/learn"
              className={styles.resumeCtaBtn}
              id="nav-resume-learning-btn"
            >
              <span className={styles.playIcon}>▶</span>
              <span className={styles.ctaButtonText}>Resume Masterclass</span>
            </Link>
          ) : (
            <a
              href="#pricing"
              onClick={scrollToPricing}
              className={styles.staticCtaBtn}
              id="nav-instant-access-btn"
            >
              <span className={styles.ctaPulse} />
              <span className={styles.ctaText}>GET INSTANT ACCESS</span>
              <span className={styles.ctaPrice}>₹499</span>
            </a>
          )}

          {/* Hamburger toggle for mobile */}
          <button
            className={styles.hamburgerBtn}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className={styles.mobileDrawer}>
          <Link to="/" className={styles.mobileNavLink}>
            Home
          </Link>
          <Link to="/courses" className={styles.mobileNavLink}>
            All Courses
          </Link>
          <Link to="/my-learning" className={styles.mobileNavLink}>
            My Learning
          </Link>
        </div>
      )}
    </nav>
  );
}


