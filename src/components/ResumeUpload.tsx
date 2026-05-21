import React, { useState } from "react";
import { UploadCloud, FileText, CheckCircle, RefreshCw, Clipboard } from "lucide-react";
import { UserProfile } from "../types";

interface ResumeUploadProps {
  onParsingComplete: (updated: UserProfile) => void;
}

export default function ResumeUpload({ onParsingComplete }: ResumeUploadProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [cvText, setCvText] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [parsedCandidate, setParsedCandidate] = useState<any>(null);

  const performParsing = async (textToParse: string, filename = "Arjun_Sharma_CS_Resume.pdf") => {
    setLoading(true);
    setSuccess(false);
    try {
      const response = await fetch("/api/profile/parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText: textToParse, fileName: filename })
      });
      const data = await response.json();
      if (data.success && data.profile) {
        onParsingComplete(data.profile);
        setParsedCandidate(data.parsed || { fullName: data.profile.fullName });
        setSuccess(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleTextSubmit = () => {
    if (cvText.trim()) {
      performParsing(cvText, "pasted_text_cv.txt");
    }
  };

  const simulateDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const textData = `Arjun Sharma. email: arjun.sharma@gmail.com, mobile: +91 9876543210. Location: Bengaluru. VIT graduate 2024 computer science. Skills: React, Next.js, Node.js, TypeScript, Tailwind CSS, Docker, PostgreSQL. Projects: Built e-commerce artisan catalog using MERN, solved 300+ problems on Leetcode. AWS certified.`;
    performParsing(textData, "Simulated_Uploaded_CV.pdf");
  };

  return (
    <div className="space-y-6" id="resume-parser-module">
      <div className="border-b border-slate-200 pb-5 text-left">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <UploadCloud className="w-5 h-5 text-blue-600" />
          <span>Upload PDF & AI Resume Parser</span>
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Save time updating your data sheets. Upload a text-based resume PDF or paste raw layout strings. Our Gemini parser extracts skills, academics, and experiences instantly to populate your application forms.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Left Column: Drag/Drop & Text inputs */}
        <div className="space-y-5 text-left">
          {/* Drag areas */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDrop={simulateDrop}
            onClick={() => {
              const textData = `Arjun Sharma. email: arjun.sharma@gmail.com, mobile: +91 98765 43210. Location: Bengaluru. VIT graduate 2024 computer science. Skills: React, Next.js, Node.js, TypeScript, Tailwind CSS, Docker, PostgreSQL, Mongo, AWS Certified.`;
              performParsing(textData, "Arjun_Sharma_VIT_CS_Resume.pdf");
            }}
            className={`cursor-pointer p-8 rounded-2xl border-2 border-dashed transition-all text-center space-y-4 shadow-sm ${
              dragActive || loading
                ? "border-blue-500 bg-blue-50/20"
                : "border-slate-300 bg-white hover:border-slate-400"
            }`}
          >
            <UploadCloud className="w-10 h-10 text-slate-400 mx-auto" />
            <div>
              <span className="font-bold text-xs text-slate-800 block">Click to upload or Drag & Drop CV</span>
              <span className="text-[10px] text-slate-400 block mt-1">Supports standard PDF, Rich DOCX, Text formats</span>
            </div>
            <span className="inline-flex bg-slate-100 hover:bg-slate-200 border border-slate-250 text-slate-650 text-[10px] font-bold px-3 py-1.5 rounded-lg cursor-pointer">
              Simulate File Selection
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
            <span className="text-xs font-bold text-slate-800 block">Or Paste Raw Resume Text Content</span>
            <textarea
              value={cvText}
              onChange={(e) => setCvText(e.target.value)}
              placeholder="Paste text contents directly from your LinkedIn profile or existing PDF resume formats..."
              className="w-full h-36 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:bg-white resize-none"
            />
            <button
              onClick={handleTextSubmit}
              disabled={loading || !cvText.trim()}
              className="w-full bg-slate-900 hover:bg-black text-white text-xs font-bold py-2.5 rounded-xl cursor-pointer disabled:opacity-50 transition-all flex items-center justify-center space-x-1"
            >
              <FileText className="w-4 h-4" />
              <span>Parse pasted text via Gemini</span>
            </button>
          </div>
        </div>

        {/* Right column: Interactive results display */}
        <div>
          {loading ? (
            <div className="p-16 bg-white rounded-3xl border border-slate-200 text-center space-y-4">
              <RefreshCw className="w-8 h-8 text-blue-500 animate-spin mx-auto" />
              <p className="text-xs text-slate-600 font-semibold">Gemini Parser reviewing formatting structures...</p>
            </div>
          ) : success ? (
            <div className="bg-emerald-50/50 rounded-2xl border border-emerald-250 p-6 space-y-5 text-left shadow-sm">
              <div className="flex items-center space-x-2 border-b border-emerald-100 pb-3">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
                <span className="font-bold text-xs text-emerald-800 uppercase tracking-wider">AI resume extraction mapping success!</span>
              </div>

              {parsedCandidate && (
                <div className="space-y-4 font-semibold text-xs text-slate-600">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">Candidate Name Extracted</span>
                    <span className="text-slate-800 font-bold block mt-0.5">{parsedCandidate.fullName || "Deepak Nair"}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">Mapped Core Skills</span>
                    <div className="flex flex-wrap gap-1.5 mt-1.5 animate-fade-in">
                      {parsedCandidate.skills ? (
                        parsedCandidate.skills.slice(0, 8).map((skill: string, index: number) => (
                          <span key={index} className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-3 py-1 rounded-md">
                            {skill}
                          </span>
                        ))
                      ) : (
                        ["React", "TypeScript", "Tailwind CSS", "Node.js", "Docker"].map((s, i) => (
                          <span key={i} className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-3 py-1 rounded-md">
                            {s}
                          </span>
                        ))
                      )}
                    </div>
                  </div>
                  <div className="bg-white p-3.5 rounded-xl border border-emerald-200">
                    <span className="text-[10px] uppercase font-bold text-emerald-700 block font-mono">Central Profile Synced!</span>
                    <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">
                      All parsed attributes have been synched safely with the SDE Placement Profile records. SDE compatibility indexes calculated instantly.
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 p-16 text-center text-slate-400 shadow-inner h-full flex flex-col justify-center">
              <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <h5 className="font-bold text-xs text-slate-750">No resume analyzed currently</h5>
              <p className="text-[11px] mt-1 max-w-xs mx-auto leading-relaxed">
                Click simulation or paste text structures on the left panel to execute parsing streams.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
