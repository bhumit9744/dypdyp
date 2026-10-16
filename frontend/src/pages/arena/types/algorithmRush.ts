export type AlgorithmGameMode =
  | 'quick-solve'
  | 'complexity-clash'
  | 'pattern-match'
  | 'rush-ladder';

export type AlgorithmDifficulty = 'Beginner' | 'Intermediate' | 'Advanced' | 'Mixed';

export type AlgorithmTopic =
  | 'Arrays & Strings'
  | 'Searching & Sorting'
  | 'Hashing'
  | 'Linked Lists'
  | 'Stacks & Queues'
  | 'Trees & Graphs'
  | 'Recursion & Backtracking'
  | 'Greedy Algorithms'
  | 'Dynamic Programming'
  | 'Mixed DSA';

export type AlgorithmLanguage =
  | 'Language-Independent'
  | 'Python'
  | 'Java'
  | 'C++'
  | 'JavaScript';

export interface AlgorithmOption {
  id: string;
  label: string;
  codeSnippet?: string;
  explanation: string;
  isCorrect: boolean;
}

export interface AlgorithmHint {
  text: string;
  penalty: number;
}

export interface AlgorithmExample {
  input: string;
  output: string;
  explanation?: string;
}

export interface AlgorithmChallenge {
  id: string;
  title: string;
  mode: AlgorithmGameMode;
  topic: AlgorithmTopic;
  difficulty: AlgorithmDifficulty;
  language: AlgorithmLanguage;
  problemStatement: string;
  codeSnippet?: string;
  inputFormat?: string;
  outputFormat?: string;
  constraints?: string[];
  examples?: AlgorithmExample[];
  edgeCases?: string[];
  options: AlgorithmOption[];
  correctOptionId: string;
  detailedExplanation: string;
  optimalApproach: string;
  timeComplexity: string;
  spaceComplexity: string;
  commonPitfall: string;
  interviewTip: string;
  pattern: string;
  hints: [AlgorithmHint, AlgorithmHint, AlgorithmHint];
  points: number;
  timeLimitSeconds?: number;
}

export interface AlgorithmRushConfig {
  mode: AlgorithmGameMode;
  topic: AlgorithmTopic;
  difficulty: AlgorithmDifficulty;
  challengeCount: 5 | 10 | 15;
  language: AlgorithmLanguage;
}

export interface AlgorithmAttemptRecord {
  challengeId: string;
  selectedOptionId: string | null;
  isCorrect: boolean;
  hintsUsed: number;
  hintsPenalty: number;
  pointsEarned: number;
  maxPoints: number;
  timeSpentSeconds: number;
}

export interface AlgorithmRushResultData {
  id: string;
  timestamp: string;
  config: AlgorithmRushConfig;
  totalChallenges: number;
  correctCount: number;
  score: number;
  maxScore: number;
  accuracy: number;
  xpEarned: number;
  timeTakenSeconds: number;
  hintsUsedCount: number;
  attempts: AlgorithmAttemptRecord[];
  topicBreakdown: { topic: string; total: number; correct: number }[];
  difficultyBreakdown: { difficulty: string; total: number; correct: number }[];
}

export interface UserAlgorithmRushStats {
  totalSessionsCompleted: number;
  totalChallengesAttempted: number;
  totalCorrect: number;
  overallAccuracy: number;
  totalXpEarned: number;
  bestScore: number;
  bestLadderScore: number;
  complexityAccuracy: number;
  patternAccuracy: number;
  recentAttempts: AlgorithmRushResultData[];
  topicStats: Record<string, { attempted: number; correct: number }>;
  modeStats: Record<string, { attempted: number; correct: number }>;
}
