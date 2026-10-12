import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  Hackathon,
  Course,
  UserProfile,
  TrackedApplication,
  TrackedCourse,
  LearningRoadmap,
  SavedHackathonReview,
  NotificationItem,
  HackathonSubmission,
  CoachFeedback
} from '../types/index.ts';
import { api } from '../services/api.ts';

export type AppPage = 'home' | 'hackathons' | 'courses' | 'coach' | 'dashboard' | 'admin';

interface AppContextType {
  currentPage: AppPage;
  setCurrentPage: (page: AppPage) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  hackathons: Hackathon[];
  courses: Course[];
  user: UserProfile | null;
  applications: TrackedApplication[];
  trackedCourses: TrackedCourse[];
  roadmaps: LearningRoadmap[];
  reviews: SavedHackathonReview[];
  notifications: NotificationItem[];
  selectedHackathonId: string | null;
  setSelectedHackathonId: (id: string | null) => void;
  selectedCourseId: string | null;
  setSelectedCourseId: (id: string | null) => void;
  activeCoachReview: SavedHackathonReview | null;
  setActiveCoachReview: (review: SavedHackathonReview | null) => void;
  loading: boolean;
  refreshData: () => Promise<void>;
  
  // Auth & Guest Interaction Tracking
  isLoggedIn: boolean;
  guestUsageCount: number;
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;
  recordInteraction: (actionName?: string) => void;
  registerUser: (profile: Partial<UserProfile>) => Promise<void>;
  loginUser: (email: string, name: string) => Promise<void>;
  logoutUser: () => void;

  // User Actions
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<void>;
  setApplicationStatus: (
    hackathonId: string,
    status: TrackedApplication['status'],
    notes?: string,
    teamName?: string
  ) => Promise<void>;
  removeApplication: (hackathonId: string) => Promise<void>;
  setCourseProgress: (
    courseId: string,
    status: TrackedCourse['status'],
    progressPercent?: number,
    notes?: string,
    certUrl?: string
  ) => Promise<void>;
  removeCourseProgress: (courseId: string) => Promise<void>;
  saveRoadmap: (roadmap: Partial<LearningRoadmap>) => Promise<LearningRoadmap>;
  toggleRoadmapStep: (roadmapId: string, stepId: string, completed: boolean) => Promise<void>;
  deleteRoadmap: (roadmapId: string) => Promise<void>;
  markNotificationRead: (id: string) => Promise<void>;
  
  // AI Coach Actions
  runHackathonAnalysis: (submission: HackathonSubmission) => Promise<{
    reviewId: string;
    feedback: CoachFeedback;
    chatMessages: any[];
  }>;
  sendCoachChatMessage: (reviewId: string, message: string) => Promise<void>;
  
  // Admin Actions
  createHackathon: (data: Partial<Hackathon>) => Promise<Hackathon>;
  updateHackathon: (id: string, data: Partial<Hackathon>) => Promise<Hackathon>;
  deleteHackathon: (id: string) => Promise<void>;
  createCourse: (data: Partial<Course>) => Promise<Course>;
  updateCourse: (id: string, data: Partial<Course>) => Promise<Course>;
  deleteCourse: (id: string) => Promise<void>;
  resetAllData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState<AppPage>('home');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [applications, setApplications] = useState<TrackedApplication[]>([]);
  const [trackedCourses, setTrackedCourses] = useState<TrackedCourse[]>([]);
  const [roadmaps, setRoadmaps] = useState<LearningRoadmap[]>([]);
  const [reviews, setReviews] = useState<SavedHackathonReview[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [selectedHackathonId, setSelectedHackathonId] = useState<string | null>(null);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [activeCoachReview, setActiveCoachReview] = useState<SavedHackathonReview | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Authentication & Guest Gate States
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('oa_logged_in') === 'true';
  });
  const [guestUsageCount, setGuestUsageCount] = useState<number>(() => {
    const val = localStorage.getItem('oa_guest_count');
    return val ? parseInt(val, 10) : 0;
  });
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);

  const refreshData = useCallback(async () => {
    try {
      setLoading(true);
      const [hacks, crs, userData] = await Promise.all([
        api.getHackathons(),
        api.getCourses(),
        api.getUserData()
      ]);
      setHackathons(hacks);
      setCourses(crs);
      setUser(userData.user);
      setApplications(userData.applications);
      setTrackedCourses(userData.trackedCourses);
      setRoadmaps(userData.roadmaps);
      setReviews(userData.reviews);
      setNotifications(userData.notifications);

      if (userData.reviews && userData.reviews.length > 0 && !activeCoachReview) {
        setActiveCoachReview(userData.reviews[0]);
      }
    } catch (err) {
      console.error('Failed to load application data:', err);
    } finally {
      setLoading(false);
    }
  }, [activeCoachReview]);

  useEffect(() => {
    refreshData();
  }, []);

  // Guest interaction counter rule: After 2 interactions, lock and require login
  const recordInteraction = useCallback((actionName?: string) => {
    if (isLoggedIn) return; // Unrestricted for authenticated users

    setGuestUsageCount((prev) => {
      const newCount = prev + 1;
      localStorage.setItem('oa_guest_count', newCount.toString());
      if (newCount >= 2) {
        setShowAuthModal(true);
      }
      return newCount;
    });
  }, [isLoggedIn]);

  const registerUser = async (profileUpdates: Partial<UserProfile>) => {
    const updated = await api.updateUser({
      ...profileUpdates,
      isRegistered: true
    });
    setUser(updated);
    setIsLoggedIn(true);
    localStorage.setItem('oa_logged_in', 'true');
    setShowAuthModal(false);
  };

  const loginUser = async (email: string, name: string) => {
    const updated = await api.updateUser({
      email,
      name,
      isRegistered: true
    });
    setUser(updated);
    setIsLoggedIn(true);
    localStorage.setItem('oa_logged_in', 'true');
    setShowAuthModal(false);
  };

  const logoutUser = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('oa_logged_in');
    localStorage.setItem('oa_guest_count', '0');
    setGuestUsageCount(0);
  };

  const updateUserProfile = async (updates: Partial<UserProfile>) => {
    const updated = await api.updateUser(updates);
    setUser(updated);
  };

  const setApplicationStatus = async (
    hackathonId: string,
    status: TrackedApplication['status'],
    notes?: string,
    teamName?: string
  ) => {
    recordInteraction('save_application');
    const updated = await api.setApplication(hackathonId, status, notes, teamName);
    setApplications((prev) => {
      const idx = prev.findIndex((a) => a.hackathonId === hackathonId);
      if (idx !== -1) {
        const copy = [...prev];
        copy[idx] = updated;
        return copy;
      }
      return [...prev, updated];
    });
  };

  const removeApplication = async (hackathonId: string) => {
    await api.removeApplication(hackathonId);
    setApplications((prev) => prev.filter((a) => a.hackathonId !== hackathonId));
  };

  const setCourseProgress = async (
    courseId: string,
    status: TrackedCourse['status'],
    progressPercent: number = 0,
    notes?: string,
    certUrl?: string
  ) => {
    recordInteraction('save_course');
    const updated = await api.trackCourse(courseId, status, progressPercent, notes, certUrl);
    setTrackedCourses((prev) => {
      const idx = prev.findIndex((c) => c.courseId === courseId);
      if (idx !== -1) {
        const copy = [...prev];
        copy[idx] = updated;
        return copy;
      }
      return [...prev, updated];
    });
  };

  const removeCourseProgress = async (courseId: string) => {
    await api.removeTrackedCourse(courseId);
    setTrackedCourses((prev) => prev.filter((c) => c.courseId !== courseId));
  };

  const saveRoadmap = async (roadmap: Partial<LearningRoadmap>): Promise<LearningRoadmap> => {
    recordInteraction('save_roadmap');
    const created = await api.saveRoadmap(roadmap);
    setRoadmaps((prev) => [created, ...prev]);
    return created;
  };

  const toggleRoadmapStep = async (roadmapId: string, stepId: string, completed: boolean) => {
    const updated = await api.toggleRoadmapStep(roadmapId, stepId, completed);
    setRoadmaps((prev) => prev.map((r) => (r.id === roadmapId ? updated : r)));
  };

  const deleteRoadmap = async (roadmapId: string) => {
    await api.deleteRoadmap(roadmapId);
    setRoadmaps((prev) => prev.filter((r) => r.id !== roadmapId));
  };

  const markNotificationRead = async (id: string) => {
    await api.markNotificationRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const runHackathonAnalysis = async (submission: HackathonSubmission) => {
    recordInteraction('run_analysis');
    const res = await api.analyzeHackathon(submission);
    const newReview: SavedHackathonReview = {
      id: res.reviewId,
      date: new Date().toISOString(),
      hackathonName: submission.hackathonName,
      submission,
      feedback: res.feedback,
      chatMessages: res.chatMessages
    };
    setReviews((prev) => [newReview, ...prev]);
    setActiveCoachReview(newReview);
    return res;
  };

  const sendCoachChatMessage = async (reviewId: string, message: string) => {
    const res = await api.sendCoachMessage(reviewId, message);
    setReviews((prev) =>
      prev.map((r) => {
        if (r.id === reviewId) {
          const userMsg = {
            id: `usr-${Date.now()}`,
            role: 'user' as const,
            content: message,
            timestamp: new Date().toISOString()
          };
          const updatedChat = [...(r.chatMessages || []), userMsg, res.message];
          const updatedReview = { ...r, chatMessages: updatedChat };
          if (activeCoachReview?.id === reviewId) {
            setActiveCoachReview(updatedReview);
          }
          return updatedReview;
        }
        return r;
      })
    );
  };

  const createHackathon = async (data: Partial<Hackathon>) => {
    const created = await api.createHackathon(data);
    setHackathons((prev) => [created, ...prev]);
    return created;
  };

  const updateHackathon = async (id: string, data: Partial<Hackathon>) => {
    const updated = await api.updateHackathon(id, data);
    setHackathons((prev) => prev.map((h) => (h.id === id ? updated : h)));
    return updated;
  };

  const deleteHackathon = async (id: string) => {
    await api.deleteHackathon(id);
    setHackathons((prev) => prev.filter((h) => h.id !== id));
  };

  const createCourse = async (data: Partial<Course>) => {
    const created = await api.createCourse(data);
    setCourses((prev) => [created, ...prev]);
    return created;
  };

  const updateCourse = async (id: string, data: Partial<Course>) => {
    const updated = await api.updateCourse(id, data);
    setCourses((prev) => prev.map((c) => (c.id === id ? updated : c)));
    return updated;
  };

  const deleteCourse = async (id: string) => {
    await api.deleteCourse(id);
    setCourses((prev) => prev.filter((c) => c.id !== id));
  };

  const resetAllData = async () => {
    await api.resetDemoData();
    await refreshData();
  };

  return (
    <AppContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        searchQuery,
        setSearchQuery,
        hackathons,
        courses,
        user,
        applications,
        trackedCourses,
        roadmaps,
        reviews,
        notifications,
        selectedHackathonId,
        setSelectedHackathonId,
        selectedCourseId,
        setSelectedCourseId,
        activeCoachReview,
        setActiveCoachReview,
        loading,
        refreshData,
        isLoggedIn,
        guestUsageCount,
        showAuthModal,
        setShowAuthModal,
        recordInteraction,
        registerUser,
        loginUser,
        logoutUser,
        updateUserProfile,
        setApplicationStatus,
        removeApplication,
        setCourseProgress,
        removeCourseProgress,
        saveRoadmap,
        toggleRoadmapStep,
        deleteRoadmap,
        markNotificationRead,
        runHackathonAnalysis,
        sendCoachChatMessage,
        createHackathon,
        updateHackathon,
        deleteHackathon,
        createCourse,
        updateCourse,
        deleteCourse,
        resetAllData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
