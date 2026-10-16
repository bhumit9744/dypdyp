import React, { useState } from 'react';
import { QuizConfig, QuizQuestion, QuizResultData } from '../types/quiz';
import { generateQuizQuestions, computeQuizResults, saveQuizResult } from '../utils/quizStorage';
import { QuizSetup } from './QuizSetup';
import { QuizActive } from './QuizActive';
import { QuizResults } from './QuizResults';
import { QuizReview } from './QuizReview';

interface CodeQuizArenaProps {
  onBackToArena: () => void;
  initialConfig?: QuizConfig;
}

export const CodeQuizArena: React.FC<CodeQuizArenaProps> = ({
  onBackToArena,
  initialConfig
}) => {
  const [view, setView] = useState<'setup' | 'playing' | 'results' | 'review'>(
    initialConfig ? 'playing' : 'setup'
  );

  const [activeConfig, setActiveConfig] = useState<QuizConfig>(
    initialConfig || {
      topic: 'Mixed Topics',
      difficulty: 'Mixed',
      questionCount: 10,
      mode: 'Timed'
    }
  );

  const [questions, setQuestions] = useState<QuizQuestion[]>(() => {
    if (initialConfig) {
      return generateQuizQuestions(initialConfig);
    }
    return [];
  });

  const [lastResult, setLastResult] = useState<QuizResultData | null>(null);

  const handleStartQuiz = (config: QuizConfig) => {
    setActiveConfig(config);
    const generated = generateQuizQuestions(config);
    setQuestions(generated);
    setView('playing');
  };

  const handleCompleteQuiz = (answers: Record<string, number | null>, timeTakenSeconds: number) => {
    if (!activeConfig || questions.length === 0) return;

    const result = computeQuizResults(activeConfig, questions, answers, timeTakenSeconds);
    // Persist result locally
    saveQuizResult(result);
    setLastResult(result);
    setView('results');
  };

  const handleRetrySameQuiz = () => {
    // Keep the exact same questions and start fresh
    setView('playing');
  };

  const handleNewQuiz = () => {
    setView('setup');
  };

  const handleReviewAnswers = () => {
    setView('review');
  };

  const handleBackToResults = () => {
    setView('results');
  };

  return (
    <div className="w-full">
      {view === 'setup' && (
        <QuizSetup
          onStartQuiz={handleStartQuiz}
          onBackToArena={onBackToArena}
          initialTopic={activeConfig?.topic}
          isDaily={activeConfig?.isDailyChallenge}
        />
      )}

      {view === 'playing' && (
        <QuizActive
          config={activeConfig}
          questions={questions}
          onCompleteQuiz={handleCompleteQuiz}
          onAbortQuiz={onBackToArena}
        />
      )}

      {view === 'results' && lastResult && (
        <QuizResults
          result={lastResult}
          onReviewAnswers={handleReviewAnswers}
          onRetryQuiz={handleRetrySameQuiz}
          onNewQuiz={handleNewQuiz}
          onBackToArena={onBackToArena}
        />
      )}

      {view === 'review' && lastResult && (
        <QuizReview
          result={lastResult}
          questions={questions}
          onBackToResults={handleBackToResults}
        />
      )}
    </div>
  );
};
