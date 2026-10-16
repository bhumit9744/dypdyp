import React, { useState } from 'react';
import { QuizConfig, QuizResultData } from './types/quiz';
import { TechArenaDashboard } from './TechArenaDashboard';
import { CodeQuizArena } from './components/CodeQuizArena';
import { QuizResults } from './components/QuizResults';
import { QuizReview } from './components/QuizReview';
import { STARTER_QUIZ_QUESTIONS } from './data/quizQuestions';

export const TechArenaPage: React.FC = () => {
  const [activeView, setActiveView] = useState<'dashboard' | 'game' | 'past-results' | 'past-review'>('dashboard');
  const [gameConfig, setGameConfig] = useState<QuizConfig | undefined>(undefined);
  const [inspectResult, setInspectResult] = useState<QuizResultData | null>(null);

  const handleLaunchGame = (_gameId: 'code-quiz' | 'daily' | 'bug-hunter', config?: QuizConfig) => {
    setGameConfig(config);
    setActiveView('game');
  };

  const handleBackToDashboard = () => {
    setActiveView('dashboard');
    setGameConfig(undefined);
    setInspectResult(null);
  };

  const handleReviewPastResult = (result: QuizResultData) => {
    setInspectResult(result);
    setActiveView('past-results');
  };

  return (
    <div className="w-full">
      {activeView === 'dashboard' && (
        <TechArenaDashboard
          onLaunchGame={handleLaunchGame}
          onReviewPastResult={handleReviewPastResult}
        />
      )}

      {activeView === 'game' && (
        <CodeQuizArena
          onBackToArena={handleBackToDashboard}
          initialConfig={gameConfig}
        />
      )}

      {activeView === 'past-results' && inspectResult && (
        <QuizResults
          result={inspectResult}
          onReviewAnswers={() => setActiveView('past-review')}
          onRetryQuiz={() => {
            setGameConfig(inspectResult.config);
            setActiveView('game');
          }}
          onNewQuiz={() => {
            setGameConfig(undefined);
            setActiveView('game');
          }}
          onBackToArena={handleBackToDashboard}
        />
      )}

      {activeView === 'past-review' && inspectResult && (
        <QuizReview
          result={inspectResult}
          questions={STARTER_QUIZ_QUESTIONS}
          onBackToResults={() => setActiveView('past-results')}
        />
      )}
    </div>
  );
};
