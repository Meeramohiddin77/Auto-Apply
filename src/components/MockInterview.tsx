import React, { useState, useEffect, useRef } from "react";
import { InterviewSession } from "../types";
import { 
  MessageSquare, 
  ArrowRight, 
  Play, 
  RefreshCw, 
  Send, 
  ShieldAlert, 
  Award, 
  Star, 
  ListCollapse, 
  Volume2, 
  VolumeX, 
  Mic, 
  MicOff, 
  Sparkles, 
  AlertCircle,
  TrendingUp,
  Flame,
  HelpCircle
} from "lucide-react";

interface MockInterviewProps {
  preferredRole: string;
}

export interface VoicePersona {
  id: string;
  name: string;
  avatar: string;
  desc: string;
  pitch: number;
  rate: number;
}

const VOICE_PERSONAS: VoicePersona[] = [
  {
    id: "mentor",
    name: "Dr. Nisha Sen (Warm Regional Mentor)",
    avatar: "👩‍🏫",
    desc: "A warm, natural, encouraging maternal pacing. Pitch: 1.15, Speed: 0.92x",
    pitch: 1.15,
    rate: 0.92
  },
  {
    id: "executive",
    name: "Roy Captain (Executive HR Director)",
    avatar: "🧔",
    desc: "Measured, professional, slower authoritative cadence. Pitch: 0.88, Speed: 0.88x",
    pitch: 0.88,
    rate: 0.88
  },
  {
    id: "lead",
    name: "Vikram Malhotra (Senior Technical Lead)",
    avatar: "🧑‍💻",
    desc: "Analytical, crisp, standard industry speed. Pitch: 1.0, Speed: 0.96x",
    pitch: 1.0,
    rate: 0.96
  }
];

export default function MockInterview({ preferredRole }: MockInterviewProps) {
  const [role, setRole] = useState(preferredRole || "Frontend Engineer");
  const [type, setType] = useState<"HR" | "Technical" | "Behavioral">("Technical");
  const [session, setSession] = useState<InterviewSession | null>(null);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  
  // Voice & Speech states
  const [isListening, setIsListening] = useState(false);
  const [isTtsActive, setIsTtsActive] = useState(true); // Default to ON for an immersive voice layout
  const [speechSupported, setSpeechSupported] = useState(true);
  const [interimTranscript, setInterimTranscript] = useState("");
  
  // Humanized Voice Customizations
  const [currentPersona, setCurrentPersona] = useState<string>("mentor");
  const [systemVoices, setSystemVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceName, setSelectedVoiceName] = useState<string>("");
  const [autoSubmitByVoice, setAutoSubmitByVoice] = useState(true); // Auto-submits when they stop speaking

  const recognitionRef = useRef<any>(null);
  const userInputRef = useRef(userInput);
  const autoSubmitRef = useRef(autoSubmitByVoice);

  // Sync state values with refs to prevent stale closure traps in WebSpeech's async listeners
  useEffect(() => {
    userInputRef.current = userInput;
  }, [userInput]);

  useEffect(() => {
    autoSubmitRef.current = autoSubmitByVoice;
  }, [autoSubmitByVoice]);

  // Load physical system voices for maximum human-like delivery options
  useEffect(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        // filter English voices for clean accentuation compatibility
        const engVoices = voices.filter(v => 
          v.lang.includes("en") || 
          v.lang.includes("en-IN") || 
          v.lang.includes("en-GB") || 
          v.lang.includes("en-US")
        );
        setSystemVoices(engVoices.length > 0 ? engVoices : voices);
        
        // Default to a premium-sounding native female voice or regional voice if present
        const bestVoice = engVoices.find(v => v.lang.includes("en-IN") || v.lang.includes("Google UK English Female") || v.lang.includes("en-GB")) || engVoices[0] || voices[0];
        if (bestVoice && !selectedVoiceName) {
          setSelectedVoiceName(bestVoice.name);
        }
      };
      
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechSupported(false);
    } else {
      const rec = new SpeechRecognition();
      rec.continuous = false; // False to allow silence-detection break points (facilitating auto-submit)
      rec.interimResults = true;
      rec.lang = "en-IN"; // Fine-tune for Indian accent clarity

      rec.onstart = () => {
        setIsListening(true);
        setInterimTranscript("");
      };

      rec.onresult = (event: any) => {
        let finalTxt = "";
        let interimTxt = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTxt += event.results[i][0].transcript;
          } else {
            interimTxt += event.results[i][0].transcript;
          }
        }
        if (finalTxt) {
          setUserInput(prev => prev + (prev ? " " : "") + finalTxt);
        }
        setInterimTranscript(interimTxt);
      };

      rec.onerror = (e: any) => {
        console.error("Speech Recognition error:", e);
        setIsListening(false);
        setInterimTranscript("");
        
        // If they granted permissions but spoke nothing or recognition failed, ask them to come again!
        if (e.error === "no-speech" || e.error === "aborted") {
          triggerVoiceFailure();
        } else if (e.error === "not-allowed") {
          alert("Microphone permission was denied. Please allow microphone access in your browser configuration.");
        }
      };

      rec.onend = () => {
        setIsListening(false);
        setInterimTranscript("");
        
        // Auto-submit handsfree action if enabled and some text exists
        // Wait a small buffer to let state resolve
        setTimeout(() => {
          const textDraft = userInputRef.current.trim();
          if (autoSubmitRef.current) {
            if (textDraft.length > 0) {
              triggerMessageSend(textDraft);
            } else {
              // Started mic but spoke nothing at all? Fail gracefully and request a repeat!
              triggerVoiceFailure();
            }
          }
        }, 150);
      };

      recognitionRef.current = rec;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  // Conversational fallback prompt if users click send empty or if Speech Recognition output is silent
  const triggerVoiceFailure = () => {
    const errorText = "I'm sorry, I couldn't catch that. Please come again?";
    
    // Read the "please come again" query directly in simulated human voice
    speakText(errorText);

    // Provide friendly in-chat placeholder instructions to user so they are guided
    setUserInput("");
  };

  // Text-to-Speech announcer helper (with customized human-like pitch and pacing)
  const speakText = (text: string) => {
    if (!isTtsActive || !window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel(); // Clears sound buffer instantly
      
      // Clean text of unpronounceable characters or brackets
      const cleanText = text
        .replace(/[*#_`]/g, "")
        .replace(/\(.*?\)/g, "");

      const utterance = new SpeechSynthesisUtterance(cleanText);
      
      // Bind chosen system voice for premium fidelity
      if (selectedVoiceName) {
        const found = systemVoices.find(v => v.name === selectedVoiceName);
        if (found) utterance.voice = found;
      }

      // Persona settings tweaks
      const matchedPersona = VOICE_PERSONAS.find(p => p.id === currentPersona);
      utterance.pitch = matchedPersona ? matchedPersona.pitch : 1.05;
      utterance.rate = matchedPersona ? matchedPersona.rate : 0.95;

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.error("Humanized TTS output failed:", err);
    }
  };

  // Automatically read new AI questions if user toggled Speaker Mode
  useEffect(() => {
    if (session && session.messages.length > 0) {
      const lastMsg = session.messages[session.messages.length - 1];
      if (lastMsg.sender === "ai") {
        speakText(lastMsg.text);
      }
    }
  }, [session?.messages.length, isTtsActive]);

  const toggleListening = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.error("Start speech failed:", err);
      }
    }
  };

  const startSession = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/interview/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, type })
      });
      const data = await response.json();
      setSession(data);
      
      // Read initial prompt aloud
      if (data && data.messages && data.messages.length > 0) {
        speakText(data.messages[0].text);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Reusable message poster representing user submission
  const triggerMessageSend = async (textToSend: string) => {
    if (!textToSend.trim() || !session || sending) return;

    setSending(true);
    setUserInput("");

    // Optimistic client update
    const updatedMessages = [
      ...session.messages,
      { sender: "user" as const, text: textToSend, time: "Just now" }
    ];
    setSession({ ...session, messages: updatedMessages });

    try {
      const response = await fetch(`/api/interview/${session.id}/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: textToSend })
      });
      const data = await response.json();
      if (data.session) {
        setSession(data.session);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  const sendMessage = async () => {
    const textDraft = userInput.trim();
    if (!textDraft) {
      // Caught empty answer! Let the AI prompt them to repeat
      triggerVoiceFailure();
      return;
    }

    // Stop recording if active
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
    }

    await triggerMessageSend(textDraft);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="space-y-8" id="interview-simulation-module">
      <div className="border-b border-slate-200 pb-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-600 animate-pulse" />
              <span>Voice-Enhanced Career Copilot Interview Room</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Practice specialized Indian Tech, Medical, Finance, or HR recruitment rounds. Converse using direct voice input and listen to real-time speech responses!
            </p>
          </div>
          {session && (
            <div className="flex flex-wrap items-center gap-2.5 bg-slate-50 border border-slate-200 p-1.5 rounded-xl">
              <button
                onClick={() => setIsTtsActive(!isTtsActive)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  isTtsActive 
                    ? "bg-blue-600 text-white shadow-sm" 
                    : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                }`}
                title="Speak interviewer responses aloud"
              >
                {isTtsActive ? <Volume2 className="w-3.5 h-3.5 animate-bounce" /> : <VolumeX className="w-3.5 h-3.5" />}
                <span>{isTtsActive ? "AI Voice ON" : "AI Voice OFF"}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {!session ? (
        <div className="max-w-xl mx-auto bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
          <div className="text-center space-y-2">
            <div className="mx-auto w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <h4 className="font-bold text-sm text-slate-900 uppercase tracking-wider">
              Ready to Practice India's Lead Recruitment Rounds?
            </h4>
            <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
              Choose any industry background. Includes specialized Medical, Nursing, HR, Sales, and tech domains.
            </p>
          </div>

          <div className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Target Job Title background</label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                placeholder="e.g. Registered Staff Nurse / Pediatrician / SDE - 1 / HR Recruiter"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-2">Evaluation Category</label>
              <div className="grid grid-cols-3 gap-3">
                {(["Technical", "HR", "Behavioral"] as const).map((track) => (
                  <button
                    key={track}
                    onClick={() => setType(track)}
                    className={`p-3 text-xs font-bold rounded-xl transition-all cursor-pointer border text-center ${
                      type === track
                        ? "bg-blue-600 border-blue-600 text-white shadow-md"
                        : "bg-white border-slate-200 hover:border-slate-300 text-slate-700"
                    }`}
                  >
                    {track}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={startSession}
            disabled={loading}
            className="w-full mt-2 bg-slate-900 hover:bg-black text-white font-semibold text-xs py-3.5 rounded-xl transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-md"
            id="start-interview-btn"
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>Initialize AI Interactive Round</span>
              </>
            )}
          </button>
        </div>
      ) : (
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Chat Feed */}
          <div className="lg:col-span-3 bg-white border border-slate-200/80 rounded-2xl flex flex-col h-[540px] shadow-sm relative overflow-hidden">
            {/* Chat header */}
            <div className="p-4 bg-slate-900 text-white flex justify-between items-center">
              <div>
                <h5 className="font-bold text-xs capitalize">{role} Assessment</h5>
                <span className="text-[10px] text-blue-400 capitalize">{session.type} round &bull; {session.messages.length}/6 Interactions</span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    if (window.speechSynthesis) window.speechSynthesis.cancel();
                    setSession(null);
                  }}
                  className="bg-slate-800 hover:bg-slate-755 text-[10px] px-3 py-1.5 rounded-lg border border-slate-700 text-slate-350 font-bold cursor-pointer"
                >
                  Exit Session
                </button>
              </div>
            </div>

            {/* Conversation list */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/50">
              {session.messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed ${
                      msg.sender === "user"
                        ? "bg-blue-600 text-white rounded-tr-none shadow-sm"
                        : "bg-white text-slate-800 border border-slate-200/80 rounded-tl-none shadow-sm"
                    }`}
                  >
                    <p className="font-medium whitespace-pre-wrap">{msg.text}</p>
                    <div className="flex items-center justify-between mt-1.5">
                      <span className="text-[9px] opacity-60">
                        {msg.sender === "user" ? "You" : "AI Corporate Interviewer"} &bull; {msg.time}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {sending && (
                <div className="flex justify-start">
                  <div className="bg-white rounded-2xl p-3 border border-slate-200 flex items-center space-x-2 shadow-sm rounded-tl-none">
                    <div className="flex space-x-1">
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input triggers */}
            {!session.evaluation && (
              <div className="p-4 border-t border-slate-100 bg-white space-y-3">
                {/* Interim Voice Dictation State Indicator */}
                {interimTranscript && (
                  <div className="px-3.5 py-2 bg-emerald-50 border border-emerald-100 rounded-xl text-[11px] text-emerald-800 font-medium flex items-center gap-2 animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                    <span>Transcribing live speech: "{interimTranscript}"</span>
                  </div>
                )}

                <div className="flex space-x-2.5">
                  <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder={
                      isListening 
                        ? "🎙️ Mic active: Speak clearly into your device..." 
                        : "Type your response to the interviewer or click the mic to speak..."
                    }
                    className={`flex-1 bg-slate-50 border rounded-xl px-4 py-3 text-xs transition-colors duration-200 focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-500 ${
                      isListening ? "border-red-400 bg-red-50/20 text-red-900 shadow-inner" : "border-slate-200"
                    }`}
                  />
                  
                  {/* Speech Dictation Trigger */}
                  <button
                    onClick={toggleListening}
                    className={`p-3 rounded-xl transition-all cursor-pointer flex items-center justify-center flex-shrink-0 border ${
                      !speechSupported 
                        ? "bg-slate-150 border-slate-200 text-slate-400 cursor-not-allowed" 
                        : isListening 
                          ? "bg-red-500 border-red-500 text-white animate-pulse" 
                          : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-800"
                    }`}
                    title={
                      !speechSupported 
                        ? "Microphone dictation not supported in this browser" 
                        : isListening 
                          ? "Stop listening" 
                          : "Dictate answer by voice (Speech-to-Text)"
                    }
                    disabled={!speechSupported}
                  >
                    {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={sendMessage}
                    disabled={sending || !userInput.trim()}
                    className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white p-3 rounded-xl transition-all cursor-pointer flex-shrink-0"
                    id="send-message-btn"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400 px-1 font-medium">
                  <span>Press Enter to send</span>
                  {speechSupported && (
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      Indian English dictation active
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sizing score evaluation display */}
          <div className="lg:col-span-2">
            {session.evaluation ? (
              <div className="bg-gradient-to-b from-slate-900 to-slate-950 text-white p-6 rounded-2xl space-y-6 shadow-xl relative overflow-hidden h-[540px] overflow-y-auto">
                <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl" />
                
                <h4 className="font-bold text-xs uppercase tracking-widest border-b border-slate-800 pb-3 text-blue-400 flex items-center gap-1.5">
                  <Award className="w-4 h-4" />
                  <span>Interactive round Scorecard</span>
                </h4>

                <div className="flex items-center space-x-4 bg-slate-850/40 p-4 rounded-xl border border-slate-800/60">
                  <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700 text-center">
                    <span className="text-3xl font-extrabold tracking-tight text-emerald-400">
                      {session.evaluation.overallScore}%
                    </span>
                    <span className="block text-[8px] text-slate-400 font-mono mt-0.5">Overall Performance</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 block font-mono">Clarity rating</span>
                    <span className="text-sm font-bold text-slate-100 flex items-center space-x-1.5 mt-0.5">
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400 animate-pulse" />
                      <span>{session.evaluation.communicationQuality}</span>
                    </span>
                  </div>
                </div>

                {/* Score breakdown metrics lists */}
                <div className="space-y-4">
                  <div>
                    <span className="text-[10px] text-emerald-400 block font-mono">Key strengths</span>
                    <ul className="space-y-1.5 mt-2 text-xs list-disc list-inside text-slate-300 font-medium">
                      {session.evaluation.strengths.slice(0, 3).map((s, idx) => (
                        <li key={idx} className="leading-normal">{s}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="border-t border-slate-800/80 pt-4">
                    <span className="text-[10px] text-red-400 block font-mono">Points evaluated for improvement</span>
                    <ul className="space-y-1.5 mt-2 text-xs list-disc list-inside text-slate-400 font-medium">
                      {session.evaluation.weaknesses.slice(0, 3).map((w, idx) => (
                        <li key={idx} className="leading-normal">{w}</li>
                      ))}
                    </ul>
                  </div>

                  {/* SPECIFIC POINTS WE NEED TO IMPROVE */}
                  {session.evaluation.pointsToImprove && session.evaluation.pointsToImprove.length > 0 && (
                    <div className="border-t border-slate-800/80 pt-4 bg-amber-500/5 p-3 rounded-lg border border-amber-500/10">
                      <span className="text-[10px] text-amber-400 font-semibold block font-mono flex items-center gap-1">
                        <TrendingUp className="w-3.5 h-3.5" />
                        <span>AI ACTIONABLE REFINEMENT CHECKS</span>
                      </span>
                      <ul className="space-y-1.5 mt-2 text-xs text-amber-100 list-disc list-inside font-medium leading-relaxed">
                        {session.evaluation.pointsToImprove.map((p, idx) => (
                          <li key={idx} className="pl-1 text-slate-300">{p}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="border-t border-slate-800/80 pt-4">
                    <span className="text-[10px] text-blue-400 block font-mono">Expert Recruiter Summary</span>
                    <p className="text-xs text-slate-300 mt-1 pb-1 leading-relaxed italic border-l-2 border-blue-500/40 pl-3">
                      "{session.evaluation.feedback}"
                    </p>
                  </div>
                </div>

                <div className="pt-4 flex gap-4">
                  <button
                    onClick={() => {
                      if (window.speechSynthesis) window.speechSynthesis.cancel();
                      setSession(null);
                    }}
                    className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-750 text-white border border-slate-700 font-semibold text-xs rounded-xl transition-all cursor-pointer text-center"
                  >
                    Close & Start Another Track
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 relative overflow-hidden h-[540px] flex flex-col justify-between overflow-y-auto">
                <div className="space-y-4">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block font-mono">AI Live Coach & Voice Tuning Lab</span>
                  
                  {/* Persona Tuning Selection */}
                  <div className="bg-white p-3.5 border border-slate-200 rounded-xl space-y-2.5">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      Interviewer Persona Character
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {VOICE_PERSONAS.map(p => (
                        <button
                          key={p.id}
                          onClick={() => {
                            setCurrentPersona(p.id);
                            // Say greeting preview
                            speakText(`Hello, I am ${p.name.split(" ")[0]}.`);
                          }}
                          className={`p-2 rounded-lg border text-left transition-all ${
                            currentPersona === p.id
                              ? "border-blue-600 bg-blue-50/40 text-blue-900 font-semibold"
                              : "border-slate-250 bg-slate-50 text-slate-600 hover:bg-slate-100"
                          }`}
                        >
                          <span className="text-sm block">{p.avatar}</span>
                          <span className="text-[10px] block truncate font-bold mt-1">
                            {p.id === "mentor" ? "Nisha (Mentor)" : p.id === "executive" ? "Roy (HR)" : "Vikram (SDE)"}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* System Voice Accent Overrides */}
                  <div className="bg-white p-3.5 border border-slate-200 rounded-xl space-y-2">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      System Accent Synthesis Engine
                    </label>
                    <select
                      value={selectedVoiceName}
                      onChange={(e) => setSelectedVoiceName(e.target.value)}
                      className="w-full text-[11px] p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-705 font-semibold outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      {systemVoices.length === 0 ? (
                        <option>Default Local Accent</option>
                      ) : (
                        systemVoices.map(v => (
                          <option key={v.name} value={v.name}>
                            {v.name.replace("Google", "").substring(0, 32)}
                          </option>
                        ))
                      )}
                    </select>
                    <p className="text-[9px] text-slate-400">
                      Tweak accents and pronunciations based on your local device voices.
                    </p>
                  </div>

                  {/* Hands-Free Auto-Submit Speech */}
                  <div className="bg-white p-3.5 border border-slate-200 rounded-xl flex items-center justify-between gap-3">
                    <div className="space-y-0.5">
                      <span className="text-[11px] font-bold text-slate-700 block">
                        Handsforce Auto-Submit
                      </span>
                      <span className="text-[9px] text-slate-400 block leading-tight">
                        Instantly submits and moves to the next question when silence is detected.
                      </span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={autoSubmitByVoice}
                        onChange={(e) => setAutoSubmitByVoice(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-8 h-4 bg-slate-200 rounded-full peer peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[4px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:after:translate-x-4"></div>
                    </label>
                  </div>

                  <div className="space-y-1.5 text-[10px] text-slate-500 bg-blue-50/40 p-2.5 rounded-xl border border-blue-100/30 leading-normal font-medium">
                    <div className="flex gap-1.5 items-start">
                      <HelpCircle className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                      <span>Answers are processed using advanced AI to review technical scope. If voice is silent or failed, you will hear a polite request to repeat.</span>
                    </div>
                  </div>
                </div>

                {/* Simulated visual noise decibel wave */}
                <div className="p-3 bg-slate-900 rounded-xl relative overflow-hidden mt-3 shrink-0">
                  <div className="absolute top-2 left-2 text-[8px] font-mono text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                    <span>VOICE INPUT WAVEFORM MONITOR</span>
                  </div>
                  <div className="h-10 flex items-end justify-center space-x-1.5 pt-2 pb-0.5">
                    <span className={`w-1 bg-emerald-400 rounded transition-all duration-300 ${isListening ? "h-8 animate-bounce" : "h-3 animate-pulse"}`} />
                    <span className={`w-1 bg-emerald-400 rounded transition-all duration-300 ${isListening ? "h-6 animate-pulse [animation-delay:0.1s]" : "h-2"}`} />
                    <span className={`w-1 bg-emerald-400 rounded transition-all duration-300 ${isListening ? "h-7 animate-bounce [animation-delay:0.3s]" : "h-4"}`} />
                    <span className={`w-1 bg-emerald-400 rounded transition-all duration-300 ${isListening ? "h-5 animate-pulse [animation-delay:0.2s]" : "h-2"}`} />
                    <span className={`w-1 bg-emerald-400 rounded transition-all duration-300 ${isListening ? "h-8 animate-bounce [animation-delay:0.4s]" : "h-4"}`} />
                    <span className={`w-1 bg-slate-700 rounded transition-all duration-300 h-1.5`} />
                  </div>
                </div>

                <div className="text-center text-[9px] text-slate-400 font-semibold uppercase tracking-wider pt-2 border-t border-slate-200 mt-2 shrink-0">
                  POWERED BY GOOGLE GEMINI 3.5 AI COGNITION
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
