import React, { useState } from "react";
import { UserProfile, ExperienceLevel } from "../types";
import { Save, User, BookOpen, Briefcase, Plus, Trash2, CheckCircle, Smartphone } from "lucide-react";

interface ProfileEditorProps {
  profile: UserProfile;
  onSave: (updated: UserProfile) => void;
}

export default function ProfileEditor({ profile, onSave }: ProfileEditorProps) {
  const [localProfile, setLocalProfile] = useState<UserProfile>({ ...profile });
  const [successMsg, setSuccessMsg] = useState("");

  // Input lists states
  const [newCert, setNewCert] = useState("");
  const [newSkill, setNewSkill] = useState("");
  const [newTech, setNewTech] = useState("");
  const [newLocation, setNewLocation] = useState("");

  // Projects states
  const [projTitle, setProjTitle] = useState("");
  const [projDesc, setProjDesc] = useState("");
  const [projTech, setProjTech] = useState("");

  const handleSave = () => {
    onSave(localProfile);
    setSuccessMsg("Profile saved successfully to backend system!");
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  const addCert = () => {
    if (newCert) {
      setLocalProfile({
        ...localProfile,
        certifications: [...(localProfile.certifications || []), newCert]
      });
      setNewCert("");
    }
  };

  const addSkill = () => {
    if (newSkill) {
      setLocalProfile({
        ...localProfile,
        skills: [...(localProfile.skills || []), newSkill]
      });
      setNewSkill("");
    }
  };

  const addTech = () => {
    if (newTech) {
      setLocalProfile({
        ...localProfile,
        technologies: [...(localProfile.technologies || []), newTech]
      });
      setNewTech("");
    }
  };

  const addLocation = () => {
    if (newLocation) {
      setLocalProfile({
        ...localProfile,
        preferredLocations: [...(localProfile.preferredLocations || []), newLocation]
      });
      setNewLocation("");
    }
  };

  const addProject = () => {
    if (projTitle && projDesc) {
      const parsedTechs = projTech.split(",").map(t => t.trim()).filter(t => t !== "");
      setLocalProfile({
        ...localProfile,
        projects: [
          ...(localProfile.projects || []),
          { title: projTitle, description: projDesc, techs: parsedTechs }
        ]
      });
      setProjTitle("");
      setProjDesc("");
      setProjTech("");
    }
  };

  return (
    <div className="space-y-8" id="profile-section">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-5">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600" />
            <span>Candidate Application Profile</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Keep this accurate. Our Copilot Autofill maps context parameters strictly from these values to prevent invalid inputs.
          </p>
        </div>
        <button
          onClick={handleSave}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-5 py-2.5 rounded-xl cursor-pointer flex items-center space-x-2 shadow-sm transition-all"
          id="profile-save-btn"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 text-emerald-800 text-xs font-semibold rounded-xl border border-emerald-200 flex items-center space-x-2 transition-all">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-8">
        {/* Left Column: Personal info */}
        <div className="space-y-6 md:col-span-1">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 space-y-4 shadow-sm">
            <h4 className="font-bold text-xs text-slate-950 uppercase tracking-widest border-b border-slate-100 pb-2">
              Personal Information
            </h4>

            <div>
              <label className="block text-xs font-semibold text-slate-600">Full Name</label>
              <input
                type="text"
                value={localProfile.fullName}
                onChange={(e) => setLocalProfile({ ...localProfile, fullName: e.target.value })}
                className="mt-1 block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600">Email Address</label>
              <input
                type="email"
                value={localProfile.email}
                onChange={(e) => setLocalProfile({ ...localProfile, email: e.target.value })}
                className="mt-1 block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600">Phone</label>
              <input
                type="text"
                value={localProfile.phone}
                onChange={(e) => setLocalProfile({ ...localProfile, phone: e.target.value })}
                className="mt-1 block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600">City</label>
                <input
                  type="text"
                  value={localProfile.city}
                  onChange={(e) => setLocalProfile({ ...localProfile, city: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600">State</label>
                <input
                  type="text"
                  value={localProfile.state}
                  onChange={(e) => setLocalProfile({ ...localProfile, state: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600">Date of Birth</label>
                <input
                  type="date"
                  value={localProfile.dob}
                  onChange={(e) => setLocalProfile({ ...localProfile, dob: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:border-blue-500 text-slate-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600">Gender</label>
                <select
                  value={localProfile.gender}
                  onChange={(e) => setLocalProfile({ ...localProfile, gender: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:border-blue-500 text-slate-500"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600">LinkedIn URL</label>
              <input
                type="text"
                value={localProfile.linkedIn || ""}
                onChange={(e) => setLocalProfile({ ...localProfile, linkedIn: e.target.value })}
                className="mt-1 block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:border-blue-500"
                placeholder="https://linkedin.com/..."
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600">GitHub URL</label>
              <input
                type="text"
                value={localProfile.gitHub || ""}
                onChange={(e) => setLocalProfile({ ...localProfile, gitHub: e.target.value })}
                className="mt-1 block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:border-blue-500"
                placeholder="https://github.com/..."
              />
            </div>
          </div>
        </div>

        {/* Middle and Right: Education, Professional & Competencies */}
        <div className="space-y-6 md:col-span-2">
          {/* Education Header Block */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 space-y-4 shadow-sm">
            <h4 className="font-bold text-xs text-slate-910 uppercase tracking-widest border-b border-slate-100 pb-2 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-600" />
              <span>Academic Credentials</span>
            </h4>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600">Degree</label>
                <input
                  type="text"
                  value={localProfile.degree}
                  onChange={(e) => setLocalProfile({ ...localProfile, degree: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium"
                  placeholder="e.g. B.Tech in CSE"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600">Specialization</label>
                <input
                  type="text"
                  value={localProfile.specialization}
                  onChange={(e) => setLocalProfile({ ...localProfile, specialization: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium"
                  placeholder="e.g. Artificial Intelligence"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600">College / University Name</label>
                <input
                  type="text"
                  value={localProfile.collegeName}
                  onChange={(e) => setLocalProfile({ ...localProfile, collegeName: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600">Graduation Year</label>
                <input
                  type="text"
                  value={localProfile.graduationYear}
                  onChange={(e) => setLocalProfile({ ...localProfile, graduationYear: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium"
                />
              </div>
            </div>

            {/* Certifications Manager */}
            <div>
              <label className="block text-xs font-semibold text-slate-600">Professional Certifications</label>
              <div className="flex gap-2 mt-1">
                <input
                  type="text"
                  value={newCert}
                  onChange={(e) => setNewCert(e.target.value)}
                  className="block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium"
                  placeholder="Add certificate..."
                />
                <button
                  type="button"
                  onClick={addCert}
                  className="bg-slate-100 hover:bg-slate-200 p-2.5 rounded-lg border border-slate-300"
                >
                  <Plus className="w-4 h-4 text-slate-600" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {localProfile.certifications.map((cert, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200"
                  >
                    <span>{cert}</span>
                    <button
                      type="button"
                      onClick={() =>
                        setLocalProfile({
                          ...localProfile,
                          certifications: localProfile.certifications.filter((_, i) => i !== index)
                        })
                      }
                      className="text-slate-400 hover:text-slate-600"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Professional Context Profile */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 space-y-4 shadow-sm">
            <h4 className="font-bold text-xs text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-2 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-indigo-600" />
              <span>Career Constraints & Targets</span>
            </h4>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600">Experience Tier</label>
                <select
                  value={localProfile.experienceLevel}
                  onChange={(e) =>
                    setLocalProfile({
                      ...localProfile,
                      experienceLevel: e.target.value as ExperienceLevel
                    })
                  }
                  className="mt-1 block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:border-blue-500 text-slate-500"
                >
                  <option value={ExperienceLevel.FRESHER}>Fresher (0 Years)</option>
                  <option value={ExperienceLevel.EXPERIENCED}>Experienced (1+ Years)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600">Expected CTC (₹ LPA)</label>
                <input
                  type="text"
                  value={localProfile.expectedCTC}
                  onChange={(e) => setLocalProfile({ ...localProfile, expectedCTC: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium"
                  placeholder="e.g. 8"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600">Notice Period</label>
                <select
                  value={localProfile.noticePeriod}
                  onChange={(e) => setLocalProfile({ ...localProfile, noticePeriod: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-500"
                >
                  <option value="Immediate">Immediate / 1 week</option>
                  <option value="15 days">15 Days</option>
                  <option value="30 days">30 Days</option>
                  <option value="90 days">90 Days</option>
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600">Preferred Role</label>
                <input
                  type="text"
                  value={localProfile.preferredRole}
                  onChange={(e) => setLocalProfile({ ...localProfile, preferredRole: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600">Willing to Relocate</label>
                <div className="mt-3.5 flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={localProfile.willingToRelocate}
                    onChange={(e) => setLocalProfile({ ...localProfile, willingToRelocate: e.target.checked })}
                    className="rounded border-slate-200 text-blue-600 focus:ring-blue-500"
                    id="relocate-checkbox"
                  />
                  <span className="text-xs text-slate-500 font-medium">Yes, open to relocate across Indian tech clusters</span>
                </div>
              </div>
            </div>

            {/* Preferred Locations */}
            <div>
              <label className="block text-xs font-semibold text-slate-600">Target Locations (India)</label>
              <div className="flex gap-2 mt-1">
                <input
                  type="text"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium"
                  placeholder="Search Location (e.g. Pune, Bengaluru)..."
                />
                <button
                  type="button"
                  onClick={addLocation}
                  className="bg-slate-100 hover:bg-slate-200 p-2.5 rounded-lg border border-slate-300"
                >
                  <Plus className="w-4 h-4 text-slate-600" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {localProfile.preferredLocations.map((loc, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-indigo-55/70 text-indigo-700 border border-indigo-100"
                  >
                    <span>{loc}</span>
                    <button
                      type="button"
                      onClick={() =>
                        setLocalProfile({
                          ...localProfile,
                          preferredLocations: localProfile.preferredLocations.filter((_, i) => i !== idx)
                        })
                      }
                      className="text-indigo-400 hover:text-indigo-600"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Skills & Tech lists */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600">Core Expertise Skills</label>
                <div className="flex gap-2 mt-1">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    className="block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium"
                    placeholder="e.g. React"
                  />
                  <button
                    type="button"
                    onClick={addSkill}
                    className="bg-slate-100 hover:bg-slate-200 p-2.5 rounded-lg"
                  >
                    <Plus className="w-3.5 h-3.5 text-slate-650" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {localProfile.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-100"
                    >
                      <span>{skill}</span>
                      <button
                        type="button"
                        onClick={() =>
                          setLocalProfile({
                            ...localProfile,
                            skills: localProfile.skills.filter((_, i) => i !== index)
                          })
                        }
                        className="text-emerald-500 hover:text-emerald-700 font-bold ml-1"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600">Tools / Systems / Build Engines</label>
                <div className="flex gap-2 mt-1">
                  <input
                    type="text"
                    value={newTech}
                    onChange={(e) => setNewTech(e.target.value)}
                    className="block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium"
                    placeholder="e.g. Docker"
                  />
                  <button
                    type="button"
                    onClick={addTech}
                    className="bg-slate-100 hover:bg-slate-200 p-2.5 rounded-lg"
                  >
                    <Plus className="w-3.5 h-3.5 text-slate-650" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {localProfile.technologies.map((tech, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-blue-50 text-blue-800 border border-blue-100"
                    >
                      <span>{tech}</span>
                      <button
                        type="button"
                        onClick={() =>
                          setLocalProfile({
                            ...localProfile,
                            technologies: localProfile.technologies.filter((_, i) => i !== index)
                          })
                        }
                        className="text-blue-500 hover:text-blue-700 font-bold ml-1"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Core Projects List */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 space-y-4 shadow-sm">
            <h4 className="font-bold text-xs text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-2 flex items-center justify-between">
              <span>Showcase Projects</span>
              <span className="text-[10px] text-slate-400 capitalize normal-case font-normal">Add projects to increase matching score</span>
            </h4>

            {localProfile.projects && localProfile.projects.length > 0 && (
              <div className="space-y-4 mb-6">
                {localProfile.projects.map((proj, idx) => (
                  <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200 relative">
                    <button
                      type="button"
                      onClick={() =>
                        setLocalProfile({
                          ...localProfile,
                          projects: localProfile.projects.filter((_, i) => i !== idx)
                        })
                      }
                      className="absolute top-4 right-4 text-slate-400 hover:text-red-500 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <h5 className="font-bold text-xs text-slate-900">{proj.title}</h5>
                    <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{proj.description}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {proj.techs.map((t, i) => (
                        <span key={i} className="text-[9px] bg-white border border-slate-200 text-slate-600 px-1.5 py-0.5 rounded font-mono">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="bg-slate-50/50 p-5 rounded-2xl border border-dashed border-slate-300 space-y-3">
              <span className="text-xs font-bold text-slate-800">Add New Project</span>
              <div className="grid md:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={projTitle}
                  onChange={(e) => setProjTitle(e.target.value)}
                  className="bg-white px-3 py-2 border border-slate-200 rounded-lg text-xs"
                  placeholder="Project Title"
                />
                <input
                  type="text"
                  value={projTech}
                  onChange={(e) => setProjTech(e.target.value)}
                  className="bg-white px-3 py-2 border border-slate-200 rounded-lg text-xs"
                  placeholder="Tech Tags (comma separated)"
                />
              </div>
              <textarea
                value={projDesc}
                onChange={(e) => setProjDesc(e.target.value)}
                className="w-full bg-white px-3 py-2 border border-slate-200 rounded-lg text-xs h-16"
                placeholder="Brief project description..."
              />
              <button
                type="button"
                onClick={projTitle && projDesc ? addProject : undefined}
                className="py-2 px-4 bg-slate-800 hover:bg-slate-900 disabled:opacity-50 text-white text-xs font-semibold rounded-lg flex items-center space-x-2"
                disabled={!projTitle || !projDesc}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Append Project</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
