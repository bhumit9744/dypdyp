export type BugDifficulty = 'Beginner' | 'Intermediate' | 'Advanced' | 'Mixed';

export type BugLanguage = 'Python' | 'Java' | 'C++' | 'JavaScript' | 'Mixed';

export type BugCategory =
  | 'Syntax'
  | 'Logic'
  | 'Runtime'
  | 'Edge Cases'
  | 'Algorithms'
  | 'Mixed';

export type BugGameMode =
  | 'find-bug'           // Mode A: Identify faulty line, category & diagnosis
  | 'fix-code'           // Mode B: Inspect & select correct fix/replacement
  | 'test-detective'     // Mode C: Identify the test case exposing the bug
  | 'sprint';            // Mode D: Rapid timed debugging sprint

export interface BugTestCase {
  id: string;
  name: string;
  input: string;
  expectedOutput: string;
  actualWithBug: string;
  exposesBug: boolean;
  explanation: string;
}

export interface BugFixOption {
  id: string;
  codeSnippet: string;
  explanation: string;
  isCorrect: boolean;
  diffSummary?: string;
}

export interface BugChallenge {
  id: string;
  title: string;
  language: Exclude<BugLanguage, 'Mixed'>;
  difficulty: Exclude<BugDifficulty, 'Mixed'>;
  category: Exclude<BugCategory, 'Mixed'>;
  problemStatement: string;
  expectedBehavior: string;
  actualBehavior: string;
  faultyCode: string;
  faultyLineNumber: number; // 1-indexed
  bugOptions: {
    category: Exclude<BugCategory, 'Mixed'>;
    explanation: string;
    isCorrect: boolean;
  }[];
  fixOptions: BugFixOption[];
  correctedCode: string;
  correctDiagnosis: string;
  whyOriginalFailed: string;
  whyFixWorks: string;
  testCases: BugTestCase[];
  exposingTestCaseId: string;
  hints: [
    { text: string; penalty: number },
    { text: string; penalty: number },
    { text: string; penalty: number }
  ];
  points: number;
  timeLimitSeconds?: number;
  interviewTip: string;
}

export interface BugHunterConfig {
  mode: BugGameMode;
  language: BugLanguage;
  difficulty: BugDifficulty;
  category: BugCategory;
  challengeCount: 5 | 10 | 15;
}

export interface BugAttemptRecord {
  challengeId: string;
  selectedLine?: number | null;
  selectedCategory?: string | null;
  selectedDiagnosisIndex?: number | null;
  selectedFixId?: string | null;
  selectedTestCaseId?: string | null;
  isCorrect: boolean;
  hintsUsed: number;
  hintsPenalty: number;
  pointsEarned: number;
  maxPoints: number;
  timeSpentSeconds: number;
}

export interface BugHunterResultData {
  id: string;
  timestamp: number;
  config: BugHunterConfig;
  totalChallenges: number;
  correctCount: number;
  incorrectCount: number;
  score: number;
  maxScore: number;
  accuracy: number;
  totalHintsUsed: number;
  totalPenalty: number;
  timeTakenSeconds: number;
  xpEarned: number;
  attempts: BugAttemptRecord[];
  categoryBreakdown: {
    category: string;
    total: number;
    correct: number;
    accuracy: number;
  }[];
  languageBreakdown: {
    language: string;
    total: number;
    correct: number;
    accuracy: number;
  }[];
  strongAreas: string[];
  weakAreas: string[];
}

export interface UserBugHunterStats {
  totalSessionsCompleted: number;
  totalChallengesAttempted: number;
  totalCorrect: number;
  overallAccuracy: number;
  totalXpEarned: number;
  bestScore: number;
  bestSprintScore: number;
  recentAttempts: BugHunterResultData[];
  categoryStats: Record<string, { attempted: number; correct: number }>;
  languageStats: Record<string, { attempted: number; correct: number }>;
  modeStats: Record<string, { attempted: number; correct: number }>;
}
