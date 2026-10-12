import React, { useState } from 'react';
import {
  User,
  Mail,
  GraduationCap,
  Sparkles,
  CheckCircle,
  ArrowRight,
  BookOpen,
  Lock,
  X,
  Plus,
  Shield,
  Layers,
  Award
} from 'lucide-react';
import { useApp } from '../context/AppContext.tsx';
import { UserStatus, DifficultyLevel, TechDomain, DeclaredSkill } from '../types/index.ts';

interface AuthModalProps {
  isOpen: boolean;
  onClose?: () => void;
  isMandatory?: boolean;
}

const POPULAR_KNOWN_SKILLS = [
  'Python',
  'React',
  'JavaScript',
  'TypeScript',
  'C++',
  'Java',
  'HTML/CSS',
  'Node.js',
  'SQL',
  'Git & GitHub',
  'Data Structures & Algorithms',
  'Docker'
];

const POPULAR_LEARN_SKILLS = [
  'Gemini API & LLMs',
  'AWS Cloud Services',
  'PyTorch / Machine Learning',
  'Kubernetes & DevOps',
  'Cybersecurity & CTF',
  'Computer Vision (OpenCV)',
  'Vector Databases (RAG)',
  'Mobile App Development (Flutter/React Native)'
];

const DOMAINS: TechDomain[] = [
  'AI & Machine Learning',
  'Web & Mobile Development',
  'Cloud & DevOps',
  'Cybersecurity',
  'Data Science & Analytics',
  'IoT & Robotics',
  'Open Innovation & Social Good'
];

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, isMandatory = false }) => {
  const { user, registerUser, loginUser } = useApp();

  const [mode, setMode] = useState<'register' | 'login'>('register');
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form Fields
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currentStatus, setCurrentStatus] = useState<UserStatus>(user?.currentStatus || 'Student');
  const [institution, setInstitution] = useState(user?.institution || '');
  const [knownSkills, setKnownSkills] = useState<DeclaredSkill[]>(
    user?.declaredSkills && user.declaredSkills.length > 0
      ? user.declaredSkills
      : [
          { name: 'Python', level: 'Intermediate' },
          { name: 'React', level: 'Beginner' }
        ]
  );
  const [customSkillInput, setCustomSkillInput] = useState('');
  const [customSkillLevel, setCustomSkillLevel] = useState<DifficultyLevel>('Intermediate');

  const [skillsWantToLearn, setSkillsWantToLearn] = useState<string[]>(
    user?.skillsWantToLearn && user.skillsWantToLearn.length > 0
      ? user.skillsWantToLearn
      : ['Gemini API & LLMs', 'AWS Cloud Services']
  );
  const [customLearnSkillInput, setCustomLearnSkillInput] = useState('');

  const [selectedInterests, setSelectedInterests] = useState<TechDomain[]>(
    user?.interests && user.interests.length > 0
      ? user.interests
      : ['AI & Machine Learning', 'Web & Mobile Development', 'Cloud & DevOps']
  );

  const [loginEmail, setLoginEmail] = useState('');
  const [loginName, setLoginName] = useState('');

  if (!isOpen) return null;

  const handleAddKnownSkill = (skillName: string, level: DifficultyLevel = 'Intermediate') => {
    if (!skillName.trim()) return;
    if (knownSkills.some((s) => s.name.toLowerCase() === skillName.toLowerCase())) return;
    setKnownSkills([...knownSkills, { name: skillName.trim(), level }]);
    setCustomSkillInput('');
  };

  const handleRemoveKnownSkill = (skillName: string) => {
    setKnownSkills(knownSkills.filter((s) => s.name !== skillName));
  };

  const handleToggleLearnSkill = (skill: string) => {
    if (skillsWantToLearn.includes(skill)) {
      setSkillsWantToLearn(skillsWantToLearn.filter((s) => s !== skill));
    } else {
      setSkillsWantToLearn([...skillsWantToLearn, skill]);
    }
  };

  const handleAddCustomLearnSkill = () => {
    if (!customLearnSkillInput.trim()) return;
    if (!skillsWantToLearn.includes(customLearnSkillInput.trim())) {
      setSkillsWantToLearn([...skillsWantToLearn, customLearnSkillInput.trim()]);
    }
    setCustomLearnSkillInput('');
  };

  const handleToggleDomain = (domain: TechDomain) => {
    if (selectedInterests.includes(domain)) {
      setSelectedInterests(selectedInterests.filter((d) => d !== domain));
    } else {
      setSelectedInterests([...selectedInterests, domain]);
    }
  };

  const handleFinishRegister = async () => {
    await registerUser({
      name: name.trim() || 'Student Explorer',
      email: email.trim() || 'student@university.edu',
      currentStatus,
      institution: institution.trim() || 'University',
      declaredSkills: knownSkills,
      skillsWantToLearn,
      interests: selectedInterests,
      headline: `${currentStatus} • Learning ${skillsWantToLearn.slice(0, 2).join(' & ')}`,
      education: institution.trim() ? `${currentStatus} at ${institution.trim()}` : currentStatus
    });
    if (onClose) onClose();
  };

  const handleDirectLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim()) return;
    await loginUser(loginEmail.trim(), loginName.trim() || 'Student Explorer');
    if (onClose) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">
                {mode === 'register' ? 'Join Opportunity Atlas' : 'Sign In to Opportunity Atlas'}
              </h3>
              <p className="text-[11px] text-slate-300">
                {isMandatory
                  ? "You've previewed 2 opportunities! Create your profile to unlock full real-time access."
                  : 'Personalized hackathon matches, readiness scores, and AI mentor.'}
              </p>
            </div>
          </div>

          {!isMandatory && onClose && (
            <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Progress Step Indicator (for register mode) */}
        {mode === 'register' && (
          <div className="px-6 pt-4 pb-2 border-b border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-500">
            <div className={`flex items-center space-x-1.5 ${step >= 1 ? 'text-indigo-600' : ''}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${step >= 1 ? 'bg-indigo-600 text-white' : 'bg-slate-200'}`}>1</span>
              <span>Account</span>
            </div>
            <div className="w-8 h-0.5 bg-slate-200"></div>
            <div className={`flex items-center space-x-1.5 ${step >= 2 ? 'text-indigo-600' : ''}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${step >= 2 ? 'bg-indigo-600 text-white' : 'bg-slate-200'}`}>2</span>
              <span>Status</span>
            </div>
            <div className="w-8 h-0.5 bg-slate-200"></div>
            <div className={`flex items-center space-x-1.5 ${step >= 3 ? 'text-indigo-600' : ''}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${step >= 3 ? 'bg-indigo-600 text-white' : 'bg-slate-200'}`}>3</span>
              <span>Skills</span>
            </div>
          </div>
        )}

        {/* BODY */}
        <div className="p-6 space-y-6 text-xs">
          
          {/* LOGIN VIEW */}
          {mode === 'login' ? (
            <form onSubmit={handleDirectLogin} className="space-y-4">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Your Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Chen"
                  value={loginName}
                  onChange={(e) => setLoginName(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. alex.chen@university.edu"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-hidden"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-md shadow-indigo-100 transition-all"
              >
                Sign In to Opportunity Atlas
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  className="text-indigo-600 font-bold hover:underline"
                >
                  Need an account? Complete the 2-minute registration →
                </button>
              </div>
            </form>
          ) : (
            /* MULTI-STEP REGISTRATION VIEW */
            <div>
              {/* STEP 1: NAME & EMAIL */}
              {step === 1 && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h4 className="font-extrabold text-sm text-slate-900">Step 1: Your Information</h4>
                    <p className="text-slate-500">Provide your name and student/professional email address.</p>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Full Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alex Chen"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Email Address <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. alex.chen@university.edu"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-hidden"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setMode('login')}
                      className="text-slate-500 hover:text-indigo-600 font-bold"
                    >
                      Already have an account? Sign In
                    </button>

                    <button
                      type="button"
                      disabled={!name.trim() || !email.trim()}
                      onClick={() => setStep(2)}
                      className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-md disabled:opacity-50 flex items-center space-x-1.5"
                    >
                      <span>Next: Your Status</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: CURRENT STATUS */}
              {step === 2 && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h4 className="font-extrabold text-sm text-slate-900">Step 2: Current Status</h4>
                    <p className="text-slate-500">Are you currently a student, professor, or industry developer?</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {[
                      { id: 'Student', label: '🎓 Student (Undergraduate / Postgrad / Diploma)' },
                      { id: 'Professor / Academic', label: '👨‍🏫 Professor / Academic / Researcher' },
                      { id: 'Working Professional', label: '💼 Working Professional / Software Engineer' },
                      { id: 'Self-Taught Developer', label: '💻 Self-Taught Developer / Career Switcher' },
                      { id: 'Other', label: '🌐 Other Technical Learner' }
                    ].map((item) => (
                      <div
                        key={item.id}
                        onClick={() => setCurrentStatus(item.id as UserStatus)}
                        className={`p-3 rounded-xl border cursor-pointer font-bold transition-all ${
                          currentStatus === item.id
                            ? 'bg-indigo-50 border-indigo-600 text-indigo-900 shadow-xs'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {item.label}
                      </div>
                    ))}
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      College / University / Organization Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. VNR VJIET, Stanford University, IIT, IIIT..."
                      value={institution}
                      onChange={(e) => setInstitution(e.target.value)}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-hidden"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="text-slate-500 hover:text-slate-700 font-bold"
                    >
                      ← Back
                    </button>

                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-md flex items-center space-x-1.5"
                    >
                      <span>Next: Skills Profile</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: SKILLS YOU KNOW & WANT TO LEARN */}
              {step === 3 && (
                <div className="space-y-5">
                  <div className="space-y-1">
                    <h4 className="font-extrabold text-sm text-slate-900">Step 3: Skills You Know & Want to Learn</h4>
                    <p className="text-slate-500">This configures your readiness scores and learning recommendations.</p>
                  </div>

                  {/* Skills You Know */}
                  <div className="space-y-2 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                    <label className="font-extrabold text-slate-800 block">
                      1. Skills You Currently Know:
                    </label>
                    
                    {/* Active Known Skills */}
                    <div className="flex flex-wrap gap-1.5">
                      {knownSkills.map((sk) => (
                        <span
                          key={sk.name}
                          className="px-2.5 py-1 bg-white border border-indigo-200 text-indigo-900 rounded-lg font-bold flex items-center space-x-1.5 shadow-2xs"
                        >
                          <span>{sk.name} ({sk.level[0]})</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveKnownSkill(sk.name)}
                            className="text-slate-400 hover:text-rose-600 font-bold"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>

                    {/* Popular quick chips */}
                    <div className="pt-1">
                      <span className="text-[10px] text-slate-400 font-bold block mb-1">Click to add known skill:</span>
                      <div className="flex flex-wrap gap-1">
                        {POPULAR_KNOWN_SKILLS.filter(
                          (ps) => !knownSkills.some((k) => k.name.toLowerCase() === ps.toLowerCase())
                        ).slice(0, 7).map((ps) => (
                          <button
                            key={ps}
                            type="button"
                            onClick={() => handleAddKnownSkill(ps, 'Intermediate')}
                            className="px-2 py-0.5 bg-slate-200/70 hover:bg-indigo-100 hover:text-indigo-700 rounded text-[10px] font-medium text-slate-700"
                          >
                            + {ps}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Custom input */}
                    <div className="flex items-center gap-1.5 pt-1">
                      <input
                        type="text"
                        placeholder="Add other known skill..."
                        value={customSkillInput}
                        onChange={(e) => setCustomSkillInput(e.target.value)}
                        className="flex-1 p-2 bg-white border border-slate-200 rounded-lg text-slate-900 text-xs"
                      />
                      <select
                        value={customSkillLevel}
                        onChange={(e) => setCustomSkillLevel(e.target.value as DifficultyLevel)}
                        className="p-2 bg-white border border-slate-200 rounded-lg text-slate-900 text-xs"
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                      </select>
                      <button
                        type="button"
                        onClick={() => handleAddKnownSkill(customSkillInput, customSkillLevel)}
                        className="px-3 py-2 bg-slate-900 text-white rounded-lg font-bold"
                      >
                        Add
                      </button>
                    </div>
                  </div>

                  {/* Skills You Want to Learn */}
                  <div className="space-y-2 bg-indigo-50/60 p-3.5 rounded-2xl border border-indigo-100">
                    <label className="font-extrabold text-indigo-950 block">
                      2. Skills You Want to Learn:
                    </label>

                    <div className="flex flex-wrap gap-1.5">
                      {skillsWantToLearn.map((sk) => (
                        <span
                          key={sk}
                          className="px-2.5 py-1 bg-white border border-indigo-200 text-indigo-900 rounded-lg font-bold flex items-center space-x-1.5 shadow-2xs"
                        >
                          <span>{sk}</span>
                          <button
                            type="button"
                            onClick={() => handleToggleLearnSkill(sk)}
                            className="text-slate-400 hover:text-rose-600 font-bold"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>

                    {/* Popular learn chips */}
                    <div className="pt-1">
                      <span className="text-[10px] text-slate-400 font-bold block mb-1">Popular learning goals:</span>
                      <div className="flex flex-wrap gap-1">
                        {POPULAR_LEARN_SKILLS.filter((ps) => !skillsWantToLearn.includes(ps)).map((ps) => (
                          <button
                            key={ps}
                            type="button"
                            onClick={() => handleToggleLearnSkill(ps)}
                            className="px-2 py-0.5 bg-white border border-indigo-100 hover:bg-indigo-100 hover:text-indigo-800 rounded text-[10px] font-medium text-slate-700"
                          >
                            + {ps}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Custom learn input */}
                    <div className="flex items-center gap-1.5 pt-1">
                      <input
                        type="text"
                        placeholder="Add other target skill..."
                        value={customLearnSkillInput}
                        onChange={(e) => setCustomLearnSkillInput(e.target.value)}
                        className="flex-1 p-2 bg-white border border-slate-200 rounded-lg text-slate-900 text-xs"
                      />
                      <button
                        type="button"
                        onClick={handleAddCustomLearnSkill}
                        className="px-3 py-2 bg-indigo-600 text-white rounded-lg font-bold"
                      >
                        Add
                      </button>
                    </div>
                  </div>

                  {/* Primary Tech Domains */}
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700 block">3. Primary Domains of Interest</label>
                    <div className="flex flex-wrap gap-1.5">
                      {DOMAINS.map((domain) => {
                        const isSelected = selectedInterests.includes(domain);
                        return (
                          <button
                            key={domain}
                            type="button"
                            onClick={() => handleToggleDomain(domain)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                              isSelected
                                ? 'bg-slate-900 text-white'
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                          >
                            {isSelected ? '✓ ' : '+ '}{domain}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="text-slate-500 hover:text-slate-700 font-bold"
                    >
                      ← Back
                    </button>

                    <button
                      type="button"
                      onClick={handleFinishRegister}
                      className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white rounded-xl font-black shadow-lg shadow-indigo-100 flex items-center space-x-2"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Complete Setup & Unlock Atlas</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
