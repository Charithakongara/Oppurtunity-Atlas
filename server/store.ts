import fs from 'fs';
import path from 'path';
import {
  Hackathon,
  Course,
  UserProfile,
  TrackedApplication,
  TrackedCourse,
  LearningRoadmap,
  SavedHackathonReview,
  NotificationItem
} from '../src/types/index.ts';
import { INITIAL_HACKATHONS, INITIAL_COURSES, INITIAL_USER } from './data/initialData.ts';

interface AppStoreData {
  hackathons: Hackathon[];
  courses: Course[];
  user: UserProfile;
  applications: TrackedApplication[];
  trackedCourses: TrackedCourse[];
  roadmaps: LearningRoadmap[];
  reviews: SavedHackathonReview[];
  notifications: NotificationItem[];
}

const DATA_DIR = path.resolve(process.cwd(), 'server', 'data');
const STORE_FILE = path.join(DATA_DIR, 'store.json');

const INITIAL_APPLICATIONS: TrackedApplication[] = [
  {
    hackathonId: 'hack-amazon-2026',
    status: 'Preparing',
    notes: 'Designing an AWS cloud developer tool and preparing architecture presentation',
    teamName: 'CloudArchitects',
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    hackathonId: 'hack-sih-2026',
    status: 'Interested',
    notes: 'Forming 6-member team with campus peers for Smart India Hackathon internal round',
    updatedAt: new Date(Date.now() - 86400000 * 5).toISOString()
  }
];

const INITIAL_TRACKED_COURSES: TrackedCourse[] = [
  {
    courseId: 'course-03',
    status: 'In Progress',
    progressPercent: 45,
    notes: 'Completed prompt design lab, working on Vertex AI vector search',
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString()
  },
  {
    courseId: 'course-05',
    status: 'Completed',
    progressPercent: 100,
    certificateUrl: 'https://freecodecamp.org/certification/alexchen/responsive-web-design',
    notes: 'Finished 5 responsive projects',
    updatedAt: new Date(Date.now() - 86400000 * 14).toISOString()
  }
];

const INITIAL_ROADMAPS: LearningRoadmap[] = [
  {
    id: 'rdmp-01',
    title: 'Zero to Hackathon Ready: Cloud & AI Prototyping',
    goal: 'Prepare for Amazon Developer Hackathon & SIH 2026',
    domain: 'Cloud & DevOps',
    createdAt: new Date(Date.now() - 86400000 * 6).toISOString(),
    prerequisiteKnowledge: [
      'Basic JavaScript/TypeScript syntax',
      'HTTP requests & async/await principles',
      'JSON payload handling'
    ],
    recommendedCourseIds: ['course-03', 'course-04'],
    skillsToPractice: [
      {
        skill: 'AWS Cloud Services & API integration',
        exercise: 'Deploy a serverless API endpoint and connect to a React frontend',
        completed: true
      },
      {
        skill: 'Streaming responses (SSE)',
        exercise: 'Implement a typewriter-style streaming chatbot component',
        completed: false
      },
      {
        skill: 'Error handling & loading states',
        exercise: 'Add accessible error boundaries and skeleton loaders for slow network responses',
        completed: false
      }
    ],
    practicalProject: {
      title: 'Real-Time Developer Workflow Optimizer',
      description: 'A responsive web application that automates code reviews and dependency health checks with AI assistance.',
      deliverable: 'Deployed web app with GitHub repo and 2-minute demo video',
      completed: false
    },
    demonstrationMethod: 'Publish live demo URL on GitHub Pages/Vercel and submit to Amazon Developer Hackathon',
    relevantHackathonIds: ['hack-amazon-2026', 'hack-sih-2026'],
    steps: [
      {
        id: 's-1',
        title: 'Complete Generative AI for Developers Path',
        description: 'Understand prompt engineering, vector embeddings, and multimodal tokens.',
        category: 'Course',
        referenceId: 'course-03',
        completed: true,
        resourceLink: 'https://www.cloudskillsboost.google/paths/118'
      },
      {
        id: 's-2',
        title: 'Master React & TypeScript Component Architecture',
        description: 'Build a modular component library for forms, inputs, and scorecards.',
        category: 'Skill Practice',
        completed: false
      },
      {
        id: 's-3',
        title: 'Build and Deploy Capstone MVP',
        description: 'Complete the Developer Workflow Optimizer with clean UX and test cases.',
        category: 'Project',
        completed: false
      },
      {
        id: 's-4',
        title: 'Register and Compete in Amazon Developer Hackathon',
        description: 'Submit verified working prototype before the October 23 deadline.',
        category: 'Opportunity',
        referenceId: 'hack-amazon-2026',
        completed: false
      }
    ]
  }
];

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Registration Deadline Approaching',
    message: 'Build, Ship, Shape: Amazon Developer Hackathon closes on October 23, 2026. Submit your project before the deadline.',
    date: new Date(Date.now() - 3600000 * 4).toISOString(),
    type: 'deadline',
    link: '/hackathons/hack-amazon-2026',
    read: false
  },
  {
    id: 'notif-2',
    title: 'Roadmap Milestone Reminder',
    message: 'You are 45% through your "Cloud & AI Prototyping" learning path. Next step: practice streaming responses.',
    date: new Date(Date.now() - 3600000 * 20).toISOString(),
    type: 'course',
    link: '/dashboard',
    read: false
  }
];

class StoreManager {
  private data: AppStoreData;

  constructor() {
    this.data = this.loadData();
  }

  private loadData(): AppStoreData {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(STORE_FILE)) {
        const fileContent = fs.readFileSync(STORE_FILE, 'utf-8');
        const parsed = JSON.parse(fileContent);
        return {
          hackathons: parsed.hackathons || INITIAL_HACKATHONS,
          courses: parsed.courses || INITIAL_COURSES,
          user: parsed.user || INITIAL_USER,
          applications: parsed.applications || INITIAL_APPLICATIONS,
          trackedCourses: parsed.trackedCourses || INITIAL_TRACKED_COURSES,
          roadmaps: parsed.roadmaps || INITIAL_ROADMAPS,
          reviews: parsed.reviews || [],
          notifications: parsed.notifications || INITIAL_NOTIFICATIONS
        };
      }
    } catch (e) {
      console.warn('Failed to read store.json, using fallback defaults:', e);
    }

    const defaultData: AppStoreData = {
      hackathons: INITIAL_HACKATHONS,
      courses: INITIAL_COURSES,
      user: INITIAL_USER,
      applications: INITIAL_APPLICATIONS,
      trackedCourses: INITIAL_TRACKED_COURSES,
      roadmaps: INITIAL_ROADMAPS,
      reviews: [],
      notifications: INITIAL_NOTIFICATIONS
    };

    this.persist(defaultData);
    return defaultData;
  }

  private persist(data: AppStoreData) {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(STORE_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (e) {
      console.error('Error writing to store.json:', e);
    }
  }

  private save() {
    this.persist(this.data);
  }

  // Hackathons
  public getHackathons(): Hackathon[] {
    return this.data.hackathons;
  }

  public getHackathonById(id: string): Hackathon | undefined {
    return this.data.hackathons.find((h) => h.id === id);
  }

  public addHackathon(hackathon: Hackathon): Hackathon {
    this.data.hackathons.unshift(hackathon);
    this.save();
    return hackathon;
  }

  public updateHackathon(id: string, updates: Partial<Hackathon>): Hackathon | undefined {
    const idx = this.data.hackathons.findIndex((h) => h.id === id);
    if (idx === -1) return undefined;
    this.data.hackathons[idx] = { ...this.data.hackathons[idx], ...updates };
    this.save();
    return this.data.hackathons[idx];
  }

  public deleteHackathon(id: string): boolean {
    const initialLen = this.data.hackathons.length;
    this.data.hackathons = this.data.hackathons.filter((h) => h.id !== id);
    if (this.data.hackathons.length !== initialLen) {
      this.save();
      return true;
    }
    return false;
  }

  // Courses
  public getCourses(): Course[] {
    return this.data.courses;
  }

  public getCourseById(id: string): Course | undefined {
    return this.data.courses.find((c) => c.id === id);
  }

  public addCourse(course: Course): Course {
    this.data.courses.unshift(course);
    this.save();
    return course;
  }

  public updateCourse(id: string, updates: Partial<Course>): Course | undefined {
    const idx = this.data.courses.findIndex((c) => c.id === id);
    if (idx === -1) return undefined;
    this.data.courses[idx] = { ...this.data.courses[idx], ...updates };
    this.save();
    return this.data.courses[idx];
  }

  public deleteCourse(id: string): boolean {
    const initialLen = this.data.courses.length;
    this.data.courses = this.data.courses.filter((c) => c.id !== id);
    if (this.data.courses.length !== initialLen) {
      this.save();
      return true;
    }
    return false;
  }

  // User Profile
  public getUser(): UserProfile {
    return this.data.user;
  }

  public updateUser(updates: Partial<UserProfile>): UserProfile {
    this.data.user = { ...this.data.user, ...updates };
    this.save();
    return this.data.user;
  }

  // Applications
  public getApplications(): TrackedApplication[] {
    return this.data.applications;
  }

  public setApplicationStatus(
    hackathonId: string,
    status: TrackedApplication['status'],
    notes?: string,
    teamName?: string
  ): TrackedApplication {
    const idx = this.data.applications.findIndex((a) => a.hackathonId === hackathonId);
    const updated: TrackedApplication = {
      hackathonId,
      status,
      notes: notes ?? (idx !== -1 ? this.data.applications[idx].notes : undefined),
      teamName: teamName ?? (idx !== -1 ? this.data.applications[idx].teamName : undefined),
      updatedAt: new Date().toISOString()
    };

    if (idx !== -1) {
      this.data.applications[idx] = updated;
    } else {
      this.data.applications.push(updated);
    }
    this.save();
    return updated;
  }

  public removeApplication(hackathonId: string): boolean {
    const initialLen = this.data.applications.length;
    this.data.applications = this.data.applications.filter((a) => a.hackathonId !== hackathonId);
    if (this.data.applications.length !== initialLen) {
      this.save();
      return true;
    }
    return false;
  }

  // Tracked Courses
  public getTrackedCourses(): TrackedCourse[] {
    return this.data.trackedCourses;
  }

  public setCourseProgress(
    courseId: string,
    status: TrackedCourse['status'],
    progressPercent: number = 0,
    notes?: string,
    certificateUrl?: string
  ): TrackedCourse {
    const idx = this.data.trackedCourses.findIndex((c) => c.courseId === courseId);
    const updated: TrackedCourse = {
      courseId,
      status,
      progressPercent,
      notes: notes ?? (idx !== -1 ? this.data.trackedCourses[idx].notes : undefined),
      certificateUrl: certificateUrl ?? (idx !== -1 ? this.data.trackedCourses[idx].certificateUrl : undefined),
      updatedAt: new Date().toISOString()
    };

    if (idx !== -1) {
      this.data.trackedCourses[idx] = updated;
    } else {
      this.data.trackedCourses.push(updated);
    }
    this.save();
    return updated;
  }

  public removeTrackedCourse(courseId: string): boolean {
    const initialLen = this.data.trackedCourses.length;
    this.data.trackedCourses = this.data.trackedCourses.filter((c) => c.courseId !== courseId);
    if (this.data.trackedCourses.length !== initialLen) {
      this.save();
      return true;
    }
    return false;
  }

  // Roadmaps
  public getRoadmaps(): LearningRoadmap[] {
    return this.data.roadmaps;
  }

  public addRoadmap(roadmap: LearningRoadmap): LearningRoadmap {
    this.data.roadmaps.unshift(roadmap);
    this.save();
    return roadmap;
  }

  public updateRoadmapStep(roadmapId: string, stepId: string, completed: boolean): LearningRoadmap | undefined {
    const roadmap = this.data.roadmaps.find((r) => r.id === roadmapId);
    if (!roadmap) return undefined;
    const step = roadmap.steps.find((s) => s.id === stepId);
    if (step) {
      step.completed = completed;
      this.save();
    }
    return roadmap;
  }

  public deleteRoadmap(id: string): boolean {
    const initialLen = this.data.roadmaps.length;
    this.data.roadmaps = this.data.roadmaps.filter((r) => r.id !== id);
    if (this.data.roadmaps.length !== initialLen) {
      this.save();
      return true;
    }
    return false;
  }

  // Reviews
  public getReviews(): SavedHackathonReview[] {
    return this.data.reviews;
  }

  public addReview(review: SavedHackathonReview): SavedHackathonReview {
    this.data.reviews.unshift(review);
    this.save();
    return review;
  }

  public appendChatMessage(reviewId: string, message: { id: string; role: 'user' | 'assistant'; content: string; timestamp: string }) {
    const review = this.data.reviews.find((r) => r.id === reviewId);
    if (review) {
      if (!review.chatMessages) review.chatMessages = [];
      review.chatMessages.push(message);
      this.save();
    }
  }

  // Notifications
  public getNotifications(): NotificationItem[] {
    return this.data.notifications;
  }

  public markNotificationRead(id: string): boolean {
    const notif = this.data.notifications.find((n) => n.id === id);
    if (notif) {
      notif.read = true;
      this.save();
      return true;
    }
    return false;
  }

  // Reset to initial
  public resetToDefault() {
    this.data = {
      hackathons: INITIAL_HACKATHONS,
      courses: INITIAL_COURSES,
      user: INITIAL_USER,
      applications: INITIAL_APPLICATIONS,
      trackedCourses: INITIAL_TRACKED_COURSES,
      roadmaps: INITIAL_ROADMAPS,
      reviews: [],
      notifications: INITIAL_NOTIFICATIONS
    };
    this.save();
  }
}

export const store = new StoreManager();
