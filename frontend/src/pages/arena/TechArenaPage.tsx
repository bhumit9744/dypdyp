import React, { useState } from 'react';
import { QuizConfig, QuizResultData } from './types/quiz';
import { BugHunterConfig, BugHunterResultData } from './types/bugHunter';
import { TechArenaDashboard } from './TechArenaDashboard';
import { CodeQuizArena } from './components/CodeQuizArena';
import { BugHunterArena } from './components/bughunter/BugHunterArena';
import { QuizResults } from './components/QuizResults';
import { QuizReview } from './components/QuizReview';
import { STARTER_QUIZ_QUESTIONS } from './data/quizQuestions';

export const TechArenaPage: React.FC = () => {
  const [activeView, setActiveView] = useState<'dashboard' | 'code-quiz' | 'bug-hunter' | 'past-results' | 'past-review'>('dashboard');
  const [quizConfig, setQuizConfig] = useState<QuizConfig | undefined>(undefined);
  const [bugConfig, setBugConfig] = useState<BugHunterConfig | undefined>(undefined);
  const [inspectResult, setInspectResult] = useState<QuizResultData | null>(null);

  const handleLaunchGame = (gameId: 'code-quiz' | 'daily' | 'bug-hunter', config?: any) => {
    if (gameId === 'bug-hunter') {
      setBugConfig(config);
      setActiveView('bug-hunter');
    } else {
      setQuizConfig(config);
      setActiveView('code-quiz');
    }
  };

  const handleBackToDashboard = () => {
    setActiveView('dashboard');
    setQuizConfig(undefined);
    setBugConfig(undefined);
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

      {activeView === 'code-quiz' && (
        <CodeQuizArena
          onBackToArena={handleBackToDashboard}
          initialConfig={quizConfig}
        />
      )}

      {activeView === 'bug-hunter' && (
        <BugHunterArena
          onBackToArena={handleBackToDashboard}
          initialConfig={bugConfig}
        />
      )}

      {activeView === 'past-results' && inspectResult && (
        <QuizResults
          result={inspectResult}
          onReviewAnswers={() => setActiveView('past-review')}
          onRetryQuiz={() => {
            setQuizConfig(inspectResult.config);
            setActiveView('code-quiz');
          }}
          onNewQuiz={() => {
            setQuizConfig(undefined);
            setActiveView('code-quiz');
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
