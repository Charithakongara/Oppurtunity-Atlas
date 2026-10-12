import React, { useState } from 'react';
import {
  Compass,
  Search,
  Bell,
  Sparkles,
  BookOpen,
  Trophy,
  LayoutDashboard,
  ShieldCheck,
  Menu,
  X,
  CheckCircle,
  ExternalLink,
  User,
  Flame,
  Award
} from 'lucide-react';
import { useApp, AppPage } from '../context/AppContext.tsx';

export const Navbar: React.FC = () => {
  const {
    currentPage,
    setCurrentPage,
    searchQuery,
    setSearchQuery,
    notifications,
    markNotificationRead,
    user,
    applications,
    trackedCourses,
    isLoggedIn,
    guestUsageCount,
    setShowAuthModal,
    logoutUser
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const navItems: { id: AppPage; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'home', label: 'Home', icon: <Compass className="w-4 h-4" /> },
    { id: 'hackathons', label: 'Explore Hackathons', icon: <Trophy className="w-4 h-4" /> },
    { id: 'courses', label: 'Find Courses', icon: <BookOpen className="w-4 h-4" /> },
    {
      id: 'coach',
      label: 'AI Hackathon Coach',
      icon: <Sparkles className="w-4 h-4 text-violet-600" />,
      badge: 'AI'
    },
    {
      id: 'dashboard',
      label: 'My Dashboard',
      icon: <LayoutDashboard className="w-4 h-4" />,
      badge: applications.length > 0 ? `${applications.length}` : undefined
    },
    { id: 'admin', label: 'Admin Panel', icon: <ShieldCheck className="w-4 h-4" /> }
  ];

  const handleNavClick = (page: AppPage) => {
    setCurrentPage(page);
    setMobileMenuOpen(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      if (currentPage !== 'hackathons' && currentPage !== 'courses') {
        setCurrentPage('hackathons');
      }
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 transition-all shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => handleNavClick('home')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-100 ring-2 ring-indigo-50">
              <Compass className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-lg tracking-tight text-slate-900">Opportunity</span>
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">Atlas</span>
              </div>
              <p className="text-[10px] text-slate-500 hidden sm:block tracking-wide font-medium">Discover • Learn • Build • Improve</p>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-semibold transition-all relative ${
                    isActive
                      ? 'text-indigo-600 bg-indigo-50/80 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase ${
                        item.badge === 'AI'
                          ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-xs'
                          : 'bg-indigo-100 text-indigo-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Search, Notifications & User Profile */}
          <div className="flex items-center space-x-3">
            {/* Quick search */}
            <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
              <input
                type="text"
                placeholder="Search hackathons, skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-48 xl:w-60 pl-9 pr-3 py-1.5 text-xs bg-slate-100 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all"
              />
            </form>

            {/* Notifications button */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                title="Notifications"
                aria-label="View notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
                )}
              </button>

              {/* Notifications Popover */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 py-3 z-50">
                  <div className="flex items-center justify-between px-4 pb-2 border-b border-slate-100">
                    <span className="font-bold text-sm text-slate-900">Notifications</span>
                    <span className="text-xs text-slate-500">{unreadCount} unread</span>
                  </div>
                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                    {notifications.length === 0 ? (
                      <div className="py-6 text-center text-xs text-slate-500">No notifications yet.</div>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => markNotificationRead(n.id)}
                          className={`p-3 text-xs cursor-pointer hover:bg-slate-50 transition-colors ${
                            !n.read ? 'bg-indigo-50/40' : ''
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <span className="font-semibold text-slate-800">{n.title}</span>
                            {!n.read && <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full mt-1"></span>}
                          </div>
                          <p className="text-slate-600 mt-1 leading-relaxed">{n.message}</p>
                          <span className="text-[10px] text-slate-400 mt-1 block">
                            {new Date(n.date).toLocaleDateString()}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile or Sign In Button */}
            {!isLoggedIn ? (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white text-xs font-bold shadow-md shadow-indigo-100 flex items-center space-x-1.5 transition-all"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Sign In / Join</span>
                  {guestUsageCount < 2 && (
                    <span className="hidden sm:inline px-1.5 py-0.2 bg-white/20 rounded-full text-[10px]">
                      {2 - guestUsageCount} free left
                    </span>
                  )}
                </button>
              </div>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
                >
                  {user?.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/20"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                      {user?.name?.slice(0, 2).toUpperCase() || 'ST'}
                    </div>
                  )}
                  <div className="hidden md:block text-left">
                    <div className="text-xs font-bold text-slate-900 leading-tight">{user?.name || 'Student'}</div>
                    <div className="text-[10px] text-indigo-600 font-bold leading-tight truncate max-w-[100px]">
                      {user?.currentStatus || 'Student'}
                    </div>
                  </div>
                </button>

                {/* Profile dropdown */}
                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 p-4 z-50">
                    <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
                      <img
                        src={user?.avatarUrl || ''}
                        alt={user?.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="overflow-hidden">
                        <div className="font-bold text-sm text-slate-900">{user?.name}</div>
                        <div className="text-xs text-indigo-600 font-bold">{user?.currentStatus || 'Student'}</div>
                        <div className="text-[11px] text-slate-400 truncate">{user?.institution || user?.email}</div>
                      </div>
                    </div>

                    {/* Skills quick pills */}
                    <div className="py-3 border-b border-slate-100">
                      <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                        Skills You Know ({user?.declaredSkills.length || 0})
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {user?.declaredSkills.slice(0, 4).map((s) => (
                          <span
                            key={s.name}
                            className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md text-[10px] font-medium"
                          >
                            {s.name}
                          </span>
                        ))}
                      </div>

                      {user?.skillsWantToLearn && user.skillsWantToLearn.length > 0 && (
                        <div className="mt-2.5">
                          <div className="text-[11px] font-semibold text-violet-600 uppercase tracking-wider mb-1">
                            Skills To Learn ({user.skillsWantToLearn.length})
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {user.skillsWantToLearn.slice(0, 3).map((w) => (
                              <span key={w} className="px-1.5 py-0.5 bg-violet-50 text-violet-700 rounded text-[9px] font-semibold">
                                {w}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Quick menu links */}
                    <div className="pt-2 space-y-1">
                      <button
                        onClick={() => {
                          handleNavClick('dashboard');
                          setShowProfileMenu(false);
                        }}
                        className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-lg"
                      >
                        <span>Dashboard & Applications</span>
                        <span className="text-indigo-600 font-bold">{applications.length}</span>
                      </button>
                      <button
                        onClick={() => {
                          handleNavClick('dashboard');
                          setShowProfileMenu(false);
                        }}
                        className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-lg"
                      >
                        <span>Courses in Progress</span>
                        <span className="text-emerald-600 font-bold">{trackedCourses.length}</span>
                      </button>
                      <button
                        onClick={() => {
                          handleNavClick('admin');
                          setShowProfileMenu(false);
                        }}
                        className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-lg"
                      >
                        <span>Admin Management</span>
                        <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                      </button>

                      <div className="pt-2 border-t border-slate-100">
                        <button
                          onClick={() => {
                            logoutUser();
                            setShowProfileMenu(false);
                          }}
                          className="w-full text-left px-3 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-lg"
                        >
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-lg">
          <form onSubmit={handleSearchSubmit} className="mb-4">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search opportunities or courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm bg-slate-100 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-hidden"
              />
            </div>
          </form>

          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold ${
                currentPage === item.id
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center space-x-3">
                {item.icon}
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-indigo-100 text-indigo-700">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </header>
  );
};
