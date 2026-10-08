// =========================================================
//  Footer Component — Digital Product Platform
//  No login links, clean and modern
// =========================================================

import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';
import styles from './Footer.module.css';

export default function Footer() {
  const { isAuthenticated, currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/');
    } catch {
      toast.error('Failed to log out');
    }
  };

  const scrollToSection = (e, id) => {
    e.preventDefault();
    const el = document.getElementById(id);
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
  };

  return (
    <footer className={styles.footer} role="contentinfo">
      <div className={['container', styles.inner].join(' ')}>
        <div className={styles.brand}>
          <Link to="/" className={styles.logo}>
            <div className={styles.logoIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0B0B0B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className={styles.logoText}>Flair <span className={styles.logoAccent}>Academy</span></span>
          </Link>
          <p className={styles.tagline}>
            A 3-Hour practical session to take you from idea to your first profitable digital product with AI.
          </p>
          <div className={styles.pillList}>
            <span className={styles.badgePill}>Practical</span>
            <span className={styles.badgePill}>Beginner-Friendly</span>
            <span className={styles.badgePill}>AI-Powered</span>
          </div>
        </div>

        <div className={styles.linksGrid}>
          <div className={styles.linkGroup}>
            <h4 className={styles.groupTitle}>Session Navigation</h4>
            <ul className={styles.linkList}>
              <li><a href="#curriculum" onClick={(e) => scrollToSection(e, 'curriculum')} className={styles.link}>What You'll Learn</a></li>
              <li><a href="#journey" onClick={(e) => scrollToSection(e, 'journey')} className={styles.link}>The 7-Step Journey</a></li>
              <li><a href="#who-is-this-for" onClick={(e) => scrollToSection(e, 'who-is-this-for')} className={styles.link}>Who Is This For?</a></li>
              <li><a href="#what-can-you-create" onClick={(e) => scrollToSection(e, 'what-can-you-create')} className={styles.link}>What You Can Create</a></li>
              <li><a href="#mvp" onClick={(e) => scrollToSection(e, 'mvp')} className={styles.link}>Start With an MVP</a></li>
            </ul>
          </div>

          <div className={styles.linkGroup}>
            <h4 className={styles.groupTitle}>Get Started</h4>
            <ul className={styles.linkList}>
              <li><Link to="/my-learning" className={styles.link}>Student Access / My Courses</Link></li>
              <li><a href="#pricing" onClick={(e) => scrollToSection(e, 'pricing')} className={styles.link}>Instant Access — ₹499</a></li>
              <li><a href="#what-you-get" onClick={(e) => scrollToSection(e, 'what-you-get')} className={styles.link}>What You Get (AI Prompts & SOPs)</a></li>
              <li><a href="#faqs" onClick={(e) => scrollToSection(e, 'faqs')} className={styles.link}>Frequently Asked Questions</a></li>
              {isAuthenticated && (
                <li>
                  <button
                    onClick={handleLogout}
                    className={styles.link}
                    style={{ background: 'none', border: 'none', padding: 0, color: '#EF4444', cursor: 'pointer', font: 'inherit' }}
                  >
                    Log Out ({currentUser?.name || currentUser?.email || 'Account'})
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      <div className={styles.bottom}>
        <div className={['container', styles.bottomInner].join(' ')}>
          <p className={styles.copyright}>
            © {new Date().getFullYear()} Create & Sell Your First Digital Product With AI. All rights reserved.
          </p>
          <div className={styles.bottomMeta}>
            <span>🔒 Secure Instant Checkout</span>
            <span>•</span>
            <span>⚡ Instant Session Access</span>
            {isAuthenticated && (
              <>
                <span>•</span>
                <button
                  onClick={handleLogout}
                  style={{ background: 'none', border: 'none', padding: 0, color: '#EF4444', cursor: 'pointer', fontSize: 'inherit', fontWeight: 600 }}
                >
                  Sign Out
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
