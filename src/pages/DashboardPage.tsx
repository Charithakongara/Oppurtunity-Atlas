import React, { useState } from 'react';
import {
  User,
  Trophy,
  BookOpen,
  Sparkles,
  Layers,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  Plus,
  Trash2,
  Edit2,
  Save,
  CheckSquare,
  Square,
  Award,
  Link as LinkIcon,
  Bell,
  Sliders,
  DollarSign
} from 'lucide-react';
import { useApp } from '../context/AppContext.tsx';
import {
  TechDomain,
  DifficultyLevel,
  ApplicationStatus,
  CourseStatus,
  DeclaredSkill
} from '../types/index.ts';

export const DashboardPage: React.FC = () => {
  const {
    user,
    updateUserProfile,
    applications,
    setApplicationStatus,
    removeApplication,
    hackathons,
    courses,
    trackedCourses,
    setCourseProgress,
    removeCourseProgress,
    roadmaps,
    toggleRoadmapStep,
    deleteRoadmap,
    reviews,
    setActiveCoachReview,
    setCurrentPage,
    setSelectedHackathonId
  } = useApp();

  const [activeTab, setActiveTab] = useState<'applications' | 'courses' | 'roadmaps' | 'skills' | 'profile'>('applications');

  // Profile Edit State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [headline, setHeadline] = useState(user?.headline || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [education, setEducation] = useState(user?.education || '');
  const [weeklyHours, setWeeklyHours] = useState(user?.weeklyAvailabilityHours || 10);
  const [maxBudget, setMaxBudget] = useState(user?.maxBudget || 50);

  // New Skill Modal/Form
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState<DifficultyLevel>('Beginner');
  const [newSkillEvidence, setNewSkillEvidence] = useState('');
  const [showAddSkillForm, setShowAddSkillForm] = useState(false);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateUserProfile({
      name,
      headline,
      bio,
      education,
      weeklyAvailabilityHours: weeklyHours,
      maxBudget
    });
    setIsEditingProfile(false);
  };

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim() || !user) return;
    const updatedSkills: DeclaredSkill[] = [
      ...user.declaredSkills,
      {
        name: newSkillName.trim(),
        level: newSkillLevel,
        evidence: newSkillEvidence.trim() || undefined
      }
    ];
    await updateUserProfile({ declaredSkills: updatedSkills });
    setNewSkillName('');
    setNewSkillEvidence('');
    setShowAddSkillForm(false);
  };

  const handleRemoveSkill = async (skillName: string) => {
    if (!user) return;
    const updatedSkills = user.declaredSkills.filter((s) => s.name !== skillName);
    await updateUserProfile({ declaredSkills: updatedSkills });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Profile Summary Banner */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center space-x-5">
          <img
            src={user?.avatarUrl || ''}
            alt={user?.name}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-4 ring-indigo-50 shadow-sm"
          />
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-extrabold text-slate-900">{user?.name}</h1>
              <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-bold uppercase tracking-wider">
                Student
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">{user?.headline}</p>
            <p className="text-xs text-slate-400">{user?.education} • {user?.email}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 self-stretch md:self-auto justify-end">
          <button
            onClick={() => setActiveTab('profile')}
            className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl flex items-center space-x-1.5 transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Edit Profile</span>
          </button>
        </div>
      </div>

      {/* Overview Stat Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold uppercase text-slate-400">Tracked Hackathons</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{applications.length}</div>
          <span className="text-[11px] text-indigo-600 font-semibold">Active Pipeline</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold uppercase text-slate-400">Enrolled Courses</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{trackedCourses.length}</div>
          <span className="text-[11px] text-emerald-600 font-semibold">
            {trackedCourses.filter((c) => c.status === 'Completed').length} Completed
          </span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold uppercase text-slate-400">Active Roadmaps</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{roadmaps.length}</div>
          <span className="text-[11px] text-violet-600 font-semibold">Step Progression</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold uppercase text-slate-400">AI Coach Reviews</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{reviews.length}</div>
          <span className="text-[11px] text-amber-600 font-semibold">Post-Mortem Audits</span>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex border-b border-slate-200 bg-white rounded-t-2xl px-4 pt-2 text-xs font-bold text-slate-600 space-x-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('applications')}
          className={`py-3 px-3 border-b-2 transition-all flex items-center space-x-1.5 whitespace-nowrap ${
            activeTab === 'applications'
              ? 'border-indigo-600 text-indigo-700 bg-indigo-50/40 rounded-t-lg'
              : 'border-transparent hover:text-slate-900'
          }`}
        >
          <Trophy className="w-4 h-4" />
          <span>Hackathon Applications ({applications.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('courses')}
          className={`py-3 px-3 border-b-2 transition-all flex items-center space-x-1.5 whitespace-nowrap ${
            activeTab === 'courses'
              ? 'border-indigo-600 text-indigo-700 bg-indigo-50/40 rounded-t-lg'
              : 'border-transparent hover:text-slate-900'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Course Learning ({trackedCourses.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('roadmaps')}
          className={`py-3 px-3 border-b-2 transition-all flex items-center space-x-1.5 whitespace-nowrap ${
            activeTab === 'roadmaps'
              ? 'border-indigo-600 text-indigo-700 bg-indigo-50/40 rounded-t-lg'
              : 'border-transparent hover:text-slate-900'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Learning Roadmaps ({roadmaps.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('skills')}
          className={`py-3 px-3 border-b-2 transition-all flex items-center space-x-1.5 whitespace-nowrap ${
            activeTab === 'skills'
              ? 'border-indigo-600 text-indigo-700 bg-indigo-50/40 rounded-t-lg'
              : 'border-transparent hover:text-slate-900'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Skills & Evidence ({user?.declaredSkills.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`py-3 px-3 border-b-2 transition-all flex items-center space-x-1.5 whitespace-nowrap ${
            activeTab === 'profile'
              ? 'border-indigo-600 text-indigo-700 bg-indigo-50/40 rounded-t-lg'
              : 'border-transparent hover:text-slate-900'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Profile & Preferences</span>
        </button>
      </div>

      {/* TAB CONTENT */}
      <div className="bg-white rounded-b-2xl border-x border-b border-slate-200 p-6 sm:p-8">
        
        {/* 1. APPLICATIONS TAB */}
        {activeTab === 'applications' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Tracked Hackathon Opportunities</h3>
                <p className="text-xs text-slate-500">Pipeline from initial interest to final competition completion</p>
              </div>
              <button
                onClick={() => setCurrentPage('hackathons')}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs"
              >
                + Find More Hackathons
              </button>
            </div>

            {applications.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-500 space-y-2">
                <Trophy className="w-8 h-8 text-slate-300 mx-auto" />
                <p>No hackathons tracked yet. Browse the directory to save upcoming events.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {applications.map((app) => {
                  const hack = hackathons.find((h) => h.id === app.hackathonId);
                  if (!hack) return null;

                  return (
                    <div
                      key={app.hackathonId}
                      className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-extrabold text-sm text-slate-900 hover:text-indigo-600 cursor-pointer" onClick={() => { setSelectedHackathonId(hack.id); setCurrentPage('hackathons'); }}>
                            {hack.title}
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium">({hack.organizer})</span>
                        </div>
                        <div className="flex items-center space-x-3 text-slate-500">
                          <span>Deadline: {new Date(hack.registrationDeadline).toLocaleDateString()}</span>
                          <span>•</span>
                          <span>Format: {hack.format}</span>
                          {app.teamName && (
                            <>
                              <span>•</span>
                              <span className="font-semibold text-indigo-700">Team: {app.teamName}</span>
                            </>
                          )}
                        </div>
                        {app.notes && (
                          <p className="text-[11px] text-slate-600 italic">"{app.notes}"</p>
                        )}
                      </div>

                      <div className="flex items-center space-x-2 self-end md:self-auto">
                        <select
                          value={app.status}
                          onChange={(e) => setApplicationStatus(app.hackathonId, e.target.value as ApplicationStatus)}
                          className={`py-1.5 px-3 rounded-xl font-bold text-xs border ${
                            app.status === 'Completed'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                              : app.status === 'Applied'
                              ? 'bg-blue-50 text-blue-800 border-blue-300'
                              : app.status === 'Preparing'
                              ? 'bg-violet-50 text-violet-800 border-violet-300'
                              : 'bg-white text-slate-700 border-slate-300'
                          }`}
                        >
                          <option value="Interested">Interested</option>
                          <option value="Preparing">Preparing</option>
                          <option value="Applied">Applied</option>
                          <option value="Participating">Participating</option>
                          <option value="Completed">Completed</option>
                        </select>

                        <button
                          onClick={() => removeApplication(app.hackathonId)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                          title="Remove from tracking"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* 2. COURSES TAB */}
        {activeTab === 'courses' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Enrolled & Saved Courses</h3>
                <p className="text-xs text-slate-500">Track progress percentage, lab completions, and credentials</p>
              </div>
              <button
                onClick={() => setCurrentPage('courses')}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold"
              >
                + Find Courses
              </button>
            </div>

            {trackedCourses.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-500 space-y-2">
                <BookOpen className="w-8 h-8 text-slate-300 mx-auto" />
                <p>No courses saved yet. Browse Course Finder to build your learning list.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {trackedCourses.map((tc) => {
                  const course = courses.find((c) => c.id === tc.courseId);
                  if (!course) return null;

                  return (
                    <div
                      key={tc.courseId}
                      className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-3"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-extrabold text-sm text-slate-900">{course.title}</span>
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-50 text-indigo-700">
                              {course.provider}
                            </span>
                          </div>
                          <p className="text-slate-500 text-[11px] mt-0.5">{course.skillsCovered.join(' • ')}</p>
                        </div>

                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => removeCourseProgress(tc.courseId)}
                            className="p-1 rounded text-slate-400 hover:text-rose-600"
                            title="Remove"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Progress Bar & Slider */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-700">
                          <span>Progress: {tc.progressPercent}%</span>
                          <span className={tc.status === 'Completed' ? 'text-emerald-700 font-bold' : 'text-slate-500'}>
                            Status: {tc.status}
                          </span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={tc.progressPercent}
                          onChange={(e) => {
                            const val = parseInt(e.target.value, 10);
                            setCourseProgress(tc.courseId, val === 100 ? 'Completed' : 'In Progress', val);
                          }}
                          className="w-full accent-indigo-600"
                        />
                      </div>

                      <div className="pt-2 flex items-center justify-between border-t border-slate-200 text-[11px]">
                        <a
                          href={course.officialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-bold text-indigo-600 hover:underline flex items-center space-x-1"
                        >
                          <span>Open Provider Syllabus</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>

                        {tc.certificateUrl && (
                          <a
                            href={tc.certificateUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-bold text-emerald-700 hover:underline flex items-center space-x-1"
                          >
                            <Award className="w-3.5 h-3.5" />
                            <span>View Verified Certificate</span>
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* 3. ROADMAPS TAB */}
        {activeTab === 'roadmaps' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Personalized Learning Roadmaps</h3>
                <p className="text-xs text-slate-500">Ordered milestones with prerequisites, projects, and target competitions</p>
              </div>
              <button
                onClick={() => setCurrentPage('courses')}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold"
              >
                + Generate New Roadmap
              </button>
            </div>

            {roadmaps.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-500 space-y-2">
                <Layers className="w-8 h-8 text-slate-300 mx-auto" />
                <p>No active roadmaps generated yet. Click above to create one.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {roadmaps.map((rdm) => (
                  <div key={rdm.id} className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-bold uppercase text-indigo-700 tracking-wider">
                          Goal: {rdm.goal}
                        </span>
                        <h4 className="font-extrabold text-base text-slate-900 mt-0.5">{rdm.title}</h4>
                      </div>
                      <button
                        onClick={() => deleteRoadmap(rdm.id)}
                        className="text-slate-400 hover:text-rose-600 p-1"
                        title="Delete Roadmap"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Step-by-Step interactive checklist */}
                    <div className="space-y-2 pt-2">
                      <span className="font-bold text-slate-800 uppercase text-[10px] block">Sequential Steps:</span>
                      {rdm.steps.map((st) => (
                        <div
                          key={st.id}
                          onClick={() => toggleRoadmapStep(rdm.id, st.id, !st.completed)}
                          className={`p-3 rounded-xl border flex items-start space-x-3 cursor-pointer transition-all ${
                            st.completed
                              ? 'bg-emerald-50 border-emerald-200 text-emerald-900 line-through'
                              : 'bg-white border-slate-200 text-slate-800 hover:border-indigo-300'
                          }`}
                        >
                          {st.completed ? (
                            <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          ) : (
                            <Square className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                          )}
                          <div>
                            <div className="font-bold">{st.title}</div>
                            <div className="text-[11px] text-slate-500 mt-0.5">{st.description}</div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Capstone Project Card */}
                    <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-1">
                      <span className="text-[10px] font-bold uppercase text-indigo-600">Capstone Deliverable</span>
                      <div className="font-bold text-slate-900">{rdm.practicalProject.title}</div>
                      <p className="text-slate-600 text-[11px]">{rdm.practicalProject.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 4. SKILLS & EVIDENCE TAB */}
        {activeTab === 'skills' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Verified Skills & Project Evidence</h3>
                <p className="text-xs text-slate-500">
                  Opportunity Atlas does not claim mastery without artifacts. Attach project URLs or certificates.
                </p>
              </div>
              <button
                onClick={() => setShowAddSkillForm(!showAddSkillForm)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Skill with Evidence</span>
              </button>
            </div>

            {/* Add Skill Form */}
            {showAddSkillForm && (
              <form onSubmit={handleAddSkill} className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-200 text-xs space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Skill Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Docker, Solidity, PyTorch"
                      value={newSkillName}
                      onChange={(e) => setNewSkillName(e.target.value)}
                      className="w-full p-2 bg-white border border-slate-300 rounded-lg text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Competency Level</label>
                    <select
                      value={newSkillLevel}
                      onChange={(e) => setNewSkillLevel(e.target.value as DifficultyLevel)}
                      className="w-full p-2 bg-white border border-slate-300 rounded-lg text-slate-900"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Evidence / Artifact Description</label>
                    <input
                      type="text"
                      placeholder="e.g. GitHub repo link or course capstone"
                      value={newSkillEvidence}
                      onChange={(e) => setNewSkillEvidence(e.target.value)}
                      className="w-full p-2 bg-white border border-slate-300 rounded-lg text-slate-900"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowAddSkillForm(false)}
                    className="px-3 py-1.5 border border-slate-300 rounded-lg text-slate-600 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-indigo-600 text-white rounded-lg font-bold"
                  >
                    Save Skill
                  </button>
                </div>
              </form>
            )}

            {/* Skills List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {user?.declaredSkills.map((sk) => (
                <div
                  key={sk.name}
                  className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-900 text-sm">{sk.name}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700">
                        {sk.level}
                      </span>
                    </div>
                    {sk.evidence ? (
                      <div className="text-[11px] text-slate-600 flex items-center space-x-1">
                        <LinkIcon className="w-3 h-3 text-slate-400" />
                        <span>{sk.evidence}</span>
                      </div>
                    ) : (
                      <span className="text-[10px] text-slate-400 italic">No project evidence attached yet</span>
                    )}
                  </div>
                  <button
                    onClick={() => handleRemoveSkill(sk.name)}
                    className="text-slate-400 hover:text-rose-600 p-1"
                    title="Delete skill"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. PROFILE & PREFERENCES TAB */}
        {activeTab === 'profile' && (
          <form onSubmit={handleSaveProfile} className="space-y-5 text-xs max-w-2xl">
            <h3 className="text-base font-extrabold text-slate-900">Student Profile & Matching Settings</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Current Status</label>
                <select
                  value={user?.currentStatus || 'Student'}
                  onChange={(e) => updateUserProfile({ currentStatus: e.target.value as any })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold"
                >
                  <option value="Student">🎓 Student (Undergrad/Postgrad)</option>
                  <option value="Professor / Academic">👨‍🏫 Professor / Academic / Researcher</option>
                  <option value="Working Professional">💼 Working Professional / Engineer</option>
                  <option value="Self-Taught Developer">💻 Self-Taught Developer</option>
                  <option value="Other">🌐 Other Technical Explorer</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">College / University / Organization</label>
                <input
                  type="text"
                  value={user?.institution || ''}
                  placeholder="e.g. VNR VJIET, Stanford, IIIT..."
                  onChange={(e) => updateUserProfile({ institution: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                />
              </div>
            </div>

            {/* Target Skills to Learn Section */}
            <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 space-y-2">
              <label className="font-extrabold text-indigo-950 block">Skills You Want to Learn</label>
              <div className="flex flex-wrap gap-1.5">
                {(user?.skillsWantToLearn || []).map((sk) => (
                  <span key={sk} className="px-2.5 py-1 bg-white border border-indigo-200 text-indigo-900 rounded-lg font-bold flex items-center space-x-1">
                    <span>{sk}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = (user?.skillsWantToLearn || []).filter((s) => s !== sk);
                        updateUserProfile({ skillsWantToLearn: updated });
                      }}
                      className="text-slate-400 hover:text-rose-600 font-bold ml-1"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <p className="text-[11px] text-slate-500">
                These target skills determine which courses are recommended and help the AI Coach suggest practice projects.
              </p>
            </div>

            <div className="pt-3">
              <button
                type="submit"
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-xs flex items-center space-x-1.5"
              >
                <Save className="w-4 h-4" />
                <span>Save Profile Changes</span>
              </button>
            </div>
          </form>
        )}

      </div>

    </div>
  );
};
