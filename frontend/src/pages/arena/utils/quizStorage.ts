import {
  QuizConfig,
  QuizQuestion,
  QuizResultData,
  UserAnswerRecord,
  UserQuizStats,
  TopicBreakdown,
  DifficultyBreakdown
} from '../types/quiz';
import { STARTER_QUIZ_QUESTIONS } from '../data/quizQuestions';

const STORAGE_KEY = 'placement_hub_quiz_stats_v1';

export const INITIAL_USER_STATS: UserQuizStats = {
  totalQuizzesCompleted: 0,
  totalQuestionsAttempted: 0,
  totalCorrect: 0,
  overallAccuracy: 0,
  totalXpEarned: 0,
  bestScore: 0,
  recentAttempts: [],
  topicStats: {},
  difficultyStats: {}
};

export function loadUserQuizStats(): UserQuizStats {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_USER_STATS;
    const parsed = JSON.parse(raw);
    return {
      ...INITIAL_USER_STATS,
      ...parsed,
      recentAttempts: Array.isArray(parsed.recentAttempts) ? parsed.recentAttempts : []
    };
  } catch (e) {
    console.error('Failed to load quiz stats from localStorage', e);
    return INITIAL_USER_STATS;
  }
}

export function saveQuizResult(result: QuizResultData): UserQuizStats {
  try {
    const current = loadUserQuizStats();

    const totalQuizzes = current.totalQuizzesCompleted + 1;
    const totalAttempted = current.totalQuestionsAttempted + result.totalQuestions;
    const totalCorrect = current.totalCorrect + result.correctCount;
    const overallAccuracy = totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0;
    const totalXp = current.totalXpEarned + result.xpEarned;
    const bestScore = Math.max(current.bestScore, result.score);

    // Update topic stats
    const updatedTopicStats = { ...current.topicStats };
    result.topicBreakdown.forEach(tb => {
      if (!updatedTopicStats[tb.topic]) {
        updatedTopicStats[tb.topic] = { attempted: 0, correct: 0 };
      }
      updatedTopicStats[tb.topic].attempted += tb.total;
      updatedTopicStats[tb.topic].correct += tb.correct;
    });

    // Update difficulty stats
    const updatedDiffStats = { ...current.difficultyStats };
    result.difficultyBreakdown.forEach(db => {
      if (!updatedDiffStats[db.difficulty]) {
        updatedDiffStats[db.difficulty] = { attempted: 0, correct: 0 };
      }
      updatedDiffStats[db.difficulty].attempted += db.total;
      updatedDiffStats[db.difficulty].correct += db.correct;
    });

    // Keep last 10 attempts
    const updatedAttempts = [result, ...current.recentAttempts].slice(0, 10);

    const updated: UserQuizStats = {
      totalQuizzesCompleted: totalQuizzes,
      totalQuestionsAttempted: totalAttempted,
      totalCorrect,
      overallAccuracy,
      totalXpEarned: totalXp,
      bestScore,
      recentAttempts: updatedAttempts,
      topicStats: updatedTopicStats,
      difficultyStats: updatedDiffStats
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to save quiz result to localStorage', e);
    return loadUserQuizStats();
  }
}

export function clearQuizHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Failed to clear quiz history', e);
  }
}

/**
 * Question difficulty points multiplier
 */
export function getPointsForDifficulty(difficulty: string): number {
  switch (difficulty) {
    case 'Beginner':
      return 10;
    case 'Intermediate':
      return 20;
    case 'Advanced':
      return 30;
    default:
      return 15;
  }
}

/**
 * Filter and assemble questions according to user configuration
 */
export function generateQuizQuestions(config: QuizConfig): QuizQuestion[] {
  let pool = [...STARTER_QUIZ_QUESTIONS];

  // Filter by topic if not mixed
  if (config.topic !== 'Mixed Topics') {
    pool = pool.filter(q => q.topic === config.topic);
  }

  // Filter by difficulty if not mixed
  if (config.difficulty !== 'Mixed') {
    const matchingDiff = pool.filter(q => q.difficulty === config.difficulty);
    // If we have enough matching difficulty, use that; otherwise fall back to pool
    if (matchingDiff.length >= config.questionCount) {
      pool = matchingDiff;
    } else if (matchingDiff.length > 0) {
      // Use what we have and fill from pool
      const rest = pool.filter(q => q.difficulty !== config.difficulty);
      pool = [...matchingDiff, ...rest];
    }
  }

  // If daily challenge, deterministic shuffle based on today's date
  if (config.isDailyChallenge) {
    const todayStr = new Date().toISOString().slice(0, 10);
    let seed = 0;
    for (let i = 0; i < todayStr.length; i++) {
      seed = (seed * 31 + todayStr.charCodeAt(i)) % 10007;
    }
    pool = [...pool].sort((a, b) => {
      const valA = (seed ^ a.id.charCodeAt(0)) % 100;
      const valB = (seed ^ b.id.charCodeAt(0)) % 100;
      return valA - valB;
    });
  } else {
    // Normal random shuffle (Fisher-Yates)
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
  }

  return pool.slice(0, config.questionCount);
}

/**
 * Calculate final quiz results, topic breakdowns, XP, and grounded summary
 */
export function computeQuizResults(
  config: QuizConfig,
  questions: QuizQuestion[],
  answers: Record<string, number | null>,
  timeTakenSeconds: number
): QuizResultData {
  let score = 0;
  let maxScore = 0;
  let correctCount = 0;
  let incorrectCount = 0;
  let unansweredCount = 0;

  const userAnswers: UserAnswerRecord[] = [];
  const topicMap: Record<string, { total: number; correct: number }> = {};
  const diffMap: Record<string, { total: number; correct: number }> = {};

  questions.forEach(q => {
    const qPoints = getPointsForDifficulty(q.difficulty);
    maxScore += qPoints;

    const selectedIndex = answers[q.id] !== undefined ? answers[q.id] : null;
    const isAnswered = selectedIndex !== null;
    const isCorrect = isAnswered && selectedIndex === q.correctAnswerIndex;

    if (isCorrect) {
      score += qPoints;
      correctCount++;
    } else if (isAnswered) {
      incorrectCount++;
    } else {
      unansweredCount++;
    }

    userAnswers.push({
      questionId: q.id,
      selectedOptionIndex: selectedIndex,
      isCorrect,
      timeSpentSeconds: 0
    });

    // Topic map
    if (!topicMap[q.topic]) topicMap[q.topic] = { total: 0, correct: 0 };
    topicMap[q.topic].total++;
    if (isCorrect) topicMap[q.topic].correct++;

    // Difficulty map
    if (!diffMap[q.difficulty]) diffMap[q.difficulty] = { total: 0, correct: 0 };
    diffMap[q.difficulty].total++;
    if (isCorrect) diffMap[q.difficulty].correct++;
  });

  const totalQuestions = questions.length;
  const accuracy = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

  // XP calculation: Base points earned + 20 XP completion bonus + speed bonus in Timed mode
  let xpEarned = score + 20;
  if (config.mode === 'Timed' && accuracy >= 80) {
    xpEarned += 30; // bonus for high accuracy under time pressure
  }

  const topicBreakdown: TopicBreakdown[] = Object.keys(topicMap).map(topic => ({
    topic,
    total: topicMap[topic].total,
    correct: topicMap[topic].correct,
    accuracy: Math.round((topicMap[topic].correct / topicMap[topic].total) * 100)
  }));

  const difficultyBreakdown: DifficultyBreakdown[] = Object.keys(diffMap).map(difficulty => ({
    difficulty,
    total: diffMap[difficulty].total,
    correct: diffMap[difficulty].correct,
    accuracy: Math.round((diffMap[difficulty].correct / diffMap[difficulty].total) * 100)
  }));

  // Grounded performance summary
  let performanceSummary = '';
  const strongTopics = topicBreakdown.filter(t => t.total >= 1 && t.accuracy >= 75).map(t => t.topic);
  const weakTopics = topicBreakdown.filter(t => t.total >= 1 && t.accuracy < 50).map(t => t.topic);

  if (accuracy >= 85) {
    performanceSummary = `Outstanding technical mastery! You demonstrated strong recall and conceptual clarity (${accuracy}% accuracy).`;
  } else if (accuracy >= 65) {
    performanceSummary = `Solid performance (${accuracy}% accuracy). You have good foundational understanding with a few specific topic gaps.`;
  } else if (accuracy >= 40) {
    performanceSummary = `Decent effort (${accuracy}% accuracy). Several core concepts need revision before placement interview rounds.`;
  } else {
    performanceSummary = `Challenging run (${accuracy}% accuracy). We recommend reviewing technical definitions and practice questions.`;
  }

  if (strongTopics.length > 0) {
    performanceSummary += ` Strongest areas: ${strongTopics.join(', ')}.`;
  }
  if (weakTopics.length > 0) {
    performanceSummary += ` Recommended focus areas: ${weakTopics.join(', ')}.`;
  }

  return {
    id: `quiz-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    timestamp: Date.now(),
    config,
    totalQuestions,
    correctCount,
    incorrectCount,
    unansweredCount,
    score,
    maxScore,
    accuracy,
    timeTakenSeconds,
    xpEarned,
    userAnswers,
    topicBreakdown,
    difficultyBreakdown,
    performanceSummary
  };
}
