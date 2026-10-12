import React, { useState, useRef } from 'react';
import {
  Sparkles,
  Send,
  Upload,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Trophy,
  ArrowRight,
  BookOpen,
  Download,
  RotateCcw,
  Clock,
  HelpCircle,
  Lightbulb,
  MessageSquare,
  ShieldCheck,
  Zap,
  Bookmark,
  CheckSquare,
  Square,
  FileCode,
  Link as LinkIcon
} from 'lucide-react';
import { useApp } from '../context/AppContext.tsx';
import {
  HackathonSubmission,
  CoachFeedback,
  CoachChatMessage,
  SavedHackathonReview
} from '../types/index.ts';

export const AiCoachPage: React.FC = () => {
  const {
    runHackathonAnalysis,
    sendCoachChatMessage,
    activeCoachReview,
    setActiveCoachReview,
    reviews,
    setCurrentPage,
    setSelectedHackathonId,
    saveRoadmap
  } = useApp();

  // Mode: Review Completed vs Prepare Upcoming
  const [targetMode, setTargetMode] = useState<'review_completed' | 'prepare_upcoming'>('review_completed');

  // Form Inputs
  const [hackathonName, setHackathonName] = useState('');
  const [problemStatement, setProblemStatement] = useState('');
  const [proposedSolution, setProposedSolution] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [repoUrl, setRepoUrl] = useState('');
  const [demoUrl, setDemoUrl] = useState('');
  const [submissionMaterialsText, setSubmissionMaterialsText] = useState('');
  const [judgingRubricText, setJudgingRubricText] = useState('');
  const [judgesFeedback, setJudgesFeedback] = useState('');
  const [teamRole, setTeamRole] = useState('');
  const [challengesEncountered, setChallengesEncountered] = useState('');
  const [selfReflection, setSelfReflection] = useState('');

  // UI state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [activeTab, setActiveTab] = useState<'evaluation' | 'issues' | 'plan' | 'chat'>('evaluation');
  const [checklistState, setChecklistState] = useState<{ [index: number]: boolean }>({});

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sample templates for testing convenience
  const loadSampleSubmission = (type: 'sih' | 'ai') => {
    if (type === 'sih') {
      setHackathonName('Smart India Hackathon (SIH) 2026 - Campus Resource Optimizer');
      setProblemStatement('Develop an intelligent scheduling and energy management system for university laboratories to eliminate peak energy wastage and overlapping bookings.');
      setProposedSolution('OptiCampus: A Node.js and React dashboard connected to simulated smart meters with basic automated conflict resolution algorithms.');
      setProjectDescription('OptiCampus provides faculty an interface to reserve labs. When a slot is approved, the system turns on smart relays (simulated via ESP32 MQTT) and predicts peak energy load using regression.');
      setRepoUrl('https://github.com/student-dev/opti-campus-sih');
      setDemoUrl('https://opti-campus-demo.vercel.app');
      setSubmissionMaterialsText(`Architecture:
Frontend: React 18, Tailwind CSS, Recharts
Backend: Express REST API, MongoDB
Hardware Sim: MQTT broker over WebSockets
Presentation Slides Summary:
- Slide 1: University power bills are ₹8,00,000/month.
- Slide 2: OptiCampus automated scheduling.
- Slide 3: Architecture diagram showing relay controls.
- Slide 4: Cost estimations and implementation.`);
      setJudgingRubricText('Problem Validation 20%, Technical Complexity 30%, Scalability & Hardware Feasibility 30%, Pitch & QA 20%');
      setJudgesFeedback('Judges said: "Good hardware concept, but how do you prevent relay failures if WiFi disconnects? Also, did you test this with real timetable data from college registrars?"');
      setTeamRole('Backend API developer and lead presenter');
      setChallengesEncountered('Had difficulty stabilizing WebSocket connections during the live demo on venue Wi-Fi; one relay trigger failed on stage.');
      setSelfReflection('We focused too much on soldering physical sensor breadboards instead of proving the energy savings with actual campus electrical data.');
    } else {
      setHackathonName('Google Cloud Gen AI Hackathon - Multimodal Triage Assistant');
      setProblemStatement('Emergency room waiting times are exacerbated by manual triage intake forms. Build an assistant to accelerate non-emergency symptom categorizing.');
      setProposedSolution('CareScribe: A multimodal web application using Gemini 3.8 Flash to interpret patient voice memos and prescription photos into structured triage summaries.');
      setProjectDescription('CareScribe takes patient input, runs safety filters with Gemini, and produces a structured HL7/FHIR compatible triage card for the attending nurse.');
      setRepoUrl('https://github.com/student-dev/carescribe-gemini');
      setDemoUrl('https://carescribe-demo.vercel.app');
      setSubmissionMaterialsText(`Technical Pipeline:
1. Audio recorded via Web Audio API, base64 encoded.
2. Sent to Gemini 3.8 Flash with medical symptom extraction system prompt.
3. Structured output schema mapping to urgency index (ESI 1-5).
4. Export as PDF.`);
      setJudgingRubricText('Innovation 25%, Technical Execution with Gemini 25%, Responsible AI & Privacy 25%, Presentation 25%');
      setJudgesFeedback('Judges noted: "Extremely clean UI, but what safeguards exist if the LLM hallucinates an allergy contraindication?"');
      setTeamRole('Full-Stack Engineer (React + GenAI integration)');
      setChallengesEncountered('Hallucination guardrails and edge-case testing under medical safety constraints.');
      setSelfReflection('Our pitch deck looked pretty, but we did not cite any clinical guidelines or disclaimers.');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('File size exceeds 2MB limit. Please upload plain text, markdown, or small documentation.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setSubmissionMaterialsText((prev) => `${prev}\n\n[Uploaded Document: ${file.name}]\n${content.slice(0, 3000)}`);
      };
      reader.readAsText(file);
    }
  };

  const handleSubmitAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hackathonName.trim()) {
      alert('Please enter a hackathon name.');
      return;
    }

    try {
      setIsAnalyzing(true);
      const submission: HackathonSubmission = {
        hackathonName,
        targetMode,
        problemStatement,
        proposedSolution,
        projectDescription,
        repoUrl,
        demoUrl,
        submissionMaterialsText,
        judgingRubricText,
        judgesFeedback,
        teamRole,
        challengesEncountered,
        selfReflection
      };

      await runHackathonAnalysis(submission);
      setActiveTab('evaluation');
    } catch (err) {
      console.error('Analysis failed:', err);
      alert('Failed to generate analysis. Please verify your inputs.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !activeCoachReview) return;
    try {
      setIsSendingMessage(true);
      const text = chatInput;
      setChatInput('');
      await sendCoachChatMessage(activeCoachReview.id, text);
    } catch (err) {
      console.error('Failed to send coach message:', err);
    } finally {
      setIsSendingMessage(false);
    }
  };

  const handleQuickQuestion = (question: string) => {
    setChatInput(question);
    setActiveTab('chat');
  };

  const handleDownloadMarkdown = () => {
    if (!activeCoachReview) return;
    const fb = activeCoachReview.feedback;
    const content = `# Opportunity Atlas - AI Hackathon Coach Analysis
**Hackathon:** ${activeCoachReview.hackathonName}
**Date:** ${new Date(activeCoachReview.date).toLocaleDateString()}

## Executive Summary
${fb.summary}

## 10-Dimension Evaluation
${fb.dimensions.map((d) => `- **${d.dimension}:** ${d.score}/10 - ${d.explanation}`).join('\n')}

## Core Strengths
${fb.strengths.map((s) => `- ${s}`).join('\n')}

## Identified Issues & Recommendations
${fb.issues
  .map(
    (i) => `### ${i.issue} (Priority: ${i.priority} | Evidence: ${i.evidenceType})
- **Evidence:** ${i.evidence}
- **Why It Matters:** ${i.whyItMatters}
- **Recommendation:** ${i.practicalRecommendation}
- **Skills to Develop:** ${i.skillsToDevelop.join(', ')}
- **Practice Exercise:** ${i.practiceExercise}
`
  )
  .join('\n')}

## Improvement Plan
### Top Priorities:
${fb.improvementPlan.top3Priorities.map((p) => `1. ${p}`).join('\n')}

### Capstone Project: ${fb.improvementPlan.practiceProject.title}
${fb.improvementPlan.practiceProject.description}
Deliverable: ${fb.improvementPlan.practiceProject.deliverable}

---
Generated by Opportunity Atlas AI Hackathon Coach.
`;

    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${activeCoachReview.hackathonName.replace(/\s+/g, '_')}_Coach_Review.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleAddPlanToRoadmap = () => {
    if (!activeCoachReview) return;
    const plan = activeCoachReview.feedback.improvementPlan;
    saveRoadmap({
      title: `Improvement Roadmap: Post-${activeCoachReview.hackathonName}`,
      goal: `Turn hackathon feedback into a portfolio capstone and future competition victory`,
      domain: 'AI & Machine Learning',
      prerequisiteKnowledge: plan.skillsToDevelop,
      recommendedCourseIds: plan.recommendedCourseIds,
      skillsToPractice: plan.skillsToDevelop.map((sk) => ({
        skill: sk,
        exercise: `Follow AI Coach practice guideline for ${sk}`,
        completed: false
      })),
      practicalProject: {
        title: plan.practiceProject.title,
        description: plan.practiceProject.description,
        deliverable: plan.practiceProject.deliverable,
        completed: false
      },
      demonstrationMethod: 'Deploy updated MVP and present during next competition cycle',
      relevantHackathonIds: [],
      steps: plan.checklist.map((c, i) => ({
        id: `coach-step-${i}`,
        title: c.task,
        description: `Remediation milestone prioritized by AI Hackathon Coach`,
        category: 'Project',
        completed: false
      }))
    });
    alert('Plan successfully added to your learning roadmap in My Dashboard!');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-violet-950 text-white rounded-3xl p-8 sm:p-10 shadow-xl border border-indigo-900/40 space-y-4">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-violet-900/60 border border-violet-700/60 text-violet-300 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Interactive AI Mentor</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
          "Every Hackathon Is a Chance to Improve."
        </h1>
        <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
          Reflect on your project, understand your gaps, and turn your experience into a practical improvement plan.
          Our model evaluates across 10 critical dimensions, separating verified judge feedback from AI hypotheses.
        </p>

        {/* Mode Selector */}
        <div className="flex flex-wrap gap-3 pt-2">
          <button
            onClick={() => setTargetMode('review_completed')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              targetMode === 'review_completed'
                ? 'bg-violet-600 text-white shadow-md shadow-violet-900/50'
                : 'bg-white/10 text-slate-300 hover:bg-white/20'
            }`}
          >
            Review a Completed Hackathon
          </button>
          <button
            onClick={() => setTargetMode('prepare_upcoming')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              targetMode === 'prepare_upcoming'
                ? 'bg-violet-600 text-white shadow-md shadow-violet-900/50'
                : 'bg-white/10 text-slate-300 hover:bg-white/20'
            }`}
          >
            Prepare for an Upcoming Hackathon
          </button>
        </div>
      </div>

      {/* MAIN TWO-COLUMN WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: SUBMISSION FORM (Lg: 5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 p-6 space-y-6 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="font-extrabold text-base text-slate-900">Project Submission Form</h2>
              <p className="text-xs text-slate-500">Provide materials for evidence-grounded review</p>
            </div>
            
            {/* Quick Sample Loader */}
            <div className="flex items-center space-x-1.5">
              <span className="text-[10px] text-slate-400 font-semibold uppercase">Load Sample:</span>
              <button
                type="button"
                onClick={() => loadSampleSubmission('sih')}
                className="px-2 py-1 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 rounded text-[10px] font-bold text-slate-600"
                title="Load Smart India Hackathon project"
              >
                SIH Sample
              </button>
              <button
                type="button"
                onClick={() => loadSampleSubmission('ai')}
                className="px-2 py-1 bg-slate-100 hover:bg-violet-50 hover:text-violet-600 rounded text-[10px] font-bold text-slate-600"
                title="Load Google Gen AI project"
              >
                GenAI Sample
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmitAnalysis} className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Hackathon Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Smart India Hackathon, Google Cloud Gen AI"
                value={hackathonName}
                onChange={(e) => setHackathonName(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-hidden"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Official Problem Statement</label>
              <textarea
                rows={2}
                placeholder="What was the challenge or prompt you were solving?"
                value={problemStatement}
                onChange={(e) => setProblemStatement(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-hidden"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Your Proposed Solution & Tech Stack</label>
              <input
                type="text"
                placeholder="e.g. Real-time patient triage assistant using Gemini and React"
                value={proposedSolution}
                onChange={(e) => setProposedSolution(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-hidden"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Repository URL</label>
                <input
                  type="url"
                  placeholder="https://github.com/..."
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-hidden"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Demo / Prototype URL</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={demoUrl}
                  onChange={(e) => setDemoUrl(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-hidden"
                />
              </div>
            </div>

            {/* Document / Text Upload */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-bold text-slate-700">Project Description, Code Snippets or Pitch Outline</label>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1"
                >
                  <Upload className="w-3 h-3" />
                  <span>Attach Text/Code File</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".txt,.md,.json,.js,.ts,.py,.csv"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
              <textarea
                rows={4}
                placeholder="Paste code excerpts, pitch presentation bullet points, or upload a project report (max 2MB .txt/.md)..."
                value={submissionMaterialsText}
                onChange={(e) => setSubmissionMaterialsText(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-hidden font-mono text-[11px]"
              />
              <span className="text-[10px] text-slate-400">Supported: TXT, MD, Code files. Private & strictly analyzed in-session.</span>
            </div>

            {/* Judging Criteria & Feedback */}
            <div>
              <label className="font-bold text-slate-700 block mb-1">Judging Rubric or Criteria (if available)</label>
              <input
                type="text"
                placeholder="e.g. Innovation (25%), Tech (25%), Impact (25%), Pitch (25%)"
                value={judgingRubricText}
                onChange={(e) => setJudgingRubricText(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-hidden"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Judges' Comments / Scores (if received)</label>
              <textarea
                rows={2}
                placeholder="Exact or paraphrased feedback from evaluation round..."
                value={judgesFeedback}
                onChange={(e) => setJudgesFeedback(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-hidden"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Personal Reflection & Challenges Encountered</label>
              <textarea
                rows={2}
                placeholder="What went well? Where did you get stuck? What would you do differently?"
                value={selfReflection}
                onChange={(e) => setSelfReflection(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-hidden"
              />
            </div>

            <button
              type="submit"
              disabled={isAnalyzing}
              className="w-full py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-xl font-bold shadow-md shadow-violet-200 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
            >
              {isAnalyzing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Analyzing Project Across 10 Dimensions...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Analyze Project with AI Coach</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* RIGHT COLUMN: AI COACH AUDIT RESULTS & CONVERSATION (Lg: 7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {activeCoachReview ? (
            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
              
              {/* Header with Review Title & Export */}
              <div className="p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-violet-300 bg-violet-900/60 px-2 py-0.5 rounded-full">
                      Evaluation Complete
                    </span>
                    <span className="text-xs text-slate-400">
                      {new Date(activeCoachReview.date).toLocaleDateString()}
                    </span>
                  </div>
                  <h2 className="text-xl font-black mt-1 text-white">
                    {activeCoachReview.hackathonName}
                  </h2>
                </div>

                <div className="flex items-center space-x-2 self-start sm:self-auto">
                  <button
                    onClick={handleDownloadMarkdown}
                    className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center space-x-1.5 transition-colors"
                    title="Export Markdown Report"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export</span>
                  </button>
                  <button
                    onClick={handleAddPlanToRoadmap}
                    className="px-3 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold flex items-center space-x-1.5 transition-colors shadow-md"
                  >
                    <Bookmark className="w-4 h-4" />
                    <span>Save to Roadmap</span>
                  </button>
                </div>
              </div>

              {/* Tabs Navigation */}
              <div className="flex border-b border-slate-200 bg-slate-50/70 px-4 text-xs font-bold text-slate-600">
                <button
                  onClick={() => setActiveTab('evaluation')}
                  className={`py-3 px-3 border-b-2 transition-all ${
                    activeTab === 'evaluation'
                      ? 'border-violet-600 text-violet-700 bg-white'
                      : 'border-transparent hover:text-slate-900'
                  }`}
                >
                  10 Dimensions
                </button>
                <button
                  onClick={() => setActiveTab('issues')}
                  className={`py-3 px-3 border-b-2 transition-all flex items-center space-x-1.5 ${
                    activeTab === 'issues'
                      ? 'border-violet-600 text-violet-700 bg-white'
                      : 'border-transparent hover:text-slate-900'
                  }`}
                >
                  <span>Identified Weaknesses</span>
                  <span className="px-1.5 py-0.2 rounded-full bg-rose-100 text-rose-700 text-[10px]">
                    {activeCoachReview.feedback.issues.length}
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab('plan')}
                  className={`py-3 px-3 border-b-2 transition-all ${
                    activeTab === 'plan'
                      ? 'border-violet-600 text-violet-700 bg-white'
                      : 'border-transparent hover:text-slate-900'
                  }`}
                >
                  Improvement Plan
                </button>
                <button
                  onClick={() => setActiveTab('chat')}
                  className={`py-3 px-3 border-b-2 transition-all flex items-center space-x-1.5 ${
                    activeTab === 'chat'
                      ? 'border-violet-600 text-violet-700 bg-white'
                      : 'border-transparent hover:text-slate-900'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Coach Chat</span>
                </button>
              </div>

              {/* TAB 1: 10 DIMENSIONS & STRENGTHS */}
              {activeTab === 'evaluation' && (
                <div className="p-6 space-y-6">
                  {/* Executive Summary */}
                  <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 text-xs text-slate-700 space-y-2 leading-relaxed">
                    <span className="font-bold text-slate-900 uppercase text-[10px] tracking-wider block">
                      Executive Mentor Summary
                    </span>
                    <p>{activeCoachReview.feedback.summary}</p>
                  </div>

                  {/* Strengths */}
                  <div className="space-y-2">
                    <h3 className="font-bold text-xs uppercase tracking-wider text-emerald-800 flex items-center space-x-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Observed Strengths</span>
                    </h3>
                    <div className="grid grid-cols-1 gap-2">
                      {activeCoachReview.feedback.strengths.map((s, idx) => (
                        <div key={idx} className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200/60 text-xs text-emerald-900 font-medium">
                          • {s}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 10-Dimension Scorecard */}
                  <div className="space-y-3">
                    <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900">
                      10-Dimension Technical Scorecard
                    </h3>
                    <div className="space-y-2.5">
                      {activeCoachReview.feedback.dimensions.map((dim) => (
                        <div key={dim.dimension} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                          <div className="flex items-center justify-between font-bold text-slate-800">
                            <span>{dim.dimension}</span>
                            <span className={dim.score >= 7 ? 'text-emerald-600' : dim.score >= 5 ? 'text-amber-600' : 'text-rose-600'}>
                              {dim.score}/10
                            </span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                            <div
                              className={`h-1.5 rounded-full ${
                                dim.score >= 7 ? 'bg-emerald-500' : dim.score >= 5 ? 'bg-amber-500' : 'bg-rose-500'
                              }`}
                              style={{ width: `${dim.score * 10}%` }}
                            ></div>
                          </div>
                          <p className="text-[11px] text-slate-500 leading-snug">{dim.explanation}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Follow up questions prompt if sparse */}
                  {activeCoachReview.feedback.followUpQuestions && activeCoachReview.feedback.followUpQuestions.length > 0 && (
                    <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-xs space-y-2">
                      <div className="flex items-center space-x-1.5 font-bold text-amber-900">
                        <HelpCircle className="w-4 h-4 text-amber-600" />
                        <span>Coach Clarifying Inquiries:</span>
                      </div>
                      <p className="text-amber-800 text-[11px]">
                        To sharpen our advice, consider answering these during your next round:
                      </p>
                      <ul className="list-disc pl-4 space-y-1 text-amber-900 text-[11px]">
                        {activeCoachReview.feedback.followUpQuestions.map((q, idx) => (
                          <li key={idx} className="cursor-pointer hover:underline" onClick={() => handleQuickQuestion(q)}>
                            {q}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: IDENTIFIED WEAKNESSES WITH EVIDENCE */}
              {activeTab === 'issues' && (
                <div className="p-6 space-y-4">
                  <div className="text-xs text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    <strong>Evidence Legend:</strong>
                    <span className="ml-2 px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px]">Judge Confirmed</span> = Direct from judges
                    <span className="ml-2 px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 text-[10px]">Directly Observed</span> = In submission code/writeup
                    <span className="ml-2 px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px]">AI Hypothesis</span> = Predictive estimation
                  </div>

                  {activeCoachReview.feedback.issues.map((issue) => (
                    <div
                      key={issue.id}
                      className="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-3 text-xs"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                issue.priority === 'High'
                                  ? 'bg-rose-100 text-rose-700'
                                  : issue.priority === 'Medium'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-slate-200 text-slate-700'
                              }`}
                            >
                              {issue.priority} Priority
                            </span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white border border-slate-300 text-slate-700">
                              {issue.evidenceType}
                            </span>
                          </div>
                          <h4 className="font-extrabold text-sm text-slate-900 mt-1">{issue.issue}</h4>
                        </div>
                      </div>

                      <div className="space-y-1.5 text-slate-600 bg-white p-3 rounded-xl border border-slate-200/60">
                        <div>
                          <strong className="text-slate-800">Evidence from submission:</strong> "{issue.evidence}"
                        </div>
                        <div>
                          <strong className="text-slate-800">Why it matters:</strong> {issue.whyItMatters}
                        </div>
                        {issue.judgingCriterion && (
                          <div>
                            <strong className="text-slate-800">Judging Criterion:</strong> {issue.judgingCriterion}
                          </div>
                        )}
                      </div>

                      <div className="p-3 rounded-xl bg-violet-50/70 border border-violet-100 text-violet-950 space-y-1">
                        <span className="font-bold text-violet-800 flex items-center space-x-1">
                          <Lightbulb className="w-3.5 h-3.5 text-violet-600" />
                          <span>Actionable Recommendation:</span>
                        </span>
                        <p className="leading-relaxed">{issue.practicalRecommendation}</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-[11px]">
                        <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                          <strong className="block text-slate-700 mb-0.5">Skills to Level Up:</strong>
                          <div className="flex flex-wrap gap-1">
                            {issue.skillsToDevelop.map((sk) => (
                              <span key={sk} className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold">
                                {sk}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                          <strong className="block text-slate-700 mb-0.5">Practice Exercise:</strong>
                          <span className="text-slate-600">{issue.practiceExercise}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 3: STRUCTURED IMPROVEMENT PLAN */}
              {activeTab === 'plan' && (
                <div className="p-6 space-y-6">
                  {/* Top 3 Priorities */}
                  <div className="space-y-3">
                    <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900">
                      Top 3 Priority Fixes for Your Next Competition
                    </h3>
                    <div className="space-y-2">
                      {activeCoachReview.feedback.improvementPlan.top3Priorities.map((p, idx) => (
                        <div key={idx} className="p-3.5 rounded-xl bg-indigo-50 border border-indigo-200 text-xs font-semibold text-indigo-950 flex items-start space-x-2">
                          <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs shrink-0 font-bold">
                            {idx + 1}
                          </span>
                          <span className="leading-relaxed">{p}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Portfolio Capstone Successor Project */}
                  <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white space-y-3 shadow-sm">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-violet-300">
                      Recommended Practice Project
                    </span>
                    <h4 className="text-base font-black">
                      {activeCoachReview.feedback.improvementPlan.practiceProject.title}
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {activeCoachReview.feedback.improvementPlan.practiceProject.description}
                    </p>
                    <div className="p-2.5 rounded-lg bg-white/10 text-xs text-emerald-300 font-medium">
                      <strong>Deliverable:</strong> {activeCoachReview.feedback.improvementPlan.practiceProject.deliverable}
                    </div>
                  </div>

                  {/* Action Checklist */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900">
                        {activeCoachReview.feedback.improvementPlan.timelineWeeks}-Week Progress Checklist
                      </h3>
                      <span className="text-xs text-slate-500">
                        {Object.values(checklistState).filter(Boolean).length} / {activeCoachReview.feedback.improvementPlan.checklist.length} Completed
                      </span>
                    </div>

                    <div className="space-y-2">
                      {activeCoachReview.feedback.improvementPlan.checklist.map((item, idx) => {
                        const isChecked = !!checklistState[idx];
                        return (
                          <div
                            key={idx}
                            onClick={() => setChecklistState({ ...checklistState, [idx]: !isChecked })}
                            className={`p-3 rounded-xl border text-xs flex items-center space-x-3 cursor-pointer transition-all select-none ${
                              isChecked
                                ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900 line-through'
                                : 'bg-slate-50 border-slate-200 text-slate-800 hover:border-indigo-300'
                            }`}
                          >
                            {isChecked ? (
                              <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                            ) : (
                              <Square className="w-4 h-4 text-slate-400 shrink-0" />
                            )}
                            <span className="font-medium">{item.task}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Future Hackathons Match */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                    <span className="font-bold text-slate-900 uppercase text-[10px] tracking-wider block">
                      Target Future Hackathon Profiles
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {activeCoachReview.feedback.improvementPlan.suggestedFutureHackathonTypes.map((type) => (
                        <span key={type} className="px-3 py-1 bg-white border border-slate-200 rounded-lg font-semibold text-slate-700 shadow-2xs">
                          {type}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Quick CTAs */}
                  <div className="pt-2 flex flex-wrap gap-3">
                    <button
                      onClick={() => setCurrentPage('courses')}
                      className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center space-x-2"
                    >
                      <BookOpen className="w-4 h-4" />
                      <span>Find Courses for Recommended Skills</span>
                    </button>
                    <button
                      onClick={() => setCurrentPage('hackathons')}
                      className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-xs flex items-center space-x-2"
                    >
                      <Trophy className="w-4 h-4" />
                      <span>Find Next Hackathon</span>
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 4: CONVERSATIONAL FOLLOW-UP CHAT */}
              {activeTab === 'chat' && (
                <div className="p-6 space-y-4 flex flex-col h-[520px]">
                  
                  {/* Quick Question Chips */}
                  <div className="flex flex-wrap gap-1.5 pb-2 border-b border-slate-100 text-[11px]">
                    <span className="text-slate-400 font-bold self-center">Ask:</span>
                    <button
                      onClick={() => handleQuickQuestion('Where did our solution go wrong?')}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg text-slate-700"
                    >
                      Where did we go wrong?
                    </button>
                    <button
                      onClick={() => handleQuickQuestion('How could we improve our pitch?')}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg text-slate-700"
                    >
                      How to improve our pitch?
                    </button>
                    <button
                      onClick={() => handleQuickQuestion('How can we make this project portfolio-worthy?')}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg text-slate-700"
                    >
                      Make it portfolio-worthy?
                    </button>
                    <button
                      onClick={() => handleQuickQuestion('What features were missing for judges?')}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg text-slate-700"
                    >
                      Missing features?
                    </button>
                  </div>

                  {/* Chat message stream */}
                  <div className="flex-1 overflow-y-auto space-y-3 pr-2 text-xs">
                    {(activeCoachReview.chatMessages || []).map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${
                          msg.role === 'user' ? 'items-end' : 'items-start'
                        }`}
                      >
                        <div
                          className={`max-w-[85%] p-3.5 rounded-2xl leading-relaxed whitespace-pre-wrap ${
                            msg.role === 'user'
                              ? 'bg-indigo-600 text-white rounded-br-none shadow-xs'
                              : 'bg-slate-100 text-slate-800 rounded-bl-none border border-slate-200/80 shadow-2xs'
                          }`}
                        >
                          {msg.content}
                        </div>
                        <span className="text-[10px] text-slate-400 mt-1 px-1">
                          {msg.role === 'user' ? 'You' : 'Coach'} • {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    ))}
                    {isSendingMessage && (
                      <div className="flex items-center space-x-2 text-xs text-slate-400 italic py-2">
                        <div className="w-3 h-3 rounded-full bg-violet-600 animate-ping"></div>
                        <span>AI Hackathon Coach is formulating advice...</span>
                      </div>
                    )}
                  </div>

                  {/* Chat input box */}
                  <form onSubmit={handleSendChat} className="flex items-center gap-2 pt-2 border-t border-slate-100">
                    <input
                      type="text"
                      placeholder="Ask the coach about architecture, judging, pitch, or next steps..."
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      className="flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-hidden"
                    />
                    <button
                      type="submit"
                      disabled={isSendingMessage || !chatInput.trim()}
                      className="p-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl disabled:opacity-40 transition-colors shadow-xs"
                      aria-label="Send message to AI Coach"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              )}

            </div>
          ) : (
            /* EMPTY STATE BEFORE SUBMISSION */
            <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
                <Sparkles className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="font-extrabold text-slate-900 text-lg">No Active Hackathon Analysis Yet</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                  Fill in your project details on the left, or click "Load Sample" to instantly test our 10-dimension evaluation engine.
                </p>
              </div>
              <div className="pt-2 flex justify-center gap-3">
                <button
                  onClick={() => loadSampleSubmission('sih')}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold"
                >
                  Load SIH Sample Project
                </button>
                <button
                  onClick={() => loadSampleSubmission('ai')}
                  className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs font-bold"
                >
                  Load GenAI Sample Project
                </button>
              </div>
            </div>
          )}

          {/* PREVIOUS REVIEWS HISTORY LIST */}
          {reviews.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900">
                Your Saved Coach Reviews ({reviews.length})
              </h3>
              <div className="space-y-2">
                {reviews.map((rev) => (
                  <div
                    key={rev.id}
                    onClick={() => setActiveCoachReview(rev)}
                    className={`p-3 rounded-xl border text-xs flex items-center justify-between cursor-pointer transition-all ${
                      activeCoachReview?.id === rev.id
                        ? 'bg-indigo-50 border-indigo-300'
                        : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-slate-900">{rev.hackathonName}</div>
                      <div className="text-[10px] text-slate-400">
                        {new Date(rev.date).toLocaleDateString()} • {rev.feedback.issues.length} Issues Identified
                      </div>
                    </div>
                    <span className="text-indigo-600 font-bold text-[11px]">View Analysis →</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

    </div>
  );
};
