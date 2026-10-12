import React, { useState } from 'react';
import {
  ShieldCheck,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  AlertTriangle,
  RotateCcw,
  Trophy,
  BookOpen,
  Calendar,
  X,
  Save,
  Check,
  Info
} from 'lucide-react';
import { useApp } from '../context/AppContext.tsx';
import {
  Hackathon,
  Course,
  TechDomain,
  DifficultyLevel,
  EffortLevel,
  EventFormat,
  CourseProvider
} from '../types/index.ts';

export const AdminPage: React.FC = () => {
  const {
    hackathons,
    courses,
    createHackathon,
    updateHackathon,
    deleteHackathon,
    createCourse,
    updateCourse,
    deleteCourse,
    resetAllData
  } = useApp();

  const [activeTab, setActiveTab] = useState<'hackathons' | 'courses'>('hackathons');
  const [showHackathonModal, setShowHackathonModal] = useState(false);
  const [editingHackathonId, setEditingHackathonId] = useState<string | null>(null);

  // Form State for Hackathon
  const [hTitle, setHTitle] = useState('');
  const [hOrganizer, setHOrganizer] = useState('');
  const [hTagline, setHTagline] = useState('');
  const [hDescription, setHDescription] = useState('');
  const [hDomain, setHDomain] = useState<TechDomain>('AI & Machine Learning');
  const [hStartDate, setHStartDate] = useState('2026-11-20T09:00:00Z');
  const [hEndDate, setHEndDate] = useState('2026-11-22T18:00:00Z');
  const [hDeadline, setHDeadline] = useState('2026-11-10T23:59:59Z');
  const [hLocation, setHLocation] = useState('Virtual / Online');
  const [hFormat, setHFormat] = useState<EventFormat>('Online');
  const [hIsFree, setHIsFree] = useState(true);
  const [hFee, setHFee] = useState(0);
  const [hCurrency, setHCurrency] = useState('USD');
  const [hEligibility, setHEligibility] = useState('Open to all students globally');
  const [hMinTeam, setHMinTeam] = useState(1);
  const [hMaxTeam, setHMaxTeam] = useState(4);
  const [hSkills, setHSkills] = useState('React, Python, APIs');
  const [hDifficulty, setHDifficulty] = useState<DifficultyLevel>('Beginner');
  const [hEffort, setHEffort] = useState<EffortLevel>('Medium Effort');
  const [hPrepTime, setHPrepTime] = useState('2 weeks');
  const [hUrl, setHUrl] = useState('https://devfolio.co');

  const openCreateHackathonModal = () => {
    setEditingHackathonId(null);
    setHTitle('');
    setHOrganizer('');
    setHTagline('');
    setHDescription('');
    setHDomain('AI & Machine Learning');
    setHLocation('Virtual');
    setHFormat('Online');
    setHIsFree(true);
    setHFee(0);
    setHCurrency('USD');
    setHEligibility('College students');
    setHMinTeam(1);
    setHMaxTeam(4);
    setHSkills('Python, React');
    setHDifficulty('Beginner');
    setHEffort('Medium Effort');
    setHPrepTime('2 weeks');
    setHUrl('https://example.com');
    setShowHackathonModal(true);
  };

  const openEditHackathonModal = (h: Hackathon) => {
    setEditingHackathonId(h.id);
    setHTitle(h.title);
    setHOrganizer(h.organizer);
    setHTagline(h.tagline);
    setHDescription(h.description);
    setHDomain(h.domain);
    setHStartDate(h.startDate);
    setHEndDate(h.endDate);
    setHDeadline(h.registrationDeadline);
    setHLocation(h.location);
    setHFormat(h.format);
    setHIsFree(h.isFree);
    setHFee(h.registrationFee);
    setHCurrency(h.currency);
    setHEligibility(h.eligibility);
    setHMinTeam(h.minTeamSize);
    setHMaxTeam(h.maxTeamSize);
    setHSkills(h.requiredSkills.join(', '));
    setHDifficulty(h.difficulty);
    setHEffort(h.effort);
    setHPrepTime(h.prepTime);
    setHUrl(h.officialRegistrationUrl);
    setShowHackathonModal(true);
  };

  const handleSaveHackathon = async (e: React.FormEvent) => {
    e.preventDefault();
    const skillsArray = hSkills.split(',').map((s) => s.trim()).filter(Boolean);

    const data: Partial<Hackathon> = {
      title: hTitle,
      organizer: hOrganizer,
      tagline: hTagline,
      description: hDescription,
      domain: hDomain,
      startDate: hStartDate,
      endDate: hEndDate,
      registrationDeadline: hDeadline,
      location: hLocation,
      format: hFormat,
      isFree: hIsFree,
      registrationFee: hIsFree ? 0 : hFee,
      currency: hCurrency,
      additionalCostsEstimated: 'None reported',
      eligibility: hEligibility,
      minTeamSize: hMinTeam,
      maxTeamSize: hMaxTeam,
      requiredSkills: skillsArray,
      prerequisites: ['Basic familiarity with stack'],
      difficulty: hDifficulty,
      difficultySource: 'Opportunity Atlas Estimate',
      difficultyRationale: 'Evaluated based on prerequisites and problem scope.',
      effort: hEffort,
      effortSource: 'Opportunity Atlas Estimate',
      effortRationale: 'Estimated preparation and sprint duration workload.',
      prepTime: hPrepTime,
      eventDuration: '36 hours',
      toolsAndResources: ['Standard IDE', 'GitHub'],
      prizesAndBenefits: ['Certificate of participation', 'Cash awards for top finalists'],
      officialRegistrationUrl: hUrl,
      lastVerified: new Date().toISOString().split('T')[0],
      isDemoData: false
    };

    if (editingHackathonId) {
      await updateHackathon(editingHackathonId, data);
    } else {
      await createHackathon(data);
    }
    setShowHackathonModal(false);
  };

  const handleToggleVerified = async (h: Hackathon) => {
    await updateHackathon(h.id, {
      lastVerified: new Date().toISOString().split('T')[0]
    });
  };

  const handleToggleExpired = async (h: Hackathon) => {
    await updateHackathon(h.id, {
      isExpired: !h.isExpired
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Admin Header */}
      <div className="bg-slate-900 text-white p-8 rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-800 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Authorized Administrator Access</span>
          </div>
          <h1 className="text-2xl font-black mt-2">Opportunity Atlas Directory Management</h1>
          <p className="text-xs text-slate-400 max-w-xl">
            Maintain verified accuracy of deadlines, official registration URLs, difficulty and effort estimates, and cross-provider learning resources.
          </p>
        </div>

        <button
          onClick={async () => {
            if (confirm('Reset database back to the clean initial verified dataset?')) {
              await resetAllData();
              alert('Data reset to default.');
            }
          }}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors border border-slate-700"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset to Clean Seed Dataset</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 bg-white rounded-t-2xl px-4 pt-2 text-xs font-bold text-slate-600 space-x-2">
        <button
          onClick={() => setActiveTab('hackathons')}
          className={`py-3 px-4 border-b-2 transition-all flex items-center space-x-1.5 ${
            activeTab === 'hackathons'
              ? 'border-indigo-600 text-indigo-700 bg-indigo-50/40 rounded-t-lg'
              : 'border-transparent hover:text-slate-900'
          }`}
        >
          <Trophy className="w-4 h-4" />
          <span>Hackathons ({hackathons.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('courses')}
          className={`py-3 px-4 border-b-2 transition-all flex items-center space-x-1.5 ${
            activeTab === 'courses'
              ? 'border-indigo-600 text-indigo-700 bg-indigo-50/40 rounded-t-lg'
              : 'border-transparent hover:text-slate-900'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Courses ({courses.length})</span>
        </button>
      </div>

      {/* TAB CONTENT: HACKATHONS */}
      {activeTab === 'hackathons' && (
        <div className="bg-white rounded-b-2xl border-x border-b border-slate-200 p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">Live Hackathon Directory</h3>
              <p className="text-xs text-slate-500">Edit parameters, verify timestamps, or flag expired deadlines</p>
            </div>
            <button
              onClick={openCreateHackathonModal}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Listing</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase">
                <tr>
                  <th className="p-3">Hackathon Title</th>
                  <th className="p-3">Domain</th>
                  <th className="p-3">Difficulty & Effort</th>
                  <th className="p-3">Deadline</th>
                  <th className="p-3">Verification</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {hackathons.map((h) => (
                  <tr key={h.id} className="hover:bg-slate-50">
                    <td className="p-3">
                      <div className="font-bold text-slate-900">{h.title}</div>
                      <div className="text-[10px] text-slate-400">{h.organizer}</div>
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                        {h.domain}
                      </span>
                    </td>
                    <td className="p-3">
                      <div>Diff: <strong>{h.difficulty}</strong></div>
                      <div>Effort: <strong>{h.effort}</strong></div>
                    </td>
                    <td className="p-3 text-rose-600 font-bold">
                      {new Date(h.registrationDeadline).toLocaleDateString()}
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => handleToggleVerified(h)}
                        className="px-2 py-1 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 flex items-center space-x-1"
                        title="Click to stamp verified as of today"
                      >
                        <Check className="w-3 h-3" />
                        <span>Verified {h.lastVerified}</span>
                      </button>
                    </td>
                    <td className="p-3 text-right space-x-2">
                      <button
                        onClick={() => openEditHackathonModal(h)}
                        className="p-1 rounded text-slate-600 hover:text-indigo-600"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={async () => {
                          if (confirm(`Delete "${h.title}"?`)) {
                            await deleteHackathon(h.id);
                          }
                        }}
                        className="p-1 rounded text-slate-600 hover:text-rose-600"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB CONTENT: COURSES */}
      {activeTab === 'courses' && (
        <div className="bg-white rounded-b-2xl border-x border-b border-slate-200 p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">Curated Course Catalog</h3>
              <p className="text-xs text-slate-500">Cross-provider courses with audit vs certificate transparency</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase">
                <tr>
                  <th className="p-3">Course Title</th>
                  <th className="p-3">Provider</th>
                  <th className="p-3">Level & Duration</th>
                  <th className="p-3">Audit / Cert Price</th>
                  <th className="p-3">Rating</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {courses.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-slate-900">{c.title}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-bold">
                        {c.provider}
                      </span>
                    </td>
                    <td className="p-3">
                      <div>{c.level}</div>
                      <div className="text-[10px] text-slate-400">{c.duration}</div>
                    </td>
                    <td className="p-3">
                      <div className="text-emerald-700 font-bold">
                        {c.freeAuditAvailable ? 'Free Audit' : `$${c.price}`}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Cert: {c.certificatePrice ? `$${c.certificatePrice}` : 'Included'}
                      </div>
                    </td>
                    <td className="p-3 font-bold text-amber-600">⭐ {c.rating}</td>
                    <td className="p-3 text-right">
                      <button
                        onClick={async () => {
                          if (confirm(`Delete course "${c.title}"?`)) {
                            await deleteCourse(c.id);
                          }
                        }}
                        className="p-1 rounded text-slate-600 hover:text-rose-600"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CREATE / EDIT HACKATHON MODAL */}
      {showHackathonModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-extrabold text-slate-900">
                {editingHackathonId ? 'Edit Hackathon Opportunity' : 'Add New Hackathon Opportunity'}
              </h3>
              <button onClick={() => setShowHackathonModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveHackathon} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Title</label>
                  <input
                    type="text"
                    required
                    value={hTitle}
                    onChange={(e) => setHTitle(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Organizer</label>
                  <input
                    type="text"
                    required
                    value={hOrganizer}
                    onChange={(e) => setHOrganizer(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Tagline</label>
                <input
                  type="text"
                  required
                  value={hTagline}
                  onChange={(e) => setHTagline(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Description</label>
                <textarea
                  rows={3}
                  required
                  value={hDescription}
                  onChange={(e) => setHDescription(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Domain</label>
                  <select
                    value={hDomain}
                    onChange={(e) => setHDomain(e.target.value as TechDomain)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  >
                    <option value="AI & Machine Learning">AI & Machine Learning</option>
                    <option value="Web & Mobile Development">Web & Mobile Development</option>
                    <option value="Data Science & Analytics">Data Science & Analytics</option>
                    <option value="Cybersecurity">Cybersecurity</option>
                    <option value="IoT & Robotics">IoT & Robotics</option>
                    <option value="Cloud & DevOps">Cloud & DevOps</option>
                    <option value="Blockchain & Web3">Blockchain & Web3</option>
                    <option value="Open Innovation & Social Good">Open Innovation & Social Good</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Difficulty</label>
                  <select
                    value={hDifficulty}
                    onChange={(e) => setHDifficulty(e.target.value as DifficultyLevel)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Effort Level</label>
                  <select
                    value={hEffort}
                    onChange={(e) => setHEffort(e.target.value as EffortLevel)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  >
                    <option value="Low Effort">Low Effort</option>
                    <option value="Medium Effort">Medium Effort</option>
                    <option value="High Effort">High Effort</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Format</label>
                  <select
                    value={hFormat}
                    onChange={(e) => setHFormat(e.target.value as EventFormat)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  >
                    <option value="Online">Online</option>
                    <option value="Offline">Offline</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Location</label>
                  <input
                    type="text"
                    value={hLocation}
                    onChange={(e) => setHLocation(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Deadline Date</label>
                  <input
                    type="date"
                    value={hDeadline.split('T')[0]}
                    onChange={(e) => setHDeadline(`${e.target.value}T23:59:59Z`)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Required Skills (Comma separated)</label>
                <input
                  type="text"
                  value={hSkills}
                  onChange={(e) => setHSkills(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Official Registration URL</label>
                <input
                  type="url"
                  required
                  value={hUrl}
                  onChange={(e) => setHUrl(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowHackathonModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-slate-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 text-white rounded-xl font-bold"
                >
                  Save Hackathon Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
