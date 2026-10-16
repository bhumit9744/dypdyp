import {
  BugHunterConfig,
  BugChallenge,
  BugAttemptRecord,
  BugHunterResultData,
  UserBugHunterStats
} from '../types/bugHunter';
import { STARTER_BUG_CHALLENGES } from '../data/bugHunterChallenges';

const STORAGE_KEY = 'placement_hub_bug_hunter_stats_v1';

export const INITIAL_BUG_STATS: UserBugHunterStats = {
  totalSessionsCompleted: 0,
  totalChallengesAttempted: 0,
  totalCorrect: 0,
  overallAccuracy: 0,
  totalXpEarned: 0,
  bestScore: 0,
  bestSprintScore: 0,
  recentAttempts: [],
  categoryStats: {},
  languageStats: {},
  modeStats: {}
};

export function loadUserBugStats(): UserBugHunterStats {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_BUG_STATS;
    const parsed = JSON.parse(raw);
    return {
      ...INITIAL_BUG_STATS,
      ...parsed,
      recentAttempts: Array.isArray(parsed.recentAttempts) ? parsed.recentAttempts : []
    };
  } catch (e) {
    console.error('Failed to load Bug Hunter stats from localStorage', e);
    return INITIAL_BUG_STATS;
  }
}

export function saveBugHunterResult(result: BugHunterResultData): UserBugHunterStats {
  try {
    const current = loadUserBugStats();

    const totalSessions = current.totalSessionsCompleted + 1;
    const totalAttempted = current.totalChallengesAttempted + result.totalChallenges;
    const totalCorrect = current.totalCorrect + result.correctCount;
    const overallAccuracy = totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0;
    const totalXp = current.totalXpEarned + result.xpEarned;
    const bestScore = Math.max(current.bestScore, result.score);
    const bestSprintScore =
      result.config.mode === 'sprint'
        ? Math.max(current.bestSprintScore, result.score)
        : current.bestSprintScore;

    // Update category stats
    const updatedCategoryStats = { ...current.categoryStats };
    result.categoryBreakdown.forEach(cb => {
      if (!updatedCategoryStats[cb.category]) {
        updatedCategoryStats[cb.category] = { attempted: 0, correct: 0 };
      }
      updatedCategoryStats[cb.category].attempted += cb.total;
      updatedCategoryStats[cb.category].correct += cb.correct;
    });

    // Update language stats
    const updatedLanguageStats = { ...current.languageStats };
    result.languageBreakdown.forEach(lb => {
      if (!updatedLanguageStats[lb.language]) {
        updatedLanguageStats[lb.language] = { attempted: 0, correct: 0 };
      }
      updatedLanguageStats[lb.language].attempted += lb.total;
      updatedLanguageStats[lb.language].correct += lb.correct;
    });

    // Update mode stats
    const updatedModeStats = { ...current.modeStats };
    const modeKey = result.config.mode;
    if (!updatedModeStats[modeKey]) {
      updatedModeStats[modeKey] = { attempted: 0, correct: 0 };
    }
    updatedModeStats[modeKey].attempted += result.totalChallenges;
    updatedModeStats[modeKey].correct += result.correctCount;

    // Keep last 15 attempts
    const updatedAttempts = [result, ...current.recentAttempts].slice(0, 15);

    const updated: UserBugHunterStats = {
      totalSessionsCompleted: totalSessions,
      totalChallengesAttempted: totalAttempted,
      totalCorrect,
      overallAccuracy,
      totalXpEarned: totalXp,
      bestScore,
      bestSprintScore,
      recentAttempts: updatedAttempts,
      categoryStats: updatedCategoryStats,
      languageStats: updatedLanguageStats,
      modeStats: updatedModeStats
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to save Bug Hunter result to localStorage', e);
    return loadUserBugStats();
  }
}

export function clearBugHunterHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Failed to clear Bug Hunter history', e);
  }
}

/**
 * Filter challenges based on user configuration with guaranteed fallback
 */
export function filterBugChallenges(config: BugHunterConfig): BugChallenge[] {
  let pool = [...STARTER_BUG_CHALLENGES];

  // Priority 1: Filter by category if specific category chosen
  if (config.category && config.category !== 'Mixed') {
    const catPool = pool.filter(c => c.category === config.category);
    if (catPool.length > 0) {
      pool = catPool;
    }
  }

  // Priority 2: Filter by language if specific language chosen
  if (config.language && config.language !== 'Mixed') {
    const langPool = pool.filter(c => c.language === config.language);
    if (langPool.length > 0) {
      pool = langPool;
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
    const remaining = STARTER_BUG_CHALLENGES.filter(c => !pool.some(p => p.id === c.id));
    pool = [...pool, ...remaining];
  }

  // Shuffle pool with deterministic seed-friendly approach
  const shuffled = pool.sort(() => Math.random() - 0.5);
  const result = shuffled.slice(0, Math.min(config.challengeCount, pool.length));

  // Absolute safety guarantee: never return an empty list
  if (result.length === 0) {
    return STARTER_BUG_CHALLENGES.slice(0, config.challengeCount);
  }

  return result;
}

/**
 * Compute session outcome, accuracy, XP, category and language breakdown
 */
export function computeBugHunterResults(
  config: BugHunterConfig,
  challenges: BugChallenge[],
  attempts: BugAttemptRecord[],
  timeTakenSeconds: number
): BugHunterResultData {
  let totalScore = 0;
  let maxScore = 0;
  let correctCount = 0;
  let totalHintsUsed = 0;
  let totalPenalty = 0;

  const categoryMap: Record<string, { total: number; correct: number }> = {};
  const languageMap: Record<string, { total: number; correct: number }> = {};

  challenges.forEach(ch => {
    maxScore += ch.points;
    const attempt = attempts.find(a => a.challengeId === ch.id);

    // Track category & language
    if (!categoryMap[ch.category]) categoryMap[ch.category] = { total: 0, correct: 0 };
    categoryMap[ch.category].total += 1;

    if (!languageMap[ch.language]) languageMap[ch.language] = { total: 0, correct: 0 };
    languageMap[ch.language].total += 1;

    if (attempt) {
      totalScore += attempt.pointsEarned;
      totalHintsUsed += attempt.hintsUsed;
      totalPenalty += attempt.hintsPenalty;

      if (attempt.isCorrect) {
        correctCount += 1;
        categoryMap[ch.category].correct += 1;
        languageMap[ch.language].correct += 1;
      }
    }
  });

  const accuracy = challenges.length > 0 ? Math.round((correctCount / challenges.length) * 100) : 0;

  // XP: Base score + speed bonus for sprints or high accuracy + completion bonus
  let xpEarned = totalScore * 10;
  if (accuracy >= 80) xpEarned += 50;
  if (config.mode === 'sprint' && correctCount > 0) xpEarned += 30;

  const categoryBreakdown = Object.entries(categoryMap).map(([category, stats]) => ({
    category,
    total: stats.total,
    correct: stats.correct,
    accuracy: stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0
  }));

  const languageBreakdown = Object.entries(languageMap).map(([language, stats]) => ({
    language,
    total: stats.total,
    correct: stats.correct,
    accuracy: stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0
  }));

  const strongAreas: string[] = [];
  const weakAreas: string[] = [];

  categoryBreakdown.forEach(cb => {
    if (cb.accuracy >= 75) strongAreas.push(cb.category);
    else if (cb.accuracy < 50) weakAreas.push(cb.category);
  });

  return {
    id: 'bh-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
    timestamp: Date.now(),
    config,
    totalChallenges: challenges.length,
    correctCount,
    incorrectCount: challenges.length - correctCount,
    score: totalScore,
    maxScore,
    accuracy,
    totalHintsUsed,
    totalPenalty,
    timeTakenSeconds,
    xpEarned,
    attempts,
    categoryBreakdown,
    languageBreakdown,
    strongAreas,
    weakAreas
  };
}
