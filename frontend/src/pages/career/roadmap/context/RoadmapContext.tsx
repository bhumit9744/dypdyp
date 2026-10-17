import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  StudentRoadmap,
  RoadmapPhase,
  CareerTrack,
  LearningResource,
  RoadmapTask,
  RoadmapProject,
  RoadmapMilestone,
  TaskStatus,
  PhaseStatus,
  RoadmapSetupPreferences,
  RoadmapAssistantMessage,
  RoadmapAdaptationProposal,
  SkillComparisonItem,
  ProgressSnapshot
} from '../types/roadmap';
import { INITIAL_CAREER_TRACKS, INITIAL_RESOURCES } from '../data/roadmapData';
import { useApp } from '../../../../context/AppContext';

interface RoadmapContextType {
  roadmap: StudentRoadmap | null;
  isLoading: boolean;
  careerTracks: CareerTrack[];
  resources: LearningResource[];
  chatMessages: RoadmapAssistantMessage[];
  activeProposal: RoadmapAdaptationProposal | null;
  selectedTrackForPreview: CareerTrack | null;
  setSelectedTrackForPreview: (track: CareerTrack | null) => void;
  isGenerating: boolean;
  activeTab: 'overview' | 'journey' | 'explore-careers' | 'projects' | 'resources' | 'analytics' | 'assistant';
  setActiveTab: (tab: 'overview' | 'journey' | 'explore-careers' | 'projects' | 'resources' | 'analytics' | 'assistant') => void;
  selectedTaskForDetail: RoadmapTask | null;
  setSelectedTaskForDetail: (task: RoadmapTask | null) => void;
  diagnosticSkill: string | null;
  setDiagnosticSkill: (skill: string | null) => void;

  // Actions
  generateRoadmap: (prefs: RoadmapSetupPreferences) => Promise<void>;
  updateTaskStatus: (taskId: string, status: TaskStatus, notes?: string) => Promise<void>;
  updateProject: (projectId: string, updates: Partial<RoadmapProject>) => Promise<void>;
  toggleSaveResource: (resourceId: string) => void;
  updateResourceNotes: (resourceId: string, notes: string) => void;
  addCustomResource: (res: LearningResource) => void;
  askAssistant: (question: string, contextTaskId?: string) => Promise<void>;
  respondToProposal: (accept: boolean) => Promise<void>;
  completeDiagnostic: (skillName: string, passed: boolean) => void;
  rescheduleTask: (taskId: string, newDueDate: string) => void;
  updateWeeklyHours: (hours: number) => void;
  extendTimelineMonths: (additionalMonths: number) => void;
  togglePauseRoadmap: () => void;
  resetRoadmap: () => void;
  getSkillCoverage: () => SkillComparisonItem[];
  getWeeklyWorkload: () => { week: number; plannedHours: number; completedHours: number }[];
}

import { API_BASE } from '../../../../config/api';

const RoadmapContext = createContext<RoadmapContextType | undefined>(undefined);

export const RoadmapProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { studentProfile, skills: appSkills } = useApp();

  const [careerTracks] = useState<CareerTrack[]>(INITIAL_CAREER_TRACKS);
  const [selectedTrackForPreview, setSelectedTrackForPreview] = useState<CareerTrack | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'journey' | 'explore-careers' | 'projects' | 'resources' | 'analytics' | 'assistant'>('overview');
  const [selectedTaskForDetail, setSelectedTaskForDetail] = useState<RoadmapTask | null>(null);
  const [diagnosticSkill, setDiagnosticSkill] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [activeProposal, setActiveProposal] = useState<RoadmapAdaptationProposal | null>(null);

  // Resources state with localStorage persistence
  const [resources, setResources] = useState<LearningResource[]>(() => {
    try {
      const saved = localStorage.getItem('hub_roadmap_resources');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_RESOURCES;
  });

  // Assistant messages state
  const [chatMessages, setChatMessages] = useState<RoadmapAssistantMessage[]>(() => {
    try {
      const saved = localStorage.getItem('hub_roadmap_chat_history');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: 'msg_welcome',
        sender: 'assistant',
        content: 'Hello! I am your AI Career Roadmap Assistant. Ask me what to prioritize today, request concept clarifications, or tell me if you need schedule adjustments.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
  });

  // Active Roadmap State
  const [roadmap, setRoadmap] = useState<StudentRoadmap | null>(() => {
    try {
      const saved = localStorage.getItem('hub_active_roadmap');
      if (saved) return JSON.parse(saved);
    } catch {}
    return null;
  });

  // Save changes to localStorage
  useEffect(() => {
    if (roadmap) {
      localStorage.setItem('hub_active_roadmap', JSON.stringify(roadmap));
    }
  }, [roadmap]);

  useEffect(() => {
    localStorage.setItem('hub_roadmap_resources', JSON.stringify(resources));
  }, [resources]);

  useEffect(() => {
    localStorage.setItem('hub_roadmap_chat_history', JSON.stringify(chatMessages));
  }, [chatMessages]);

  // Sync with backend API on mount if available
  useEffect(() => {
    const syncWithBackend = async () => {
      try {
        const res = await fetch(`${API_BASE}/roadmap/current`, {
          headers: { 'x-student-id': studentProfile?.id || 'std_2026_042' }
        });
        if (res.ok) {
          const data = await res.json();
          if (data.has_roadmap && data.roadmap) {
            setRoadmap(data.roadmap);
          }
        }
      } catch {
        // Handled silently; localStorage fallback is active
      }
    };
    syncWithBackend();
  }, [studentProfile?.id]);

  // Recalculate metrics whenever phases/tasks change
  const recalculateRoadmapMetrics = (currentRoadmap: StudentRoadmap): StudentRoadmap => {
    let totalTasks = 0;
    let completedTasks = 0;
    let completedHours = 0;
    let plannedHours = 0;

    const updatedPhases = currentRoadmap.phases.map((phase) => {
      let phaseCompleted = true;
      let phaseInProgress = false;
      let phaseBlocked = false;

      const updatedTasks = phase.tasks.map((task) => {
        totalTasks += 1;
        plannedHours += task.estimated_hours || 0;
        if (task.status === 'Completed') {
          completedTasks += 1;
          completedHours += task.estimated_hours || 0;
        } else {
          phaseCompleted = false;
        }
        if (task.status === 'In Progress') phaseInProgress = true;
        if (task.status === 'Blocked') phaseBlocked = true;
        return task;
      });

      const newPhaseStatus = phaseCompleted
        ? 'Completed'
        : phaseBlocked
        ? 'Blocked'
        : phaseInProgress
        ? 'In Progress'
        : phase.status;

      return {
        ...phase,
        status: newPhaseStatus,
        tasks: updatedTasks
      };
    });

    const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    const remainingHours = Math.max(0, plannedHours - completedHours);

    // Record snapshot
    const nowIso = new Date().toISOString();
    const newSnapshot: ProgressSnapshot = {
      timestamp: nowIso,
      completed_task_count: completedTasks,
      total_task_count: totalTasks,
      completion_percentage: completionPercentage,
      completed_hours: completedHours,
      planned_hours: plannedHours
    };

    const existingSnaps = currentRoadmap.snapshots || [];
    const updatedSnapshots = [...existingSnaps, newSnapshot];

    return {
      ...currentRoadmap,
      phases: updatedPhases,
      updated_at: nowIso,
      metrics: {
        total_tasks: totalTasks,
        completed_tasks: completedTasks,
        completion_percentage: completionPercentage,
        completed_hours: completedHours,
        planned_hours: plannedHours,
        remaining_hours: remainingHours
      },
      snapshots: updatedSnapshots
    };
  };

  // Generate Personalized Roadmap
  const generateRoadmap = async (prefs: RoadmapSetupPreferences) => {
    setIsGenerating(true);
    try {
      // Try backend endpoint first
      const backendRes = await fetch(`${API_BASE}/roadmap/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-student-id': studentProfile?.id || 'std_2026_042'
        },
        body: JSON.stringify(prefs)
      });

      if (backendRes.ok) {
        // Fetch current generated roadmap from backend
        const getRes = await fetch(`${API_BASE}/roadmap/current`, {
          headers: { 'x-student-id': studentProfile?.id || 'std_2026_042' }
        });
        if (getRes.ok) {
          const data = await getRes.json();
          if (data.has_roadmap && data.roadmap) {
            setRoadmap(data.roadmap);
            setIsGenerating(false);
            setActiveTab('overview');
            return;
          }
        }
      }
    } catch {
      // Backend not reached; execute client-side generation engine
    }

    // Client-Side Generator Engine
    const track = careerTracks.find(t => t.id === prefs.career_track_id) || null;
    const careerTitle = track ? track.title : (prefs.custom_goal || 'Custom Technical Career');
    const roadmapId = `rdm_${Date.now()}`;
    const now = new Date();

    const verifiedSkillNames = new Set(appSkills.filter(s => s.verified).map(s => s.name.toLowerCase()));
    const knownSkillNames = new Set([
      ...Array.from(verifiedSkillNames),
      ...prefs.already_known_skills.map(s => s.toLowerCase()),
      ...appSkills.map(s => s.name.toLowerCase())
    ]);

    const sourcePhases = track ? track.template_phases : [
      {
        phase_number: 1,
        title: 'Phase 1 — Foundations & Core Tooling',
        description: `Core technical fundamentals and tooling required for ${careerTitle}.`,
        why_it_matters: 'Strong basics ensure effective problem-solving during technical interviews.',
        estimated_duration_weeks: 4,
        skills_covered: ['Programming Fundamentals', 'Git & GitHub', 'Core Tooling'],
        practical_milestone: 'Publish a clean, documented repository on GitHub.',
        completion_criteria: ['Working codebase', 'Clear documentation']
      },
      {
        phase_number: 2,
        title: 'Phase 2 — Core Domain Architecture',
        description: `Practical systems and modern frameworks utilized in ${careerTitle}.`,
        why_it_matters: 'Hands-on framework competence separates candidates from beginners.',
        estimated_duration_weeks: 6,
        skills_covered: ['Architecture Patterns', 'API Integration', 'Data Modeling'],
        practical_milestone: 'Construct a full-lifecycle domain project.',
        completion_criteria: ['Responsive interface', 'Error handling']
      },
      {
        phase_number: 3,
        title: 'Phase 3 — Production Readiness & Placement Prep',
        description: 'System design, testing, performance, and mock campus recruitment interviews.',
        why_it_matters: 'Recruiters evaluate architectural trade-offs and problem articulation under pressure.',
        estimated_duration_weeks: 4,
        skills_covered: ['System Design', 'Testing & CI/CD', 'Mock Technical Rounds'],
        practical_milestone: 'Complete mock technical evaluations and finalize portfolio.',
        completion_criteria: ['Demonstrated technical defense', 'Completed DSA revision']
      }
    ];

    const weeksPerPhase = Math.max(2, Math.round((prefs.target_timeline_months * 4.3) / sourcePhases.length));

    let createdTotalTasks = 0;
    let createdCompletedTasks = 0;
    let createdPlannedHours = 0;
    let createdCompletedHours = 0;

    const generatedPhases: RoadmapPhase[] = sourcePhases.map((srcPhase, pIdx) => {
      const phaseId = `phs_${roadmapId}_${pIdx + 1}`;
      const phaseTasks: RoadmapTask[] = srcPhase.skills_covered.map((skillName, tIdx) => {
        const taskId = `tsk_${phaseId}_${tIdx + 1}`;
        const isAlreadyKnown = knownSkillNames.has(skillName.toLowerCase()) && prefs.starting_proficiency !== 'Beginner';
        const taskStatus: TaskStatus = isAlreadyKnown ? 'Completed' : 'Not Started';
        const estHours = Math.round(Math.max(3, prefs.weekly_hours_available / srcPhase.skills_covered.length));

        createdTotalTasks++;
        createdPlannedHours += estHours;
        if (taskStatus === 'Completed') {
          createdCompletedTasks++;
          createdCompletedHours += estHours;
        }

        const taskDueDate = new Date(now);
        taskDueDate.setDate(taskDueDate.getDate() + (pIdx * weeksPerPhase + tIdx + 1) * 7);

        // Find matched resources
        const matchedResourceIds = resources
          .filter(r => r.skills.some(sk => sk.toLowerCase().includes(skillName.toLowerCase()) || skillName.toLowerCase().includes(sk.toLowerCase())))
          .map(r => r.id)
          .slice(0, 2);

        return {
          id: taskId,
          phase_id: phaseId,
          roadmap_id: roadmapId,
          task_number: tIdx + 1,
          week_number: pIdx * weeksPerPhase + (tIdx % weeksPerPhase) + 1,
          title: `Master & Apply ${skillName}`,
          description: `Deep-dive into ${skillName} architecture, best practices, and practical implementation patterns.`,
          associated_skill: skillName,
          learning_objective: `Demonstrate verified practical competence in ${skillName} meeting placement benchmarks.`,
          why_it_matters: `${skillName} is frequently evaluated in technical interviews and code reviews for ${careerTitle}.`,
          estimated_hours: estHours,
          priority: tIdx === 0 ? 'High' : 'Medium',
          prerequisites: tIdx > 0 ? [srcPhase.skills_covered[tIdx - 1]] : [],
          resource_ids: matchedResourceIds,
          practical_exercise: `Implement an end-to-end practical exercise applying ${skillName} with clean code and tests.`,
          completion_criteria: `Working implementation committed to GitHub with zero unhandled errors.`,
          status: taskStatus,
          due_date: taskDueDate.toISOString().split('T')[0],
          completed_at: taskStatus === 'Completed' ? new Date().toISOString() : undefined,
          notes: isAlreadyKnown ? 'Prefilled and verified from your academic profile history.' : undefined
        };
      });

      return {
        id: phaseId,
        roadmap_id: roadmapId,
        phase_number: srcPhase.phase_number,
        title: srcPhase.title,
        description: srcPhase.description,
        why_it_matters: srcPhase.why_it_matters,
        learning_objectives: srcPhase.skills_covered.map(s => `Build practical competency in ${s}`),
        skills_covered: srcPhase.skills_covered,
        prerequisites: srcPhase.prerequisites || [],
        estimated_duration_weeks: weeksPerPhase,
        practical_milestone: srcPhase.practical_milestone,
        completion_criteria: srcPhase.completion_criteria,
        status: (pIdx === 0 ? 'In Progress' : 'Upcoming') as PhaseStatus,
        tasks: phaseTasks
      };
    });

    // Milestone Projects
    const projectTitles = track ? track.typical_project_outcomes : [
      'Capstone Portfolio Application',
      'Production Domain Service'
    ];

    const generatedProjects: RoadmapProject[] = projectTitles.map((title, prjIdx) => ({
      id: `prj_${roadmapId}_${prjIdx + 1}`,
      roadmap_id: roadmapId,
      title: title,
      problem_statement: `Construct a production-grade ${title} demonstrating clean architecture, error handling, and documentation.`,
      expected_outcome: `Publicly deployed application with documented README and test suite.`,
      skills_practiced: track ? track.core_skills.slice(0, 5) : ['System Architecture', 'Design'],
      prerequisite_tasks: [],
      suggested_tech: track ? track.core_skills.slice(0, 4) : ['React', 'FastAPI', 'PostgreSQL'],
      feature_checklist: [
        { label: 'Responsive mobile and desktop UI layout', done: false },
        { label: 'Robust error handling and validation logic', done: false },
        { label: 'Automated test suite with passing CI checks', done: false },
        { label: 'Public live demo URL and GitHub documentation', done: false }
      ],
      definition_of_done: 'Clean Git history, published repository, live demo, and architectural walkthrough.',
      expected_hours: 24,
      portfolio_relevance: 'Direct proof of end-to-end execution during technical recruiter rounds.',
      status: 'Not Started'
    }));

    // Milestones Timeline
    const generatedMilestones: RoadmapMilestone[] = sourcePhases.map((srcPhase, idx) => {
      const milestoneDate = new Date(now);
      milestoneDate.setDate(milestoneDate.getDate() + (idx + 1) * weeksPerPhase * 7);
      return {
        id: `mls_${roadmapId}_${idx + 1}`,
        roadmap_id: roadmapId,
        title: srcPhase.practical_milestone,
        target_date: milestoneDate.toISOString().split('T')[0],
        status: idx === 0 ? 'In Progress' : 'Upcoming',
        associated_phase_or_project: `phs_${roadmapId}_${idx + 1}`
      };
    });

    const completionPercentage = createdTotalTasks > 0 ? Math.round((createdCompletedTasks / createdTotalTasks) * 100) : 0;

    const initialSnapshot: ProgressSnapshot = {
      timestamp: now.toISOString(),
      completed_task_count: createdCompletedTasks,
      total_task_count: createdTotalTasks,
      completion_percentage: completionPercentage,
      completed_hours: createdCompletedHours,
      planned_hours: createdPlannedHours
    };

    const newRoadmap: StudentRoadmap = {
      id: roadmapId,
      student_id: studentProfile?.id || 'std_2026_042',
      career_track_id: prefs.career_track_id,
      career_title: careerTitle,
      custom_goal: prefs.custom_goal,
      specialization: prefs.specialization,
      starting_proficiency: prefs.starting_proficiency,
      target_timeline_months: prefs.target_timeline_months,
      weekly_hours_available: prefs.weekly_hours_available,
      learning_style: prefs.learning_style,
      priority_focus: prefs.priority_focus,
      target_companies: prefs.target_companies,
      status: 'Active',
      current_phase_index: 0,
      created_at: now.toISOString(),
      updated_at: now.toISOString(),
      metrics: {
        total_tasks: createdTotalTasks,
        completed_tasks: createdCompletedTasks,
        completion_percentage: completionPercentage,
        completed_hours: createdCompletedHours,
        planned_hours: createdPlannedHours,
        remaining_hours: Math.max(0, createdPlannedHours - createdCompletedHours)
      },
      phases: generatedPhases,
      projects: generatedProjects,
      milestones: generatedMilestones,
      snapshots: [initialSnapshot]
    };

    setRoadmap(newRoadmap);
    setIsGenerating(false);
    setActiveTab('overview');
  };

  // Update Task Status
  const updateTaskStatus = async (taskId: string, status: TaskStatus, notes?: string) => {
    if (!roadmap) return;

    // Send to backend API
    fetch(`${API_BASE}/roadmap/tasks/${taskId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'x-student-id': studentProfile?.id || 'std_2026_042'
      },
      body: JSON.stringify({ status, notes })
    }).catch(() => {});

    // Update locally
    const updatedPhases = roadmap.phases.map(phase => {
      const taskIndex = phase.tasks.findIndex(t => t.id === taskId);
      if (taskIndex === -1) return phase;

      const updatedTasks = [...phase.tasks];
      const targetTask = updatedTasks[taskIndex];
      updatedTasks[taskIndex] = {
        ...targetTask,
        status,
        notes: notes !== undefined ? notes : targetTask.notes,
        completed_at: status === 'Completed' ? new Date().toISOString() : undefined
      };

      return {
        ...phase,
        tasks: updatedTasks
      };
    });

    const updatedRoadmap = recalculateRoadmapMetrics({
      ...roadmap,
      phases: updatedPhases
    });

    setRoadmap(updatedRoadmap);

    if (selectedTaskForDetail?.id === taskId) {
      setSelectedTaskForDetail(prev => prev ? {
        ...prev,
        status,
        notes: notes !== undefined ? notes : prev.notes,
        completed_at: status === 'Completed' ? new Date().toISOString() : undefined
      } : null);
    }
  };

  // Update Project
  const updateProject = async (projectId: string, updates: Partial<RoadmapProject>) => {
    if (!roadmap) return;

    fetch(`${API_BASE}/roadmap/projects/${projectId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'x-student-id': studentProfile?.id || 'std_2026_042'
      },
      body: JSON.stringify(updates)
    }).catch(() => {});

    const updatedProjects = roadmap.projects.map(proj => {
      if (proj.id !== projectId) return proj;
      return {
        ...proj,
        ...updates,
        completed_at: updates.status === 'Completed' ? new Date().toISOString() : proj.completed_at
      };
    });

    setRoadmap({
      ...roadmap,
      projects: updatedProjects,
      updated_at: new Date().toISOString()
    });
  };

  // Toggle Save Resource
  const toggleSaveResource = (resourceId: string) => {
    setResources(prev =>
      prev.map(r => (r.id === resourceId ? { ...r, saved_for_later: !r.saved_for_later } : r))
    );
  };

  // Update Resource Notes
  const updateResourceNotes = (resourceId: string, notes: string) => {
    setResources(prev =>
      prev.map(r => (r.id === resourceId ? { ...r, personal_notes: notes, is_reviewed: true } : r))
    );
  };

  // Add Custom Resource
  const addCustomResource = (newRes: LearningResource) => {
    setResources(prev => [newRes, ...prev]);
    fetch(`${API_BASE}/roadmap/resources`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newRes)
    }).catch(() => {});
  };

  // Ask Contextual AI Assistant
  const askAssistant = async (question: string, contextTaskId?: string) => {
    if (!question.trim()) return;

    const userMsg: RoadmapAssistantMessage = {
      id: `msg_${Date.now()}`,
      sender: 'user',
      content: question,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const res = await fetch(`${API_BASE}/roadmap/assistant`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-student-id': studentProfile?.id || 'std_2026_042'
        },
        body: JSON.stringify({ prompt: question, task_id: contextTaskId })
      });

      if (res.ok) {
        const data = await res.json();
        const assistantMsg: RoadmapAssistantMessage = {
          id: `msg_${Date.now() + 1}`,
          sender: 'assistant',
          content: data.answer,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          proposal: data.proposal || null
        };
        setChatMessages(prev => [...prev, assistantMsg]);
        if (data.proposal) {
          setActiveProposal(data.proposal);
        }
        setIsLoading(false);
        return;
      }
    } catch {
      // Handled by local reasoning engine below
    }

    // Local Contextual Reasoning Engine
    setTimeout(() => {
      const qLower = question.toLowerCase();
      let answer = '';
      let proposal: RoadmapAdaptationProposal | null = null;
      let diagnosticSkillName: string | null = null;

      if (!roadmap) {
        answer = 'You do not have an active roadmap yet. Head over to the **Choose Your Career** tab to configure your personalized learning track!';
      } else {
        const allTasks = roadmap.phases.flatMap(p => p.tasks);
        const inProg = allTasks.filter(t => t.status === 'In Progress');
        const blocked = allTasks.filter(t => t.status === 'Blocked');
        const notStarted = allTasks.filter(t => t.status === 'Not Started');
        const completed = allTasks.filter(t => t.status === 'Completed');

        if (qLower.includes('today') || qLower.includes('next') || qLower.includes('priority')) {
          if (blocked.length > 0) {
            answer = `You currently have a blocked task: **${blocked[0].title}** (${blocked[0].associated_skill}). I strongly recommend clearing this blocker first. Check its linked resources or test minimal code examples in a sandbox.`;
          } else if (inProg.length > 0) {
            answer = `Focus on your in-progress task today: **${inProg[0].title}** (${inProg[0].associated_skill}). Expected commitment: ~${inProg[0].estimated_hours} hours. Practical objective: "${inProg[0].practical_exercise}".`;
          } else if (notStarted.length > 0) {
            answer = `Your next scheduled task is **${notStarted[0].title}** (${notStarted[0].associated_skill}) in Phase ${roadmap.current_phase_index + 1}. Review the completion criteria and mark it "In Progress" when you start!`;
          } else {
            answer = `Outstanding work! You have finished all planned tasks in your roadmap! Time to review and polish your Capstone Project Milestones.`;
          }
        } else if (qLower.includes('schedule') || qLower.includes('behind') || qLower.includes('missed') || qLower.includes('adjust')) {
          proposal = {
            proposal_id: `prop_${Date.now()}`,
            title: 'Schedule Buffer & Pace Rebalancing',
            reason: 'You requested a schedule realignment or indicated you missed target hours.',
            changes: [
              {
                type: 'Extend Target Timeline',
                description: `Extend your planning horizon by 1 month (from ${roadmap.target_timeline_months} months to ${roadmap.target_timeline_months + 1} months).`
              },
              {
                type: 'Reschedule Remaining Tasks',
                description: `Evenly distribute ${notStarted.length} upcoming tasks across your ${roadmap.weekly_hours_available} hrs/week budget.`
              }
            ],
            affected_tasks_count: notStarted.length,
            affected_timeline_months: roadmap.target_timeline_months + 1
          };
          answer = `I analyzed your progress. You have completed ${completed.length} tasks with ${notStarted.length} remaining. Rather than feeling overwhelmed, here is a balanced adaptation proposal. Review the changes below and click **Accept Changes** to apply them.`;
        } else if (qLower.includes('skip') || qLower.includes('already know') || qLower.includes('test out')) {
          const targetTask = inProg[0] || notStarted[0];
          diagnosticSkillName = targetTask ? targetTask.associated_skill : 'Web Architecture';
          answer = `To preserve the integrity of your placement portfolio, you can test out of prerequisites via a quick diagnostic review. Click below to verify your knowledge in **${diagnosticSkillName}**.`;
        } else if (qLower.includes('stuck') || qLower.includes('explain')) {
          const targetTask = inProg[0] || blocked[0] || notStarted[0];
          answer = `When mastering **${targetTask?.associated_skill || 'this skill'}**, break the problem down into 3 steps:\n1. Verify inputs and expected outputs with simple test cases.\n2. Consult the verified official documentation in your Resource Library.\n3. Implement the minimal isolated feature before combining it with the broader application.`;
        } else {
          answer = `I am your contextual AI assistant for **${roadmap.career_title}**. Current completion: **${roadmap.metrics.completion_percentage}%** (${roadmap.metrics.completed_tasks}/${roadmap.metrics.total_tasks} tasks). Ask me about recommended daily tasks, schedule adjustments, or project milestone guidance.`;
        }
      }

      const assistantMsg: RoadmapAssistantMessage = {
        id: `msg_${Date.now() + 1}`,
        sender: 'assistant',
        content: answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        proposal: proposal,
        diagnosticSkill: diagnosticSkillName
      };

      setChatMessages(prev => [...prev, assistantMsg]);
      if (proposal) setActiveProposal(proposal);
      setIsLoading(false);
    }, 450);
  };

  // Respond to Proposal (Accept or Reject)
  const respondToProposal = async (accept: boolean) => {
    if (!activeProposal || !roadmap) return;

    if (!accept) {
      setActiveProposal(null);
      setChatMessages(prev => [
        ...prev,
        {
          id: `msg_${Date.now()}`,
          sender: 'assistant',
          content: 'Adaptation proposal rejected. Your existing roadmap schedule and deadlines remain unchanged.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      return;
    }

    // Apply proposal
    const newMonths = activeProposal.affected_timeline_months || roadmap.target_timeline_months + 1;
    const now = new Date();
    let dayOffset = 3;

    const updatedPhases = roadmap.phases.map(p => ({
      ...p,
      tasks: p.tasks.map(t => {
        if (t.status === 'Not Started') {
          const newDate = new Date(now);
          newDate.setDate(newDate.getDate() + dayOffset);
          dayOffset += 3;
          return {
            ...t,
            due_date: newDate.toISOString().split('T')[0]
          };
        }
        return t;
      })
    }));

    const adaptedRoadmap: StudentRoadmap = {
      ...roadmap,
      target_timeline_months: newMonths,
      phases: updatedPhases,
      updated_at: new Date().toISOString()
    };

    setRoadmap(adaptedRoadmap);
    setActiveProposal(null);

    setChatMessages(prev => [
      ...prev,
      {
        id: `msg_${Date.now()}`,
        sender: 'assistant',
        content: `Changes applied successfully! Your target timeline has been updated to **${newMonths} months**, and upcoming task due dates have been rebalanced smoothly.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  // Diagnostic Test Out
  const completeDiagnostic = (skillName: string, passed: boolean) => {
    setDiagnosticSkill(null);
    if (!roadmap) return;

    if (passed) {
      // Mark matching tasks as completed
      const updatedPhases = roadmap.phases.map(p => ({
        ...p,
        tasks: p.tasks.map(t => {
          if (t.associated_skill.toLowerCase() === skillName.toLowerCase() && t.status !== 'Completed') {
            return {
              ...t,
              status: 'Completed' as TaskStatus,
              completed_at: new Date().toISOString(),
              notes: 'Passed diagnostic competency assessment.'
            };
          }
          return t;
        })
      }));

      const updated = recalculateRoadmapMetrics({
        ...roadmap,
        phases: updatedPhases
      });
      setRoadmap(updated);

      setChatMessages(prev => [
        ...prev,
        {
          id: `msg_${Date.now()}`,
          sender: 'assistant',
          content: `Congratulations! You passed the diagnostic evaluation for **${skillName}**. Matching roadmap prerequisites have been marked as completed!`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } else {
      setChatMessages(prev => [
        ...prev,
        {
          id: `msg_${Date.now()}`,
          sender: 'assistant',
          content: `The diagnostic assessment for **${skillName}** indicated areas needing review. We recommend following the planned tasks and resources to reinforce your foundation.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  };

  // Reschedule Task
  const rescheduleTask = (taskId: string, newDueDate: string) => {
    if (!roadmap) return;
    const updatedPhases = roadmap.phases.map(p => ({
      ...p,
      tasks: p.tasks.map(t => (t.id === taskId ? { ...t, due_date: newDueDate } : t))
    }));
    setRoadmap({ ...roadmap, phases: updatedPhases, updated_at: new Date().toISOString() });
  };

  // Update Weekly Hours
  const updateWeeklyHours = (hours: number) => {
    if (!roadmap) return;
    setRoadmap({
      ...roadmap,
      weekly_hours_available: hours,
      updated_at: new Date().toISOString()
    });
  };

  // Extend Timeline
  const extendTimelineMonths = (additionalMonths: number) => {
    if (!roadmap) return;
    setRoadmap({
      ...roadmap,
      target_timeline_months: roadmap.target_timeline_months + additionalMonths,
      updated_at: new Date().toISOString()
    });
  };

  // Toggle Pause Roadmap
  const togglePauseRoadmap = () => {
    if (!roadmap) return;
    const newStatus = roadmap.status === 'Active' ? 'Paused' : 'Active';
    setRoadmap({
      ...roadmap,
      status: newStatus,
      updated_at: new Date().toISOString()
    });
  };

  // Reset / Clear Roadmap
  const resetRoadmap = () => {
    setRoadmap(null);
    localStorage.removeItem('hub_active_roadmap');
  };

  // Get Skill Coverage Comparison
  const getSkillCoverage = useCallback((): SkillComparisonItem[] => {
    if (!roadmap) return [];

    const verifiedSkillsMap = new Map<string, { verified: boolean; level: string; source?: string }>();
    appSkills.forEach(s => {
      verifiedSkillsMap.set(s.name.toLowerCase(), {
        verified: s.verified,
        level: s.level,
        source: s.verificationSource
      });
    });

    const levelToScore = (lvl: string): number => {
      switch (lvl) {
        case 'Expert': return 95;
        case 'Advanced': return 80;
        case 'Intermediate': return 65;
        case 'Beginner': return 40;
        default: return 30;
      }
    };

    // Collect skills across roadmap
    const uniqueSkills = Array.from(new Set(roadmap.phases.flatMap(p => p.skills_covered)));

    return uniqueSkills.slice(0, 8).map(skillName => {
      const match = verifiedSkillsMap.get(skillName.toLowerCase()) || null;
      const isDemonstrated = Boolean(match && match.verified);
      const isSelfReported = Boolean(match && !match.verified);

      const requiredLevel = 85;
      const demonstratedLevel = isDemonstrated ? levelToScore(match!.level) : 0;
      const selfReportedLevel = isSelfReported ? levelToScore(match!.level) : (isDemonstrated ? levelToScore(match!.level) : 0);

      const status: 'Demonstrated' | 'Self-Reported' | 'Not Assessed' = isDemonstrated
        ? 'Demonstrated'
        : isSelfReported
        ? 'Self-Reported'
        : 'Not Assessed';

      return {
        skill: skillName,
        required_level: requiredLevel,
        demonstrated_level: demonstratedLevel,
        self_reported_level: selfReportedLevel,
        is_verified: isDemonstrated,
        verification_source: match?.source,
        status
      };
    });
  }, [roadmap, appSkills]);

  // Get Weekly Workload
  const getWeeklyWorkload = useCallback(() => {
    if (!roadmap) return [];

    const weekMap = new Map<number, { planned: number; completed: number }>();
    const allTasks = roadmap.phases.flatMap(p => p.tasks);

    allTasks.forEach(task => {
      const w = task.week_number || 1;
      const current = weekMap.get(w) || { planned: 0, completed: 0 };
      current.planned += task.estimated_hours || 0;
      if (task.status === 'Completed') {
        current.completed += task.estimated_hours || 0;
      }
      weekMap.set(w, current);
    });

    const weeks = Array.from(weekMap.keys()).sort((a, b) => a - b);
    return weeks.map(w => ({
      week: w,
      plannedHours: Math.round(weekMap.get(w)!.planned),
      completedHours: Math.round(weekMap.get(w)!.completed)
    }));
  }, [roadmap]);

  return (
    <RoadmapContext.Provider
      value={{
        roadmap,
        isLoading,
        careerTracks,
        resources,
        chatMessages,
        activeProposal,
        selectedTrackForPreview,
        setSelectedTrackForPreview,
        isGenerating,
        activeTab,
        setActiveTab,
        selectedTaskForDetail,
        setSelectedTaskForDetail,
        diagnosticSkill,
        setDiagnosticSkill,
        generateRoadmap,
        updateTaskStatus,
        updateProject,
        toggleSaveResource,
        updateResourceNotes,
        addCustomResource,
        askAssistant,
        respondToProposal,
        completeDiagnostic,
        rescheduleTask,
        updateWeeklyHours,
        extendTimelineMonths,
        togglePauseRoadmap,
        resetRoadmap,
        getSkillCoverage,
        getWeeklyWorkload
      }}
    >
      {children}
    </RoadmapContext.Provider>
  );
};

export const useRoadmap = () => {
  const context = useContext(RoadmapContext);
  if (!context) throw new Error('useRoadmap must be used within a RoadmapProvider');
  return context;
};
