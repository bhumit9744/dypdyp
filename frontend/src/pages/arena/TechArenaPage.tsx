import React, { useState } from 'react';
import { QuizConfig, QuizResultData } from './types/quiz';
import { BugHunterConfig, BugHunterResultData } from './types/bugHunter';
import { AlgorithmRushConfig } from './types/algorithmRush';
import { HRInterviewConfig } from './types/hrInterview';
import { TechArenaDashboard } from './TechArenaDashboard';
import { CodeQuizArena } from './components/CodeQuizArena';
import { BugHunterArena } from './components/bughunter/BugHunterArena';
import { AlgorithmRushArena } from './components/algorithm/AlgorithmRushArena';
import { HRInterviewArena } from './components/hrinterview/HRInterviewArena';
import { QuizResults } from './components/QuizResults';
import { QuizReview } from './components/QuizReview';
import { STARTER_QUIZ_QUESTIONS } from './data/quizQuestions';

export const TechArenaPage: React.FC = () => {
  const [activeView, setActiveView] = useState<'dashboard' | 'code-quiz' | 'bug-hunter' | 'algorithm-rush' | 'hr-interview' | 'past-results' | 'past-review'>('dashboard');
  const [quizConfig, setQuizConfig] = useState<QuizConfig | undefined>(undefined);
  const [bugConfig, setBugConfig] = useState<BugHunterConfig | undefined>(undefined);
  const [algoConfig, setAlgoConfig] = useState<AlgorithmRushConfig | undefined>(undefined);
  const [hrConfig, setHrConfig] = useState<HRInterviewConfig | undefined>(undefined);
  const [inspectResult, setInspectResult] = useState<QuizResultData | null>(null);

  const handleLaunchGame = (gameId: 'code-quiz' | 'daily' | 'bug-hunter' | 'algorithm-rush' | 'hr-interview', config?: any) => {
    if (gameId === 'bug-hunter') {
      setBugConfig(config);
      setActiveView('bug-hunter');
    } else if (gameId === 'algorithm-rush') {
      setAlgoConfig(config);
      setActiveView('algorithm-rush');
    } else if (gameId === 'hr-interview') {
      setHrConfig(config);
      setActiveView('hr-interview');
    } else {
      setQuizConfig(config);
      setActiveView('code-quiz');
    }
  };

  const handleBackToDashboard = () => {
    setActiveView('dashboard');
    setQuizConfig(undefined);
    setBugConfig(undefined);
    setAlgoConfig(undefined);
    setHrConfig(undefined);
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

      {activeView === 'algorithm-rush' && (
        <AlgorithmRushArena
          onBackToArena={handleBackToDashboard}
          initialConfig={algoConfig}
        />
      )}

      {activeView === 'hr-interview' && (
        <HRInterviewArena
          onBackToArena={handleBackToDashboard}
          initialConfig={hrConfig}
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
