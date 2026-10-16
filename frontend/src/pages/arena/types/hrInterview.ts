export type HRGameMode =
  | 'core-interview'
  | 'rapid-fire'
  | 'workplace-situations'
  | 'difficult-hr';

export type HRDifficulty = 'Beginner' | 'Intermediate' | 'Advanced' | 'Mixed';

export type HRCategory =
  | 'Introduction & Motivation'
  | 'Strengths & Weaknesses'
  | 'Teamwork & Collaboration'
  | 'Conflict & Pressure'
  | 'Leadership & Initiative'
  | 'Failure & Accountability'
  | 'Ethics & Integrity'
  | 'Adaptability & Learning'
  | 'Difficult HR & Salary'
  | 'Workplace Scenarios'
  | 'Mixed HR';

export type HRAnswerType = 'multiple-choice' | 'typed';

export interface HROption {
  id: string;
  text: string;
  quality: 'optimal' | 'acceptable' | 'weak';
  points: number; // 0 to 5
  feedback: string;
  critique?: string;
  isOptimal?: boolean;
}

export interface HRRubric {
  keywords: string[];
  minWords: number;
  targetWords: number;
  structuralAspects: string[];
  starElements?: {
    situationTask?: string;
    action?: string;
    result?: string;
  };
}

export interface HRExplanation {
  recruiterIntent: string;
  keyTakeaway: string;
  modelAnswer?: string;
}

export interface HRQuestion {
  id: string;
  mode: HRGameMode;
  category: HRCategory;
  difficulty: HRDifficulty;
  type: HRAnswerType;
  responseType?: HRAnswerType;
  question: string;
  scenarioContext?: string;
  context?: string;
  options?: HROption[];
  correctOptionId?: string; // Highest-scoring option for MC
  recommendedFramework: string; // e.g., 'STAR Method', 'Present-Past-Future', etc.
  interviewerIntent: string; // What the recruiter wants to uncover
  idealTakeaway: string;
  explanation?: HRExplanation;
  scoring?: { maxPoints: number };
  rubric?: HRRubric;
  hint?: string;
  points: number; // Standard 5 points
  timeLimitSeconds?: number;
}

export interface HRConfig {
  mode: HRGameMode;
  category: HRCategory;
  difficulty: HRDifficulty;
  questionCount: 5 | 10 | 15;
  isTimed: boolean;
  hintsEnabled: boolean;
  timedMode?: boolean;
  showHints?: boolean;
}

export type HRInterviewConfig = HRConfig;

export interface HRScoreDimension {
  relevance: number;
  structure: number;
  specificity: number;
  professionalism: number;
  reflection: number;
}

export interface HRAttemptRecord {
  questionId: string;
  answerType: HRAnswerType;
  selectedOptionId?: string | null;
  typedAnswer?: string;
  typedResponse?: string;
  pointsEarned: number;
  score?: number;
  maxPoints: number;
  maxScore?: number;
  isOptimal: boolean;
  hintsUsed?: boolean;
  feedbackText?: string;
  feedbackNotes?: string[];
  dimensionsAssessed?: HRScoreDimension;
  dimensionScores?: {
    relevance: number;
    structure: number;
    specificity: number;
    professionalism: number;
    reflection: number;
  };
  timeSpentSeconds: number;
  strengths?: string[];
  improvements?: string[];
  skipped?: boolean;
}

export type HRQuestionAttempt = HRAttemptRecord;

export interface HRResultData {
  id: string;
  timestamp: string;
  config: HRConfig;
  totalQuestions: number;
  answeredCount: number;
  skippedCount: number;
  score: number;
  maxScore: number;
  maxPossibleScore?: number;
  percentage: number;
  performanceLevel?: string;
  xpEarned: number;
  timeTakenSeconds: number;
  timeSpentSeconds?: number;
  correctCount?: number;
  totalCorrect?: number;
  attempts: HRAttemptRecord[];
  dimensions?: HRScoreDimension;
  categoryScores?: Record<string, { total: number; score: number; maxScore: number }>;
  categoryBreakdown: { category: string; total: number; scoreEarned: number; maxScore: number }[];
  strengths: string[];
  improvements: string[];
}

export type HRInterviewResultData = HRResultData;

export interface UserHRStats {
  totalSessionsCompleted: number;
  totalQuestionsAnswered: number;
  totalScoreEarned: number;
  totalMaxScore: number;
  overallAverage: number;
  totalXpEarned: number;
  bestScore: number;
  recentAttempts: HRResultData[];
  categoryStats: Record<string, { attempted: number; score: number; maxScore: number }>;
  modeStats: Record<string, { attempted: number; score: number; maxScore: number }>;
}
