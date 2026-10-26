// =========================================================
//  CourseCard Component — Clean Course Grid Card
// =========================================================

import { Link } from 'react-router-dom';
import { formatPrice, discountPercent } from '../../utils/helpers';
import styles from './CourseCard.module.css';

export default function CourseCard({ course }) {
  const {
    id,
    title,
    description,
    thumbnail,
    instructor,
    price,
    original_price,
    total_lessons,
    duration,
    level,
  } = course;

  const finalPrice = discounted_price || price;
  const originalPrice = original_price && Number(original_price) > Number(finalPrice)
    ? Number(original_price)
    : (Number(price) > Number(finalPrice) ? Number(price) : null);
  const discount = originalPrice ? discountPercent(originalPrice, finalPrice) : 0;

  return (
    <Link to={`/courses/${id}`} className={styles.card} aria-label={`View ${title}`}>
      {/* Thumbnail */}
      <div className={styles.thumbWrap}>
        <img src={thumbnail} alt={title} className={styles.thumb} loading="lazy" />
        {discount > 0 && (
          <div className={styles.discountBadge}>
            <span className={styles.discountText}>-{discount}%</span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className={styles.body}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.description}>{description}</p>

        <p className={styles.instructor}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
          </svg>
          {instructor}
        </p>

        <div className={styles.metaRow}>
          <span>{total_lessons} Lessons</span>
          <span>•</span>
          <span>{duration}</span>
          {level && (
            <>
              <span>•</span>
              <span>{level}</span>
            </>
          )}
        </div>

        <div className={styles.footerRow}>
          <div className={styles.prices}>
            <span className={styles.currentPrice}>{formatPrice(finalPrice)}</span>
            {originalPrice && originalPrice > finalPrice && (
              <span className={styles.originalPrice}>{formatPrice(originalPrice)}</span>
            )}
          </div>
          <span className={styles.cta}>View Course →</span>
        </div>
      </div>
    </Link>
  );
}
