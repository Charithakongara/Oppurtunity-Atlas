import React from 'react';
import { Compass, Sparkles, CheckCircle2, ShieldCheck, Heart, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext.tsx';

export const Footer: React.FC = () => {
  const { setCurrentPage } = useApp();

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-20">
      {/* Journey Banner */}
      <div className="bg-indigo-950/70 border-b border-indigo-900/50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">The Continuous Journey</span>
              <h3 className="text-lg font-bold text-white mt-1">Discover → Learn → Build → Participate → Analyze → Improve</h3>
              <p className="text-xs text-slate-400 mt-1">
                Opportunity Atlas turns every competition and course into structured progression.
              </p>
            </div>
            <button
              onClick={() => setCurrentPage('coach')}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-900/50 shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Try AI Hackathon Coach</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Col */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white">
                <Compass className="w-4 h-4" />
              </div>
              <span className="font-black text-lg text-white">Opportunity Atlas</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Discover opportunities. Build skills. Become better. The unified launchpad for aspiring engineers, developers, and innovators.
            </p>
            <div className="pt-2 flex items-center space-x-2 text-xs text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              <span>Verified student opportunity listings</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Core Modules</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => setCurrentPage('hackathons')} className="hover:text-indigo-400 transition-colors">
                  Explore Hackathons Directory
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('courses')} className="hover:text-indigo-400 transition-colors">
                  Cross-Provider Course Finder
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('coach')} className="hover:text-indigo-400 transition-colors">
                  AI Hackathon Coach & Review
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('dashboard')} className="hover:text-indigo-400 transition-colors">
                  Personal Student Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('admin')} className="hover:text-indigo-400 transition-colors">
                  Admin Verification Portal
                </button>
              </li>
            </ul>
          </div>

          {/* Supported Domains */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Tech Domains</h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li>AI & Machine Learning (Gemini, LLMs)</li>
              <li>Web & Full-Stack Development</li>
              <li>Cybersecurity & Capture-the-Flag (CTF)</li>
              <li>Embedded Systems & IoT</li>
              <li>Cloud Native & DevOps (K8s, CI/CD)</li>
              <li>Data Science & Analytics</li>
            </ul>
          </div>

          {/* Platform Standards */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Integrity & Accuracy</h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              We never fabricate deadlines, prize pools, or official eligibility. Listings are cross-verified with official organizer documentation.
            </p>
            <div className="p-3 rounded-lg bg-slate-800/80 border border-slate-700/60 text-[11px] text-slate-300">
              <div className="flex items-center space-x-1.5 font-semibold text-white mb-1">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                <span>Opportunity Atlas Transparency</span>
              </div>
              Difficulty & effort ratings are calculated estimates distinct from organizer criteria.
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <div>
            © 2026 Opportunity Atlas. Built for college developers and aspiring innovators.
          </div>
          <div className="mt-2 sm:mt-0 flex items-center space-x-4">
            <span className="text-slate-500">Student First</span>
            <span>•</span>
            <span className="text-slate-500">Zero Artificial Slop</span>
            <span>•</span>
            <span className="text-slate-500">Evidence-Based AI</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
