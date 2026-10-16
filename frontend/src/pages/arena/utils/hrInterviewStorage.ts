import {
  HRConfig,
  HRQuestion,
  HRAttemptRecord,
  HRResultData,
  UserHRStats,
  HRScoreDimension,
  HROption
} from '../types/hrInterview';
import { STARTER_HR_QUESTIONS } from '../data/hrInterviewQuestions';

export const HR_INTERVIEW_QUESTIONS = STARTER_HR_QUESTIONS;

const STORAGE_KEY = 'placement_hub_hr_interview_stats_v1';

export const INITIAL_HR_STATS: UserHRStats = {
  totalSessionsCompleted: 0,
  totalQuestionsAnswered: 0,
  totalScoreEarned: 0,
  totalMaxScore: 0,
  overallAverage: 0,
  totalXpEarned: 0,
  bestScore: 0,
  recentAttempts: [],
  categoryStats: {},
  modeStats: {}
};

export function loadUserHRStats(): UserHRStats {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_HR_STATS;
    const parsed = JSON.parse(raw);
    return {
      ...INITIAL_HR_STATS,
      ...parsed,
      recentAttempts: Array.isArray(parsed.recentAttempts) ? parsed.recentAttempts : []
    };
  } catch (e) {
    console.error('Failed to load HR Interview stats from localStorage', e);
    return INITIAL_HR_STATS;
  }
}

export function saveHRResult(result: HRResultData): UserHRStats {
  try {
    const current = loadUserHRStats();

    const totalSessions = current.totalSessionsCompleted + 1;
    const totalAnswered = current.totalQuestionsAnswered + result.answeredCount;
    const totalScore = current.totalScoreEarned + result.score;
    const totalMax = current.totalMaxScore + result.maxScore;
    const overallAverage = totalMax > 0 ? Math.round((totalScore / totalMax) * 100) : 0;
    const totalXp = current.totalXpEarned + result.xpEarned;
    const bestScore = Math.max(current.bestScore, result.score);

    // Update category stats
    const updatedCategoryStats = { ...current.categoryStats };
    result.categoryBreakdown.forEach((cb: { category: string; total: number; scoreEarned: number; maxScore: number }) => {
      if (!updatedCategoryStats[cb.category]) {
        updatedCategoryStats[cb.category] = { attempted: 0, score: 0, maxScore: 0 };
      }
      updatedCategoryStats[cb.category].attempted += cb.total;
      updatedCategoryStats[cb.category].score += cb.scoreEarned;
      updatedCategoryStats[cb.category].maxScore += cb.maxScore;
    });

    // Update mode stats
    const updatedModeStats = { ...current.modeStats };
    const modeKey = result.config.mode;
    if (!updatedModeStats[modeKey]) {
      updatedModeStats[modeKey] = { attempted: 0, score: 0, maxScore: 0 };
    }
    updatedModeStats[modeKey].attempted += result.totalQuestions;
    updatedModeStats[modeKey].score += result.score;
    updatedModeStats[modeKey].maxScore += result.maxScore;

    // Keep last 15 attempts
    const updatedAttempts = [result, ...current.recentAttempts].slice(0, 15);

    const updated: UserHRStats = {
      totalSessionsCompleted: totalSessions,
      totalQuestionsAnswered: totalAnswered,
      totalScoreEarned: totalScore,
      totalMaxScore: totalMax,
      overallAverage,
      totalXpEarned: totalXp,
      bestScore,
      recentAttempts: updatedAttempts,
      categoryStats: updatedCategoryStats,
      modeStats: updatedModeStats
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to save HR Interview result to localStorage', e);
    return loadUserHRStats();
  }
}

export const saveHRSessionResult = saveHRResult;

export function clearHRHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Failed to clear HR Interview history', e);
  }
}

/**
 * Transparent Rubric-Based Evaluation Engine for Typed Answers
 * Evaluates length, keyword relevance, STAR structure, and professionalism.
 */
export function evaluateTypedResponse(
  question: HRQuestion,
  answer: string
): {
  score: number;
  points: number;
  isOptimal: boolean;
  dimensions: HRScoreDimension;
  dimensionScores: HRScoreDimension;
  strengths: string[];
  improvements: string[];
  feedbackNotes: string[];
  feedbackText: string;
} {
  const trimmed = answer.trim();
  const words = trimmed.split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  // Very short response
  if (wordCount < 10) {
    const briefDims: HRScoreDimension = {
      relevance: 1,
      structure: 1,
      specificity: 1,
      professionalism: 3,
      reflection: 1
    };
    return {
      score: 1,
      points: 1,
      isOptimal: false,
      dimensions: briefDims,
      dimensionScores: briefDims,
      strengths: [],
      improvements: ['Response is too brief. Provide structured context using the STAR framework.'],
      feedbackNotes: ['Response is under 10 words. In real placement interviews, this appears dismissive.'],
      feedbackText: 'Response is too brief. Aim for at least 30–60 words with specific context.'
    };
  }

  const rubric = question.rubric || {
    keywords: [],
    minWords: 25,
    targetWords: 60,
    structuralAspects: []
  };

  const lower = trimmed.toLowerCase();

  // 1. Keyword Relevance Score (0 to 5)
  let matchedKeywords = 0;
  rubric.keywords.forEach((kw: string) => {
    if (lower.includes(kw.toLowerCase())) matchedKeywords++;
  });
  const keywordRatio = rubric.keywords.length > 0 ? Math.min(1, matchedKeywords / Math.max(3, rubric.keywords.length * 0.4)) : 0.8;
  const relevance = Math.max(1, Math.min(5, Math.round(keywordRatio * 5)));

  // 2. Length & Specificity Score (0 to 5)
  const lengthRatio = Math.min(1, wordCount / rubric.minWords);
  const specificity = Math.max(1, Math.min(5, Math.round(lengthRatio * 5)));

  // 3. Structure & STAR markers
  const starMarkers = ['because', 'for example', 'when', 'result', 'learned', 'team', 'first', 'then', 'so', 'improved', 'situation', 'task', 'action'];
  let starHits = 0;
  starMarkers.forEach((marker: string) => {
    if (lower.includes(marker)) starHits++;
  });
  const structureRatio = Math.min(1, Math.max(0.4, starHits / 4));
  const structure = Math.max(1, Math.min(5, Math.round(structureRatio * 5)));

  // 4. Professionalism (no profanity, clear tone)
  const professionalism = wordCount >= 20 ? 5 : 3;

  // 5. Reflection (learning / growth keywords)
  const reflectionKeywords = ['learned', 'realized', 'improve', 'growth', 'outcome', 'helped', 'better', 'future', 'insight', 'feedback'];
  const hasReflection = reflectionKeywords.some((rw: string) => lower.includes(rw));
  const reflection = hasReflection ? 5 : 3;

  const dimensions: HRScoreDimension = {
    relevance,
    structure,
    specificity,
    professionalism,
    reflection
  };

  // Composite calculation
  const composite = (relevance * 0.3) + (specificity * 0.25) + (structure * 0.25) + (reflection * 0.2);
  let finalPoints = Math.round(composite);
  finalPoints = Math.max(1, Math.min(5, finalPoints));

  const strengths: string[] = [];
  const improvements: string[] = [];
  const feedbackNotes: string[] = [];

  if (relevance >= 4) {
    strengths.push('Directly addressed the core interview prompt');
  } else {
    improvements.push('Focus answer more tightly on the primary question');
  }

  if (structure >= 4) {
    strengths.push('Clear logical flow and STAR framing');
  } else {
    improvements.push('Structure your answer with explicit Situation, Action, and Result');
  }

  if (reflection >= 4) {
    strengths.push('Demonstrated self-awareness and learning mindset');
  }

  if (wordCount < rubric.minWords) {
    improvements.push(`Elaborate further (currently ${wordCount} words, aim for ~${rubric.minWords}-${rubric.targetWords} words)`);
  }

  if (finalPoints >= 4) {
    feedbackNotes.push(`Strong, interview-ready response (${wordCount} words). Communicates maturity, accountability, and practical problem solving.`);
  } else if (finalPoints >= 3) {
    feedbackNotes.push(`Solid grounding (${wordCount} words). Add a concrete measurable outcome or specific metric to make it memorable.`);
  } else {
    feedbackNotes.push(`Adequate start (${wordCount} words). Structure with ${question.recommendedFramework} to avoid sounding vague.`);
  }

  return {
    score: finalPoints,
    points: finalPoints,
    isOptimal: finalPoints >= 4,
    dimensions,
    dimensionScores: dimensions,
    strengths,
    improvements,
    feedbackNotes,
    feedbackText: feedbackNotes[0]
  };
}

export const evaluateTypedAnswer = (q: HRQuestion, a: string) => {
  const res = evaluateTypedResponse(q, a);
  return {
    points: res.points,
    dimensionScores: res.dimensionScores,
    feedbackText: res.feedbackText
  };
};

/**
 * Filter questions based on configuration with guaranteed fallback
 */
export function filterHRQuestions(
  configOrQuestions: HRConfig | HRQuestion[],
  maybeConfig?: HRConfig
): HRQuestion[] {
  const config = (maybeConfig || configOrQuestions) as HRConfig;
  let pool = Array.isArray(configOrQuestions) ? [...configOrQuestions] : [...STARTER_HR_QUESTIONS];

  // Priority 1: Mode
  if (config.mode) {
    const modePool = pool.filter((q: HRQuestion) => q.mode === config.mode);
    if (modePool.length > 0) {
      pool = modePool;
    }
  }

  // Priority 2: Category (if specific category chosen)
  if (config.category && config.category !== 'Mixed HR') {
    const catPool = pool.filter((q: HRQuestion) => q.category === config.category);
    if (catPool.length >= 3) {
      pool = catPool;
    }
  }

  // Priority 3: Difficulty (if specific difficulty chosen)
  if (config.difficulty && config.difficulty !== 'Mixed') {
    const diffPool = pool.filter((q: HRQuestion) => q.difficulty === config.difficulty);
    if (diffPool.length >= 3) {
      pool = diffPool;
    }
  }

  // Backfill if needed
  if (pool.length < config.questionCount) {
    const remaining = STARTER_HR_QUESTIONS.filter((q: HRQuestion) => !pool.some((p: HRQuestion) => p.id === q.id));
    pool = [...pool, ...remaining];
  }

  // Shuffle pool
  const shuffled = pool.sort(() => Math.random() - 0.5);
  const result = shuffled.slice(0, Math.min(config.questionCount, pool.length));

  if (result.length === 0) {
    return STARTER_HR_QUESTIONS.slice(0, config.questionCount);
  }

  return result;
}

/**
 * Compute session outcome, accuracy, XP, category and performance breakdown
 */
export function calculateHRResult(
  config: HRConfig,
  questions: HRQuestion[],
  attempts: HRAttemptRecord[],
  timeTakenSeconds: number
): HRResultData {
  let totalScore = 0;
  let maxScore = 0;
  let answeredCount = 0;
  let correctCount = 0;

  const categoryMap: Record<string, { total: number; scoreEarned: number; maxScore: number }> = {};
  const dimTotals: HRScoreDimension = { relevance: 0, structure: 0, specificity: 0, professionalism: 0, reflection: 0 };
  let dimCount = 0;

  questions.forEach((q: HRQuestion) => {
    const qPoints = q.points || 5;
    maxScore += qPoints;

    if (!categoryMap[q.category]) {
      categoryMap[q.category] = { total: 0, scoreEarned: 0, maxScore: 0 };
    }
    categoryMap[q.category].total += 1;
    categoryMap[q.category].maxScore += qPoints;

    const attempt = attempts.find((a: HRAttemptRecord) => a.questionId === q.id);
    if (attempt && !attempt.skipped) {
      answeredCount += 1;
      const pts = attempt.score ?? attempt.pointsEarned ?? 0;
      totalScore += pts;
      categoryMap[q.category].scoreEarned += pts;

      if (attempt.isOptimal || pts >= 4) {
        correctCount += 1;
      }

      if (attempt.dimensionsAssessed) {
        dimTotals.relevance += attempt.dimensionsAssessed.relevance;
        dimTotals.structure += attempt.dimensionsAssessed.structure;
        dimTotals.specificity += attempt.dimensionsAssessed.specificity;
        dimTotals.professionalism += attempt.dimensionsAssessed.professionalism;
        dimTotals.reflection += attempt.dimensionsAssessed.reflection;
        dimCount += 1;
      }
    }
  });

  const percentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
  const skippedCount = questions.length - answeredCount;

  // XP: Base score * 10 + completion bonus
  const xpEarned = (totalScore * 6) + (percentage >= 70 ? 35 : 15);

  const categoryBreakdown = Object.entries(categoryMap).map(([category, counts]) => ({
    category,
    total: counts.total,
    scoreEarned: counts.scoreEarned,
    maxScore: counts.maxScore
  }));

  const categoryScores: Record<string, { total: number; score: number; maxScore: number }> = {};
  Object.entries(categoryMap).forEach(([cat, val]) => {
    categoryScores[cat] = { total: val.total, score: val.scoreEarned, maxScore: val.maxScore };
  });

  const avgDims: HRScoreDimension = {
    relevance: dimCount > 0 ? Math.round((dimTotals.relevance / dimCount) * 10) / 10 : 4,
    structure: dimCount > 0 ? Math.round((dimTotals.structure / dimCount) * 10) / 10 : 4,
    specificity: dimCount > 0 ? Math.round((dimTotals.specificity / dimCount) * 10) / 10 : 3.5,
    professionalism: dimCount > 0 ? Math.round((dimTotals.professionalism / dimCount) * 10) / 10 : 4.5,
    reflection: dimCount > 0 ? Math.round((dimTotals.reflection / dimCount) * 10) / 10 : 4
  };

  const performanceLevel =
    percentage >= 85
      ? 'Exemplary'
      : percentage >= 70
      ? 'Strong Candidate'
      : percentage >= 50
      ? 'Capable'
      : 'Developing';

  // Identify strengths & improvements
  const strengths: string[] = [];
  const improvements: string[] = [];

  categoryBreakdown.forEach((cb: { category: string; total: number; scoreEarned: number; maxScore: number }) => {
    const ratio = cb.maxScore > 0 ? cb.scoreEarned / cb.maxScore : 0;
    if (ratio >= 0.8) {
      strengths.push(`${cb.category} Mastery`);
    } else if (ratio < 0.6) {
      improvements.push(`${cb.category} Preparation`);
    }
  });

  if (strengths.length === 0 && percentage >= 60) {
    strengths.push('Professional Communication', 'Core Self-Awareness');
  }
  if (improvements.length === 0 && percentage < 80) {
    improvements.push('STAR Structure & Concrete Metrics');
  }

  return {
    id: `hr-res-${Date.now()}`,
    timestamp: new Date().toISOString(),
    config,
    totalQuestions: questions.length,
    answeredCount,
    skippedCount,
    score: totalScore,
    maxScore,
    maxPossibleScore: maxScore,
    percentage,
    performanceLevel,
    xpEarned,
    timeTakenSeconds,
    timeSpentSeconds: timeTakenSeconds,
    correctCount,
    totalCorrect: correctCount,
    attempts,
    dimensions: avgDims,
    categoryScores,
    categoryBreakdown,
    strengths: strengths.length > 0 ? strengths : ['Professional Tone & Courtesy'],
    improvements: improvements.length > 0 ? improvements : ['Continue practicing challenging edge scenarios']
  };
}

export const computeHRResults = calculateHRResult;
