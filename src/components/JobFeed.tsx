import React, { useState, useEffect } from "react";
import { Job, JobMatchResult, UserProfile, SubscriptionStatus } from "../types";
import { Search, MapPin, Briefcase, IndianRupee, Layers, CheckCircle2, ChevronRight, X, User, AlertTriangle, FileText, Clipboard, Sparkles, RefreshCw } from "lucide-react";
import { translations } from "../locale";

interface JobFeedProps {
  profile: UserProfile;
  subscription: SubscriptionStatus;
  onRefreshSubscription: (updated: SubscriptionStatus) => void;
  onApplicationCompleted: () => void;
}

export default function JobFeed({ profile, subscription, onRefreshSubscription, onApplicationCompleted }: JobFeedProps) {
  const [jobs, setJobs] = useState<JobMatchResult[]>([]);
  const [selectedJobResult, setSelectedJobResult] = useState<JobMatchResult | null>(null);
  
  // Advanced Filter state variables
  const [search, setSearch] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [workMode, setWorkMode] = useState("");
  const [minSalary, setMinSalary] = useState("");
  const [expParam, setExpParam] = useState("");
  const [sourceChannel, setSourceChannel] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [autoposting, setAutoposting] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleAIScoutPost = async () => {
    setAutoposting(true);
    try {
      const response = await fetch("/api/jobs/ai-autopost", {
        method: "POST"
      });
      const data = await response.json();
      if (data.success) {
        fetchJobs();
      }
    } catch (err) {
      console.error("AI auto-post error:", err);
    } finally {
      setAutoposting(false);
    }
  };

  // Autofill Drawer panel details
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [autofillLoading, setAutofillLoading] = useState(false);
  const [autofillMapping, setAutofillMapping] = useState<any>(null);
  const [autofillAnswers, setAutofillAnswers] = useState<any>(null);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  // Editable fields in autofill drawer
  const [editedExpectedSalary, setEditedExpectedSalary] = useState("");
  const [editedNoticePeriod, setEditedNoticePeriod] = useState("");
  const [editedWhyHireMe, setEditedWhyHireMe] = useState("");
  const [editedCoverLetter, setEditedCoverLetter] = useState("");

  const indianStates = [
    "Karnataka", "Telangana", "Tamil Nadu", "Maharashtra", "Delhi", "Uttar Pradesh", "West Bengal", "Gujarat"
  ];

  const indianCities = [
    "Bengaluru", "Hyderabad", "Chennai", "Mumbai", "Pune", "Delhi", "Noida", "Gurugram", "Kochi"
  ];

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const qParams = new URLSearchParams();
      if (search) qParams.append("search", search);
      if (state) qParams.append("state", state);
      if (city) qParams.append("city", city);
      if (workMode) qParams.append("workMode", workMode);
      if (minSalary) qParams.append("minSalary", minSalary);
      if (expParam) qParams.append("experience", expParam);
      if (sourceChannel) qParams.append("source", sourceChannel);
      if (selectedDepartment) qParams.append("department", selectedDepartment);

      const response = await fetch(`/api/jobs?${qParams.toString()}`);
      const data = await response.json();
      setJobs(data);
    } catch (err) {
      console.error("Fetch jobs error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [search, state, city, workMode, minSalary, expParam, sourceChannel, selectedDepartment, profile]);

  const loadAutofillQuestions = async (job: Job) => {
    setAutofillLoading(true);
    setDrawerOpen(true);
    setSubmittedSuccess(false);
    try {
      const response = await fetch(`/api/jobs/${job.id}/apply-autofill`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobDescription: job.description,
          jobTitle: job.title,
          companyName: job.company
        })
      });
      const data = await response.json();
      if (response.ok) {
        setAutofillMapping(data.mapping);
        setAutofillAnswers(data.answers);
        
        // Populate inputs
        setEditedExpectedSalary(data.answers.expectedSalaryIndianContext);
        setEditedNoticePeriod(data.answers.noticePeriodIndianContext);
        setEditedWhyHireMe(data.answers.whyHireMeAnswer);
        setEditedCoverLetter(data.answers.customCoverLetter);
      } else {
        alert(data.message || "Failed to trigger AI application copilot.");
        setDrawerOpen(false);
      }
    } catch (err) {
      console.error(err);
      setDrawerOpen(false);
    } finally {
      setAutofillLoading(false);
    }
  };

  const executeFinalSubmission = async () => {
    if (!selectedJobResult) return;
    try {
      const response = await fetch(`/api/jobs/${selectedJobResult.job.id}/submit-application`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          notes: `Applied for ${selectedJobResult.job.title} at ${selectedJobResult.job.company}. Expected Salary: ${editedExpectedSalary}. Notice period: ${editedNoticePeriod}.`,
          coverLetter: editedCoverLetter
        })
      });
      const data = await response.json();
      if (data.success) {
        setSubmittedSuccess(true);
        onRefreshSubscription(data.quota);
        onApplicationCompleted();
        setTimeout(() => {
          setDrawerOpen(false);
          setSelectedJobResult(null);
        }, 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6" id="job-feed-module">
      {/* Top filter banner cards */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4.5 h-4.5 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search SDE internships, startups, MNC software roles..."
              className="w-full bg-slate-50 border border-slate-200/60 rounded-xl py-3 pl-11 pr-4 text-xs font-medium focus:outline-none focus:border-blue-500 focus:bg-white"
            />
          </div>

          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {/* EXP LEVEL FILTER */}
            <select
              value={expParam}
              onChange={(e) => setExpParam(e.target.value)}
              className="px-4 py-3 bg-slate-50 border border-slate-200/60 rounded-xl text-xs text-slate-600 font-semibold focus:outline-none"
            >
              <option value="">Exp Level (Any)</option>
              <option value="fresher">Fresher Trainees (0 Exp)</option>
              <option value="experienced">Experienced SDEs</option>
            </select>

            {/* STATE FILTER */}
            <select
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="px-4 py-3 bg-slate-50 border border-slate-200/60 rounded-xl text-xs text-slate-600 font-semibold focus:outline-none"
            >
              <option value="">State (Any)</option>
              {indianStates.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            {/* CITY FILTER */}
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="px-4 py-3 bg-slate-50 border border-slate-200/60 rounded-xl text-xs text-slate-600 font-semibold focus:outline-none"
            >
              <option value="">City (Any)</option>
              {indianCities.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Dynamic bottom filter tabs row */}
        <div className="flex flex-wrap items-center gap-4 pt-3 border-t border-slate-100 text-xs font-semibold text-slate-500">
          <div className="flex gap-2">
            {(["Remote", "Hybrid", "On-site"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setWorkMode(workMode === mode ? "" : mode)}
                className={`px-3 py-1.5 rounded-lg border transition-all ${
                  workMode === mode
                    ? "bg-blue-50 border-blue-200 text-blue-700"
                    : "bg-white border-slate-200 text-slate-500 hover:border-slate-300"
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          <div className="h-4 w-[1px] bg-slate-200 hidden sm:block" />

          <div className="flex gap-2">
            {[
              { label: "₹3-₹6 LPA", val: "3" },
              { label: "₹6-₹10 LPA", val: "6" },
              { label: "₹10-₹20 LPA", val: "10" },
              { label: "₹20+ LPA", val: "20" }
            ].map((sal) => (
              <button
                key={sal.val}
                onClick={() => setMinSalary(minSalary === sal.val ? "" : sal.val)}
                className={`px-3 py-1.5 rounded-lg border transition-all ${
                  minSalary === sal.val
                    ? "bg-indigo-50 border-indigo-200 text-indigo-700"
                    : "bg-white border-slate-200 hover:border-slate-300"
                }`}
              >
                {sal.label}
              </button>
            ))}
          </div>

          <div className="h-4 w-[1px] bg-slate-200 hidden lg:block" />

          {/* SOURCE AGGREGATOR CHANNELS */}
          <div className="hidden lg:flex gap-2">
            {["LinkedIn India", "Naukri", "Internshala", "startup hiring portals"].map((src) => (
              <button
                key={src}
                onClick={() => setSourceChannel(sourceChannel === src ? "" : src)}
                className={`px-3 py-1.5 rounded-lg border transition-all capitalize ${
                  sourceChannel === src
                    ? "bg-slate-900 border-slate-900 text-white"
                    : "bg-white border-slate-200 hover:border-slate-300"
                }`}
              >
                {src === "startup hiring portals" ? "Startups" : src}
              </button>
            ))}
          </div>
        </div>

        {/* Department specific category selection & AI Active Auto Scout controls */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pt-4 border-t border-slate-100">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mr-2">Category:</span>
            {[
              { label: "All Sectors", val: "" },
              { label: "Tech", val: "Technology" },
              { label: "Medical", val: "Medical" },
              { label: "HR & Recruiters", val: "HR" },
              { label: "Finance", val: "Finance" },
              { label: "Sales & Client Management", val: "Sales" }
            ].map((dept) => (
              <button
                key={dept.val}
                onClick={() => setSelectedDepartment(dept.val)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  selectedDepartment === dept.val
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/15"
                    : "bg-slate-50 border border-slate-200/60 hover:bg-slate-100 text-slate-650"
                }`}
              >
                {dept.label}
              </button>
            ))}
          </div>

          <button
            onClick={handleAIScoutPost}
            disabled={autoposting}
            className="flex items-center justify-center gap-2 px-4.5 py-2.5 bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md shadow-emerald-500/10 shrink-0 select-none"
          >
            {autoposting ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            )}
            <span>{autoposting ? "AI Agent Sourcing..." : "AI Scout: Post Indian Job"}</span>
          </button>
        </div>
      </div>

      {/* Main jobs container */}
      <div className="grid lg:grid-cols-5 gap-8">
        {/* Jobs Feed List */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex justify-between items-center text-xs font-bold text-slate-400 uppercase tracking-widest border-l-2 border-blue-500 pl-2">
            <span>Aggregated Matching Recommendations</span>
            <span className="text-[10px] text-slate-500 font-medium lowercase">({jobs.length} roles found with minimum 70% Match)</span>
          </div>

          {loading ? (
            <div className="p-16 text-center space-y-4 bg-white rounded-3xl border border-slate-200/80">
              <RefreshCw className="w-8 h-8 text-blue-500 animate-spin mx-auto" />
              <p className="text-xs text-slate-500 font-semibold">Recalculating compatibility matching scores...</p>
            </div>
          ) : jobs.length > 0 ? (
            <div className="space-y-4">
              {jobs.map((item) => (
                <div
                  key={item.job.id}
                  onClick={() => setSelectedJobResult(item)}
                  className={`p-6 rounded-2xl border transition-all cursor-pointer text-left relative ${
                    selectedJobResult?.job.id === item.job.id
                      ? "bg-blue-50/40 border-blue-600 shadow-md"
                      : "bg-white border-slate-200/80 hover:border-slate-350"
                  }`}
                >
                  {/* Matching Compatibility Metrics Display */}
                  <div className="absolute top-6 right-6 flex items-center space-x-2">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                      item.matchScore >= 90
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200/80"
                        : item.matchScore >= 80
                        ? "bg-blue-50 text-blue-700 border border-blue-200/80"
                        : "bg-amber-50 text-amber-700 border border-amber-200/80"
                    }`}>
                      {item.matchScore}% Match
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-sm text-slate-900 group-hover:text-blue-600 w-[70%]">
                      {item.job.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 text-slate-500 text-xs mt-1 font-medium">
                      <span>{item.job.company}</span>
                      <span>&bull;</span>
                      <span className="flex items-center gap-0.5 mr-1">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{item.job.location.split(",")[0]}</span>
                      </span>
                      {item.job.department && (
                        <span className="bg-blue-50/80 text-blue-600 border border-blue-100/50 px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase tracking-wider">
                          {item.job.department}
                        </span>
                      )}
                    </div>

                    {/* Metadata summary info */}
                    <div className="flex items-center gap-4 mt-4 py-2 border-y border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      <span className="flex items-center gap-1">
                        <IndianRupee className="w-3.5 h-3.5 text-slate-500" />
                        <span className="text-slate-600">{item.job.salaryRange}</span>
                      </span>
                      <span>&bull;</span>
                      <span className="flex items-center gap-1">
                        <Briefcase className="w-3.5 h-3.5 text-slate-500" />
                        <span className="text-slate-600">{item.job.experienceRequired}</span>
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mt-4">
                      {item.job.skillsRequired.map((skill, idx) => (
                        <span
                          key={idx}
                          className="text-[9px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-650 px-2.5 py-1 rounded-md"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-slate-100/50 p-16 text-center text-slate-500 border border-dashed border-slate-300 rounded-3xl">
              <Layers className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="text-xs font-semibold text-slate-800">No jobs match your criteria with min 70% match score.</p>
              <p className="text-[10px] mt-1">Try updating your skills list in the Profile tab to align better.</p>
            </div>
          )}
        </div>

        {/* Selected Job details Card */}
        <div className="lg:col-span-2">
          {selectedJobResult ? (
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-6 text-left position-sticky top-24">
              <div className="border-b border-indigo-50 pb-4">
                <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Match score breakdown</span>
                
                <div className="flex items-center space-x-3 mt-3">
                  <div className="bg-slate-900 text-emerald-400 p-4 rounded-2xl font-extrabold text-2xl">
                    {selectedJobResult.matchScore}%
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-950 flex items-center gap-1">
                      <span>ATS Compatibility</span>
                      <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                    </h4>
                    <span className="text-[10px] block mt-0.5 text-slate-600 font-medium">
                      Skill Align: <strong className="text-indigo-600">{selectedJobResult.skillMatch}</strong> | Salary Check: <strong className="text-indigo-600">{selectedJobResult.salaryMatch}</strong>
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-sm text-slate-950">{selectedJobResult.job.title}</h3>
                <p className="text-xs text-slate-410 font-bold mt-1 uppercase tracking-wider">{selectedJobResult.job.company}</p>
                <div className="mt-4 p-4 bg-slate-50/50 rounded-2xl border border-slate-150 text-xs text-slate-500 leading-relaxed font-medium">
                  {selectedJobResult.job.description}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => loadAutofillQuestions(selectedJobResult.job)}
                  className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center justify-center space-x-2 cursor-pointer shadow-blue-500/10"
                >
                  <span>{translations[profile.gender === "Female" ? "te" : "en"].applyNow}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 p-12 text-center text-slate-400 shadow-inner">
              <Briefcase className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <h5 className="font-bold text-xs text-slate-750">No Job Selected</h5>
              <p className="text-[11px] mt-1">Select any recommendation from the feed to examine deep compatibility scorecards.</p>
            </div>
          )}
        </div>
      </div>

      {/* Assisted Autofill Slider Drawer overlay container */}
      {drawerOpen && selectedJobResult && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-end transition-all">
          <div className="w-full max-w-2xl bg-white h-screen flex flex-col relative shadow-2xl overflow-hidden animate-slide-in">
            {/* Top Close header */}
            <div className="p-6 bg-slate-950 text-white flex justify-between items-center border-b border-slate-800">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-500/15 p-2 rounded-xl text-blue-400 border border-blue-500/20">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-xs uppercase tracking-widest text-slate-300">Autofill Application preview</h4>
                  <span className="text-[10px] block text-blue-400 mt-0.5">{selectedJobResult.job.title} &bull; {selectedJobResult.job.company}</span>
                </div>
              </div>
              <button
                onClick={() => setDrawerOpen(false)}
                className="text-slate-400 hover:text-white p-2 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Inner Body Content */}
            <div className="flex-1 p-6 overflow-y-auto space-y-6 text-left">
              {autofillLoading ? (
                <div className="p-16 text-center space-y-4">
                  <RefreshCw className="w-8 h-8 text-blue-500 animate-spin mx-auto" />
                  <p className="text-xs text-slate-500 font-semibold">Gemini is mapping candidate coordinates & answering questions...</p>
                </div>
              ) : submittedSuccess ? (
                <div className="p-12 text-center space-y-4">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h4 className="font-extrabold text-slate-900 text-sm">Application Sent & Tracker Active!</h4>
                  <p className="text-xs text-slate-550 leading-relaxed max-w-sm mx-auto">
                    The copilot prepared your forms without auto-submitting. We verified your details, mapped constraints, and logged to the Application tracker pipeline. We have updated your daily quota count limits.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Anti-Bot Guard Notice (Safety warning) */}
                  <div className="p-4 bg-amber-50 text-amber-800 rounded-2xl border border-amber-200 flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-bold block">Safety ATS Guard Active</span>
                      <p className="text-[10px] text-amber-700/90 mt-1 leading-relaxed">
                        Detected system: <strong>{autofillAnswers?.detectedATS || "Greenhouse"}</strong>. To ensure compliance and safeguard your account against automated bot trackers, the Career Copilot platform implements simulated delay offsets. Limit actions to 10 per hour.
                      </p>
                    </div>
                  </div>

                  {/* Personal Prepopulated metrics summary */}
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
                    <h5 className="font-bold text-xs text-slate-950 uppercase border-b border-slate-200 pb-2 mb-3">
                      Manual verification checkpoint
                    </h5>

                    <div className="grid grid-cols-2 gap-4 text-xs font-medium">
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase">Name of Candidate</span>
                        <span className="text-slate-800 font-semibold">{autofillMapping?.fullName}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase">Academics Mapped</span>
                        <span className="text-slate-800 font-semibold">{autofillMapping?.education}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase">Active CV File</span>
                        <span className="text-slate-800 font-semibold flex items-center gap-1 mt-0.5">
                          <FileText className="w-3.5 h-3.5 text-slate-500" />
                          <span>{profile.resumeFileName}</span>
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase">Target Work Location</span>
                        <span className="text-slate-800 font-semibold">{selectedJobResult.job.location.split(",")[0]}</span>
                      </div>
                    </div>
                  </div>

                  {/* Editable AI generated Answers questions */}
                  <div className="space-y-4">
                    <span className="text-xs font-bold text-indigo-600 block uppercase border-l-2 border-indigo-600 pl-2">AI-Generated Answers</span>
                    
                    <div>
                      <label className="block text-xs font-bold text-slate-600">Expected Salary (₹ LPA Context)</label>
                      <input
                        type="text"
                        value={editedExpectedSalary}
                        onChange={(e) => setEditedExpectedSalary(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-600">Availability / Notice Period</label>
                      <input
                        type="text"
                        value={editedNoticePeriod}
                        onChange={(e) => setEditedNoticePeriod(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-600">Tell Us Why You Should Be Hired (Custom Mapped)</label>
                      <textarea
                        value={editedWhyHireMe}
                        onChange={(e) => setEditedWhyHireMe(e.target.value)}
                        className="mt-1 block w-full h-24 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-600">Custom Prepared Cover Letter</label>
                      <textarea
                        value={editedCoverLetter}
                        onChange={(e) => setEditedCoverLetter(e.target.value)}
                        className="mt-1 block w-full h-40 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium resize-none font-sans leading-relaxed"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Actions button */}
            {!submittedSuccess && !autofillLoading && (
              <div className="p-6 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block font-mono">
                    {subscription.tier === "Free" ? "Daily Trial usage" : `${subscription.tier} Copilot usage`}
                  </span>
                  <span className="text-xs font-bold text-slate-700">
                    {subscription.tier === "Free" ? (
                      `${subscription.remainingApplicationsToday} remaining today`
                    ) : (autofillAnswers?.detectedATS && autofillAnswers.detectedATS !== "None") ? (
                      `${subscription.remainingApplicationsToday} remaining for ${autofillAnswers.detectedATS}`
                    ) : (
                      "Unlimited (Direct/No Bot limits)"
                    )}
                  </span>
                </div>
                
                <button
                  onClick={executeFinalSubmission}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-3 px-6 rounded-xl transition-all shadow-md flex items-center space-x-1.5 cursor-pointer"
                  id="final-approve-apply-btn"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Manual Consent & Apply</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
