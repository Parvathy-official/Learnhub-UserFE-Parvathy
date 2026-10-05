// =========================================================
//  CourseDetails Page — Simple Paid Online Course Platform
// =========================================================

import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCourseContext } from '../../hooks/useCourses';
import courseService from '../../services/courseService';
import Button from '../../components/common/Button';
import ErrorState from '../../components/common/ErrorState';
import { CourseDetailSkeleton } from '../../components/common/LoadingSkeleton';
import { formatPrice, discountPercent } from '../../utils/helpers';
import styles from './CourseDetails.module.css';

export default function CourseDetails() {
  const { id } = useParams();
  const { isEnrolled } = useCourseContext();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openModules, setOpenModules] = useState([0, 1]);
  const [previewLesson, setPreviewLesson] = useState(null);
  const enrolled = course ? isEnrolled(course.id) : false;

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await courseService.getCourseById(id);
        setCourse(data);
      } catch (err) {
        setError(err.message || 'Course not found');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleCTA = () => {
    if (enrolled) {
      navigate(`/course/${id}/learn`);
      return;
    }
    navigate(`/checkout/${id}`);
  };

  const handleLessonClick = (lesson) => {
    if (enrolled) {
      navigate(`/course/${id}/learn/${lesson.id}`);
      return;
    }
    if (lesson.is_preview) {
      setPreviewLesson(lesson);
      return;
    }
    navigate(`/checkout/${id}`);
  };

  if (loading) return <div className={styles.page}><div className="container" style={{ paddingTop: 'calc(var(--navbar-height) + 40px)' }}><CourseDetailSkeleton /></div></div>;
  if (error) return <div className={styles.page}><ErrorState description={error} onRetry={() => window.location.reload()} /></div>;
  if (!course) return null;

  const discount = discountPercent(course.price, course.discounted_price);
  const finalPrice = course.discounted_price || course.price;

  const toggleModule = (i) =>
    setOpenModules((prev) => prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]);

  return (
    <div className={styles.page}>
      <div className="container">
        {/* Breadcrumb */}
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link to="/" className={styles.breadLink}>Courses</Link>
          <span className={styles.breadDivider}>/</span>
          <span className={styles.breadCurrent}>{course.title}</span>
        </nav>

        <div className={styles.layout}>
          {/* ── Left Main Column ── */}
          <div className={styles.left}>
            <h1 className={styles.title}>{course.title}</h1>
            <p className={styles.desc}>{course.description}</p>

            <div className={styles.instructorRow}>
              <img src={course.instructor_avatar} alt={course.instructor} className={styles.instructorAvatar} />
              <div>
                <p className={styles.instructorLabel}>Created by</p>
                <p className={styles.instructorName}>{course.instructor}</p>
              </div>
            </div>

            {/* Course Info Pills */}
            <div className={styles.infoPills}>
              <div className={styles.infoPill}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                <span>{course.total_lessons} Lessons</span>
              </div>
              <div className={styles.infoPill}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                <span>{course.duration} Total Duration</span>
              </div>
              <div className={styles.infoPill}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 20h.01M7 20v-4M12 20v-8M17 20V8M22 4v16" /></svg>
                <span>{course.level || 'All Levels'}</span>
              </div>
              <div className={styles.infoPill}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
                <span>{course.language || 'English'}</span>
              </div>
              {course.certificate && (
                <div className={styles.infoPill}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="7" /><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" /></svg>
                  <span>Certificate Included</span>
                </div>
              )}
            </div>

            {/* Thumbnail Preview Banner */}
            <div
              className={styles.thumbWrap}
              onClick={() => handleLessonClick(course.modules?.[0]?.lessons?.[0])}
              style={{ cursor: 'pointer' }}
              role="button"
              tabIndex={0}
              aria-label="Play free course preview"
            >
              <img src={course.thumbnail} alt={course.title} className={styles.thumb} />
              <div className={styles.thumbOverlay}>
                <div className={styles.playBtn}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="#030708">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                </div>
                <span className={styles.previewLabel}>Watch Free Preview Lesson</span>
              </div>
            </div>

            {/* What you'll learn */}
            {course.what_youll_learn && course.what_youll_learn.length > 0 && (
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>What you'll learn</h2>
                <div className={styles.learnGrid}>
                  {course.what_youll_learn.map((item, i) => (
                    <div key={i} className={styles.learnItem}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2.5" className={styles.checkIcon}>
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Course Curriculum */}
            <section className={styles.section}>
              <div className={styles.curriculumHeader}>
                <div>
                  <h2 className={styles.sectionTitle} style={{ margin: 0 }}>Course Curriculum</h2>
                  <p className={styles.sectionSub}>
                    {course.total_lessons} lessons • {course.duration} total length
                  </p>
                </div>
                <button
                  onClick={() => setOpenModules(openModules.length === course.modules?.length ? [] : course.modules?.map((_, i) => i) || [])}
                  className={styles.expandAllBtn}
                >
                  {openModules.length === course.modules?.length ? 'Collapse All' : 'Expand All'}
                </button>
              </div>

              <div className={styles.curriculum}>
                {course.modules?.map((mod, idx) => (
                  <div key={mod.id} className={styles.module}>
                    <button
                      className={styles.moduleBtn}
                      onClick={() => toggleModule(idx)}
                      aria-expanded={openModules.includes(idx)}
                    >
                      <div className={styles.moduleBtnLeft}>
                        <svg
                          width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                          style={{ transform: openModules.includes(idx) ? 'rotate(90deg)' : '', transition: 'transform 0.2s' }}
                          aria-hidden="true"
                        >
                          <polyline points="9 18 15 12 9 6" />
                        </svg>
                        <span className={styles.moduleTitle}>{mod.title}</span>
                      </div>
                      <span className={styles.moduleMeta}>{mod.lessons.length} lessons</span>
                    </button>

                    {openModules.includes(idx) && (
                      <div className={styles.lessonList}>
                        {mod.lessons.map((lesson) => {
                          const canAccess = enrolled || lesson.is_preview;
                          return (
                            <div
                              key={lesson.id}
                              className={styles.lesson}
                              onClick={() => handleLessonClick(lesson)}
                              style={{ cursor: 'pointer' }}
                            >
                              <div className={styles.lessonLeft}>
                                {canAccess ? (
                                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" aria-hidden="true">
                                    <polygon points="5 3 19 12 5 21 5 3" />
                                  </svg>
                                ) : (
                                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="2" aria-hidden="true">
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
                                  </svg>
                                )}
                                <span className={[styles.lessonTitle, !canAccess ? styles.lessonLocked : ''].join(' ')}>
                                  {lesson.title}
                                </span>
                                {lesson.is_preview ? (
                                  <span className={styles.previewTag}>Free Preview</span>
                                ) : !enrolled ? (
                                  <span className={styles.lockedTag}>Locked</span>
                                ) : null}
                              </div>
                              <span className={styles.lessonDuration}>{lesson.duration}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* ── Right Column: Sticky Purchase Box ── */}
          <div className={styles.right}>
            <div className={styles.stickyCard}>
              <div className={styles.priceHeader}>
                <div className={styles.priceRow}>
                  <span className={styles.currentPrice}>{formatPrice(finalPrice)}</span>
                  {course.discounted_price && course.discounted_price < course.price && (
                    <span className={styles.originalPrice}>{formatPrice(course.price)}</span>
                  )}
                  {discount > 0 && (
                    <span className={styles.discountBadge}>-{discount}%</span>
                  )}
                </div>
              </div>

              <div style={{ marginTop: 20 }}>
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={handleCTA}
                >
                  {enrolled ? 'Continue Learning →' : `Buy Course — ${formatPrice(finalPrice)}`}
                </Button>
              </div>

              <div className={styles.guaranteeText}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                <span>30-Day Money-Back Guarantee</span>
              </div>

              <div className={styles.includesList}>
                <p className={styles.includesHeading}>This course includes:</p>
                <div className={styles.includeItem}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                  <span>{course.duration} on-demand video</span>
                </div>
                <div className={styles.includeItem}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
                  <span>{course.total_lessons} structured lessons</span>
                </div>
                <div className={styles.includeItem}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                  <span>Full lifetime access</span>
                </div>
                <div className={styles.includeItem}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>
                  <span>Access on mobile and desktop</span>
                </div>
                {course.certificate && (
                  <div className={styles.includeItem}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="7" /><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" /></svg>
                    <span>Certificate of completion</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Sample Preview Modal ── */}
      {previewLesson && (
        <div className={styles.modalBackdrop} onClick={() => setPreviewLesson(null)}>
          <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div>
                <span className={styles.modalBadge}>Free Preview Lesson</span>
                <h3 className={styles.modalTitle}>{previewLesson.title}</h3>
              </div>
              <button onClick={() => setPreviewLesson(null)} className={styles.closeBtn} aria-label="Close modal">✕</button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.videoPlayerContainer}>
                <video
                  src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                  controls
                  autoPlay
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              </div>
              <div className={styles.modalFooter}>
                <span className={styles.modalFooterText}>Ready to unlock all {course.total_lessons} lessons and track your progress?</span>
                <Button variant="primary" size="md" onClick={handleCTA}>
                  {enrolled ? 'Go to Course →' : `Buy Course — ${formatPrice(finalPrice)}`}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
