export type QuizDifficulty = 'Beginner' | 'Intermediate' | 'Advanced' | 'Mixed';

export type QuizTopic =
  | 'Programming Fundamentals'
  | 'Object-Oriented Programming'
  | 'Data Structures and Algorithms'
  | 'Database Management Systems'
  | 'Operating Systems'
  | 'Computer Networks'
  | 'Software Engineering'
  | 'Mixed Topics';

export type QuizMode = 'Practice' | 'Timed';

export interface QuizQuestion {
  id: string;
  question: string;
  topic: Exclude<QuizTopic, 'Mixed Topics'>;
  difficulty: Exclude<QuizDifficulty, 'Mixed'>;
  options: [string, string, string, string];
  correctAnswerIndex: number; // 0, 1, 2, or 3
  explanation: string;
  misconception?: string;
  codeSnippet?: string;
  codeLanguage?: string;
  estimatedSeconds?: number;
}

export interface QuizConfig {
  topic: QuizTopic;
  difficulty: QuizDifficulty;
  questionCount: 5 | 10 | 15;
  mode: QuizMode;
  isDailyChallenge?: boolean;
}

export interface UserAnswerRecord {
  questionId: string;
  selectedOptionIndex: number | null; // null if skipped/unanswered
  isCorrect: boolean;
  timeSpentSeconds: number;
}

export interface TopicBreakdown {
  topic: string;
  total: number;
  correct: number;
  accuracy: number;
}

export interface DifficultyBreakdown {
  difficulty: string;
  total: number;
  correct: number;
  accuracy: number;
}

export interface QuizResultData {
  id: string;
  timestamp: number;
  config: QuizConfig;
  totalQuestions: number;
  correctCount: number;
  incorrectCount: number;
  unansweredCount: number;
  score: number;
  maxScore: number;
  accuracy: number;
  timeTakenSeconds: number;
  xpEarned: number;
  userAnswers: UserAnswerRecord[];
  topicBreakdown: TopicBreakdown[];
  difficultyBreakdown: DifficultyBreakdown[];
  performanceSummary: string;
}

export interface UserQuizStats {
  totalQuizzesCompleted: number;
  totalQuestionsAttempted: number;
  totalCorrect: number;
  overallAccuracy: number;
  totalXpEarned: number;
  bestScore: number;
  recentAttempts: QuizResultData[];
  topicStats: Record<string, { attempted: number; correct: number }>;
  difficultyStats: Record<string, { attempted: number; correct: number }>;
}
