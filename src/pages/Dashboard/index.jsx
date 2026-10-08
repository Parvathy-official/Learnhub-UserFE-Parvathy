// =========================================================
//  Dashboard Page
// =========================================================

import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useCourseContext } from '../../hooks/useCourses';
import { MOCK_COURSES, MOCK_RECENT_ACTIVITY } from '../../utils/mockData';
import StatCard from '../../components/dashboard/StatCard';
import CourseProgress from '../../components/course/CourseProgress';
import ProgressBar from '../../components/common/ProgressBar';
import Button from '../../components/common/Button';
import { overallProgress } from '../../utils/helpers';
import styles from './Dashboard.module.css';

export default function Dashboard() {
  const { currentUser } = useAuth();
  const { enrollments, enrollmentsLoading, fetchEnrollments } = useCourseContext();

  useEffect(() => {
    fetchEnrollments();
  }, [fetchEnrollments]);

  const enrolledCourses = MOCK_COURSES.filter((c) =>
    enrollments.some((e) => e.course_id === c.id)
  );
  const completed = enrollments.filter((e) => e.progress_percentage === 100).length;
  const inProgress = enrollments.filter((e) => e.progress_percentage > 0 && e.progress_percentage < 100).length;
  const progress = overallProgress(enrollments);

  return (
    <div className={styles.page}>
      <div className="container">

        {/* Welcome Banner */}
        <div className={styles.welcome}>
          <div className={styles.welcomeLeft}>
            <h1 className={styles.welcomeTitle}>
              Welcome back, {currentUser?.name?.split(' ')[0]} 👋
            </h1>
            <p className={styles.welcomeSub}>
              You're mastering high-ROAS media buying & growth engineering.
            </p>
          </div>
          <div className={styles.welcomeProgress}>
            <p className={styles.progressLabel}>Curriculum Progress</p>
            <ProgressBar value={progress} showPercent size="lg" />
          </div>
        </div>

        {/* Stats */}
        <div className={styles.statsGrid}>
          <StatCard
            icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>}
            label="Programs Enrolled"
            value={enrollments.length}
            sub="Active masterclasses"
            color="primary"
          />
          <StatCard
            icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>}
            label="In Progress"
            value={inProgress}
            sub="Active learning modules"
            color="warning"
          />
          <StatCard
            icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>}
            label="Completed"
            value={completed}
            sub="Graduated tracks"
            color="success"
          />
          <StatCard
            icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>}
            label="Overall Progress"
            value={`${progress}%`}
            sub="Across all masterclasses"
            color="primary"
          />
        </div>

        {/* Continue Learning / Up Next */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Up Next in Your Masterclass</h2>
            <Link to="/my-courses" className={styles.seeAll}>All Programs →</Link>
          </div>

          {/* Quick Resume Hero Card */}
          {enrolledCourses.length > 0 && (
            <div style={{ background: '#171717', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 'var(--radius-xl)', padding: '24px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.8), 0 0 20px rgba(245,158,11,0.1)' }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center', minWidth: 280 }}>
                <div style={{ width: 100, height: 65, borderRadius: 'var(--radius-md)', overflow: 'hidden', flexShrink: 0, position: 'relative' }}>
                  <img src={enrolledCourses[0].thumbnail} alt={enrolledCourses[0].title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="#F59E0B"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase' }}>Module 1: Unit Economics</span>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-dark)', margin: '2px 0 4px' }}>The ROAS & MER Calculator</h3>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)', margin: 0 }}>24m duration • 35% completed</p>
                </div>
              </div>

              <Link to={`/course/${enrolledCourses[0].id}/learn`}>
                <Button variant="primary" size="md">
                  ▶ Resume Watching
                </Button>
              </Link>
            </div>
          )}

          {enrollmentsLoading ? (
            <div className={styles.loadingText}>Loading your programs…</div>
          ) : enrolledCourses.length === 0 ? (
            <div className={styles.emptyState}>
              <p>You haven't enrolled in any programs yet.</p>
              <Link to="/courses" className={styles.exploreLink}>Explore Flagship Programs →</Link>
            </div>
          ) : (
            <div className={styles.coursesList}>
              {enrolledCourses.map((course) => {
                const enrollment = enrollments.find((e) => e.course_id === course.id);
                return <CourseProgress key={course.id} course={course} enrollment={enrollment} />;
              })}
            </div>
          )}
        </section>

        {/* Student Toolkit & Mastermind Section */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '24px', margin: '36px 0' }}>
          {/* Live Q&A & Coaching Card */}
          <div style={{ background: '#171717', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#EF4444', display: 'inline-block', boxShadow: '0 0 8px #EF4444' }} />
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-dark)', margin: 0 }}>Next Live Office Hours & Account Audit</h3>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: '0 0 16px' }}>
              Bring your active Meta & Google ad campaigns for live teardowns and scaling troubleshooting with Devon Vance.
            </p>
            <div style={{ background: '#101010', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-dark)' }}>Thursday @ 8:00 PM EST</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Zoom Live Mastermind (Cohort #14)</div>
              </div>
              <span style={{ fontSize: '0.72rem', background: 'var(--primary-bg)', color: 'var(--primary)', padding: '4px 8px', borderRadius: 4, fontWeight: 700 }}>
                Calendar Added
              </span>
            </div>
          </div>

          {/* Student Resource Vault */}
          <div style={{ background: '#171717', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: '24px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-dark)', margin: '0 0 12px' }}>
              📦 Student Resource Vault (Direct Access)
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <a href="#sop" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: '#101010', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', textDecoration: 'none', color: 'var(--text-primary)', fontSize: '0.8125rem', transition: 'border-color 0.2s' }}>
                <span>📑 25+ Notion Media Buying SOPs</span>
                <span style={{ color: 'var(--primary)', fontWeight: 600 }}>Open →</span>
              </a>
              <a href="#roas" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: '#101010', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', textDecoration: 'none', color: 'var(--text-primary)', fontSize: '0.8125rem', transition: 'border-color 0.2s' }}>
                <span>📊 ROAS & Break-Even MER Calculator</span>
                <span style={{ color: 'var(--primary)', fontWeight: 600 }}>Open →</span>
              </a>
              <a href="#discord" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: '#101010', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', textDecoration: 'none', color: 'var(--text-primary)', fontSize: '0.8125rem', transition: 'border-color 0.2s' }}>
                <span>💬 Private Student Mastermind Discord</span>
                <span style={{ color: 'var(--primary)', fontWeight: 600 }}>Join →</span>
              </a>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Recent Activity & Study Log</h2>
          </div>

          <div className={styles.activityList}>
            {MOCK_RECENT_ACTIVITY.map((item, i) => (
              <div key={i} className={styles.activityItem}>
                <div className={styles.activityIcon} aria-hidden="true">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                </div>
                <div className={styles.activityContent}>
                  <p className={styles.activityLesson}>{item.title || item.lesson_title}</p>
                  <p className={styles.activityCourse}>{item.course || item.course_title}</p>
                </div>
                <span className={styles.activityTime}>{item.timestamp || item.watched_at}</span>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
