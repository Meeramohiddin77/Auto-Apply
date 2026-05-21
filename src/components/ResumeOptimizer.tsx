import React, { useState } from "react";
import { ATSReport, UserProfile } from "../types";
import { Sparkles, CheckCircle, FileText, Share2, Clipboard, AlertCircle, RefreshCw, Layers, PenTool } from "lucide-react";
import AtsResumeBuilder from "./AtsResumeBuilder";

interface ResumeOptimizerProps {
  userSkills: string[];
  userProfile?: UserProfile;
}

export default function ResumeOptimizer({ userSkills, userProfile }: ResumeOptimizerProps) {
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<ATSReport | null>(null);
  const [selectedTab, setSelectedTab] = useState<"analysis" | "bullets" | "cover">("analysis");
  const [clipboardMsg, setClipboardMsg] = useState("");
  
  // Choose between "auditor" and "builder" tab
  const [activeSegment, setActiveSegment] = useState<"auditor" | "builder">("auditor");

  const triggerOptimization = async () => {
    if (!jobDescription) return;
    setLoading(true);
    try {
      const response = await fetch("/api/ats/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobDescription,
          sourceText: `Skills: ${userSkills.join(", ")}`
        })
      });
      const data = await response.json();
      if (data.success && data.report) {
         setReport(data.report);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setClipboardMsg("Copied cleanly to clipboard!");
    setTimeout(() => setClipboardMsg(""), 3000);
  };

  // Fallback profile if none provided to prevent crash
  const selectedProfile: UserProfile = userProfile || {
    fullName: "Arjun Sharma",
    email: "arjun.sharma@gmail.com",
    phone: "+91 98765 43210",
    city: "Bengaluru",
    state: "Karnataka",
    dob: "2003-04-12",
    gender: "Male",
    skills: userSkills || [],
    degree: "B.Tech in Computer Science",
    specialization: "Software Engineering",
    collegeName: "Vellore Institute of Technology (VIT)",
    graduationYear: "2024",
    projects: [],
    workExperience: [],
    expectedCTC: "8",
    noticePeriod: "Immediate",
    joiningAvailability: "Immediate",
    certifications: [],
    experienceLevel: "Fresher (0 Years)" as any,
    technologies: [],
    preferredRole: "Frontend Developer",
    preferredLocations: ["Bengaluru"],
    willingToRelocate: true,
    profileStrengthScore: 78,
    atsBaseScore: 71
  };

  return (
    <div className="space-y-8" id="resume-optimizer-section">
      {/* Primary Tab Headers Option bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-slate-200 pb-5">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-600 animate-pulse" />
            <span>Placement ATS Resume Lab</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Build print-ready resumes or scan existing documents with Gemini's applicant tracking rules.
          </p>
        </div>

        {/* Tab Toggle buttons */}
        <div className="bg-slate-100 p-1 rounded-2xl border border-slate-200 flex shrink-0 self-stretch md:self-auto select-none">
          <button
            onClick={() => setActiveSegment("auditor")}
            className={`flex items-center gap-1.5 px-4.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSegment === "auditor" 
                ? "bg-white text-slate-900 shadow-sm" 
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Gap & Keywords Auditor</span>
          </button>
          <button
            onClick={() => setActiveSegment("builder")}
            className={`flex items-center gap-1.5 px-4.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSegment === "builder" 
                ? "bg-white text-blue-600 shadow-sm" 
                : "text-slate-500 hover:text-slate-700"
            }`}
            id="open-builder-segment-btn"
          >
            <PenTool className="w-3.5 h-3.5" />
            <span>Vector Resume Builder</span>
          </button>
        </div>
      </div>

      {activeSegment === "builder" ? (
        <AtsResumeBuilder initialProfile={selectedProfile} />
      ) : (
        <div className="grid lg:grid-cols-5 gap-8">

        {/* Input Pane */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 space-y-4 shadow-sm">
            <h4 className="font-bold text-xs text-slate-950 uppercase tracking-widest border-b border-slate-100 pb-2">
              Target Job Description
            </h4>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-2">Paste Job Specifications</label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste requirements here (e.g. 'Looking for a Frontend Developer with React, TypeScript, and unit testing experience...')"
                className="w-full h-80 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-blue-500 focus:bg-white resize-none"
              />
            </div>

            <button
              onClick={triggerOptimization}
              disabled={loading || !jobDescription}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold text-xs py-3 rounded-xl transition-all flex items-center justify-center space-x-2 shadow-md shadow-blue-500/10 cursor-pointer"
              id="optimize-trigger-btn"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Analyzing Gaps with Gemini...</span>
                </>
              ) : (
                <>
                  <Layers className="w-4 h-4" />
                  <span>Analyze & Optimize Resume</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results Pane */}
        <div className="lg:col-span-3">
          {report ? (
            <div className="space-y-6">
              {clipboardMsg && (
                <div className="p-3 bg-emerald-50 text-emerald-800 text-xs font-semibold rounded-lg border border-emerald-200 flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>{clipboardMsg}</span>
                </div>
              )}

              {/* Dynamic Scoreboard */}
              <div className="grid grid-cols-2 gap-4 bg-slate-900 text-white p-6 rounded-3xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-slate-800 rounded-full blur-2xl opacity-50" />
                
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block">Original Match</span>
                  <div className="flex items-baseline mt-1 space-x-1.5">
                    <span className="text-4xl font-extrabold tracking-tight text-slate-300">{report.beforeScore}%</span>
                    <span className="text-xs text-red-400 font-bold">Unoptimized</span>
                  </div>
                </div>

                <div className="border-l border-slate-800 pl-6 relative">
                  <span className="text-[10px] text-blue-400 font-bold uppercase tracking-widest block">Post-Optimization</span>
                  <div className="flex items-baseline mt-1 space-x-1.5">
                    <span className="text-4xl font-extrabold tracking-tight text-emerald-400">{report.afterScore}%</span>
                    <span className="text-xs text-emerald-400 font-bold">Excellent</span>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-slate-200">
                {(["analysis", "bullets", "cover"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setSelectedTab(tab)}
                    className={`py-3 px-6 text-xs font-bold capitalize border-b-2 transition-all ${
                      selectedTab === tab
                        ? "border-blue-600 text-blue-600"
                        : "border-transparent text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    {tab === "analysis" ? "Semantic Keywords Gap" : tab === "bullets" ? "CAR Optimized Bullets" : "Generated Cover Letter"}
                  </button>
                ))}
              </div>

              {/* Tab: Analysis */}
              {selectedTab === "analysis" && (
                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 space-y-6 shadow-sm">
                  {/* Missing keywords */}
                  <div>
                    <h5 className="font-bold text-xs text-slate-950 flex items-center gap-1.5 mb-3">
                      <AlertCircle className="w-4 h-4 text-amber-500" />
                      <span>Missing High-Context Keywords ({report.missingKeywords.length})</span>
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {report.missingKeywords.map((kw, idx) => (
                        <span key={idx} className="bg-amber-50 text-amber-800 border border-amber-200 rounded-lg px-3 py-1 text-xs font-semibold">
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h5 className="font-bold text-xs text-slate-950 flex items-center gap-1.5 mb-3">
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                      <span>Suggested Additions</span>
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {report.addedKeywords.map((kw, idx) => (
                        <span key={idx} className="bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg px-3 py-1 text-xs font-semibold">
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400">Formatting Analytics</span>
                      <p className="text-xs text-slate-600 mt-1 pb-1 leading-relaxed">
                        {report.formattingAnalysis}
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400">Readability Review</span>
                      <p className="text-xs text-slate-600 mt-1 pb-1 leading-relaxed">
                        {report.readabilityFeedback}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab: Bullets */}
              {selectedTab === "bullets" && (
                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 space-y-4 shadow-sm">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                    <span className="text-xs font-semibold text-slate-500">Copy optimized CAR items into your resume experience section:</span>
                  </div>

                  <div className="space-y-4">
                    {report.optimizedBulletPoints.map((bullet, idx) => (
                      <div key={idx} className="group p-4 bg-slate-50 hover:bg-blue-50/20 rounded-xl border border-slate-200 transition-all">
                        <p className="text-xs text-slate-800 font-medium leading-relaxed">
                          {bullet}
                        </p>
                        <div className="mt-3 flex justify-end">
                          <button
                            onClick={() => copyToClipboard(bullet)}
                            className="bg-white hover:bg-slate-100 p-1.5 rounded border border-slate-200 text-slate-600 text-[10px] font-bold flex items-center space-x-1 cursor-pointer"
                          >
                            <Clipboard className="w-3.5 h-3.5" />
                            <span>Copy Bullet</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab: Cover Letter */}
              {selectedTab === "cover" && (
                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 space-y-4 shadow-sm">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                    <span className="text-xs font-semibold text-slate-500">Custom Targeted Cover Letter</span>
                    <button
                      onClick={() => {
                        const sampleLetter = `Dear Hiring Team,\n\nI am eager to apply for the position described. Given my background in ${userSkills.slice(0, 4).join(", ")}, I have proper compatibility...`;
                        copyToClipboard(sampleLetter);
                      }}
                      className="text-xs text-blue-600 hover:text-blue-700 font-bold flex items-center space-x-1 cursor-pointer"
                    >
                      <Clipboard className="w-4 h-4" />
                      <span>Copy Letter</span>
                    </button>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <pre className="text-xs text-slate-700 whitespace-pre-wrap font-sans leading-relaxed">
                      {`Dear Hiring Team,\n\nBased on your requirements, I am excited to apply for this opening. With competencies across web tools, robust state managers, and deployment patterns, I have excellent alignment to hit your goals. Specifically, I have worked on e-commerce artisan models like IndiCart and localized logistics solutions, proving my ability to ship reliable systems under fast timelines.\n\nThank you for your consideration.\n\nSincerely,\nCandidate`}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 p-16 text-center text-slate-500 shadow-inner">
              <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h5 className="font-bold text-sm text-slate-800">No Target Job Analysed</h5>
              <p className="text-xs mt-1.5 max-w-sm mx-auto leading-relaxed">
                Paste the job requirements description in the left panel and click 'Analyze' to execute our Gemini optimization scanning loops.
              </p>
            </div>
          )}
        </div>
      </div>
    )}
  </div>
  );
}
