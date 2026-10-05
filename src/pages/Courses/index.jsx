// =========================================================
//  Courses Page — Explore All Available Masterclasses
// =========================================================

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCourseContext } from '../../hooks/useCourses';
import courseService from '../../services/courseService';
import { MOCK_COURSES } from '../../utils/mockData';
import { formatPrice } from '../../utils/helpers';
import styles from './Courses.module.css';

export default function Courses() {
  const { isEnrolled } = useCourseContext();
  const [coursesList, setCoursesList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCat, setSelectedCat] = useState('All');

  useEffect(() => {
    courseService
      .getCourses()
      .then((data) => {
        const list = Array.isArray(data) ? data : data.results || [];
        setCoursesList(list.length > 0 ? list : MOCK_COURSES);
      })
      .catch(() => {
        setCoursesList(MOCK_COURSES);
      });
  }, []);

  const categories = ['All', 'Digital Products & AI', 'Online Business', 'Performance Marketing'];

  const filtered = coursesList.filter((course) => {
    const matchesCat = selectedCat === 'All' || course.category === selectedCat;
    const matchesSearch =
      !searchTerm ||
      course.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className={styles.page}>
      <div className="container">
        {/* Page Header */}
        <div className={styles.header}>
          <span className={styles.badge}>Live Masterclasses</span>
          <h1 className={styles.title}>Explore Available Programs</h1>
          <p className={styles.subtitle}>
            Practical, actionable sessions designed to take you from idea to launch with modern AI tools and growth frameworks.
          </p>
        </div>

        {/* Controls: Search and Filter */}
        <div className={styles.controls}>
          <div className={styles.searchWrap}>
            <svg
              className={styles.searchIcon}
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Search masterclasses, topics, frameworks…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className={styles.categories}>
            {categories.map((cat) => (
              <button
                key={cat}
                className={[styles.catBtn, selectedCat === cat ? styles.catBtnActive : ''].join(' ')}
                onClick={() => setSelectedCat(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Courses Grid */}
        <div className={styles.grid}>
          {filtered.map((course) => {
            const enrolled = isEnrolled(course.id);
            const finalPrice = course.discounted_price || course.price || 499;
            const originalPrice = course.original_price || course.price || 2499;

            return (
              <div key={course.id} className={styles.courseCard}>
                <div className={styles.thumbWrap}>
                  <img
                    src={course.thumbnail || '/workshop-banner.jpg'}
                    alt={course.title}
                    className={styles.thumb}
                  />
                  <span className={styles.cardBadge}>
                    {enrolled ? '✓ Enrolled' : course.is_bestseller ? '⭐ Bestseller' : 'Practical Masterclass'}
                  </span>
                </div>

                <div className={styles.cardBody}>
                  <div className={styles.metaRow}>
                    <span>⚡ {course.duration || '3 Hours'}</span>
                    <span>•</span>
                    <span>📚 {course.total_lessons || 14} Lessons</span>
                    <span>•</span>
                    <span>⭐ {course.rating || 4.98}</span>
                  </div>

                  <Link to={`/courses/${course.id}`} className={styles.cardTitle}>
                    {course.title}
                  </Link>

                  <p className={styles.cardDesc}>
                    {course.subtitle || course.short_description || course.description}
                  </p>

                  <div className={styles.footerRow}>
                    <div className={styles.priceWrap}>
                      <span className={styles.price}>{formatPrice(finalPrice)}</span>
                      {originalPrice > finalPrice && (
                        <span className={styles.originalPrice}>{formatPrice(originalPrice)}</span>
                      )}
                    </div>

                    <div className={styles.actions}>
                      <Link to={`/courses/${course.id}`} className={styles.detailsBtn}>
                        Syllabus
                      </Link>

                      {enrolled ? (
                        <Link to={`/course/${course.id}/learn`} className={styles.resumeBtn}>
                          ▶ Resume
                        </Link>
                      ) : (
                        <Link to={`/checkout/${course.id}`} className={styles.buyBtn}>
                          Get Access
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
