// =========================================================
//  CourseContext — Course browsing, enrollment & progress state
// =========================================================

import { createContext, useState, useCallback, useEffect } from 'react';
import courseService from '../services/courseService';
import { MOCK_ENROLLMENTS, MOCK_PURCHASES } from '../utils/mockData';

const CourseContext = createContext(null);

const STORAGE_ENROLLMENTS_KEY = 'learnflow_enrollments';
const STORAGE_PURCHASES_KEY = 'learnflow_purchases';

export function CourseProvider({ children }) {
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState(() => {
    try {
      const token = localStorage.getItem('access_token');
      const saved = localStorage.getItem(STORAGE_ENROLLMENTS_KEY);
      return (token && saved) ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [purchases, setPurchases] = useState(() => {
    try {
      const token = localStorage.getItem('access_token');
      const saved = localStorage.getItem(STORAGE_PURCHASES_KEY);
      return (token && saved) ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [coursesLoading, setCoursesLoading] = useState(false);
  const [enrollmentsLoading, setEnrollmentsLoading] = useState(false);
  const [coursesError, setCoursesError] = useState(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_ENROLLMENTS_KEY, JSON.stringify(enrollments));
    } catch {}
  }, [enrollments]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_PURCHASES_KEY, JSON.stringify(purchases));
    } catch {}
  }, [purchases]);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      courseService.getMyEnrollments()
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) {
            setEnrollments(data);
          }
        })
        .catch(() => {});
    }
  }, []);

  const fetchCourses = useCallback(async (params = {}) => {
    setCoursesLoading(true);
    setCoursesError(null);
    try {
      const data = await courseService.getCourses(params);
      setCourses(data.results || data);
      return data;
    } catch (err) {
      setCoursesError(err.message || 'Failed to load courses');
      throw err;
    } finally {
      setCoursesLoading(false);
    }
  }, []);

  const fetchEnrollments = useCallback(async () => {
    setEnrollmentsLoading(true);
    try {
      const data = await courseService.getMyEnrollments();
      if (Array.isArray(data)) {
        setEnrollments(data);
      }
      return data;
    } catch {
      return [];
    } finally {
      setEnrollmentsLoading(false);
    }
  }, []);

  const isEnrolled = useCallback(
    (courseId) =>
      enrollments.some(
        (e) =>
          String(e.course_id) === String(courseId) ||
          String(e.course?.id) === String(courseId)
      ),
    [enrollments]
  );

  const getEnrollment = useCallback(
    (courseId) =>
      enrollments.find(
        (e) =>
          String(e.course_id) === String(courseId) ||
          String(e.course?.id) === String(courseId)
      ) || null,
    [enrollments]
  );

  const addEnrollment = useCallback((enrollment) => {
    setEnrollments((prev) => {
      const exists = prev.some(
        (e) =>
          String(e.course_id) === String(enrollment.course_id) ||
          String(e.course?.id) === String(enrollment.course?.id)
      );
      if (exists) return prev;
      return [...prev, enrollment];
    });
  }, []);

  const addPurchase = useCallback((purchase) => {
    setPurchases((prev) => [purchase, ...prev]);
  }, []);

  const updateLessonProgress = useCallback((courseId, lessonId, currentTime = 0, duration = 0, isComplete = false) => {
    setEnrollments((prev) => {
      return prev.map((e) => {
        if (e.course_id !== courseId) return e;

        const completedSet = new Set(e.completed_lessons || []);
        const shouldMarkComplete = isComplete || (duration > 0 && currentTime / duration >= 0.9);

        if (shouldMarkComplete) {
          completedSet.add(lessonId);
        }

        const completedArr = Array.from(completedSet);
        // Estimate progress percentage (assuming 12 lessons per course default or computed)
        const totalLessonsCount = e.total_lessons || 12;
        const progressPercentage = Math.min(100, Math.round((completedArr.length / totalLessonsCount) * 100));

        return {
          ...e,
          completed_lessons: completedArr,
          progress_percentage: progressPercentage,
          last_watched_lesson_id: lessonId,
          last_position_seconds: currentTime,
          last_updated: new Date().toISOString(),
        };
      });
    });
  }, []);

  const value = {
    courses,
    enrollments,
    purchases,
    coursesLoading,
    enrollmentsLoading,
    coursesError,
    fetchCourses,
    fetchEnrollments,
    isEnrolled,
    getEnrollment,
    addEnrollment,
    addPurchase,
    updateLessonProgress,
  };

  return <CourseContext.Provider value={value}>{children}</CourseContext.Provider>;
}

export default CourseContext;
