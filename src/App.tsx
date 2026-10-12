import React from 'react';
import { AppProvider, useApp } from './context/AppContext.tsx';
import { Navbar } from './components/Navbar.tsx';
import { Footer } from './components/Footer.tsx';
import { HomePage } from './pages/HomePage.tsx';
import { ExploreHackathonsPage } from './pages/ExploreHackathonsPage.tsx';
import { FindCoursesPage } from './pages/FindCoursesPage.tsx';
import { AiCoachPage } from './pages/AiCoachPage.tsx';
import { DashboardPage } from './pages/DashboardPage.tsx';
import { AdminPage } from './pages/AdminPage.tsx';
import { AuthModal } from './components/AuthModal.tsx';

const AppContent: React.FC = () => {
  const {
    currentPage,
    showAuthModal,
    setShowAuthModal,
    guestUsageCount,
    isLoggedIn
  } = useApp();

  const isGateActive = guestUsageCount >= 2 && !isLoggedIn;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar />

      {/* Guest usage notice banner if approaching limit */}
      {!isLoggedIn && guestUsageCount < 2 && (
        <div className="bg-indigo-900 text-indigo-100 text-[11px] px-4 py-1.5 text-center flex items-center justify-center space-x-2">
          <span>
            Browsing as Guest: You have <strong>{2 - guestUsageCount} free opportunity preview{2 - guestUsageCount === 1 ? '' : 's'}</strong> remaining before registration is required.
          </span>
          <button
            onClick={() => setShowAuthModal(true)}
            className="underline font-bold text-white hover:text-indigo-200"
          >
            Sign in now →
          </button>
        </div>
      )}

      <main className="flex-1">
        {currentPage === 'home' && <HomePage />}
        {currentPage === 'hackathons' && <ExploreHackathonsPage />}
        {currentPage === 'courses' && <FindCoursesPage />}
        {currentPage === 'coach' && <AiCoachPage />}
        {currentPage === 'dashboard' && <DashboardPage />}
        {currentPage === 'admin' && <AdminPage />}
      </main>

      <Footer />

      {/* Authentication & Mandatory Login Modal */}
      <AuthModal
        isOpen={showAuthModal || isGateActive}
        onClose={() => setShowAuthModal(false)}
        isMandatory={isGateActive}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
