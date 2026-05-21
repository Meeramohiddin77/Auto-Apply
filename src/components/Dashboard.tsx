import React, { useState, useEffect } from "react";
import { UserProfile, SubscriptionStatus, SystemNotification } from "../types";
import { Sparkles, Calendar, Award, CheckSquare, Bell, Compass, ArrowRight, ShieldCheck, RefreshCw, Zap, Landmark } from "lucide-react";
import { Language, translations } from "../locale";

interface DashboardProps {
  profile: UserProfile;
  subscription: SubscriptionStatus;
  notifications: SystemNotification[];
  refreshProfile: () => void;
  lang: Language;
}

interface RoadmapStep {
  step: string;
  title: string;
  items: string[];
}

export default function Dashboard({ profile, subscription, notifications, refreshProfile, lang }: DashboardProps) {
  const t = translations[lang];
  const [selectedRoleForRoadmap, setSelectedRoleForRoadmap] = useState("Frontend Developer");
  const [roadmapData, setRoadmapData] = useState<{ role: string; steps: RoadmapStep[]; resources: string[] } | null>(null);
  const [roadmapLoading, setRoadmapLoading] = useState(false);

  // Calculate stats based on local static info
  const appsAppliedCount = 2; // matching tracker initial length
  const interviewsScheduledCount = 1;

  // Countdown calculations
  const calculateDaysRemaining = (isoStr: string) => {
    const diff = new Date(isoStr).getTime() - Date.now();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  const loadCareerRoadmap = async () => {
    setRoadmapLoading(true);
    setRoadmapData(null);
    try {
      const response = await fetch("/api/career/roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roleName: selectedRoleForRoadmap })
      });
      const data = await response.json();
      if (data.success && data.roadmap) {
        setRoadmapData(data.roadmap);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setRoadmapLoading(false);
    }
  };

  return (
    <div className="space-y-8" id="dashboard-hub">
      {/* Welcome Board Profile summary */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-tr from-slate-900 via-slate-950 to-slate-900 text-white p-7 rounded-3xl md:col-span-2 relative overflow-hidden shadow-lg border border-slate-800">
          <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex items-center space-x-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-[10px] font-bold w-fit mb-5">
            <Zap className="w-3.5 h-3.5" />
            <span>COPILOT ACTIVE SDE RECRUITMENT</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {t.welcomeBack}
          </h2>
          <p className="text-slate-400 text-xs mt-1 max-w-lg leading-relaxed">
            {t.dashboardDesc}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-6 text-xs text-slate-300 border-t border-slate-800/80 pt-5">
            <div>
              <span className="text-[10px] text-slate-500 block font-mono">Current Location</span>
              <span className="font-bold">{profile.city}, {profile.state}</span>
            </div>
            <div className="h-4 w-[1px] bg-slate-800" />
            <div>
              <span className="text-[10px] text-slate-500 block font-mono font-bold">{t.fresherJobs}</span>
              <span className="font-bold text-indigo-400">0 Exp Placement Ready</span>
            </div>
            <div className="h-4 w-[1px] bg-slate-800" />
            <div>
              <span className="text-[10px] text-slate-500 block font-mono">Profile Strengths Score</span>
              <span className="font-bold text-emerald-400">{profile.profileStrengthScore}%</span>
            </div>
          </div>
        </div>

        {/* Subscription Plan details */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Account copilot limit</span>
              <span className="text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 rounded px-2 py-0.5">
                {subscription.tier} Plan
              </span>
            </div>

            <div className="mt-4 space-y-4">
              <div>
                <span className="text-xs text-slate-500 font-semibold">{t.remainingApplications}</span>
                <div className="flex items-baseline gap-1.5 mt-1 flex-wrap">
                  {subscription.tier === "Free" ? (
                    <>
                      <span className="text-3xl font-black text-slate-900">{subscription.remainingApplicationsToday}</span>
                      <span className="text-slate-400 text-xs font-bold">/ {subscription.maxApplicationsPerDay}</span>
                    </>
                  ) : (
                    <div className="flex flex-col gap-0.5">
                      <span className="text-2xl font-black text-emerald-600 block">Unlimited Applications</span>
                      <span className="text-[11px] font-bold text-slate-500">
                        ({subscription.remainingApplicationsToday} daily applications left for bot-trackers/ATS)
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {subscription.tier === "Free" ? (
                <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-xl text-[10px] text-blue-700 font-medium">
                  🔥 Free 2-day trial application period active. 
                  <strong className="block mt-1 text-slate-700">Ends in {calculateDaysRemaining(subscription.trialEndsAt)} Days.</strong>
                </div>
              ) : (
                <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-xl text-[10px] text-emerald-700 font-medium">
                  🚀 Your premium plan is active. 
                  <strong className="block mt-1 text-slate-705">Standard applications are fully unlimited; bot-trackers have daily limits.</strong>
                </div>
              )}
            </div>
          </div>

          <a
            href="#pricing-anchor"
            className="w-full mt-4 bg-slate-900 hover:bg-black text-white text-center font-bold text-xs py-2.5 rounded-xl transition-all"
            id="upgrade-link-dashboard"
          >
            Upgrade Plan Slots
          </a>
        </div>
      </div>

      {/* Grid of secondary statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm text-left">
          <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">Job tracked</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">{appsAppliedCount}</span>
          <div className="mt-2 text-[10px] font-bold text-emerald-600 flex items-center space-x-1">
            <CheckSquare className="w-3 h-3" />
            <span>Consent Verified</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm text-left">
          <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">Interviews Scheduled</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">{interviewsScheduledCount}</span>
          <div className="mt-2 text-[10px] font-bold text-indigo-600 flex items-center space-x-1">
            <Calendar className="w-3 h-3" />
            <span>TCS technical evaluation</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm text-left">
          <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">ATS Base Audit</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">{profile.atsBaseScore}%</span>
          <div className="mt-2 text-[10px] font-bold text-blue-600 flex items-center space-x-1">
            <Award className="w-3 h-3" />
            <span>Medium compliance</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm text-left">
          <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">Total used applications</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">{subscription.applicationsUsedCount}</span>
          <div className="mt-2 text-[10px] font-bold text-amber-600 flex items-center space-x-1">
            <ShieldCheck className="w-3 h-3" />
            <span>Safe delay loops</span>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-8">
        {/* Left column: SVG metric charts & language trends */}
        <div className="lg:col-span-3 space-y-6 text-left">
          {/* Custom SVG premium Area comparison graphs */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div>
                <h4 className="font-bold text-xs text-slate-950 uppercase tracking-wide">
                  ATS score trend optimization
                </h4>
                <p className="text-[10px] text-slate-400">Performance output score improvement after keyword alignment.</p>
              </div>
            </div>

            {/* Custom SVG area visualization */}
            <div className="mt-6 h-48 w-full relative">
              <svg className="w-full h-full" viewBox="0 0 500 200" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="unoptGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ef4444" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#ef4444" stopOpacity="0.0" />
                  </linearGradient>
                  <linearGradient id="optGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                
                {/* Grid guidelines */}
                <line x1="50" y1="20" x2="480" y2="20" stroke="#f1f5f9" strokeWidth="2" />
                <line x1="50" y1="70" x2="480" y2="70" stroke="#f1f5f9" strokeWidth="2" />
                <line x1="50" y1="120" x2="480" y2="120" stroke="#f1f5f9" strokeWidth="2" />
                <line x1="50" y1="170" x2="480" y2="170" stroke="#e2e8f0" strokeWidth="2" />

                {/* Legend elements */}
                <text x="10" y="25" fill="#94a3b8" fontSize="10" fontFamily="monospace">90%</text>
                <text x="10" y="75" fill="#94a3b8" fontSize="10" fontFamily="monospace">70%</text>
                <text x="10" y="125" fill="#94a3b8" fontSize="10" fontFamily="monospace">50%</text>
                
                {/* Area charts fill */}
                {/* 1. Unoptimized curve (representing raw resumes) */}
                <path
                  d="M 50,140 Q 150,110 250,135 T 450,120 L 450,170 L 50,170 Z"
                  fill="url(#unoptGrad)"
                />
                {/* 2. Optimized curve */}
                <path
                  d="M 50,105 Q 150,45 250,55 T 450,30 L 450,170 L 50,170 Z"
                  fill="url(#optGrad)"
                />

                {/* Stroke curves */}
                <path
                  d="M 50,140 Q 150,110 250,135 T 450,120"
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
                <path
                  d="M 50,105 Q 150,45 250,55 T 450,30"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </svg>

              <div className="flex justify-between text-[10px] font-bold text-slate-400 mt-4 px-2 tracking-wide font-mono uppercase">
                <span>Phase 1 (Upload)</span>
                <span>Phase 2 (Scan Gaps)</span>
                <span>Phase 3 (Inject CAR keywords)</span>
                <span>Phase 4 (Final submission)</span>
              </div>
            </div>

            {/* Custom Legend summary */}
            <div className="flex items-center space-x-6 mt-6 pt-4 border-t border-slate-100 text-xs font-semibold">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 bg-red-500 rounded-full" />
                <span className="text-slate-650">Raw Unoptimized (Avg: 71%)</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 bg-emerald-500 rounded-full" />
                <span className="text-slate-650">Optimized via Gemini (Avg: 94%)</span>
              </div>
            </div>
          </div>

          {/* AI Career roadmap widget generators */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-bold text-xs text-slate-950 uppercase tracking-widest flex items-center gap-1.5">
                  <Compass className="w-4.5 h-4.5 text-blue-600" />
                  <span>AI Career Roadmap generator</span>
                </h4>
                <p className="text-[10px] text-slate-400 mt-0.5">Generate high-reliability milestones targeting Indian SDE pipelines.</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 mt-4">
              <input
                type="text"
                value={selectedRoleForRoadmap}
                onChange={(e) => setSelectedRoleForRoadmap(e.target.value)}
                className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:bg-white"
                placeholder="e.g. Frontend Architect / MERN stack intern"
              />
              <button
                onClick={loadCareerRoadmap}
                disabled={roadmapLoading}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs py-2 px-5 rounded-xl transition-all cursor-pointer flex items-center justify-center space-x-1.5"
                id="generate-roadmap-btn"
              >
                {roadmapLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Compass className="w-4 h-4" />
                    <span>Map Steps</span>
                  </>
                )}
              </button>
            </div>

            {roadmapData && (
              <div className="mt-6 border-t border-slate-100 pt-5 space-y-6">
                <div className="flex items-center space-x-1.5 text-xs font-black text-slate-900 border-l-2 border-indigo-500 pl-2 uppercase">
                  <Sparkles className="w-4 h-4 text-indigo-500" />
                  <span>Roadmap milestones: {roadmapData.role}</span>
                </div>

                <div className="relative border-l-2 border-slate-100 pl-6 ml-2 space-y-6">
                  {roadmapData.steps.map((st, idx) => (
                    <div key={idx} className="relative">
                      <span className="absolute -left-9 top-0.5 bg-blue-600 outline-4 outline-blue-100 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold font-mono">
                        {st.step}
                      </span>
                      <h5 className="font-extrabold text-xs text-slate-900">{st.title}</h5>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {st.items.map((item, i) => (
                          <span key={i} className="text-[10px] bg-slate-50 text-slate-650 border border-slate-200 rounded-lg px-2.5 py-1 font-medium">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {roadmapData.resources && roadmapData.resources.length > 0 && (
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-2 font-mono">Recommended Indian Platforms</span>
                    <div className="flex flex-wrap gap-1.5">
                      {roadmapData.resources.map((res, i) => (
                        <span key={i} className="text-xs font-semibold text-blue-600 bg-blue-50/50 rounded-md py-1 px-2 border border-blue-100">
                          {res}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right column: System alerts & Notifications feed */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col h-[400px]">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest pb-3 border-b border-slate-100 mb-4 block flex items-center gap-1.5">
              <Bell className="w-4.5 h-4.5 text-blue-600" />
              <span>{t.activeNotifications}</span>
            </span>

            <div className="flex-1 overflow-y-auto space-y-4">
              {notifications.map((notif) => (
                <div key={notif.id} className="p-3.5 rounded-xl bg-slate-50/50 border border-slate-200/60 relative">
                  {!notif.read && (
                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full absolute top-4 right-4 animate-ping" />
                  )}
                  <h5 className="font-bold text-xs text-slate-900">{notif.title}</h5>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed font-semibold">{notif.message}</p>
                  <span className="text-[9px] block text-slate-400 mt-2 font-mono">{notif.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* India trending skills listing panel */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm text-left">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest pb-3 border-b border-slate-100 mb-4 block">
              {t.skillsAlert}
            </span>
            <div className="space-y-4">
              {[
                { name: "React (Vite and Next.js Frameworks)", trend: "+45% hiring spikes", desc: "Top demand across Bengaluru startups" },
                { name: "TypeScript Node & Express engines", trend: "+32% index growth", desc: "Enterprise banking and Razorpay stacks" },
                { name: "Docker & PostgreSQL structures", trend: "+18% growth", desc: "MNC graduate migration requirements" }
              ].map((skill, i) => (
                <div key={i} className="flex justify-between items-start gap-4 p-2">
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">{skill.name}</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">{skill.desc}</span>
                  </div>
                  <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 rounded px-2 py-0.5 font-bold shrink-0">
                    {skill.trend}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
