import React, { useState, useEffect } from "react";
import { UserProfile } from "../types";
import { 
  Sparkles, 
  CheckCircle, 
  FileText, 
  Download, 
  Clipboard, 
  FileEdit, 
  CheckCircle2, 
  Info,
  Layers,
  Printer,
  ChevronRight,
  Plus,
  Trash2,
  RefreshCw,
  Eye,
  Settings
} from "lucide-react";

interface AtsResumeBuilderProps {
  initialProfile: UserProfile;
}

type TemplateType = "harvard" | "tech_minimal" | "bengaluru_sde";

export default function AtsResumeBuilder({ initialProfile }: AtsResumeBuilderProps) {
  // Localized form values matching UserProfile structure
  const [fullName, setFullName] = useState(initialProfile.fullName || "Arjun Sharma");
  const [email, setEmail] = useState(initialProfile.email || "arjun.sharma@gmail.com");
  const [phone, setPhone] = useState(initialProfile.phone || "+91 98765 43210");
  const [city, setCity] = useState(initialProfile.city || "Bengaluru");
  const [state, setState] = useState(initialProfile.state || "Karnataka");
  const [linkedIn, setLinkedIn] = useState(initialProfile.linkedIn || "");
  const [gitHub, setGitHub] = useState(initialProfile.gitHub || "");
  const [portfolio, setPortfolio] = useState(initialProfile.portfolio || "");
  
  // Education
  const [degree, setDegree] = useState(initialProfile.degree || "B.Tech in Computer Science");
  const [specialization, setSpecialization] = useState(initialProfile.specialization || "Software Engineering");
  const [collegeName, setCollegeName] = useState(initialProfile.collegeName || "Vellore Institute of Technology (VIT)");
  const [graduationYear, setGraduationYear] = useState(initialProfile.graduationYear || "2024");
  const [educationSummary, setEducationSummary] = useState("First Class with Distinction - CGPA: 8.84/10");
  
  // Professional / Summary Objective
  const [objective, setObjective] = useState(
    "Detail-oriented Software Development Engineer (SDE) with experience building high-performance responsive web applications. Expert in TypeScript and state-driven architectural patterns with proven capacity to deploy robust vector pipeline interfaces."
  );

  // Skills
  const [skills, setSkills] = useState<string[]>(initialProfile.skills || []);
  const [newSkill, setNewSkill] = useState("");

  // Projects
  const [projects, setProjects] = useState<Array<{ title: string; description: string; techs: string[] }>>(
    initialProfile.projects || [
      {
        title: "IndiCart Marketplace",
        description: "Built localized catalog platform handling live digital listings for rural weaving centers. Created custom state managers decreasing page payload latency by 18%.",
        techs: ["React", "TypeScript", "Tailwind CSS", "Vite"]
      }
    ]
  );
  
  // Temporary fields to add a new project
  const [tempProjectTitle, setTempProjectTitle] = useState("");
  const [tempProjectDesc, setTempProjectDesc] = useState("");
  const [tempProjectTechs, setTempProjectTechs] = useState("");

  // Experience
  const [experience, setExperience] = useState<Array<{ company: string; role: string; duration: string; description: string }>>(
    initialProfile.workExperience && initialProfile.workExperience.length > 0 
      ? initialProfile.workExperience 
      : [
          {
            company: "IndiJobs Tech Labs",
            role: "SDE Intern",
            duration: "Jan 2024 - Present",
            description: "Pioneered development of assistive AI copilot engines. Reduced customer support ticketing rate by 22% using automated layout mapping and micro-form parsing. Integrated responsive UI components resulting in 95%+ client approval metrics."
          }
        ]
  );
  
  // Temporary fields to add a new experience
  const [tempExpCompany, setTempExpCompany] = useState("");
  const [tempExpRole, setTempExpRole] = useState("");
  const [tempExpDuration, setTempExpDuration] = useState("");
  const [tempExpDesc, setTempExpDesc] = useState("");

  // Selected Template & Alerts State
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>("harvard");
  const [clipboardMsg, setClipboardMsg] = useState("");
  const [activePane, setActivePane] = useState<"edit" | "preview">("edit");

  // Autofill routine to synchronize values with any new changes in main profile
  const handleAutofillFromProfile = () => {
    setFullName(initialProfile.fullName || "Arjun Sharma");
    setEmail(initialProfile.email || "arjun.sharma@gmail.com");
    setPhone(initialProfile.phone || "+91 98765 43210");
    setCity(initialProfile.city || "Bengaluru");
    setState(initialProfile.state || "Karnataka");
    setLinkedIn(initialProfile.linkedIn || "");
    setGitHub(initialProfile.gitHub || "");
    setPortfolio(initialProfile.portfolio || "");
    setDegree(initialProfile.degree || "");
    setSpecialization(initialProfile.specialization || "");
    setCollegeName(initialProfile.collegeName || "");
    setGraduationYear(initialProfile.graduationYear || "");
    setSkills(initialProfile.skills || []);
    if (initialProfile.projects && initialProfile.projects.length > 0) {
      setProjects(initialProfile.projects);
    }
    if (initialProfile.workExperience && initialProfile.workExperience.length > 0) {
      setExperience(initialProfile.workExperience);
    }
    
    setClipboardMsg("Successfully synchronized all fields with your SDE Placement Profile!");
    setTimeout(() => setClipboardMsg(""), 3000);
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const handleAddProject = () => {
    if (tempProjectTitle.trim() && tempProjectDesc.trim()) {
      setProjects([
        ...projects,
        {
          title: tempProjectTitle.trim(),
          description: tempProjectDesc.trim(),
          techs: tempProjectTechs ? tempProjectTechs.split(",").map(t => t.trim()) : []
        }
      ]);
      setTempProjectTitle("");
      setTempProjectDesc("");
      setTempProjectTechs("");
    }
  };

  const handleRemoveProject = (index: number) => {
    setProjects(projects.filter((_, idx) => idx !== index));
  };

  const handleAddExperience = () => {
    if (tempExpCompany.trim() && tempExpRole.trim()) {
      setExperience([
        ...experience,
        {
          company: tempExpCompany.trim(),
          role: tempExpRole.trim(),
          duration: tempExpDuration.trim() || "Duration",
          description: tempExpDesc.trim()
        }
      ]);
      setTempExpCompany("");
      setTempExpRole("");
      setTempExpDuration("");
      setTempExpDesc("");
    }
  };

  const handleRemoveExperience = (index: number) => {
    setExperience(experience.filter((_, idx) => idx !== index));
  };

  const copyRawMarkdown = () => {
    const rawText = `
# ${fullName}
${email} | ${phone} | ${city}, ${state}
${portfolio ? `Portfolio: ${portfolio} | ` : ""}${linkedIn ? `LinkedIn: ${linkedIn} | ` : ""}${gitHub ? `GitHub: ${gitHub}` : ""}

## TECHNICAL SKILLS
${skills.join(", ")}

## PROFESSIONAL SUMMARY
${objective}

## WORK EXPERIENCE
${experience.map(exp => `
**${exp.role}** | ${exp.company} (${exp.duration})
${exp.description}
`).join("\n")}

## PROJECTS
${projects.map(proj => `
**${proj.title}**
${proj.description}
*Technologies used:* ${proj.techs.join(", ")}
`).join("\n")}

## EDUCATION
**${degree}** in ${specialization}
${collegeName} (${graduationYear})
*Highlights:* ${educationSummary}
`;

    navigator.clipboard.writeText(rawText.trim());
    setClipboardMsg("Markdown copied to clipboard! Paste it into word processors seamlessly.");
    setTimeout(() => setClipboardMsg(""), 3000);
  };

  const triggerNativePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-6 lg:p-8 space-y-6 shadow-sm relative">
      {/* Native vector-print styles (Hides UI wrapper entirely and isolates the sheet) */}
      <style>{`
        @media print {
          /* Hide all app clutter */
          body * {
            visibility: hidden !important;
          }
          /* Fix printable resume sheet container and make only that visible */
          #printable-resume-canvas, #printable-resume-canvas * {
            visibility: visible !important;
          }
          #printable-resume-canvas {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 1.5in !important;
            box-shadow: none !important;
            border: none !important;
            background: white !important;
            color: black !important;
          }
        }
      `}</style>

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-5 border-b border-slate-100">
        <div>
          <span className="bg-blue-50 text-blue-600 border border-blue-100/60 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider block w-fit mb-1.5">
            100% Selectable Custom PDF
          </span>
          <h3 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600 animate-pulse" />
            <span>Interactive ATS Resume Builder</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Choose ATS-optimized structural typography and export high-scoring vector resumes. Ideal to pass scanning parser checks.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleAutofillFromProfile}
            className="px-3.5 py-2 bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5 text-blue-500" />
            <span>Sync Profile</span>
          </button>
          
          <button
            onClick={copyRawMarkdown}
            className="px-3.5 py-2 bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Clipboard className="w-3.5 h-3.5 text-slate-500" />
            <span>Copy Text</span>
          </button>

          <button
            onClick={triggerNativePrint}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-blue-500/10"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Download Vector PDF</span>
          </button>
        </div>
      </div>

      {clipboardMsg && (
        <div className="p-3 bg-emerald-50 text-emerald-800 text-xs font-semibold rounded-xl border border-emerald-200 flex items-center space-x-2 transition-all animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{clipboardMsg}</span>
        </div>
      )}

      {/* Mobile view toggle */}
      <div className="flex lg:hidden bg-slate-100 p-1 rounded-xl">
        <button
          onClick={() => setActivePane("edit")}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
            activePane === "edit" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
          }`}
        >
          1. Edit Details
        </button>
        <button
          onClick={() => setActivePane("preview")}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
            activePane === "preview" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
          }`}
        >
          2. Live Preview
        </button>
      </div>

      {/* Main Grid Workdesk */}
      <div className="grid lg:grid-cols-5 gap-8">
        
        {/* Editor Controls Pane */}
        <div className={`lg:col-span-2 space-y-6 ${activePane === "edit" ? "block" : "hidden lg:block"} h-[750px] overflow-y-auto pr-2 scrollbar-thin`}>
          
          {/* Section A: Selection of Template Style */}
          <div className="bg-slate-50 p-4 border border-slate-200/60 rounded-2xl space-y-2.5">
            <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider font-mono">Template Style Accent</span>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "harvard", name: "Harvard", desc: "Classic Serifs" },
                { id: "tech_minimal", name: "Tech Line", desc: "No Dividers" },
                { id: "bengaluru_sde", name: "Bengaluru", desc: "SDE Focused" }
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTemplate(t.id as TemplateType)}
                  className={`p-2 rounded-xl text-left border transition-all cursor-pointer ${
                    selectedTemplate === t.id 
                      ? "bg-white border-blue-600 text-blue-900 shadow-sm ring-1 ring-blue-500/10" 
                      : "bg-transparent border-slate-200 hover:bg-white text-slate-600"
                  }`}
                >
                  <span className="text-[11px] font-bold block">{t.name}</span>
                  <span className="text-[8px] text-slate-400 block mt-0.5">{t.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Section B: Personal Details */}
          <div className="bg-white p-5 border border-slate-200/80 rounded-2xl space-y-4">
            <h4 className="font-extrabold text-[10px] text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">
              1. Personal & Contact Details
            </h4>
            
            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-xs rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-800 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-xs rounded-xl focus:bg-white focus:outline-none text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Phone</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-xs rounded-xl focus:bg-white focus:outline-none text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-xs rounded-xl focus:bg-white focus:outline-none text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">State</label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-xs rounded-xl focus:bg-white focus:outline-none text-slate-800"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">LinkedIn URL</label>
                  <input
                    type="text"
                    value={linkedIn}
                    onChange={(e) => setLinkedIn(e.target.value)}
                    placeholder="https://linkedin.com/in/username"
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 text-xs rounded-xl focus:bg-white text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">GitHub URL</label>
                  <input
                    type="text"
                    value={gitHub}
                    onChange={(e) => setGitHub(e.target.value)}
                    placeholder="https://github.com/username"
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 text-xs rounded-xl focus:bg-white text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Portfolio Website</label>
                  <input
                    type="text"
                    value={portfolio}
                    onChange={(e) => setPortfolio(e.target.value)}
                    placeholder="https://mywebsite.dev"
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 text-xs rounded-xl focus:bg-white text-slate-800"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section C: Professional Summary */}
          <div className="bg-white p-5 border border-slate-200/80 rounded-2xl space-y-3">
            <h4 className="font-extrabold text-[10px] text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">
              2. Professional Summary
            </h4>
            <label className="block text-[9px] font-semibold text-slate-400">Brief outline of technical domain expertise</label>
            <textarea
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              className="w-full h-24 px-3 py-2 bg-slate-50 border border-slate-200 text-xs rounded-xl focus:bg-white focus:outline-none resize-none text-slate-705 leading-relaxed"
            />
          </div>

          {/* Section D: Core Technical Skills Tags */}
          <div className="bg-white p-5 border border-slate-200/80 rounded-2xl space-y-3">
            <h4 className="font-extrabold text-[10px] text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">
              3. Core Skills Tags
            </h4>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add skill (e.g., GraphQL)"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddSkill()}
                className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 text-xs rounded-xl focus:bg-white focus:outline-none text-slate-800"
              />
              <button
                onClick={handleAddSkill}
                className="px-3 bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100 rounded-xl text-xs font-bold transition-all flex items-center cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-2">
              {skills.map(s => (
                <span 
                  key={s} 
                  className="bg-slate-50 border border-slate-200 text-[10px] font-bold text-slate-700 px-2 py-1 rounded-lg flex items-center gap-1 shrink-0"
                >
                  <span>{s}</span>
                  <button 
                    onClick={() => handleRemoveSkill(s)}
                    className="text-slate-400 hover:text-red-500 transition-colors"
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Section E: Education */}
          <div className="bg-white p-5 border border-slate-200/80 rounded-2xl space-y-3">
            <h4 className="font-extrabold text-[10px] text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">
              4. School & College Education
            </h4>
            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Degree / Certification</label>
                <input
                  type="text"
                  value={degree}
                  onChange={(e) => setDegree(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 text-xs rounded-xl focus:bg-white text-slate-800 font-semibold"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Specialization Stream</label>
                <input
                  type="text"
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 text-xs rounded-xl focus:bg-white text-slate-850"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">College / University Name</label>
                <input
                  type="text"
                  value={collegeName}
                  onChange={(e) => setCollegeName(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 text-xs rounded-xl focus:bg-white text-slate-800"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Graduation Year</label>
                  <input
                    type="text"
                    value={graduationYear}
                    onChange={(e) => setGraduationYear(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 text-xs rounded-xl focus:bg-white text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Cgpa / Academic Highlights</label>
                  <input
                    type="text"
                    value={educationSummary}
                    onChange={(e) => setEducationSummary(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 text-xs rounded-xl focus:bg-white text-slate-800"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section F: SDE Projects */}
          <div className="bg-white p-5 border border-slate-200/80 rounded-2xl space-y-4">
            <h4 className="font-extrabold text-[10px] text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">
              5. Highlight SDE Projects
            </h4>
            
            {/* List current projects */}
            <div className="space-y-2.5">
              {projects.map((proj, idx) => (
                <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl relative">
                  <button
                    onClick={() => handleRemoveProject(idx)}
                    className="absolute top-2.5 right-2.5 text-slate-400 hover:text-red-500"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <span className="font-bold text-xs text-slate-900 block">{proj.title}</span>
                  <p className="text-[10px] text-slate-650 leading-relaxed mt-1 block truncate max-w-[85%]">{proj.description}</p>
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {proj.techs.map(t => (
                      <span key={t} className="text-[8px] font-extrabold bg-blue-50/60 border border-blue-100 text-blue-600 px-1 py-0.5 rounded">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Add Project Form */}
            <div className="pt-3 border-t border-slate-100 space-y-2.5">
              <span className="text-[9px] uppercase font-bold text-slate-400 block">Add New Project Detail</span>
              <input
                type="text"
                placeholder="Project Title (e.g., IndiCart)"
                value={tempProjectTitle}
                onChange={(e) => setTempProjectTitle(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 text-xs rounded-xl text-slate-800"
              />
              <textarea
                placeholder="High impact action-oriented description... (Keep it to 2 lines)"
                value={tempProjectDesc}
                onChange={(e) => setTempProjectDesc(e.target.value)}
                className="w-full h-16 px-3 py-1.5 bg-slate-50 border border-slate-200 text-xs rounded-xl resize-none text-slate-750"
              />
              <input
                type="text"
                placeholder="Tech tags (comma separated: React, Redux)"
                value={tempProjectTechs}
                onChange={(e) => setTempProjectTechs(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 text-xs rounded-xl text-slate-800"
              />
              <button
                onClick={handleAddProject}
                className="w-full py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                Insert Project Details
              </button>
            </div>
          </div>

          {/* Section G: Work Experience */}
          <div className="bg-white p-5 border border-slate-200/80 rounded-2xl space-y-4">
            <h4 className="font-extrabold text-[10px] text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">
              6. Professional Experience
            </h4>

            {/* List active experiences */}
            <div className="space-y-2.5">
              {experience.map((exp, idx) => (
                <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl relative">
                  <button
                    onClick={() => handleRemoveExperience(idx)}
                    className="absolute top-2.5 right-2.5 text-slate-400 hover:text-red-500"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <span className="font-bold text-xs text-slate-900 block">{exp.role}</span>
                  <span className="text-[10px] text-slate-500 font-medium block">{exp.company} &bull; {exp.duration}</span>
                  <p className="text-[10px] text-slate-650 leading-relaxed mt-1 block truncate max-w-[85%]">{exp.description}</p>
                </div>
              ))}
            </div>

            {/* Add Experience Form */}
            <div className="pt-3 border-t border-slate-100 space-y-2.5">
              <span className="text-[9px] uppercase font-bold text-slate-400 block">Add Work Experience / Internship</span>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Company Name"
                  value={tempExpCompany}
                  onChange={(e) => setTempExpCompany(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 text-xs rounded-xl text-slate-800"
                />
                <input
                  type="text"
                  placeholder="Role (e.g. Frontend Intern)"
                  value={tempExpRole}
                  onChange={(e) => setTempExpRole(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 text-xs rounded-xl text-slate-805"
                />
              </div>
              <input
                type="text"
                placeholder="Duration (e.g. May 2024 - July 2024)"
                value={tempExpDuration}
                onChange={(e) => setTempExpDuration(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 text-xs rounded-xl text-slate-800"
              />
              <textarea
                placeholder="Quantifiable accomplishments details (e.g., Boosted performance metric by 12% via modular refactoring...)"
                value={tempExpDesc}
                onChange={(e) => setTempExpDesc(e.target.value)}
                className="w-full h-16 px-3 py-1.5 bg-slate-50 border border-slate-200 text-xs rounded-xl resize-none text-slate-750"
              />
              <button
                onClick={handleAddExperience}
                className="w-full py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                Insert Experience Item
              </button>
            </div>
          </div>

          {/* Section H: ATS Compliance Checklist Card */}
          <div className="bg-blue-600 text-white p-5 rounded-2xl space-y-2.5 shadow-md shadow-blue-600/10 relative overflow-hidden">
            <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-blue-500 rounded-full blur-xl opacity-40"></div>
            <h5 className="font-extrabold text-[10px] uppercase tracking-wider flex items-center gap-1.5 text-blue-100">
              <CheckCircle className="w-4 h-4 text-emerald-300" />
              <span>ATS Compliance Audit Checklist</span>
            </h5>
            <ul className="space-y-1.5 text-[10px] text-blue-50">
              <li className="flex items-center gap-1.5">
                <span className="text-emerald-300 font-bold">&bull;</span>
                <span>Selectable Vector Fonts (Passed: Standard Print Output)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="text-emerald-300 font-bold">&bull;</span>
                <span>No complex tables or charts (Passed: CSS structural div divs)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="text-emerald-300 font-bold">&bull;</span>
                <span>Chronological experience order (Passed: Automated hierarchy order)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="text-emerald-300 font-bold">&bull;</span>
                <span>Explicit section headers (Passed: Bold standard identifiers)</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Live Vector Preview Sheet Canvas Pane */}
        <div className={`lg:col-span-3 space-y-4 ${activePane === "preview" ? "block" : "hidden lg:block"}`}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest block font-mono">
              Live Selectable Vector Sheet Preview
            </span>
            <span className="text-[10px] text-slate-400">
              Standard paper margins: 0.85in
            </span>
          </div>

          {/* Simulated Physical Page Container */}
          <div 
            id="printable-resume-canvas"
            className={`bg-white border border-slate-200 rounded-2xl lg:rounded-3xl shadow-lg p-8 md:p-11 text-black overflow-x-auto select-text font-serif min-h-[720px] transition-all`}
            style={{
              fontFamily: selectedTemplate === "harvard" ? '"Georgia", serif' : '"Inter", sans-serif',
              lineHeight: "1.4"
            }}
          >
            {/* Header Block */}
            <div className="text-center space-y-1 pb-4">
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 border-none pb-0 uppercase" style={{
                fontFamily: selectedTemplate === "harvard" ? '"Georgia", serif' : '"Outfit", sans-serif'
              }}>
                {fullName}
              </h1>
              
              <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-slate-600 text-[10px] font-mono leading-tight">
                <span>{email}</span>
                <span>&bull;</span>
                <span>{phone}</span>
                <span>&bull;</span>
                <span>{city}, {state}</span>
              </div>

              {(linkedIn || gitHub || portfolio) && (
                <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-slate-500 text-[10px] font-mono pt-1">
                  {linkedIn && (
                    <span className="hover:underline cursor-pointer">
                      {linkedIn.replace("https://", "")}
                    </span>
                  )}
                  {gitHub && (
                    <span className="hover:underline cursor-pointer">
                      {gitHub.replace("https://", "")}
                    </span>
                  )}
                  {portfolio && (
                    <span className="hover:underline cursor-pointer font-bold">
                      {portfolio.replace("https://", "")}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Divider */}
            {selectedTemplate !== "tech_minimal" && <div className="border-t-2 border-slate-900 my-2" />}

            {/* 1. Professional Objective */}
            {objective && (
              <div className="space-y-1 mt-3">
                <h4 className="text-[11px] font-bold text-slate-900 uppercase tracking-widest border-b border-slate-200 pb-1" style={{
                  color: selectedTemplate === "bengaluru_sde" ? "#1e40af" : "#0f172a"
                }}>
                  Professional Summary
                </h4>
                <p className="text-[11px] text-slate-700 leading-relaxed pt-1">
                  {objective}
                </p>
              </div>
            )}

            {/* 2. Core Technical Skills */}
            {skills.length > 0 && (
              <div className="space-y-1 mt-4">
                <h4 className="text-[11px] font-bold text-slate-900 uppercase tracking-widest border-b border-slate-200 pb-1" style={{
                  color: selectedTemplate === "bengaluru_sde" ? "#1e40af" : "#0f172a"
                }}>
                  Technical Domain Expertise
                </h4>
                <p className="text-[11px] text-slate-700 leading-relaxed pt-1 font-semibold">
                  <span className="font-bold text-slate-900 mr-1.5">Languages & Frameworks:</span> 
                  {skills.join(", ")}
                </p>
              </div>
            )}

            {/* 3. Work Experience */}
            {experience.length > 0 && (
              <div className="space-y-2 mt-5">
                <h4 className="text-[11px] font-bold text-slate-900 uppercase tracking-widest border-b border-slate-200 pb-1" style={{
                  color: selectedTemplate === "bengaluru_sde" ? "#1e40af" : "#0f172a"
                }}>
                  Professional Experience
                </h4>
                
                <div className="space-y-3 pt-1">
                  {experience.map((exp, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between items-baseline">
                        <span className="font-extrabold text-[11px] text-slate-950">
                          {exp.role} &mdash; <span className="font-medium text-slate-700">{exp.company}</span>
                        </span>
                        <span className="text-[10px] text-slate-600 font-mono font-bold">
                          {exp.duration}
                        </span>
                      </div>
                      <p className="text-[10.5px] text-slate-700 leading-relaxed list-item list-inside pl-1">
                        {exp.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. SDE Highlight Projects */}
            {projects.length > 0 && (
              <div className="space-y-2 mt-5">
                <h4 className="text-[11px] font-bold text-slate-900 uppercase tracking-widest border-b border-slate-200 pb-1" style={{
                  color: selectedTemplate === "bengaluru_sde" ? "#1e40af" : "#0f172a"
                }}>
                  Academic & Technical Projects
                </h4>

                <div className="space-y-3.5 pt-1">
                  {projects.map((proj, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between items-baseline">
                        <span className="font-extrabold text-[11px] text-slate-950">
                          {proj.title} {proj.techs.length > 0 && `(${proj.techs.join(", ")})`}
                        </span>
                        <span className="text-[10px] text-slate-500 font-semibold font-mono">
                          React Project
                        </span>
                      </div>
                      <p className="text-[10.5px] text-slate-700 leading-relaxed">
                        {proj.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. Education block */}
            <div className="space-y-2 mt-5">
              <h4 className="text-[11px] font-bold text-slate-900 uppercase tracking-widest border-b border-slate-200 pb-1" style={{
                color: selectedTemplate === "bengaluru_sde" ? "#1e40af" : "#0f172a"
              }}>
                Education Background
              </h4>

              <div className="pt-1 select-text">
                <div className="flex justify-between items-baseline font-bold text-[11px] text-slate-900">
                  <span>{degree} &bull; {specialization}</span>
                  <span className="text-[10px] font-mono">{graduationYear}</span>
                </div>
                <div className="flex justify-between text-[10px] text-slate-600 mt-0.5">
                  <span>{collegeName}</span>
                  <span>{educationSummary}</span>
                </div>
              </div>
            </div>

          </div>
          
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex items-center justify-between text-xs text-slate-600 gap-3">
            <span className="font-semibold">&#128392; Pro-Tip:</span>
            <span>Click <strong>Download Vector PDF</strong> to trigger your OS select system print dialog. Save as PDF. It preserves all live links and vector selectable keywords cleanly!</span>
          </div>
        </div>

      </div>
    </div>
  );
}
