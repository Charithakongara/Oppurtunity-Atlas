import React, { useState, useMemo } from 'react';
import {
  Search,
  BookOpen,
  Filter,
  CheckCircle,
  Clock,
  DollarSign,
  Award,
  ExternalLink,
  Sparkles,
  ArrowRight,
  Layers,
  Scale,
  X,
  Plus,
  Compass,
  Bookmark,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext.tsx';
import { Course, CourseProvider, DifficultyLevel, LearningRoadmap } from '../types/index.ts';

export const FindCoursesPage: React.FC = () => {
  const {
    courses,
    hackathons,
    user,
    trackedCourses,
    setCourseProgress,
    saveRoadmap,
    setCurrentPage
  } = useApp();

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('all');
  const [selectedProvider, setSelectedProvider] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [onlyFreeAudit, setOnlyFreeAudit] = useState(false);
  const [onlyFreeCert, setOnlyFreeCert] = useState(false);

  // Preference Form State
  const [prefSkill, setPrefSkill] = useState('');
  const [prefLevel, setPrefLevel] = useState<DifficultyLevel>('Beginner');
  const [prefGoal, setPrefGoal] = useState('Prepare for a hackathon');
  const [prefHoursPerWeek, setPrefHoursPerWeek] = useState<number>(user?.weeklyAvailabilityHours || 10);
  const [prefBudget, setPrefBudget] = useState<number>(user?.maxBudget || 0);
  const [prefNeedCert, setPrefNeedCert] = useState<boolean>(false);
  const [prefFormat, setPrefFormat] = useState('Self-Paced');
  const [showPreferenceForm, setShowPreferenceForm] = useState(false);

  // Compare Drawer (up to 3 courses)
  const [compareList, setCompareList] = useState<string[]>([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

  // Roadmap Generated Modal
  const [generatedRoadmap, setGeneratedRoadmap] = useState<LearningRoadmap | null>(null);

  // Filtered Courses
  const filteredCourses = useMemo(() => {
    return courses.filter((c) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = c.title.toLowerCase().includes(q);
        const matchesProvider = c.provider.toLowerCase().includes(q);
        const matchesSkill = c.skillsCovered.some((s) => s.toLowerCase().includes(q));
        const matchesDesc = c.description.toLowerCase().includes(q);
        if (!matchesTitle && !matchesProvider && !matchesSkill && !matchesDesc) return false;
      }
      if (selectedDomain !== 'all' && c.domain !== selectedDomain) return false;
      if (selectedProvider !== 'all' && c.provider !== selectedProvider) return false;
      if (selectedLevel !== 'all' && c.level !== selectedLevel) return false;
      if (onlyFreeAudit && !c.freeAuditAvailable) return false;
      if (onlyFreeCert && (!c.certificateIncluded || (c.certificatePrice && c.certificatePrice > 0))) return false;
      return true;
    });
  }, [courses, searchQuery, selectedDomain, selectedProvider, selectedLevel, onlyFreeAudit, onlyFreeCert]);

  // Recommendation Rationale Generator
  const getRecommendationReason = (c: Course): string => {
    if (prefGoal === 'Prepare for a hackathon' && c.level === 'Beginner') {
      return 'Great beginner sprint: builds baseline syntax and project setup required for rapid prototyping.';
    }
    if (c.provider === 'Google Cloud Skills Boost') {
      return 'Includes interactive hands-on cloud labs with zero cost and verified skill credentials.';
    }
    if (c.freeAuditAvailable && c.certificateIncluded && c.price === 0) {
      return '100% free learning and completion credentials—optimal for student budgets.';
    }
    return `Covers core competencies in ${c.skillsCovered.slice(0, 2).join(', ')} directly applicable to practical engineering.`;
  };

  const handleToggleCompare = (courseId: string) => {
    if (compareList.includes(courseId)) {
      setCompareList(compareList.filter((id) => id !== courseId));
    } else {
      if (compareList.length >= 3) {
        alert('You can compare a maximum of 3 courses side-by-side.');
        return;
      }
      setCompareList([...compareList, courseId]);
    }
  };

  const handleGeneratePersonalizedRoadmap = (e: React.FormEvent) => {
    e.preventDefault();
    const targetSkill = prefSkill.trim() || 'Modern Full-Stack & AI Prototyping';
    const matchingCourses = courses.filter((c) =>
      c.skillsCovered.some((s) => s.toLowerCase().includes(targetSkill.toLowerCase())) ||
      (prefLevel === c.level)
    ).slice(0, 2);

    const relevantHacks = hackathons.slice(0, 2).map((h) => h.id);

    const roadmap: LearningRoadmap = {
      id: `rdmp-${Date.now()}`,
      title: `${targetSkill}: From Foundation to Hackathon Victory`,
      goal: prefGoal,
      domain: matchingCourses[0]?.domain || 'Web & Mobile Development',
      createdAt: new Date().toISOString(),
      prerequisiteKnowledge: [
        'Command line terminal navigation',
        'Basic algorithm flow and variables',
        'Git version control basics'
      ],
      recommendedCourseIds: matchingCourses.map((c) => c.id),
      skillsToPractice: [
        {
          skill: `${targetSkill} core patterns`,
          exercise: `Build a modular 2-tier application implementing ${targetSkill}`,
          completed: false
        },
        {
          skill: 'API Integration & State Management',
          exercise: 'Connect real-time API responses and render responsive error boundaries',
          completed: false
        }
      ],
      practicalProject: {
        title: `${targetSkill} Capstone Portfolio MVP`,
        description: `Build an authentic, deployed project solving a community or student problem using ${targetSkill}.`,
        deliverable: 'Live web deployment URL + documented GitHub repository with README',
        completed: false
      },
      demonstrationMethod: 'Publish live on GitHub Pages/Vercel and present during your next hackathon competition',
      relevantHackathonIds: relevantHacks,
      steps: [
        {
          id: 'step-1',
          title: `Audit Core Course: ${matchingCourses[0]?.title || 'Fundamentals'}`,
          description: `Dedicate ${prefHoursPerWeek} hours/week to complete initial modules and lab exercises.`,
          category: 'Course',
          referenceId: matchingCourses[0]?.id,
          completed: false
        },
        {
          id: 'step-2',
          title: 'Hands-on Coding Practice',
          description: 'Recreate an existing workflow without relying on starter templates.',
          category: 'Skill Practice',
          completed: false
        },
        {
          id: 'step-3',
          title: 'Build Portfolio Capstone Project',
          description: 'Implement your project with tests, accessibility standards, and clean UI.',
          category: 'Project',
          completed: false
        },
        {
          id: 'step-4',
          title: 'Participate in Matching Hackathon',
          description: 'Leverage your newly acquired skills to compete with confidence.',
          category: 'Opportunity',
          referenceId: relevantHacks[0],
          completed: false
        }
      ]
    };

    saveRoadmap(roadmap);
    setGeneratedRoadmap(roadmap);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider">
              Module Two: Learning Engine
            </span>
            <span className="text-xs text-slate-500 font-medium">Cross-Platform Discovery</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1.5">
            Smart Course Finder & Learning Roadmaps
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Discover legitimate, transparent learning resources across Coursera, edX, freeCodeCamp, and official documentation. Free audit options and certificate costs clearly distinguished.
          </p>
        </div>

        <button
          onClick={() => setShowPreferenceForm(!showPreferenceForm)}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-100 flex items-center space-x-2 transition-all self-start md:self-auto"
        >
          <Sparkles className="w-4 h-4" />
          <span>{showPreferenceForm ? 'Hide Preference Form' : 'Tailor My Learning Roadmap'}</span>
        </button>
      </div>

      {/* STUDENT PREFERENCE FORM (ACCORDION / MODAL) */}
      {showPreferenceForm && (
        <div className="bg-gradient-to-r from-indigo-50/80 via-white to-slate-50 p-6 sm:p-8 rounded-3xl border-2 border-indigo-200 shadow-sm space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <h3 className="text-lg font-black text-slate-900">Your Learning Preferences</h3>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Tell us your target skills, weekly availability, and budget to generate a realistic 6-step learning roadmap.
              </p>
            </div>
            <button
              onClick={() => setShowPreferenceForm(false)}
              className="text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleGeneratePersonalizedRoadmap} className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Target Skill / Subject</label>
              <input
                type="text"
                placeholder="e.g. Gemini API, React, Network Security"
                value={prefSkill}
                onChange={(e) => setPrefSkill(e.target.value)}
                className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Current Skill Level</label>
              <select
                value={prefLevel}
                onChange={(e) => setPrefLevel(e.target.value as DifficultyLevel)}
                className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-hidden"
              >
                <option value="Beginner">Beginner (No prior background)</option>
                <option value="Intermediate">Intermediate (Know syntax, need projects)</option>
                <option value="Advanced">Advanced (Production scale & depth)</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Learning Goal</label>
              <select
                value={prefGoal}
                onChange={(e) => setPrefGoal(e.target.value)}
                className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-hidden"
              >
                <option value="Prepare for a hackathon">Prepare for a hackathon</option>
                <option value="Learn a skill from scratch">Learn a skill from scratch</option>
                <option value="Build a portfolio project">Build a portfolio project</option>
                <option value="Prepare for an internship">Prepare for an internship</option>
                <option value="Earn a verified certificate">Earn a verified certificate</option>
                <option value="Improve an existing skill">Improve an existing skill</option>
                <option value="Explore a new technical field">Explore a new technical field</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Weekly Time Commitment: <span className="text-indigo-600">{prefHoursPerWeek} hrs/week</span>
              </label>
              <input
                type="range"
                min="2"
                max="30"
                value={prefHoursPerWeek}
                onChange={(e) => setPrefHoursPerWeek(parseInt(e.target.value, 10))}
                className="w-full accent-indigo-600 mt-2"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Max Budget: <span className="text-indigo-600">${prefBudget} USD</span>
              </label>
              <input
                type="range"
                min="0"
                max="200"
                step="10"
                value={prefBudget}
                onChange={(e) => setPrefBudget(parseInt(e.target.value, 10))}
                className="w-full accent-indigo-600 mt-2"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Format & Credential</label>
              <div className="flex items-center space-x-4 pt-2">
                <label className="flex items-center space-x-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={prefNeedCert}
                    onChange={(e) => setPrefNeedCert(e.target.checked)}
                    className="rounded text-indigo-600"
                  />
                  <span className="font-semibold text-slate-700">Must include certificate</span>
                </label>
              </div>
            </div>

            <div className="md:col-span-3 pt-2 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowPreferenceForm(false)}
                className="px-4 py-2 border border-slate-300 rounded-xl text-slate-600 font-bold hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-md shadow-indigo-100 flex items-center space-x-1.5"
              >
                <Sparkles className="w-4 h-4" />
                <span>Generate Ordered Learning Roadmap</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ROADMAP GENERATION SUCCESS BANNER */}
      {generatedRoadmap && (
        <div className="p-6 rounded-3xl bg-emerald-50 border-2 border-emerald-200 text-xs space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              <h3 className="font-black text-slate-900 text-base">
                Your Roadmap Has Been Generated and Saved to Dashboard!
              </h3>
            </div>
            <button onClick={() => setGeneratedRoadmap(null)} className="text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-slate-700">
            <strong>Roadmap:</strong> {generatedRoadmap.title} • Designed for {prefHoursPerWeek} hrs/week over a realistic timeline.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 pt-1">
            {generatedRoadmap.steps.map((st, idx) => (
              <div key={st.id} className="p-3 rounded-xl bg-white border border-emerald-200 shadow-2xs">
                <span className="text-[10px] font-bold uppercase text-emerald-700 block">Step {idx + 1}</span>
                <span className="font-bold text-slate-900 block mt-0.5">{st.title}</span>
                <span className="text-[11px] text-slate-500 mt-1 block">{st.description}</span>
              </div>
            ))}
          </div>

          <div className="pt-2 flex items-center justify-end space-x-3">
            <button
              onClick={() => setCurrentPage('dashboard')}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold"
            >
              Track in My Dashboard
            </button>
          </div>
        </div>
      )}

      {/* FILTER BAR */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          
          <div className="relative md:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search courses by skill, provider, or title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-hidden"
            />
          </div>

          <div>
            <select
              value={selectedProvider}
              onChange={(e) => setSelectedProvider(e.target.value)}
              className="w-full py-2 px-3 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:outline-hidden"
            >
              <option value="all">All Providers</option>
              <option value="Coursera">Coursera</option>
              <option value="edX">edX</option>
              <option value="Google Cloud Skills Boost">Google Cloud Skills Boost</option>
              <option value="freeCodeCamp">freeCodeCamp</option>
              <option value="Cisco Networking Academy">Cisco Networking Academy</option>
              <option value="Microsoft Learn">Microsoft Learn</option>
              <option value="Official Documentation">Official Documentation</option>
            </select>
          </div>

          <div>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="w-full py-2 px-3 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:outline-hidden"
            >
              <option value="all">All Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
        </div>

        {/* Quick Toggles */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100 text-xs">
          <label className="flex items-center space-x-1.5 cursor-pointer px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors select-none">
            <input
              type="checkbox"
              checked={onlyFreeAudit}
              onChange={(e) => setOnlyFreeAudit(e.target.checked)}
              className="rounded text-indigo-600"
            />
            <span className="font-semibold text-slate-700">Free Audit Available</span>
          </label>

          <label className="flex items-center space-x-1.5 cursor-pointer px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors select-none">
            <input
              type="checkbox"
              checked={onlyFreeCert}
              onChange={(e) => setOnlyFreeCert(e.target.checked)}
              className="rounded text-indigo-600"
            />
            <span className="font-semibold text-slate-700">Free Verified Certificate</span>
          </label>

          {compareList.length > 0 && (
            <button
              onClick={() => setShowCompareModal(true)}
              className="ml-auto px-3.5 py-1.5 bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold rounded-lg flex items-center space-x-1.5 shadow-xs"
            >
              <Scale className="w-3.5 h-3.5" />
              <span>Compare Selected ({compareList.length}/3)</span>
            </button>
          )}
        </div>
      </div>

      {/* DISCLOSURE REGARDING AUDIT VS CERTIFICATE PRICING */}
      <div className="p-3.5 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-600 flex items-start space-x-2">
        <AlertCircle className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="text-slate-800">Clear Pricing Policy:</strong> Many providers (e.g. Coursera, edX) allow 100% free auditing of all video lectures, reading materials, and problem sets, while requiring payment only if you want an accredited digital certificate. We never falsely label a course as "free" without noting the certificate conditions.
        </div>
      </div>

      {/* COURSE CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((c) => {
          const isTracked = trackedCourses.some((tc) => tc.courseId === c.id);
          const isCompared = compareList.includes(c.id);

          return (
            <div
              key={c.id}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group hover:border-indigo-300"
            >
              <div className="p-6 space-y-4">
                
                {/* Header: Provider & Level */}
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-indigo-50 text-indigo-700">
                    {c.provider}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    {c.level}
                  </span>
                </div>

                {/* Title */}
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base group-hover:text-indigo-600 transition-colors line-clamp-2">
                    {c.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                    {c.description}
                  </p>
                </div>

                {/* Why this was recommended card */}
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 text-[11px] text-slate-600 space-y-1">
                  <span className="font-bold text-slate-700 flex items-center space-x-1">
                    <Sparkles className="w-3 h-3 text-indigo-500" />
                    <span>Why recommended:</span>
                  </span>
                  <p className="leading-snug">{getRecommendationReason(c)}</p>
                </div>

                {/* Skills tags */}
                <div className="flex flex-wrap gap-1">
                  {c.skillsCovered.map((sk) => (
                    <span key={sk} className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px] font-medium">
                      {sk}
                    </span>
                  ))}
                </div>

                {/* Pricing Breakdown Card */}
                <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/60 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Learning Access:</span>
                    <span className="font-bold text-emerald-700">
                      {c.freeAuditAvailable ? 'Free Audit Available' : `${c.currency} ${c.price}`}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">Certificate Credential:</span>
                    <span className="font-medium text-slate-700">
                      {c.certificateIncluded && (!c.certificatePrice || c.certificatePrice === 0)
                        ? 'Included Free'
                        : c.certificatePrice
                        ? `${c.currency} ${c.certificatePrice}`
                        : 'Optional paid'}
                    </span>
                  </div>
                </div>

                {/* Meta commitment */}
                <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                  <span>{c.duration}</span>
                  <span>•</span>
                  <span>{c.weeklyCommitment}</span>
                  <span>•</span>
                  <span>⭐ {c.rating}/5.0</span>
                </div>

              </div>

              {/* Card Footer Actions */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => handleToggleCompare(c.id)}
                  className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg border transition-all ${
                    isCompared
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {isCompared ? 'Compared' : '+ Compare'}
                </button>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      if (isTracked) {
                        setCourseProgress(c.id, 'Completed', 100);
                      } else {
                        setCourseProgress(c.id, 'In Progress', 10);
                      }
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      isTracked
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                    }`}
                  >
                    {isTracked ? 'Tracking ✓' : 'Save to Learning List'}
                  </button>

                  <a
                    href={c.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
                    title="Open Official Provider Page"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* COURSE COMPARISON MODAL */}
      {showCompareModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div className="flex items-center space-x-2">
                <Scale className="w-5 h-5 text-indigo-600" />
                <h3 className="text-lg font-black text-slate-900">Side-by-Side Course Comparison</h3>
              </div>
              <button onClick={() => setShowCompareModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              {compareList.map((id) => {
                const course = courses.find((c) => c.id === id);
                if (!course) return null;

                return (
                  <div key={id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="font-bold text-indigo-700 uppercase text-[10px]">{course.provider}</div>
                    <h4 className="font-extrabold text-sm text-slate-900 leading-snug">{course.title}</h4>
                    <div className="space-y-1.5 pt-2 border-t border-slate-200 text-slate-600">
                      <div><strong>Level:</strong> {course.level}</div>
                      <div><strong>Duration:</strong> {course.duration}</div>
                      <div><strong>Weekly:</strong> {course.weeklyCommitment}</div>
                      <div><strong>Audit Free:</strong> {course.freeAuditAvailable ? 'Yes' : 'No'}</div>
                      <div><strong>Certificate:</strong> {course.certificatePrice ? `$${course.certificatePrice}` : 'Free'}</div>
                      <div><strong>Format:</strong> {course.learningFormat}</div>
                    </div>
                    <div className="pt-2">
                      <a
                        href={course.officialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2 bg-slate-900 text-white rounded-lg font-bold flex items-center justify-center space-x-1"
                      >
                        <span>Official Syllabus</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-4 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => {
                  setCompareList([]);
                  setShowCompareModal(false);
                }}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl font-bold text-xs hover:bg-slate-50"
              >
                Clear Comparison
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
