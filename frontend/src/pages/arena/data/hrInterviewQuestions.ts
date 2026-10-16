import { HRQuestion } from '../types/hrInterview';

export const STARTER_HR_QUESTIONS: HRQuestion[] = [
  // ==========================================
  // MODE A: CORE INTERVIEW (1-25)
  // ==========================================
  {
    id: 'hr-core-01',
    mode: 'core-interview',
    category: 'Introduction & Motivation',
    difficulty: 'Beginner',
    type: 'typed',
    question: 'Tell me about yourself and why you are interested in a Software Engineering role with us.',
    recommendedFramework: 'Present-Past-Future: Current education/skills -> Past relevant projects/achievements -> Future goals & company alignment.',
    interviewerIntent: 'Assesses your communication clarity, professional self-image, relevant technical foundation, and whether you researched the company.',
    idealTakeaway: 'Avoid reciting your entire CV chronologically. Highlight key technical milestones, genuine passion for engineering, and tailored interest in the company.',
    hint: 'Start with your degree and core tech stack, highlight 1 impactful project, and connect your aspiration to this company.',
    points: 5,
    rubric: {
      keywords: ['computer science', 'engineering', 'project', 'developer', 'skills', 'learn', 'team', 'company', 'passion', 'build'],
      minWords: 25,
      targetWords: 60,
      structuralAspects: ['Current background', 'Practical project or technical experience', 'Motivation for the company'],
      starElements: {
        situationTask: 'Academic background & key programming languages',
        action: 'Hands-on projects or problem-solving experience built',
        result: 'Desire to apply skills in full-time industry environment'
      }
    }
  },
  {
    id: 'hr-core-02',
    mode: 'core-interview',
    category: 'Introduction & Motivation',
    difficulty: 'Beginner',
    type: 'multiple-choice',
    question: 'Why do you want to join our company as a fresher rather than a large multinational corporation or a startup?',
    recommendedFramework: 'Company Culture & Growth Alignment: Connect specific company projects or engineering values to your personal learning curve.',
    interviewerIntent: 'Checks if you sent generic applications or have a deliberate reason for targeting this specific organization.',
    idealTakeaway: 'Reference company domain, technical scale, mentorship ethos, or product impact rather than generic perks like free food or high compensation.',
    hint: 'Focus on technology stack, engineering culture, and long-term career growth rather than compensation or convenience.',
    points: 5,
    options: [
      {
        id: 'opt-a',
        text: 'I admire your work in distributed cloud platforms and strong engineering mentorship. As a fresher, I want to learn best architectural practices while contributing to high-impact user-facing products.',
        quality: 'optimal',
        points: 5,
        feedback: 'Excellent. Demonstrates specific knowledge of the firm, personal career aspirations, and readiness to contribute.'
      },
      {
        id: 'opt-b',
        text: 'I applied because your company visited our campus and the salary package offered is one of the highest in our placement drive.',
        quality: 'weak',
        points: 1,
        feedback: 'Too transactional. While compensation matters, recruiters seek candidates motivated by the actual work and mission.'
      },
      {
        id: 'opt-c',
        text: 'I need a job right after graduation to start paying back loans and gain experience before deciding on future higher studies.',
        quality: 'acceptable',
        points: 2,
        feedback: 'Honest, but focuses entirely on your personal constraints rather than what value you bring to the team.'
      },
      {
        id: 'opt-d',
        text: 'Any reputable software firm works for me since freshers do similar programming and bug fixing tasks anywhere.',
        quality: 'weak',
        points: 1,
        feedback: 'Shows indifference and lack of company research.'
      }
    ],
    correctOptionId: 'opt-a'
  },
  {
    id: 'hr-core-03',
    mode: 'core-interview',
    category: 'Strengths & Weaknesses',
    difficulty: 'Beginner',
    type: 'multiple-choice',
    question: 'What is your greatest strength, and how has it helped you in your technical projects?',
    recommendedFramework: 'Claim + Evidence + Outcome: State the trait, provide a specific project example, and explain the positive outcome.',
    interviewerIntent: 'Measures self-awareness, alignment with team needs, and whether you back claims with concrete proof.',
    idealTakeaway: 'Pair a soft skill (like adaptability or attention to detail) with a tangible engineering result.',
    hint: 'Choose a strength directly applicable to software teams, such as systematic debugging or proactive communication.',
    points: 5,
    options: [
      {
        id: 'opt-a',
        text: 'My greatest strength is systematic debugging and root-cause analysis. In my final year project, when our payment API failed intermittently, I used structured logging to trace a race condition, saving two days of guesswork.',
        quality: 'optimal',
        points: 5,
        feedback: 'Outstanding. Grounded in a concrete technical example with clear impact.'
      },
      {
        id: 'opt-b',
        text: 'I am a perfectionist who never makes mistakes in code and I always write 100% bug-free programs.',
        quality: 'weak',
        points: 1,
        feedback: 'Unrealistic. Claiming perfection signals lack of experience or inability to accept feedback.'
      },
      {
        id: 'opt-c',
        text: 'I am a very hard-working and friendly person who gets along with everyone in college.',
        quality: 'acceptable',
        points: 3,
        feedback: 'Pleasant, but generic. Lacks a concrete technical example showing real-world application.'
      },
      {
        id: 'opt-d',
        text: 'I can learn any programming language in two hours and code faster than all my classmates.',
        quality: 'weak',
        points: 1,
        feedback: 'Boastful and unlikely to convince an experienced technical interviewer.'
      }
    ],
    correctOptionId: 'opt-a'
  },
  {
    id: 'hr-core-04',
    mode: 'core-interview',
    category: 'Strengths & Weaknesses',
    difficulty: 'Intermediate',
    type: 'typed',
    question: 'What is one professional or technical weakness you have identified, and what active steps are you taking to improve it?',
    recommendedFramework: 'Acknowledge + Mitigation + Progress: State an authentic weakness (not a humblebrag), explain the remediation system, and show ongoing progress.',
    interviewerIntent: 'Tests maturity, humility, coachability, and self-directed professional improvement.',
    idealTakeaway: 'Avoid clichés like "I work too hard." Name a real developmental area (e.g. public speaking, estimating tasks, Docker) and detail your active improvement steps.',
    hint: 'Pick a real area (e.g., initial reluctance to ask for help when stuck), and explain the concrete mechanism you adopted to fix it.',
    points: 5,
    rubric: {
      keywords: ['weakness', 'improve', 'practice', 'steps', 'learning', 'feedback', 'habit', 'progress', 'action', 'better'],
      minWords: 30,
      targetWords: 65,
      structuralAspects: ['Honest non-fatal weakness', 'Concrete actions taken to improve', 'Demonstrated progress or current status'],
      starElements: {
        situationTask: 'Identified developmental gap during past academic work or internships',
        action: 'Specific courses, practices, or feedback loops adopted',
        result: 'Noticeable improvement in performance and confidence'
      }
    }
  },
  {
    id: 'hr-core-05',
    mode: 'core-interview',
    category: 'Teamwork & Collaboration',
    difficulty: 'Intermediate',
    type: 'multiple-choice',
    question: 'Describe a situation where a team member in a college group project was not contributing their assigned share of work. How did you handle it?',
    recommendedFramework: 'STAR Method: Explain the Situation, the Task/blocker, your constructive Action, and the collaborative Result.',
    interviewerIntent: 'Evaluates peer conflict handling, maturity, empathy, and whether you communicate proactively before escalating to professors or managers.',
    idealTakeaway: 'Demonstrate constructive one-on-one dialogue and discovering root causes before making harsh assumptions.',
    hint: 'Look for the choice that prioritizes direct, respectful 1-on-1 communication to solve the root problem collaboratively.',
    points: 5,
    options: [
      {
        id: 'opt-a',
        text: 'I reached out privately to understand if they were facing technical blockers or personal difficulties. It turned out they struggled with Git and backend APIs, so we paired on setup and redistributed sub-tasks, finishing the milestone on time.',
        quality: 'optimal',
        points: 5,
        feedback: 'Exemplary. Shows empathy, private communication, collaborative problem-solving, and milestone delivery.'
      },
      {
        id: 'opt-b',
        text: 'I immediately complained to our project guide and requested that their name be removed from the final submission report.',
        quality: 'weak',
        points: 1,
        feedback: 'Aggressive and premature. Bypasses peer communication and harms team trust.'
      },
      {
        id: 'opt-c',
        text: 'I silently did their entire portion myself late at night so our project grade wouldn’t suffer, without saying anything to them.',
        quality: 'acceptable',
        points: 2,
        feedback: 'Common in college, but leads to burnout and fails to address the team dynamic.'
      },
      {
        id: 'opt-d',
        text: 'I called them out in our group chat in front of everyone so public pressure would force them to start working.',
        quality: 'weak',
        points: 1,
        feedback: 'Creates toxic defensiveness and fractures team cohesion.'
      }
    ],
    correctOptionId: 'opt-a'
  },
  {
    id: 'hr-core-06',
    mode: 'core-interview',
    category: 'Conflict & Pressure',
    difficulty: 'Intermediate',
    type: 'typed',
    question: 'Tell me about a time you faced tight deadlines with conflicting priorities. How did you decide what to execute first?',
    recommendedFramework: 'STAR Method: Situation (competing tasks), Task (deliverables), Action (prioritization matrix & stakeholder communication), Result (outcomes).',
    interviewerIntent: 'Assesses time management, stress tolerance, communication under pressure, and pragmatic prioritization.',
    idealTakeaway: 'Highlight criteria for prioritization (urgency vs impact) and proactive communication with professors or stakeholders about realistic timelines.',
    hint: 'Mention how you broke down tasks, evaluated impact, and communicated adjustments with stakeholders.',
    points: 5,
    rubric: {
      keywords: ['deadline', 'priority', 'schedule', 'communicate', 'impact', 'tasks', 'breakdown', 'urgent', 'delivered', 'result'],
      minWords: 30,
      targetWords: 70,
      structuralAspects: ['Context of competing demands', 'Clear prioritization methodology', 'Communication with stakeholders', 'Final delivery outcome'],
      starElements: {
        situationTask: 'Multiple overlapping assignments, hackathons, or exams',
        action: 'Structured schedule, prioritization by impact, early stakeholder notice',
        result: 'Successfully met core deadlines without sacrificing quality'
      }
    }
  },
  {
    id: 'hr-core-07',
    mode: 'core-interview',
    category: 'Failure & Accountability',
    difficulty: 'Intermediate',
    type: 'multiple-choice',
    question: 'Tell me about a time you made a significant mistake or failed in an academic or technical project. What was the outcome?',
    recommendedFramework: 'Ownership + Action + Retrospective: Own the error immediately, explain how you corrected it, and share what systemic safeguard you implemented.',
    interviewerIntent: 'Measures honesty, psychological safety, emotional maturity, and the ability to learn from failure.',
    idealTakeaway: 'Never blame teammates or tools. Own the oversight, detail the immediate recovery, and highlight the preventive measure adopted.',
    hint: 'Look for the response that takes 100% personal accountability and installs a preventative measure (tests, backups, reviews).',
    points: 5,
    options: [
      {
        id: 'opt-a',
        text: 'During our hackathon demo, I pushed an unverified config file that broke our live database connection. I owned the error, rolled back the commit immediately, and after the event created automated pre-commit validation hooks to ensure it never happens again.',
        quality: 'optimal',
        points: 5,
        feedback: 'Superb. Immediate ownership, swift mitigation, and long-term systemic prevention.'
      },
      {
        id: 'opt-b',
        text: 'Our team failed because our lab internet disconnected and our teammate who was supposed to run the presentation fell ill.',
        quality: 'weak',
        points: 1,
        feedback: 'Deflective. Blaming external factors indicates unwillingness to take responsibility.'
      },
      {
        id: 'opt-c',
        text: 'I honestly cannot recall any significant mistakes because I am thorough with planning and testing.',
        quality: 'weak',
        points: 1,
        feedback: 'Inauthentic. Everyone makes mistakes; failing to share one suggests lack of self-awareness.'
      },
      {
        id: 'opt-d',
        text: 'I missed a project deadline because the professor gave unclear requirements and changed the rubric at the last minute.',
        quality: 'acceptable',
        points: 2,
        feedback: 'Focuses on external blame rather than proactive clarification and contingency planning.'
      }
    ],
    correctOptionId: 'opt-a'
  },
  {
    id: 'hr-core-08',
    mode: 'core-interview',
    category: 'Adaptability & Learning',
    difficulty: 'Beginner',
    type: 'typed',
    question: 'How do you approach learning a completely new programming language or framework when required for a project on short notice?',
    recommendedFramework: 'Systematic Learning Process: Official documentation -> Minimal proof-of-concept build -> Hands-on debugging -> Seeking peer feedback.',
    interviewerIntent: 'Assesses learning agility, resourcefulness, and self-sufficiency in a rapidly evolving tech stack.',
    idealTakeaway: 'Show a structured methodology: read docs, build a small prototype, inspect real-world open-source code, and ask informed questions.',
    hint: 'Explain your 3-step learning approach: understanding syntax/conventions, building a minimal prototype, and iterative refinement.',
    points: 5,
    rubric: {
      keywords: ['documentation', 'prototype', 'practice', 'build', 'learn', 'concepts', 'hands-on', 'debug', 'quick', 'framework'],
      minWords: 30,
      targetWords: 65,
      structuralAspects: ['Methodical approach to resources', 'Hands-on project/prototype building', 'Validation and deepening knowledge'],
      starElements: {
        situationTask: 'Encountering an unfamiliar framework or language',
        action: 'Deep-dive into official docs, scaffold minimal prototype, resolve errors',
        result: 'Rapid functional competence to contribute to project'
      }
    }
  },
  {
    id: 'hr-core-09',
    mode: 'core-interview',
    category: 'Leadership & Initiative',
    difficulty: 'Intermediate',
    type: 'multiple-choice',
    question: 'Describe a time when you took the initiative on a project without waiting to be told what to do.',
    recommendedFramework: 'Observation + Independent Action + Team Value: Identify an unaddressed bottleneck, initiate a solution, and measure team benefit.',
    interviewerIntent: 'Tests for proactivity, ownership mentality, and whether you solve problems before being prompted.',
    idealTakeaway: 'Frame initiative around improving developer productivity, fixing technical debt, or clarifying project ambiguity.',
    hint: 'Look for proactivity that benefited the entire team or project rather than solitary action for self-glory.',
    points: 5,
    options: [
      {
        id: 'opt-a',
        text: 'I noticed our capstone team spent hours manually setting up database schemas locally. Without being asked, I wrote a Docker Compose file and a seeding script, reducing onboarding time for teammates from half a day to five minutes.',
        quality: 'optimal',
        points: 5,
        feedback: 'Perfect demonstration of engineering initiative, empathy for teammates, and quantifiable productivity gain.'
      },
      {
        id: 'opt-b',
        text: 'I rewrote our entire project architecture in a new trendy language over the weekend without discussing it with my team.',
        quality: 'weak',
        points: 1,
        feedback: 'Dangerous rogue behavior that disrupts team velocity and consensus.'
      },
      {
        id: 'opt-c',
        text: 'I always wait for clear tasks from our team lead because doing things on my own might violate project guidelines.',
        quality: 'acceptable',
        points: 2,
        feedback: 'Shows respect for rules, but completely lacks initiative and creative problem-solving.'
      },
      {
        id: 'opt-d',
        text: 'I told everyone in the group what their responsibilities should be so I could act as the leader.',
        quality: 'weak',
        points: 2,
        feedback: 'Equates leadership with assigning orders rather than solving tangible problems.'
      }
    ],
    correctOptionId: 'opt-a'
  },
  {
    id: 'hr-core-10',
    mode: 'core-interview',
    category: 'Difficult HR & Salary',
    difficulty: 'Intermediate',
    type: 'multiple-choice',
    question: 'Where do you see yourself professionally in three to five years?',
    recommendedFramework: 'Technical Depth + Team Impact + Continuous Learning: Mastering engineering fundamentals, taking architectural ownership, and mentoring newer developers.',
    interviewerIntent: 'Checks commitment, ambition, realistic expectations, and whether you see a long-term growth runway with their engineering team.',
    idealTakeaway: 'Express desire to grow from a guided fresher into an autonomous engineer who designs reliable features and mentors junior peers.',
    hint: 'Emphasize technical mastery, taking ownership of larger systems, and contributing to engineering culture.',
    points: 5,
    options: [
      {
        id: 'opt-a',
        text: 'In 3 to 5 years, I aim to have deep domain expertise in scalable backend systems, taking ownership of complex architectural modules, and actively mentoring newer joiners while contributing to product innovation.',
        quality: 'optimal',
        points: 5,
        feedback: 'Excellent. Balances technical mastery, leadership readiness, and realistic engineering progression.'
      },
      {
        id: 'opt-b',
        text: 'I see myself as the Chief Technology Officer or Senior Director managing the entire department.',
        quality: 'weak',
        points: 1,
        feedback: 'Overly unrealistic for a 3-year timeline for an entry-level candidate.'
      },
      {
        id: 'opt-c',
        text: 'I hope to leave software development after two years to pursue an MBA or start my own company.',
        quality: 'acceptable',
        points: 2,
        feedback: 'Honest about personal ambitions, but signals immediate turnover to a company investing in your training.'
      },
      {
        id: 'opt-d',
        text: 'I haven’t thought about the future yet; I just want to clear campus placements and take whatever comes.',
        quality: 'weak',
        points: 1,
        feedback: 'Shows lack of ambition and career intentionality.'
      }
    ],
    correctOptionId: 'opt-a'
  },
  {
    id: 'hr-core-11',
    mode: 'core-interview',
    category: 'Ethics & Integrity',
    difficulty: 'Advanced',
    type: 'multiple-choice',
    question: 'What would you do if a team lead pressured you to skip automated testing and bypass security reviews to meet a commercial launch deadline?',
    recommendedFramework: 'Respectful Dissent + Risk Communication + Pragmatic Compromise: Highlight the vulnerability, articulate customer/business risk, and propose a phased release.',
    interviewerIntent: 'Assesses moral courage, engineering integrity, constructive pushback, and risk mitigation under commercial pressure.',
    idealTakeaway: 'Never blindly obey commands that compromise customer security. Proactively communicate risks and propose safer alternatives (like releasing an MVP with critical tests).',
    hint: 'Look for respectful, evidence-based communication that highlights business and user risks while proposing a safe alternative.',
    points: 5,
    options: [
      {
        id: 'opt-a',
        text: 'I would respectfully highlight the specific security and stability risks to the lead in writing, and propose a pragmatic compromise: deploy a reduced-scope feature set that passes all critical security and automated test suites on time.',
        quality: 'optimal',
        points: 5,
        feedback: 'Outstanding. Demonstrates ethical integrity, business acumen, risk communication, and solution orientation.'
      },
      {
        id: 'opt-b',
        text: 'I would do whatever the lead tells me without question because they are senior and bear the final responsibility.',
        quality: 'weak',
        points: 1,
        feedback: 'Abdication of engineering responsibility. Professional ethics require raising valid risks.'
      },
      {
        id: 'opt-c',
        text: 'I would immediately report the lead to Human Resources and the CEO for unethical conduct.',
        quality: 'weak',
        points: 2,
        feedback: 'Overly confrontational escalation without first having a professional technical discussion with the lead.'
      },
      {
        id: 'opt-d',
        text: 'I would pretend to run the tests and alter the test results so the pipeline turns green.',
        quality: 'weak',
        points: 0,
        feedback: 'Unacceptable dishonesty that could cause catastrophic production failures and legal liability.'
      }
    ],
    correctOptionId: 'opt-a'
  },
  {
    id: 'hr-core-12',
    mode: 'core-interview',
    category: 'Introduction & Motivation',
    difficulty: 'Beginner',
    type: 'multiple-choice',
    question: 'At the end of the HR round, the interviewer asks: "Do you have any questions for us?" What is the most effective approach?',
    recommendedFramework: 'Engagement & Curiosity: Ask thoughtful questions regarding team dynamics, onboarding expectations, or technical challenges.',
    interviewerIntent: 'Evaluates intellectual curiosity, genuine engagement, and whether you evaluate the company as much as they evaluate you.',
    idealTakeaway: 'Always prepare 2–3 thoughtful questions about engineering culture, challenges in production, or expectations for the first 90 days.',
    hint: 'Avoid asking only about vacation time or salary; ask about engineering mentorship, team challenges, or performance expectations.',
    points: 5,
    options: [
      {
        id: 'opt-a',
        text: 'Ask: "What does success look like for a fresher in this role in the first 90 days, and what are the key technical challenges your engineering team is currently solving?"',
        quality: 'optimal',
        points: 5,
        feedback: 'Top tier. Shows forward-looking ambition, desire to succeed, and technical engagement.'
      },
      {
        id: 'opt-b',
        text: 'Say: "No, I don’t have any questions, you covered everything."',
        quality: 'weak',
        points: 2,
        feedback: 'Missed opportunity. Signals passivity or lack of deep interest in the role.'
      },
      {
        id: 'opt-c',
        text: 'Ask: "How many casual leaves do freshers get and how strictly do you monitor attendance and working hours?"',
        quality: 'weak',
        points: 1,
        feedback: 'Premature and leaves a poor impression focusing on working the least amount possible.'
      },
      {
        id: 'opt-d',
        text: 'Ask: "Can you guarantee that I will get a promotion and salary increase at the end of my first year?"',
        quality: 'weak',
        points: 1,
        feedback: 'Entitled and displays misunderstanding of performance-based promotion cycles.'
      }
    ],
    correctOptionId: 'opt-a'
  },
  {
    id: 'hr-core-13',
    mode: 'core-interview',
    category: 'Conflict & Pressure',
    difficulty: 'Intermediate',
    type: 'typed',
    question: 'Describe a situation where you received harsh or critical feedback on your code or project presentation. How did you process and react to it?',
    recommendedFramework: 'Emotional Regulation + Active Listening + Actionable Synthesis: Separate self-worth from work product, ask clarifying questions, and implement improvements.',
    interviewerIntent: 'Assesses coachability, ego management, resilience, and receptiveness to code reviews.',
    idealTakeaway: 'Demonstrate that you view code reviews and feedback as growth opportunities rather than personal attacks.',
    hint: 'Highlight how you paused, absorbed the critique objectively, asked clarifying questions, and iterated on the deliverables.',
    points: 5,
    rubric: {
      keywords: ['feedback', 'critique', 'listen', 'improve', 'learn', 'code review', 'action', 'iterate', 'appreciate', 'grow'],
      minWords: 30,
      targetWords: 65,
      structuralAspects: ['Context of critique received', 'Initial mental processing and emotional composure', 'Concrete improvements implemented'],
      starElements: {
        situationTask: 'Critical code review or project feedback received',
        action: 'Listened actively without defensiveness, asked for concrete guidance',
        result: 'Enhanced code quality and strengthened professional relationship with reviewer'
      }
    }
  },
  {
    id: 'hr-core-14',
    mode: 'core-interview',
    category: 'Teamwork & Collaboration',
    difficulty: 'Beginner',
    type: 'multiple-choice',
    question: 'Do you prefer working independently or in a team environment?',
    recommendedFramework: 'Balanced Collaborative Contributor: Value team synergy for ideation and collective impact while maintaining focus for autonomous execution.',
    interviewerIntent: 'Assesses whether you can balance deep individual work with collaborative cross-functional teamwork.',
    idealTakeaway: 'Avoid stating an extreme (only alone or only in groups). Successful engineers brainstorm and align with teams, then execute focused modules independently.',
    hint: 'Showcase that you thrive in collaborative problem-solving while being self-reliant on deep coding tasks.',
    points: 5,
    options: [
      {
        id: 'opt-a',
        text: 'I value both. I enjoy collaborating with teammates to brainstorm architectures, conduct code reviews, and align on goals, but I am also comfortable executing focused coding modules independently with high ownership.',
        quality: 'optimal',
        points: 5,
        feedback: 'Balanced and mature. Reflects how modern agile software teams operate.'
      },
      {
        id: 'opt-b',
        text: 'I only work alone because teammates usually slow me down and introduce bugs into my code.',
        quality: 'weak',
        points: 1,
        feedback: 'Major red flag. Software engineering is a team sport; arrogant lone wolves disrupt organizations.'
      },
      {
        id: 'opt-c',
        text: 'I can only work if someone is sitting with me and guiding me step-by-step through every assignment.',
        quality: 'weak',
        points: 1,
        feedback: 'Signals excessive dependence and inability to function independently.'
      },
      {
        id: 'opt-d',
        text: 'Either is fine, I have no preference whatsoever.',
        quality: 'acceptable',
        points: 2,
        feedback: 'Too brief and passive; misses the chance to describe your collaborative working style.'
      }
    ],
    correctOptionId: 'opt-a'
  },
  {
    id: 'hr-core-15',
    mode: 'core-interview',
    category: 'Failure & Accountability',
    difficulty: 'Advanced',
    type: 'multiple-choice',
    question: 'What would you do if you realized you could not meet a promised feature deadline two days before the scheduled release?',
    recommendedFramework: 'Early Transparency + Impact Analysis + Mitigation Options: Alert the team lead immediately with status, remaining tasks, and options (scope cut vs date move).',
    interviewerIntent: 'Checks if you hide problems until the deadline or communicate proactively so the team can adjust.',
    idealTakeaway: 'In engineering, unexpected blockers happen. The cardinal sin is hiding it until the eleventh hour. Early escalation empowers the team.',
    hint: 'Never wait until deadline day. Early communication allows leadership to descope, reassign help, or manage stakeholder expectations.',
    points: 5,
    options: [
      {
        id: 'opt-a',
        text: 'I would immediately inform my team lead with a clear breakdown of completed work, remaining blockers, and proposed options (such as shipping a stable core feature now or pairing with a peer to complete the full scope).',
        quality: 'optimal',
        points: 5,
        feedback: 'Flawless professionalism. Early transparency and presenting actionable options to leadership.'
      },
      {
        id: 'opt-b',
        text: 'I would stay silent, work 48 hours without sleep, and hope that I finish in time without anyone noticing.',
        quality: 'acceptable',
        points: 2,
        feedback: 'Heroic but unsustainable. If you still fail at hour 47, the team has zero runway to react.'
      },
      {
        id: 'opt-c',
        text: 'I would wait until the deadline presentation and explain to the manager that the timeline was unrealistic from the beginning.',
        quality: 'weak',
        points: 1,
        feedback: 'Blindsides the team and looks like an excuse after the failure occurred.'
      },
      {
        id: 'opt-d',
        text: 'I would deploy whatever incomplete code I have and mark the Jira ticket as finished.',
        quality: 'weak',
        points: 0,
        feedback: 'Direct violation of engineering ethics that could corrupt production builds.'
      }
    ],
    correctOptionId: 'opt-a'
  },
  {
    id: 'hr-core-16',
    mode: 'core-interview',
    category: 'Difficult HR & Salary',
    difficulty: 'Beginner',
    type: 'multiple-choice',
    question: 'Are you willing to relocate to a different city or work in rotational shifts if required by the company?',
    recommendedFramework: 'Honest Availability with Positive Adaptability: Affirm flexibility while communicating any genuine physical constraints.',
    interviewerIntent: 'Checks operational flexibility and whether hiring you matches project location/timing requirements.',
    idealTakeaway: 'If you are genuinely open to relocating, confirm enthusiastically as an opportunity to explore new tech hubs.',
    hint: 'State your willingness to adapt to company location needs while demonstrating enthusiastic readiness.',
    points: 5,
    options: [
      {
        id: 'opt-a',
        text: 'Yes, I am fully open to relocating and adapting to project shift requirements. As a fresher starting my career, immersing myself in a premier engineering hub is an exciting opportunity for professional growth.',
        quality: 'optimal',
        points: 5,
        feedback: 'Clear, affirmative, and displays energetic commitment to the role.'
      },
      {
        id: 'opt-b',
        text: 'I will only work from my home city and will immediately resign if asked to relocate.',
        quality: 'weak',
        points: 1,
        feedback: 'Inflexible and confrontational.'
      },
      {
        id: 'opt-c',
        text: 'I will say yes right now to get the offer letter, but I will negotiate remote work later after joining.',
        quality: 'weak',
        points: 0,
        feedback: 'Deceptive strategy that leads to revoked offers and damaged reputation.'
      },
      {
        id: 'opt-d',
        text: 'I prefer my current city, but I am willing to discuss relocation depending on project needs and company accommodation assistance.',
        quality: 'acceptable',
        points: 4,
        feedback: 'Balanced and honest if you have specific family or medical considerations.'
      }
    ],
    correctOptionId: 'opt-a'
  },
  {
    id: 'hr-core-17',
    mode: 'core-interview',
    category: 'Introduction & Motivation',
    difficulty: 'Intermediate',
    type: 'typed',
    question: 'Why should we hire you over other candidates from your college batch with similar grades and technical skills?',
    recommendedFramework: 'Unique Value Proposition: Technical capability + High ownership + Fast learning velocity + Cultural contribution.',
    interviewerIntent: 'Gauges self-confidence without arrogance and whether you can articulate what distinguishes your work ethic and attitude.',
    idealTakeaway: 'Focus on your consistency, debugging grit, end-to-end project completion, and enthusiasm to contribute from day one.',
    hint: 'Do not demean peers. Focus on your unique blend of disciplined execution, quick learning, and reliable collaboration.',
    points: 5,
    rubric: {
      keywords: ['ownership', 'consistent', 'learn', 'problem-solving', 'reliable', 'projects', 'dedication', 'team', 'adaptable', 'contribute'],
      minWords: 30,
      targetWords: 65,
      structuralAspects: ['Respectful acknowledgment of peers', 'Articulation of personal differentiators', 'Focus on value delivery for the team'],
      starElements: {
        situationTask: 'Differentiating yourself in a competitive recruitment drive',
        action: 'Highlighting proven consistency in completing end-to-end projects and debugging resilience',
        result: 'Assuring rapid onboarding and positive contribution to the team'
      }
    }
  },
  {
    id: 'hr-core-18',
    mode: 'core-interview',
    category: 'Ethics & Integrity',
    difficulty: 'Beginner',
    type: 'multiple-choice',
    question: 'While testing a feature on your local machine, you notice an unrelated bug in another teammate’s module that causes rare data loss. It is not your responsibility. What do you do?',
    recommendedFramework: 'Collective Ownership: Software quality is a team responsibility; document the bug constructively and notify the owner.',
    interviewerIntent: 'Assesses whether you practice collective code ownership or say "not my job".',
    idealTakeaway: 'Great engineers care about the product as a whole. Document the reproduction steps and share it constructively with the author.',
    hint: 'Prioritize product safety and collegial collaboration over rigid silos.',
    points: 5,
    options: [
      {
        id: 'opt-a',
        text: 'I would document the exact reproduction steps, logs, and potential data risk, and privately share them with the teammate in a helpful manner, offering to assist if needed to ensure the release remains secure.',
        quality: 'optimal',
        points: 5,
        feedback: 'Exemplifies collective code ownership and collegial collaboration.'
      },
      {
        id: 'opt-b',
        text: 'I would ignore it completely because it is not in my Jira sprint tasks and I am not paid to fix other people’s code.',
        quality: 'weak',
        points: 1,
        feedback: 'Siloed mentality that leads to buggy products and cultural friction.'
      },
      {
        id: 'opt-c',
        text: 'I would announce the bug in a company-wide email to expose the teammate’s poor coding skills.',
        quality: 'weak',
        points: 0,
        feedback: 'Destructive, hostile, and toxic behavior.'
      },
      {
        id: 'opt-d',
        text: 'I would secretly fix it in their codebase without telling them anything.',
        quality: 'acceptable',
        points: 2,
        feedback: 'Good intention, but editing someone’s branch without notice can overwrite work and prevent them from learning.'
      }
    ],
    correctOptionId: 'opt-a'
  },
  {
    id: 'hr-core-19',
    mode: 'core-interview',
    category: 'Conflict & Pressure',
    difficulty: 'Advanced',
    type: 'typed',
    question: 'Describe an instance where you had a strong technical disagreement with a peer regarding architectural design or tool choice. How did you resolve it?',
    recommendedFramework: 'STAR Method: Focus on objective benchmarks, trade-off analysis, data-driven prototyping, and disagree-and-commit.',
    interviewerIntent: 'Evaluates your ability to debate ideas constructively without letting ego interfere with engineering consensus.',
    idealTakeaway: 'Explain how you benchmarked trade-offs, built small prototypes, compared data, and aligned on the best team outcome.',
    hint: 'Focus on objective evaluation (pros/cons, metrics, benchmarks) rather than personal opinion or emotional debates.',
    points: 5,
    rubric: {
      keywords: ['disagree', 'technical', 'trade-offs', 'benchmark', 'data', 'prototype', 'consensus', 'respectful', 'decision', 'result'],
      minWords: 30,
      targetWords: 70,
      structuralAspects: ['Nature of technical dispute', 'Objective evaluation framework used', 'Resolution and commitment to consensus'],
      starElements: {
        situationTask: 'Differing technical approaches in an academic or hackathon build',
        action: 'Compared empirical trade-offs, ran small benchmark, or consulted mentor',
        result: 'Unified team decision delivered on schedule'
      }
    }
  },
  {
    id: 'hr-core-20',
    mode: 'core-interview',
    category: 'Difficult HR & Salary',
    difficulty: 'Intermediate',
    type: 'multiple-choice',
    question: 'What are your salary expectations for this software engineering role as a campus fresher?',
    recommendedFramework: 'Benchmark-Aligned & Value-Focused: State that you expect compensation aligned with industry standards and company campus bands, prioritizing growth and contribution.',
    interviewerIntent: 'Checks if you have realistic expectations, understand campus placement norms, and focus on career runway.',
    idealTakeaway: 'For campus drives with standardized packages, express alignment with company salary bands while emphasizing dedication to learning.',
    hint: 'Acknowledge company campus standards while highlighting that career growth, learning, and contribution are your core focus.',
    points: 5,
    options: [
      {
        id: 'opt-a',
        text: 'As a fresher, my primary priority is to join an organization where I can build strong engineering fundamentals and create value. I understand the company has standardized campus compensation bands for entry-level roles, and I am confident the package offered will be fair and commensurate with the industry.',
        quality: 'optimal',
        points: 5,
        feedback: 'Professional, articulate, and well-aligned with campus recruitment norms.'
      },
      {
        id: 'opt-b',
        text: 'I expect at least twice the campus average because I believe my coding abilities are superior to everyone else.',
        quality: 'weak',
        points: 1,
        feedback: 'Comes across as unrealistic and ungrounded.'
      },
      {
        id: 'opt-c',
        text: 'I don’t care about salary at all; you can pay me zero or below minimum wage as long as I get experience.',
        quality: 'weak',
        points: 1,
        feedback: 'Devalues yourself and sounds inauthentic to recruiters.'
      },
      {
        id: 'opt-d',
        text: 'Give me your maximum budget, otherwise I will wait for another company on day 2.',
        quality: 'weak',
        points: 1,
        feedback: 'Aggressive and inappropriate for an entry-level interview.'
      }
    ],
    correctOptionId: 'opt-a'
  },
  {
    id: 'hr-core-21',
    mode: 'core-interview',
    category: 'Adaptability & Learning',
    difficulty: 'Intermediate',
    type: 'multiple-choice',
    question: 'How do you handle repetitive or mundane tasks (like writing documentation, writing unit tests, or fixing small bug tickets)?',
    recommendedFramework: 'Professionalism & Automation: Recognize testing/docs as critical to software engineering excellence and explore opportunities for automation.',
    interviewerIntent: 'Checks if you have a romanticized view of coding or understand that software engineering requires thorough testing and documentation.',
    idealTakeaway: 'Explain that tests and docs protect software quality, and that routine workflows can often be automated with scripts or pre-commit hooks.',
    hint: 'Emphasize that documentation and testing are vital parts of production quality, not just "chores".',
    points: 5,
    options: [
      {
        id: 'opt-a',
        text: 'I view tests and documentation as essential components of reliable engineering, not secondary chores. Well-written tests prevent regressions, and clear docs ensure maintainability. Where appropriate, I also look for ways to automate repetitive checks using scripts.',
        quality: 'optimal',
        points: 5,
        feedback: 'Superb mindset. Demonstrates high engineering maturity and craftsmanship.'
      },
      {
        id: 'opt-b',
        text: 'I hate documentation and unit testing; I am an architect who only wants to write novel machine learning algorithms.',
        quality: 'weak',
        points: 1,
        feedback: 'Major red flag for engineering managers who depend on reliable tests and maintainability.'
      },
      {
        id: 'opt-c',
        text: 'I will write tests only if the manager threatens to withhold my salary.',
        quality: 'weak',
        points: 0,
        feedback: 'Completely unprofessional attitude.'
      },
      {
        id: 'opt-d',
        text: 'I do them as quickly as possible without checking if they work just to clear my backlog tickets.',
        quality: 'weak',
        points: 1,
        feedback: 'Prioritizes speed over quality, introducing technical debt.'
      }
    ],
    correctOptionId: 'opt-a'
  },
  {
    id: 'hr-core-22',
    mode: 'core-interview',
    category: 'Leadership & Initiative',
    difficulty: 'Advanced',
    type: 'typed',
    question: 'Can you describe an extracurricular activity, club, or hackathon where you took on leadership or organizational responsibility?',
    recommendedFramework: 'STAR Method: Context -> Goal -> Personal Organization Action -> Measurable Impact on Participants/Team.',
    interviewerIntent: 'Evaluates team management, communication, planning under pressure, and interpersonal initiative beyond coursework.',
    idealTakeaway: 'Highlight how you organized timelines, motivated peers, handled unexpected hurdles, and achieved a positive group outcome.',
    hint: 'Describe your role in organizing an event, leading a hackathon team, or coordinating a technical workshop.',
    points: 5,
    rubric: {
      keywords: ['lead', 'organized', 'event', 'team', 'hackathon', 'coordinate', 'initiative', 'students', 'managed', 'impact'],
      minWords: 30,
      targetWords: 70,
      structuralAspects: ['Clear role and goal definition', 'Actions taken to coordinate people and resources', 'Tangible event or project outcome'],
      starElements: {
        situationTask: 'College club event, coding competition, or hackathon coordination',
        action: 'Defined responsibilities, managed logistical blockers, facilitated team synergy',
        result: 'Successful execution with measurable participation and positive feedback'
      }
    }
  },
  {
    id: 'hr-core-23',
    mode: 'core-interview',
    category: 'Teamwork & Collaboration',
    difficulty: 'Intermediate',
    type: 'multiple-choice',
    question: 'How do you handle working with someone whose personality or communication style is very different from yours?',
    recommendedFramework: 'Empathy & Professional Alignment: Focus on shared objectives, respect communication preferences, and maintain emotional neutrality.',
    interviewerIntent: 'Measures emotional intelligence and whether you can collaborate with diverse personalities across global corporate teams.',
    idealTakeaway: 'Focus on the shared goal and adapt communication formats (e.g. detailed written specs vs brief sync calls) according to team needs.',
    hint: 'Focus on shared professional goals and adapting your communication channel to bridge stylistic differences.',
    points: 5,
    options: [
      {
        id: 'opt-a',
        text: 'I focus on our shared project deliverables and adapt to their communication preferences. For example, if they prefer asynchronous written documentation over verbal meetings, I provide detailed task notes to keep collaboration frictionless.',
        quality: 'optimal',
        points: 5,
        feedback: 'Demonstrates high emotional intelligence, empathy, and professional adaptability.'
      },
      {
        id: 'opt-b',
        text: 'I avoid talking to them and only interact through formal complaints to management.',
        quality: 'weak',
        points: 1,
        feedback: 'Toxic and immature avoidance behavior.'
      },
      {
        id: 'opt-c',
        text: 'I demand that they change their communication style to match mine.',
        quality: 'weak',
        points: 1,
        feedback: 'Rigid and shows lack of interpersonal flexibility.'
      },
      {
        id: 'opt-d',
        text: 'I talk behind their back with other teammates to vent my frustration.',
        quality: 'weak',
        points: 0,
        feedback: 'Destructive office politics that ruins team morale.'
      }
    ],
    correctOptionId: 'opt-a'
  },
  {
    id: 'hr-core-24',
    mode: 'core-interview',
    category: 'Introduction & Motivation',
    difficulty: 'Beginner',
    type: 'multiple-choice',
    question: 'How do you stay updated with rapid technological advancements and software industry trends?',
    recommendedFramework: 'Curated Continuous Learning: Tech blogs, open-source repositories, engineering podcasts, personal sandbox builds.',
    interviewerIntent: 'Tests curiosity, self-motivation, and whether your interest in tech extends beyond classroom exams.',
    idealTakeaway: 'Mention specific resources (e.g. Hacker News, GitHub Trending, tech newsletters, building weekend prototypes).',
    hint: 'Name specific developer communities, publications, or practical sandbox experiments you engage with.',
    points: 5,
    options: [
      {
        id: 'opt-a',
        text: 'I read engineering blogs from tech companies, follow GitHub trending repositories, and test emerging tools by building small weekend proof-of-concept apps to see how they function in practice.',
        quality: 'optimal',
        points: 5,
        feedback: 'Practical and authentic. Combines reading with hands-on experimentation.'
      },
      {
        id: 'opt-b',
        text: 'I only read my college textbooks the night before the university exam.',
        quality: 'weak',
        points: 1,
        feedback: 'Textbooks are often outdated; shows zero curiosity beyond minimum exam passing.'
      },
      {
        id: 'opt-c',
        text: 'I scroll social media reels about tech influencers predicting what technologies will die.',
        quality: 'acceptable',
        points: 2,
        feedback: 'Surface-level engagement; lacks depth and hands-on coding verification.'
      },
      {
        id: 'opt-d',
        text: 'Once I graduate, I don’t believe I need to learn anything new.',
        quality: 'weak',
        points: 0,
        feedback: 'Fatal mindset for a career in software engineering.'
      }
    ],
    correctOptionId: 'opt-a'
  },
  {
    id: 'hr-core-25',
    mode: 'core-interview',
    category: 'Strengths & Weaknesses',
    difficulty: 'Beginner',
    type: 'typed',
    question: 'How do you manage stress and maintain focus during intense periods like final exams, hackathons, or project release crunch times?',
    recommendedFramework: 'Self-Regulation & Structured Routine: Prioritization -> Time-boxing -> Healthy boundaries -> Resetting focus.',
    interviewerIntent: 'Assesses burnout management, emotional stability, and operational stamina under corporate pressure.',
    idealTakeaway: 'Explain realistic habits: breaking work into micro-goals, taking brief physical/mental breaks, and maintaining a calm, systematic cadence.',
    hint: 'Discuss how you organize tasks into manageable chunks and use healthy habits to sustain mental clarity.',
    points: 5,
    rubric: {
      keywords: ['stress', 'focus', 'schedule', 'break', 'prioritize', 'calm', 'balance', 'healthy', 'mindset', 'manage'],
      minWords: 25,
      targetWords: 60,
      structuralAspects: ['Identification of stress triggers', 'Proactive organizational mechanisms', 'Mental/physical recovery habits'],
      starElements: {
        situationTask: 'High-pressure academic or project crunch period',
        action: 'Structured time-boxing, focusing on one task at a time, regular brief resets',
        result: 'Consistent delivery with sustained mental well-being'
      }
    }
  },

  // ==========================================
  // MODE B: RAPID FIRE HR (26-45)
  // ==========================================
  {
    id: 'hr-rapid-26',
    mode: 'rapid-fire',
    category: 'Introduction & Motivation',
    difficulty: 'Beginner',
    type: 'multiple-choice',
    question: 'Describe your engineering mindset in three words.',
    recommendedFramework: 'Punchy & Authentic: Combine curiosity, rigor, and user/business impact.',
    interviewerIntent: 'Tests spontaneity, self-awareness, and concise communication.',
    idealTakeaway: 'Pick words that capture continuous learning, reliability, and analytical problem-solving.',
    hint: 'Focus on words that balance intellectual curiosity with dependable execution.',
    points: 5,
    timeLimitSeconds: 20,
    options: [
      { id: 'opt-a', text: 'Curious, Analytical, Resilient', quality: 'optimal', points: 5, feedback: 'Strong, balanced, and highly relevant to software engineering.' },
      { id: 'opt-b', text: 'Rich, Famous, Fast', quality: 'weak', points: 1, feedback: 'Superficial and disconnected from engineering excellence.' },
      { id: 'opt-c', text: 'Hardworking, Friendly, Nice', quality: 'acceptable', points: 3, feedback: 'Pleasant, but generic.' },
      { id: 'opt-d', text: 'Unstoppable Coding Genius', quality: 'weak', points: 1, feedback: 'Arrogant.' }
    ],
    correctOptionId: 'opt-a'
  },
  {
    id: 'hr-rapid-27',
    mode: 'rapid-fire',
    category: 'Failure & Accountability',
    difficulty: 'Beginner',
    type: 'multiple-choice',
    question: 'You push code that breaks staging 10 minutes before an executive demo. First reaction?',
    recommendedFramework: 'Immediate Mitigation First: Revert the commit immediately, alert the team, then debug offline.',
    interviewerIntent: 'Tests crisis management and whether you panic, hide, or stabilize the environment first.',
    idealTakeaway: 'Revert to known green build first. Diagnostics happen after staging is stable.',
    hint: 'Safety and uptime come first. Revert immediately before investigating the root cause.',
    points: 5,
    timeLimitSeconds: 20,
    options: [
      { id: 'opt-a', text: 'Immediately roll back to the last stable commit, post a quick note in the team channel, then investigate root cause locally.', quality: 'optimal', points: 5, feedback: 'Exact right move. Stabilize first, communicate, then diagnose.' },
      { id: 'opt-b', text: 'Panic, log off Slack, and pretend you did not touch the repository.', quality: 'weak', points: 0, feedback: 'Completely unacceptable.' },
      { id: 'opt-c', text: 'Keep editing files directly on the server hoping it fixes itself before the demo.', quality: 'weak', points: 1, feedback: 'Cowboy coding under pressure compounds outages.' },
      { id: 'opt-d', text: 'Blame the DevOps engineer for not configuring an automated rollback.', quality: 'weak', points: 1, feedback: 'Deflective.' }
    ],
    correctOptionId: 'opt-a'
  },
  {
    id: 'hr-rapid-28',
    mode: 'rapid-fire',
    category: 'Teamwork & Collaboration',
    difficulty: 'Beginner',
    type: 'multiple-choice',
    question: 'A teammate presents an idea during a design sprint that you believe will fail. How do you respond?',
    recommendedFramework: 'Curious Inquiry + Constructive Inquiry: Ask questions about edge cases rather than shooting it down.',
    interviewerIntent: 'Measures constructive feedback and psychological safety in technical brainstorming.',
    idealTakeaway: 'Ask exploratory questions: "How would this handle high concurrency or edge case X?"',
    hint: 'Use thoughtful questions to explore limitations collaboratively rather than attacking the person.',
    points: 5,
    timeLimitSeconds: 25,
    options: [
      { id: 'opt-a', text: 'Ask clarifying questions: "I like the goal. How would this architecture handle edge cases like high traffic or database timeouts?"', quality: 'optimal', points: 5, feedback: 'Respectful, collaborative, and focuses on technical merit.' },
      { id: 'opt-b', text: 'Laugh and tell everyone that it is the worst idea you have ever heard.', quality: 'weak', points: 0, feedback: 'Disrespectful and destroys team psychological safety.' },
      { id: 'opt-c', text: 'Stay completely silent and let the idea fail in production so they learn a lesson.', quality: 'weak', points: 1, feedback: 'Passive-aggressive and harms the business.' },
      { id: 'opt-d', text: 'Interrupt them immediately and present your own idea instead.', quality: 'weak', points: 1, feedback: 'Rude and disregards team input.' }
    ],
    correctOptionId: 'opt-a'
  },
  {
    id: 'hr-rapid-29',
    mode: 'rapid-fire',
    category: 'Adaptability & Learning',
    difficulty: 'Beginner',
    type: 'multiple-choice',
    question: 'How long do you debug a roadblock before reaching out to a senior engineer for guidance?',
    recommendedFramework: 'Time-Boxed Exploration: Try for 30–60 minutes with logs and docs, then ask with a concise summary of what you tried.',
    interviewerIntent: 'Checks if you get stuck for days silently or interrupt teammates every two minutes.',
    idealTakeaway: 'Time-box your independent effort (e.g., 45 minutes), document what you attempted, then ask targeted questions.',
    hint: 'Look for the balanced approach: attempt structured debugging first, then ask with specific findings.',
    points: 5,
    timeLimitSeconds: 25,
    options: [
      { id: 'opt-a', text: 'I time-box independent debugging to 45–60 minutes, gather logs and attempted solutions, and then ask with a structured summary.', quality: 'optimal', points: 5, feedback: 'Standard engineering best practice. Respects senior time while ensuring progress.' },
      { id: 'opt-b', text: 'I never ask anyone for help even if I am stuck for two weeks.', quality: 'weak', points: 1, feedback: 'Causes massive sprint delays.' },
      { id: 'opt-c', text: 'The second I see an error message, I immediately ping my senior to solve it for me.', quality: 'weak', points: 1, feedback: 'Shows zero self-reliance and drains senior productivity.' },
      { id: 'opt-d', text: 'I delete the feature and pretend it was not necessary.', quality: 'weak', points: 0, feedback: 'Unacceptable.' }
    ],
    correctOptionId: 'opt-a'
  },
  {
    id: 'hr-rapid-30',
    mode: 'rapid-fire',
    category: 'Strengths & Weaknesses',
    difficulty: 'Beginner',
    type: 'multiple-choice',
    question: 'What is your reaction when your code review has 15 comments asking for changes?',
    recommendedFramework: 'Growth Mindset: Celebrate thorough review as a free learning accelerator and quality safeguard.',
    interviewerIntent: 'Measures ego separation and receptiveness to peer critique.',
    idealTakeaway: 'A detailed review means the reviewer invested time to help you grow and protect the codebase.',
    hint: 'Code reviews improve software and make you a sharper developer. Welcome detailed scrutiny.',
    points: 5,
    timeLimitSeconds: 20,
    options: [
      { id: 'opt-a', text: 'Appreciate the detailed scrutiny, review each comment objectively, ask clarifying questions on architectural suggestions, and update the PR.', quality: 'optimal', points: 5, feedback: 'Healthy engineering maturity.' },
      { id: 'opt-b', text: 'Feel personally insulted and refuse to speak to the reviewer.', quality: 'weak', points: 0, feedback: 'Destructive ego.' },
      { id: 'opt-c', text: 'Blindly click resolve on all comments without changing any code.', quality: 'weak', points: 1, feedback: 'Negligent.' },
      { id: 'opt-d', text: 'Complain that the reviewer has a personal grudge against you.', quality: 'weak', points: 1, feedback: 'Paranoid and defensive.' }
    ],
    correctOptionId: 'opt-a'
  },
  {
    id: 'hr-rapid-31',
    mode: 'rapid-fire',
    category: 'Workplace Scenarios',
    difficulty: 'Intermediate',
    type: 'multiple-choice',
    question: 'You notice your local git credentials or API key were accidentally committed to a public GitHub repo. Immediate step?',
    recommendedFramework: 'Security First: Revoke/invalidate the secret immediately, rotate credentials, then clean git history.',
    interviewerIntent: 'Assesses security awareness and knowing that deleting the commit does not protect a compromised key.',
    idealTakeaway: 'The key is already compromised. Revoke/rotate it immediately on the cloud provider, then scrub the repo history.',
    hint: 'Deleting the commit does not stop bots that scrape public repos instantly. Revoke the key first.',
    points: 5,
    timeLimitSeconds: 25,
    options: [
      { id: 'opt-a', text: 'Immediately revoke/rotate the API key in the provider console to make it inert, then purge git history and notify security.', quality: 'optimal', points: 5, feedback: 'Correct security procedure. Revocation is step #1.' },
      { id: 'opt-b', text: 'Just make the repository private and assume nobody saw it.', quality: 'weak', points: 1, feedback: 'Automated scraper bots detect keys in milliseconds.' },
      { id: 'opt-c', text: 'Do nothing because it was an accident.', quality: 'weak', points: 0, feedback: 'Dangerous security negligence.' },
      { id: 'opt-d', text: 'Turn off your computer and hope the server forgets the commit.', quality: 'weak', points: 0, feedback: 'Nonsensical.' }
    ],
    correctOptionId: 'opt-a'
  },
  {
    id: 'hr-rapid-32',
    mode: 'rapid-fire',
    category: 'Conflict & Pressure',
    difficulty: 'Beginner',
    type: 'multiple-choice',
    question: 'How do you prioritize when everything on your plate is marked "High Priority" by different stakeholders?',
    recommendedFramework: 'Clarify Impact & Alignment: Bring stakeholders together or consult lead to align on true business urgency.',
    interviewerIntent: 'Tests organizational poise and ability to resolve conflicting urgency without collapsing.',
    idealTakeaway: 'If everything is high priority, nothing is. Seek lead alignment on sequencing based on dependencies and revenue impact.',
    hint: 'Work with your team lead to establish objective sequencing based on business value and dependencies.',
    points: 5,
    timeLimitSeconds: 25,
    options: [
      { id: 'opt-a', text: 'Align with my lead to evaluate business impact and technical dependencies, establishing an objective delivery sequence.', quality: 'optimal', points: 5, feedback: 'Professional stakeholder management.' },
      { id: 'opt-b', text: 'Work on whatever task was requested by the loudest person.', quality: 'weak', points: 1, feedback: 'Reactive and causes poor business outcomes.' },
      { id: 'opt-c', text: 'Try to do all of them simultaneously in 5-minute increments.', quality: 'weak', points: 1, feedback: 'Context switching ruins quality.' },
      { id: 'opt-d', text: 'Refuse to work on any task until they argue it out.', quality: 'weak', points: 1, feedback: 'Obstinate.' }
    ],
    correctOptionId: 'opt-a'
  },
  {
    id: 'hr-rapid-33',
    mode: 'rapid-fire',
    category: 'Introduction & Motivation',
    difficulty: 'Beginner',
    type: 'multiple-choice',
    question: 'What excites you most about software engineering?',
    recommendedFramework: 'Impact & Problem-Solving: The power to turn abstract code into tools that solve real human problems at scale.',
    interviewerIntent: 'Looks for authentic passion for the craft of building software.',
    idealTakeaway: 'Connect the logical thrill of problem-solving with the real-world impact of deployed software.',
    hint: 'Emphasize creating real-world utility and solving challenging logical puzzles.',
    points: 5,
    timeLimitSeconds: 20,
    options: [
      { id: 'opt-a', text: 'The ability to solve complex logical problems and turn ideas into tangible tools that make life easier for thousands of people.', quality: 'optimal', points: 5, feedback: 'Inspiring and authentic engineering motivation.' },
      { id: 'opt-b', text: 'Sitting in an air-conditioned office and playing games when the boss leaves.', quality: 'weak', points: 0, feedback: 'Disrespectful.' },
      { id: 'opt-c', text: 'Telling people that I am a coder because it sounds impressive.', quality: 'weak', points: 1, feedback: 'Superficial vanity.' },
      { id: 'opt-d', text: 'Nothing in particular; my parents made me choose this major.', quality: 'acceptable', points: 2, feedback: 'Honest, but shows zero personal agency or enthusiasm.' }
    ],
    correctOptionId: 'opt-a'
  },
  {
    id: 'hr-rapid-34',
    mode: 'rapid-fire',
    category: 'Ethics & Integrity',
    difficulty: 'Beginner',
    type: 'multiple-choice',
    question: 'You find an open-source library that solves your project requirement, but its license is GPL and your company builds proprietary software. Can you copy-paste it?',
    recommendedFramework: 'IP & Legal Awareness: Respect software licenses; consult tech lead or use permissible MIT/Apache alternatives.',
    interviewerIntent: 'Checks awareness of intellectual property and licensing risks in commercial engineering.',
    idealTakeaway: 'Copying copyleft code into proprietary commercial software can create severe legal liabilities.',
    hint: 'Licensing rules matter. Check with your lead or select MIT/Apache 2.0 alternatives.',
    points: 5,
    timeLimitSeconds: 25,
    options: [
      { id: 'opt-a', text: 'No. Copyleft licenses like GPL can require open-sourcing proprietary software. I would look for MIT/Apache alternatives or consult our lead.', quality: 'optimal', points: 5, feedback: 'Exceptional legal and engineering hygiene.' },
      { id: 'opt-b', text: 'Yes, if it is on the internet, you can copy anything without reading the license.', quality: 'weak', points: 0, feedback: 'Severe legal liability for employers.' },
      { id: 'opt-c', text: 'Yes, as long as you change variable names slightly.', quality: 'weak', points: 0, feedback: 'Still copyright infringement.' },
      { id: 'opt-d', text: 'Copy it and delete the license header.', quality: 'weak', points: 0, feedback: 'Willful intellectual property violation.' }
    ],
    correctOptionId: 'opt-a'
  },
  {
    id: 'hr-rapid-35',
    mode: 'rapid-fire',
    category: 'Adaptability & Learning',
    difficulty: 'Intermediate',
    type: 'multiple-choice',
    question: 'How do you handle being assigned to a legacy codebase with zero documentation and outdated frameworks?',
    recommendedFramework: 'Patience & Exploratory Engineering: Read unit tests, trace data flows, document findings as you learn, and modernize incrementally.',
    interviewerIntent: 'Tests resilience when working with messy real-world legacy code (most jobs are not greenfield!).',
    idealTakeaway: 'Write documentation as you explore, add missing tests, and refactor step-by-step rather than complaining.',
    hint: 'Treat legacy code as a learning puzzle: write tests and docs to map the system safely.',
    points: 5,
    timeLimitSeconds: 25,
    options: [
      { id: 'opt-a', text: 'Treat it as a system puzzle: trace entry points, write exploratory tests to verify behavior, and create documentation to help future engineers.', quality: 'optimal', points: 5, feedback: 'Senior-level engineering mindset.' },
      { id: 'opt-b', text: 'Refuse the assignment and demand only newly launched frameworks.', quality: 'weak', points: 1, feedback: 'Unrealistic in enterprise companies.' },
      { id: 'opt-c', text: 'Rewrite the entire codebase in one week without testing existing features.', quality: 'weak', points: 1, feedback: 'Guaranteed to introduce regressions.' },
      { id: 'opt-d', text: 'Complain every day about how bad the previous engineers were.', quality: 'weak', points: 1, feedback: 'Unproductive negativity.' }
    ],
    correctOptionId: 'opt-a'
  },
  {
    id: 'hr-rapid-36',
    mode: 'rapid-fire',
    category: 'Teamwork & Collaboration',
    difficulty: 'Beginner',
    type: 'multiple-choice',
    question: 'A teammate helps you solve a gnarly bug. When the lead praises the fix in standup, what do you do?',
    recommendedFramework: 'Public Credit Sharing: Immediately acknowledge and credit the teammate’s contribution.',
    interviewerIntent: 'Checks team spirit and whether you share credit generously.',
    idealTakeaway: 'Giving credit builds trust, camaraderie, and team loyalty.',
    hint: 'Always publicly recognize peer assistance.',
    points: 5,
    timeLimitSeconds: 20,
    options: [
      { id: 'opt-a', text: 'Immediately acknowledge the teammate in the standup and thank them for their critical assistance in debugging.', quality: 'optimal', points: 5, feedback: 'Builds immense trust and high team morale.' },
      { id: 'opt-b', text: 'Stay silent and take all the credit yourself.', quality: 'weak', points: 0, feedback: 'Breaks teammate trust.' },
      { id: 'opt-c', text: 'Say you did 99% of the work and they only watched.', quality: 'weak', points: 1, feedback: 'Petty.' },
      { id: 'opt-d', text: 'Change the subject.', quality: 'acceptable', points: 2, feedback: 'Missed opportunity to appreciate a peer.' }
    ],
    correctOptionId: 'opt-a'
  },
  {
    id: 'hr-rapid-37',
    mode: 'rapid-fire',
    category: 'Failure & Accountability',
    difficulty: 'Beginner',
    type: 'multiple-choice',
    question: 'How do you handle making a wrong technical assumption that caused extra rework?',
    recommendedFramework: 'Own & Learn: Acknowledge the oversight, analyze why the assumption was made, and document validation steps for next time.',
    interviewerIntent: 'Measures humility and whether you turn mistakes into institutional knowledge.',
    idealTakeaway: 'Acknowledge it swiftly, complete the rework, and write down the validation checklist you will follow next time.',
    hint: 'Own the oversight immediately and build a checklist to prevent repeat errors.',
    points: 5,
    timeLimitSeconds: 20,
    options: [
      { id: 'opt-a', text: 'Own the mistake openly, quickly realign on the correct architecture, and document a validation checklist to verify assumptions early.', quality: 'optimal', points: 5, feedback: 'Exemplary accountability.' },
      { id: 'opt-b', text: 'Blame whoever wrote the requirements specification.', quality: 'weak', points: 1, feedback: 'Deflective.' },
      { id: 'opt-c', text: 'Argue that your wrong assumption is actually better.', quality: 'weak', points: 1, feedback: 'Stubborn defensiveness.' },
      { id: 'opt-d', text: 'Pretend the rework was planned all along.', quality: 'weak', points: 1, feedback: 'Inauthentic.' }
    ],
    correctOptionId: 'opt-a'
  },
  {
    id: 'hr-rapid-38',
    mode: 'rapid-fire',
    category: 'Introduction & Motivation',
    difficulty: 'Beginner',
    type: 'multiple-choice',
    question: 'What do you do if you are assigned to a project using a tech stack you dislike?',
    recommendedFramework: 'Professional Adaptability: Focus on business problem-solving and finding transferable engineering patterns.',
    interviewerIntent: 'Checks if you are a narrow framework zealot or an adaptable problem solver.',
    idealTakeaway: 'Languages and frameworks are tools. Focus on the algorithmic and architectural problem being solved.',
    hint: 'Great engineers focus on solving the user problem, not personal framework preferences.',
    points: 5,
    timeLimitSeconds: 20,
    options: [
      { id: 'opt-a', text: 'Approach it professionally: focus on solving the business problem, master the stack, and extract transferable design patterns.', quality: 'optimal', points: 5, feedback: 'Mature engineer perspective.' },
      { id: 'opt-b', text: 'Refuse to write code until they switch to my preferred language.', quality: 'weak', points: 0, feedback: 'Immature and unhireable.' },
      { id: 'opt-c', text: 'Intentionally write buggy code so they reassign me.', quality: 'weak', points: 0, feedback: 'Malicious sabotage.' },
      { id: 'opt-d', text: 'Complain publicly on social media.', quality: 'weak', points: 0, feedback: 'Unprofessional.' }
    ],
    correctOptionId: 'opt-a'
  },
  {
    id: 'hr-rapid-39',
    mode: 'rapid-fire',
    category: 'Workplace Scenarios',
    difficulty: 'Intermediate',
    type: 'multiple-choice',
    question: 'You notice a senior engineer consistently leaves code reviews unaddressed for 4 days, blocking your sprint ticket. Best action?',
    recommendedFramework: 'Gentle Prompting with Context: Send a polite reminder with PR summary, urgency context, and offer to walk through it.',
    interviewerIntent: 'Tests respectful proactivity when dealing with busy senior colleagues.',
    idealTakeaway: 'Send a concise Slack/Teams message with link, 2-line summary, and asking for 10 minutes if they prefer a live walkthrough.',
    hint: 'Polite reminder with concise context and an offer for a quick sync.',
    points: 5,
    timeLimitSeconds: 25,
    options: [
      { id: 'opt-a', text: 'Send a polite direct message with PR link, 2-line summary of changes, and ask if a 10-minute sync would make reviewing easier.', quality: 'optimal', points: 5, feedback: 'Respectful, proactive, and removes review friction.' },
      { id: 'opt-b', text: 'Merge the PR without any review or approvals.', quality: 'weak', points: 0, feedback: 'Violates deployment governance.' },
      { id: 'opt-c', text: 'Tag the senior in all-hands channels demanding they do their job.', quality: 'weak', points: 1, feedback: 'Aggressive.' },
      { id: 'opt-d', text: 'Abandon the ticket and do nothing for the rest of the sprint.', quality: 'weak', points: 1, feedback: 'Passive.' }
    ],
    correctOptionId: 'opt-a'
  },
  {
    id: 'hr-rapid-40',
    mode: 'rapid-fire',
    category: 'Difficult HR & Salary',
    difficulty: 'Beginner',
    type: 'multiple-choice',
    question: 'How do you handle working on weekends or overtime during critical project launches?',
    recommendedFramework: 'Pragmatic Dedication with Sustainable Balance: Ready to step up for genuine launch crunches while valuing sustainable pace long-term.',
    interviewerIntent: 'Checks commitment during critical milestones while avoiding exploitation.',
    idealTakeaway: 'Willing to go the extra mile during critical releases, while maintaining healthy engineering cadence day-to-day.',
    hint: 'Demonstrate team dedication during crunch time while promoting sustainable planning.',
    points: 5,
    timeLimitSeconds: 25,
    options: [
      { id: 'opt-a', text: 'I am ready to go the extra mile during critical releases to ensure customer success, while collaborating with the team to maintain a sustainable pace post-launch.', quality: 'optimal', points: 5, feedback: 'Strong commitment balanced with realism.' },
      { id: 'opt-b', text: 'I refuse to work even one minute past 5:00 PM regardless of what happens.', quality: 'weak', points: 2, feedback: 'Inflexible during rare critical outages.' },
      { id: 'opt-c', text: 'I want to work 16 hours every day including weekends all year round.', quality: 'weak', points: 1, feedback: 'Leads to fast burnout.' },
      { id: 'opt-d', text: 'I only work overtime if you give me cash advances on the spot.', quality: 'weak', points: 1, feedback: 'Unprofessional.' }
    ],
    correctOptionId: 'opt-a'
  },
  {
    id: 'hr-rapid-41',
    mode: 'rapid-fire',
    category: 'Conflict & Pressure',
    difficulty: 'Beginner',
    type: 'multiple-choice',
    question: 'A client gives confusing, contradictory feedback on your team’s UI prototype. How do you proceed?',
    recommendedFramework: 'Seek Clarification with Visual Mockups: Schedule a brief demo with concrete options rather than guessing.',
    interviewerIntent: 'Assesses client communication and reducing ambiguity through prototypes.',
    idealTakeaway: 'Prepare two visual options and ask clarifying questions on user workflows.',
    hint: 'Show visual alternatives to clarify ambiguous requirements.',
    points: 5,
    timeLimitSeconds: 25,
    options: [
      { id: 'opt-a', text: 'Create two clear interactive mockups representing both interpretations and schedule a quick walkthrough to align on their core intent.', quality: 'optimal', points: 5, feedback: 'Proactive and eliminates ambiguity visually.' },
      { id: 'opt-b', text: 'Pick one randomly and tell the client they don’t know what they want.', quality: 'weak', points: 0, feedback: 'Unprofessional.' },
      { id: 'opt-c', text: 'Stop working and wait indefinitely.', quality: 'weak', points: 1, feedback: 'Passive.' },
      { id: 'opt-d', text: 'Build both full systems in parallel.', quality: 'weak', points: 1, feedback: 'Wastes massive effort.' }
    ],
    correctOptionId: 'opt-a'
  },
  {
    id: 'hr-rapid-42',
    mode: 'rapid-fire',
    category: 'Introduction & Motivation',
    difficulty: 'Beginner',
    type: 'multiple-choice',
    question: 'What is the most rewarding technical project you have built so far in college?',
    recommendedFramework: 'Problem -> Tech Stack -> User Value: State the user problem, your technology choices, and the measurable outcome.',
    interviewerIntent: 'Checks whether you build projects to solve problems or just copy-paste tutorial repos.',
    idealTakeaway: 'Focus on why you built it, the architecture choices, and how real users interacted with it.',
    hint: 'Highlight problem context, tech decisions, and user feedback.',
    points: 5,
    timeLimitSeconds: 25,
    options: [
      { id: 'opt-a', text: 'A campus event management app that solved ticket scalping using QR validation; seeing 500 college peers use it smoothly was deeply rewarding.', quality: 'optimal', points: 5, feedback: 'Terrific. Concrete problem, engineering solution, and real human impact.' },
      { id: 'opt-b', text: 'A basic calculator app where I followed a YouTube video line-by-line without changing anything.', quality: 'weak', points: 2, feedback: 'Tutorial clone with zero independent thought.' },
      { id: 'opt-c', text: 'I don’t remember what I built because I bought the project from an external agency.', quality: 'weak', points: 0, feedback: 'Academic dishonesty disqualification.' },
      { id: 'opt-d', text: 'I started 20 projects but never finished any of them.', quality: 'weak', points: 2, feedback: 'Shows inability to ship completed software.' }
    ],
    correctOptionId: 'opt-a'
  },
  {
    id: 'hr-rapid-43',
    mode: 'rapid-fire',
    category: 'Adaptability & Learning',
    difficulty: 'Beginner',
    type: 'multiple-choice',
    question: 'How do you handle constructive criticism from a teammate who is younger or junior to you?',
    recommendedFramework: 'Objective Meritocracy: Good ideas and valid bug reports have no age or hierarchy.',
    interviewerIntent: 'Tests ego, humility, and collaborative equality.',
    idealTakeaway: 'Focus on the validity of the technical feedback, not the seniority of the person providing it.',
    hint: 'Code quality and technical correctness transcend tenure and age.',
    points: 5,
    timeLimitSeconds: 20,
    options: [
      { id: 'opt-a', text: 'Evaluate the technical critique on its merits with gratitude. Great insights come from any team member regardless of seniority.', quality: 'optimal', points: 5, feedback: 'Humility and true engineering spirit.' },
      { id: 'opt-b', text: 'Tell them to be quiet until they have more years of experience.', quality: 'weak', points: 0, feedback: 'Toxic hierarchy.' },
      { id: 'opt-c', text: 'Ignore the feedback and complain to their manager.', quality: 'weak', points: 1, feedback: 'Petty.' },
      { id: 'opt-d', text: 'Pretend to agree but secretly discard their points.', quality: 'weak', points: 1, feedback: 'Passive-aggressive.' }
    ],
    correctOptionId: 'opt-a'
  },
  {
    id: 'hr-rapid-44',
    mode: 'rapid-fire',
    category: 'Ethics & Integrity',
    difficulty: 'Beginner',
    type: 'multiple-choice',
    question: 'You notice your manager accidentally shared a document containing upcoming salary appraisal data with you. What do you do?',
    recommendedFramework: 'Confidentiality & Integrity: Do not read further, notify manager immediately, and delete the file/access.',
    interviewerIntent: 'Tests ethical integrity with confidential organizational data.',
    idealTakeaway: 'Alert the sender immediately without inspecting or sharing confidential records.',
    hint: 'Notify the sender immediately and maintain strict confidentiality.',
    points: 5,
    timeLimitSeconds: 20,
    options: [
      { id: 'opt-a', text: 'Close the file immediately without reading details, notify the manager privately about the accidental share, and delete the copy.', quality: 'optimal', points: 5, feedback: 'Impeccable ethical standard.' },
      { id: 'opt-b', text: 'Download it and share everyone’s salary on the company Slack.', quality: 'weak', points: 0, feedback: 'Immediate grounds for termination.' },
      { id: 'opt-c', text: 'Use the information to blackmail teammates.', quality: 'weak', points: 0, feedback: 'Malicious.' },
      { id: 'opt-d', text: 'Save it to your personal Google Drive for future salary negotiations.', quality: 'weak', points: 1, feedback: 'Breach of corporate confidentiality.' }
    ],
    correctOptionId: 'opt-a'
  },
  {
    id: 'hr-rapid-45',
    mode: 'rapid-fire',
    category: 'Strengths & Weaknesses',
    difficulty: 'Beginner',
    type: 'multiple-choice',
    question: 'What is your single most important habit for maintaining productive coding output?',
    recommendedFramework: 'Deliberate Routine: Deep work time-blocking, clean task breakdown, and test-driven verification.',
    interviewerIntent: 'Evaluates personal discipline and productivity systems.',
    idealTakeaway: 'Showcase an intentional workflow (e.g. daily standup with self, writing clear specs, eliminating distractions).',
    hint: 'Highlight systematic planning and focused uninterrupted execution.',
    points: 5,
    timeLimitSeconds: 20,
    options: [
      { id: 'opt-a', text: 'Breaking complex problems into small testable units and maintaining dedicated blocks of distraction-free deep work.', quality: 'optimal', points: 5, feedback: 'Solid productivity discipline.' },
      { id: 'opt-b', text: 'Drinking 8 energy drinks and coding until 5 AM every night.', quality: 'weak', points: 1, feedback: 'Unsustainable burnout habit.' },
      { id: 'opt-c', text: 'Only coding when feeling spontaneous inspiration.', quality: 'weak', points: 2, feedback: 'Inconsistent.' },
      { id: 'opt-d', text: 'Copying solutions from Stack Overflow without understanding how they work.', quality: 'weak', points: 1, feedback: 'Shallow.' }
    ],
    correctOptionId: 'opt-a'
  },

  // ==========================================
  // MODE C: WORKPLACE SITUATIONS (46-65)
  // ==========================================
  {
    id: 'hr-work-46',
    mode: 'workplace-situations',
    category: 'Workplace Scenarios',
    difficulty: 'Beginner',
    type: 'multiple-choice',
    question: 'Two assignments have the exact same deadline, and you realize you only have bandwidth to complete 70% of each with good quality. What is your strategy?',
    scenarioContext: 'You are on your second month in a company. Project A is customer-facing; Project B is an internal documentation update.',
    recommendedFramework: 'Impact-Based Triage + Early Stakeholder Negotiation: Communicate early to sequence deliverables based on customer impact.',
    interviewerIntent: 'Assesses triage, customer-first thinking, and avoiding silent sub-par delivery.',
    idealTakeaway: 'Prioritize customer-critical deliverables, negotiate a 2-day grace period for internal docs, and communicate before the deadline.',
    hint: 'Focus on customer impact first, and negotiate internal deadlines proactively.',
    points: 5,
    options: [
      {
        id: 'opt-a',
        text: 'Consult my lead immediately: prioritize completing 100% of customer-facing Project A, and negotiate an agreed 2-day extension for internal Project B so both maintain high quality.',
        quality: 'optimal',
        points: 5,
        feedback: 'Superb. Prioritizes business impact and manages timelines transparently.'
      },
      {
        id: 'opt-b',
        text: 'Deliver both half-finished with broken links and hope nobody notices.',
        quality: 'weak',
        points: 1,
        feedback: 'Compromises product quality on both fronts.'
      },
      {
        id: 'opt-c',
        text: 'Abandon Project A and only do Project B because internal docs are easier.',
        quality: 'weak',
        points: 1,
        feedback: 'Inverts business priorities.'
      },
      {
        id: 'opt-d',
        text: 'Blame management for giving two assignments in the same week.',
        quality: 'weak',
        points: 1,
        feedback: 'Deflective.'
      }
    ],
    correctOptionId: 'opt-a'
  },
  {
    id: 'hr-work-47',
    mode: 'workplace-situations',
    category: 'Workplace Scenarios',
    difficulty: 'Intermediate',
    type: 'multiple-choice',
    question: 'A colleague takes credit for a key optimization script you authored during a company demo. How do you handle it?',
    scenarioContext: 'In a team showcase, your peer showed your optimization script without mentioning your name, receiving praise from the VP.',
    recommendedFramework: 'Private Direct Conversation First + Future Documentation: Address the colleague 1-on-1 professionally, understand intent, and ensure co-authorship is noted.',
    interviewerIntent: 'Evaluates emotional control, professional assertiveness, and resolving credit disputes without toxic public drama.',
    idealTakeaway: 'Speak to the peer privately: "I noticed my optimization script was showcased today. In the future, I expect co-authorship to be acknowledged."',
    hint: 'Address the peer privately with clear assertiveness before escalating.',
    points: 5,
    options: [
      {
        id: 'opt-a',
        text: 'Speak privately with the colleague after the demo: acknowledge the great reception, clearly assert your authorship, and ask them to send an update email crediting both of you on the release notes.',
        quality: 'optimal',
        points: 5,
        feedback: 'Professional, assertive, avoids public embarrassment, and rectifies the record.'
      },
      {
        id: 'opt-b',
        text: 'Stand up in the middle of the demo in front of the VP and shout that the colleague is a fraud and thief.',
        quality: 'weak',
        points: 0,
        feedback: 'Unprofessional scene that damages your own reputation.'
      },
      {
        id: 'opt-c',
        text: 'Swallow your feelings and never say anything, but secretly sabotage their future pull requests.',
        quality: 'weak',
        points: 0,
        feedback: 'Toxic passive-aggression.'
      },
      {
        id: 'opt-d',
        text: 'Immediately write an angry review on Glassdoor.',
        quality: 'weak',
        points: 1,
        feedback: 'Immature overreaction.'
      }
    ],
    correctOptionId: 'opt-a'
  },
  {
    id: 'hr-work-48',
    mode: 'workplace-situations',
    category: 'Workplace Scenarios',
    difficulty: 'Advanced',
    type: 'typed',
    question: 'A senior developer asks you to deploy an untested database migration directly to production on Friday evening. How do you respond?',
    scenarioContext: 'The senior says "it’s a simple column rename, it will take 30 seconds." Company policy strictly forbids Friday deployments without VP signoff.',
    recommendedFramework: 'Respectful Adherence to Policy + Solution Orientation: Politely reference company deployment freeze, explain rollback risk, and offer Monday morning scheduled deployment.',
    interviewerIntent: 'Tests whether you succumb to senior pressure to violate safety policies or uphold engineering standards respectfully.',
    idealTakeaway: 'Point to the company deployment freeze policy and propose scheduling the migration first thing Monday morning with backups in place.',
    hint: 'Respectfully cite the company deployment freeze policy, explain the customer outage risk, and schedule for Monday.',
    points: 5,
    rubric: {
      keywords: ['policy', 'friday', 'production', 'risk', 'rollback', 'monday', 'backup', 'testing', 'respectfully', 'safeguard'],
      minWords: 30,
      targetWords: 65,
      structuralAspects: ['Polite citation of deployment policy', 'Explanation of outage/weekend recovery risk', 'Constructive Monday deployment alternative'],
      starElements: {
        situationTask: 'Pressure to bypass production deployment governance on a Friday evening',
        action: 'Politely declined Friday push, cited policy and customer risk, scheduled Monday deployment',
        result: 'Protected production stability and reinforced safe engineering practices'
      }
    }
  },
  {
    id: 'hr-work-49',
    mode: 'workplace-situations',
    category: 'Workplace Scenarios',
    difficulty: 'Intermediate',
    type: 'multiple-choice',
    question: 'You discover a critical calculation error in your team’s financial reporting service 30 minutes before client presentation. What do you do?',
    scenarioContext: 'The demo deck is already shared with clients. You verified that a currency conversion multiplier is 10x too high in certain edge cases.',
    recommendedFramework: 'Immediate Disclosure + Mitigation: Notify presentation lead immediately, share the known limitation, and present the correction timeline.',
    interviewerIntent: 'Measures integrity under pressure: will you hide it to save face or disclose it to protect client trust?',
    idealTakeaway: 'Never present verified wrong data to a client. Alert the presenter to omit that specific slide or note the known edge-case fix underway.',
    hint: 'Never let leadership present known flawed numbers. Alert the lead immediately.',
    points: 5,
    options: [
      {
        id: 'opt-a',
        text: 'Notify the presentation lead and manager immediately with the exact discrepancy so they can descope or caveat that metric during the demo, while initiating the patch in staging.',
        quality: 'optimal',
        points: 5,
        feedback: 'Protects company reputation and client trust.'
      },
      {
        id: 'opt-b',
        text: 'Stay silent and pray the client doesn’t notice the 10x multiplier discrepancy.',
        quality: 'weak',
        points: 0,
        feedback: 'Disastrous. Client audits will uncover it and destroy trust.'
      },
      {
        id: 'opt-c',
        text: 'Quickly change the production database manually while the presentation is running without backing up.',
        quality: 'weak',
        points: 1,
        feedback: 'Extremely risky; manual production tampering often crashes live services.'
      },
      {
        id: 'opt-d',
        text: 'Log off and turn off your phone so you aren’t blamed.',
        quality: 'weak',
        points: 0,
        feedback: 'Cowardly.'
      }
    ],
    correctOptionId: 'opt-a'
  },
  {
    id: 'hr-work-50',
    mode: 'workplace-situations',
    category: 'Workplace Scenarios',
    difficulty: 'Beginner',
    type: 'multiple-choice',
    question: 'You are assigned to shadow a senior developer, but they appear extremely busy and frequently ignore your messages. How do you handle it?',
    recommendedFramework: 'Structured Low-Friction Cadence: Consolidate questions into a shared document and request a recurring 15-minute daily sync.',
    interviewerIntent: 'Assesses proactivity and empathy for senior workloads.',
    idealTakeaway: 'Instead of sending 20 random pings, batch your questions in a bulleted doc and ask for a quick 15-min daily check-in.',
    hint: 'Batch your questions in a single doc and ask for a short recurring sync.',
    points: 5,
    options: [
      {
        id: 'opt-a',
        text: 'Consolidate my questions into a clean bulleted document, outline what I have already tried, and politely request a short 15-minute daily sync at their convenience.',
        quality: 'optimal',
        points: 5,
        feedback: 'Reduces context-switching for the senior and demonstrates exceptional self-management.'
      },
      {
        id: 'opt-b',
        text: 'Ping them every 3 minutes on Slack until they respond.',
        quality: 'weak',
        points: 1,
        feedback: 'Irritating and disrupts their focus.'
      },
      {
        id: 'opt-c',
        text: 'Complain to the department head that the senior is hostile.',
        quality: 'weak',
        points: 1,
        feedback: 'Premature escalation.'
      },
      {
        id: 'opt-d',
        text: 'Sit idle at your desk doing nothing for the entire month.',
        quality: 'weak',
        points: 0,
        feedback: 'Zero proactivity.'
      }
    ],
    correctOptionId: 'opt-a'
  },
  {
    id: 'hr-work-51',
    mode: 'workplace-situations',
    category: 'Workplace Scenarios',
    difficulty: 'Intermediate',
    type: 'multiple-choice',
    question: 'You notice your team’s daily standup meetings frequently derail into 45-minute technical debates. What do you suggest?',
    recommendedFramework: 'Agile Best Practice: Propose parking deep discussions into a separate targeted breakout call to respect everyone’s time.',
    interviewerIntent: 'Checks understanding of agile standup purpose (status & blockers, not deep architectural debates).',
    idealTakeaway: 'Suggest the classic agile technique: "Let’s take this technical discussion offline into a dedicated breakout session."',
    hint: 'Standups should remain concise. Park deep technical debates for focused follow-ups.',
    points: 5,
    options: [
      {
        id: 'opt-a',
        text: 'Politely suggest to the team that we park deep technical debates for a dedicated follow-up breakout call so the standup remains focused on quick blockers and finishes in 15 minutes.',
        quality: 'optimal',
        points: 5,
        feedback: 'Textbook agile discipline that saves hours of collective developer time.'
      },
      {
        id: 'opt-b',
        text: 'Walk out of the meeting without saying a word.',
        quality: 'weak',
        points: 0,
        feedback: 'Rude and unprofessional.'
      },
      {
        id: 'opt-c',
        text: 'Shout at the speakers to stop talking.',
        quality: 'weak',
        points: 1,
        feedback: 'Aggressive.'
      },
      {
        id: 'opt-d',
        text: 'Say nothing and browse social media during the 45 minutes.',
        quality: 'acceptable',
        points: 2,
        feedback: 'Passive; misses the chance to improve team productivity.'
      }
    ],
    correctOptionId: 'opt-a'
  },
  {
    id: 'hr-work-52',
    mode: 'workplace-situations',
    category: 'Workplace Scenarios',
    difficulty: 'Advanced',
    type: 'typed',
    question: 'You realize that an architectural decision you advocated for 3 months ago is now causing performance bottlenecks under production load. How do you address this with your team?',
    recommendedFramework: 'Humility + Data-Driven Retrospective + Solution Roadmap: Own the limitation objectively, present performance metrics, and propose an incremental migration path.',
    interviewerIntent: 'Assesses ego management, intellectual honesty, and focusing on product success over defending past decisions.',
    idealTakeaway: 'Circumstances and scale evolve. Acknowledge the bottleneck openly with profiler data, and outline an incremental refactoring plan.',
    hint: 'Own your past decision openly, share profiler data, and present a practical migration roadmap.',
    points: 5,
    rubric: {
      keywords: ['bottleneck', 'metrics', 'own', 'refactor', 'solution', 'scale', 'migration', 'data', 'collaborate', 'improve'],
      minWords: 30,
      targetWords: 70,
      structuralAspects: ['Open ownership without defensiveness', 'Presentation of empirical performance metrics', 'Pragmatic refactoring roadmap'],
      starElements: {
        situationTask: 'Past architectural choice encountering scale limits',
        action: 'Gathered telemetry, presented trade-offs transparently, proposed staged fix',
        result: 'Strengthened team trust and successfully resolved bottleneck'
      }
    }
  },
  {
    id: 'hr-work-53',
    mode: 'workplace-situations',
    category: 'Workplace Scenarios',
    difficulty: 'Beginner',
    type: 'multiple-choice',
    question: 'A product manager requests an urgent feature change 1 day before sprint freeze that would require altering core database schemas. What is your response?',
    recommendedFramework: 'Impact Analysis + Collaborative Trade-off Discussion: Explain the risk to sprint stability and propose scheduling it as priority #1 in the next sprint.',
    interviewerIntent: 'Checks whether you say "yes" to everything blindly or communicate scope trade-offs constructively.',
    idealTakeaway: 'Explain the technical impact on sprint testing and suggest scheduling it for the immediate next sprint or descoping a non-critical item.',
    hint: 'Explain the database migration risk and offer to prioritize it at the start of the next sprint.',
    points: 5,
    options: [
      {
        id: 'opt-a',
        text: 'Walk through the schema migration and regression testing risks with the PM, and propose either swapping it with an existing sprint item or scheduling it as top priority for sprint start next week.',
        quality: 'optimal',
        points: 5,
        feedback: 'Empowers product decision-making while defending system stability.'
      },
      {
        id: 'opt-b',
        text: 'Say "yes" immediately, rush the schema change without tests, and crash staging.',
        quality: 'weak',
        points: 1,
        feedback: 'People-pleasing that compromises software quality.'
      },
      {
        id: 'opt-c',
        text: 'Tell the PM they have no right to talk to developers.',
        quality: 'weak',
        points: 0,
        feedback: 'Toxic territorialism.'
      },
      {
        id: 'opt-d',
        text: 'Ignore their message and pretend you never saw it.',
        quality: 'weak',
        points: 1,
        feedback: 'Passive avoidance.'
      }
    ],
    correctOptionId: 'opt-a'
  },
  {
    id: 'hr-work-54',
    mode: 'workplace-situations',
    category: 'Workplace Scenarios',
    difficulty: 'Intermediate',
    type: 'multiple-choice',
    question: 'You notice your teammate is visibly overwhelmed, working late nights, and struggling with an assigned microservice. How do you respond?',
    recommendedFramework: 'Peer Support & Collaborative Assistance: Check in privately, offer to pair on blockers, and encourage speaking with the lead.',
    interviewerIntent: 'Evaluates empathy, team citizenship, and preventing peer burnout.',
    idealTakeaway: 'Reach out 1-on-1, offer to take a small sub-task or pair on debugging, and support them in communicating with the manager.',
    hint: 'Offer targeted peer support privately without undermining their autonomy.',
    points: 5,
    options: [
      {
        id: 'opt-a',
        text: 'Check in privately: offer to pair-program on their toughest blocker or take on a secondary sub-task to ease their load before deadline.',
        quality: 'optimal',
        points: 5,
        feedback: 'True team player behavior that prevents burnout and builds lasting bonds.'
      },
      {
        id: 'opt-b',
        text: 'Tell everyone in standup that the teammate is too weak to handle the job.',
        quality: 'weak',
        points: 0,
        feedback: 'Cruel and destructive.'
      },
      {
        id: 'opt-c',
        text: 'Celebrate that you look better in comparison.',
        quality: 'weak',
        points: 0,
        feedback: 'Selfish and toxic.'
      },
      {
        id: 'opt-d',
        text: 'Ignore it completely because each developer has their own individual tickets.',
        quality: 'acceptable',
        points: 2,
        feedback: 'Siloed; ignores team responsibility.'
      }
    ],
    correctOptionId: 'opt-a'
  },
  {
    id: 'hr-work-55',
    mode: 'workplace-situations',
    category: 'Workplace Scenarios',
    difficulty: 'Intermediate',
    type: 'multiple-choice',
    question: 'A customer reports an intermittent bug that you cannot reproduce on your local development machine. How do you proceed?',
    recommendedFramework: 'Systematic Investigation: Inspect production telemetry/logs, request reproduction context, and test in an environment mirroring production.',
    interviewerIntent: 'Checks if you say "works on my machine" or dig deeper with logs and telemetry.',
    idealTakeaway: 'Never dismiss a user with "works on my machine." Analyze APM logs, verify environment differences, and write tests for edge cases.',
    hint: 'Avoid "works on my machine". Check telemetry, production data distributions, and browser/OS specifics.',
    points: 5,
    options: [
      {
        id: 'opt-a',
        text: 'Check production monitoring and error logs (e.g. Sentry/Datadog), inspect user payload variations, attempt replication in staging with production-like data, and write regression tests.',
        quality: 'optimal',
        points: 5,
        feedback: 'Disciplined software engineering. Treats user issues with seriousness.'
      },
      {
        id: 'opt-b',
        text: 'Close the ticket immediately with the comment: "Works on my machine, user is mistaken."',
        quality: 'weak',
        points: 1,
        feedback: 'The classic lazy developer anti-pattern.'
      },
      {
        id: 'opt-c',
        text: 'Delete the user’s account so they can’t report more bugs.',
        quality: 'weak',
        points: 0,
        feedback: 'Malicious.'
      },
      {
        id: 'opt-d',
        text: 'Rewrite the entire application from scratch.',
        quality: 'weak',
        points: 1,
        feedback: 'Grossly disproportionate overreaction.'
      }
    ],
    correctOptionId: 'opt-a'
  },
  {
    id: 'hr-work-56',
    mode: 'workplace-situations',
    category: 'Workplace Scenarios',
    difficulty: 'Advanced',
    type: 'typed',
    question: 'You discover that an external third-party API your application relies on has had a security breach. What steps do you take?',
    recommendedFramework: 'Containment + Escalation + Remediation: Revoke credentials, assess user data exposure, isolate the integration, and notify leadership.',
    interviewerIntent: 'Assesses security incident management and safeguarding company and customer assets.',
    idealTakeaway: 'Alert security/lead immediately, isolate the service with a circuit breaker, revoke credentials, and audit audit logs for exposure.',
    hint: 'Isolate the connection, rotate credentials, alert security and management, and audit data access.',
    points: 5,
    rubric: {
      keywords: ['security', 'isolate', 'credentials', 'rotate', 'notify', 'lead', 'audit', 'logs', 'circuit breaker', 'contain'],
      minWords: 30,
      targetWords: 70,
      structuralAspects: ['Immediate isolation/containment', 'Credential rotation & security team alert', 'Audit of user data impact'],
      starElements: {
        situationTask: 'Third-party vendor data breach discovery',
        action: 'Severed API connection, rotated keys, analyzed logs for potential exposure',
        result: 'Prevented customer data compromise and restored safe integration'
      }
    }
  },
  {
    id: 'hr-work-57',
    mode: 'workplace-situations',
    category: 'Workplace Scenarios',
    difficulty: 'Beginner',
    type: 'multiple-choice',
    question: 'During your first week, you realize the documentation on how to set up the local developer environment has several broken commands and outdated links. What do you do?',
    recommendedFramework: 'Leave It Better Than You Found It: Fix the instructions, test them, and submit a documentation pull request.',
    interviewerIntent: 'Evaluates proactivity and whether you improve documentation for future onboarding freshers.',
    idealTakeaway: 'Update the onboarding README with working commands and open a PR so the next joiner has a seamless setup.',
    hint: 'Update the README file with working steps and submit a pull request.',
    points: 5,
    options: [
      {
        id: 'opt-a',
        text: 'Fix the commands as I successfully troubleshoot them, document the updated steps in the README, and open a PR to improve onboarding for all future joiners.',
        quality: 'optimal',
        points: 5,
        feedback: 'Exemplifies the "leave the campground cleaner than you found it" engineering rule.'
      },
      {
        id: 'opt-b',
        text: 'Complain publicly in the general channel about how disorganized the engineering team is.',
        quality: 'weak',
        points: 1,
        feedback: 'Whiny and unconstructive.'
      },
      {
        id: 'opt-c',
        text: 'Keep the working commands secret in your personal notes so others struggle more than you.',
        quality: 'weak',
        points: 0,
        feedback: 'Petty and uncollegial.'
      },
      {
        id: 'opt-d',
        text: 'Delete the documentation file entirely.',
        quality: 'weak',
        points: 0,
        feedback: 'Vandalism.'
      }
    ],
    correctOptionId: 'opt-a'
  },
  {
    id: 'hr-work-58',
    mode: 'workplace-situations',
    category: 'Workplace Scenarios',
    difficulty: 'Intermediate',
    type: 'multiple-choice',
    question: 'A teammate continually talks over you and interrupts whenever you speak during team retrospectives. How do you address it?',
    recommendedFramework: 'Calm Assertiveness in Private: Have a 1-on-1 conversation using "I" statements, and set boundaries respectfully.',
    interviewerIntent: 'Measures professional assertiveness and resolving interpersonal friction directly.',
    idealTakeaway: 'Approach them privately: "I’ve noticed that when I share points in retro, I get interrupted before finishing. I value our discussions, but I’d appreciate the chance to complete my thoughts."',
    hint: 'Use a private 1-on-1 setting and express your boundary calmly without aggression.',
    points: 5,
    options: [
      {
        id: 'opt-a',
        text: 'Speak with them privately: "I’ve noticed that when I share updates in retro, I get cut off before finishing. I want to make sure my points are heard, so I’d appreciate letting me complete my thought."',
        quality: 'optimal',
        points: 5,
        feedback: 'Assertive, respectful, and addresses the issue directly.'
      },
      {
        id: 'opt-b',
        text: 'Interrupt them back every time they speak and shout louder.',
        quality: 'weak',
        points: 0,
        feedback: 'Escalates meetings into a circus.'
      },
      {
        id: 'opt-c',
        text: 'Stop speaking in retrospectives forever.',
        quality: 'weak',
        points: 1,
        feedback: 'Passive retreat.'
      },
      {
        id: 'opt-d',
        text: 'Post anonymous complaints on team bulletin boards.',
        quality: 'weak',
        points: 1,
        feedback: 'Passive-aggressive.'
      }
    ],
    correctOptionId: 'opt-a'
  },
  {
    id: 'hr-work-59',
    mode: 'workplace-situations',
    category: 'Workplace Scenarios',
    difficulty: 'Advanced',
    type: 'typed',
    question: 'You notice that a feature your team is building collects unnecessary user location data that violates privacy principles. How do you raise this concern?',
    recommendedFramework: 'Privacy by Design + Legal Risk Communication + Alternative Proposal: Question necessity of the data, highlight GDPR/data protection liabilities, and suggest privacy-preserving alternatives.',
    interviewerIntent: 'Evaluates ethical awareness regarding user privacy and regulatory compliance.',
    idealTakeaway: 'Frame it around user trust and legal compliance (e.g. GDPR/DPDP Act), and suggest collecting only what is strictly necessary.',
    hint: 'Cite privacy regulations, user trust, and propose collecting only minimal required data.',
    points: 5,
    rubric: {
      keywords: ['privacy', 'data', 'compliance', 'gdpr', 'regulations', 'minimal', 'user trust', 'security', 'raise', 'alternative'],
      minWords: 30,
      targetWords: 70,
      structuralAspects: ['Identification of privacy violation', 'Highlighting user trust and regulatory risk', 'Proposing data minimization alternative'],
      starElements: {
        situationTask: 'Identification of excessive personal data collection in feature spec',
        action: 'Raised concern with team lead and PM citing privacy best practices',
        result: 'Adopted privacy-by-design data minimization'
      }
    }
  },
  {
    id: 'hr-work-60',
    mode: 'workplace-situations',
    category: 'Workplace Scenarios',
    difficulty: 'Intermediate',
    type: 'multiple-choice',
    question: 'Your team is deciding between two libraries: Library A has 50k GitHub stars and extensive docs; Library B is a tiny 200-star repo built by an acquaintance. How do you advise the team?',
    recommendedFramework: 'Objective Production Criteria: Evaluate community health, maintenance activity, security audit history, and license.',
    interviewerIntent: 'Checks if you make engineering decisions based on personal relationships or production reliability.',
    idealTakeaway: 'Software dependencies require long-term maintenance, active security patches, and community battle-testing.',
    hint: 'Prioritize production stability, security patch velocity, and community maintenance.',
    points: 5,
    options: [
      {
        id: 'opt-a',
        text: 'Advise choosing Library A based on objective criteria: proven production battle-testing, active security patch cadence, extensive documentation, and reduced maintenance risk.',
        quality: 'optimal',
        points: 5,
        feedback: 'Sound engineering governance.'
      },
      {
        id: 'opt-b',
        text: 'Choose Library B to do a personal favor for your friend regardless of project risk.',
        quality: 'weak',
        points: 0,
        feedback: 'Unethical nepotism that compromises software reliability.'
      },
      {
        id: 'opt-c',
        text: 'Flip a coin because all libraries are identical.',
        quality: 'weak',
        points: 1,
        feedback: 'Abdicates engineering evaluation.'
      },
      {
        id: 'opt-d',
        text: 'Write the entire library yourself from scratch.',
        quality: 'weak',
        points: 2,
        feedback: 'Reinventing the wheel wastes company budget and time.'
      }
    ],
    correctOptionId: 'opt-a'
  },
  {
    id: 'hr-work-61',
    mode: 'workplace-situations',
    category: 'Workplace Scenarios',
    difficulty: 'Beginner',
    type: 'multiple-choice',
    question: 'You are invited to an optional technical talk by a visiting principal architect during your normal work hours, but you have sprint tasks pending. What do you do?',
    recommendedFramework: 'Time Management + Lead Alignment: Check task progress; if on track, ask lead if attending aligns with sprint commitments.',
    interviewerIntent: 'Tests balance between continuous learning and meeting work commitments.',
    idealTakeaway: 'Verify that your sprint tasks are on track and confirm with your lead before attending.',
    hint: 'Confirm your sprint tasks are ahead or on track, and check with your lead.',
    points: 5,
    options: [
      {
        id: 'opt-a',
        text: 'Verify that my sprint deliverables are ahead or on schedule, and check with my lead to ensure attending the talk won’t jeopardize any team deadlines.',
        quality: 'optimal',
        points: 5,
        feedback: 'Responsible approach balancing professional development with delivery accountability.'
      },
      {
        id: 'opt-b',
        text: 'Abandon critical production bugs without telling anyone to sit in the presentation.',
        quality: 'weak',
        points: 1,
        feedback: 'Irresponsible.'
      },
      {
        id: 'opt-c',
        text: 'Never attend any learning sessions because engineers should only stare at code.',
        quality: 'weak',
        points: 2,
        feedback: 'Overly rigid; misses valuable company mentorship.'
      },
      {
        id: 'opt-d',
        text: 'Go to the talk and fall asleep in the front row.',
        quality: 'weak',
        points: 0,
        feedback: 'Disrespectful.'
      }
    ],
    correctOptionId: 'opt-a'
  },
  {
    id: 'hr-work-62',
    mode: 'workplace-situations',
    category: 'Workplace Scenarios',
    difficulty: 'Intermediate',
    type: 'multiple-choice',
    question: 'A teammate writes a Slack message criticizing your pull request in an unnecessarily harsh and sarcastic tone. How do you respond?',
    recommendedFramework: 'Defuse Emotion & Focus on Technical Substance: Do not retaliate sarcastically. Extract the technical point and suggest a quick voice sync.',
    interviewerIntent: 'Assesses emotional composure, avoiding online flame wars, and de-escalating tension.',
    idealTakeaway: 'Respond calmly to the technical merit: "Thanks for highlighting this edge case. Let’s hop on a 5-minute huddle to align on the best implementation."',
    hint: 'Ignore the emotional bite. Address the technical critique objectively and suggest a quick voice sync to defuse friction.',
    points: 5,
    options: [
      {
        id: 'opt-a',
        text: 'Stay calm and avoid retaliating sarcastically. Address the valid technical points objectively, and suggest a 5-minute quick huddle to align on the code changes.',
        quality: 'optimal',
        points: 5,
        feedback: 'Masterful emotional maturity. Prevents chat flame wars and focuses on code quality.'
      },
      {
        id: 'opt-b',
        text: 'Reply with even harsher sarcasm and insult their coding history in public.',
        quality: 'weak',
        points: 0,
        feedback: 'Guaranteed to escalate into HR disciplinary action.'
      },
      {
        id: 'opt-c',
        text: 'Delete their Slack account if you have admin privileges.',
        quality: 'weak',
        points: 0,
        feedback: 'Gross misuse of credentials.'
      },
      {
        id: 'opt-d',
        text: 'Close the pull request and refuse to write code for the company.',
        quality: 'weak',
        points: 1,
        feedback: 'Childish.'
      }
    ],
    correctOptionId: 'opt-a'
  },
  {
    id: 'hr-work-63',
    mode: 'workplace-situations',
    category: 'Workplace Scenarios',
    difficulty: 'Advanced',
    type: 'typed',
    question: 'You notice that a legacy cron job runs every night and sends customer email digests without verifying opt-out unsubscribes. What is your response?',
    scenarioContext: 'This violates consumer anti-spam laws (CAN-SPAM / GDPR) and has been running for 2 years unnoticed.',
    recommendedFramework: 'Immediate Risk Flagging + Quick Fix + Documentation: Flag the regulatory violation, propose an opt-out filter check, and test before the next scheduled run.',
    interviewerIntent: 'Assesses compliance awareness, proactive responsibility, and protecting company reputation.',
    idealTakeaway: 'Alert the lead and product manager, write a patch checking unsubscribe flags, and run unit tests prior to the next cron trigger.',
    hint: 'Flag compliance risk immediately, implement the unsubscribe check, and test thoroughly.',
    points: 5,
    rubric: {
      keywords: ['compliance', 'unsubscribe', 'opt-out', 'cron', 'privacy', 'patch', 'lead', 'test', 'regulatory', 'fix'],
      minWords: 30,
      targetWords: 70,
      structuralAspects: ['Identification of regulatory non-compliance', 'Notification of team lead/PM', 'Implementing and testing opt-out filter'],
      starElements: {
        situationTask: 'Discovery of cron job bypassing email unsubscribe flags',
        action: 'Flagged compliance violation, created filtering patch, verified with test suite',
        result: 'Safeguarded company compliance and respected customer preferences'
      }
    }
  },
  {
    id: 'hr-work-64',
    mode: 'workplace-situations',
    category: 'Workplace Scenarios',
    difficulty: 'Beginner',
    type: 'multiple-choice',
    question: 'You finish all your sprint tickets 3 days before the sprint ends. What is the most proactive move?',
    recommendedFramework: 'Team Value & Technical Health: Help unblock teammates, tackle technical debt or bug backlog, and notify lead of available bandwidth.',
    interviewerIntent: 'Checks if you slack off when done or contribute to team velocity and backlog health.',
    idealTakeaway: 'Notify your lead of capacity, review peer PRs, write missing tests, or pull in the next priority bug ticket.',
    hint: 'Offer help to teammates, tackle tech debt, or pull in small backlog tickets after checking with your lead.',
    points: 5,
    options: [
      {
        id: 'opt-a',
        text: 'Inform my lead that I have finished my tickets, review pending pull requests from teammates, and offer to pick up a stretch goal or address tech debt from the backlog.',
        quality: 'optimal',
        points: 5,
        feedback: 'Top-tier proactive engineer behavior.'
      },
      {
        id: 'opt-b',
        text: 'Pretend the tickets are still in progress and play video games for 3 days.',
        quality: 'weak',
        points: 1,
        feedback: 'Dishonest and limits your own growth.'
      },
      {
        id: 'opt-c',
        text: 'Start redesigning random parts of the codebase without asking anyone.',
        quality: 'weak',
        points: 2,
        feedback: 'Uncoordinated churn.'
      },
      {
        id: 'opt-d',
        text: 'Go home for 3 days without informing anyone.',
        quality: 'weak',
        points: 0,
        feedback: 'Absenteeism.'
      }
    ],
    correctOptionId: 'opt-a'
  },
  {
    id: 'hr-work-65',
    mode: 'workplace-situations',
    category: 'Workplace Scenarios',
    difficulty: 'Intermediate',
    type: 'multiple-choice',
    question: 'You attend an engineering all-hands meeting and the CTO asks for questions or feedback on recent developer tooling. You noticed an issue. How do you voice it?',
    recommendedFramework: 'Constructive Feedback with Specific Examples: Express appreciation for the initiative, share the specific bottleneck observed, and suggest an actionable improvement.',
    interviewerIntent: 'Assesses executive communication, constructive feedback, and professional confidence.',
    idealTakeaway: 'Be constructive, respectful, and concise: state the observation with data and offer a helpful suggestion.',
    hint: 'Be concise, constructive, and pair the observation with a positive suggestion.',
    points: 5,
    options: [
      {
        id: 'opt-a',
        text: 'Ask respectfully: "Thank you for the tooling upgrades. We noticed local build times increased by 40% with the new bundler; could we consider adding distributed caching or a benchmark suite to optimize it?"',
        quality: 'optimal',
        points: 5,
        feedback: 'Constructive, data-informed, and solutions-oriented.'
      },
      {
        id: 'opt-b',
        text: 'Shout: "The new tooling is completely broken and everyone hates it!"',
        quality: 'weak',
        points: 0,
        feedback: 'Aggressive and non-constructive.'
      },
      {
        id: 'opt-c',
        text: 'Stay silent and complain to peers in private channels.',
        quality: 'acceptable',
        points: 2,
        feedback: 'Misses the opportunity to contribute positively to engineering improvements.'
      },
      {
        id: 'opt-d',
        text: 'Ask when the company will buy everyone new iPhones.',
        quality: 'weak',
        points: 1,
        feedback: 'Completely off-topic.'
      }
    ],
    correctOptionId: 'opt-a'
  },

  // ==========================================
  // MODE D: DIFFICULT HR ROUND (66-80)
  // ==========================================
  {
    id: 'hr-diff-66',
    mode: 'difficult-hr',
    category: 'Difficult HR & Salary',
    difficulty: 'Advanced',
    type: 'typed',
    question: 'Your academic CGPA is lower than the typical placement cutoff for our company (or has a noticeable dip in semester 4). How do you explain this honestly without making excuses?',
    recommendedFramework: 'Acknowledge + Reflection + Upward Trajectory / Practical Proof: Acknowledge the dip honestly, explain the challenge faced, and demonstrate subsequent academic and technical rebound.',
    interviewerIntent: 'Checks if you make excuses or take personal ownership and demonstrate an upward rebound trajectory.',
    idealTakeaway: 'Own the dip, explain how you adjusted your study and time-management habits, and point to recent project work or improved grades.',
    hint: 'Do not blame teachers or exams. Own the challenge, explain the adjustment made, and highlight your technical rebound.',
    points: 5,
    rubric: {
      keywords: ['cgpa', 'ownership', 'adjusted', 'learned', 'improved', 'skills', 'balance', 'rebound', 'projects', 'habit'],
      minWords: 30,
      targetWords: 70,
      structuralAspects: ['Honest acknowledgment without external blame', 'Reflection on root cause (e.g. balancing commitments or foundational shift)', 'Evidence of positive turnaround and practical coding capability'],
      starElements: {
        situationTask: 'Academic performance dip during university coursework',
        action: 'Re-engineered study schedule, sought peer tutoring, balanced project work',
        result: 'Upward grade trajectory and strong hands-on technical project outcomes'
      }
    }
  },
  {
    id: 'hr-diff-67',
    mode: 'difficult-hr',
    category: 'Difficult HR & Salary',
    difficulty: 'Advanced',
    type: 'multiple-choice',
    question: 'Why should we hire you when there are candidates from premier IIT/NIT institutes with higher competitive programming rankings applying for the same role?',
    recommendedFramework: 'Humility + Unique Strengths + High Ownership: Acknowledge premier candidates respectfully, then highlight your relentless work ethic, project execution, and fast onboarding velocity.',
    interviewerIntent: 'Tests confidence under pressure, absence of inferiority complex, and self-worth grounded in real achievements.',
    idealTakeaway: 'Respect other candidates while articulating your unique strengths: end-to-end project building, collaborative grit, and rapid adaptability.',
    hint: 'Never disparage premier colleges. Highlight your practical project shipping experience and hungry work ethic.',
    points: 5,
    options: [
      {
        id: 'opt-a',
        text: 'I have immense respect for candidates from premier institutes. What I offer is a relentless work ethic, proven ability to ship full-stack applications from scratch, and a deep hunger to learn. My projects demonstrate that when given a problem, I research, build, and deliver reliable solutions.',
        quality: 'optimal',
        points: 5,
        feedback: 'Classy, confident, respectful of peers, and grounded in practical value.'
      },
      {
        id: 'opt-b',
        text: 'Candidates from top institutes are all bookish nerds who cannot write real production code.',
        quality: 'weak',
        points: 0,
        feedback: 'Arrogant, insecure, and factually baseless.'
      },
      {
        id: 'opt-c',
        text: 'You shouldn’t hire me; you should hire them because they are from better colleges.',
        quality: 'weak',
        points: 1,
        feedback: 'Defeatist and shows zero self-belief.'
      },
      {
        id: 'opt-d',
        text: 'Because my uncle knows your executive director.',
        quality: 'weak',
        points: 0,
        feedback: 'Nepotistic and inappropriate.'
      }
    ],
    correctOptionId: 'opt-a'
  },
  {
    id: 'hr-diff-68',
    mode: 'difficult-hr',
    category: 'Difficult HR & Salary',
    difficulty: 'Advanced',
    type: 'typed',
    question: 'You took a gap year after high school (or have an academic gap). Recruiters often ask about this. How do you describe this period authentically and constructively?',
    recommendedFramework: 'Clarity + Productive Growth + Re-energized Focus: State the reason clearly (exam preparation, personal development, family responsibility) and describe the maturity and skills gained.',
    interviewerIntent: 'Assesses whether the gap was intentional and productive, and checks for honest storytelling.',
    idealTakeaway: 'Be completely honest: explain the purpose of the gap, how it matured your discipline, and how you entered engineering with clarity.',
    hint: 'Be honest about the gap’s purpose, what skills or perspective you developed, and your re-energized focus.',
    points: 5,
    rubric: {
      keywords: ['gap', 'reflection', 'clarity', 'skills', 'prepare', 'learning', 'discipline', 'mature', 'perspective', 'focus'],
      minWords: 30,
      targetWords: 65,
      structuralAspects: ['Honest, matter-of-fact reason for gap', 'Productive activities or skills cultivated during the period', 'Renewed clarity and commitment upon entering engineering'],
      starElements: {
        situationTask: 'Gap year between academic phases',
        action: 'Used time for focused preparation, learning discipline, and personal maturation',
        result: 'Entered engineering degree with clear intent and sustained dedication'
      }
    }
  },
  {
    id: 'hr-diff-69',
    mode: 'difficult-hr',
    category: 'Difficult HR & Salary',
    difficulty: 'Advanced',
    type: 'multiple-choice',
    question: 'If you receive an offer from our company today, but tomorrow your dream company (e.g. Google or Microsoft) calls you for interviews, what will you do?',
    recommendedFramework: 'Professional Integrity & Commitment: Honor commitments; evaluate offer thoroughly before signing, and once committed, act with full integrity.',
    interviewerIntent: 'Checks commitment, trustworthiness, and understanding of placement cell acceptance policies.',
    idealTakeaway: 'State that you only interview for companies you are genuinely excited to join. Once you accept an offer, you honor that commitment.',
    hint: 'Reiterate your commitment: if you accept an offer, you commit wholeheartedly and honor the placement agreement.',
    points: 5,
    options: [
      {
        id: 'opt-a',
        text: 'I only interview with organizations where I am genuinely excited to build my career. If I accept an offer with you, I consider my word and commitment binding, and I will dedicate 100% of my energy to succeeding on your team.',
        quality: 'optimal',
        points: 5,
        feedback: 'Exemplifies professional integrity and reliable commitment.'
      },
      {
        id: 'opt-b',
        text: 'I will accept your offer as a backup, and immediately ghost your company the second any higher paying company calls.',
        quality: 'weak',
        points: 0,
        feedback: 'Extremely unprofessional; damages college placement relationships.'
      },
      {
        id: 'opt-c',
        text: 'I will take both jobs and try to work both secretly at the same time.',
        quality: 'weak',
        points: 0,
        feedback: 'Moonlighting breach of contract.'
      },
      {
        id: 'opt-d',
        text: 'I will ask you to match Google’s salary on the spot.',
        quality: 'weak',
        points: 1,
        feedback: 'Unrealistic and arrogant.'
      }
    ],
    correctOptionId: 'opt-a'
  },
  {
    id: 'hr-diff-70',
    mode: 'difficult-hr',
    category: 'Difficult HR & Salary',
    difficulty: 'Advanced',
    type: 'typed',
    question: 'Tell me about a time you worked under a leader, manager, or professor whose management style you strongly disagreed with. How did you navigate the relationship?',
    recommendedFramework: 'STAR Method + Empathy + Professional Boundary: Focus on understanding their expectations, maintaining clear deliverables, and delivering quality work.',
    interviewerIntent: 'Assesses whether you badmouth authority or adapt professionally to difficult managerial dynamics.',
    idealTakeaway: 'Never insult the former manager. Focus on adapting to their communication style (e.g., frequent status updates) to build trust.',
    hint: 'Focus on communication adjustments (e.g. detailed status notes) rather than personal character attacks.',
    points: 5,
    rubric: {
      keywords: ['communication', 'expectations', 'adapt', 'respectful', 'deliver', 'style', 'align', 'professional', 'trust', 'result'],
      minWords: 30,
      targetWords: 70,
      structuralAspects: ['Objective description of managerial friction without personal attacks', 'Personal adaptation strategy (e.g. proactive updates, written documentation)', 'Successful project completion and relationship stabilization'],
      starElements: {
        situationTask: 'Challenging working relationship with a demanding supervisor',
        action: 'Adapted to their communication preference, provided frequent status checkpoints',
        result: 'Delivered high-quality project and built mutual respect'
      }
    }
  },
  {
    id: 'hr-diff-71',
    mode: 'difficult-hr',
    category: 'Difficult HR & Salary',
    difficulty: 'Intermediate',
    type: 'multiple-choice',
    question: 'What would you do if you were placed on a Performance Improvement Plan (PIP) after your first 6 months?',
    recommendedFramework: 'Coachability & Structured Turnaround: Seek specific metric feedback, align with manager on weekly checkpoints, and execute relentlessly.',
    interviewerIntent: 'Tests resilience, humility, and whether constructive criticism makes you defensive or driven to improve.',
    idealTakeaway: 'Take it as an urgent, clear wake-up call. Seek concrete measurable goals, request weekly feedback, and close the gaps.',
    hint: 'Seek concrete feedback, align on measurable checkpoints, and focus on execution.',
    points: 5,
    options: [
      {
        id: 'opt-a',
        text: 'I would view it as an urgent opportunity to course-correct: schedule a detailed session with my manager to understand specific performance gaps, create measurable weekly milestones, and work relentlessly to exceed the turnaround benchmarks.',
        quality: 'optimal',
        points: 5,
        feedback: 'Demonstrates outstanding maturity, grit, and coachability.'
      },
      {
        id: 'opt-b',
        text: 'I would scream at the manager and threaten legal action for bias.',
        quality: 'weak',
        points: 0,
        feedback: 'Disastrous reaction.'
      },
      {
        id: 'opt-c',
        text: 'I would immediately stop working and wait to be fired.',
        quality: 'weak',
        points: 1,
        feedback: 'Defeatist.'
      },
      {
        id: 'opt-d',
        text: 'I would post negative reviews of the company on social media.',
        quality: 'weak',
        points: 0,
        feedback: 'Unprofessional.'
      }
    ],
    correctOptionId: 'opt-a'
  },
  {
    id: 'hr-diff-72',
    mode: 'difficult-hr',
    category: 'Difficult HR & Salary',
    difficulty: 'Advanced',
    type: 'multiple-choice',
    question: 'How do you respond if an interviewer asks: "What is your biggest regret from your college engineering years?"',
    recommendedFramework: 'Constructive Reflection + Corrective Action: Share a genuine developmental reflection (e.g., wishing you started contributing to open-source earlier) and what you did about it.',
    interviewerIntent: 'Measures depth of self-reflection and whether you learn from missed opportunities.',
    idealTakeaway: 'Choose an authentic regret related to skill development (e.g. contributing to open-source sooner), and show how you are rectifying it now.',
    hint: 'Choose a genuine learning regret and explain how it drives your current dedication.',
    points: 5,
    options: [
      {
        id: 'opt-a',
        text: 'My genuine reflection is that I wish I had started contributing to real-world open-source software and hackathons earlier in my 1st year instead of focusing solely on textbook exams. Once I realized this in 3rd year, I actively built and shipped hands-on full-stack apps.',
        quality: 'optimal',
        points: 5,
        feedback: 'Authentic, reflective, and concludes with a strong proactive remedy.'
      },
      {
        id: 'opt-b',
        text: 'My only regret is that I chose this college because the faculty was terrible.',
        quality: 'weak',
        points: 1,
        feedback: 'Unprofessional blaming of your institution.'
      },
      {
        id: 'opt-c',
        text: 'I have zero regrets because I am always 100% perfect in every decision.',
        quality: 'weak',
        points: 1,
        feedback: 'Displays complete lack of self-awareness.'
      },
      {
        id: 'opt-d',
        text: 'My regret is that I didn’t party more and study less.',
        quality: 'weak',
        points: 1,
        feedback: 'Inappropriate for a professional interview.'
      }
    ],
    correctOptionId: 'opt-a'
  },
  {
    id: 'hr-diff-73',
    mode: 'difficult-hr',
    category: 'Difficult HR & Salary',
    difficulty: 'Intermediate',
    type: 'multiple-choice',
    question: 'What if you work on a project for 6 months and management cancels it due to shifting business priorities?',
    recommendedFramework: 'Business Pragmatism + Technical Takeaway: Accept that market priorities evolve; celebrate transferable technical knowledge gained.',
    interviewerIntent: 'Tests resilience when engineering work is cancelled due to commercial realities.',
    idealTakeaway: 'Acknowledge commercial realities gracefully. The code might be shelved, but the architectural and teamwork learnings remain permanent.',
    hint: 'Recognize that business needs change; focus on the valuable engineering lessons gained.',
    points: 5,
    options: [
      {
        id: 'opt-a',
        text: 'I understand that market conditions and company strategies change. While it is disappointing to see code shelved, the technical architecture, testing patterns, and collaboration experience gained remain permanent assets that I can apply to the next initiative.',
        quality: 'optimal',
        points: 5,
        feedback: 'Healthy, mature business perspective.'
      },
      {
        id: 'opt-b',
        text: 'I would resign immediately because cancelling my project is a personal insult.',
        quality: 'weak',
        points: 1,
        feedback: 'Immature understanding of how corporate businesses operate.'
      },
      {
        id: 'opt-c',
        text: 'I would keep working on the cancelled project secretly instead of my assigned tasks.',
        quality: 'weak',
        points: 1,
        feedback: 'Defiant and misaligns with company strategy.'
      },
      {
        id: 'opt-d',
        text: 'I would delete all the source code so nobody can ever use it.',
        quality: 'weak',
        points: 0,
        feedback: 'Willful destruction of company property.'
      }
    ],
    correctOptionId: 'opt-a'
  },
  {
    id: 'hr-diff-74',
    mode: 'difficult-hr',
    category: 'Difficult HR & Salary',
    difficulty: 'Advanced',
    type: 'typed',
    question: 'How would you handle a situation where you discover that your manager is publicly taking credit for an architectural innovation that you personally designed and coded?',
    recommendedFramework: 'Diplomatic Verification + Private Alignment + Evidence Trails: Ensure your technical documentation and commit history clearly reflect your work, and discuss career visibility with your manager.',
    interviewerIntent: 'Assesses executive poise, avoiding hasty confrontations, and protecting career visibility professionally.',
    idealTakeaway: 'Keep calm. Use commit logs, pull request documentation, and design docs as natural artifacts of your work, and request opportunities to present your modules in future reviews.',
    hint: 'Rely on natural engineering artifacts (PRs, commits, docs) and have a constructive 1-on-1 on career visibility.',
    points: 5,
    rubric: {
      keywords: ['commits', 'documentation', '1-on-1', 'visibility', 'professional', 'dialogue', 'evidence', 'credit', 'calm', 'future'],
      minWords: 30,
      targetWords: 70,
      structuralAspects: ['Maintaining emotional composure', 'Relying on objective engineering artifacts (git commits, design docs)', 'Constructive 1-on-1 conversation regarding visibility and growth'],
      starElements: {
        situationTask: 'Manager presenting your technical contribution without visibility',
        action: 'Maintained thorough documentation, had private discussion requesting presentation visibility',
        result: 'Secured direct visibility in subsequent architectural reviews'
      }
    }
  },
  {
    id: 'hr-diff-75',
    mode: 'difficult-hr',
    category: 'Difficult HR & Salary',
    difficulty: 'Intermediate',
    type: 'multiple-choice',
    question: 'If you are asked to sign a 2-year service agreement (bond) with financial penalty clauses, how do you evaluate it?',
    recommendedFramework: 'Informed & Objective Evaluation: Review terms thoroughly, assess career growth and company stability, and consult placement cell guidelines.',
    interviewerIntent: 'Checks maturity regarding legal employment contracts and understanding campus agreements.',
    idealTakeaway: 'Read the agreement carefully, ensure terms are reasonable and legal, and verify alignment with college placement cell policies.',
    hint: 'Review terms objectively against learning opportunities and consult placement cell guidelines.',
    points: 5,
    options: [
      {
        id: 'opt-a',
        text: 'I would review the contract terms thoroughly in alignment with our college placement cell guidelines, evaluate the training and mentorship quality provided, and make an informed decision ensuring I can honor the commitment with integrity.',
        quality: 'optimal',
        points: 5,
        feedback: 'Prudent, mature, and legally sensible.'
      },
      {
        id: 'opt-b',
        text: 'Sign it blindly without reading anything.',
        quality: 'weak',
        points: 1,
        feedback: 'Careless legal hygiene.'
      },
      {
        id: 'opt-c',
        text: 'Sign it with a fake signature so you can break it later.',
        quality: 'weak',
        points: 0,
        feedback: 'Fraudulent behavior.'
      },
      {
        id: 'opt-d',
        text: 'Demand that the company remove all contracts solely for you.',
        quality: 'weak',
        points: 1,
        feedback: 'Unrealistic for standard campus intake policies.'
      }
    ],
    correctOptionId: 'opt-a'
  },
  {
    id: 'hr-diff-76',
    mode: 'difficult-hr',
    category: 'Difficult HR & Salary',
    difficulty: 'Advanced',
    type: 'multiple-choice',
    question: 'How do you handle being rejected from multiple consecutive campus placement interviews before this round?',
    recommendedFramework: 'Resilience + Feedback Synthesis + Iteration: Treat rejections as data points, identify technical and communication gaps, and refine your preparation.',
    interviewerIntent: 'Tests resilience, mental grit, and whether adversity crushes you or refines you.',
    idealTakeaway: 'Rejections are feedback. Detail how you analyzed past interview mistakes, improved coding speed, and refined your communication.',
    hint: 'Frame rejections as learning data: identify the gap, practice deliberately, and return stronger.',
    points: 5,
    options: [
      {
        id: 'opt-a',
        text: 'I treated each rejection as diagnostic data: I noted questions where I hesitated, practiced those technical and communication areas deliberately, and returned to each subsequent drive more refined, composed, and prepared.',
        quality: 'optimal',
        points: 5,
        feedback: 'Inspiring growth mindset and authentic resilience.'
      },
      {
        id: 'opt-b',
        text: 'I blamed the placement cell and accused all previous recruiters of favoritism.',
        quality: 'weak',
        points: 0,
        feedback: 'Bitter and toxic victim mentality.'
      },
      {
        id: 'opt-c',
        text: 'I gave up on engineering and stopped studying.',
        quality: 'weak',
        points: 1,
        feedback: 'Defeatist.'
      },
      {
        id: 'opt-d',
        text: 'I lied about my answers in the next interviews.',
        quality: 'weak',
        points: 0,
        feedback: 'Dishonest.'
      }
    ],
    correctOptionId: 'opt-a'
  },
  {
    id: 'hr-diff-77',
    mode: 'difficult-hr',
    category: 'Difficult HR & Salary',
    difficulty: 'Intermediate',
    type: 'multiple-choice',
    question: 'What if your manager gives you a performance rating lower than what you believe you deserved at year-end appraisal?',
    recommendedFramework: 'Data-Driven Inquiry + Alignment on Expectations: Request a constructive 1-on-1 to review specific benchmarks, understand the gap, and create an agreed roadmap.',
    interviewerIntent: 'Measures emotional composure and seeking constructive feedback rather than throwing tantrums.',
    idealTakeaway: 'Schedule a constructive 1-on-1: review expectations, ask for specific examples of gaps, and define measurable benchmarks for the next cycle.',
    hint: 'Request a constructive 1-on-1 to understand specific gaps and set clear benchmarks for the future.',
    points: 5,
    options: [
      {
        id: 'opt-a',
        text: 'I would schedule a constructive 1-on-1 to understand the specific gaps between my self-assessment and the manager’s evaluation, listen objectively to feedback, and establish clear measurable benchmarks for the next review cycle.',
        quality: 'optimal',
        points: 5,
        feedback: 'Professional, mature, and forward-looking.'
      },
      {
        id: 'opt-b',
        text: 'Storm out of the meeting, slam the door, and refuse to complete tasks.',
        quality: 'weak',
        points: 0,
        feedback: 'Unprofessional tantrum.'
      },
      {
        id: 'opt-c',
        text: 'Cry in front of the manager to make them feel guilty.',
        quality: 'weak',
        points: 1,
        feedback: 'Manipulative.'
      },
      {
        id: 'opt-d',
        text: 'Post salary and appraisal complaints on social media.',
        quality: 'weak',
        points: 0,
        feedback: 'Breaches company policy.'
      }
    ],
    correctOptionId: 'opt-a'
  },
  {
    id: 'hr-diff-78',
    mode: 'difficult-hr',
    category: 'Difficult HR & Salary',
    difficulty: 'Advanced',
    type: 'typed',
    question: 'If you could change one thing about how your university conducts engineering education, what would it be and why?',
    recommendedFramework: 'Constructive Critique + Practical Educational Solution: Suggest integrating more industry-standard CI/CD and open-source code reviews alongside theoretical algorithms.',
    interviewerIntent: 'Tests critical thinking and ability to offer constructive systemic critique without petty complaints.',
    idealTakeaway: 'Propose more continuous integration, automated unit testing, and collaborative open-source team projects alongside traditional exams.',
    hint: 'Suggest more practical industry workflows (like CI/CD, code reviews, and Git collaboration) alongside theoretical math/DSA.',
    points: 5,
    rubric: {
      keywords: ['industry', 'practical', 'hands-on', 'code review', 'ci/cd', 'collaboration', 'projects', 'real-world', 'constructive', 'improve'],
      minWords: 30,
      targetWords: 70,
      structuralAspects: ['Constructive systemic observation', 'Specific practical recommendation (e.g. CI/CD or code reviews)', 'Benefits for student placement readiness'],
      starElements: {
        situationTask: 'Reflecting on curriculum relevance to modern software engineering',
        action: 'Proposed integrating automated testing and collaborative code reviews into labs',
        result: 'Students graduate with enterprise-ready development hygiene'
      }
    }
  },
  {
    id: 'hr-diff-79',
    mode: 'difficult-hr',
    category: 'Difficult HR & Salary',
    difficulty: 'Intermediate',
    type: 'multiple-choice',
    question: 'What if you find out a fellow fresher on your team with identical qualifications was offered a 15% higher starting bonus?',
    recommendedFramework: 'Focus on Personal Value & Performance: Avoid toxic salary comparisons; focus on your own performance reviews and delivering value that warrants raises.',
    interviewerIntent: 'Tests focus on personal performance vs envy and toxic peer comparisons.',
    idealTakeaway: 'Compensation differences exist due to hiring timing or interview scores. Focus on outperforming in your role, and let your results speak at appraisal time.',
    hint: 'Stay focused on your own performance and career growth rather than toxic peer comparisons.',
    points: 5,
    options: [
      {
        id: 'opt-a',
        text: 'I would stay focused on my own growth and performance. Initial variations happen due to timing or college bands; what truly determines long-term compensation is the value and technical impact I deliver on the job.',
        quality: 'optimal',
        points: 5,
        feedback: 'Mature, secure, and focused on self-efficacy.'
      },
      {
        id: 'opt-b',
        text: 'Confront the peer and demand that they pay you the difference.',
        quality: 'weak',
        points: 0,
        feedback: 'Absurd and inappropriate.'
      },
      {
        id: 'opt-c',
        text: 'Slap the manager’s desk and demand an immediate matching bonus on day one.',
        quality: 'weak',
        points: 1,
        feedback: 'Entitled and aggressive.'
      },
      {
        id: 'opt-d',
        text: 'Slow down your work output by 15% to match the pay gap.',
        quality: 'weak',
        points: 1,
        feedback: 'Petty and destroys your appraisal chances.'
      }
    ],
    correctOptionId: 'opt-a'
  },
  {
    id: 'hr-diff-80',
    mode: 'difficult-hr',
    category: 'Difficult HR & Salary',
    difficulty: 'Advanced',
    type: 'multiple-choice',
    question: 'Why do you believe you are ready to transition from a student into a full-time enterprise software engineer?',
    recommendedFramework: 'Maturity + Accountability + Continuous Value Delivery: Transitioning from guidance-dependent homework to taking proactive ownership of production software.',
    interviewerIntent: 'Measures readiness for corporate accountability, autonomy, and professional responsibility.',
    idealTakeaway: 'Emphasize that as a student you wrote code for grades; as an engineer you take ownership of systems that real users and businesses rely on.',
    hint: 'Explain the shift from writing code for grades to taking ownership of production reliability and team outcomes.',
    points: 5,
    options: [
      {
        id: 'opt-a',
        text: 'As a student, the goal was writing code to pass exams; as an engineer, my responsibility is writing reliable, maintainable software that solves real user problems. I have built the debugging discipline, accountability, and communication habits needed to be a dependable team contributor.',
        quality: 'optimal',
        points: 5,
        feedback: 'The perfect concluding statement for an HR interview.'
      },
      {
        id: 'opt-b',
        text: 'Because I finished 4 years of college and by law companies are supposed to employ graduates.',
        quality: 'weak',
        points: 1,
        feedback: 'Entitled mindset.'
      },
      {
        id: 'opt-c',
        text: 'I am not ready at all and expect seniors to do my job for me.',
        quality: 'weak',
        points: 1,
        feedback: 'Signals immediate hiring risk.'
      },
      {
        id: 'opt-d',
        text: 'Because I need money to buy a motorcycle.',
        quality: 'weak',
        points: 1,
        feedback: 'Fails to address professional competence or responsibility.'
      }
    ],
    correctOptionId: 'opt-a'
  }
];

export const HR_INTERVIEW_QUESTIONS = STARTER_HR_QUESTIONS;
