export enum ExperienceLevel {
  FRESHER = "Fresher (0 Years)",
  EXPERIENCED = "Experienced (1+ Years)",
}

export enum WorkMode {
  REMOTE = "Remote",
  HYBRID = "Hybrid",
  WFH = "Work From Home",
  ON_SITE = "On-site",
}

export interface UserProfile {
  fullName: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  dob: string;
  gender: string;
  linkedIn?: string;
  gitHub?: string;
  portfolio?: string;
  
  // Education
  degree: string;
  specialization: string;
  collegeName: string;
  graduationYear: string;
  certifications: string[];

  // Professional Information
  experienceLevel: ExperienceLevel;
  skills: string[];
  technologies: string[];
  projects: { title: string; description: string; techs: string[] }[];
  workExperience: { company: string; role: string; duration: string; description: string }[];
  currentCompany?: string;
  currentCTC?: string; // in LPA
  expectedCTC: string; // in LPA
  noticePeriod: string; // e.g., "Immediate", "15 days", "30 days", "90 days"
  joiningAvailability: string;
  preferredRole: string;
  preferredLocations: string[];
  willingToRelocate: boolean;
  resumeFileName?: string;
  profileStrengthScore: number; // 0 - 100
  atsBaseScore: number;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salaryRange: string; // e.g., "₹6 - ₹10 LPA"
  experienceRequired: string; // e.g., "0 years / Fresher" or "3+ years"
  skillsRequired: string[];
  description: string;
  applyLink: string;
  postedTime: string; // e.g., "2 hours ago"
  source: string; // e.g., "LinkedIn India", "Naukri", "Internshala"
  workMode: WorkMode;
  companyType: string; // "Startup", "MNC", "Service-based", "Product-based"
  department?: string; // e.g., "Technology", "Medical", "HR", "Finance", "Sales"
}

export interface JobMatchResult {
  job: Job;
  matchScore: number; // 70 to 100
  skillMatch: "Excellent" | "Good" | "Average";
  salaryMatch: "High" | "Medium" | "Low";
  atsCompatibility: "Strong" | "Moderate" | "Weak";
  experienceMatch: boolean;
}

export interface ApplicationTrackerItem {
  id: string;
  job: Job;
  status: "applied" | "pending" | "interview" | "rejected" | "saved";
  appliedDate: string;
  notes?: string;
  coverLetterGenerated?: string;
  timeline: { title: string; date: string; description: string }[];
}

export interface InterviewSession {
  id: string;
  role: string;
  jobDescription?: string;
  type: "HR" | "Technical" | "Behavioral";
  startedAt: string;
  messages: { sender: "user" | "ai"; text: string; time: string }[];
  evaluation?: {
    overallScore: number;
    strengths: string[];
    weaknesses: string[];
    communicationQuality: string; // "Excellent", "Good", "Needs Improvement"
    feedback: string;
    pointsToImprove?: string[];
  };
}

export interface ATSReport {
  beforeScore: number;
  afterScore: number;
  missingKeywords: string[];
  addedKeywords: string[];
  formattingAnalysis: string;
  readabilityFeedback: string;
  optimizedBulletPoints: string[];
}

export interface SubscriptionStatus {
  tier: "Free" | "Weekly" | "Monthly" | "Quarterly";
  trialEndsAt: string; // ISO String
  remainingApplicationsToday: number;
  maxApplicationsPerDay: number;
  applicationsUsedCount: number;
  paymentHistory: { id: string; date: string; amount: number; plan: string; status: string }[];
}

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: "recommendation" | "interview" | "payment" | "ats" | "tracker";
}
