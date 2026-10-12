export type TechDomain =
  | 'AI & Machine Learning'
  | 'Web & Mobile Development'
  | 'Data Science & Analytics'
  | 'Cybersecurity'
  | 'IoT & Robotics'
  | 'Cloud & DevOps'
  | 'Blockchain & Web3'
  | 'Electronics & Embedded'
  | 'Open Innovation & Social Good';

export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced';
export type EffortLevel = 'Low Effort' | 'Medium Effort' | 'High Effort';
export type EventFormat = 'Online' | 'Offline' | 'Hybrid';
export type ApplicationStatus = 'Interested' | 'Preparing' | 'Applied' | 'Participating' | 'Completed';
export type CourseStatus = 'Saved' | 'In Progress' | 'Completed';

export interface Hackathon {
  id: string;
  title: string;
  organizer: string;
  tagline: string;
  description: string;
  domain: TechDomain;
  startDate: string; // ISO
  endDate: string; // ISO
  registrationDeadline: string; // ISO
  location: string;
  format: EventFormat;
  isFree: boolean;
  registrationFee: number;
  currency: string;
  additionalCostsEstimated: string;
  eligibility: string;
  minTeamSize: number;
  maxTeamSize: number;
  requiredSkills: string[];
  prerequisites: string[];
  difficulty: DifficultyLevel;
  difficultySource: 'Opportunity Atlas Estimate' | 'Organizer Rating';
  difficultyRationale: string;
  effort: EffortLevel;
  effortSource: 'Opportunity Atlas Estimate' | 'Organizer Rating';
  effortRationale: string;
  prepTime: string;
  eventDuration: string;
  toolsAndResources: string[];
  prizesAndBenefits: string[];
  officialRegistrationUrl: string;
  lastVerified: string;
  isDemoData: boolean;
  isExpired?: boolean;
  missingDetails?: string[];
}

export type CourseProvider =
  | 'Coursera'
  | 'edX'
  | 'Microsoft Learn'
  | 'freeCodeCamp'
  | 'Cisco Networking Academy'
  | 'Kaggle Learn'
  | 'Official Documentation'
  | 'Google Cloud Skills Boost';

export interface Course {
  id: string;
  title: string;
  provider: CourseProvider;
  domain: TechDomain;
  skillsCovered: string[];
  level: DifficultyLevel;
  prerequisites: string[];
  duration: string;
  weeklyCommitment: string;
  price: number;
  currency: string;
  freeAuditAvailable: boolean;
  certificateIncluded: boolean;
  certificatePrice?: number;
  learningFormat: 'Self-Paced' | 'Instructor-Led' | 'Hands-on Interactive';
  description: string;
  officialUrl: string;
  lastVerified: string;
  rating: number;
  enrolledCount?: string;
  isDemoData: boolean;
}

export interface DeclaredSkill {
  name: string;
  level: DifficultyLevel;
  evidence?: string;
}

export type UserStatus =
  | 'Student'
  | 'Professor / Academic'
  | 'Working Professional'
  | 'Self-Taught Developer'
  | 'Other';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  headline: string;
  bio: string;
  education: string;
  currentStatus: UserStatus;
  institution?: string;
  declaredSkills: DeclaredSkill[];
  skillsWantToLearn: string[];
  interests: TechDomain[];
  maxBudget: number;
  weeklyAvailabilityHours: number;
  isRegistered?: boolean;
}

export interface TrackedApplication {
  hackathonId: string;
  status: ApplicationStatus;
  notes?: string;
  teamName?: string;
  updatedAt: string;
}

export interface TrackedCourse {
  courseId: string;
  status: CourseStatus;
  progressPercent: number;
  certificateUrl?: string;
  notes?: string;
  updatedAt: string;
}

export interface RoadmapStep {
  id: string;
  title: string;
  description: string;
  category: 'Prerequisite' | 'Course' | 'Skill Practice' | 'Project' | 'Skill Test' | 'Opportunity';
  referenceId?: string; // e.g. courseId or hackathonId
  completed: boolean;
  resourceLink?: string;
}

export interface LearningRoadmap {
  id: string;
  title: string;
  goal: string;
  domain: TechDomain;
  createdAt: string;
  prerequisiteKnowledge: string[];
  recommendedCourseIds: string[];
  skillsToPractice: { skill: string; exercise: string; completed: boolean }[];
  practicalProject: {
    title: string;
    description: string;
    deliverable: string;
    completed: boolean;
  };
  demonstrationMethod: string;
  relevantHackathonIds: string[];
  steps: RoadmapStep[];
}

export interface HackathonSubmission {
  hackathonName: string;
  targetMode: 'review_completed' | 'prepare_upcoming';
  problemStatement: string;
  proposedSolution: string;
  projectDescription: string;
  repoUrl?: string;
  demoUrl?: string;
  submissionMaterialsText?: string;
  judgingRubricText?: string;
  judgesFeedback?: string;
  teamRole?: string;
  challengesEncountered?: string;
  selfReflection?: string;
}

export interface CoachEvaluationIssue {
  id: string;
  issue: string;
  evidence: string;
  whyItMatters: string;
  judgingCriterion?: string;
  practicalRecommendation: string;
  priority: 'High' | 'Medium' | 'Low';
  evidenceType: 'Judge Confirmed' | 'Directly Observed' | 'AI Hypothesis';
  skillsToDevelop: string[];
  recommendedCourseIds: string[];
  practiceExercise: string;
}

export interface CoachDimensionScore {
  dimension: string;
  score: number; // 1 to 10
  explanation: string;
}

export interface CoachFeedback {
  summary: string;
  projectTitle?: string;
  dimensions: CoachDimensionScore[];
  strengths: string[];
  issues: CoachEvaluationIssue[];
  followUpQuestions?: string[];
  improvementPlan: {
    top3Priorities: string[];
    skillsToDevelop: string[];
    recommendedCourseIds: string[];
    practiceProject: {
      title: string;
      description: string;
      deliverable: string;
    };
    timelineWeeks: number;
    checklist: { task: string; completed: boolean }[];
    suggestedFutureHackathonTypes: string[];
  };
}

export interface CoachChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface SavedHackathonReview {
  id: string;
  date: string;
  hackathonName: string;
  submission: HackathonSubmission;
  feedback: CoachFeedback;
  chatMessages: CoachChatMessage[];
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  date: string;
  type: 'deadline' | 'course' | 'coach' | 'system';
  link?: string;
  read: boolean;
}
