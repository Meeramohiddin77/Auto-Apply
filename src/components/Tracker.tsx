import React from "react";
import { ApplicationTrackerItem } from "../types";
import { CheckCircle, Clock, Calendar, HelpCircle, FileText, ChevronRight } from "lucide-react";

interface TrackerProps {
  items: ApplicationTrackerItem[];
}

export default function Tracker({ items }: TrackerProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "applied":
        return <span className="text-[10px] bg-blue-50 text-blue-700 border border-blue-200 rounded px-2.5 py-1 font-bold">Applied</span>;
      case "pending":
        return <span className="text-[10px] bg-amber-50 text-amber-700 border border-amber-200 rounded px-2.5 py-1 font-bold">Pending</span>;
      case "interview":
        return <span className="text-[10px] bg-indigo-50 text-indigo-700 border border-indigo-200 rounded px-2.5 py-1 font-bold">Interview Scheduled</span>;
      case "rejected":
        return <span className="text-[10px] bg-red-50 text-red-700 border border-red-200 rounded px-2.5 py-1 font-bold">Archived / Closed</span>;
      default:
        return <span className="text-[10px] bg-slate-100 text-slate-700 border border-slate-200 rounded px-2.5 py-1 font-bold">Saved</span>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "applied":
        return <CheckCircle className="w-5 h-5 text-blue-500" />;
      case "interview":
        return <Calendar className="w-5 h-5 text-indigo-500" />;
      default:
        return <Clock className="w-5 h-5 text-amber-500" />;
    }
  };

  return (
    <div className="space-y-6" id="tracker-section">
      <div className="border-b border-slate-200 pb-5 text-left">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <span>Active Application tracker</span>
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Maintain full alignment across active roles. The copilot maps timeline milestones automatically based on feedback schedules.
        </p>
      </div>

      {items.length > 0 ? (
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Tracker list */}
          <div className="lg:col-span-2 space-y-6">
            {items.map((app) => (
              <div key={app.id} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4 text-left">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-slate-100 p-2.5 rounded-xl border border-slate-250">
                      {getStatusIcon(app.status)}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-950">{app.job.title}</h4>
                      <p className="text-xs text-slate-400 font-bold mt-0.5">{app.job.company} &bull; {app.job.location.split(",")[0]}</p>
                    </div>
                  </div>
                  <div>
                    {getStatusBadge(app.status)}
                  </div>
                </div>

                <div className="p-3.5 bg-slate-50 text-xs text-slate-500 rounded-xl leading-relaxed font-semibold">
                  <strong>Notes:</strong> {app.notes}
                </div>

                {app.coverLetterGenerated && (
                  <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/20 text-xs text-slate-650">
                    <span className="font-bold text-slate-800 flex items-center gap-1.5 mb-2">
                      <FileText className="w-4 h-4 text-slate-500" />
                      <span>Optimized Cover Letter generated</span>
                    </span>
                    <pre className="whitespace-pre-wrap font-sans leading-relaxed text-[11px]">
                      {app.coverLetterGenerated}
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Sizing timeline status progress */}
          <div className="lg:col-span-1 space-y-6 text-left">
            <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-md space-y-5">
              <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400 block font-mono">Recent Milestone Pipeline</span>
              
              <div className="relative border-l border-slate-800 pl-6 space-y-6">
                {items.flatMap(i => i.timeline).slice(0, 4).map((time, idx) => (
                  <div key={idx} className="relative">
                    <span className="absolute -left-[29px] top-0.5 bg-blue-500 w-2 h-2 rounded-full outline-4 outline-slate-950" />
                    <span className="text-[10px] text-slate-400 font-bold block mt-0.5 font-mono">{time.date}</span>
                    <h5 className="font-bold text-xs text-slate-100 mt-1">{time.title}</h5>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{time.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-slate-100/50 p-16 text-center text-slate-400 border border-dashed border-slate-300 rounded-3xl max-w-xl mx-auto">
          <Clock className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h5 className="font-bold text-xs text-slate-800">No Applications Logged</h5>
          <p className="text-[11px] mt-1">Visit the Job Feed discover panel, configure assisted applications, and finalize manual consent submissions to track pipeline records.</p>
        </div>
      )}
    </div>
  );
}
