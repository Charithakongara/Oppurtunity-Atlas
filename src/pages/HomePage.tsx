import React, { useState } from 'react';
import {
  Search,
  ArrowRight,
  Compass,
  Trophy,
  BookOpen,
  Sparkles,
  Flame,
  CheckCircle2,
  Calendar,
  Clock,
  Layers,
  Zap,
  Target,
  Users,
  Cpu,
  Shield,
  BarChart2,
  Globe,
  ChevronRight,
  Bookmark,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../context/AppContext.tsx';
import { TechDomain, DifficultyLevel, EffortLevel } from '../types/index.ts';

export const HomePage: React.FC = () => {
  const {
    setCurrentPage,
    searchQuery,
    setSearchQuery,
    hackathons,
    courses,
    setSelectedHackathonId,
    setApplicationStatus,
    applications,
    recordInteraction
  } = useApp();

  const handleInspectOpportunity = (id: string) => {
    recordInteraction('inspect_from_home');
    setSelectedHackathonId(id);
    setCurrentPage('hackathons');
  };

  const [heroSearch, setHeroSearch] = useState('');

  const handleHeroSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      recordInteraction('hero_search');
      setSearchQuery(heroSearch);
      setCurrentPage('hackathons');
    }
  };

  const featuredHackathons = hackathons.slice(0, 3);
  const featuredCourses = courses.slice(0, 3);

  const domainCategories: { domain: TechDomain; icon: React.ReactNode; count: number; color: string }[] = [
    {
      domain: 'AI & Machine Learning',
      icon: <Sparkles className="w-5 h-5" />,
      count: hackathons.filter(h => h.domain === 'AI & Machine Learning').length,
      color: 'from-violet-500 to-indigo-600'
    },
    {
      domain: 'Web & Mobile Development',
      icon: <Globe className="w-5 h-5" />,
      count: hackathons.filter(h => h.domain === 'Web & Mobile Development').length,
      color: 'from-blue-500 to-cyan-600'
    },
    {
      domain: 'Cybersecurity',
      icon: <Shield className="w-5 h-5" />,
      count: hackathons.filter(h => h.domain === 'Cybersecurity').length,
      color: 'from-emerald-500 to-teal-600'
    },
    {
      domain: 'IoT & Robotics',
      icon: <Cpu className="w-5 h-5" />,
      count: hackathons.filter(h => h.domain === 'IoT & Robotics').length,
      color: 'from-amber-500 to-orange-600'
    },
    {
      domain: 'Cloud & DevOps',
      icon: <Layers className="w-5 h-5" />,
      count: hackathons.filter(h => h.domain === 'Cloud & DevOps').length,
      color: 'from-sky-500 to-blue-600'
    },
    {
      domain: 'Data Science & Analytics',
      icon: <BarChart2 className="w-5 h-5" />,
      count: hackathons.filter(h => h.domain === 'Data Science & Analytics').length,
      color: 'from-fuchsia-500 to-pink-600'
    }
  ];

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

  return (
    <div className="space-y-20 pb-16">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-50/70 via-white to-slate-50 pt-16 pb-20 border-b border-slate-200/60">
        {/* Subtle decorative background circles */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none overflow-hidden">
          <div className="absolute -top-32 -left-20 w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl"></div>
          <div className="absolute top-20 right-0 w-80 h-80 bg-violet-200/30 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-indigo-100/80 border border-indigo-200 text-indigo-800 text-xs font-semibold tracking-wide shadow-xs">
            <span className="w-2 h-2 rounded-full bg-indigo-600 animate-ping"></span>
            <span>All-In-One Student Opportunity & Skill Development Engine</span>
          </div>

          {/* Heading & Subheading */}
          <div className="max-w-4xl mx-auto space-y-4">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
              Your Next Opportunity <br />
              <span className="bg-gradient-to-r from-indigo-600 via-blue-600 to-violet-600 bg-clip-text text-transparent">
                Starts Here.
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Find hackathons, discover the right courses, build real-world skills, and turn every experience into your next breakthrough.
            </p>
          </div>

          {/* Prominent Search Bar */}
          <div className="max-w-2xl mx-auto">
            <form onSubmit={handleHeroSearchSubmit} className="relative shadow-lg rounded-2xl bg-white p-2 border border-slate-200/90 flex items-center gap-2">
              <Search className="w-5 h-5 text-slate-400 ml-3 shrink-0" />
              <input
                type="text"
                placeholder="Search by hackathon, skill (e.g. Python, React), or topic..."
                value={heroSearch}
                onChange={(e) => setHeroSearch(e.target.value)}
                className="w-full py-2.5 px-2 text-sm sm:text-base text-slate-900 placeholder-slate-400 focus:outline-hidden"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-md shadow-indigo-100 transition-all shrink-0 flex items-center space-x-1.5"
              >
                <span>Search</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
            <div className="flex items-center justify-center flex-wrap gap-2 text-xs text-slate-500 mt-3">
              <span className="font-semibold text-slate-600">Popular:</span>
              <button onClick={() => { setSearchQuery('AI'); setCurrentPage('hackathons'); }} className="hover:text-indigo-600 underline">Gemini & GenAI</button>
              <span>•</span>
              <button onClick={() => { setSearchQuery('Web'); setCurrentPage('hackathons'); }} className="hover:text-indigo-600 underline">Full-Stack Web</button>
              <span>•</span>
              <button onClick={() => { setSearchQuery('Cybersecurity'); setCurrentPage('hackathons'); }} className="hover:text-indigo-600 underline">CTF Challenges</button>
              <span>•</span>
              <button onClick={() => { setSearchQuery('Free'); setCurrentPage('hackathons'); }} className="hover:text-indigo-600 underline">Free Registrations</button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setCurrentPage('hackathons')}
              className="w-full sm:w-auto px-7 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold shadow-lg shadow-slate-900/10 flex items-center justify-center space-x-2 transition-all hover:-translate-y-0.5"
            >
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Explore Opportunities</span>
            </button>
            <button
              onClick={() => setCurrentPage('courses')}
              className="w-full sm:w-auto px-7 py-3 rounded-xl bg-white hover:bg-slate-50 text-indigo-700 border border-slate-300 text-sm font-bold shadow-xs flex items-center justify-center space-x-2 transition-all hover:-translate-y-0.5"
            >
              <BookOpen className="w-4 h-4 text-indigo-600" />
              <span>Build My Learning Path</span>
            </button>
          </div>

          {/* Quick Pillars Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10 text-left max-w-5xl mx-auto">
            {/* Card 1 */}
            <div
              onClick={() => setCurrentPage('hackathons')}
              className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-all cursor-pointer group hover:border-indigo-300"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Trophy className="w-5 h-5" />
              </div>
              <div className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">Module One</div>
              <h3 className="font-bold text-slate-900 text-base mb-1 group-hover:text-indigo-600 transition-colors">
                Opportunity Finder
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Filter verified hackathons by difficulty, effort, fee, and timeline. Check "Am I Ready?" with instant skill-gap diagnostics.
              </p>
            </div>

            {/* Card 2 */}
            <div
              onClick={() => setCurrentPage('courses')}
              className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-all cursor-pointer group hover:border-indigo-300"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <BookOpen className="w-5 h-5" />
              </div>
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-600 mb-1">Module Two</div>
              <h3 className="font-bold text-slate-900 text-base mb-1 group-hover:text-indigo-600 transition-colors">
                Smart Course Finder
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Cross-provider discovery (Coursera, edX, freeCodeCamp) with transparent free audit vs paid cert details and tailored roadmaps.
              </p>
            </div>

            {/* Card 3 */}
            <div
              onClick={() => setCurrentPage('coach')}
              className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-all cursor-pointer group hover:border-violet-300 relative overflow-hidden"
            >
              <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-violet-100 text-violet-700 text-[10px] font-bold uppercase tracking-wider">
                AI Powered
              </div>
              <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="text-xs font-bold uppercase tracking-wider text-violet-600 mb-1">Module Three</div>
              <h3 className="font-bold text-slate-900 text-base mb-1 group-hover:text-violet-600 transition-colors">
                AI Hackathon Coach
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Submit code, slides, and rubrics for an objective 10-dimension audit. Distinguishes judge feedback from AI hypotheses.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* THE 7-STEP CONTINUOUS JOURNEY EXPLAINER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Structured Progression</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            The Continuous Growth Journey
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Opportunity Atlas connects discovery, skill building, and post-competition reflection into one closed loop.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {[
            { step: '1', title: 'Discover', desc: 'Find verified hackathons matching your interests', icon: <Search className="w-4 h-4 text-blue-600" /> },
            { step: '2', title: 'Learn', desc: 'Acquire prerequisite skills with free courses', icon: <BookOpen className="w-4 h-4 text-indigo-600" /> },
            { step: '3', title: 'Build', desc: 'Craft mini-projects to validate practical mastery', icon: <Cpu className="w-4 h-4 text-cyan-600" /> },
            { step: '4', title: 'Participate', desc: 'Register and compete with high confidence', icon: <Trophy className="w-4 h-4 text-amber-600" /> },
            { step: '5', title: 'Analyze', desc: 'Review weak spots with the AI Hackathon Coach', icon: <Sparkles className="w-4 h-4 text-violet-600" /> },
            { step: '6', title: 'Improve', desc: 'Follow a tailored 3-week remediation plan', icon: <Target className="w-4 h-4 text-emerald-600" /> },
            { step: '7', title: 'Discover Again', desc: 'Advance to higher-tier prize competitions', icon: <Compass className="w-4 h-4 text-rose-600" /> }
          ].map((item, idx) => (
            <div key={item.step} className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between hover:border-indigo-300 transition-all">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center">
                    {item.step}
                  </span>
                  {item.icon}
                </div>
                <h4 className="font-bold text-sm text-slate-900">{item.title}</h4>
                <p className="text-[11px] text-slate-500 mt-1 leading-snug">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED HACKATHONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Upcoming Opportunities</span>
            <h2 className="text-2xl font-extrabold text-slate-900 mt-0.5">Featured Hackathons & Competitions</h2>
            <p className="text-xs text-slate-500 mt-0.5">Verified deadlines, difficulty metrics, and eligibility requirements.</p>
          </div>
          <button
            onClick={() => setCurrentPage('hackathons')}
            className="flex items-center space-x-1 text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            <span>View All ({hackathons.length})</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredHackathons.map((h) => {
            const isApplied = applications.some((a) => a.hackathonId === h.id);
            return (
              <div
                key={h.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
              >
                <div className="p-6 space-y-4">
                  {/* Top tags */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-700">
                      {h.domain}
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {h.isFree ? 'Free Registration' : `${h.currency} ${h.registrationFee}`}
                    </span>
                  </div>

                  {/* Title & Organizer */}
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-lg group-hover:text-indigo-600 transition-colors line-clamp-1">
                      {h.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5 font-medium">By {h.organizer}</p>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {h.tagline || h.description}
                  </p>

                  {/* Difficulty & Effort Comparison Badges */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
                    <div className="p-2 rounded-lg bg-slate-50 border border-slate-200/60">
                      <div className="text-[10px] text-slate-400 font-semibold uppercase">Difficulty</div>
                      <div className="font-bold text-slate-800 text-xs mt-0.5 flex items-center space-x-1">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] border ${getDifficultyBadge(h.difficulty)}`}>
                          {h.difficulty}
                        </span>
                      </div>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-50 border border-slate-200/60">
                      <div className="text-[10px] text-slate-400 font-semibold uppercase">Effort Req.</div>
                      <div className="font-bold text-slate-800 text-xs mt-0.5 flex items-center space-x-1">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] border ${getEffortBadge(h.effort)}`}>
                          {h.effort}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Meta items */}
                  <div className="space-y-1.5 text-xs text-slate-600 pt-1">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>Starts {new Date(h.startDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                      <span className="font-semibold text-rose-600">
                        Deadline: {new Date(h.registrationDeadline).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer action buttons */}
                <div className="p-4 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between gap-3">
                  <button
                    onClick={() => handleInspectOpportunity(h.id)}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800 underline"
                  >
                    Check Readiness
                  </button>
                  <button
                    onClick={() => handleInspectOpportunity(h.id)}
                    className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-all shadow-xs"
                  >
                    View Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* POPULAR TECH DOMAINS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Explore by Specialization</span>
          <h2 className="text-2xl font-extrabold text-slate-900 mt-1">Popular Technology Domains</h2>
          <p className="text-xs text-slate-500 mt-1">Whether you want to build intelligent agents, mobile apps, or secure networks.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {domainCategories.map((cat) => (
            <button
              key={cat.domain}
              onClick={() => {
                setSearchQuery(cat.domain);
                setCurrentPage('hackathons');
              }}
              className="p-4 rounded-xl bg-white border border-slate-200/90 hover:border-indigo-300 shadow-xs hover:shadow-md transition-all text-center group flex flex-col items-center"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${cat.color} text-white flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-xs`}>
                {cat.icon}
              </div>
              <h3 className="font-bold text-xs text-slate-900 leading-snug line-clamp-2 group-hover:text-indigo-600 transition-colors">
                {cat.domain}
              </h3>
              <span className="text-[10px] text-slate-500 mt-1 font-medium">
                {cat.count} Opportunities
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* RECOMMENDED COURSES PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Curated Learning</span>
            <h2 className="text-2xl font-extrabold text-slate-900 mt-0.5">Recommended Courses for Skill Mastery</h2>
            <p className="text-xs text-slate-500 mt-0.5">Cross-provider courses with transparent audit vs certificate options.</p>
          </div>
          <button
            onClick={() => setCurrentPage('courses')}
            className="flex items-center space-x-1 text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            <span>Explore All Courses ({courses.length})</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredCourses.map((c) => (
            <div
              key={c.id}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
            >
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-indigo-50 text-indigo-700">
                    {c.provider}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    {c.level}
                  </span>
                </div>

                <div>
                  <h3 className="font-extrabold text-slate-900 text-base line-clamp-2">
                    {c.title}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-2 mt-2 leading-relaxed">
                    {c.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1">
                  {c.skillsCovered.slice(0, 3).map((sk) => (
                    <span key={sk} className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px] font-medium">
                      {sk}
                    </span>
                  ))}
                  {c.skillsCovered.length > 3 && (
                    <span className="text-[10px] text-slate-400 self-center">
                      +{c.skillsCovered.length - 3} more
                    </span>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                  <span className="font-bold text-emerald-700">
                    {c.freeAuditAvailable ? 'Free Audit Available' : 'Paid'}
                  </span>
                  <span className="text-slate-500">{c.duration}</span>
                </div>
              </div>

              <div className="p-4 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between">
                <a
                  href={c.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1"
                >
                  <span>Official Syllabus</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <button
                  onClick={() => setCurrentPage('courses')}
                  className="px-3.5 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 rounded-lg text-xs font-bold transition-all shadow-xs"
                >
                  Compare & Add
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* AI COACH SHOWCASE BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-violet-950 text-white p-8 sm:p-12 shadow-xl border border-indigo-900/40">
          <div className="relative z-10 max-w-2xl space-y-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-violet-900/60 border border-violet-700/60 text-violet-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-violet-300" />
              <span>Module Three Differentiator</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
              "Every Hackathon Is a Chance to Improve."
            </h2>
            
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Reflect on your project, understand your gaps, and turn your experience into a practical improvement plan. 
              Our AI evaluates your code and writeup across 10 distinct dimensions—differentiating between verified judge comments and hypotheses.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={() => setCurrentPage('coach')}
                className="px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs sm:text-sm font-extrabold shadow-lg shadow-violet-900/50 flex items-center space-x-2 transition-all hover:-translate-y-0.5"
              >
                <Sparkles className="w-4 h-4" />
                <span>Launch AI Hackathon Coach</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentPage('dashboard')}
                className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs sm:text-sm font-bold backdrop-blur-md transition-all"
              >
                <span>View Previous Reviews</span>
              </button>
            </div>
          </div>

          {/* Decorative graphic preview */}
          <div className="hidden lg:block absolute right-8 top-1/2 -translate-y-1/2 w-96 p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-xs shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/15 text-violet-200">
              <span className="font-bold flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-violet-300" />
                <span>Sample Coach Analysis</span>
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">10 DIMENSIONS</span>
            </div>
            <div className="space-y-3 pt-3 text-slate-200">
              <div>
                <div className="flex justify-between font-semibold text-[11px] mb-1">
                  <span>Alignment with Problem Statement</span>
                  <span className="text-emerald-400">8/10</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-emerald-400 h-1.5 rounded-full" style={{ width: '80%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between font-semibold text-[11px] mb-1">
                  <span>Testing & Validation</span>
                  <span className="text-amber-400">4/10</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-amber-400 h-1.5 rounded-full" style={{ width: '40%' }}></div>
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-white/5 border border-white/10 text-[11px] leading-relaxed">
                <span className="text-rose-300 font-bold">Priority Weakness:</span> Missing quantitative user benchmarks during live pitch. Remediation: 3-week metric validation exercise.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="max-w-4xl mx-auto px-4 text-center space-y-5">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Ready to Chart Your Opportunity Roadmap?
        </h2>
        <p className="text-sm text-slate-600 max-w-xl mx-auto">
          Create or customize your profile with your declared skills and weekly availability to unlock tailored recommendations.
        </p>
        <div className="pt-2">
          <button
            onClick={() => setCurrentPage('dashboard')}
            className="px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5"
          >
            Go to My Student Dashboard
          </button>
        </div>
      </section>

    </div>
  );
};
