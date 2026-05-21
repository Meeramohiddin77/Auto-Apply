import React, { useState } from "react";
import { ArrowRight, CheckCircle, Shield, Briefcase, Award, Sparkles, MessageSquare, Landmark, RefreshCw, Layers } from "lucide-react";
import { Language, translations } from "../locale";

interface LandingPageProps {
  onEnterApp: () => void;
  lang: Language;
  setLang: (l: Language) => void;
}

export default function LandingPage({ onEnterApp, lang, setLang }: LandingPageProps) {
  const t = translations[lang];
  const [selectedPlan, setSelectedPlan] = useState<"weekly" | "monthly" | "three_month">("monthly");

  const indianTestimonials = [
    {
      name: "Priya Murthy",
      role: "Associate Frontend Developer at Razorpay",
      college: "Vellore Institute of Technology (VIT)",
      text: "The ATS Resume Optimizer was a game changer for me. It identified key keywords for payment gateways and helped me score a 94% compatibility before applying. I secured an interview within 3 days!",
      image: "👩‍💻"
    },
    {
      name: "Rahul Verma",
      role: "Graduate Software Engineer at Tata Consultancy Services",
      college: "NIT Trichy",
      text: "As a fresher with no previous work experience, the platform filtered Walk-in drives and simulated precise HR mock interviews. Preparing for situational behavioral questions gave me total confidence.",
      image: "👨‍💻"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans transition-colors duration-300">
      {/* Dynamic Floating Navbar */}
      <header className="sticky top-0 z-50 glass-effect border-b border-slate-200/50 px-4 lg:px-8 py-4 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 p-2.5 rounded-xl text-white shadow-md shadow-blue-500/20">
              <Briefcase className="w-5 h-5" id="nav-logo" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                AI Career Copilot
              </span>
              <span className="text-xs block text-blue-600 font-medium tracking-wide">AI CAREER COPILOT</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Multilingual Switcher */}
            <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
              {(["en", "hi", "te"] as Language[]).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                    lang === l
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                  id={`lang-btn-${l}`}
                >
                  {l === "en" ? "EN" : l === "hi" ? "हिंदी" : "తెలుగు"}
                </button>
              ))}
            </div>

            <button
              onClick={onEnterApp}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-all shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 flex items-center space-x-2"
              id="cta-enter-app"
            >
              <span>{t.getStarted}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-16 lg:py-24 px-4 overflow-hidden bg-gradient-to-b from-blue-50/50 via-white to-slate-50">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-blue-300/10 to-indigo-300/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center space-x-2 bg-blue-100/60 border border-blue-200/70 text-blue-700 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-6 animate-pulse">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>EXCLUSIVELY FOR INDIAN STUDENTS & DESIGN ASPIRANTS</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight leading-tight sm:leading-none mb-6">
            {t.heroTitle}
          </h1>

          <p className="text-slate-600 text-base sm:text-lg lg:text-xl max-w-3xl mx-auto leading-relaxed mb-10">
            {t.heroSubtitle}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onEnterApp}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3.5 rounded-xl transition-all shadow-lg shadow-blue-500/25 hover:shadow-xl flex items-center justify-center space-x-3 text-base"
              id="hero-dashboard-cta"
            >
              <span>Launch Career Dashboard</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <a
              href="#pricing"
              className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold px-8 py-3.5 rounded-xl transition-all border border-slate-300/60 text-center text-base"
            >
              See Copilot Plans
            </a>
          </div>

          {/* Social Proof Badges */}
          <div className="mt-16 pt-8 border-t border-slate-200/80 flex flex-wrap justify-center items-center gap-6 sm:gap-12">
            <div className="flex items-center space-x-2 text-slate-500 text-xs font-semibold tracking-wider">
              <Shield className="w-4 h-4 text-emerald-500" />
              <span>100% SECURE & ANTI-SPAM PROTECTED</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-500 text-xs font-semibold tracking-wider">
              <Award className="w-4 h-4 text-indigo-500" />
              <span>GEMINI 3.5 POWERED ALIGNMENT</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-500 text-xs font-semibold tracking-wider">
              <Landmark className="w-4 h-4 text-amber-500" />
              <span>UPI & RAZORPAY INTEGRATED</span>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Pillar Description */}
      <section className="py-20 px-4 bg-white" id="features">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-2xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              A Complete 5-Pillar SDE Placement Pipeline
            </h2>
            <p className="text-slate-500 mt-4 leading-relaxed">
              We never perform lazy bulk auto-apply spam. We focus strictly on boosting conversion rates through highly custom resume adaptations and human-supervised submissions.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-blue-200 hover:bg-blue-50/20 transition-all group scale-100 hover:scale-[1.02]">
              <div className="bg-blue-100 text-blue-600 p-3 rounded-xl w-fit mb-5">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 group-hover:text-blue-600 transition-colors">
                AI Parser & Strength Auditor
              </h3>
              <p className="text-slate-500 mt-2.5 text-sm leading-relaxed">
                Upload raw resume PDFs or paste directly. Our system maps local educational boards, tech certifications, and projects resulting in an instant profile strength scorecard.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/20 transition-all group scale-100 hover:scale-[1.02]">
              <div className="bg-emerald-100 text-emerald-600 p-3 rounded-xl w-fit mb-5">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 group-hover:text-emerald-600 transition-colors">
                High-Priority Compatibility Filter
              </h3>
              <p className="text-slate-500 mt-2.5 text-sm leading-relaxed">
                Indian tech hub positions indexed from top startup portals. Dynamically calculates match scores across skill sets and salary bands. Only shows items with a minimum 70% match score.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-amber-200 hover:bg-amber-50/20 transition-all group scale-100 hover:scale-[1.02]">
              <div className="bg-amber-100 text-amber-600 p-3 rounded-xl w-fit mb-5">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 group-hover:text-amber-600 transition-colors">
                Intelligent ATS Optimizer
              </h3>
              <p className="text-slate-500 mt-2.5 text-sm leading-relaxed">
                Paste job descriptions to perform semantic keyword gaps matching inside our Gemini optimizer interface. Receive customized CAR (Context, Action, Result) bullet points.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/20 transition-all group scale-100 hover:scale-[1.02]">
              <div className="bg-indigo-100 text-indigo-600 p-3 rounded-xl w-fit mb-5">
                <RefreshCw className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 group-hover:text-indigo-600 transition-colors">
                Pre-Checked Application Autofill
              </h3>
              <p className="text-slate-500 mt-2.5 text-sm leading-relaxed">
                Intelligently maps personal profile fields, expected salaries in LPA, and dynamically generates custom mock answers for recurrent form fields. Never auto-submits without your consent.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-rose-200 hover:bg-rose-50/20 transition-all group scale-100 hover:scale-[1.02]">
              <div className="bg-rose-100 text-rose-600 p-3 rounded-xl w-fit mb-5">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 group-hover:text-rose-600 transition-colors">
                AI Interview Simulator
              </h3>
              <p className="text-slate-500 mt-2.5 text-sm leading-relaxed">
                Step into realistic technical system designs or structured behavioral HR evaluation chats. Gemini audits responses and delivers quality scorecards.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-purple-200 hover:bg-purple-50/20 transition-all group scale-100 hover:scale-[1.02]">
              <div className="bg-purple-100 text-purple-600 p-3 rounded-xl w-fit mb-5">
                <Landmark className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 group-hover:text-purple-600 transition-colors">
                Razorpay Indian Subscriptions
              </h3>
              <p className="text-slate-500 mt-2.5 text-sm leading-relaxed">
                Seamless local transaction integration with Indian banks and UPI schemes. Transparent trial access limits that roll over automatically. Detailed billing history.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-slate-50 border-y border-slate-200/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Highly Trusted by Tech Candidates
            </h2>
            <p className="text-slate-500 mt-3 text-sm">
              Read how fellow engineering aspirants secured high-match developer roles in Indian software centers.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {indianTestimonials.map((item, idx) => (
              <div key={idx} className="bg-white p-8 rounded-2xl border border-slate-200/60 shadow-sm relative">
                <span className="text-4xl absolute -top-4 -left-2 bg-slate-100 rounded-full w-12 h-12 flex items-center justify-center">
                  {item.image}
                </span>
                <p className="text-slate-600 text-sm italic leading-relaxed mt-4">
                  "{item.text}"
                </p>
                <div className="mt-6 pt-4 border-t border-slate-100">
                  <h4 className="font-bold text-sm text-slate-900">{item.name}</h4>
                  <p className="text-xs text-blue-600 font-medium mt-0.5">{item.role}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{item.college}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Pricing Section */}
      <section className="py-20 px-4 bg-white" id="pricing">
        <div className="max-w-6xl mx-auto text-center">
          <div className="max-w-2xl mx-auto mb-16">
            <h2 className="text-2xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              Invest in Your Indian Tech Career
            </h2>
            <p className="text-slate-500 mt-3">
              Unlock maximum ATS matching and unlimited AI Mock interviews representing premium companies.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto text-left">
            {/* Plan 1 */}
            <div className="bg-slate-50 p-7 rounded-2xl border border-slate-200/70 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Weekly Booster</h3>
                <p className="text-xs text-slate-500 mt-1">Excellent for active application drives.</p>
                <div className="my-5 flex items-baseline">
                  <span className="text-3xl font-extrabold text-slate-900">₹300</span>
                  <span className="text-slate-500 text-xs ml-1">/ week</span>
                </div>
                <ul className="space-y-3.5 text-xs text-slate-600">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span>10 Assisted Applications/day</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span>ATS optimization modules</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span>5 AI Technical Mock sessions</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={onEnterApp}
                className="mt-8 w-full py-3 px-4 bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs rounded-xl transition-all cursor-pointer text-center"
              >
                Go to Dashboard
              </button>
            </div>

            {/* Plan 2 */}
            <div className="bg-white p-7 rounded-2xl border-2 border-blue-600 shadow-md relative flex flex-col justify-between transform scale-100 md:scale-105">
              <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full absolute -top-3.5 right-6 uppercase tracking-wider">
                Most Popular
              </span>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Monthly Copilot</h3>
                <p className="text-xs text-slate-500 mt-1">Perfect for job-seeking grads.</p>
                <div className="my-5 flex items-baseline">
                  <span className="text-4xl font-extrabold text-slate-900">₹1,000</span>
                  <span className="text-slate-500 text-xs ml-1">/ month</span>
                </div>
                <ul className="space-y-3.5 text-xs text-slate-600">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span>30 Checked Applications/day</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span>Unlimited ATS evaluations</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span>Unlimited AI interview practices</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span>UPI/Razorpay invoice support</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={onEnterApp}
                className="mt-8 w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-all cursor-pointer text-center shadow-lg shadow-blue-500/20"
              >
                Go to Dashboard
              </button>
            </div>

            {/* Plan 3 */}
            <div className="bg-slate-50 p-7 rounded-2xl border border-slate-200/70 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Hiring Season Pass</h3>
                <p className="text-xs text-slate-500 mt-1">Full 3-month strategic prep.</p>
                <div className="my-5 flex items-baseline">
                  <span className="text-3xl font-extrabold text-slate-900">₹2,500</span>
                  <span className="text-slate-500 text-xs ml-1">/ 3 months</span>
                </div>
                <ul className="space-y-3.5 text-xs text-slate-600">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span>100 Applications/day limit</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span>SDE Roadmap custom generator</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span>WhatsApp alert integration</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={onEnterApp}
                className="mt-8 w-full py-3 px-4 bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs rounded-xl transition-all cursor-pointer text-center"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Compact Indian Job FAQ Accordion */}
      <section className="py-20 px-4 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 text-center mb-12">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200/80">
              <h4 className="font-bold text-sm text-slate-950">Is this an automated spam-bot?</h4>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Absolutely not. We strongly discourage raw auto-apply scripts which are routinely restricted by safety mechanisms on Workday or Lever. Our platform acts as a human-supervised copilot: compiling answers, checking keyword alignments, and presenting a pre-filled layout which must be manually approved and clicked before any submission is scheduled.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200/80">
              <h4 className="font-bold text-sm text-slate-950">Can India-specific Freshers use this?</h4>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Yes! We have dedicated filters that automatically prioritize entry-level postings, walk-in drives, and off-campus internships (0 years experience required) spanning major Indian IT clusters like Bengaluru, Pune, Hyderabad, and Chennai.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 px-4 border-t border-slate-800 text-center">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-left">
            <span className="font-bold text-white text-base tracking-tight">AI Career Copilot</span>
            <p className="text-xs text-slate-500 mt-1">Empowering the next generation of engineers with Gemini AI.</p>
          </div>
          <p className="text-xs text-slate-500">
            &copy; 1999 - 2026 AI Career Copilot Technologies Pvt. Ltd. Bengaluru Hub. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
