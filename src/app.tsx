import React, { useState, useEffect } from "react";
import LandingPage from "./components/LandingPage";
import Dashboard from "./components/Dashboard";
import JobFeed from "./components/JobFeed";
import ResumeOptimizer from "./components/ResumeOptimizer";
import MockInterview from "./components/MockInterview";
import Tracker from "./components/Tracker";
import ResumeUpload from "./components/ResumeUpload";
import ProfileEditor from "./components/ProfileEditor";
import AdminPanel from "./components/AdminPanel";

import { UserProfile, SubscriptionStatus, SystemNotification, ApplicationTrackerItem, ExperienceLevel } from "./types";
import { Language, translations } from "./locale";
import { Briefcase, LayoutDashboard, Search, FileText, MessageSquare, Clock, UploadCloud, UserCircle, Cpu, Bell, Landmark, CreditCard, ShieldCheck, CheckCircle2, ChevronRight, X, Sparkles, RefreshCw } from "lucide-react";

export default function App() {
  const [tab, setTab] = useState<"landing" | "dashboard" | "jobs" | "ats" | "interview" | "tracker" | "upload" | "profile" | "admin">("landing");
  const [lang, setLang] = useState<Language>("en");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Global app data states synchronized with backend
  const [profile, setProfile] = useState<UserProfile>({
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
    certifications: ["AWS Certified Developer Associate"],
    experienceLevel: ExperienceLevel.FRESHER,
    skills: ["React", "TypeScript", "Tailwind CSS", "Node.js", "Express", "MongoDB"],
    technologies: ["Vite", "Git", "Docker", "PostgreSQL"],
    projects: [
      {
        title: "IndiCart - Indian Artisan Catalog",
        description: "A localized SDE React project mapping rural handlooms to urban buyers with instant billing.",
        techs: ["React", "Node.js", "MongoDB", "Tailwind"]
      }
    ],
    workExperience: [],
    expectedCTC: "8",
    noticePeriod: "Immediate",
    joiningAvailability: "Immediate / 1 week",
    preferredRole: "Frontend Developer",
    preferredLocations: ["Bengaluru", "Hyderabad"],
    willingToRelocate: true,
    resumeFileName: "Arjun_Sharma_CS_Resume.pdf",
    profileStrengthScore: 78,
    atsBaseScore: 71
  });

  const [subscription, setSubscription] = useState<SubscriptionStatus>({
    tier: "Free",
    trialEndsAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    remainingApplicationsToday: 2,
    maxApplicationsPerDay: 2,
    applicationsUsedCount: 1,
    paymentHistory: [
      { id: "pay-initial", date: "2026-05-21", amount: 0, plan: "Free Trial Active", status: "Successful" }
    ]
  });

  const [notifications, setNotifications] = useState<SystemNotification[]>([]);
  const [trackerItems, setTrackerItems] = useState<ApplicationTrackerItem[]>([]);

  // Payment popup state variables
  const [payModalOpen, setPayModalOpen] = useState(false);
  const [selectedPayPlan, setSelectedPayPlan] = useState<"Weekly" | "Monthly" | "Quarterly">("Monthly");
  const [payGatewayStep, setPayGatewayStep] = useState<"select" | "upi_input" | "otp_verify" | "invoice">("select");
  const [inputUpiId, setInputUpiId] = useState("");
  const [inputOtp, setInputOtp] = useState("");
  const [payInProcess, setPayInProcess] = useState(false);
  const [recentTransactionId, setRecentTransactionId] = useState("");

  const pullBackendState = async () => {
    try {
      const pRes = await fetch("/api/profile");
      const pData = await pRes.json();
      setProfile(pData);

      const nRes = await fetch("/api/notifications");
      const nData = await nRes.json();
      setNotifications(nData);

      const tRes = await fetch("/api/tracker");
      const tData = await tRes.json();
      setTrackerItems(tData);
    } catch (err) {
      console.error("Backend coordination sync failure:", err);
    }
  };

  useEffect(() => {
    if (tab !== "landing") {
      pullBackendState();
    }
  }, [tab]);

  const handleProfileUpdated = (updated: UserProfile) => {
    setProfile(updated);
  };

  // Payment Upgrade pipeline (UPI simulate checkout)
  const openUpgradePortal = (e?: React.MouseEvent) => {
    e?.preventDefault();
    setPayGatewayStep("select");
    setPayModalOpen(true);
  };

  const getPlanDetails = (p: "Weekly" | "Monthly" | "Quarterly") => {
    switch (p) {
      case "Weekly":
        return { cost: 300, desc: "₹300/week billing cycle", slots: "10 Applications/day limit" };
      case "Quarterly":
        return { cost: 2500, desc: "₹2500/3 months savings cycle", slots: "100 Applications/day limit" };
      default:
        return { cost: 1000, desc: "₹1000/month standard cycle", slots: "30 Applications/day limit" };
    }
  };

  const submitUpiCheckout = () => {
    if (!inputUpiId.includes("@")) {
      alert("Please enter a valid Indian UPI VPA Virtual Address (e.g., candidate@ybl)");
      return;
    }
    setPayInProcess(true);
    setTimeout(() => {
      setPayInProcess(false);
      setPayGatewayStep("otp_verify");
    }, 1500);
  };

  const confirmOtpCheckout = async () => {
    if (inputOtp.length < 4) {
      alert("Please enter the 4-digit bank OTP authorization code");
      return;
    }
    setPayInProcess(true);
    try {
      const response = await fetch("/api/subscription/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planType: selectedPayPlan, paymentMethod: "UPI" })
      });
      const data = await response.json();
      if (data.success) {
        setSubscription(data.subscription);
        setRecentTransactionId(data.transactionId);
        setPayGatewayStep("invoice");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setPayInProcess(false);
    }
  };

  // Safe read triggers
  const markNotificationsRead = async () => {
    try {
      const response = await fetch("/api/notifications/read-all", { method: "POST" });
      const data = await response.json();
      if (data.success) {
        setNotifications(data.notifications);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (tab === "landing") {
    return (
      <LandingPage
        onEnterApp={() => setTab("dashboard")}
        lang={lang}
        setLang={setLang}
      />
    );
  }

  const activeUnreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="flex bg-slate-50 min-h-screen font-sans border-t-2 border-blue-600 transition-colors">
      
      {/* 1. SaaS Navigation Sidebar */}
      <aside className={`w-64 bg-slate-900 text-slate-400 fixed inset-y-0 left-0 transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 transition-all duration-300 z-40 flex flex-col justify-between border-r border-slate-800`}>
        <div>
          {/* Sidebar Brand header */}
          <div className="p-6 border-b border-slate-800/80 flex items-center space-x-3">
            <div className="bg-blue-600 text-white p-2.5 rounded-xl shadow-md cursor-pointer flex-shrink-0" onClick={() => setTab("landing")}>
              <Briefcase className="w-5 h-5" id="sidebar-logo" />
            </div>
            <div>
              <span className="font-bold text-slate-100 text-sm tracking-tight">AI Career Copilot</span>
              <span className="text-[10px] uppercase font-bold text-blue-500 block">SDE Placement Hub</span>
            </div>
          </div>

          {/* Nav groups */}
          <nav className="p-4 space-y-1 text-xs">
            <button
              onClick={() => setTab("dashboard")}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all cursor-pointer font-semibold ${
                tab === "dashboard" ? "bg-blue-600 text-white shadow-md shadow-blue-600/5" : "hover:bg-slate-850 hover:text-slate-200"
              }`}
            >
              <LayoutDashboard className="w-4.5 h-4.5" />
              <span>SDE Placement Hub</span>
            </button>

            <button
              onClick={() => setTab("jobs")}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all cursor-pointer font-semibold ${
                tab === "jobs" ? "bg-blue-600 text-white shadow-md shadow-blue-600/5" : "hover:bg-slate-850 hover:text-slate-200"
              }`}
            >
              <Search className="w-4.5 h-4.5" />
              <span>Discover Jobs ({profile.experienceLevel.includes("Fresher") ? "0 Exp" : "Exp"})</span>
            </button>

            <button
              onClick={() => setTab("ats")}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all cursor-pointer font-semibold ${
                tab === "ats" ? "bg-blue-600 text-white shadow-md shadow-blue-600/5" : "hover:bg-slate-850 hover:text-slate-200"
              }`}
            >
              <FileText className="w-4.5 h-4.5" />
              <span>ATS Resume Optimizer</span>
            </button>

            <button
              onClick={() => setTab("interview")}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all cursor-pointer font-semibold ${
                tab === "interview" ? "bg-blue-600 text-white shadow-md shadow-blue-600/5" : "hover:bg-slate-850 hover:text-slate-200"
              }`}
            >
              <MessageSquare className="w-4.5 h-4.5" />
              <span>Mock Interview Trainer</span>
            </button>

            <button
              onClick={() => setTab("tracker")}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all cursor-pointer font-semibold ${
                tab === "tracker" ? "bg-blue-600 text-white shadow-md shadow-blue-600/5" : "hover:bg-slate-850 hover:text-slate-200"
              }`}
            >
              <Clock className="w-4.5 h-4.5" />
              <span>Application Milestones ({trackerItems.length})</span>
            </button>

            <div className="h-[1px] bg-slate-800/80 my-4" />

            <button
              onClick={() => setTab("upload")}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all cursor-pointer font-semibold ${
                tab === "upload" ? "bg-blue-600 text-white shadow-md shadow-blue-600/5" : "hover:bg-slate-850 hover:text-slate-200"
              }`}
            >
              <UploadCloud className="w-4.5 h-4.5" />
              <span>Upload PDF Parser</span>
            </button>

            <button
              onClick={() => setTab("profile")}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all cursor-pointer font-semibold ${
                tab === "profile" ? "bg-blue-600 text-white shadow-md shadow-blue-600/5" : "hover:bg-slate-850 hover:text-slate-200"
              }`}
            >
              <UserCircle className="w-4.5 h-4.5" />
              <span>Application Profile</span>
            </button>

            <button
              onClick={() => setTab("admin")}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all cursor-pointer font-semibold ${
                tab === "admin" ? "bg-blue-600 text-white shadow-md shadow-blue-600/5" : "hover:bg-slate-850 hover:text-slate-200"
              }`}
            >
              <Cpu className="w-4.5 h-4.5" />
              <span>Admin Telemetry metrics</span>
            </button>
          </nav>
        </div>

        {/* User context footer banner in sidebar */}
        <div className="p-4 border-t border-slate-800">
          <div className="p-3 bg-slate-850 rounded-xl relative overflow-hidden flex items-center space-x-3">
            <span className="text-xl">👤</span>
            <div>
              <span className="font-bold text-xs text-slate-100 block">{profile.fullName}</span>
              <span className="text-[10px] text-slate-500 block truncate">{profile.collegename || profile.degree}</span>
            </div>
          </div>
        </div>
      </aside>

      {/* 2. Primary Page Area Container */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        
        {/* Header toolbar stats details */}
        <header className="bg-white border-b border-slate-200 py-4 px-6 lg:px-8 flex justify-between items-center sticky top-0 z-30">
          <div className="flex justify-start">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 mr-2 rounded-lg cursor-pointer"
            >
              <span>☰</span>
            </button>
          </div>

          {/* Quick quotas & warnings alert badges */}
          <div className="flex items-center space-x-4 ml-auto">
            {/* Limit notification alerts */}
            {activeUnreadCount > 0 && (
              <button
                onClick={() => {
                  setTab("dashboard");
                  markNotificationsRead();
                }}
                className="bg-blue-50 hover:bg-blue-100 p-2.5 rounded-xl border border-blue-200 text-blue-600 relative cursor-pointer"
              >
                <Bell className="w-4.5 h-4.5" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold font-mono">
                  {activeUnreadCount}
                </span>
              </button>
            )}

            {/* Quota limit tracker */}
            <div className="bg-slate-100 px-3.5 py-1.5 rounded-xl border border-slate-200 flex items-center space-x-3">
              <span className="text-[10px] font-bold text-slate-500 block uppercase font-mono">My Account Quota:</span>
              <span className="inline-flex items-center font-bold text-xs text-slate-800">
                {subscription.tier === "Free" ? (
                  `${subscription.remainingApplicationsToday} left today`
                ) : (
                  `Unlimited (${subscription.remainingApplicationsToday} ATS left)`
                )}
              </span>
              <button
                onClick={openUpgradePortal}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-[9px] px-2 py-1 rounded-md transition-all cursor-pointer uppercase"
                id="header-upgrade-btn"
              >
                Upgrade
              </button>
            </div>
          </div>
        </header>

        {/* Dynamic Inner body contents pages */}
        <main className="p-6 lg:p-8 flex-1 max-w-7xl mx-auto w-full transition-all">
          {tab === "dashboard" && (
            <Dashboard
              profile={profile}
              subscription={subscription}
              notifications={notifications}
              refreshProfile={pullBackendState}
              lang={lang}
            />
          )}

          {tab === "jobs" && (
            <JobFeed
              profile={profile}
              subscription={subscription}
              onRefreshSubscription={(updated) => setSubscription(updated)}
              onApplicationCompleted={pullBackendState}
            />
          )}

          {tab === "ats" && (
            <ResumeOptimizer userSkills={profile.skills} userProfile={profile} />
          )}

          {tab === "interview" && (
            <MockInterview preferredRole={profile.preferredRole} />
          )}

          {tab === "tracker" && (
            <Tracker items={trackerItems} />
          )}

          {tab === "upload" && (
            <ResumeUpload onParsingComplete={handleProfileUpdated} />
          )}

          {tab === "profile" && (
            <ProfileEditor profile={profile} onSave={handleProfileUpdated} />
          )}

          {tab === "admin" && (
            <AdminPanel />
          )}
        </main>
      </div>

      {/* 3. Razorpay Interactive SSL Checkout Gate Simulator Overlay Modal */}
      {payModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl relative overflow-hidden text-left border border-slate-200">
            {/* Checkout Header banner */}
            <div className="bg-slate-900 text-white p-5 flex justify-between items-center border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <div className="bg-blue-500/15 p-2 rounded-xl text-blue-400">
                  <Landmark className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-xs uppercase tracking-widest text-slate-300">Razorpay Payment Gateway</h3>
                  <span className="text-[9px] block text-slate-500 font-mono">TRUSTED SSL SECURED PORTAL</span>
                </div>
              </div>
              <button
                onClick={() => setPayModalOpen(false)}
                className="text-slate-400 hover:text-white p-1.5 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body conditional transitions */}
            <div className="p-6 space-y-6">
              
              {/* Step 1: Select Plan */}
              {payGatewayStep === "select" && (
                <div className="space-y-4">
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider font-mono block">Choose your upgrades plan</span>
                  
                  <div className="space-y-2.5">
                    {[
                      { tier: "Weekly", cost: "₹300", desc: "Best for active short SDE application bursts", detailed: "10 applications per day limit" },
                      { tier: "Monthly", cost: "₹1000", desc: "Most popular. Fits active college placements SDE drive", detailed: "30 applications per day limit" },
                      { tier: "Quarterly", cost: "₹2500", desc: "Full preparations. WhatsApp alert & CV optimizing", detailed: "100 applications per day limit" }
                    ].map((plan) => (
                      <div
                        key={plan.tier}
                        onClick={() => setSelectedPayPlan(plan.tier as any)}
                        className={`p-4 rounded-xl border transition-all cursor-pointer flex justify-between items-center ${
                          selectedPayPlan === plan.tier
                            ? "bg-blue-50/50 border-blue-500 text-slate-900"
                            : "bg-white border-slate-200 hover:border-slate-300 text-slate-600"
                        }`}
                      >
                        <div>
                          <strong className="text-xs block text-slate-900">{plan.tier} Upgrade Pass</strong>
                          <span className="text-[10px] text-slate-550 block mt-0.5 font-medium leading-relaxed">{plan.desc}</span>
                          <span className="text-[9px] block text-blue-600 bg-blue-50 border border-blue-100 rounded px-1.5 py-0.5 mt-2 w-fit font-bold font-mono uppercase">{plan.detailed}</span>
                        </div>
                        <span className="text-sm font-extrabold text-slate-950 font-mono shrink-0">{plan.cost}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => setPayGatewayStep("upi_input")}
                    className="w-full bg-slate-900 hover:bg-black text-white font-bold text-xs py-3 rounded-xl transition-all flex items-center justify-center space-x-1 cursor-pointer"
                    id="pricing-anchor"
                  >
                    <span>Proceed to UPI Payment Options</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Step 2: Input UPI Virtual ID */}
              {payGatewayStep === "upi_input" && (
                <div className="space-y-4">
                  <div className="bg-slate-55/75 p-3.5 rounded-xl text-xs font-semibold text-slate-600 flex justify-between">
                    <span>Plan Upgrade selected:</span>
                    <span className="font-black text-slate-900">{selectedPayPlan} Upgrade</span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Enter Indian UPI ID VPA structure</label>
                    <input
                      type="text"
                      value={inputUpiId}
                      onChange={(e) => setInputUpiId(e.target.value)}
                      placeholder="e.g. yourname@ybl, phone@paytm..."
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                    />
                    <span className="text-[9px] text-slate-400 mt-1 block font-mono">Compatible with PhonePe, BHIM UPI, GPay, Paytm</span>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setPayGatewayStep("select")}
                      className="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold"
                    >
                      Back
                    </button>
                    <button
                      onClick={submitUpiCheckout}
                      disabled={payInProcess}
                      className="w-1/2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex justify-center items-center cursor-pointer shadow-md"
                    >
                      {payInProcess ? <RefreshCw className="w-4 h-4 animate-spin" /> : "Verify UPI & OTP"}
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Bank OTP verify simulation */}
              {payGatewayStep === "otp_verify" && (
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-xl text-xs font-semibold text-blue-700 leading-relaxed text-center">
                    🔒 SSL SECURE DISPATCH <br /> We have pushed a simulated OTP code request to your Indian banking endpoint.
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 text-center mb-2">Provide Bank 4-Digit OTP Code</label>
                    <input
                      type="text"
                      value={inputOtp}
                      onChange={(e) => setInputOtp(e.target.value)}
                      placeholder="e.g. 1234"
                      className="w-1/2 mx-auto text-center px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-black font-mono tracking-widest block"
                      maxLength={4}
                    />
                  </div>

                  <button
                    onClick={confirmOtpCheckout}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl cursor-pointer shadow-md flex justify-center items-center"
                  >
                    {payInProcess ? <RefreshCw className="w-4 h-4 animate-spin" /> : "Validate Security OTP"}
                  </button>
                </div>
              )}

              {/* Step 4: Transaction Invoice Success report receipt */}
              {payGatewayStep === "invoice" && (
                <div className="space-y-5 text-center py-4">
                  <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>

                  <div>
                    <h4 className="font-black text-slate-900 text-sm">₹{getPlanDetails(selectedPayPlan).cost} INR Transaction successful!</h4>
                    <span className="text-[10px] text-slate-400 font-mono uppercase block mt-1 tracking-wider">SECURE INVOICE GENERATED</span>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs font-medium space-y-2.5 text-left font-mono">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Razorpay Transaction ID</span>
                      <span className="text-slate-800 font-bold">{recentTransactionId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Selected Copilot Slot</span>
                      <span className="text-slate-800 font-bold">{selectedPayPlan} Upgrade</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Allowances Active</span>
                      <span className="text-slate-800 font-bold">{getPlanDetails(selectedPayPlan).slots}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setPayModalOpen(false);
                      setPayGatewayStep("select");
                    }}
                    className="w-full py-3 bg-slate-900 hover:bg-black text-white font-bold text-xs rounded-xl cursor-pointer"
                  >
                    Return to Copilot Panel
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
