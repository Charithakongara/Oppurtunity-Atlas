import {
  Hackathon,
  Course,
  UserProfile,
  TrackedApplication,
  TrackedCourse,
  LearningRoadmap,
  SavedHackathonReview,
  HackathonSubmission,
  CoachFeedback,
  NotificationItem
} from '../types/index.ts';

const API_BASE = '/api';

export const api = {
  // Hackathons
  async getHackathons(): Promise<Hackathon[]> {
    const res = await fetch(`${API_BASE}/hackathons`);
    if (!res.ok) throw new Error('Failed to fetch hackathons');
    return res.json();
  },

  async getHackathon(id: string): Promise<Hackathon> {
    const res = await fetch(`${API_BASE}/hackathons/${id}`);
    if (!res.ok) throw new Error('Failed to fetch hackathon');
    return res.json();
  },

  async createHackathon(hackathon: Partial<Hackathon>): Promise<Hackathon> {
    const res = await fetch(`${API_BASE}/hackathons`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(hackathon)
    });
    if (!res.ok) throw new Error('Failed to create hackathon');
    return res.json();
  },

  async updateHackathon(id: string, updates: Partial<Hackathon>): Promise<Hackathon> {
    const res = await fetch(`${API_BASE}/hackathons/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    if (!res.ok) throw new Error('Failed to update hackathon');
    return res.json();
  },

  async deleteHackathon(id: string): Promise<boolean> {
    const res = await fetch(`${API_BASE}/hackathons/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete hackathon');
    return true;
  },

  // Courses
  async getCourses(): Promise<Course[]> {
    const res = await fetch(`${API_BASE}/courses`);
    if (!res.ok) throw new Error('Failed to fetch courses');
    return res.json();
  },

  async getCourse(id: string): Promise<Course> {
    const res = await fetch(`${API_BASE}/courses/${id}`);
    if (!res.ok) throw new Error('Failed to fetch course');
    return res.json();
  },

  async createCourse(course: Partial<Course>): Promise<Course> {
    const res = await fetch(`${API_BASE}/courses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(course)
    });
    if (!res.ok) throw new Error('Failed to create course');
    return res.json();
  },

  async updateCourse(id: string, updates: Partial<Course>): Promise<Course> {
    const res = await fetch(`${API_BASE}/courses/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    if (!res.ok) throw new Error('Failed to update course');
    return res.json();
  },

  async deleteCourse(id: string): Promise<boolean> {
    const res = await fetch(`${API_BASE}/courses/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete course');
    return true;
  },

  // User & Dashboard
  async getUserData(): Promise<{
    user: UserProfile;
    applications: TrackedApplication[];
    trackedCourses: TrackedCourse[];
    roadmaps: LearningRoadmap[];
    reviews: SavedHackathonReview[];
    notifications: NotificationItem[];
  }> {
    const res = await fetch(`${API_BASE}/user`);
    if (!res.ok) throw new Error('Failed to fetch user data');
    return res.json();
  },

  async updateUser(updates: Partial<UserProfile>): Promise<UserProfile> {
    const res = await fetch(`${API_BASE}/user`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    if (!res.ok) throw new Error('Failed to update profile');
    return res.json();
  },

  async setApplication(
    hackathonId: string,
    status: TrackedApplication['status'],
    notes?: string,
    teamName?: string
  ): Promise<TrackedApplication> {
    const res = await fetch(`${API_BASE}/user/applications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ hackathonId, status, notes, teamName })
    });
    if (!res.ok) throw new Error('Failed to update application');
    return res.json();
  },

  async removeApplication(hackathonId: string): Promise<boolean> {
    const res = await fetch(`${API_BASE}/user/applications/${hackathonId}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to remove application');
    return true;
  },

  async trackCourse(
    courseId: string,
    status: TrackedCourse['status'],
    progressPercent: number = 0,
    notes?: string,
    certificateUrl?: string
  ): Promise<TrackedCourse> {
    const res = await fetch(`${API_BASE}/user/courses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ courseId, status, progressPercent, notes, certificateUrl })
    });
    if (!res.ok) throw new Error('Failed to track course');
    return res.json();
  },

  async removeTrackedCourse(courseId: string): Promise<boolean> {
    const res = await fetch(`${API_BASE}/user/courses/${courseId}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to untrack course');
    return true;
  },

  async saveRoadmap(roadmap: Partial<LearningRoadmap>): Promise<LearningRoadmap> {
    const res = await fetch(`${API_BASE}/user/roadmaps`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(roadmap)
    });
    if (!res.ok) throw new Error('Failed to save roadmap');
    return res.json();
  },

  async toggleRoadmapStep(roadmapId: string, stepId: string, completed: boolean): Promise<LearningRoadmap> {
    const res = await fetch(`${API_BASE}/user/roadmaps/${roadmapId}/step`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stepId, completed })
    });
    if (!res.ok) throw new Error('Failed to toggle step');
    return res.json();
  },

  async deleteRoadmap(roadmapId: string): Promise<boolean> {
    const res = await fetch(`${API_BASE}/user/roadmaps/${roadmapId}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete roadmap');
    return true;
  },

  async markNotificationRead(id: string): Promise<boolean> {
    const res = await fetch(`${API_BASE}/user/notifications/${id}/read`, {
      method: 'POST'
    });
    return res.ok;
  },

  // AI Hackathon Coach
  async analyzeHackathon(submission: HackathonSubmission): Promise<{
    reviewId: string;
    feedback: CoachFeedback;
    chatMessages: any[];
  }> {
    const res = await fetch(`${API_BASE}/gemini/analyze-hackathon`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(submission)
    });
    if (!res.ok) throw new Error('Failed to analyze hackathon project');
    return res.json();
  },

  async sendCoachMessage(reviewId: string, message: string): Promise<{ message: any }> {
    const res = await fetch(`${API_BASE}/gemini/coach-chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reviewId, message })
    });
    if (!res.ok) throw new Error('Failed to send coach message');
    return res.json();
  },

  async checkReadiness(hackathonId: string): Promise<{
    readinessScore: number;
    matchedSkills: string[];
    gapSkills: string[];
    prepTimeRecommended: string;
    difficulty: string;
    effort: string;
    recommendedCourses: Course[];
    rationale: string;
  }> {
    const res = await fetch(`${API_BASE}/gemini/readiness-check`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ hackathonId })
    });
    if (!res.ok) throw new Error('Failed to check readiness');
    return res.json();
  },

  async resetDemoData(): Promise<boolean> {
    const res = await fetch(`${API_BASE}/admin/reset`, { method: 'POST' });
    return res.ok;
  }
};
