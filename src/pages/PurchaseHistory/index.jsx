// =========================================================
//  Purchase History Page — Simple Paid Online Course Platform
// =========================================================

import { Link, useNavigate } from 'react-router-dom';
import { useCourseContext } from '../../hooks/useCourses';
import { formatPrice, formatDate } from '../../utils/helpers';
import EmptyState from '../../components/common/EmptyState';
import Button from '../../components/common/Button';
import styles from './PurchaseHistory.module.css';

export default function PurchaseHistory() {
  const { purchases, isEnrolled } = useCourseContext();
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <div className="container">
        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.title}>Purchase History</h1>
          <p className={styles.sub}>
            Review your order receipts, invoices, and active course licenses.
          </p>
        </div>

        {purchases.length === 0 ? (
          <EmptyState
            icon={
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                <line x1="1" y1="10" x2="23" y2="10" />
              </svg>
            }
            title="No purchases found"
            description="When you buy a course, your order confirmation, receipt, and access details will appear here."
            actionLabel="Discover Courses"
            onAction={() => navigate('/')}
          />
        ) : (
          <div className={styles.tableCard}>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Order Ref</th>
                    <th>Course</th>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Payment Method</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {purchases.map((p) => {
                    const enrolled = isEnrolled(p.course_id);
                    return (
                      <tr key={p.id}>
                        <td>
                          <span className={styles.orderId}>{p.id}</span>
                        </td>
                        <td>
                          <div className={styles.courseCell}>
                            <Link to={`/courses/${p.course_id}`} className={styles.courseTitleLink}>
                              {p.course_title}
                            </Link>
                          </div>
                        </td>
                        <td>
                          <span className={styles.dateText}>
                            {p.purchase_date ? formatDate(p.purchase_date) : 'Recently'}
                          </span>
                        </td>
                        <td>
                          <span className={styles.amountText}>{formatPrice(p.amount)}</span>
                        </td>
                        <td>
                          <span className={styles.methodText}>{p.payment_method || 'Online Card'}</span>
                        </td>
                        <td>
                          <span className={styles.paidBadge}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                            Paid
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <Link to={`/course/${p.course_id}/learn`}>
                            <Button variant="primary" size="sm">
                              {enrolled ? 'Go to Course →' : 'View Course'}
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
