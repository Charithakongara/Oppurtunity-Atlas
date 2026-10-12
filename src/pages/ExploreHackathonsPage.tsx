import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Trophy,
  Calendar,
  Clock,
  MapPin,
  Users,
  DollarSign,
  Tag,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  BookOpen,
  ArrowRight,
  Sparkles,
  Bookmark,
  CheckSquare,
  Square,
  List,
  Grid,
  CalendarDays,
  X,
  SlidersHorizontal,
  ChevronDown,
  Info
} from 'lucide-react';
import { useApp } from '../context/AppContext.tsx';
import {
  Hackathon,
  TechDomain,
  DifficultyLevel,
  EffortLevel,
  EventFormat,
  ApplicationStatus
} from '../types/index.ts';

export const ExploreHackathonsPage: React.FC = () => {
  const {
    hackathons,
    user,
    applications,
    setApplicationStatus,
    selectedHackathonId,
    setSelectedHackathonId,
    searchQuery,
    setSearchQuery,
    setCurrentPage,
    saveRoadmap,
    recordInteraction
  } = useApp();

  const handleInspectHackathon = (id: string) => {
    recordInteraction('inspect_hackathon');
    setSelectedHackathonId(id);
  };

  // Filter States
  const [selectedDomain, setSelectedDomain] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedEffort, setSelectedEffort] = useState<string>('all');
  const [selectedFormat, setSelectedFormat] = useState<string>('all');
  const [onlyFree, setOnlyFree] = useState<boolean>(false);
  const [onlyBeginnerFriendly, setOnlyBeginnerFriendly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>('deadline');
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'calendar'>('grid');
  const [prepPlanGenerated, setPrepPlanGenerated] = useState<boolean>(false);

  // Active modal hackathon
  const activeHackathon = useMemo(() => {
    return hackathons.find((h) => h.id === selectedHackathonId) || null;
  }, [hackathons, selectedHackathonId]);

  // Filtering Logic
  const filteredHackathons = useMemo(() => {
    return hackathons.filter((h) => {
      // Keyword search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = h.title.toLowerCase().includes(query);
        const matchesOrganizer = h.organizer.toLowerCase().includes(query);
        const matchesDomain = h.domain.toLowerCase().includes(query);
        const matchesSkill = h.requiredSkills.some((s) => s.toLowerCase().includes(query));
        const matchesTagline = h.tagline.toLowerCase().includes(query);
        if (!matchesTitle && !matchesOrganizer && !matchesDomain && !matchesSkill && !matchesTagline) {
          return false;
        }
      }

      // Domain
      if (selectedDomain !== 'all' && h.domain !== selectedDomain) return false;

      // Difficulty
      if (selectedDifficulty !== 'all' && h.difficulty !== selectedDifficulty) return false;

      // Effort
      if (selectedEffort !== 'all' && h.effort !== selectedEffort) return false;

      // Format
      if (selectedFormat !== 'all' && h.format !== selectedFormat) return false;

      // Free only
      if (onlyFree && !h.isFree) return false;

      // Beginner friendly
      if (onlyBeginnerFriendly && h.difficulty !== 'Beginner') return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'deadline') {
        return new Date(a.registrationDeadline).getTime() - new Date(b.registrationDeadline).getTime();
      }
      if (sortBy === 'startDate') {
        return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
      }
      if (sortBy === 'fee') {
        return a.registrationFee - b.registrationFee;
      }
      if (sortBy === 'difficulty') {
        const rank = { Beginner: 1, Intermediate: 2, Advanced: 3 };
        return rank[a.difficulty] - rank[b.difficulty];
      }
      if (sortBy === 'verified') {
        return new Date(b.lastVerified).getTime() - new Date(a.lastVerified).getTime();
      }
      return 0;
    });
  }, [
    hackathons,
    searchQuery,
    selectedDomain,
    selectedDifficulty,
    selectedEffort,
    selectedFormat,
    onlyFree,
    onlyBeginnerFriendly,
    sortBy
  ]);

  // Readiness Calculation for a given hackathon
  const calculateReadiness = (h: Hackathon) => {
    if (!user) return { score: 50, matched: [], gaps: h.requiredSkills };
    const userSkills = user.declaredSkills.map((s) => s.name.toLowerCase());
    const matched = h.requiredSkills.filter((req) =>
      userSkills.some((us) => us.includes(req.toLowerCase()) || req.toLowerCase().includes(us))
    );
    const gaps = h.requiredSkills.filter((req) => !matched.includes(req));
    const score = h.requiredSkills.length > 0 ? Math.round((matched.length / h.requiredSkills.length) * 100) : 75;
    return { score, matched, gaps };
  };

  const getDifficultyBadge = (level: DifficultyLevel) => {
    switch (level) {
      case 'Beginner':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Intermediate':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Advanced':
        return 'bg-purple-50 text-purple-700 border-purple-200';
    }
  };

  const getEffortBadge = (effort: EffortLevel) => {
    switch (effort) {
      case 'Low Effort':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'Medium Effort':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'High Effort':
        return 'bg-rose-50 text-rose-700 border-rose-200';
    }
  };

  const handleGeneratePrepPlan = (h: Hackathon) => {
    const { matched, gaps } = calculateReadiness(h);
    saveRoadmap({
      title: `Preparation Plan: ${h.title}`,
      goal: `Become 100% prepared to compete in ${h.title}`,
      domain: h.domain,
      prerequisiteKnowledge: h.prerequisites,
      recommendedCourseIds: ['course-03', 'course-04'],
      skillsToPractice: gaps.map((gap) => ({
        skill: gap,
        exercise: `Build a 1-day proof of concept exercising ${gap} with sample inputs.`,
        completed: false
      })),
      practicalProject: {
        title: `${h.title} Pre-hackathon Prototype`,
        description: `Create an end-to-end working skeleton matching ${h.tagline}`,
        deliverable: 'GitHub repository with deployed prototype and test run',
        completed: false
      },
      demonstrationMethod: 'Present to team members and test under a 4-hour mock sprint',
      relevantHackathonIds: [h.id],
      steps: [
        {
          id: `step-1`,
          title: `Master Remaining Prerequisites (${gaps.slice(0, 2).join(', ') || 'Core Stack'})`,
          description: 'Audit recommended free course modules to bridge skill gaps.',
          category: 'Course',
          completed: false
        },
        {
          id: `step-2`,
          title: 'Scaffold Shared Team Repository & Starter Boilerplate',
          description: 'Configure git branching, linter, environment variables, and automated builds.',
          category: 'Skill Practice',
          completed: false
        },
        {
          id: `step-3`,
          title: 'Conduct Mock 3-Minute Presentation Run',
          description: 'Practice the hook, problem statement, architecture demo, and impact metrics.',
          category: 'Project',
          completed: false
        }
      ]
    });
    setPrepPlanGenerated(true);
    setApplicationStatus(h.id, 'Preparing');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header & Tagline */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold uppercase tracking-wider">
              Directory & Opportunities
            </span>
            <span className="text-xs text-slate-500 font-medium">Updated Weekly</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1.5">
            Explore Hackathons & Technical Competitions
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Centralized directory with verified deadlines, eligibility guidelines, effort metrics, and personalized skill-readiness diagnostics.
          </p>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center space-x-2 bg-slate-100 p-1 rounded-xl self-start md:self-auto border border-slate-200">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all ${
              viewMode === 'grid' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Grid className="w-4 h-4" />
            <span className="hidden sm:inline">Grid</span>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all ${
              viewMode === 'list' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <List className="w-4 h-4" />
            <span className="hidden sm:inline">Table</span>
          </button>
          <button
            onClick={() => setViewMode('calendar')}
            className={`p-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all ${
              viewMode === 'calendar' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CalendarDays className="w-4 h-4" />
            <span className="hidden sm:inline">Deadlines</span>
          </button>
        </div>
      </div>

      {/* FILTER BAR & SEARCH */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          
          {/* Search Input */}
          <div className="relative md:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search hackathons by title, organizer, or skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          {/* Domain Dropdown */}
          <div>
            <select
              value={selectedDomain}
              onChange={(e) => setSelectedDomain(e.target.value)}
              className="w-full py-2 px-3 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:outline-hidden"
            >
              <option value="all">All Technology Domains</option>
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

          {/* Sort By Dropdown */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full py-2 px-3 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:outline-hidden"
            >
              <option value="deadline">Sort: Upcoming Deadline</option>
              <option value="startDate">Sort: Event Start Date</option>
              <option value="fee">Sort: Lowest Registration Fee</option>
              <option value="difficulty">Sort: Difficulty Level</option>
              <option value="verified">Sort: Recently Verified</option>
            </select>
          </div>
        </div>

        {/* Secondary Filter Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
          <span className="text-slate-400 font-semibold flex items-center space-x-1">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters:</span>
          </span>

          {/* Difficulty */}
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="py-1 px-2.5 bg-slate-100 hover:bg-slate-200/80 rounded-lg border border-slate-200 text-slate-700 font-medium"
          >
            <option value="all">Any Difficulty</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>

          {/* Effort */}
          <select
            value={selectedEffort}
            onChange={(e) => setSelectedEffort(e.target.value)}
            className="py-1 px-2.5 bg-slate-100 hover:bg-slate-200/80 rounded-lg border border-slate-200 text-slate-700 font-medium"
          >
            <option value="all">Any Effort</option>
            <option value="Low Effort">Low Effort</option>
            <option value="Medium Effort">Medium Effort</option>
            <option value="High Effort">High Effort</option>
          </select>

          {/* Format */}
          <select
            value={selectedFormat}
            onChange={(e) => setSelectedFormat(e.target.value)}
            className="py-1 px-2.5 bg-slate-100 hover:bg-slate-200/80 rounded-lg border border-slate-200 text-slate-700 font-medium"
          >
            <option value="all">Any Format</option>
            <option value="Online">Online</option>
            <option value="Offline">Offline</option>
            <option value="Hybrid">Hybrid</option>
          </select>

          {/* Checkboxes */}
          <label className="flex items-center space-x-1.5 cursor-pointer px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors select-none">
            <input
              type="checkbox"
              checked={onlyFree}
              onChange={(e) => setOnlyFree(e.target.checked)}
              className="rounded text-indigo-600 focus:ring-0"
            />
            <span className="font-semibold text-slate-700">Free Registration Only</span>
          </label>

          <label className="flex items-center space-x-1.5 cursor-pointer px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors select-none">
            <input
              type="checkbox"
              checked={onlyBeginnerFriendly}
              onChange={(e) => setOnlyBeginnerFriendly(e.target.checked)}
              className="rounded text-indigo-600 focus:ring-0"
            />
            <span className="font-semibold text-slate-700">Beginner Friendly Only</span>
          </label>

          {(selectedDomain !== 'all' || selectedDifficulty !== 'all' || selectedEffort !== 'all' || selectedFormat !== 'all' || onlyFree || onlyBeginnerFriendly || searchQuery) && (
            <button
              onClick={() => {
                setSelectedDomain('all');
                setSelectedDifficulty('all');
                setSelectedEffort('all');
                setSelectedFormat('all');
                setOnlyFree(false);
                setOnlyBeginnerFriendly(false);
                setSearchQuery('');
              }}
              className="text-rose-600 hover:text-rose-800 font-bold ml-auto"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* DIFFICULTY VS EFFORT EXPLANATORY CALLOUT */}
      <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200/70 text-xs text-blue-900 flex items-start space-x-2.5">
        <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <span className="font-bold">Understanding Ratings:</span> We explicitly separate <strong>Difficulty</strong> (technical depth, complexity of concepts, problem difficulty) from <strong>Effort</strong> (preparation workload, time commitment, sprint duration). A problem can be technically simple but high effort due to extensive hardware testing or 36-hour physical hackathon demands.
        </div>
      </div>

      {/* RESULTS COUNT & LISTINGS */}
      {filteredHackathons.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
          <AlertCircle className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No opportunities match your filter criteria</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search query, difficulty filters, or selecting "All Domains" to see available listings.
          </p>
          <button
            onClick={() => {
              setSelectedDomain('all');
              setSelectedDifficulty('all');
              setSelectedEffort('all');
              setOnlyFree(false);
              setOnlyBeginnerFriendly(false);
              setSearchQuery('');
            }}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold"
          >
            Clear All Filters
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHackathons.map((h) => {
            const currentApp = applications.find((a) => a.hackathonId === h.id);
            const { score, matched, gaps } = calculateReadiness(h);

            return (
              <div
                key={h.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group hover:border-indigo-300"
              >
                <div className="p-6 space-y-4">
                  {/* Top Bar: Domain & Cost */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-slate-100 text-slate-700">
                      {h.domain}
                    </span>
                    <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold border ${
                      h.isFree ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-50 text-slate-800 border-slate-200'
                    }`}>
                      {h.isFree ? 'Free Registration' : `${h.currency} ${h.registrationFee}`}
                    </span>
                  </div>

                  {/* Title & Organizer */}
                  <div>
                    <h3
                      onClick={() => handleInspectHackathon(h.id)}
                      className="font-extrabold text-slate-900 text-lg group-hover:text-indigo-600 transition-colors line-clamp-1 cursor-pointer"
                    >
                      {h.title}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">By {h.organizer}</p>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {h.tagline || h.description}
                  </p>

                  {/* Difficulty & Effort Ratings */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 rounded-lg bg-slate-50 border border-slate-200/60">
                      <div className="text-[10px] text-slate-400 font-semibold uppercase">Difficulty</div>
                      <div className="font-bold text-slate-800 text-xs mt-0.5 flex items-center justify-between">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] border ${getDifficultyBadge(h.difficulty)}`}>
                          {h.difficulty}
                        </span>
                        <span className="text-[9px] text-slate-400 truncate max-w-[60px]" title={h.difficultySource}>
                          {h.difficultySource.includes('Organizer') ? 'Organizer' : 'Atlas Est.'}
                        </span>
                      </div>
                    </div>

                    <div className="p-2 rounded-lg bg-slate-50 border border-slate-200/60">
                      <div className="text-[10px] text-slate-400 font-semibold uppercase">Effort</div>
                      <div className="font-bold text-slate-800 text-xs mt-0.5 flex items-center justify-between">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] border ${getEffortBadge(h.effort)}`}>
                          {h.effort}
                        </span>
                        <span className="text-[9px] text-slate-400 truncate max-w-[60px]" title={h.effortSource}>
                          {h.effortSource.includes('Organizer') ? 'Organizer' : 'Atlas Est.'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Readiness Progress Bar */}
                  <div className="p-2.5 rounded-xl bg-indigo-50/60 border border-indigo-100 text-xs space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-slate-700">
                      <span>Your Match Readiness</span>
                      <span className={`font-bold ${score >= 70 ? 'text-emerald-600' : 'text-indigo-600'}`}>
                        {score}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-1.5 rounded-full ${score >= 70 ? 'bg-emerald-500' : 'bg-indigo-600'}`}
                        style={{ width: `${score}%` }}
                      ></div>
                    </div>
                    <div className="text-[10px] text-slate-500 flex justify-between pt-0.5">
                      <span>{matched.length} matched</span>
                      <span>{gaps.length} gaps to learn</span>
                    </div>
                  </div>

                  {/* Key metadata */}
                  <div className="space-y-1 text-xs text-slate-500 pt-1">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{h.format} • {h.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                      <span className="font-semibold text-rose-600">
                        Deadline: {new Date(h.registrationDeadline).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleInspectHackathon(h.id)}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800 underline"
                  >
                    Am I Ready?
                  </button>

                  <div className="flex items-center space-x-1.5">
                    {/* Status dropdown */}
                    <select
                      value={currentApp?.status || 'none'}
                      onChange={(e) => {
                        if (e.target.value === 'none') {
                          // keep as interested or noop
                        } else {
                          setApplicationStatus(h.id, e.target.value as ApplicationStatus);
                        }
                      }}
                      className="text-[11px] font-semibold py-1 px-2 rounded-lg bg-white border border-slate-300 text-slate-700"
                    >
                      <option value="none">Save Status</option>
                      <option value="Interested">Interested</option>
                      <option value="Preparing">Preparing</option>
                      <option value="Applied">Applied</option>
                      <option value="Participating">Participating</option>
                      <option value="Completed">Completed</option>
                    </select>

                    <button
                      onClick={() => handleInspectHackathon(h.id)}
                      className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold"
                    >
                      Details
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : viewMode === 'list' ? (
        /* TABLE / LIST VIEW */
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-4">Hackathon</th>
                  <th className="p-4">Domain</th>
                  <th className="p-4">Difficulty / Effort</th>
                  <th className="p-4">Format & Location</th>
                  <th className="p-4">Registration Deadline</th>
                  <th className="p-4">Fee</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredHackathons.map((h) => (
                  <tr key={h.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 font-bold text-slate-900 cursor-pointer" onClick={() => handleInspectHackathon(h.id)}>
                      <div className="hover:text-indigo-600 transition-colors">{h.title}</div>
                      <div className="text-[10px] text-slate-400 font-normal">{h.organizer}</div>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                        {h.domain}
                      </span>
                    </td>
                    <td className="p-4 space-y-1">
                      <div>
                        <span className={`px-1.5 py-0.5 rounded text-[10px] border ${getDifficultyBadge(h.difficulty)}`}>
                          {h.difficulty}
                        </span>
                      </div>
                      <div>
                        <span className={`px-1.5 py-0.5 rounded text-[10px] border ${getEffortBadge(h.effort)}`}>
                          {h.effort}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-slate-600">
                      <div>{h.format}</div>
                      <div className="text-[10px] text-slate-400">{h.location}</div>
                    </td>
                    <td className="p-4 font-semibold text-rose-600">
                      {new Date(h.registrationDeadline).toLocaleDateString()}
                    </td>
                    <td className="p-4 font-bold">
                      {h.isFree ? <span className="text-emerald-700">Free</span> : `${h.currency} ${h.registrationFee}`}
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => handleInspectHackathon(h.id)}
                        className="px-2.5 py-1 bg-slate-900 text-white rounded-md text-xs font-bold"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* CALENDAR / TIMELINE VIEW */
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-xs">
          <div>
            <h3 className="text-base font-bold text-slate-900">Upcoming Deadlines Timeline</h3>
            <p className="text-xs text-slate-500">Ordered chronological view of registration cutoff dates</p>
          </div>

          <div className="space-y-4">
            {filteredHackathons.map((h, i) => {
              const deadlineDate = new Date(h.registrationDeadline);
              const daysLeft = Math.ceil((deadlineDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

              return (
                <div
                  key={h.id}
                  className="flex items-start space-x-4 p-4 rounded-xl border border-slate-200 hover:border-indigo-300 transition-all bg-slate-50/50"
                >
                  <div className="w-16 text-center shrink-0 p-2 rounded-lg bg-white border border-slate-200">
                    <span className="block text-[10px] font-bold uppercase text-slate-400">
                      {deadlineDate.toLocaleString('default', { month: 'short' })}
                    </span>
                    <span className="block text-lg font-black text-slate-900">
                      {deadlineDate.getDate()}
                    </span>
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h4
                        onClick={() => handleInspectHackathon(h.id)}
                        className="font-bold text-slate-900 hover:text-indigo-600 cursor-pointer"
                      >
                        {h.title}
                      </h4>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        daysLeft <= 7 ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {daysLeft > 0 ? `${daysLeft} days remaining` : 'Closed'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600">{h.tagline}</p>
                    <div className="flex items-center space-x-4 text-xs text-slate-500 pt-1">
                      <span>Event starts: {new Date(h.startDate).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>Format: {h.format}</span>
                      <span>•</span>
                      <span>Duration: {h.eventDuration}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleInspectHackathon(h.id)}
                    className="self-center px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold"
                  >
                    View
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* OPPORTUNITY DETAIL MODAL & "AM I READY?" DIAGNOSTIC */}
      {activeHackathon && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200">
            
            {/* Header */}
            <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-slate-200 flex items-center justify-between z-10">
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-slate-100 text-slate-700">
                  {activeHackathon.domain}
                </span>
                <span className="text-xs text-slate-500">
                  Last verified: {activeHackathon.lastVerified}
                </span>
              </div>
              <button
                onClick={() => {
                  setSelectedHackathonId(null);
                  setPrepPlanGenerated(false);
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 sm:p-8 space-y-8">
              
              {/* Title & Organizer */}
              <div>
                <h2 className="text-2xl font-black text-slate-900">{activeHackathon.title}</h2>
                <p className="text-sm text-slate-500 font-medium mt-1">Organized by {activeHackathon.organizer}</p>
                <p className="text-sm text-slate-700 mt-3 leading-relaxed">{activeHackathon.description}</p>
              </div>

              {/* Key Quick Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-400 font-semibold block uppercase text-[10px]">Registration Fee</span>
                  <span className="font-extrabold text-slate-900 text-sm mt-0.5 block">
                    {activeHackathon.isFree ? 'Free' : `${activeHackathon.currency} ${activeHackathon.registrationFee}`}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-400 font-semibold block uppercase text-[10px]">Team Size</span>
                  <span className="font-extrabold text-slate-900 text-sm mt-0.5 block">
                    {activeHackathon.minTeamSize === activeHackathon.maxTeamSize
                      ? `${activeHackathon.minTeamSize} members`
                      : `${activeHackathon.minTeamSize} - ${activeHackathon.maxTeamSize} members`}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-400 font-semibold block uppercase text-[10px]">Deadline</span>
                  <span className="font-extrabold text-rose-600 text-sm mt-0.5 block">
                    {new Date(activeHackathon.registrationDeadline).toLocaleDateString()}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-400 font-semibold block uppercase text-[10px]">Format</span>
                  <span className="font-extrabold text-slate-900 text-sm mt-0.5 block">
                    {activeHackathon.format}
                  </span>
                </div>
              </div>

              {/* Ratings Rationale */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">Difficulty: {activeHackathon.difficulty}</span>
                    <span className="text-[10px] text-slate-500 font-medium">({activeHackathon.difficultySource})</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed">{activeHackathon.difficultyRationale}</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">Effort: {activeHackathon.effort}</span>
                    <span className="text-[10px] text-slate-500 font-medium">({activeHackathon.effortSource})</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed">{activeHackathon.effortRationale}</p>
                </div>
              </div>

              {/* Requirements & Eligibility */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">Eligibility & Rules</h3>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed">
                  {activeHackathon.eligibility}
                </div>
              </div>

              {/* Prizes & Benefits */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">Verified Prizes & Benefits</h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {activeHackathon.prizesAndBenefits.map((p, idx) => (
                    <li key={idx} className="flex items-center space-x-2 p-2.5 rounded-lg bg-emerald-50/70 text-emerald-800 border border-emerald-200/60 font-semibold">
                      <Trophy className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* "AM I READY FOR THIS HACKATHON?" DIAGNOSTIC SECTION */}
              <div className="p-6 rounded-2xl bg-gradient-to-b from-indigo-50/80 to-slate-50 border-2 border-indigo-200 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <Sparkles className="w-4 h-4 text-indigo-600" />
                      <h3 className="text-lg font-black text-slate-900">Am I Ready for This Hackathon?</h3>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Baseline technical match comparing your declared profile skills with stated requirements.
                    </p>
                  </div>

                  {/* Readiness Score Tag */}
                  {(() => {
                    const { score } = calculateReadiness(activeHackathon);
                    return (
                      <div className="p-2.5 rounded-xl bg-white border border-indigo-200 text-center shrink-0">
                        <div className="text-[10px] font-bold text-slate-500 uppercase">Match Score</div>
                        <div className={`text-2xl font-black ${score >= 70 ? 'text-emerald-600' : 'text-indigo-600'}`}>
                          {score}%
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* Score explanation disclosure */}
                <div className="text-[11px] text-slate-500 bg-white/70 p-2.5 rounded-lg border border-indigo-100 leading-relaxed">
                  <strong>Calculation basis:</strong> This readiness score represents technical skill coverage ({calculateReadiness(activeHackathon).matched.length}/{activeHackathon.requiredSkills.length} declared skills). It measures technical eligibility and is not a guarantee of selection or winning probability.
                </div>

                {/* Matched vs Gaps */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Matched */}
                  <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                    <span className="text-xs font-bold text-emerald-700 flex items-center space-x-1.5">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      <span>Skills Matched ({calculateReadiness(activeHackathon).matched.length})</span>
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {calculateReadiness(activeHackathon).matched.length === 0 ? (
                        <span className="text-xs text-slate-400 italic">No direct overlap with declared profile skills</span>
                      ) : (
                        calculateReadiness(activeHackathon).matched.map((m) => (
                          <span key={m} className="px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded-md text-xs font-semibold border border-emerald-200">
                            {m}
                          </span>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Gaps */}
                  <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                    <span className="text-xs font-bold text-amber-700 flex items-center space-x-1.5">
                      <AlertCircle className="w-4 h-4 text-amber-600" />
                      <span>Skills to Level Up ({calculateReadiness(activeHackathon).gaps.length})</span>
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {calculateReadiness(activeHackathon).gaps.length === 0 ? (
                        <span className="text-xs text-emerald-700 font-semibold">All technical requirements matched!</span>
                      ) : (
                        calculateReadiness(activeHackathon).gaps.map((g) => (
                          <span key={g} className="px-2 py-0.5 bg-amber-50 text-amber-800 rounded-md text-xs font-semibold border border-amber-200">
                            {g}
                          </span>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                {/* Recommended Next Actions & Roadmap Generation */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="text-xs text-slate-600">
                    Estimated Preparation Effort: <strong>{activeHackathon.prepTime}</strong> recommended.
                  </div>

                  {prepPlanGenerated ? (
                    <div className="px-4 py-2 bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold flex items-center space-x-1.5">
                      <CheckCircle className="w-4 h-4" />
                      <span>Preparation Plan Saved to Dashboard!</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleGeneratePrepPlan(activeHackathon)}
                      className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-100 flex items-center space-x-2 transition-all"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Generate Personalized Preparation Plan</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Bottom Buttons: Official Link & Status */}
              <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                <a
                  href={activeHackathon.officialRegistrationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center space-x-2 shadow-md transition-all"
                >
                  <span>Open Official Registration Page</span>
                  <ExternalLink className="w-4 h-4" />
                </a>

                <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
                  <button
                    onClick={() => {
                      setApplicationStatus(activeHackathon.id, 'Interested');
                      setSelectedHackathonId(null);
                    }}
                    className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50"
                  >
                    Mark as Interested
                  </button>
                  <button
                    onClick={() => {
                      setApplicationStatus(activeHackathon.id, 'Applied');
                      setSelectedHackathonId(null);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700"
                  >
                    Mark as Applied
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};
