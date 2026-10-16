import React, { useState } from 'react';
import { HRInterviewConfig, HRInterviewResultData, HRQuestion, HRQuestionAttempt } from '../../types/hrInterview';
import { HR_INTERVIEW_QUESTIONS } from '../../data/hrInterviewQuestions';
import { filterHRQuestions, calculateHRResult, saveHRSessionResult } from '../../utils/hrInterviewStorage';
import { HRInterviewSetup } from './HRInterviewSetup';
import { HRInterviewWorkspace } from './HRInterviewWorkspace';
import { HRInterviewResults } from './HRInterviewResults';
import { HRInterviewReview } from './HRInterviewReview';

interface HRInterviewArenaProps {
  onBackToArena: () => void;
  initialConfig?: HRInterviewConfig;
}

export const HRInterviewArena: React.FC<HRInterviewArenaProps> = ({
  onBackToArena,
  initialConfig
}) => {
  const [view, setView] = useState<'setup' | 'interview' | 'results' | 'review'>('setup');
  const [currentConfig, setCurrentConfig] = useState<HRInterviewConfig>(
    initialConfig || {
      mode: 'core-interview',
      category: 'Mixed HR',
      difficulty: 'Beginner',
      questionCount: 5,
      isTimed: false,
      hintsEnabled: true,
      timedMode: false,
      showHints: true
    }
  );
  const [sessionQuestions, setSessionQuestions] = useState<HRQuestion[]>([]);
  const [sessionResult, setSessionResult] = useState<HRInterviewResultData | null>(null);

  // Start interview session
  const handleStartSession = (config: HRInterviewConfig) => {
    setCurrentConfig(config);
    const questions = filterHRQuestions(HR_INTERVIEW_QUESTIONS, config);
    setSessionQuestions(questions);
    setView('interview');
  };

  // Complete interview session
  const handleFinishSession = (attempts: HRQuestionAttempt[], totalTimeSeconds: number) => {
    const result = calculateHRResult(currentConfig, sessionQuestions, attempts, totalTimeSeconds);
    saveHRSessionResult(result);
    setSessionResult(result);
    setView('results');
  };

  // Retry with same configuration
  const handleRetrySession = () => {
    const questions = filterHRQuestions(HR_INTERVIEW_QUESTIONS, currentConfig);
    setSessionQuestions(questions);
    setView('interview');
  };

  return (
    <div className="w-full">
      {view === 'setup' && (
        <HRInterviewSetup
          onStartSession={handleStartSession}
          onBackToArena={onBackToArena}
          initialConfig={currentConfig}
        />
      )}

      {view === 'interview' && (
        <HRInterviewWorkspace
          config={currentConfig}
          questions={sessionQuestions}
          onFinishSession={handleFinishSession}
          onExitSession={() => setView('setup')}
        />
      )}

      {view === 'results' && sessionResult && (
        <HRInterviewResults
          result={sessionResult}
          onReviewAnswers={() => setView('review')}
          onRetrySession={handleRetrySession}
          onNewSession={() => setView('setup')}
          onBackToArena={onBackToArena}
        />
      )}

      {view === 'review' && sessionResult && (
        <HRInterviewReview
          result={sessionResult}
          questions={HR_INTERVIEW_QUESTIONS}
          onBackToResults={() => setView('results')}
        />
      )}
    </div>
  );
};
