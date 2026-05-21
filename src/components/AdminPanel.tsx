import React, { useState, useEffect } from "react";
import { Landmark, Logs, Activity, Users, ShieldCheck, RefreshCw, Cpu } from "lucide-react";

export default function AdminPanel() {
  const [loading, setLoading] = useState(false);
  const [metrics, setMetrics] = useState<any>({
    signups: 154,
    totalRevenue: 42500,
    apiCallsCost: "₹21.40",
    activeSubscriptions: 24,
    totalJobsIndexed: 9,
    totalTrackerCount: 2,
    trialSuccessConversion: "34%"
  });
  const [logs, setLogs] = useState<any[]>([
    { time: "10:11:02", action: "User Registration", desc: "Arjun Sharma registered from Bengaluru IP." },
    { time: "10:12:45", action: "Resume Parsed", desc: "Engine parsed Arjun_Sharma_CS_Resume.pdf cleanly via Gemini." },
    { time: "10:14:12", action: "Job Autofill Run", desc: "User initiated assisted apply for Razorpay position." }
  ]);

  const loadTelemetry = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/telemetry");
      const data = await response.json();
      if (data.metrics) {
        setMetrics(data.metrics);
      }
      if (data.logs) {
        setLogs(data.logs);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTelemetry();
  }, []);

  return (
    <div className="space-y-6" id="admin-dashboard-panel">
      <div className="flex justify-between items-center border-b border-slate-200 pb-5 text-left">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Cpu className="w-5 h-5 text-blue-600" />
            <span>Admin Operational Telemetry</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Track registration trends, platform payments, API workloads, and real-time backend action triggers.
          </p>
        </div>

        <button
          onClick={loadTelemetry}
          disabled={loading}
          className="bg-slate-100 hover:bg-slate-200 p-2.5 rounded-xl border border-slate-250 cursor-pointer text-slate-600"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Grid summarizing platform indicators */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm text-left">
          <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">Signups (Indian IP)</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">{metrics.signups}</span>
          <span className="text-[10px] text-slate-500 mt-1 block font-semibold">&bull; conversion: <strong className="text-blue-600">{metrics.trialSuccessConversion}</strong></span>
        </div>

        {/* Metric 2 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm text-left">
          <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">Razorpay Revenue</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">₹{metrics.totalRevenue}</span>
          <span className="text-[10px] text-slate-500 mt-1 block font-semibold">&bull; subscribers: <strong className="text-blue-600">{metrics.activeSubscriptions} users</strong></span>
        </div>

        {/* Metric 3 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm text-left">
          <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">Gemini AI workload cost</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">{metrics.apiCallsCost}</span>
          <span className="text-[10px] text-slate-500 mt-1 block font-semibold">&bull; models: <strong className="text-blue-600">gemini-3.5-flash</strong></span>
        </div>

        {/* Metric 4 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm text-left">
          <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">Indexed Placements</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">{metrics.totalJobsIndexed} roles</span>
          <span className="text-[10px] text-slate-500 mt-1 block font-semibold">&bull; aggregator: <strong className="text-blue-600">active pipelines</strong></span>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column: Logs terminal */}
        <div className="lg:col-span-2 bg-slate-950 text-slate-100 p-6 rounded-3xl font-mono text-left space-y-4 shadow-lg border border-slate-800">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <span className="text-[10px] font-bold text-slate-400 tracking-widest flex items-center gap-1.5 uppercase">
              <Logs className="w-4 h-4 text-emerald-400" />
              <span>Real-time action logs</span>
            </span>
            <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
          </div>

          <div className="space-y-3 h-[280px] overflow-y-auto text-xs pr-2">
            {logs.map((log, index) => (
              <div key={index} className="flex gap-3 leading-relaxed hover:bg-slate-900/50 p-1.5 rounded transition-all">
                <span className="text-emerald-400 shrink-0 font-bold">[{log.time}]</span>
                <div>
                  <span className="text-blue-400 font-bold uppercase tracking-wider">({log.action})</span>
                  <span className="text-slate-300 ml-1.5">{log.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column: admin system indicators */}
        <div className="lg:col-span-1 space-y-6 text-left">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block border-b border-slate-100 pb-2 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-indigo-600" />
              <span>Diagnostic check</span>
            </span>

            <div className="space-y-4 text-xs font-medium">
              <div className="flex justify-between items-center">
                <span className="text-slate-550">Node.js Server Port</span>
                <span className="font-mono bg-slate-100 rounded px-2 py-0.5">3000 (ingress ready)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-550">Gemini Key API status</span>
                <span className="text-emerald-600 font-bold">Connected</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-550">Razorpay keys</span>
                <span className="text-emerald-600 font-bold">Simulated Active</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-550">Vite compilation proxy</span>
                <span className="text-emerald-600 font-bold">Serving middleware</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
