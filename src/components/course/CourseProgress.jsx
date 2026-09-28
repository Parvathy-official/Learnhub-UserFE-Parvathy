// =========================================================
//  CourseProgress Component (for enrolled course cards)
// =========================================================

import { Link } from 'react-router-dom';
import styles from './CourseProgress.module.css';

export default function CourseProgress({ course, enrollment }) {
  const { id, title, thumbnail, instructor, total_lessons } = course;
  const progress = enrollment?.progress_percentage ?? 0;
  const completedLessons = enrollment?.completed_lessons ?? [];
  const completedCount = completedLessons.length;
  const lastLessonId = enrollment?.last_watched_lesson?.id || (typeof enrollment?.last_watched_lesson === 'string' ? enrollment?.last_watched_lesson : null);

  const targetLink = lastLessonId
    ? `/course/${id}/learn/${lastLessonId}`
    : `/course/${id}/learn`;

  const totalCount = total_lessons || enrollment?.total_lessons || 13;

  const actionLabel = progress === 0
    ? 'Start Learning →'
    : progress === 100
    ? 'Review Course →'
    : 'Continue Learning →';

  return (
    <div className={styles.card}>
      <div className={styles.thumbWrap}>
        <img
          src={thumbnail || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&q=80'}
          alt={title}
          className={styles.thumb}
          loading="lazy"
        />
        {progress === 100 && (
          <div className={styles.completedBadge}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span>Completed</span>
          </div>
        )}
      </div>

      <div className={styles.body}>
        <div className={styles.headerRow}>
          <div className={styles.info}>
            <h3 className={styles.title}>{title}</h3>
            <p className={styles.instructor}>{instructor || 'Devon Vance'}</p>
          </div>
          <span className={styles.percentBadge}>{progress}% Complete</span>
        </div>

        <div className={styles.progressArea}>
          <div className={styles.progressBarTrack}>
            <div
              className={styles.progressBarFill}
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            />
          </div>
          <p className={styles.lessonCount}>
            {completedCount} of {totalCount} lessons completed
          </p>
        </div>

        <div className={styles.actionRow}>
          <Link to={targetLink} className={styles.actionBtn}>
            <span>{actionLabel}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
