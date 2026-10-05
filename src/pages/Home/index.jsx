// =========================================================
//  Home Page — Create & Sell Your First Digital Product With AI
//  Rich, modern, high-converting digital product masterclass landing page
// =========================================================

import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useCourseContext } from '../../hooks/useCourses';
import { MOCK_COURSES } from '../../utils/mockData';
import styles from './Home.module.css';

export default function Home() {
  const navigate = useNavigate();
  const { currentUser, isAuthenticated } = useAuth();
  const { isEnrolled } = useCourseContext();
  const course = MOCK_COURSES[0];

  const userHasAccess = isAuthenticated && isEnrolled('1');

  // Sticky bottom bar visibility upon scrolling past hero
  const [showStickyBar, setShowStickyBar] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowStickyBar(window.scrollY > 450);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Accordion state for Modules
  const [openModule, setOpenModule] = useState(0);

  // Accordion state for FAQs
  const [openFaq, setOpenFaq] = useState(null);

  // Lightbox modal state for Real Results screenshots
  const [selectedResult, setSelectedResult] = useState(null);

  const handleInstantAccess = () => {
    if (userHasAccess) {
      navigate('/course/1/learn');
    } else {
      navigate('/checkout/1');
    }
  };

  const toggleModule = (idx) => {
    setOpenModule((prev) => (prev === idx ? null : idx));
  };

  const toggleFaq = (idx) => {
    setOpenFaq((prev) => (prev === idx ? null : idx));
  };

  const audienceList = [
    { icon: '🎓', title: 'Students', desc: 'who want to start an online business' },
    { icon: '💼', title: 'Freelancers', desc: 'who want to monetize their skills' },
    { icon: '👔', title: 'Professionals', desc: 'who want to monetize their knowledge' },
    { icon: '🎨', title: 'Creators', desc: 'who want to create their own digital products' },
    { icon: '🏢', title: 'Business Owners', desc: 'looking for additional digital revenue opportunities' },
    { icon: '🌱', title: 'Beginners', desc: 'who have an idea but don\'t know where to start' },
    { icon: '🤖', title: 'AI Enthusiasts', desc: 'interested in using AI to create and sell digital products' },
  ];

  const productTypes = [
    { icon: '📘', label: 'Ebooks' },
    { icon: '🧭', label: 'Guides' },
    { icon: '📋', label: 'Templates' },
    { icon: '✅', label: 'Checklists' },
    { icon: '📓', label: 'Workbooks' },
    { icon: '🧰', label: 'Toolkits' },
    { icon: '💬', label: 'Prompt Packs' },
    { icon: '🎥', label: 'Online Courses' },
    { icon: '🗓️', label: 'Digital Planners' },
    { icon: '📦', label: 'Downloadable Resources' },
  ];

  const journeySteps = [
    {
      num: '01',
      title: 'FIND YOUR NICHE',
      desc: 'Discover a niche that fits your skills, interests, experience, and goals.',
      icon: '🎯',
    },
    {
      num: '02',
      title: 'FIND A PROBLEM',
      desc: 'Identify a real problem that people need help solving.',
      icon: '🔍',
    },
    {
      num: '03',
      title: 'CREATE YOUR PRODUCT',
      desc: 'Use AI to turn your solution into a simple digital product.',
      icon: '✨',
    },
    {
      num: '04',
      title: 'HOST IT',
      desc: 'Put your product online and make it ready for customers.',
      icon: '🌐',
    },
    {
      num: '05',
      title: 'CREATE CONTENT',
      desc: 'Create videos, posters, and promotional content to attract your audience.',
      icon: '🎬',
    },
    {
      num: '06',
      title: 'RUN ADS',
      desc: 'Use Meta Ads to reach the right people and promote your product.',
      icon: '📈',
    },
    {
      num: '07',
      title: 'START SELLING',
      desc: 'Turn your knowledge and ideas into a digital product that can be sold online.',
      icon: '💰',
    },
  ];

  return (
    <div className={styles.page}>
      {/* ─────────────────────────────────────────────────────────
          1. HERO SECTION
         ───────────────────────────────────────────────────────── */}
      <section className={styles.hero} id="hero">
        <div className={styles.heroGlow} />
        <div className={['container', styles.heroContainer].join(' ')}>
          {/* Enrolled Student Welcome Back Banner */}
          {userHasAccess && (
            <div className={styles.welcomeBackBanner} id="welcome-back-banner">
              <div className={styles.welcomeBackLeft}>
                <span className={styles.welcomeBadge}>
                  <span className={styles.welcomeBadgeDot} />
                  ENROLLED STUDENT
                </span>
                <p className={styles.welcomeText}>
                  Welcome back, <strong>{currentUser?.name || currentUser?.email || 'Student'}</strong>! You have full lifetime access to this masterclass.
                </p>
              </div>
              <div className={styles.welcomeBackRight}>
                <button
                  onClick={() => navigate('/course/1/learn')}
                  className={styles.resumeHeroBtn}
                  id="welcome-resume-btn"
                >
                  <span>▶ Resume Masterclass</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* Badge */}
          <div className={styles.pillBadge}>
            <span className={styles.pillDot} />
            <span>Practical • Beginner-Friendly • AI-Powered</span>
          </div>

          {/* Main Titles */}
          <h1 className={styles.heroTitle}>
            Create & Sell Your First Digital Product With AI
          </h1>

          {/* Banner Showcase Image */}
          <div
            className={styles.heroBannerWrap}
            onClick={handleInstantAccess}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') handleInstantAccess();
            }}
            title={userHasAccess ? 'Click to resume masterclass' : 'Click to get instant access'}
          >
            <img
              src="/workshop-banner.jpg"
              alt="Create & Sell Your First Digital Product With AI — 3-Hour Practical Masterclass"
              className={styles.heroBannerImg}
              loading="eager"
            />
          </div>

          <p className={styles.heroSubtitle}>
            A 3-Hour Practical Session to Take You From Idea to Your First Digital Product
          </p>

          <p className={styles.heroDesc}>
            Learn how to find the right niche, identify a real problem, create a digital product with AI, host it online, create promotional content, and launch Meta Ads.
          </p>

          {/* Price & Primary CTA */}
          <div className={styles.heroActionCard}>
            <div className={styles.heroPriceWrap}>
              <span className={styles.heroPrice}>₹499</span>
              <span className={styles.heroPriceLabel}>— One-Time Payment</span>
            </div>

            {userHasAccess ? (
              <button
                className={styles.heroResumeBtn}
                onClick={() => navigate('/course/1/learn')}
                id="hero-resume-access-btn"
              >
                <span>▶ OPEN MASTERCLASS PLAYER</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            ) : (
              <button
                className={styles.heroCtaBtn}
                onClick={handleInstantAccess}
                id="hero-get-access-btn"
              >
                <span>GET INSTANT ACCESS</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            )}
          </div>

          {!userHasAccess && (
            <div className={styles.heroStudentAccessRow}>
              <Link to="/my-learning" className={styles.heroStudentAccessBadge} id="hero-student-login-link">
                <span className={styles.heroStudentAccessDot}>⚡</span>
                <span>Already purchased? </span>
                <span className={styles.heroStudentAccessHighlight}>Access your masterclass here →</span>
              </Link>
            </div>
          )}

          {/* Trust Guarantees */}
          <div className={styles.heroTrustGrid}>
            <div className={styles.trustItem}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>3-Hour Focused Practical Session</span>
            </div>
            <div className={styles.trustItem}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>Ready-to-Use AI Prompts & SOPs</span>
            </div>
            <div className={styles.trustItem}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>Full Lifetime Access</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────
          2. TURN YOUR SKILLS & IDEAS INTO A DIGITAL PRODUCT
         ───────────────────────────────────────────────────────── */}
      <section className={styles.section} id="skills-to-product">
        <div className="container">
          <div className={styles.sectionHeader}>
            <div className={styles.sectionBadge}>The Opportunity</div>
            <h2 className={styles.sectionTitle}>
              Turn Your Skills & Ideas Into a Digital Product
            </h2>
            <p className={styles.sectionLead}>
              You don't need a physical product, inventory, or a complicated business setup.
            </p>
          </div>

          <div className={styles.skillsCard}>
            <div className={styles.skillsContent}>
              <p className={styles.skillsTextMain}>
                You can take your skills, knowledge, experience, or ideas, turn them into a useful digital product, and sell it online.
              </p>
              <p className={styles.skillsTextSub}>
                In this 3-hour session, I'll show you the complete process step by step.
              </p>
            </div>

            <div className={styles.skillsGrid}>
              <div className={styles.skillBenefit}>
                <div className={styles.benefitIcon}>📦</div>
                <h4>Zero Physical Inventory</h4>
                <p>No storage, packaging, shipping, or logistics headaches ever.</p>
              </div>
              <div className={styles.skillBenefit}>
                <div className={styles.benefitIcon}>⚡</div>
                <h4>High Profit Margins</h4>
                <p>Build your asset once with AI and sell it thousands of times seamlessly.</p>
              </div>
              <div className={styles.skillBenefit}>
                <div className={styles.benefitIcon}>🤖</div>
                <h4>AI-Powered Velocity</h4>
                <p>Cut weeks of writing and designing down to practical hours.</p>
              </div>
              <div className={styles.skillBenefit}>
                <div className={styles.benefitIcon}>🌍</div>
                <h4>Sell Around the Clock</h4>
                <p>Automated payment hosting and instant delivery while you sleep.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────
          3. WHAT YOU'LL LEARN (MODULES)
         ───────────────────────────────────────────────────────── */}
      <section className={[styles.section, styles.darkerSection].join(' ')} id="curriculum">
        <div className="container">
          <div className={styles.sectionHeader}>
            <div className={styles.sectionBadge}>Complete Curriculum</div>
            <h2 className={styles.sectionTitle}>What You'll Learn</h2>
            <p className={styles.sectionSub}>
              7 in-depth modules designed to take you from a blank page to a live, selling digital asset.
            </p>
          </div>

          <div className={styles.moduleList}>
            {course.modules.map((mod, idx) => (
              <div
                key={mod.id}
                className={[styles.moduleCard, openModule === idx ? styles.moduleCardOpen : ''].join(' ')}
              >
                <button
                  className={styles.moduleHeader}
                  onClick={() => toggleModule(idx)}
                  aria-expanded={openModule === idx}
                >
                  <div className={styles.moduleHeaderLeft}>
                    <div className={styles.moduleIndexBadge}>0{idx + 1}</div>
                    <h3 className={styles.moduleTitleText}>{mod.title}</h3>
                  </div>
                  <div className={styles.moduleHeaderRight}>
                    <span className={styles.moduleLessonsCount}>{mod.lessons.length} Lessons</span>
                    <div className={styles.accordionIcon}>
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        style={{
                          transform: openModule === idx ? 'rotate(180deg)' : 'rotate(0deg)',
                          transition: 'transform 0.2s ease',
                        }}
                      >
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </div>
                  </div>
                </button>

                {openModule === idx && (
                  <div className={styles.moduleBody}>
                    <div className={styles.lessonsContainer}>
                      {mod.lessons.map((lesson) => (
                        <div key={lesson.id} className={styles.lessonRow}>
                          <div className={styles.lessonLeft}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2">
                              <polygon points="5 3 19 12 5 21 5 3" />
                            </svg>
                            <span className={styles.lessonTitle}>{lesson.title}</span>
                          </div>
                          <span className={styles.lessonDuration}>{lesson.duration}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Quick CTA */}
          <div className={styles.curriculumCta}>
            <button onClick={handleInstantAccess} className={styles.secondaryCtaBtn}>
              <span>Unlock All 7 Modules Now — ₹499</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────
          4. YOUR DIGITAL PRODUCT JOURNEY (7-STEP ROADMAP)
         ───────────────────────────────────────────────────────── */}
      <section className={styles.section} id="journey">
        <div className="container">
          <div className={styles.sectionHeader}>
            <div className={styles.sectionBadge}>Step-by-Step Roadmap</div>
            <h2 className={styles.sectionTitle}>Your Digital Product Journey</h2>
            <p className={styles.sectionSub}>
              A proven 7-step blueprint to take any idea and turn it into consistent online sales.
            </p>
          </div>

          <div className={styles.journeyFlow}>
            {journeySteps.map((step, idx) => (
              <div key={step.num} className={styles.journeyStepWrap}>
                <div className={styles.journeyCard}>
                  <div className={styles.journeyStepNumber}>{step.num}</div>
                  <div className={styles.journeyIconWrap}>{step.icon}</div>
                  <h3 className={styles.journeyTitle}>{step.title}</h3>
                  <p className={styles.journeyDesc}>{step.desc}</p>
                </div>
                {idx < journeySteps.length - 1 && (
                  <div className={styles.flowArrow}>
                    <div className={styles.arrowLine} />
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2.5">
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <polyline points="19 12 12 19 5 12" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────
          5. WHO IS THIS SESSION FOR?
         ───────────────────────────────────────────────────────── */}
      <section className={[styles.section, styles.darkerSection].join(' ')} id="who-is-this-for">
        <div className="container">
          <div className={styles.sectionHeader}>
            <div className={styles.sectionBadge}>Target Audience</div>
            <h2 className={styles.sectionTitle}>Who Is This Session For?</h2>
            <p className={styles.sectionSub}>This session is engineered specifically for:</p>
          </div>

          <div className={styles.audienceGrid}>
            {audienceList.map((item, idx) => (
              <div key={idx} className={styles.audienceCard}>
                <div className={styles.audienceIcon}>{item.icon}</div>
                <div className={styles.audienceContent}>
                  <h3 className={styles.audienceTitle}>{item.title}</h3>
                  <p className={styles.audienceDesc}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────
          6. WHAT CAN YOU CREATE?
         ───────────────────────────────────────────────────────── */}
      <section className={styles.section} id="what-can-you-create">
        <div className="container">
          <div className={styles.sectionHeader}>
            <div className={styles.sectionBadge}>Product Formats</div>
            <h2 className={styles.sectionTitle}>What Can You Create?</h2>
            <p className={styles.sectionSub}>You can create high-demand digital products such as:</p>
          </div>

          <div className={styles.productGrid}>
            {productTypes.map((pt, idx) => (
              <div key={idx} className={styles.productCard}>
                <span className={styles.productIcon}>{pt.icon}</span>
                <span className={styles.productLabel}>{pt.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────
          7. THE SIMPLE FORMULA & AI ACCELERATION
         ───────────────────────────────────────────────────────── */}
      <section className={[styles.section, styles.darkerSection].join(' ')} id="formula">
        <div className="container">
          {/* Simple Formula */}
          <div className={styles.formulaBox}>
            <div className={styles.sectionBadge}>The Execution Framework</div>
            <h2 className={styles.formulaTitle}>The Simple Formula</h2>
            <div className={styles.pipeline}>
              <div className={styles.pipeStep}>Find a Problem</div>
              <div className={styles.pipeArrow}>→</div>
              <div className={styles.pipeStep}>Create a Solution</div>
              <div className={styles.pipeArrow}>→</div>
              <div className={styles.pipeStep}>Package It</div>
              <div className={styles.pipeArrow}>→</div>
              <div className={styles.pipeStep}>Promote It</div>
              <div className={styles.pipeArrow}>→</div>
              <div className={[styles.pipeStep, styles.pipeHighlight].join(' ')}>Sell It</div>
            </div>
          </div>

          {/* AI Acceleration */}
          <div className={styles.aiSpeedBox}>
            <div className={styles.aiBadge}>AI Acceleration</div>
            <h2 className={styles.aiTitle}>Create Your First Product Using AI</h2>
            <p className={styles.aiLead}>AI can help you speed up the process of:</p>

            <div className={styles.aiSteps}>
              <div className={styles.aiStepItem}>Research</div>
              <div className={styles.aiArrow}>→</div>
              <div className={styles.aiStepItem}>Planning</div>
              <div className={styles.aiArrow}>→</div>
              <div className={styles.aiStepItem}>Structuring</div>
              <div className={styles.aiArrow}>→</div>
              <div className={styles.aiStepItem}>Content Creation</div>
              <div className={styles.aiArrow}>→</div>
              <div className={styles.aiStepItem}>Marketing</div>
            </div>

            <p className={styles.aiNote}>
              You'll get practical prompts that you can use with AI to help you discover your niche, build your product, and create your marketing content.
            </p>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────
          8. START WITH AN MVP
         ───────────────────────────────────────────────────────── */}
      <section className={styles.section} id="mvp">
        <div className="container">
          <div className={styles.mvpCard}>
            <div className={styles.sectionBadge}>Zero Friction Strategy</div>
            <h2 className={styles.sectionTitle}>Start With an MVP</h2>
            <p className={styles.mvpLead}>
              Your first digital product doesn't need to be huge.
            </p>
            <p className={styles.mvpSubtext}>
              You don't need to spend months creating it.
            </p>

            <div className={styles.mvpGrid}>
              <div className={styles.mvpPillar}>
                <div className={styles.pillarIcon}>🎯</div>
                <h3>One Audience</h3>
              </div>
              <div className={styles.mvpPillar}>
                <div className={styles.pillarIcon}>🧩</div>
                <h3>One Problem</h3>
              </div>
              <div className={styles.mvpPillar}>
                <div className={styles.pillarIcon}>💡</div>
                <h3>One Solution</h3>
              </div>
              <div className={styles.mvpPillar}>
                <div className={styles.pillarIcon}>📦</div>
                <h3>One Simple Product</h3>
              </div>
            </div>

            <p className={styles.mvpActionCall}>
              Create your first version, put it in front of your audience, learn from the response, and improve it.
            </p>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────
          9. WHAT YOU GET
         ───────────────────────────────────────────────────────── */}
      <section className={[styles.section, styles.darkerSection].join(' ')} id="what-you-get">
        <div className="container">
          <div className={styles.sectionHeader}>
            <div className={styles.sectionBadge}>Deliverables</div>
            <h2 className={styles.sectionTitle}>What You Get</h2>
            <p className={styles.sectionSub}>Everything you need to launch with confidence in 3 hours.</p>
          </div>

          <div className={styles.deliverablesGrid}>
            <div className={styles.deliverableCard}>
              <div className={styles.deliverableHeader}>
                <span className={styles.deliverableIcon}>🎓</span>
                <h3 className={styles.deliverableTitle}>3-Hour Practical Session</h3>
              </div>
              <p className={styles.deliverableDesc}>
                A focused session covering the complete digital product journey from niche discovery to selling.
              </p>
            </div>

            <div className={styles.deliverableCard}>
              <div className={styles.deliverableHeader}>
                <span className={styles.deliverableIcon}>🤖</span>
                <h3 className={styles.deliverableTitle}>Ready-to-Use AI Prompts</h3>
              </div>
              <p className={styles.deliverableDesc}>
                Practical prompts for niche discovery, product creation, and marketing.
              </p>
            </div>

            <div className={styles.deliverableCard}>
              <div className={styles.deliverableHeader}>
                <span className={styles.deliverableIcon}>📈</span>
                <h3 className={styles.deliverableTitle}>Marketing & Ads</h3>
              </div>
              <p className={styles.deliverableDesc}>
                Learn how to create promotional content and launch Meta Ads for your digital product.
              </p>
            </div>

            <div className={styles.deliverableCard}>
              <div className={styles.deliverableHeader}>
                <span className={styles.deliverableIcon}>🚀</span>
                <h3 className={styles.deliverableTitle}>Step-by-Step Process</h3>
              </div>
              <p className={styles.deliverableDesc}>
                Follow a simple process designed to help you move from idea to product to promotion.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────
          10. REAL RESULTS (VERIFIED DASHBOARD OUTCOMES)
         ───────────────────────────────────────────────────────── */}
      <section className={styles.section} id="results">
        <div className="container">
          <div className={styles.sectionHeader}>
            <div className={styles.sectionBadge}>Real Proof</div>
            <h2 className={styles.sectionTitle}>Real Results</h2>
            <p className={styles.sectionSub}>
              Real outcomes from people who put the system into action.
            </p>
          </div>

          <div className={styles.resultsGrid}>
            {/* Result 1: Aug-Sep 2026 Meta Ads */}
            <div
              className={styles.resultCard}
              onClick={() =>
                setSelectedResult({
                  src: '/results/result-1.png',
                  title: 'Meta Ads Manager — 10 Aug 2026 – 8 Sep 2026',
                  stats: '106 Website Purchases • ₹85,490.30 Conversion Value',
                })
              }
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  setSelectedResult({
                    src: '/results/result-1.png',
                    title: 'Meta Ads Manager — 10 Aug 2026 – 8 Sep 2026',
                    stats: '106 Website Purchases • ₹85,490.30 Conversion Value',
                  });
                }
              }}
              title="Click to view full resolution screenshot"
            >
              <div className={styles.resultCardHeader}>
                <div className={styles.resultHeaderTop}>
                  <span className={styles.resultTag}>Meta Ads Manager</span>
                  <span className={styles.resultDate}>10 Aug 2026 – 8 Sep 2026</span>
                </div>
                <div className={styles.resultHeaderBottom}>
                  <span className={styles.resultMetricLabel}>Purchases Value:</span>
                  <span className={styles.resultMetricValue}>₹85,490.30</span>
                </div>
              </div>
              <div className={styles.resultImgContainer}>
                <img
                  src="/results/result-1.png"
                  alt="Meta Ads Manager dashboard showing 106 website purchases and ₹85,490.30 conversion value"
                  className={styles.resultScreenshot}
                  loading="lazy"
                />
                <div className={styles.zoomHint}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    <line x1="11" y1="8" x2="11" y2="14" />
                    <line x1="8" y1="11" x2="14" y2="11" />
                  </svg>
                  <span>Click to view</span>
                </div>
              </div>
            </div>

            {/* Result 2: Jun 2026 Meta Ads */}
            <div
              className={styles.resultCard}
              onClick={() =>
                setSelectedResult({
                  src: '/results/result-2.png',
                  title: 'Meta Ads Manager — 1 Jun 2026 – 30 Jun 2026',
                  stats: '166 Website Purchases • ₹142,522.67 Conversion Value',
                })
              }
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  setSelectedResult({
                    src: '/results/result-2.png',
                    title: 'Meta Ads Manager — 1 Jun 2026 – 30 Jun 2026',
                    stats: '166 Website Purchases • ₹142,522.67 Conversion Value',
                  });
                }
              }}
              title="Click to view full resolution screenshot"
            >
              <div className={styles.resultCardHeader}>
                <div className={styles.resultHeaderTop}>
                  <span className={styles.resultTag}>Meta Ads Manager</span>
                  <span className={styles.resultDate}>1 Jun 2026 – 30 Jun 2026</span>
                </div>
                <div className={styles.resultHeaderBottom}>
                  <span className={styles.resultMetricLabel}>Purchases Value:</span>
                  <span className={styles.resultMetricValue}>₹1,42,522.67</span>
                </div>
              </div>
              <div className={styles.resultImgContainer}>
                <img
                  src="/results/result-2.png"
                  alt="Meta Ads Manager dashboard showing 166 website purchases and ₹142,522.67 conversion value"
                  className={styles.resultScreenshot}
                  loading="lazy"
                />
                <div className={styles.zoomHint}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    <line x1="11" y1="8" x2="11" y2="14" />
                    <line x1="8" y1="11" x2="14" y2="11" />
                  </svg>
                  <span>Click to view</span>
                </div>
              </div>
            </div>

            {/* Result 3: Jul 2026 Meta Ads */}
            <div
              className={styles.resultCard}
              onClick={() =>
                setSelectedResult({
                  src: '/results/result-3.png',
                  title: 'Meta Ads Manager — 1 Jul 2026 – 31 Jul 2026',
                  stats: '199 Website Purchases • ₹165,424.00 Conversion Value',
                })
              }
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  setSelectedResult({
                    src: '/results/result-3.png',
                    title: 'Meta Ads Manager — 1 Jul 2026 – 31 Jul 2026',
                    stats: '199 Website Purchases • ₹165,424.00 Conversion Value',
                  });
                }
              }}
              title="Click to view full resolution screenshot"
            >
              <div className={styles.resultCardHeader}>
                <div className={styles.resultHeaderTop}>
                  <span className={styles.resultTag}>Meta Ads Manager</span>
                  <span className={styles.resultDate}>1 Jul 2026 – 31 Jul 2026</span>
                </div>
                <div className={styles.resultHeaderBottom}>
                  <span className={styles.resultMetricLabel}>Purchases Value:</span>
                  <span className={styles.resultMetricValue}>₹1,65,424.00</span>
                </div>
              </div>
              <div className={styles.resultImgContainer}>
                <img
                  src="/results/result-3.png"
                  alt="Meta Ads Manager dashboard showing 199 website purchases and ₹165,424.00 conversion value"
                  className={styles.resultScreenshot}
                  loading="lazy"
                />
                <div className={styles.zoomHint}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    <line x1="11" y1="8" x2="11" y2="14" />
                    <line x1="8" y1="11" x2="14" y2="11" />
                  </svg>
                  <span>Click to view</span>
                </div>
              </div>
            </div>

            {/* Result 4: Sales Dashboard Lifetime */}
            <div
              className={styles.resultCard}
              onClick={() =>
                setSelectedResult({
                  src: '/results/result-4.png',
                  title: 'Sales Dashboard — Lifetime Total Earnings',
                  stats: 'Total Earnings: ₹1,65,399 across All Products',
                })
              }
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  setSelectedResult({
                    src: '/results/result-4.png',
                    title: 'Sales Dashboard — Lifetime Total Earnings',
                    stats: 'Total Earnings: ₹1,65,399 across All Products',
                  });
                }
              }}
              title="Click to view full resolution screenshot"
            >
              <div className={styles.resultCardHeader}>
                <div className={styles.resultHeaderTop}>
                  <span className={styles.resultTag}>Sales Dashboard</span>
                  <span className={styles.resultDate}>All Products • Lifetime</span>
                </div>
                <div className={styles.resultHeaderBottom}>
                  <span className={styles.resultMetricLabel}>Total Earnings:</span>
                  <span className={styles.resultMetricValue}>₹1,65,399</span>
                </div>
              </div>
              <div className={styles.resultImgContainer}>
                <img
                  src="/results/result-4.png"
                  alt="Sales Dashboard graph showing ₹1,65,399 Total Earnings"
                  className={styles.resultScreenshot}
                  loading="lazy"
                />
                <div className={styles.zoomHint}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    <line x1="11" y1="8" x2="11" y2="14" />
                    <line x1="8" y1="11" x2="14" y2="11" />
                  </svg>
                  <span>Click to view</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────
          11. YOUR INVESTMENT (PRICING)
         ───────────────────────────────────────────────────────── */}
      <section className={styles.section} id="pricing">
        <div className="container">
          <div className={styles.sectionHeader}>
            <div className={styles.sectionBadge}>Special Access Pricing</div>
            <h2 className={styles.sectionTitle}>Your Investment</h2>
            <p className={styles.sectionSub}>Instant access with full lifetime access & updates.</p>
          </div>

          <div className={styles.pricingContainer}>
            <div className={styles.pricingCard}>
              <div className={styles.pricingTopBadge}>HIGH-VALUE MASTERCLASS</div>

              <h3 className={styles.pricingCourseTitle}>
                Create & Sell Your First Digital Product With AI
              </h3>
              <p className={styles.pricingSessionBadge}>3-Hour Practical Session</p>

              <div className={styles.pricingAmountWrap}>
                <span className={styles.pricingCurrency}>₹</span>
                <span className={styles.pricingAmount}>499</span>
                <span className={styles.pricingOriginal}>₹2,499</span>
              </div>
              <span className={styles.pricingOneTime}>One-time payment • Lifetime Access</span>

              <div className={styles.pricingJourneyList}>
                <p className={styles.journeyListLabel}>Learn the complete process from:</p>
                <div className={styles.journeyPills}>
                  <span>Niche</span>
                  <span className={styles.pillSep}>→</span>
                  <span>Problem</span>
                  <span className={styles.pillSep}>→</span>
                  <span>Product</span>
                  <span className={styles.pillSep}>→</span>
                  <span>Hosting</span>
                  <span className={styles.pillSep}>→</span>
                  <span>Content</span>
                  <span className={styles.pillSep}>→</span>
                  <span>Meta Ads</span>
                  <span className={styles.pillSep}>→</span>
                  <span className={styles.pillEnd}>Sales</span>
                </div>
              </div>

              {userHasAccess ? (
                <button
                  className={styles.heroResumeBtn}
                  style={{ width: '100%', justifyContent: 'center' }}
                  onClick={() => navigate('/course/1/learn')}
                  id="pricing-resume-btn"
                >
                  <span>▶ RESUME MASTERCLASS (ACTIVE ACCESS)</span>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </button>
              ) : (
                <button
                  className={styles.pricingCtaBtn}
                  onClick={handleInstantAccess}
                  id="pricing-buy-btn"
                >
                  <span>GET INSTANT ACCESS — ₹499</span>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </button>
              )}

              {!userHasAccess && (
                <div style={{ textAlign: 'center', marginTop: '12px', marginBottom: '4px' }}>
                  <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>Already enrolled? </span>
                  <Link
                    to="/my-learning"
                    style={{ fontSize: '0.8125rem', color: 'var(--primary-light)', fontWeight: 700, textDecoration: 'underline' }}
                  >
                    Access your masterclass here →
                  </Link>
                </div>
              )}

              <div className={styles.pricingFeatures}>
                <div className={styles.pricingFeature}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                  <span>Instant access to complete 3-hour video masterclass</span>
                </div>
                <div className={styles.pricingFeature}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                  <span>All copy-paste AI prompts for niche, copy & video</span>
                </div>
                <div className={styles.pricingFeature}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                  <span>Step-by-step Meta Ads setup blueprints</span>
                </div>
                <div className={styles.pricingFeature}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                  <span>Watch anytime, anywhere on Mobile & Desktop</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────
          11. FREQUENTLY ASKED QUESTIONS
         ───────────────────────────────────────────────────────── */}
      <section className={[styles.section, styles.darkerSection].join(' ')} id="faqs">
        <div className="container">
          <div className={styles.sectionHeader}>
            <div className={styles.sectionBadge}>Got Questions?</div>
            <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
            <p className={styles.sectionSub}>Everything you need to know about the session.</p>
          </div>

          <div className={styles.faqList}>
            {course.faqs.map((faq, idx) => (
              <div
                key={idx}
                className={[styles.faqCard, openFaq === idx ? styles.faqCardOpen : ''].join(' ')}
              >
                <button
                  className={styles.faqQuestion}
                  onClick={() => toggleFaq(idx)}
                  aria-expanded={openFaq === idx}
                >
                  <span className={styles.faqQuestionText}>{faq.q}</span>
                  <div className={styles.faqIcon}>
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      style={{
                        transform: openFaq === idx ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s ease',
                      }}
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </div>
                </button>

                {openFaq === idx && (
                  <div className={styles.faqAnswer}>
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────
          12. FINAL CALL TO ACTION (CLOSING)
         ───────────────────────────────────────────────────────── */}
      <section className={styles.closingSection} id="closing">
        <div className={styles.closingGlow} />
        <div className={['container', styles.closingContainer].join(' ')}>
          <h2 className={styles.closingTitle}>
            You Have the Knowledge. Now Turn It Into a Product.
          </h2>

          <div className={styles.closingPoints}>
            <p>You don't need to wait for the perfect idea.</p>
            <p className={styles.closingStep}>Find a problem.</p>
            <p className={styles.closingStep}>Create a solution.</p>
            <p className={styles.closingStep}>Use AI to build it faster.</p>
            <p className={styles.closingStep}>Put it in front of the right audience.</p>
            <p className={styles.closingStepBold}>And start selling.</p>
          </div>

          <div className={styles.closingCard}>
            <h3 className={styles.closingCardHeadline}>
              Start Your Digital Product Journey Today.
            </h3>
            <p className={styles.closingCardSession}>3-Hour Practical Session — ₹499</p>

            {userHasAccess ? (
              <button
                className={styles.heroResumeBtn}
                onClick={() => navigate('/course/1/learn')}
                id="closing-resume-btn"
              >
                <span>▶ RESUME MASTERCLASS PLAYER</span>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            ) : (
              <button
                className={styles.closingCtaBtn}
                onClick={handleInstantAccess}
                id="closing-get-access-btn"
              >
                <span>GET INSTANT ACCESS NOW</span>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────
          13. PERSISTENT FLOATING BOTTOM BAR (Shown upon scroll)
         ───────────────────────────────────────────────────────── */}
      {showStickyBar && (
        <aside className={styles.floatingBar} aria-label="Quick Access Bar" id="floating-quick-bar">
          <div className={['container', styles.floatingInner].join(' ')}>
            <div className={styles.floatingInfo}>
              <div className={styles.floatingDot} />
              <div className={styles.floatingTextWrap}>
                <span className={styles.floatingTitle}>
                  Create & Sell Your First Digital Product With AI
                </span>
                <span className={styles.floatingMeta}>
                  3-Hour Practical Session • <strong className={styles.floatingPrice}>₹499</strong>
                </span>
              </div>
            </div>

            {userHasAccess ? (
              <button
                className={styles.resumeHeroBtn}
                onClick={() => navigate('/course/1/learn')}
                id="floating-resume-btn"
              >
                <span>▶ Resume Masterclass</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            ) : (
              <button
                className={styles.floatingCtaBtn}
                onClick={handleInstantAccess}
                id="floating-get-access-btn"
              >
                <span>GET INSTANT ACCESS</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            )}
          </div>
        </aside>
      )}

      {/* Lightbox / High-Res Inspection Modal */}
      {selectedResult && (
        <div
          className={styles.lightboxOverlay}
          onClick={() => setSelectedResult(null)}
          role="dialog"
          aria-modal="true"
        >
          <div className={styles.lightboxModal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.lightboxHeader}>
              <div className={styles.lightboxTitleWrap}>
                <span className={styles.lightboxTitle}>{selectedResult.title}</span>
                {selectedResult.stats && (
                  <span className={styles.lightboxStats}>{selectedResult.stats}</span>
                )}
              </div>
              <button
                className={styles.lightboxCloseBtn}
                onClick={() => setSelectedResult(null)}
                aria-label="Close screenshot preview"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div className={styles.lightboxBody}>
              <img
                src={selectedResult.src}
                alt={selectedResult.title}
                className={styles.lightboxImg}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
