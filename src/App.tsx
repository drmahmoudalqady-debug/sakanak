import { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router';
import { AppProvider } from '@/context/AppContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HomePage from '@/pages/HomePage';
import ListingsPage from '@/pages/ListingsPage';
import AdminLoginPage from '@/pages/AdminLoginPage';
import AdminDashboardPage from '@/pages/AdminDashboardPage';
import ResetPasswordPage from '@/pages/ResetPasswordPage';
import PolicyPage from '@/pages/PolicyPage'; // ← جديد
import { Toaster } from '@/components/ui/sonner';
import { logPageView } from '@/lib/data-service';

// يسجّل حدث "page_view" تلقائيًا عند أي تغيّر في المسار — يُستثنى مسار الأدمن
// حتى لا تُحتسب زياراتك الشخصية للوحة التحكم ضمن إحصائيات الزوار
function PageViewTracker() {
  const location = useLocation();
  useEffect(() => {
    if (location.pathname.startsWith('/admin')) return;
    logPageView(location.pathname);
  }, [location.pathname]);
  return null;
}

export default function App() {
  return (
    <AppProvider>
      <PageViewTracker />
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/region/:region" element={<ListingsPage />} />
            <Route path="/policy" element={<PolicyPage />} /> {/* ← جديد */}
            <Route path="/admin" element={<AdminLoginPage />} />
            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
      <Toaster position="top-center" richColors />
    </AppProvider>
  );
}
