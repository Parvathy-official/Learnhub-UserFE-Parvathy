// =========================================================
//  CurriculumSidebar Component
// =========================================================

import { useState } from 'react';
import styles from './CurriculumSidebar.module.css';

function LessonItem({ lesson, isActive, isEnrolled, onSelect }) {
  const canAccess = isEnrolled || lesson.is_preview;

  return (
    <button
      className={[
        styles.lesson,
        isActive ? styles.active : '',
        !canAccess ? styles.locked : '',
        lesson.is_completed ? styles.completed : '',
      ].filter(Boolean).join(' ')}
      onClick={() => onSelect && onSelect(lesson)}
      aria-label={`${lesson.title}${!canAccess ? ' (locked)' : ''}`}
      aria-current={isActive ? 'true' : undefined}
    >
      {/* Status icon */}
      <div className={styles.statusIcon} aria-hidden="true">
        {lesson.is_completed ? (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        ) : !canAccess ? (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0110 0v4" />
          </svg>
        ) : isActive ? (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
        )}
      </div>

      <div className={styles.lessonInfo}>
        <span className={styles.lessonTitle}>{lesson.title}</span>
        <div className={styles.lessonMeta}>
          {lesson.is_preview && !isEnrolled && (
            <span className={styles.previewBadge}>Preview</span>
          )}
          <span className={styles.duration}>{lesson.duration}</span>
        </div>
      </div>
    </button>
  );
}

export default function CurriculumSidebar({ modules = [], currentLessonId, isEnrolled = false, onLessonSelect, onSelectLesson, onClose }) {
  const [expanded, setExpanded] = useState(() => modules.map((_, i) => i === 0));
  const handleSelect = (lesson) => {
    const fn = onLessonSelect || onSelectLesson;
    if (fn) fn(lesson);
    if (onClose && window.innerWidth <= 960) {
      onClose();
    }
  };

  const toggleModule = (index) => {
    setExpanded((prev) => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  };

  const totalLessons = modules.reduce((acc, m) => acc + m.lessons.length, 0);
  const completedLessons = modules.reduce(
    (acc, m) => acc + m.lessons.filter((l) => l.is_completed).length,
    0
  );

  return (
    <aside className={styles.sidebar} aria-label="Course curriculum">
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h3 className={styles.headerTitle}>Course Content</h3>
          <p className={styles.headerMeta}>
            {completedLessons}/{totalLessons} completed
          </p>
        </div>
        {onClose && (
          <button
            className={styles.closeDrawerBtn}
            onClick={onClose}
            aria-label="Close curriculum drawer"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>

      {/* Modules */}
      <div className={styles.modules}>
        {modules.map((module, idx) => (
          <div key={module.id} className={styles.module}>
            <button
              className={styles.moduleHeader}
              onClick={() => toggleModule(idx)}
              aria-expanded={expanded[idx]}
            >
              <span className={styles.moduleTitle}>{module.title}</span>
              <div className={styles.moduleRight}>
                <span className={styles.moduleMeta}>{module.lessons.length} lessons</span>
                <svg
                  width="16" height="16"
                  viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                  className={[styles.chevron, expanded[idx] ? styles.open : ''].join(' ')}
                  aria-hidden="true"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
            </button>

            {expanded[idx] && (
              <div className={styles.lessonList}>
                {module.lessons.map((lesson) => (
                  <LessonItem
                    key={lesson.id}
                    lesson={lesson}
                    isActive={String(lesson.id) === String(currentLessonId)}
                    isEnrolled={isEnrolled}
                    onSelect={handleSelect}
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
}
