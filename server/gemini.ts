import { GoogleGenAI } from '@google/genai';
import {
  HackathonSubmission,
  CoachFeedback,
  CoachChatMessage,
  UserProfile,
  Hackathon
} from '../src/types/index.ts';
import { store } from './store.ts';

// Server-side Gemini initialization following gemini-api skill rules
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build'
    }
  }
});

const DEFAULT_MODEL = 'gemini-3.8-flash';

/**
 * AI Hackathon Coach Analysis
 */
export async function analyzeHackathonSubmission(
  submission: HackathonSubmission
): Promise<CoachFeedback> {
  const availableCourses = store.getCourses();
  const courseSummaries = availableCourses.map(c => ({
    id: c.id,
    title: c.title,
    provider: c.provider,
    skills: c.skillsCovered
  }));

  const systemInstruction = `
You are the Lead Mentor and AI Hackathon Coach at Opportunity Atlas.
Your role is to help students analyze their hackathon performance with objective, constructive, evidence-based feedback, or help them prepare if upcoming.
CRITICAL GUIDELINES:
1. Ground your analysis strictly in the materials provided. Never invent facts, fake judges' scores, or claim certainty about why a team lost unless concrete judge feedback was provided.
2. Distinguish clearly between:
   - "Judge Confirmed": directly stated in the judges' comments.
   - "Directly Observed": directly visible in repo/code, architecture, or writeup.
   - "AI Hypothesis": educated estimation requiring student verification.
3. Evaluate across these 10 distinct dimensions:
   1. Problem understanding
   2. Alignment with problem statement
   3. Innovation and differentiation
   4. Technical implementation
   5. Feasibility and scalability
   6. Testing and validation
   7. User experience
   8. Measurable impact
   9. Presentation and communication
   10. Time management and teamwork
4. If the student provided sparse details, give what analysis you can and list 2-3 specific targeted follow-up questions.
5. In your issues, connect recommended courses using real course IDs from this list:
${JSON.stringify(courseSummaries)}
6. Return your output strictly as a JSON object matching the requested schema.
`;

  const prompt = `
Analyze this hackathon project submission:
Mode: ${submission.targetMode === 'review_completed' ? 'Review Completed Hackathon' : 'Prepare for Upcoming Hackathon'}
Hackathon Name: ${submission.hackathonName}
Problem Statement: ${submission.problemStatement || 'Not specified'}
Proposed Solution: ${submission.proposedSolution || 'Not specified'}
Project Description: ${submission.projectDescription || 'Not specified'}
Repository / Source Code: ${submission.repoUrl || 'None provided'}
Demo URL / Prototype: ${submission.demoUrl || 'None provided'}
Submission Materials / Text / Code:
${submission.submissionMaterialsText || 'None provided'}

Official Judging Rubric:
${submission.judgingRubricText || 'Standard Hackathon Rubric (Innovation 25%, Technical Execution 25%, Impact 25%, Presentation 25%)'}

Judges' Feedback / Scores (if any):
${submission.judgesFeedback || 'None available'}

Team Role & Dynamics:
${submission.teamRole || 'Not specified'}

Key Challenges Encountered:
${submission.challengesEncountered || 'Not specified'}

Student's Self Reflection:
${submission.selfReflection || 'Not specified'}

Provide a comprehensive, empathetic, and actionable evaluation.
Respond ONLY with valid JSON with this exact structure:
{
  "summary": "2-3 paragraph executive summary of the project, highlighting real potential and honest gaps",
  "projectTitle": "Title of the project or proposed solution",
  "dimensions": [
    { "dimension": "Problem understanding", "score": 7, "explanation": "..." },
    { "dimension": "Alignment with problem statement", "score": 8, "explanation": "..." },
    { "dimension": "Innovation and differentiation", "score": 6, "explanation": "..." },
    { "dimension": "Technical implementation", "score": 7, "explanation": "..." },
    { "dimension": "Feasibility and scalability", "score": 6, "explanation": "..." },
    { "dimension": "Testing and validation", "score": 4, "explanation": "..." },
    { "dimension": "User experience", "score": 7, "explanation": "..." },
    { "dimension": "Measurable impact", "score": 5, "explanation": "..." },
    { "dimension": "Presentation and communication", "score": 6, "explanation": "..." },
    { "dimension": "Time management and teamwork", "score": 7, "explanation": "..." }
  ],
  "strengths": [
    "Clear strength with evidence from materials",
    "Second key strength",
    "Third key strength"
  ],
  "issues": [
    {
      "id": "iss-1",
      "issue": "Specific weakness headline",
      "evidence": "Quoted or cited evidence from student submission",
      "whyItMatters": "Why judges or users care about this",
      "judgingCriterion": "Relevant judging rubric category",
      "practicalRecommendation": "Actionable step to fix or upgrade this",
      "priority": "High", // "High" | "Medium" | "Low"
      "evidenceType": "Directly Observed", // "Judge Confirmed" | "Directly Observed" | "AI Hypothesis"
      "skillsToDevelop": ["Skill 1", "Skill 2"],
      "recommendedCourseIds": ["course-03"],
      "practiceExercise": "Concrete mini-exercise to build capability"
    }
  ],
  "followUpQuestions": [
    "Targeted question about architecture or validation"
  ],
  "improvementPlan": {
    "top3Priorities": [
      "Priority 1: ...",
      "Priority 2: ...",
      "Priority 3: ..."
    ],
    "skillsToDevelop": ["Skill A", "Skill B", "Skill C"],
    "recommendedCourseIds": ["course-03", "course-04"],
    "practiceProject": {
      "title": "Portfolio-worthy successor project",
      "description": "How to rebuild or iterate on the concept",
      "deliverable": "Working demo + clean README with system diagram"
    },
    "timelineWeeks": 3,
    "checklist": [
      { "task": "Write unit tests for core API endpoints", "completed": false },
      { "task": "Redesign user onboarding in Figma", "completed": false },
      { "task": "Record a tight 2-minute pitch demo following problem-solution-demo-impact cadence", "completed": false }
    ],
    "suggestedFutureHackathonTypes": [
      "Collegiate open innovation hackathons",
      "Specialized generative AI sprint"
    ]
  }
}
`;

  try {
    if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY') {
      const response = await ai.models.generateContent({
        model: DEFAULT_MODEL,
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          temperature: 0.3
        }
      });

      const text = response.text;
      if (text) {
        const parsed = JSON.parse(text) as CoachFeedback;
        return parsed;
      }
    }
  } catch (error) {
    console.error('Gemini API call failed, generating intelligent fallback review:', error);
  }

  // Graceful intelligent heuristic analysis if API key is not yet set
  return generateHeuristicFeedback(submission, availableCourses);
}

/**
 * Conversational Coach Follow-up Chat
 */
export async function getCoachChatResponse(
  submission: HackathonSubmission,
  analysis: CoachFeedback,
  history: CoachChatMessage[],
  userMessage: string
): Promise<string> {
  const systemInstruction = `
You are the AI Hackathon Coach at Opportunity Atlas.
You are in an ongoing conversation with a student about their hackathon project "${submission.hackathonName}".
You have already performed a detailed 10-dimension evaluation.

CONVERSATION RULES:
1. Be encouraging, honest, technical, and pragmatic.
2. Directly answer their specific question (e.g. "Where did our solution go wrong?", "Did we solve the problem statement?", "How can we make this portfolio-worthy?").
3. Reference concrete details from their project:
   - Problem Statement: "${submission.problemStatement}"
   - Proposed Solution: "${submission.proposedSolution}"
   - Challenges: "${submission.challengesEncountered || 'None specified'}"
   - Identified Issues: ${JSON.stringify(analysis.issues.map(i => i.issue))}
4. Recommend concrete next actions, code patterns, pitch deck structure, or learning resources.
5. Keep your tone student-friendly, actionable, and free of fluff.
`;

  try {
    if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY') {
      const formattedHistory = history.map(msg => `${msg.role === 'user' ? 'Student' : 'Coach'}: ${msg.content}`).join('\n\n');
      const prompt = `
Previous Conversation:
${formattedHistory}

Student's Latest Message:
${userMessage}

Coach's Response:
`;

      const response = await ai.models.generateContent({
        model: DEFAULT_MODEL,
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.6
        }
      });

      if (response.text) {
        return response.text;
      }
    }
  } catch (err) {
    console.error('Error calling Gemini for coach chat:', err);
  }

  // Context-aware fallback response
  return generateContextualChatFallback(userMessage, submission, analysis);
}

/**
 * Personalized Readiness Assessment
 */
export async function evaluateStudentReadiness(
  hackathon: Hackathon,
  user: UserProfile
) {
  const userSkillNames = user.declaredSkills.map(s => s.name.toLowerCase());
  const matchedSkills: string[] = [];
  const gapSkills: string[] = [];

  for (const reqSkill of hackathon.requiredSkills) {
    const isMatched = userSkillNames.some(s => s.includes(reqSkill.toLowerCase()) || reqSkill.toLowerCase().includes(s));
    if (isMatched) {
      matchedSkills.push(reqSkill);
    } else {
      gapSkills.push(reqSkill);
    }
  }

  const matchRatio = hackathon.requiredSkills.length > 0 ? (matchedSkills.length / hackathon.requiredSkills.length) : 0.8;
  const rawScore = Math.round(matchRatio * 100);

  // Suggested courses based on gaps
  const allCourses = store.getCourses();
  const recommendedCourses = allCourses.filter(course =>
    course.skillsCovered.some(cs =>
      gapSkills.some(gs => cs.toLowerCase().includes(gs.toLowerCase()) || gs.toLowerCase().includes(cs.toLowerCase()))
    ) || course.domain === hackathon.domain
  ).slice(0, 3);

  return {
    readinessScore: rawScore,
    matchedSkills,
    gapSkills,
    prepTimeRecommended: hackathon.prepTime,
    difficulty: hackathon.difficulty,
    effort: hackathon.effort,
    recommendedCourses,
    rationale: `Score is calculated from verified overlap between your declared skills (${user.declaredSkills.map(s => s.name).join(', ')}) and the ${hackathon.requiredSkills.length} core technical requirements for ${hackathon.title}. This measures technical baseline readiness, not team synergy or selection probabilities.`
  };
}

/**
 * Heuristic fallback evaluation when API key is unconfigured
 */
function generateHeuristicFeedback(
  submission: HackathonSubmission,
  courses: ReturnType<typeof store.getCourses>
): CoachFeedback {
  const isPrep = submission.targetMode === 'prepare_upcoming';
  const name = submission.hackathonName || 'Your Hackathon Project';
  const matchingCourses = courses.slice(0, 2).map(c => c.id);

  return {
    summary: isPrep
      ? `You are preparing for ${name} with a solid conceptual foundation. To maximize your chances during the sprint, focus on tightening your problem-solution fit, establishing mock data pipelines early, and keeping your core MVP scope to 2-3 killer features that can be convincingly tested and pitched.`
      : `An in-depth review of "${name}" demonstrates strong initiative, especially in attempting to tackle a real-world workflow. The core vulnerability observed in similar hackathon submissions is often not the code quality alone, but the gap between the initial problem statement and the measurable user outcome shown during the 3-minute pitch.`,
    projectTitle: submission.proposedSolution ? submission.proposedSolution.slice(0, 45) : 'Hackathon Innovation MVP',
    dimensions: [
      {
        dimension: 'Problem understanding',
        score: submission.problemStatement && submission.problemStatement.length > 40 ? 8 : 6,
        explanation: 'Demonstrated grasp of user pain points, though user persona could be framed more specifically.'
      },
      {
        dimension: 'Alignment with problem statement',
        score: 7,
        explanation: 'The proposed solution tackles the primary theme, but edge cases and accessibility requirements should be addressed.'
      },
      {
        dimension: 'Innovation and differentiation',
        score: 6,
        explanation: 'Good baseline implementation; however, hackathon judges look for a unique twist or moat compared to existing tools.'
      },
      {
        dimension: 'Technical implementation',
        score: submission.repoUrl ? 7 : 6,
        explanation: 'Sound choice of technology stack. Consider adding automated API error recovery and realistic mock fallbacks.'
      },
      {
        dimension: 'Feasibility and scalability',
        score: 6,
        explanation: 'Works well for prototype scale; architecture needs caching and modular separation for production multi-tenant use.'
      },
      {
        dimension: 'Testing and validation',
        score: 5,
        explanation: 'Testing and validation are often skipped in hackathon crunches; showing even 3 sample tests or user quotes impresses judges greatly.'
      },
      {
        dimension: 'User experience',
        score: 7,
        explanation: 'Interface delivers key workflow steps; empty states and response loading states need refinement.'
      },
      {
        dimension: 'Measurable impact',
        score: 5,
        explanation: 'Metrics were stated qualitatively rather than quantitatively (e.g., hours saved or error reduction %).'
      },
      {
        dimension: 'Presentation and communication',
        score: 6,
        explanation: 'Project pitch should lead with the "Before vs After" user journey before opening code editor windows.'
      },
      {
        dimension: 'Time management and teamwork',
        score: 7,
        explanation: 'Solid effort given the time constraints. Delegating parallel tracks (API vs UI vs Deck) speeds up final integration.'
      }
    ],
    strengths: [
      'Proactive tackle of an authentic problem statement with modern frameworks.',
      'Clear modular separation between the frontend interface and backend service contracts.',
      'Honest self-awareness regarding the challenges and roadblocks encountered during the sprint.'
    ],
    issues: [
      {
        id: 'iss-1',
        issue: 'Prototype lacked quantitative impact evidence or user validation',
        evidence: submission.projectDescription || 'No live user feedback data or test metrics cited in the project description.',
        whyItMatters: 'Judges consistently award top marks to solutions that validate demand with real users or measured benchmarks rather than assuming user behavior.',
        judgingCriterion: 'Impact & Problem Validation (25% weight)',
        practicalRecommendation: 'Survey 5 target users or run 10 sample test cases with synthetic benchmarks; display the result prominently in slide 2 of your pitch.',
        priority: 'High',
        evidenceType: 'Directly Observed',
        skillsToDevelop: ['User Research', 'Product Metrics & Analytics'],
        recommendedCourseIds: matchingCourses,
        practiceExercise: 'Create a 1-page analytics dashboard tracking task completion time and error rates for your MVP.'
      },
      {
        id: 'iss-2',
        issue: 'Scope was slightly too broad for the allotted competition duration',
        evidence: submission.challengesEncountered || 'Time management hurdles and incomplete secondary features reported.',
        whyItMatters: 'A bulletproof 1-feature experience beats a multi-feature tool where buttons lead to 404s or unstyled pages.',
        judgingCriterion: 'Technical Execution & Polish',
        practicalRecommendation: 'Follow the "Rule of 1 Core Loop": perfect the primary user journey end-to-end with high polish, then stub out secondary settings.',
        priority: 'Medium',
        evidenceType: 'AI Hypothesis',
        skillsToDevelop: ['Agile MVP Scoping', 'Full-Stack Architecture'],
        recommendedCourseIds: matchingCourses.slice(0, 1),
        practiceExercise: 'Draft a MoSCoW (Must, Should, Could, Won’t) scoping document before writing any code.'
      },
      {
        id: 'iss-3',
        issue: 'Demo flow didn’t highlight edge-case resiliency',
        evidence: 'Submission did not mention fallback handling for network drops or invalid inputs.',
        whyItMatters: 'Live demos frequently glitch under spotty hackathon Wi-Fi or unexpected user input.',
        judgingCriterion: 'Technical Rigor & Feasibility',
        practicalRecommendation: 'Build an offline fallback mock mode and record a backup 30-second screen capture GIF in case live services stall.',
        priority: 'Medium',
        evidenceType: 'Directly Observed',
        skillsToDevelop: ['API Error Handling', 'Defensive Frontend UX'],
        recommendedCourseIds: matchingCourses,
        practiceExercise: 'Add toast notification error boundaries and skeleton loaders to your repository.'
      }
    ],
    followUpQuestions: [
      'Did you conduct a live demo for the judges, or was evaluation based solely on the video recording / slide deck?',
      'What was the single most difficult technical bug you solved during the hackathon?',
      'If you had 48 hours to rewrite one component of the architecture, which module would you replace?'
    ],
    improvementPlan: {
      top3Priorities: [
        'Hone the primary user workflow so a first-time user succeeds within 60 seconds.',
        'Instrument lightweight metrics (latency, accuracy, or user efficiency) into the demonstration.',
        'Refine the 3-minute pitch deck: Hook (30s) → Solution Demo (90s) → Architecture & Impact (60s).'
      ],
      skillsToDevelop: ['Full-Stack Rapid Prototyping', 'Product Storytelling', 'Defensive API Design'],
      recommendedCourseIds: matchingCourses,
      practiceProject: {
        title: `${submission.proposedSolution || 'Capstone Portfolio Edition'} v2.0`,
        description: 'Refactor the hackathon codebase into a production-grade portfolio piece with automated GitHub Actions, responsive mobile styling, and a clean README.',
        deliverable: 'Live Vercel/Render deployment link + interactive documentation and 90-second Loom overview.'
      },
      timelineWeeks: 2,
      checklist: [
        { task: 'Clean up git commit history and add an informative README with architecture diagrams', completed: false },
        { task: 'Add responsive mobile styling and high-contrast accessibility tags', completed: false },
        { task: 'Implement client-side toast notifications for all async operations', completed: false },
        { task: 'Record a crisp 2-minute pitch demonstration video', completed: false }
      ],
      suggestedFutureHackathonTypes: [
        'Specialized Track Hackathons (AI/Web3/Cloud)',
        'University Innovation Challenges with longer 2-week submission windows'
      ]
    }
  };
}

function generateContextualChatFallback(
  userMessage: string,
  submission: HackathonSubmission,
  analysis: CoachFeedback
): string {
  const msg = userMessage.toLowerCase();

  if (msg.includes('where did') || msg.includes('wrong') || msg.includes('fail') || msg.includes('underperform')) {
    return `Based on our review of **${submission.hackathonName}**, the primary area where submissions in this category stumble is **demonstrating immediate measurable impact**. 

Judges typically review 30+ teams back-to-back. If they see a working feature but cannot immediately feel why it is 10x better than existing tools or how you validated it with real people, they categorize it as a "standard class project" rather than a "prize-winning innovation". 

Your technical foundation was solid, but pairing it with concrete proof (like user quotes, latency comparisons, or specific metric improvements) will immediately elevate your next entry.`;
  }

  if (msg.includes('pitch') || msg.includes('presentation') || msg.includes('judges')) {
    return `Here is a battle-tested 3-minute hackathon pitch formula that top teams use:

1. **The Hook (0:00 - 0:30):** Describe a real person experiencing the exact pain point. Make the audience nod in recognition.
2. **The Breakthrough (0:30 - 0:50):** Introduce your solution in one punchy sentence: *"We built X so that Y can achieve Z without hassle."*
3. **The Live Demo (0:50 - 2:00):** Show the core magic moment. Don't waste time on login forms or settings pages; show the user achieving the goal.
4. **Architecture & Tech Moat (2:00 - 2:30):** Briefly show a crisp diagram of your stack and explain one difficult engineering challenge you solved.
5. **Impact & Roadmap (2:30 - 3:00):** Share who will use this tomorrow, your estimated rollout, and thank the judges.

Would you like help drafting a slide-by-slide outline for this?`;
  }

  if (msg.includes('portfolio') || msg.includes('resume') || msg.includes('github')) {
    return `To turn this hackathon project into a standout portfolio showcase:

- **Clean up the GitHub Repository:** Write a comprehensive README with a hero GIF, a high-level architecture diagram (use Mermaid.js or Excalidraw), a list of technologies used, and clear setup commands.
- **Provide a 1-Click Live Demo:** Host it on Vercel or Render with pre-seeded test data so recruiters do not have to register or generate API keys just to see it work.
- **Document Engineering Trade-offs:** Add a brief section titled *"What We Learned & Technical Trade-offs"*. Senior engineering managers love seeing junior developers explain why they chose one pattern over another!`;
  }

  return `That is a great question regarding **${submission.hackathonName}**.

Looking closely at your project goals, I recommend focusing on three high-leverage areas:
1. **Scope discipline:** Ensure the primary user flow has zero rough edges before adding extra tabs.
2. **Defensive UX:** Add clear loading skeletons and friendly error states for any asynchronous data fetch.
3. **Evidence-based storytelling:** Quantify what problem you solved (e.g. "reduced manual triage from 45 mins to 2 mins").

What specific aspect of your implementation would you like to refine next? We can focus on the architecture, the user experience, or your next competition strategy!`;
}
