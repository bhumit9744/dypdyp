import React, { useState } from 'react';
import {
  AlgorithmRushConfig,
  AlgorithmChallenge,
  AlgorithmRushResultData,
  AlgorithmAttemptRecord
} from '../../types/algorithmRush';
import {
  filterAlgorithmChallenges,
  computeAlgorithmRushResults,
  saveAlgorithmRushResult
} from '../../utils/algorithmRushStorage';
import { AlgorithmRushSetup } from './AlgorithmRushSetup';
import { AlgorithmRushWorkspace } from './AlgorithmRushWorkspace';
import { AlgorithmRushResults } from './AlgorithmRushResults';
import { AlgorithmRushReview } from './AlgorithmRushReview';

interface AlgorithmRushArenaProps {
  onBackToArena: () => void;
  initialConfig?: AlgorithmRushConfig;
}

export const AlgorithmRushArena: React.FC<AlgorithmRushArenaProps> = ({
  onBackToArena,
  initialConfig
}) => {
  const [view, setView] = useState<'setup' | 'playing' | 'results' | 'review'>(
    initialConfig ? 'playing' : 'setup'
  );

  const [activeConfig, setActiveConfig] = useState<AlgorithmRushConfig>(
    initialConfig || {
      mode: 'quick-solve',
      topic: 'Mixed DSA',
      difficulty: 'Mixed',
      challengeCount: 5,
      language: 'Language-Independent'
    }
  );

  const [challenges, setChallenges] = useState<AlgorithmChallenge[]>(() => {
    return filterAlgorithmChallenges(
      initialConfig || {
        mode: 'quick-solve',
        topic: 'Mixed DSA',
        difficulty: 'Mixed',
        challengeCount: 5,
        language: 'Language-Independent'
      }
    );
  });

  const [lastResult, setLastResult] = useState<AlgorithmRushResultData | null>(null);

  const handleStartGame = (config: AlgorithmRushConfig) => {
    setActiveConfig(config);
    const selected = filterAlgorithmChallenges(config);
    setChallenges(selected);
    setView('playing');
  };

  const handleCompleteSession = (attempts: AlgorithmAttemptRecord[], totalTimeSeconds: number) => {
    if (!activeConfig || challenges.length === 0) return;

    const result = computeAlgorithmRushResults(activeConfig, challenges, attempts, totalTimeSeconds);
    // Persist result locally
    saveAlgorithmRushResult(result);
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
        <AlgorithmRushSetup
          onStartGame={handleStartGame}
          onBackToArena={onBackToArena}
          initialMode={activeConfig?.mode}
        />
      )}

      {view === 'playing' && (
        <AlgorithmRushWorkspace
          config={activeConfig}
          challenges={challenges}
          onCompleteSession={handleCompleteSession}
          onExitToArena={onBackToArena}
        />
      )}

      {view === 'results' && lastResult && (
        <AlgorithmRushResults
          result={lastResult}
          onReviewAnswers={handleReviewAnswers}
          onRetrySession={handleRetrySameSession}
          onNewSession={handleNewSession}
          onBackToArena={onBackToArena}
        />
      )}

      {view === 'review' && lastResult && (
        <AlgorithmRushReview
          result={lastResult}
          challenges={challenges}
          onBackToResults={handleBackToResults}
        />
      )}
    </div>
  );
};
