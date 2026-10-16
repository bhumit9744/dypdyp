import {
  AlgorithmRushConfig,
  AlgorithmChallenge,
  AlgorithmAttemptRecord,
  AlgorithmRushResultData,
  UserAlgorithmRushStats
} from '../types/algorithmRush';
import { STARTER_ALGORITHM_CHALLENGES } from '../data/algorithmRushChallenges';

const STORAGE_KEY = 'placement_hub_algorithm_rush_stats_v1';

export const INITIAL_ALGO_STATS: UserAlgorithmRushStats = {
  totalSessionsCompleted: 0,
  totalChallengesAttempted: 0,
  totalCorrect: 0,
  overallAccuracy: 0,
  totalXpEarned: 0,
  bestScore: 0,
  bestLadderScore: 0,
  complexityAccuracy: 0,
  patternAccuracy: 0,
  recentAttempts: [],
  topicStats: {},
  modeStats: {}
};

export function loadUserAlgoStats(): UserAlgorithmRushStats {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_ALGO_STATS;
    const parsed = JSON.parse(raw);
    return {
      ...INITIAL_ALGO_STATS,
      ...parsed,
      recentAttempts: Array.isArray(parsed.recentAttempts) ? parsed.recentAttempts : []
    };
  } catch (e) {
    console.error('Failed to load Algorithm Rush stats from localStorage', e);
    return INITIAL_ALGO_STATS;
  }
}

export function saveAlgorithmRushResult(result: AlgorithmRushResultData): UserAlgorithmRushStats {
  try {
    const current = loadUserAlgoStats();

    const totalSessions = current.totalSessionsCompleted + 1;
    const totalAttempted = current.totalChallengesAttempted + result.totalChallenges;
    const totalCorrect = current.totalCorrect + result.correctCount;
    const overallAccuracy = totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0;
    const totalXp = current.totalXpEarned + result.xpEarned;
    const bestScore = Math.max(current.bestScore, result.score);
    const bestLadderScore =
      result.config.mode === 'rush-ladder'
        ? Math.max(current.bestLadderScore, result.score)
        : current.bestLadderScore;

    // Update topic stats
    const updatedTopicStats = { ...current.topicStats };
    result.topicBreakdown.forEach(tb => {
      if (!updatedTopicStats[tb.topic]) {
        updatedTopicStats[tb.topic] = { attempted: 0, correct: 0 };
      }
      updatedTopicStats[tb.topic].attempted += tb.total;
      updatedTopicStats[tb.topic].correct += tb.correct;
    });

    // Update mode stats
    const updatedModeStats = { ...current.modeStats };
    const modeKey = result.config.mode;
    if (!updatedModeStats[modeKey]) {
      updatedModeStats[modeKey] = { attempted: 0, correct: 0 };
    }
    updatedModeStats[modeKey].attempted += result.totalChallenges;
    updatedModeStats[modeKey].correct += result.correctCount;

    // Calculate complexity and pattern accuracy
    const complexityTotal = updatedModeStats['complexity-clash']?.attempted || 0;
    const complexityCorr = updatedModeStats['complexity-clash']?.correct || 0;
    const complexityAccuracy = complexityTotal > 0 ? Math.round((complexityCorr / complexityTotal) * 100) : 0;

    const patternTotal = updatedModeStats['pattern-match']?.attempted || 0;
    const patternCorr = updatedModeStats['pattern-match']?.correct || 0;
    const patternAccuracy = patternTotal > 0 ? Math.round((patternCorr / patternTotal) * 100) : 0;

    // Keep last 15 attempts
    const updatedAttempts = [result, ...current.recentAttempts].slice(0, 15);

    const updated: UserAlgorithmRushStats = {
      totalSessionsCompleted: totalSessions,
      totalChallengesAttempted: totalAttempted,
      totalCorrect,
      overallAccuracy,
      totalXpEarned: totalXp,
      bestScore,
      bestLadderScore,
      complexityAccuracy,
      patternAccuracy,
      recentAttempts: updatedAttempts,
      topicStats: updatedTopicStats,
      modeStats: updatedModeStats
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to save Algorithm Rush result to localStorage', e);
    return loadUserAlgoStats();
  }
}

export function clearAlgorithmRushHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Failed to clear Algorithm Rush history', e);
  }
}

/**
 * Filter challenges based on user configuration with guaranteed fallback
 */
export function filterAlgorithmChallenges(config: AlgorithmRushConfig): AlgorithmChallenge[] {
  let pool = [...STARTER_ALGORITHM_CHALLENGES];

  // In rush-ladder mode, we desire progressive difficulty: Beginner -> Intermediate -> Advanced
  if (config.mode === 'rush-ladder') {
    // If specific topic requested, filter by topic first
    if (config.topic && config.topic !== 'Mixed DSA') {
      const topicPool = pool.filter(c => c.topic === config.topic);
      if (topicPool.length >= 3) {
        pool = topicPool;
      }
    }

    // Sort by difficulty: Beginner (1), Intermediate (2), Advanced (3)
    const diffOrder: Record<string, number> = {
      Beginner: 1,
      Intermediate: 2,
      Advanced: 3
    };

    const sortedLadder = [...pool].sort((a, b) => {
      const orderA = diffOrder[a.difficulty] || 2;
      const orderB = diffOrder[b.difficulty] || 2;
      if (orderA !== orderB) return orderA - orderB;
      return Math.random() - 0.5;
    });

    const ladderResult = sortedLadder.slice(0, config.challengeCount);
    if (ladderResult.length > 0) return ladderResult;
  }

  // Priority 1: Filter by mode if specific mode chosen (not rush-ladder)
  if (config.mode && config.mode !== 'rush-ladder') {
    const modePool = pool.filter(c => c.mode === config.mode);
    if (modePool.length > 0) {
      pool = modePool;
    }
  }

  // Priority 2: Filter by topic if specific topic chosen
  if (config.topic && config.topic !== 'Mixed DSA') {
    const topicPool = pool.filter(c => c.topic === config.topic);
    if (topicPool.length > 0) {
      pool = topicPool;
    }
  }

  // Priority 3: Filter by difficulty if specific difficulty chosen
  if (config.difficulty && config.difficulty !== 'Mixed') {
    const diffPool = pool.filter(c => c.difficulty === config.difficulty);
    if (diffPool.length > 0) {
      pool = diffPool;
    }
  }

  // If pool is smaller than requested count, backfill from remaining challenges
  if (pool.length < config.challengeCount) {
    const remaining = STARTER_ALGORITHM_CHALLENGES.filter(c => !pool.some(p => p.id === c.id));
    pool = [...pool, ...remaining];
  }

  // Shuffle pool for varied gameplay
  const shuffled = pool.sort(() => Math.random() - 0.5);
  const result = shuffled.slice(0, Math.min(config.challengeCount, pool.length));

  // Absolute safety guarantee: never return an empty list
  if (result.length === 0) {
    return STARTER_ALGORITHM_CHALLENGES.slice(0, config.challengeCount);
  }

  return result;
}

/**
 * Compute session outcome, accuracy, XP, topic and difficulty breakdown
 */
export function computeAlgorithmRushResults(
  config: AlgorithmRushConfig,
  challenges: AlgorithmChallenge[],
  attempts: AlgorithmAttemptRecord[],
  timeTakenSeconds: number
): AlgorithmRushResultData {
  let totalScore = 0;
  let maxScore = 0;
  let correctCount = 0;
  let totalHintsUsed = 0;

  const topicMap: Record<string, { total: number; correct: number }> = {};
  const difficultyMap: Record<string, { total: number; correct: number }> = {};

  challenges.forEach(challenge => {
    maxScore += challenge.points;

    // Track topic breakdown
    if (!topicMap[challenge.topic]) {
      topicMap[challenge.topic] = { total: 0, correct: 0 };
    }
    topicMap[challenge.topic].total += 1;

    // Track difficulty breakdown
    if (!difficultyMap[challenge.difficulty]) {
      difficultyMap[challenge.difficulty] = { total: 0, correct: 0 };
    }
    difficultyMap[challenge.difficulty].total += 1;

    // Find attempt
    const attempt = attempts.find(a => a.challengeId === challenge.id);
    if (attempt) {
      totalScore += attempt.pointsEarned;
      totalHintsUsed += attempt.hintsUsed;
      if (attempt.isCorrect) {
        correctCount += 1;
        topicMap[challenge.topic].correct += 1;
        difficultyMap[challenge.difficulty].correct += 1;
      }
    }
  });

  const accuracy = challenges.length > 0 ? Math.round((correctCount / challenges.length) * 100) : 0;

  // XP: Base score + accuracy bonus (up to 50 XP) + completion bonus (25 XP)
  const accuracyBonus = Math.round((accuracy / 100) * 50);
  const completionBonus = correctCount > 0 ? 25 : 0;
  const xpEarned = totalScore + accuracyBonus + completionBonus;

  const topicBreakdown = Object.entries(topicMap).map(([topic, counts]) => ({
    topic,
    total: counts.total,
    correct: counts.correct
  }));

  const difficultyBreakdown = Object.entries(difficultyMap).map(([difficulty, counts]) => ({
    difficulty,
    total: counts.total,
    correct: counts.correct
  }));

  return {
    id: `algo-res-${Date.now()}`,
    timestamp: new Date().toISOString(),
    config,
    totalChallenges: challenges.length,
    correctCount,
    score: totalScore,
    maxScore,
    accuracy,
    xpEarned,
    timeTakenSeconds,
    hintsUsedCount: totalHintsUsed,
    attempts,
    topicBreakdown,
    difficultyBreakdown
  };
}
