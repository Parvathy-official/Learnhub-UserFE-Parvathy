// =========================================================
//  CoursePlayer Page — Simple Paid Online Course Platform
// =========================================================

import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useCourseContext } from '../../hooks/useCourses';
import courseService from '../../services/courseService';
import VideoPlayer from '../../components/video/VideoPlayer';
import CurriculumSidebar from '../../components/video/CurriculumSidebar';
import PasswordlessAuthCard from '../../components/auth/PasswordlessAuthCard';
import Button from '../../components/common/Button';
import toast from 'react-hot-toast';
import styles from './CoursePlayer.module.css';

export default function CoursePlayer() {
  const { courseId, lessonId } = useParams();
  const { isAuthenticated, currentUser } = useAuth();
  const { isEnrolled, enrollments, updateLessonProgress, fetchEnrollments } = useCourseContext();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [accessDenied, setAccessDenied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [videoLoading, setVideoLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const lastProgressSave = useRef(0);

  const enrollment = enrollments.find((e) => String(e.course_id) === String(courseId));
  const completedLessons = enrollment?.completed_lessons || [];
  const enrolled = isEnrolled(courseId);

  // Load course and check backend access
  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const data = await courseService.getCourseById(courseId);
        if (!isMounted) return;
        setCourse(data);

        const allLessons = data.modules?.flatMap((m) => m.lessons) || [];
        let initial;
        if (lessonId) {
          initial = allLessons.find((l) => String(l.id) === String(lessonId)) || allLessons[0];
        } else if (enrollment?.last_watched_lesson) {
          initial = allLessons.find((l) => String(l.id) === String(enrollment.last_watched_lesson)) || allLessons[0];
        } else {
          initial = allLessons[0];
        }

        if (initial) setCurrentLesson(initial);

        // Preview lessons can be watched by anyone
        if (initial?.is_preview) {
          setAccessDenied(false);
          setLoading(false);
          return;
        }

        if (!isAuthenticated) {
          setLoading(false);
          return;
        }

        // Check backend server-side authorization
        const accessCheck = await courseService.checkCourseAccess(courseId);
        if (!isMounted) return;

        if (!accessCheck?.has_access && !enrolled) {
          setAccessDenied(true);
          setLoading(false);
          return;
        }

        setAccessDenied(false);
      } catch {
        if (!isMounted) return;
        toast.error('Failed to load course details');
        navigate('/my-learning');
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    load();
    return () => { isMounted = false; };
  }, [courseId, enrolled, isAuthenticated, navigate]);

  // Sync currentLesson whenever URL lessonId changes or course data is refreshed
  useEffect(() => {
    if (!course) return;
    const allLessons = course.modules?.flatMap((m) => m.lessons) || [];
    if (lessonId) {
      const match = allLessons.find((l) => String(l.id) === String(lessonId));
      if (match) {
        setCurrentLesson(match);
      }
    } else if (currentLesson) {
      const match = allLessons.find((l) => String(l.id) === String(currentLesson.id));
      if (match) {
        setCurrentLesson(match);
      } else if (allLessons.length > 0) {
        setCurrentLesson(allLessons[0]);
      }
    } else if (allLessons.length > 0) {
      setCurrentLesson(allLessons[0]);
    }
  }, [course, lessonId]);

  // Fetch signed video URL when lesson changes
  useEffect(() => {
    if (!currentLesson || accessDenied) return;
    if (!currentLesson.is_preview && !isAuthenticated) return;

    let isMounted = true;
    const fetchVideo = async () => {
      setVideoLoading(true);
      setVideoUrl(null);
      try {
        const data = await courseService.getVideoUrl(courseId, currentLesson.id);
        if (isMounted) setVideoUrl(data.url);
      } catch (err) {
        if (isMounted) {
          const errMsg = err?.response?.data?.error || 'Failed to load lesson video';
          toast.error(errMsg);
          if (err?.response?.status === 403 || err?.response?.status === 401) {
            setAccessDenied(true);
          }
        }
      } finally {
        if (isMounted) setVideoLoading(false);
      }
    };
    fetchVideo();
    return () => { isMounted = false; };
  }, [currentLesson?.id, courseId, accessDenied, isAuthenticated]);

  const handleLessonSelect = useCallback((lesson) => {
    if (!enrolled && !lesson.is_preview) {
      if (!isAuthenticated) {
        toast('Please verify your purchase email to unlock this lesson.', { icon: '🔒' });
      } else {
        toast('Please purchase this course to unlock this lesson.', { icon: '🔒' });
      }
      return;
    }
    const freshLesson = course?.modules?.flatMap((m) => m.lessons)?.find((l) => String(l.id) === String(lesson.id)) || lesson;
    setCurrentLesson(freshLesson);
    navigate(`/course/${courseId}/learn/${lesson.id}`, { replace: true });
    setSidebarOpen(false);
  }, [course, courseId, enrolled, isAuthenticated, navigate]);

  const handleMarkComplete = () => {
    if (!currentLesson) return;
    updateLessonProgress(courseId, currentLesson.id, 0, 0, true);
    courseService.markLessonComplete(courseId, currentLesson.id).catch(() => {});
    toast.success(`Completed: ${currentLesson.title} ✓`);
  };

  const handleTimeUpdate = (currentTime, duration) => {
    if (!currentLesson || !duration) return;
    const now = Date.now();
    // Throttle progress updates to every 4 seconds
    if (now - lastProgressSave.current > 4000) {
      lastProgressSave.current = now;
      const isComplete = currentTime / duration >= 0.9;
      updateLessonProgress(courseId, currentLesson.id, currentTime, duration, isComplete);
    }
  };

  const handleNext = () => {
    if (!course) return;
    const allLessons = course.modules?.flatMap((m) => m.lessons) || [];
    const idx = allLessons.findIndex((l) => String(l.id) === String(currentLesson?.id));
    if (idx < allLessons.length - 1) {
      const nextLesson = allLessons[idx + 1];
      if (enrolled || nextLesson.is_preview) {
        handleLessonSelect(nextLesson);
      } else {
        toast('Next lesson is locked. Please purchase the course for full access.', { icon: '🔒' });
      }
    } else {
      toast.success('🎉 You have completed all lessons in this course!');
    }
  };

  const handlePrev = () => {
    if (!course) return;
    const allLessons = course.modules?.flatMap((m) => m.lessons) || [];
    const idx = allLessons.findIndex((l) => String(l.id) === String(currentLesson?.id));
    if (idx > 0) handleLessonSelect(allLessons[idx - 1]);
  };

  const handleOtpVerified = () => {
    fetchEnrollments();
  };

  const allLessons = course?.modules?.flatMap((m) => m.lessons) || [];
  const currentIdx = allLessons.findIndex((l) => String(l.id) === String(currentLesson?.id));
  const isCurrentLessonComplete = currentLesson && completedLessons.includes(String(currentLesson.id));

  // 1. Unauthenticated Visitor attempting to access protected content
  if (!loading && !isAuthenticated && currentLesson && !currentLesson.is_preview) {
    return (
      <div className={styles.accessDenied}>
        <div style={{ width: '100%', maxWidth: '480px', margin: '0 auto' }}>
          <PasswordlessAuthCard
            title="Verify Purchase Email"
            subtitle="This lesson is protected. Enter the email address you used during purchase to unlock instant access."
            actionText="Verify & Unlock Player"
            onSuccess={handleOtpVerified}
          />
        </div>
      </div>
    );
  }

  // 2. Access Denied State (Authenticated user who hasn't bought this course)
  if (!loading && accessDenied) {
    return (
      <div className={styles.accessDenied}>
        <div className={styles.accessDeniedCard}>
          <div className={styles.lockIcon} aria-hidden="true">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
          </div>
          <h2 className={styles.accessTitle}>Course Enrollment Required</h2>
          <p className={styles.accessDesc}>
            {currentUser?.email ? (
              <>Your account (<strong>{currentUser.email}</strong>) has not purchased this course yet.</>
            ) : (
              <>You have not enrolled in this course yet. Purchase once for instant lifetime access.</>
            )}
          </p>
          <div className={styles.accessActions}>
            <Button variant="primary" size="lg" onClick={() => navigate(`/checkout/${courseId}`)}>
              Unlock Instant Access — ₹{course?.discounted_price || course?.price || 499}
            </Button>
            <Button variant="outline" size="md" onClick={() => navigate(`/courses/${courseId}`)}>
              View Course Syllabus
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={styles.loadingPage}>
        <div className={styles.spinner} aria-label="Loading course…" />
        <p>Loading course player…</p>
      </div>
    );
  }

  if (!course) return null;

  // Enriched modules with completion state
  const enrichedModules = course.modules?.map((m) => ({
    ...m,
    lessons: m.lessons.map((l) => ({
      ...l,
      is_completed: completedLessons.includes(String(l.id)),
      is_locked: !enrolled && !l.is_preview,
    })),
  })) || [];

  return (
    <div className={styles.page}>
      {/* Top Navigation Bar */}
      <div className={styles.topBar}>
        <Link to={`/courses/${courseId}`} className={styles.backBtn} aria-label="Back to course details">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          <span className={styles.backText}>{course.title}</span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {enrollment && (
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
              {enrollment.progress_percentage || 0}% completed
            </span>
          )}

          {/* Mobile sidebar toggle */}
          <button
            className={styles.sidebarToggle}
            onClick={() => setSidebarOpen((o) => !o)}
            aria-label="Toggle curriculum"
            aria-expanded={sidebarOpen}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
            </svg>
            Curriculum
          </button>
        </div>
      </div>

      {/* Main Player Grid */}
      <div className={styles.mainGrid}>
        {/* Left Video + Controls Column */}
        <div className={styles.playerColumn}>
          <div className={styles.videoWrapper}>
            {videoLoading ? (
              <div className={styles.videoLoading}>
                <div className={styles.spinner} />
                <p>Loading secure stream…</p>
              </div>
            ) : videoUrl ? (
              <VideoPlayer
                videoUrl={videoUrl}
                src={videoUrl}
                lessonTitle={currentLesson?.title || course.title}
                title={currentLesson?.title || course.title}
                onTimeUpdate={handleTimeUpdate}
                onEnded={handleMarkComplete}
              />
            ) : (
              <div className={styles.videoPlaceholder}>
                <p>Select a lesson from the curriculum to start watching.</p>
              </div>
            )}
          </div>

          {/* Lesson Metadata and Actions Card */}
          <div className={styles.lessonMeta}>
            <div className={styles.lessonHeader}>
              <div className={styles.badgeRow}>
                {currentLesson?.is_preview && <span className={styles.previewBadge}>Free Preview</span>}
                <span className={styles.durationTag}>{currentLesson?.duration || '15 min'}</span>
              </div>
              <h1 className={styles.lessonTitle}>{currentLesson?.title || 'Course Lesson'}</h1>
            </div>

            {/* Lesson Description (rendered below title, only when non-empty) */}
            {Boolean(currentLesson?.description && String(currentLesson.description).trim()) && (
              <div className={styles.lessonDescriptionBlock}>
                <h2 className={styles.lessonDescriptionHeading}>About this lesson</h2>
                <div className={styles.lessonDescriptionText}>
                  {currentLesson.description}
                </div>
              </div>
            )}

            <div className={styles.lessonControls}>
              <button
                className={[styles.completeBtn, isCurrentLessonComplete ? styles.completed : ''].filter(Boolean).join(' ')}
                onClick={handleMarkComplete}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                {isCurrentLessonComplete ? 'Completed' : 'Mark as Complete'}
              </button>

              <div className={styles.navBtns}>
                <button
                  className={styles.navBtn}
                  onClick={handlePrev}
                  disabled={currentIdx <= 0}
                  title="Previous Lesson"
                  aria-label="Previous Lesson"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                </button>
                <button
                  className={styles.navBtn}
                  onClick={handleNext}
                  disabled={currentIdx >= allLessons.length - 1}
                  title="Next Lesson"
                  aria-label="Next Lesson"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Sidebar Backdrop */}
        {sidebarOpen && (
          <div
            className={styles.sidebarBackdrop}
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Right Sidebar: Curriculum */}
        <div className={[styles.sidebarWrapper, sidebarOpen ? styles.sidebarVisible : ''].filter(Boolean).join(' ')}>
          <CurriculumSidebar
            modules={enrichedModules}
            currentLessonId={currentLesson?.id}
            isEnrolled={enrolled}
            onLessonSelect={handleLessonSelect}
            onSelectLesson={handleLessonSelect}
            onClose={() => setSidebarOpen(false)}
          />
        </div>
      </div>
    </div>
  );
}
