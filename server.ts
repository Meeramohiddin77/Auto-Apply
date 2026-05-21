import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import { ExperienceLevel, WorkMode, UserProfile, Job, JobMatchResult, ApplicationTrackerItem, InterviewSession, ATSReport, SubscriptionStatus, SystemNotification } from "./src/types.js";

// Load environment variables
dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Initialize Google GenAI client lazily or with absolute safety fallback
let ai: GoogleGenAI | null = null;
const API_KEY = process.env.GEMINI_API_KEY;

function getAIClient(): GoogleGenAI | null {
  if (!ai && API_KEY && API_KEY !== "MY_GEMINI_API_KEY") {
    try {
      ai = new GoogleGenAI({
        apiKey: API_KEY,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
      console.log("Gemini AI Client initialized successfully.");
    } catch (err) {
      console.error("Failed to initialize Gemini AI Client:", err);
    }
  }
  return ai;
}

// ==========================================
// IN-MEMORY COMPREHENSIVE DATA BASE STATE
// ==========================================

// Global state variables
let userProfile: UserProfile = {
  fullName: "Arjun Sharma",
  email: "arjun.sharma@gmail.com",
  phone: "+91 98765 43210",
  city: "Bengaluru",
  state: "Karnataka",
  dob: "2003-04-12",
  gender: "Male",
  linkedIn: "https://linkedin.com/in/arjun-sharma-dev",
  gitHub: "https://github.com/arjun-sharma",
  portfolio: "https://arjunsharma.dev",
  
  degree: "B.Tech in Computer Science",
  specialization: "Software Engineering",
  collegeName: "Vellore Institute of Technology (VIT)",
  graduationYear: "2024",
  certifications: ["AWS Certified Developer Associate", "Google UX Design Professional Certificate"],
  
  experienceLevel: ExperienceLevel.FRESHER,
  skills: ["React", "TypeScript", "Tailwind CSS", "Node.js", "Express", "MongoDB", "Data Structures"],
  technologies: ["Vite", "Next.js", "PostgreSQL", "Git", "Docker", "Postman", "Figma"],
  projects: [
    {
      title: "IndiCart - Indian Artisan E-commerce Platform",
      description: "A full-fledged localized platform where rural Indian artisans can register and sell handlooms. Developed matching filter and secure payment checkout screens.",
      techs: ["React", "Node.js", "MongoDB", "Tailwind CSS"]
    },
    {
      title: "Bhojan - Smart Wasted Food Distributor",
      description: "Android & Web tracker that maps excess wedding hall food to charity kitchens in major urban cities including Chennai and Bangalore, with ETA charts.",
      techs: ["TypeScript", "Next.js", "PostgreSQL", "Tailwind"]
    }
  ],
  workExperience: [], // Freshers start empty
  expectedCTC: "8", // 8 LPA
  noticePeriod: "Immediate",
  joiningAvailability: "Immediate / Within 1 week",
  preferredRole: "Frontend Developer",
  preferredLocations: ["Bengaluru", "Hyderabad", "Pune"],
  willingToRelocate: true,
  resumeFileName: "Arjun_Sharma_CS_Resume.pdf",
  profileStrengthScore: 78,
  atsBaseScore: 71
};

// Mock Jobs Database for Indian Tech landscape
let jobsDatabase: Job[] = [
  {
    id: "job-1",
    title: "Junior Frontend Engineer",
    company: "Razorpay",
    location: "Bengaluru, Karnataka",
    salaryRange: "₹8 - ₹12 LPA",
    experienceRequired: "0 - 2 years",
    skillsRequired: ["React", "TypeScript", "Tailwind CSS", "REST APIs", "Git"],
    description: "Join the core checkout engineering team at Razorpay. Build high-performance component micro-frontends serving millions of transactions daily across India. Excellent design-to-code skills and understanding of state machines are key.",
    applyLink: "https://razorpay.com/careers/junior-frontend",
    postedTime: "2 hours ago",
    source: "startup hiring portals",
    workMode: WorkMode.HYBRID,
    companyType: "Product-based",
    department: "Technology"
  },
  {
    id: "job-2",
    title: "Software Engineering Intern (MERN Stack)",
    company: "Zomato",
    location: "Gurugram, Haryana",
    salaryRange: "₹4 - ₹6 LPA",
    experienceRequired: "0 years / Fresher",
    skillsRequired: ["React", "Node.js", "Express", "MongoDB", "Tailwind CSS"],
    description: "Looking for an enthusiastic fresher to help us refine backend order streams and interactive dashboard components for Zomato Delivery partners in tier-2 cities. High-growth opportunity.",
    applyLink: "https://zomato.com/careers/intern-mern",
    postedTime: "1 day ago",
    source: "Internshala",
    workMode: WorkMode.ON_SITE,
    companyType: "Product-based",
    department: "Technology"
  },
  {
    id: "job-3",
    title: "Associate React Engineer",
    company: "Tata Consultancy Services (TCS)",
    location: "Hyderabad, Telangana",
    salaryRange: "₹4.5 - ₹7 LPA",
    experienceRequired: "0 - 1 years",
    skillsRequired: ["React", "JavaScript", "HTML5", "CSS3", "Data Structures"],
    description: "TCS is seeking talented freshers with structured B.Tech training to contribute to digital banking migration pipelines for a tier-1 Indian enterprise partner. Involves accessibility optimizations. This listing uses Workday for applicant tracking.",
    applyLink: "https://careers.tcs.com/react-associate",
    postedTime: "3 hours ago",
    source: "Naukri",
    workMode: WorkMode.ON_SITE,
    companyType: "Service-based",
    department: "Technology"
  },
  {
    id: "job-4",
    title: "React Native Developer",
    company: "CRED",
    location: "Bengaluru, Karnataka",
    salaryRange: "₹18 - ₹25 LPA",
    experienceRequired: "2 - 4 years",
    skillsRequired: ["React Native", "React", "TypeScript", "Redux", "Node.js"],
    description: "Engineers on this team drive delightful, liquid-smooth card animations across iOS and Android on the CRED application. Work extensively with low-latency device bridging. Greenhouse platform integration is active for CV safety.",
    applyLink: "https://cred.club/careers/react-native",
    postedTime: "3 days ago",
    source: "LinkedIn India",
    workMode: WorkMode.HYBRID,
    companyType: "Product-based",
    department: "Technology"
  },
  {
    id: "job-5",
    title: "Full Stack Engineer (SaaS focus)",
    company: "Freshworks",
    location: "Chennai, Tamil Nadu",
    salaryRange: "₹12 - ₹18 LPA",
    experienceRequired: "1 - 3 years",
    skillsRequired: ["React", "TypeScript", "Node.js", "PostgreSQL", "Docker"],
    description: "Freshworks makes service software pleasant for customer champions worldwide. You will enhance custom modules, optimize relational indexing schemes, and handle direct integrations. Lever ATS portal manages candidate response files.",
    applyLink: "https://freshworks.com/careers/full-stack-saas",
    postedTime: "5 days ago",
    source: "Naukri",
    workMode: WorkMode.REMOTE,
    companyType: "Product-based",
    department: "Technology"
  },
  {
    id: "job-6",
    title: "Software Engineer - Frontend",
    company: "Paytm",
    location: "Noida, Uttar Pradesh",
    salaryRange: "₹9 - ₹14 LPA",
    experienceRequired: "1 - 3 years",
    skillsRequired: ["React", "TypeScript", "Redux", "Tailwind CSS", "Webpack"],
    description: "Work on core merchant dashboard pages. Create responsive metric cards holding financial analysis and monthly payout reconciliation data grids. Fast-paced delivery schedules.",
    applyLink: "https://careers.paytm.com/fe-engineer",
    postedTime: "12 hours ago",
    source: "LinkedIn India",
    workMode: WorkMode.HYBRID,
    companyType: "Product-based",
    department: "Technology"
  },
  {
    id: "job-7",
    title: "Graduate Engineer Trainee (GET)",
    company: "Infosys",
    location: "Pune, Maharashtra",
    salaryRange: "₹3.6 - ₹5 LPA",
    experienceRequired: "0 years / Fresher",
    skillsRequired: ["JavaScript", "HTML5", "SQL", "Problem Solving"],
    description: "Join the world-class Mysore training cohort prior to project placement. Perfect for graduating batch with a knack for systematic analytical deduction and standard web fundamentals.",
    applyLink: "https://infosys.com/careers/get-pune",
    postedTime: "2 days ago",
    source: "Naukri",
    workMode: WorkMode.ON_SITE,
    companyType: "Service-based",
    department: "Technology"
  },
  {
    id: "job-8",
    title: "Junior Backend Developer",
    company: "Zerodha",
    location: "Bengaluru, Karnataka",
    salaryRange: "₹14 - ₹20 LPA",
    experienceRequired: "0 - 2 years",
    skillsRequired: ["Go", "Node.js", "PostgreSQL", "Redis", "TypeScript"],
    description: "Help build and optimize high-throughput trading submenus. You will work on trade-tick processing, cached storage structures, and scaling ledger lookups.",
    applyLink: "https://careers.zerodha.com/backend-developer",
    postedTime: "4 days ago",
    source: "Wellfound",
    workMode: WorkMode.HYBRID,
    companyType: "Product-based",
    department: "Technology"
  },
  {
    id: "job-9",
    title: "Frontend Development Trainee",
    company: "Tech Mahindra",
    location: "Kochi, Kerala",
    salaryRange: "₹3.2 - ₹4.5 LPA",
    experienceRequired: "0 years / Fresher",
    skillsRequired: ["HTML5", "CSS3", "JavaScript", "React Basic"],
    description: "Great entry level trainee role. Assist in updating responsive user interfaces and cleaning cross-browser markup rendering anomalies under a senior engineering mentor.",
    applyLink: "https://techmahindra.com/kochi-trainee",
    postedTime: "1 week ago",
    source: "Internshala",
    workMode: WorkMode.ON_SITE,
    companyType: "Service-based",
    department: "Technology"
  },
  {
    id: "job-10",
    title: "Chief Resident Pediatrician",
    company: "Apollo Hospitals",
    location: "Bengaluru, Karnataka",
    salaryRange: "₹18 - ₹26 LPA",
    experienceRequired: "2 - 5 years",
    skillsRequired: ["Pediatrics", "Neonatal Care", "Clinical Diagnostics", "Patient Protocols", "Emergency Medicine"],
    description: "Lead pediatric clinical diagnostics and patient care rounds at Apollo Bengaluru. Perfect for practitioners seeking dedicated, high-impact clinical ownership with leading Indian medical workflows.",
    applyLink: "https://www.apollohospitals.com/careers/pediatrics-resident",
    postedTime: "1 hour ago",
    source: "Naukri",
    workMode: WorkMode.ON_SITE,
    companyType: "Product-based",
    department: "Medical"
  },
  {
    id: "job-11",
    title: "Registered Staff Nurse (ICU Ward)",
    company: "Fortis Healthcare",
    location: "Mumbai, Maharashtra",
    salaryRange: "₹5 - ₹8 LPA",
    experienceRequired: "1 - 3 years",
    skillsRequired: ["Critical Care", "Patient Monitoring", "Emergency Protocols", "IV Administration", "Hospital Management"],
    description: "Excellent role for certified nursing freshers or experienced practitioners. Direct the critical ICU ward patient monitoring checklists under leading clinical heads. Uses standard Fortis patient portals.",
    applyLink: "https://www.fortishealthcare.com/careers/staff-nurse",
    postedTime: "2 days ago",
    source: "LinkedIn India",
    workMode: WorkMode.ON_SITE,
    companyType: "Service-based",
    department: "Medical"
  },
  {
    id: "job-12",
    title: "Medical Lab Technologist",
    company: "Dr Lal PathLabs",
    location: "Delhi, Delhi",
    salaryRange: "₹3.5 - ₹5 LPA",
    experienceRequired: "0 - 1 years / Fresher",
    skillsRequired: ["Pathology", "Hematology", "Sample Collection", "NABL compliance", "Biomedical Waste Management"],
    description: "Manage medical diagnostic pathology lines and sample validation pipelines conforming to NABL credentials. Entry level trainees or freshers highly valued.",
    applyLink: "https://www.lalpathlabs.com/careers/lab-tech",
    postedTime: "3 hours ago",
    source: "Naukri",
    workMode: WorkMode.ON_SITE,
    companyType: "Service-based",
    department: "Medical"
  },
  {
    id: "job-13",
    title: "Senior HR Manager (People & Culture)",
    company: "Razorpay",
    location: "Bengaluru, Karnataka",
    salaryRange: "₹15 - ₹22 LPA",
    experienceRequired: "3 - 6 years",
    skillsRequired: ["Employee Engagement", "Strategic HR", "Talent Acquisition", "Indian Labor Laws", "Compensation & Benefits"],
    description: "Elevate team performance and work culture across Razorpay Checkout teams. Direct complex onboarding pipelines, manage strategic conflict resolution programs, and draft internal policy handbooks.",
    applyLink: "https://razorpay.com/careers/hr-manager",
    postedTime: "5 hours ago",
    source: "startup hiring portals",
    workMode: WorkMode.HYBRID,
    companyType: "Product-based",
    department: "HR"
  },
  {
    id: "job-14",
    title: "Talent Acquisition Recruiter",
    company: "Wipro",
    location: "Pune, Maharashtra",
    salaryRange: "₹4.5 - ₹7.5 LPA",
    experienceRequired: "1 - 3 years",
    skillsRequired: ["Sourcing", "Initial Screening", "Applicant Tracking Systems", "LinkedIn Recruiter", "Interview Coordination"],
    description: "Join the technical staffing team at Wipro Pune. Sourcing SDE freshers for digital banking migration campaigns. Workday ATS is configured for candidate file indexing.",
    applyLink: "https://careers.wipro.com/technical-recruiter",
    postedTime: "4 hours ago",
    source: "Naukri",
    workMode: WorkMode.HYBRID,
    department: "HR",
    companyType: "Service-based"
  },
  {
    id: "job-15",
    title: "HR Analyst (Compensation & Benefits)",
    company: "Tata Consultancy Services (TCS)",
    location: "Hyderabad, Telangana",
    salaryRange: "₹6 - ₹9.5 LPA",
    experienceRequired: "2 - 4 years",
    skillsRequired: ["Payroll Management", "Compensation Structures", "Excel Modeling", "Employee Retention", "HR Analytics"],
    description: "Direct payroll modeling and corporate compensation structures at TCS India. Align benefits schemes with statutory compliance and tax exemptions.",
    applyLink: "https://careers.tcs.com/hr-analyst",
    postedTime: "1 day ago",
    source: "Naukri",
    workMode: WorkMode.ON_SITE,
    companyType: "Service-based",
    department: "HR"
  }
];

// Tracking application items
let trackerItems: ApplicationTrackerItem[] = [
  {
    id: "track-1",
    job: jobsDatabase[0], // Razorpay
    status: "applied",
    appliedDate: "2026-05-20",
    notes: "Applied with optimized resume highlighting payment flows and React certifications.",
    coverLetterGenerated: "Dear Hiring Team at Razorpay,\n\nI am thrilled to apply for the Junior Frontend Engineer opening. Having developed e-commerce components customized for local Indian scale and specialized in AWS Certified integrations, I possess deep alignment with Razorpay's high-performance engineering standards...",
    timeline: [
      { title: "Application Drafted", date: "2026-05-19", description: "AI mapped profile, validated certifications and created custom cover letter." },
      { title: "Application Approved", date: "2026-05-20", description: "Submitted and marked as applied. Assisted autofill complete." }
    ]
  },
  {
    id: "track-2",
    job: jobsDatabase[2], // TCS
    status: "interview",
    appliedDate: "2026-05-18",
    notes: "TCS recruiter highlighted outstanding score on standard React tests. Interview schedule in setup.",
    coverLetterGenerated: "",
    timeline: [
      { title: "Application Sent", date: "2026-05-18", description: "Successfully targeted position using TCS fresher drive portals." },
      { title: "Resume Shortlisted", date: "2026-05-19", description: "ATS matching scored a solid 88% resulting in direct automated fast-track." },
      { title: "Technical Round Scheduled", date: "2026-05-21", description: "HR sent invite link for standard Technical & Coding evaluation." }
    ]
  }
];

// Mock Interview Session Storage
let interviewSessions: InterviewSession[] = [];

// System Subscription Control
let subscriptionStatus: SubscriptionStatus = {
  tier: "Free",
  trialEndsAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days trial
  remainingApplicationsToday: 2,
  maxApplicationsPerDay: 2,
  applicationsUsedCount: 1,
  paymentHistory: [
    { id: "pay-0", date: "2026-05-21", amount: 0, plan: "Free Trial Bootstrapped", status: "Successful" }
  ]
};

// Admin metrics tracking log
let adminLogs = [
  { time: "10:11:02", action: "User Registration", desc: "Arjun Sharma registered from Bengaluru IP." },
  { time: "10:12:45", action: "Resume Parsed", desc: "Engine parsed Arjun_Sharma_CS_Resume.pdf cleanly via Gemini." },
  { time: "10:14:12", action: "Job Autofill Run", desc: "User initiated assisted apply for Razorpay position." }
];

// Mock alerts & notifications
let systemNotifications: SystemNotification[] = [
  {
    id: "notif-1",
    title: "⚡ Excellent Job Match Alert",
    message: "Razorpay published 'Junior Frontend Engineer' which matches 92% of your profile. Apply now!",
    time: "2 hours ago",
    read: false,
    type: "recommendation"
  },
  {
    id: "notif-2",
    title: "📅 Technical Interview Scheduled",
    message: "Your interview with Tata Consultancy Services has been scheduled for tomorrow at 2:00 PM.",
    time: "3 hours ago",
    read: false,
    type: "interview"
  },
  {
    id: "notif-3",
    title: "🎉 Payment Confirmed",
    message: "Welcome to AI Job Copilot free daily allowance. 2 applications active.",
    time: "6 hours ago",
    read: true,
    type: "payment"
  }
];

// Helper: Calculate match score algorithm on the backend
function calculateJobCompatibility(profile: UserProfile, job: Job): JobMatchResult {
  let score = 70; // baseline
  let hits = 0;
  
  // 1. Skill hits
  const skillsSet = new Set(profile.skills.map(s => s.toLowerCase()));
  const techSet = new Set(profile.technologies.map(t => t.toLowerCase()));
  
  job.skillsRequired.forEach(skill => {
    const cleanSkill = skill.toLowerCase();
    if (skillsSet.has(cleanSkill) || techSet.has(cleanSkill)) {
      hits++;
    }
  });
  
  const skillMatchRatio = job.skillsRequired.length > 0 ? hits / job.skillsRequired.length : 1;
  score += Math.round(skillMatchRatio * 20);
  
  // 2. Location Alignment
  const profilePrefLocations = profile.preferredLocations.map(l => l.toLowerCase());
  const jobCity = job.location.split(",")[0].trim().toLowerCase();
  
  const locHit = profilePrefLocations.some(pref => jobCity.includes(pref) || pref.includes(jobCity)) || job.workMode === WorkMode.REMOTE;
  if (locHit) {
    score += 5;
  }
  
  // 3. Experience alignment
  const reqExp = job.experienceRequired.toLowerCase();
  const isFresherJob = reqExp.includes("0 years") || reqExp.includes("fresher") || reqExp.includes("intern");
  const isFresherUser = profile.experienceLevel === ExperienceLevel.FRESHER;
  
  let experienceMatch = false;
  if (isFresherUser === isFresherJob) {
    experienceMatch = true;
    score += 5;
  } else if (!isFresherUser && !isFresherJob) {
    experienceMatch = true;
    score += 5;
  }
  
  // Ensure we cap matches between 70% and 100%
  score = Math.min(100, Math.max(70, score));
  
  // Human readable labels
  let skillMatch: "Excellent" | "Good" | "Average" = "Average";
  if (skillMatchRatio > 0.7) skillMatch = "Excellent";
  else if (skillMatchRatio > 0.4) skillMatch = "Good";
  
  let salaryMatch: "High" | "Medium" | "Low" = "Low";
  try {
    const profileExpectedLPA = parseFloat(profile.expectedCTC) || 6;
    // Extract numerical bands from job (e.g. ₹8 - ₹12 LPA)
    const match = job.salaryRange.match(/₹(\d+)\s*-\s*₹(\d+)/);
    if (match) {
      const lowRange = parseInt(match[1]);
      const highRange = parseInt(match[2]);
      if (highRange >= profileExpectedLPA) salaryMatch = "High";
      else if (highRange >= profileExpectedLPA * 0.8) salaryMatch = "Medium";
    } else {
      salaryMatch = "Medium";
    }
  } catch (err) {
    salaryMatch = "Medium";
  }
  
  let atsCompatibility: "Strong" | "Moderate" | "Weak" = "Weak";
  if (score >= 90) atsCompatibility = "Strong";
  else if (score >= 80) atsCompatibility = "Moderate";
  
  return {
    job,
    matchScore: score,
    skillMatch,
    salaryMatch,
    atsCompatibility,
    experienceMatch
  };
}

// ==========================================
// REST ENDPOINTS FOR COMPLETED PLATFORM
// ==========================================

// 1. Get Profile
app.get("/api/profile", (req, res) => {
  res.json(userProfile);
});

// 2. Update Profile
app.post("/api/profile/update", (req, res) => {
  userProfile = { ...userProfile, ...req.body };
  
  // recalculate strength score
  let strength = 30; // base
  if (userProfile.fullName) strength += 5;
  if (userProfile.email) strength += 5;
  if (userProfile.city) strength += 5;
  if (userProfile.degree) strength += 10;
  if (userProfile.skills.length > 0) strength += Math.min(15, userProfile.skills.length * 2);
  if (userProfile.projects.length > 0) strength += Math.min(15, userProfile.projects.length * 5);
  if (userProfile.resumeFileName) strength += 15;
  
  userProfile.profileStrengthScore = Math.min(100, strength);
  
  res.json({ success: true, profile: userProfile });
});

// 3. Parse Resume via Gemini AI
app.post("/api/profile/parse", async (req, res) => {
  const { resumeText, fileName } = req.body;
  if (!resumeText) {
    return res.status(400).json({ error: "No resume text content supplied" });
  }

  const client = getAIClient();
  const fileToSave = fileName || "uploaded_resume.txt";
  userProfile.resumeFileName = fileToSave;

  const currentYear = new Date().getFullYear();

  if (!client) {
    // Elegant fallbacks if API key is not active
    console.log("No active Gemini API key. Performing realistic rule-based parsing.");
    
    // Simulate smart parsing based on simple words
    const lower = resumeText.toLowerCase();
    const parsedSkills = ["React", "CSS"];
    if (lower.includes("typescript") || lower.includes("ts")) parsedSkills.push("TypeScript");
    if (lower.includes("node") || lower.includes("backend")) parsedSkills.push("Node.js");
    if (lower.includes("javascript") || lower.includes("js")) parsedSkills.push("JavaScript");
    if (lower.includes("sql") || lower.includes("postgres")) parsedSkills.push("PostgreSQL");
    if (lower.includes("python")) parsedSkills.push("Python");

    // Dynamic state update
    userProfile.skills = Array.from(new Set([...userProfile.skills, ...parsedSkills]));
    userProfile.fullName = "Deepak Nair"; // Simulated parsed name
    userProfile.city = "Chennai";
    userProfile.state = "Tamil Nadu";
    userProfile.degree = "B.E. in Computer Science";
    userProfile.collegeName = "Anna University";
    userProfile.experienceLevel = ExperienceLevel.FRESHER;
    userProfile.profileStrengthScore = 85;
    userProfile.atsBaseScore = 78;

    adminLogs.push({
      time: new Date().toTimeString().split(" ")[0],
      action: "Profile Filtered (Rule)",
      desc: "Simulated parse completed successfully."
    });

    return res.json({
      success: true,
      message: "Parsed resume using local parser (No Gemini Key configured).",
      parsed: {
        fullName: userProfile.fullName,
        skills: parsedSkills,
        degree: userProfile.degree,
        experienceLevel: userProfile.experienceLevel
      },
      profile: userProfile
    });
  }

  try {
    const prompt = `You are an expert Indian Career Recruiter and Resume Parser. Parse the following resume text.
    Identify all candidate attributes, with special emphasis on extracting structured data in the correct JSON format.
    Return ONLY a raw JSON mapping strictly to this model:
    {
      "fullName": string,
      "email": string,
      "phone": string,
      "city": string,
      "state": string,
      "degree": string,
      "specialization": string,
      "collegeName": string,
      "graduationYear": string,
      "skills": string[],
      "technologies": string[],
      "experienceLevel": "Fresher (0 Years)" or "Experienced (1+ Years)",
      "expectedCTC": string (e.g. "6")
    }
    
    Resume content:
    ${resumeText}`;

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const parsedJson = JSON.parse(response.text || "{}");
    
    // Merge updates
    userProfile.fullName = parsedJson.fullName || userProfile.fullName;
    userProfile.email = parsedJson.email || userProfile.email;
    userProfile.phone = parsedJson.phone || userProfile.phone;
    userProfile.city = parsedJson.city || userProfile.city;
    userProfile.state = parsedJson.state || userProfile.state;
    userProfile.degree = parsedJson.degree || userProfile.degree;
    userProfile.specialization = parsedJson.specialization || userProfile.specialization;
    userProfile.collegeName = parsedJson.collegeName || userProfile.collegeName;
    userProfile.graduationYear = parsedJson.graduationYear || userProfile.graduationYear;
    
    if (parsedJson.skills && Array.isArray(parsedJson.skills)) {
      userProfile.skills = Array.from(new Set([...parsedJson.skills]));
    }
    if (parsedJson.technologies && Array.isArray(parsedJson.technologies)) {
      userProfile.technologies = Array.from(new Set([...parsedJson.technologies]));
    }
    if (parsedJson.experienceLevel) {
      userProfile.experienceLevel = parsedJson.experienceLevel === "Experienced (1+ Years)" 
        ? ExperienceLevel.EXPERIENCED 
        : ExperienceLevel.FRESHER;
    }
    
    userProfile.atsBaseScore = 75;
    userProfile.profileStrengthScore = 90;

    adminLogs.push({
      time: new Date().toTimeString().split(" ")[0],
      action: "Resume Parsed",
      desc: `Parsed resume for ${userProfile.fullName} successfully via Gemini API.`
    });

    res.json({
      success: true,
      parsed: parsedJson,
      profile: userProfile
    });
  } catch (error: any) {
    console.error("Gemini parse error:", error);
    res.status(500).json({ error: "Failed to parse resume via AI", details: error.message });
  }
});

// AI Autopost endpoint - Allows AI to discover and post Indian job openings dynamically
app.post("/api/jobs/ai-autopost", async (req, res) => {
  const client = getAIClient();
  const departments = ["Medical", "HR", "Technology", "Finance", "Sales", "Marketing"];
  const selectedDept = departments[Math.floor(Math.random() * departments.length)];

  // High fidelity offline presets for absolute reliability to make sure code always works beautifully
  const offlinePresets = [
    {
      title: "Senior HR Specialist",
      company: "Flipkart",
      location: "Bengaluru, Karnataka",
      salaryRange: "₹8 - ₹12 LPA",
      experienceRequired: "2 - 4 years",
      skillsRequired: ["Employee Relations", "Strategic Hiring", "Workday", "HR Operations", "Compensation Design"],
      description: "Steer end-to-end personnel onboarding, employee-centric policy deployment, and retention schedules at Flipkart Bengaluru headquarters. Lead team building and scale internal feedback loops.",
      applyLink: "https://careers.flipkart.com/jobs/senior-hr",
      workMode: WorkMode.HYBRID,
      companyType: "Product-based",
      department: "HR"
    },
    {
      title: "Clinical Cardiologist Consultant",
      company: "Max Healthcare",
      location: "Delhi, Delhi",
      salaryRange: "₹24 - ₹36 LPA",
      experienceRequired: "4 - 8 years",
      skillsRequired: ["Cardiology", "Patient Diagnostics", "Clinical Research", "Emergency Care", "ECG Monitoring"],
      description: "Excellent consultant clinical cardiology position at Max Healthcare Delhi ward. Direct emergency triage procedures, design personalized recovery regimens, and oversee staff cardiac diagnostics labs.",
      applyLink: "https://www.maxhealthcare.in/careers/cardiac-consultant",
      workMode: WorkMode.ON_SITE,
      companyType: "Product-based",
      department: "Medical"
    },
    {
      title: "Corporate Client Relationship Executive",
      company: "Wipro",
      location: "Chennai, Tamil Nadu",
      salaryRange: "₹6 - ₹9.5 LPA",
      experienceRequired: "1 - 3 years",
      skillsRequired: ["Client Facing", "Account Management", "CRM Tools", "Negotiation", "B2B Sales"],
      description: "Build deep strategic alliances with key MNC enterprise clients for Wipro Tech Chennai. Help cross-functional technical teams match service line agreements seamlessly.",
      applyLink: "https://careers.wipro.com/corporate-relations",
      workMode: WorkMode.HYBRID,
      companyType: "Service-based",
      department: "Sales"
    },
    {
      title: "Pediatric Care GNM Staff Nurse",
      company: "Max Healthcare",
      location: "Noida, Uttar Pradesh",
      salaryRange: "₹4.5 - ₹6.8 LPA",
      experienceRequired: "0 - 2 years / Fresher",
      skillsRequired: ["Pediatric Care", "Patient Care", "Nurses Registry", "IV Fluid Setup", "Clinical Logging"],
      description: "Nurturing role at Noida pediatric wing. Monitor critical infants, log daily parameters under senior medical supervision, and coordinate parental counseling sessions.",
      applyLink: "https://www.maxhealthcare.in/careers/staff-nurse",
      workMode: WorkMode.ON_SITE,
      companyType: "Product-based",
      department: "Medical"
    },
    {
      title: "Corporate Recruiter Strategy Coordinator",
      company: "Tata Consultancy Services (TCS)",
      location: "Kochi, Kerala",
      salaryRange: "₹5.5 - ₹8 LPA",
      experienceRequired: "1 - 3 years",
      skillsRequired: ["Talent Sourcing", "ATS Sorters", "Applicant Pipeline", "Initial Screening", "Campus Placement Drive"],
      description: "Manage large-scale tech freshman campus drives for TCS South-India clusters. Conduct initial screening interviews and streamline resume parsing using internal ATS pipelines.",
      applyLink: "https://careers.tcs.com/campus-recruiter",
      workMode: WorkMode.HYBRID,
      companyType: "Service-based",
      department: "HR"
    },
    {
      title: "Junior Financial Auditor",
      company: "HDFC Bank",
      location: "Mumbai, Maharashtra",
      salaryRange: "₹7 - ₹11 LPA",
      experienceRequired: "1 - 3 years",
      skillsRequired: ["Financial Audit", "Tax Compliance", "Excel Modeling", "GST Filings", "Internal Banking Control"],
      description: "Contribute to core compliance screening audits at HDFC Bank Head Office Mumbai. Implement rigid accounting checksheets and prepare GST reconciliation ledger spreadsheets.",
      applyLink: "https://careers.hdfcbank.com/junior-auditor",
      workMode: WorkMode.ON_SITE,
      companyType: "Product-based",
      department: "Finance"
    }
  ];

  let newJob: Job;

  if (!client) {
    // Pick an offline preset job listing
    const selectedPreset = offlinePresets[Math.floor(Math.random() * offlinePresets.length)];
    newJob = {
      ...selectedPreset,
      id: `ai-job-${Date.now()}`,
      postedTime: "Just now (AI Scouted)",
      source: "AI Scout"
    };
  } else {
    try {
      const gPrompt = `You are an AI Scout Posting agent. Generate a realistic, highly detailed job listing based in India for the "${selectedDept}" department.
      Choose an appropriate well-known Indian company/startup (such as Apollo Hospitals, Fortis, Dr Lal Pathlabs, Razorpay, TCS, Flipkart, Zomato, CRED, Wipro, Freshworks, Paytm, Zerodha, Reliance) for this department.
      Choose a major Indian city (e.g. Bengaluru, Gurugram, Hyderabad, Noida, Mumbai, Pune, Chennai, Kochi) with some region specific details.
      Provide a highly realistic compensation rate in LPA with the standard rupee prefix (e.g., "₹7 - ₹11 LPA", "₹14 - ₹20 LPA").
      Provide realistic experience labels and professional/technical skills.
      
      Return ONLY a raw JSON structure matching:
      {
        "title": "string (professional job title)",
        "company": "string (name of the company)",
        "location": "string (e.g. 'Bengaluru, Karnataka' or 'Hyderabad, Telangana')",
        "salaryRange": "string (e.g., '₹8 - ₹12 LPA')",
        "experienceRequired": "string (e.g., '0 - 2 years' or 'Fresher' or '3+ years')",
        "skillsRequired": ["string", "string", "string", "string"],
        "description": "string (highly detailed job description with localized Indian contexts and corporate details, minimum 3 sentences)",
        "workMode": "Remote" or "Hybrid" or "On-site",
        "companyType": "Product-based" or "Service-based" or "Startup" or "MNC"
      }`;

      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: gPrompt,
        config: {
          responseMimeType: "application/json"
        }
      });

      const parsedJSON = JSON.parse(response.text || "{}");
      
      newJob = {
        id: `ai-job-${Date.now()}`,
        title: parsedJSON.title || `${selectedDept} Specialist`,
        company: parsedJSON.company || "Apollo Hospitals",
        location: parsedJSON.location || "Bengaluru, Karnataka",
        salaryRange: parsedJSON.salaryRange || "₹6 - ₹10 LPA",
        experienceRequired: parsedJSON.experienceRequired || "1 - 3 years",
        skillsRequired: parsedJSON.skillsRequired || ["Communication", "Problem Solving"],
        description: parsedJSON.description || `Excellent dynamic professional opening in our ${selectedDept} branch. Apply today!`,
        applyLink: `https://careers.google.co.in/jobs/ai-autogen-${Date.now()}`,
        postedTime: "Just now (AI Scouted)",
        source: "AI Scout",
        workMode: (parsedJSON.workMode === "Remote" ? WorkMode.REMOTE : parsedJSON.workMode === "Hybrid" ? WorkMode.HYBRID : WorkMode.ON_SITE),
        companyType: parsedJSON.companyType || "Product-based",
        department: selectedDept
      };

    } catch (err) {
      console.error("AI Scout generation error, falling back to preset:", err);
      const selectedPreset = offlinePresets[Math.floor(Math.random() * offlinePresets.length)];
      newJob = {
        ...selectedPreset,
        id: `ai-job-${Date.now()}`,
        postedTime: "Just now (AI Scouted)",
        source: "AI Scout"
      };
    }
  }

  // Prepend to top of the jobs list
  jobsDatabase.unshift(newJob);

  adminLogs.push({
    time: new Date().toTimeString().split(" ")[0],
    action: "AI Auto-Posted",
    desc: `AI Scout autonomously posted high-fidelity Indian job role "${newJob.title}" with company "${newJob.company}" in department "${newJob.department || "General"}".`
  });

  res.json({
    success: true,
    job: newJob
  });
});

// 4. Get Jobs Feed (with sorting, priorities, state/city filters, and local profiles compatibility scores)
app.get("/api/jobs", (req, res) => {
  const { search, state, city, workMode, minSalary, experience, source, tech, department } = req.query;
  
  let filtered = [...jobsDatabase];

  // Filter based on department
  if (department) {
    filtered = filtered.filter(j => j.department && j.department.toLowerCase() === (department as string).toLowerCase());
  }

  // Apply experience classification prioritizations
  // Freshers see trainees, walkins, internships. Experienced see skills-targeted positions.
  if (experience) {
    if (experience === "fresher") {
      filtered = filtered.filter(j => 
        j.experienceRequired.toLowerCase().includes("0 years") || 
        j.experienceRequired.toLowerCase().includes("fresher") ||
        j.experienceRequired.toLowerCase().includes("intern") ||
        j.title.toLowerCase().includes("trainee") ||
        j.title.toLowerCase().includes("graduate")
      );
    } else if (experience === "experienced") {
      filtered = filtered.filter(j => 
        !j.experienceRequired.toLowerCase().includes("0 years") && 
        !j.experienceRequired.toLowerCase().includes("fresher")
      );
    }
  }

  // Work Mode filters
  if (workMode) {
    filtered = filtered.filter(j => j.workMode.toLowerCase() === (workMode as string).toLowerCase());
  }

  // Location search (States/Cities)
  if (state) {
    filtered = filtered.filter(j => j.location.toLowerCase().includes((state as string).toLowerCase()));
  }
  if (city) {
    filtered = filtered.filter(j => j.location.split(",")[0].toLowerCase().includes((city as string).toLowerCase()));
  }

  // Source filters
  if (source) {
    filtered = filtered.filter(j => j.source.toLowerCase() === (source as string).toLowerCase());
  }

  // Salary Banding checks
  if (minSalary) {
    const minVal = parseInt(minSalary as string); // e.g. 3, 6, 10, 20
    if (!isNaN(minVal)) {
      filtered = filtered.filter(j => {
        // extract first number from "₹8 - ₹12 LPA"
        const salaries = j.salaryRange.match(/₹(\d+)/g);
        if (salaries && salaries.length > 0) {
          const lowerVal = parseInt(salaries[0].replace("₹", ""));
          return lowerVal >= minVal;
        }
        return true;
      });
    }
  }

  // Text search
  if (search) {
    const term = (search as string).toLowerCase();
    filtered = filtered.filter(j => 
      j.title.toLowerCase().includes(term) || 
      j.company.toLowerCase().includes(term) || 
      j.description.toLowerCase().includes(term) ||
      j.skillsRequired.some(s => s.toLowerCase().includes(term))
    );
  }

  // Calculate live matching compatibility scores
  const scoreResults: JobMatchResult[] = filtered.map(job => {
    return calculateJobCompatibility(userProfile, job);
  });

  // Filter: PRIORITIZE only matches >= 70%
  const finalResults = scoreResults
    .filter(r => r.matchScore >= 70)
    .sort((a, b) => b.matchScore - a.matchScore); // Best compatibilities first

  res.json(finalResults);
});

// 5. Job Details
app.get("/api/jobs/:id", (req, res) => {
  const job = jobsDatabase.find(j => j.id === req.params.id);
  if (!job) {
    return res.status(404).json({ error: "Job definition not found" });
  }
  const matchResult = calculateJobCompatibility(userProfile, job);
  res.json(matchResult);
});

// 6. Assisted Application Autofill Setup (Generates responses tailored exactly to the job description)
app.post("/api/jobs/:id/apply-autofill", async (req, res) => {
  const { jobDescription, jobTitle, companyName } = req.body;
  
  // Track daily trial quotas
  const isTrial = subscriptionStatus.tier === "Free";
  const now = new Date();
  const trialEnds = new Date(subscriptionStatus.trialEndsAt);
  
  if (isTrial && now > trialEnds) {
    return res.status(403).json({ 
      error: "Subscription Blocked", 
      message: "Your 2-day free trial has expired. To unlock limitless applications and optimizations, upgrade to our coping tiers." 
    });
  }

  // Detect ATS patterns
  const descLower = (jobDescription || "").toLowerCase();
  const titleLower = (jobTitle || "").toLowerCase();
  const companyLower = (companyName || "").toLowerCase();
  const combo = `${descLower} ${titleLower} ${companyLower}`;

  let detectedATS = "None";
  if (combo.includes("workday")) detectedATS = "Workday";
  else if (combo.includes("lever")) detectedATS = "Lever";
  else if (combo.includes("greenhouse")) detectedATS = "Greenhouse";
  else if (combo.includes("taleo") || combo.includes("oracle")) detectedATS = "Taleo";
  else if (combo.includes("sap") || combo.includes("successfactors")) detectedATS = "SAP SuccessFactors";

  const isBotDetectionSystem = detectedATS !== "None";

  // Check limits: Limit applies if user is on Free plan.
  // For once they have taken a plan, only limit applies in bot detection websites.
  if (isTrial) {
    if (subscriptionStatus.remainingApplicationsToday <= 0) {
      return res.status(429).json({
        error: "Daily Quota Exhausted",
        message: "You have reached your limit of 2 free assisted job applications per day on the trial plan."
      });
    }
  } else {
    if (isBotDetectionSystem && subscriptionStatus.remainingApplicationsToday <= 0) {
      return res.status(429).json({
        error: "Daily Quota Exhausted",
        message: `You have reached your limit of ${subscriptionStatus.maxApplicationsPerDay} daily applications allowed on your ${subscriptionStatus.tier} plan for bot-protected websites. Standard direct applications remain fully unlimited!`
      });
    }
  }

  const client = getAIClient();
  const simulatedPersonalDetails = {
    fullName: userProfile.fullName,
    email: userProfile.email,
    phone: userProfile.phone,
    city: userProfile.city,
    state: userProfile.state,
    education: `${userProfile.degree} in ${userProfile.specialization || "CS"}, ${userProfile.collegeName} (Grad: ${userProfile.graduationYear})`,
    experienceRequired: "Mapped beautifully from CV"
  };

  const autofillQuestions = {
    customCoverLetter: "",
    aboutMeContribution: "",
    whyHireMeAnswer: "",
    expectedSalaryIndianContext: `₹${userProfile.expectedCTC} LPA (Open to negotiation depending on work modules)`,
    noticePeriodIndianContext: userProfile.noticePeriod,
    detectedATS: detectedATS // Assign the actual detected ATS platform dynamically
  };

  if (!client) {
    // Elegant fallback simulation
    console.log("No Gemini key. Crafting responsive rule-based application autofill answers.");
    autofillQuestions.customCoverLetter = `Dear Hiring Team at ${companyName},\n\nI am eager to apply for the ${jobTitle} role. With experience in React, TypeScript, and regional projects like IndiCart, database and visual alignment, I possess matched capacity for your criteria...`;
    autofillQuestions.aboutMeContribution = `My name is ${userProfile.fullName}, a tech enthusiast graduated from ${userProfile.collegeName} in ${userProfile.graduationYear}. I build high-contrast responsive web designs with stable local state managers.`;
    autofillQuestions.whyHireMeAnswer = `You should hire me because I focus on pixel integrity, robust TypeScript coverage, and rapid deployment. I am active immediately.`;

    return res.json({
      success: true,
      mapping: simulatedPersonalDetails,
      answers: autofillQuestions,
      quotaRemaining: subscriptionStatus.remainingApplicationsToday,
      notice: "Autofill powered by localized offline guidelines (No Gemini Key)."
    });
  }

  try {
    const prompt = `You are a career assistant for Indian job candidates. Generate custom, highly impactful answers for a job application form.
    Candidate Profile:
    Name: ${userProfile.fullName}
    Skills: ${userProfile.skills.join(", ")}
    Projects: ${JSON.stringify(userProfile.projects)}
    Expected Salary: ${userProfile.expectedCTC} LPA
    Notice Period: ${userProfile.noticePeriod}
    
    Target Job:
    Title: ${jobTitle}
    Company: ${companyName}
    Job Description: ${jobDescription}

    Construct professional, highly relevant answers. Avoid standard fluff. Highlight relevant skills specifically.
    Return ONLY a raw JSON structure matching:
    {
      "customCoverLetter": "Dear hiring manager...",
      "aboutMeContribution": "Tell us about yourself entry...",
      "whyHireMeAnswer": "Why should we hire you? entry..."
    }`;

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const parsed = JSON.parse(response.text || "{}");
    autofillQuestions.customCoverLetter = parsed.customCoverLetter || `Dear Hiring Team at ${companyName}, ...`;
    autofillQuestions.aboutMeContribution = parsed.aboutMeContribution || `I am ${userProfile.fullName}, specializing in web technology...`;
    autofillQuestions.whyHireMeAnswer = parsed.whyHireMeAnswer || `I possess robust experience in skills like React and state routing.`;

    res.json({
      success: true,
      mapping: simulatedPersonalDetails,
      answers: autofillQuestions,
      quotaRemaining: subscriptionStatus.remainingApplicationsToday
    });

  } catch (err: any) {
    console.error("Autofill Gemini error:", err);
    res.status(500).json({ error: "Failed to generate AI application response", details: err.message });
  }
});

// 7. Manual submission trigger to finalize application (deducting client trial applications count)
app.post("/api/jobs/:id/submit-application", (req, res) => {
  const jobId = req.params.id;
  const { notes, coverLetter } = req.body;
  const targetJob = jobsDatabase.find(j => j.id === jobId);

  if (!targetJob) {
    return res.status(404).json({ error: "Job does not exist" });
  }

  // Deduct quota
  const descLower = (targetJob.description || "").toLowerCase();
  const titleLower = (targetJob.title || "").toLowerCase();
  const companyLower = (targetJob.company || "").toLowerCase();
  const linkLower = (targetJob.applyLink || "").toLowerCase();
  const sourceLower = (targetJob.source || "").toLowerCase();
  const combo = `${descLower} ${titleLower} ${companyLower} ${linkLower} ${sourceLower}`;

  let detectedATS = "None";
  if (combo.includes("workday")) detectedATS = "Workday";
  else if (combo.includes("lever")) detectedATS = "Lever";
  else if (combo.includes("greenhouse")) detectedATS = "Greenhouse";
  else if (combo.includes("taleo") || combo.includes("oracle")) detectedATS = "Taleo";
  else if (combo.includes("sap") || combo.includes("successfactors")) detectedATS = "SAP SuccessFactors";

  const isBotDetectionSystem = detectedATS !== "None";
  const isTrial = subscriptionStatus.tier === "Free";

  if (isTrial || isBotDetectionSystem) {
    subscriptionStatus.remainingApplicationsToday = Math.max(0, subscriptionStatus.remainingApplicationsToday - 1);
  }
  subscriptionStatus.applicationsUsedCount++;

  // Add to tracker items
  const newTrack: ApplicationTrackerItem = {
    id: `track-${Date.now()}`,
    job: targetJob,
    status: "applied",
    appliedDate: new Date().toISOString().split("T")[0],
    notes: notes || "Applied with customized resume optimization.",
    coverLetterGenerated: coverLetter || "",
    timeline: [
      { title: "Application Autofilled", date: new Date().toISOString().split("T")[0], description: "Application responses polished and approved by candidate." },
      { title: "Submitted Safely via Dashboard", date: new Date().toISOString().split("T")[0], description: "Human verification confirmed. Anti-bot rules respected." }
    ]
  };

  trackerItems.push(newTrack);

  // Generate push notification
  systemNotifications.unshift({
    id: `notif-${Date.now()}`,
    title: "🚀 Application Submitted Successfully",
    message: `Copilot has prepared and submitted your application for ${targetJob.title} at ${targetJob.company}.`,
    time: "Just now",
    read: false,
    type: "tracker"
  });

  adminLogs.push({
    time: new Date().toTimeString().split(" ")[0],
    action: "Job Applied",
    desc: `Arjun initiated submission to ${targetJob.company}. Daily balance: ${subscriptionStatus.remainingApplicationsToday}.`
  });

  res.json({
    success: true,
    tracker: newTrack,
    quota: subscriptionStatus
  });
});

// 8. ATS Resume Optimizer & Checker
app.post("/api/ats/optimize", async (req, res) => {
  const { jobDescription, sourceText } = req.body;
  
  if (!jobDescription) {
    return res.status(400).json({ error: "Job description is required for ATS alignment." });
  }

  const profileText = sourceText || `
    Name: ${userProfile.fullName}
    Degree: ${userProfile.degree}
    Skills: ${userProfile.skills.join(", ")}
    Technologies: ${userProfile.technologies.join(", ")}
    Projects: ${JSON.stringify(userProfile.projects)}
  `;

  const client = getAIClient();

  if (!client) {
    // Offline simulation
    console.log("Offline ATS Checker active (No Gemini Key found).");
    const testKeywords = ["TypeScript", "Next.js", "Docker", "SaaS", "Tailwind", "REST APIs", "Unit Testing"];
    const missing = testKeywords.filter(kw => !profileText.toLowerCase().includes(kw.toLowerCase()));
    
    const beforeScore = userProfile.atsBaseScore;
    const afterScore = Math.min(98, beforeScore + (missing.length > 0 ? 15 : 0));

    const optimizedReport: ATSReport = {
      beforeScore,
      afterScore,
      missingKeywords: missing.slice(0, 4),
      addedKeywords: missing.slice(0, 3),
      formattingAnalysis: "Formatting is clean. Section headers follow ATS-compliant layouts. Ensure single-column PDF templates are preserved.",
      readabilityFeedback: "Strong action verbs are used correctly. However, quantify achievements by stating user numbers or efficiency ratios (e.g. 'Optimized checkout streams by 14%').",
      optimizedBulletPoints: [
        "Collaborated in containerized environment modules using Docker to streamline multi-tenant deployment services.",
        "Refitted payment checkout widgets ensuring proper state management coverage resulting in a 15% reduction in bounce telemetry."
      ]
    };

    return res.json({
      success: true,
      report: optimizedReport,
      notice: "ATS analytics computed locally (fallback representation)."
    });
  }

  try {
    const prompt = `You are an elite corporate hiring applicant tracking system (ATS) validator.
    Evaluate the user's current profile content and compare it to the target job description.
    Identify missing keywords, formatting weaknesses, bullet points that require optimization, and calculate accurate scores.
    Return ONLY a raw JSON structure matching:
    {
      "beforeScore": number (e.g. 70),
      "afterScore": number (e.g. 92),
      "missingKeywords": string[],
      "addedKeywords": string[],
      "formattingAnalysis": "string review of structure/margins/tables...",
      "readabilityFeedback": "string review of narrative consistency/quantifiable metrics...",
      "optimizedBulletPoints": string[] (provide 3 optimized bullet points using CAR framework - Context Action Result)
    }

    Candidate Profile Information:
    ${profileText}

    Target Job Description:
    ${jobDescription}`;

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const report: ATSReport = JSON.parse(response.text || "{}");
    
    adminLogs.push({
      time: new Date().toTimeString().split(" ")[0],
      action: "ATS Checked",
      desc: `ATS optimization simulated: ${report.beforeScore}% -> ${report.afterScore}%.`
    });

    res.json({
      success: true,
      report
    });

  } catch (err: any) {
    console.error("ATS Gemini Error:", err);
    res.status(500).json({ error: "Failed to optimize ATS via Gemini", details: err.message });
  }
});

// 9. AI Mock Interview Module
app.post("/api/interview/start", (req, res) => {
  const { role, jobDescription, type } = req.body;
  const sessionId = `session-${Date.now()}`;
  
  let introMessage = "";
  if (type === "HR") {
    introMessage = `Hello ${userProfile.fullName}! I'm the HR Manager. Thanks for taking the time today to interview for our ${role} position. To start, could you please introduce yourself and tell me why you're looking to join us?`;
  } else if (type === "Technical") {
    introMessage = `Welcome to the Technical Assessment. I'm the Staff Architect. We'll be walking through coding structures, system paradigms, and your preferred stack. Let's start with a foundational question: Can you explain how you handle render cycles in React when dealing with complex asynchronous streaming hooks?`;
  } else {
    introMessage = `Greetings. This is the Behavioral evaluation. We'll be reviewing how you deal with priority conflicts, stressful timelines, and collaboration. Please share an instance where you had to push a critical bug-hotfix during an active deployment crunch under major time constraints.`;
  }

  const newSession: InterviewSession = {
    id: sessionId,
    role,
    jobDescription,
    type: type || "Technical",
    startedAt: new Date().toISOString(),
    messages: [
      { sender: "ai", text: introMessage, time: "10:15" }
    ]
  };

  interviewSessions.push(newSession);

  adminLogs.push({
    time: new Date().toTimeString().split(" ")[0],
    action: "Interview Started",
    desc: `Started custom ${type} mock interview session for ${role}.`
  });

  res.json(newSession);
});

// Post Message to active Mock Interview Session details
app.post("/api/interview/:id/message", async (req, res) => {
  const sessionId = req.params.id;
  const { message } = req.body;

  const session = interviewSessions.find(s => s.id === sessionId);
  if (!session) {
    return res.status(404).json({ error: "Interview session not found" });
  }

  // Push user response
  session.messages.push({
    sender: "user",
    text: message,
    time: new Date().toTimeString().split(" ")[0].slice(0, 5)
  });

  const client = getAIClient();
  const currentTurn = session.messages.length;

  // Let's decide if we should wrap up and evaluate (at turn 6)
  if (currentTurn >= 6) {
    if (!client) {
      // Local fallback evaluation
      session.evaluation = {
        overallScore: 84,
        strengths: [
          "Demonstrates solid raw vocabulary and industry context.",
          "Clear description of problem solving methodologies based on local projects."
        ],
        weaknesses: [
          "Needs further integration of concrete performance metrics (such as SLAs, runtimes, customer indices).",
          "Occasionally verbose in explaining choices under pressure."
        ],
        communicationQuality: "Good",
        feedback: "Excellent posture. Continue focusing on concrete metrics and numbers when stating outcomes.",
        pointsToImprove: [
          "Incorporate quantifiable business impact stats (e.g. reduced errors by 15%, speed up runtime by 200ms).",
          "Structure behavioral examples strictly around the Situation-Task-Action-Result (STAR) matrix.",
          "Shorten elaborate preamble sentences to improve direct structural flow during rapid response rounds."
        ]
      };

      session.messages.push({
        sender: "ai",
        text: "Thank you for sharing those insights. We have gathered sufficient responses for this mock module. I have compiled your overall performance scorecard which is now visible in the panel.",
        time: new Date().toTimeString().split(" ")[0].slice(0, 5)
      });

      return res.json({ session, done: true });
    }

    try {
      const evaluationPrompt = `You are a professional assessor reviewing a mock interview.
      Review the transcribed dialog containing a candidate interviewing for a ${session.role} position (${session.type} scope).
      
      Transcript:
      ${JSON.stringify(session.messages)}

      Provide a thorough performance scorecard and interview checklist indicating exactly where and how they need to improve.
      Return ONLY a raw JSON structure matching:
      {
        "overallScore": number (0 to 100),
        "strengths": string[],
        "weaknesses": string[],
        "communicationQuality": "Excellent" or "Good" or "Needs Improvement",
        "feedback": "string summarizing key highlights...",
        "pointsToImprove": string[] (concrete points/skills/answers that the user needs to work on or refine to stand out)
      }`;

      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: evaluationPrompt,
        config: {
          responseMimeType: "application/json"
        }
      });

      const parsedEval = JSON.parse(response.text || "{}");
      session.evaluation = parsedEval;

      // Ensure pointsToImprove fallback exists
      if (!session.evaluation.pointsToImprove) {
        session.evaluation.pointsToImprove = [
          "Deepen your grasp of architectural trade-offs.",
          "Practice delivering concise answers under 90 seconds.",
          "State explicit outcomes in your behavioral descriptions."
        ];
      }

      session.messages.push({
        sender: "ai",
        text: "Our assessment is fully complete! I have created your overall Mock Evaluation metrics with detailed improvement points. Take a look at the scorecard panel.",
        time: new Date().toTimeString().split(" ")[0].slice(0, 5)
      });

      adminLogs.push({
        time: new Date().toTimeString().split(" ")[0],
        action: "Interview Complete",
        desc: `Completed evaluation scorecard for ${session.role} (${session.type}) resulting in ${session.evaluation?.overallScore}%.`
      });

      return res.json({ session, done: true });
    } catch (err: any) {
      console.error("Evaluation error:", err);
      // Fallback
      session.evaluation = {
        overallScore: 80,
        strengths: ["Clear response structures"],
        weaknesses: ["Needs detail"],
        communicationQuality: "Good",
        feedback: "Assessments completed with backup offline frameworks.",
        pointsToImprove: [
          "Format answers around the STAR matrix structure.",
          "Quantify tech achievements with key metrics.",
          "Work on keeping explanations highly direct."
        ]
      };
      return res.json({ session, done: true });
    }
  }

  // Conversation continuation step
  if (!client) {
    const aiAnswers = [
      "That's a very practical viewpoint. In high-concurrency environments, how do you typically collaborate with backend engineers to guarantee real-time payload stability?",
      "Understood. Let's touch upon task prioritization. What frameworks or standard trackers do you prefer to keep delivery timelines smooth?",
      "Very insights-driven! Can you describe high-pressure customer feedback loops you encountered during your college projects?",
      "Superb. Let's finish up. Do you have any general questions for us regarding modern engineering methodologies or workplace culture?"
    ];
    const index = Math.min(aiAnswers.length - 1, Math.floor(currentTurn / 2));
    const nextText = aiAnswers[index];

    session.messages.push({
      sender: "ai",
      text: nextText,
      time: new Date().toTimeString().split(" ")[0].slice(0, 5)
    });

    return res.json({ session, done: false });
  }

  try {
    const chatPrompt = `You are an elite recruiter interviewing a candidate for ${session.role} during a ${session.type} simulation.
    Keep your response brief (1-3 sentences) and highly conversational. Ask ONE deep relevant question or follow up based on their response.
    Do NOT provide evaluations or feedback metrics yet.
    
    Conversation history:
    ${JSON.stringify(session.messages)}`;

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: chatPrompt
    });

    const aiResponse = response.text || "Interesting. Can you tell me more?";
    session.messages.push({
      sender: "ai",
      text: aiResponse,
      time: new Date().toTimeString().split(" ")[0].slice(0, 5)
    });

    res.json({ session, done: false });
  } catch (err) {
    session.messages.push({
      sender: "ai",
      text: "Interesting. Can you expand on how you would address that in a team context?",
      time: new Date().toTimeString().split(" ")[0].slice(0, 5)
    });
    res.json({ session, done: false });
  }
});

// 10. AI Career Roadmap Generator endpoint
app.post("/api/career/roadmap", async (req, res) => {
  const { roleName } = req.body;
  const target = roleName || userProfile.preferredRole || "Software Developer in India";
  
  const client = getAIClient();

  if (!client) {
    // Return standard offline career roadmap matching Indian industry structure
    const defaultSteps = [
      { step: "1", title: "Learn Core Web Technologies", items: ["HTML5 semantics", "Modern CSS", "JavaScript ES6 primitives", "DOM Manipulation"] },
      { step: "2", title: "Master Modern React Core concepts", items: ["State hooks", "Context routing", "Custom caching hooks", "Tailwind styling integrations"] },
      { step: "3", title: "Understand local testing & bundling", items: ["Vite module layouts", "Jest/Vitest setups", "Docker local registries"] },
      { step: "4", title: "Indian Startup / MNC Positioning Drive", items: ["Target 15+ mock listings", "Publish 2 active GitHub showcase widgets", "Quantify resumés for ATS checkers"] }
    ];
    return res.json({
      success: true,
      roadmap: {
        role: target,
        steps: defaultSteps,
        resources: ["GeeksforGeeks Indian placement trackers", "Striver SDE Sheet", "Roadmap.sh"]
      }
    });
  }

  try {
    const prompt = `You are an elite Indian tech career roadmapped architect.
    Generate a highly realistic step-by-step career development roadmap (4 steps layout) specifically catering to Indian tech hiring (MNC vs Startup contexts) for the role: ${target}.
    Provide explicit, helpful milestone structures.
    Return ONLY a raw JSON structure matching:
    {
      "role": "${target}",
      "steps": [
        { "step": "1", "title": "Milestone Title", "items": ["Task 1", "Task 2"] },
        ...
      ],
      "resources": ["Resource 1", "Resource 2"]
    }`;

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json({
      success: true,
      roadmap: parsed
    });

  } catch (err: any) {
    res.status(500).json({ error: "Failed to generate AI roadmap", details: err.message });
  }
});

// 11. Razorpay Payment Gateway Simulator
app.post("/api/subscription/pay", (req, res) => {
  const { planType, paymentMethod } = req.body;
  
  let amount = 1000; // default monthly
  let daysToAdd = 30;
  let tierName: "Weekly" | "Monthly" | "Quarterly" = "Monthly";

  if (planType === "Weekly") {
    amount = 300;
    daysToAdd = 7;
    tierName = "Weekly";
  } else if (planType === "Quarterly" || planType === "Three Month") {
    amount = 2500;
    daysToAdd = 90;
    tierName = "Quarterly";
  }

  // Simulate transactional processing success
  const trId = `razorpay-tx-${Date.now().toString().slice(-8)}`;
  
  subscriptionStatus = {
    tier: tierName,
    trialEndsAt: new Date(Date.now() + daysToAdd * 24 * 60 * 60 * 1000).toISOString(),
    remainingApplicationsToday: tierName === "Weekly" ? 10 : tierName === "Monthly" ? 30 : 100,
    maxApplicationsPerDay: tierName === "Weekly" ? 10 : tierName === "Monthly" ? 30 : 100,
    applicationsUsedCount: subscriptionStatus.applicationsUsedCount,
    paymentHistory: [
      {
        id: trId,
        date: new Date().toISOString().split("T")[0],
        amount,
        plan: `${tierName} Copilot Subscription`,
        status: "Successful"
      },
      ...subscriptionStatus.paymentHistory
    ]
  };

  systemNotifications.unshift({
    id: `notif-${Date.now()}`,
    title: "💳 Payment Successful via UPI/Razorpay",
    message: `Your ${tierName} Copilot Upgrade is complete. Daily quotas updated to ${subscriptionStatus.maxApplicationsPerDay} limit!`,
    time: "Just now",
    read: false,
    type: "payment"
  });

  adminLogs.push({
    time: new Date().toTimeString().split(" ")[0],
    action: "Subscription Payment",
    desc: `Processed plan upgrade to ${tierName} for ${userProfile.fullName}. Razorpay amount: ₹${amount}.`
  });

  res.json({
    success: true,
    transactionId: trId,
    subscription: subscriptionStatus
  });
});

// 12. Application tracker items
app.get("/api/tracker", (req, res) => {
  res.json(trackerItems);
});

// 13. System Notifications
app.get("/api/notifications", (req, res) => {
  res.json(systemNotifications);
});

app.post("/api/notifications/read-all", (req, res) => {
  systemNotifications = systemNotifications.map(n => ({ ...n, read: true }));
  res.json({ success: true, notifications: systemNotifications });
});

// 14. Admin Telemetrics endpoint
app.get("/api/admin/telemetry", (req, res) => {
  // Return summarized operational trends for Admin Dash
  const logsCount = adminLogs.length;
  const jobsCount = jobsDatabase.length;
  const trackerCount = trackerItems.length;

  res.json({
    metrics: {
      signups: 154,
      totalRevenue: 42500, // INR
      apiCallsCost: "₹21.40", // Simulated tracking cost
      activeSubscriptions: 24,
      totalJobsIndexed: jobsCount,
      totalTrackerCount: trackerCount,
      trialSuccessConversion: "34%"
    },
    logs: adminLogs.slice(-10) // last 10 logs
  });
});

// ==========================================
// MOUNT VITE MIDDLEWARE SETUP
// ==========================================

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server boots up securely on http://localhost:${PORT}`);
  });
}

startServer();
