// =========================================================
//  Rating Component
// =========================================================

import styles from './Rating.module.css';

export default function Rating({ value = 0, count, size = 'sm', showValue = true }) {
  const stars = Array.from({ length: 5 }, (_, i) => {
    const filled = i + 1 <= Math.floor(value);
    const partial = !filled && i < value;
    return { filled, partial, index: i };
  });

  return (
    <div className={[styles.rating, styles[size]].join(' ')}>
      <div className={styles.stars} aria-label={`${value} out of 5 stars`}>
        {stars.map(({ filled, partial, index }) => (
          <svg
            key={index}
            className={[styles.star, filled ? styles.filled : partial ? styles.partial : styles.empty].join(' ')}
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            {partial ? (
              <defs>
                <linearGradient id={`partial-${index}`}>
                  <stop offset={`${(value % 1) * 100}%`} stopColor="#F59E0B" />
                  <stop offset={`${(value % 1) * 100}%`} stopColor="#2A2A2A" />
                </linearGradient>
              </defs>
            ) : null}
            <path
              d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
              fill={
                filled
                  ? '#F59E0B'
                  : partial
                  ? `url(#partial-${index})`
                  : '#2A2A2A'
              }
            />
          </svg>
        ))}
      </div>
      {showValue && (
        <span className={styles.value}>{value.toFixed(1)}</span>
      )}
      {count !== undefined && (
        <span className={styles.count}>({count.toLocaleString()})</span>
      )}
    </div>
  );
}
