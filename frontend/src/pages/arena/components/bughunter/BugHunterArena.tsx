import React, { useState } from 'react';
import {
  BugHunterConfig,
  BugChallenge,
  BugHunterResultData,
  BugAttemptRecord
} from '../../types/bugHunter';
import {
  filterBugChallenges,
  computeBugHunterResults,
  saveBugHunterResult
} from '../../utils/bugHunterStorage';
import { BugHunterSetup } from './BugHunterSetup';
import { BugHunterWorkspace } from './BugHunterWorkspace';
import { BugHunterResults } from './BugHunterResults';
import { BugHunterReview } from './BugHunterReview';

interface BugHunterArenaProps {
  onBackToArena: () => void;
  initialConfig?: BugHunterConfig;
}

export const BugHunterArena: React.FC<BugHunterArenaProps> = ({
  onBackToArena,
  initialConfig
}) => {
  const [view, setView] = useState<'setup' | 'playing' | 'results' | 'review'>(
    initialConfig ? 'playing' : 'setup'
  );

  const [activeConfig, setActiveConfig] = useState<BugHunterConfig>(
    initialConfig || {
      mode: 'find-bug',
      language: 'Python',
      difficulty: 'Beginner',
      category: 'Mixed',
      challengeCount: 5
    }
  );

  const [challenges, setChallenges] = useState<BugChallenge[]>(() => {
    return filterBugChallenges(
      initialConfig || {
        mode: 'find-bug',
        language: 'Python',
        difficulty: 'Beginner',
        category: 'Mixed',
        challengeCount: 5
      }
    );
  });

  const [lastResult, setLastResult] = useState<BugHunterResultData | null>(null);

  const handleStartGame = (config: BugHunterConfig) => {
    setActiveConfig(config);
    const selected = filterBugChallenges(config);
    setChallenges(selected);
    setView('playing');
  };

  const handleCompleteSession = (attempts: BugAttemptRecord[], totalTimeSeconds: number) => {
    if (!activeConfig || challenges.length === 0) return;

    const result = computeBugHunterResults(activeConfig, challenges, attempts, totalTimeSeconds);
    // Persist result locally
    saveBugHunterResult(result);
    setLastResult(result);
    setView('results');
  };

  const handleRetrySameSession = () => {
    // Keep exact same challenges and start fresh
    setView('playing');
  };

  const handleNewSession = () => {
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
        <BugHunterSetup
          onStartGame={handleStartGame}
          onBackToArena={onBackToArena}
          initialMode={activeConfig?.mode}
        />
      )}

      {view === 'playing' && (
        <BugHunterWorkspace
          config={activeConfig}
          challenges={challenges}
          onCompleteSession={handleCompleteSession}
          onExitToArena={onBackToArena}
        />
      )}

      {view === 'results' && lastResult && (
        <BugHunterResults
          result={lastResult}
          onReviewAnswers={handleReviewAnswers}
          onRetrySession={handleRetrySameSession}
          onNewSession={handleNewSession}
          onBackToArena={onBackToArena}
        />
      )}

      {view === 'review' && lastResult && (
        <BugHunterReview
          result={lastResult}
          challenges={challenges}
          onBackToResults={handleBackToResults}
        />
      )}
    </div>
  );
};
