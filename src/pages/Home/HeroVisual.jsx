import React, { useState, useRef, useCallback, useEffect } from 'react';
import styles from './HeroVisual.module.css';

/**
 * HeroVisual Component
 * A premium, subtle animated "AI digital product creation" workspace scene.
 * Features a dark luxury workspace with a central laptop studio display,
 * 5 floating glass-style workflow cards, glowing gold SVG connection flow,
 * drifting micro gold particles, pulsing ambient glow, and restrained cursor parallax.
 */
const HeroVisual = () => {
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);
  const isReducedMotion = useRef(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    isReducedMotion.current = mediaQuery.matches;
    const handler = (e) => {
      isReducedMotion.current = e.matches;
    };
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (isReducedMotion.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    // Normalized offset from center (-1 to 1)
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setMouseOffset({ x, y });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setMouseOffset({ x: 0, y: 0 });
  }, []);

  return (
    <div
      className={styles.visualContainer}
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      aria-label="AI Digital Product Creation Studio Scene"
    >
      {/* Background Studio Gradients & Glow */}
      <div className={styles.ambientBackdrop} />
      <div className={styles.ambientGlowPulse} />
      <div className={styles.deskSurface} />
      <div className={styles.deskReflection} />

      {/* Floating Micro Gold Particles */}
      <div className={styles.particlesLayer}>
        <span className={`${styles.particle} ${styles.p1}`} />
        <span className={`${styles.particle} ${styles.p2}`} />
        <span className={`${styles.particle} ${styles.p3}`} />
        <span className={`${styles.particle} ${styles.p4}`} />
        <span className={`${styles.particle} ${styles.p5}`} />
        <span className={`${styles.particle} ${styles.p6}`} />
      </div>

      {/* SVG Connecting Flow Lines & Traveling Pulse Dot */}
      <svg
        className={styles.connectingSvg}
        viewBox="0 0 1000 560"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="goldLineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.45" />
            <stop offset="35%" stopColor="#D97706" stopOpacity="0.25" />
            <stop offset="65%" stopColor="#FBBF24" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.45" />
          </linearGradient>

          <filter id="goldGlowFilter" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="lineSoftGlow" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="4" result="blur" />
          </filter>
        </defs>

        {/* Soft blur under-glow */}
        <path
          d="M 140 140 C 90 260, 100 340, 160 390 C 230 450, 340 330, 500 270 C 660 210, 770 140, 860 130 C 920 120, 930 240, 870 310 C 810 380, 890 410, 830 440"
          fill="none"
          stroke="#F59E0B"
          strokeWidth="3.5"
          opacity="0.12"
          filter="url(#lineSoftGlow)"
        />

        {/* Main dashed flow path */}
        <path
          id="flowTrackPath"
          d="M 140 140 C 90 260, 100 340, 160 390 C 230 450, 340 330, 500 270 C 660 210, 770 140, 860 130 C 920 120, 930 240, 870 310 C 810 380, 890 410, 830 440"
          fill="none"
          stroke="url(#goldLineGradient)"
          strokeWidth="1.5"
          strokeDasharray="4 6"
          strokeLinecap="round"
          opacity="0.5"
        />

        {/* Animated Traveling Glowing Dot */}
        <circle r="4" fill="#FEF3C7" filter="url(#goldGlowFilter)">
          <animateMotion
            dur="7.5s"
            repeatCount="indefinite"
            path="M 140 140 C 90 260, 100 340, 160 390 C 230 450, 340 330, 500 270 C 660 210, 770 140, 860 130 C 920 120, 930 240, 870 310 C 810 380, 890 410, 830 440"
          />
        </circle>

        {/* Traveling Trailing Pulse */}
        <circle r="2" fill="#F59E0B" opacity="0.6">
          <animateMotion
            dur="7.5s"
            begin="-0.22s"
            repeatCount="indefinite"
            path="M 140 140 C 90 260, 100 340, 160 390 C 230 450, 340 330, 500 270 C 660 210, 770 140, 860 130 C 920 120, 930 240, 870 310 C 810 380, 890 410, 830 440"
          />
        </circle>
      </svg>

      {/* Central Studio Workspace & Laptop */}
      <div className={styles.laptopAnchor}>
        <div
          className={styles.laptopParallaxLayer}
          style={{
            transform: `translate3d(${mouseOffset.x * 2}px, ${mouseOffset.y * 2}px, 0)`,
          }}
        >
          <div className={styles.laptopShadow} />
          <div className={styles.laptopBody}>
            {/* Screen Lid */}
            <div className={styles.laptopScreenLid}>
              <div className={styles.webcamDot} />
              <div className={styles.screenDisplay}>
                {/* Studio Top Window Bar */}
                <div className={styles.screenWindowBar}>
                  <div className={styles.windowDots}>
                    <span className={styles.windowDot} />
                    <span className={styles.windowDot} />
                    <span className={styles.windowDot} />
                  </div>
                  <div className={styles.windowTitle}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                    <span>AI Product Studio Pro</span>
                  </div>
                  <div className={styles.windowStatus}>
                    <span className={styles.statusLiveDot} />
                    <span>Ready</span>
                  </div>
                </div>

                {/* Workspace Display Area */}
                <div className={styles.screenWorkspace}>
                  {/* AI Prompt Input Bar */}
                  <div className={styles.screenPromptBar}>
                    <div className={styles.promptIconWrap}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2.5">
                        <path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8z" fill="rgba(245, 158, 11, 0.25)" />
                      </svg>
                    </div>
                    <div className={styles.promptInputText}>
                      <span>Prompt: </span>
                      <strong>Create 30-Day Practical Digital Product Blueprint...</strong>
                    </div>
                    <div className={styles.promptExecuteBadge}>
                      <span>AI Generate ✦</span>
                    </div>
                  </div>

                  {/* Asset Modules Grid */}
                  <div className={styles.screenGrid}>
                    <div className={styles.screenAssetCard}>
                      <div className={styles.assetHeader}>
                        <span className={styles.assetTag}>GUIDE</span>
                        <span className={styles.assetCheck}>✓</span>
                      </div>
                      <div className={styles.assetTitle}>Digital Playbook.pdf</div>
                      <div className={styles.assetProgress}>
                        <div className={styles.assetProgressBar} style={{ width: '100%' }} />
                      </div>
                    </div>

                    <div className={`${styles.screenAssetCard} ${styles.assetCardActive}`}>
                      <div className={styles.assetHeader}>
                        <span className={`${styles.assetTag} ${styles.assetTagActive}`}>VIDEO</span>
                        <span className={styles.assetPillGlow}>Ready</span>
                      </div>
                      <div className={styles.assetTitle}>3-Hr Masterclass</div>
                      <div className={styles.assetProgress}>
                        <div className={`${styles.assetProgressBar} ${styles.barActive}`} style={{ width: '88%' }} />
                      </div>
                    </div>

                    <div className={styles.screenAssetCard}>
                      <div className={styles.assetHeader}>
                        <span className={styles.assetTag}>ADS</span>
                        <span className={styles.assetCheck}>✓</span>
                      </div>
                      <div className={styles.assetTitle}>Meta Ad Creatives</div>
                      <div className={styles.assetProgress}>
                        <div className={styles.assetProgressBar} style={{ width: '100%' }} />
                      </div>
                    </div>
                  </div>

                  {/* Waveform & Analytics Strip */}
                  <div className={styles.screenMetricsStrip}>
                    <div className={styles.metricItem}>
                      <span className={styles.metricVal}>₹499</span>
                      <span className={styles.metricLbl}>Price Point</span>
                    </div>
                    <div className={styles.metricsWaveform}>
                      <span className={styles.waveBar} style={{ height: '35%' }} />
                      <span className={styles.waveBar} style={{ height: '65%' }} />
                      <span className={styles.waveBar} style={{ height: '90%' }} />
                      <span className={styles.waveBar} style={{ height: '50%' }} />
                      <span className={styles.waveBar} style={{ height: '80%' }} />
                      <span className={styles.waveBar} style={{ height: '100%' }} />
                      <span className={styles.waveBar} style={{ height: '45%' }} />
                      <span className={styles.waveBar} style={{ height: '70%' }} />
                    </div>
                    <div className={styles.metricItem}>
                      <span className={styles.metricVal}>100%</span>
                      <span className={styles.metricLbl}>Automated</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Laptop Base Keyboard Deck */}
            <div className={styles.laptopBase}>
              <div className={styles.keyboardRecess}>
                <div className={styles.keyboardKeyRows}>
                  <div className={styles.keyRow} />
                  <div className={styles.keyRow} />
                  <div className={styles.keyRow} />
                </div>
                <div className={styles.trackpad} />
              </div>
              <div className={styles.frontLipHighlight} />
            </div>
          </div>
        </div>
      </div>

      {/* 5 Floating Workflow Glass Cards */}

      {/* Card 1: Product Ideas */}
      <div className={`${styles.cardAnchor} ${styles.anchorProductIdeas}`}>
        <div
          className={`${styles.floatingCard} ${styles.cardProductIdeas}`}
          style={{
            transform: `translate3d(${mouseOffset.x * -4}px, ${mouseOffset.y * -3}px, 0)`,
          }}
        >
          <div className={styles.cardIconBox}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18h6M10 22h4M12 2v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
              <circle cx="12" cy="11" r="5" fill="rgba(245, 158, 11, 0.22)" />
            </svg>
          </div>
          <div className={styles.cardContent}>
            <div className={styles.cardTitleRow}>
              <span className={styles.cardTitle}>Product Ideas</span>
              <span className={styles.cardBadge}>Ideation</span>
            </div>
            <span className={styles.cardSubtitle}>Niche & Validation</span>
          </div>
        </div>
      </div>

      {/* Card 2: AI Content */}
      <div className={`${styles.cardAnchor} ${styles.anchorAiContent}`}>
        <div
          className={`${styles.floatingCard} ${styles.cardAiContent}`}
          style={{
            transform: `translate3d(${mouseOffset.x * -3}px, ${mouseOffset.y * 4}px, 0)`,
          }}
        >
          <div className={styles.cardIconBox}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3l1.912 5.885L20 10.8l-4.756 3.657L17.155 21 12 16.885 6.845 21l1.911-6.543L4 10.8l6.088-1.915L12 3z" fill="rgba(245, 158, 11, 0.22)" />
            </svg>
          </div>
          <div className={styles.cardContent}>
            <div className={styles.cardTitleRow}>
              <span className={styles.cardTitle}>AI Content</span>
              <span className={styles.cardBadge}>Prompting</span>
            </div>
            <span className={styles.cardSubtitle}>Smart Copy & Scripts</span>
          </div>
        </div>
      </div>

      {/* Card 3: Design & Templates */}
      <div className={`${styles.cardAnchor} ${styles.anchorDesign}`}>
        <div
          className={`${styles.floatingCard} ${styles.cardDesign}`}
          style={{
            transform: `translate3d(${mouseOffset.x * 4}px, ${mouseOffset.y * -4}px, 0)`,
          }}
        >
          <div className={styles.cardIconBox}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="3" fill="rgba(245, 158, 11, 0.18)" />
              <path d="M3 9h18M9 21V9" />
            </svg>
          </div>
          <div className={styles.cardContent}>
            <div className={styles.cardTitleRow}>
              <span className={styles.cardTitle}>Design & Templates</span>
              <span className={styles.cardBadge}>Assets</span>
            </div>
            <span className={styles.cardSubtitle}>Ready-to-Sell Kits</span>
          </div>
        </div>
      </div>

      {/* Card 4: Marketing Strategies */}
      <div className={`${styles.cardAnchor} ${styles.anchorMarketing}`}>
        <div
          className={`${styles.floatingCard} ${styles.cardMarketing}`}
          style={{
            transform: `translate3d(${mouseOffset.x * 3}px, ${mouseOffset.y * 2}px, 0)`,
          }}
        >
          <div className={styles.cardIconBox}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
              <polyline points="17 6 23 6 23 12" />
            </svg>
          </div>
          <div className={styles.cardContent}>
            <div className={styles.cardTitleRow}>
              <span className={styles.cardTitle}>Marketing Strategies</span>
              <span className={styles.cardBadge}>Meta Ads</span>
            </div>
            <span className={styles.cardSubtitle}>High-Converting Funnels</span>
          </div>
        </div>
      </div>

      {/* Card 5: Sell Online */}
      <div className={`${styles.cardAnchor} ${styles.anchorSellOnline}`}>
        <div
          className={`${styles.floatingCard} ${styles.cardSellOnline}`}
          style={{
            transform: `translate3d(${mouseOffset.x * 4}px, ${mouseOffset.y * 4}px, 0)`,
          }}
        >
          <div className={styles.cardIconBox}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" fill="rgba(245, 158, 11, 0.2)" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
          </div>
          <div className={styles.cardContent}>
            <div className={styles.cardTitleRow}>
              <span className={styles.cardTitle}>Sell Online</span>
              <span className={styles.cardBadge}>Launch</span>
            </div>
            <span className={styles.cardSubtitle}>Automated Payouts</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroVisual;
