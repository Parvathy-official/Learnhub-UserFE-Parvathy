// =========================================================
//  AppRoutes — All application routes (No login barriers)
// =========================================================

import { Routes, Route, Navigate } from 'react-router-dom';

// Public pages
import Home from '../pages/Home';
import Courses from '../pages/Courses';
import CourseDetails from '../pages/CourseDetails';
import NotFound from '../pages/NotFound';
import Login from '../pages/Login';
import Signup from '../pages/Signup';

// Session & Checkout pages
import MyCourses from '../pages/MyCourses';
import CoursePlayer from '../pages/CoursePlayer';
import Checkout from '../pages/Checkout';
import PaymentSuccess from '../pages/PaymentSuccess';
import PaymentFailed from '../pages/PaymentFailed';

export default function AppRoutes() {
  return (
    <Routes>
      {/* ── Main Landing Page ── */}
      <Route path="/" element={<Home />} />
      <Route path="/courses" element={<Courses />} />
      <Route path="/courses/:id" element={<CourseDetails />} />

      {/* ── Auth Routes ── */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* ── Instant Learning & Session Access ── */}
      <Route path="/my-learning" element={<MyCourses />} />
      <Route path="/my-courses" element={<Navigate to="/my-learning" replace />} />
      <Route path="/dashboard" element={<Navigate to="/my-learning" replace />} />

      {/* ── Video Player ── */}
      <Route path="/course/:courseId/learn" element={<CoursePlayer />} />
      <Route path="/course/:courseId/learn/:lessonId" element={<CoursePlayer />} />

      {/* ── Checkout & Instant Access ── */}
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/checkout/:courseId" element={<Checkout />} />
      <Route path="/payment-success" element={<PaymentSuccess />} />
      <Route path="/payment/success" element={<PaymentSuccess />} />
      <Route path="/payment/failed" element={<PaymentFailed />} />

      {/* ── 404 ── */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
