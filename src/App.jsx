// =========================================================
//  App.jsx — Root: Providers + Router + Layout
// =========================================================

import { BrowserRouter, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CourseProvider } from './context/CourseContext';
import Footer from './components/layout/Footer';
import AppRoutes from './routes/AppRoutes';

function AppLayout() {
  const location = useLocation();
  const isCheckoutPage = location.pathname.startsWith('/checkout');

  return (
    <>
      {/* Page content — takes remaining height */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <AppRoutes />
      </main>

      {!isCheckoutPage && <Footer />}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CourseProvider>
          {/* Global toast notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                fontFamily: "'Lato', sans-serif",
                fontSize: '0.875rem',
                borderRadius: '10px',
                background: '#0B1116',
                color: '#CBD5E1',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.9)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              },
              success: {
                iconTheme: { primary: '#10B981', secondary: '#0B1116' },
              },
              error: {
                iconTheme: { primary: '#EF4444', secondary: '#0B1116' },
              },
            }}
          />

          <AppLayout />
        </CourseProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
