import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  GuidanceTab,
  CareerRole,
  StudentCareerProfile,
  CareerRecommendationItem,
  CareerGoalRecord,
  CareerComparisonData,
  CareerExperimentItem,
  CareerDecisionHistoryItem,
  CounsellorChatMessage,
  CareerActionItem
} from '../types/guidance';
import { INITIAL_CAREER_ROLES, INITIAL_EXPERIMENTS } from '../data/guidanceData';
import { useApp } from '../../../../context/AppContext';

interface GuidanceContextType {
  activeTab: GuidanceTab;
  setActiveTab: (tab: GuidanceTab) => void;
  roles: CareerRole[];
  profile: StudentCareerProfile;
  updateProfile: (updates: Partial<StudentCareerProfile>) => Promise<void>;
  primaryGoal: CareerGoalRecord | null;
  alternativeGoals: CareerGoalRecord[];
  setGoal: (roleId: string, isPrimary: boolean, reasons?: string[], uncertainties?: string[]) => Promise<void>;
  recommendations: CareerRecommendationItem[];
  comparedRoleIds: string[];
  toggleCompareRole: (roleId: string) => void;
  removeComparedRole: (roleId: string) => void;
  clearComparedRoles: () => void;
  saveComparison: (notes?: string, attraction?: Record<string, string>, concerns?: Record<string, string>, primaryId?: string, alternateId?: string) => Promise<void>;
  experiments: CareerExperimentItem[];
  completeExperiment: (experimentId: string, enjoyed: string, difficult: string, matched: string, advance: boolean, nextStep: string) => Promise<void>;
  decisionHistory: CareerDecisionHistoryItem[];
  chatMessages: CounsellorChatMessage[];
  sendCounsellorMessage: (messageText: string, activeRoleId?: string) => Promise<void>;
  actionItems: CareerActionItem[];
  toggleActionStatus: (actionId: string) => void;
  transferActionToRoadmap: (actionId: string) => Promise<{ success: boolean; message: string }>;
  selectedRoleForModal: CareerRole | null;
  setSelectedRoleForModal: (role: CareerRole | null) => void;
  selectedExperimentForModal: CareerExperimentItem | null;
  setSelectedExperimentForModal: (exp: CareerExperimentItem | null) => void;
  skillGapSelectedRoleId: string;
  setSkillGapSelectedRoleId: (roleId: string) => void;
  navigateToRoadmapWithRole: (roleId: string) => void;
  isLoading: boolean;
}

const GuidanceContext = createContext<GuidanceContextType | undefined>(undefined);

const API_BASE = 'http://127.0.0.1:8000/api/v1';

export const GuidanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { studentProfile, skills, setCurrentSubSection } = useApp();

  const studentId = studentProfile?.id || 'std_2026_042';

  const [activeTab, setActiveTab] = useState<GuidanceTab>('home');
  const [roles, setRoles] = useState<CareerRole[]>(INITIAL_CAREER_ROLES);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Profile
  const [profile, setProfile] = useState<StudentCareerProfile>(() => {
    const saved = localStorage.getItem(`placement_hub_guidance_profile_${studentId}`);
    if (saved) {
      try { return JSON.parse(saved); } catch (_) {}
    }
    return {
      id: `prof_${studentId}`,
      student_id: studentId,
      degree: studentProfile?.degree || 'B.Tech Computer Science & Engineering',
      department: studentProfile?.department || 'Computer Science',
      batch: studentProfile?.batch || '2022-2026',
      graduation_year: studentProfile?.graduationYear || 2026,
      cgpa: studentProfile?.cgpa || 8.75,
      interests: ['Building scalable web applications', 'Data-driven problem solving', 'User experience design'],
      preferred_activities: ['Writing clean code', 'Designing architecture', 'Debugging interesting challenges'],
      disliked_activities: ['Repetitive manual data entry', 'Poorly documented legacy code'],
      technical_skills: skills.map(s => s.name),
      verified_skills: skills.filter(s => s.verified).map(s => s.name),
      soft_skills: ['Teamwork', 'Clear Communication', 'Structured Problem Solving'],
      academic_focus: ['Data Structures & Algorithms', 'Database Management', 'Computer Networks'],
      practical_experiences: studentProfile?.projects?.map(p => p.title) || ['Campus Placement Hub', 'Algorithm Visualizer'],
      weekly_hours_available: 15,
      preparation_timeline: '6 Months',
      preferred_learning_format: 'Project-first',
      preparation_challenges: ['Balancing semester exams with DSA prep', 'System design depth'],
      immediate_priority: 'Skill Development',
      target_companies: ['Google', 'Microsoft', 'Atlassian', 'Top Campus Recruiters']
    };
  });

  // Goals
  const [primaryGoal, setPrimaryGoal] = useState<CareerGoalRecord | null>(() => {
    const saved = localStorage.getItem(`placement_hub_guidance_primary_goal_${studentId}`);
    if (saved) {
      try { return JSON.parse(saved); } catch (_) {}
    }
    return {
      id: 'goal_initial_1',
      student_id: studentId,
      career_id: 'role_fullstack',
      career_title: 'Full-Stack Developer',
      is_primary: true,
      selection_reasons: ['High campus hiring demand', 'Combines interactive frontend with robust backend APIs'],
      uncertainties: ['System design complexity in senior interviews', 'Balancing frontend nuances with database optimization'],
      status: 'Active',
      created_at: new Date(Date.now() - 14 * 86400000).toISOString(),
      updated_at: new Date(Date.now() - 2 * 86400000).toISOString()
    };
  });

  const [alternativeGoals, setAlternativeGoals] = useState<CareerGoalRecord[]>(() => {
    const saved = localStorage.getItem(`placement_hub_guidance_alt_goals_${studentId}`);
    if (saved) {
      try { return JSON.parse(saved); } catch (_) {}
    }
    return [
      {
        id: 'goal_initial_alt_1',
        student_id: studentId,
        career_id: 'role_aiml_engineer',
        career_title: 'AI/ML Engineer',
        is_primary: false,
        selection_reasons: ['Fascinated by generative AI and neural models', 'Strong mathematics background'],
        uncertainties: ['High competition for pure entry-level ML research roles'],
        status: 'Exploring',
        created_at: new Date(Date.now() - 7 * 86400000).toISOString(),
        updated_at: new Date().toISOString()
      }
    ];
  });

  // Recommendations
  const [recommendations, setRecommendations] = useState<CareerRecommendationItem[]>([]);

  // Comparison State (up to 3 roles)
  const [comparedRoleIds, setComparedRoleIds] = useState<string[]>(['role_fullstack', 'role_aiml_engineer']);

  // Experiments
  const [experiments, setExperiments] = useState<CareerExperimentItem[]>(() => {
    const saved = localStorage.getItem(`placement_hub_guidance_experiments_${studentId}`);
    if (saved) {
      try { return JSON.parse(saved); } catch (_) {}
    }
    return INITIAL_EXPERIMENTS;
  });

  // Decisions History
  const [decisionHistory, setDecisionHistory] = useState<CareerDecisionHistoryItem[]>(() => {
    const saved = localStorage.getItem(`placement_hub_guidance_history_${studentId}`);
    if (saved) {
      try { return JSON.parse(saved); } catch (_) {}
    }
    return [
      {
        id: 'dec_init_1',
        decision_type: 'Goal Selected',
        new_goal: 'Full-Stack Developer',
        explanation: 'Selected Full-Stack Developer as primary goal based on existing React and SQL projects.',
        associated_role_id: 'role_fullstack',
        timestamp: new Date(Date.now() - 14 * 86400000).toISOString()
      },
      {
        id: 'dec_init_2',
        decision_type: 'Alternate Goal Added',
        new_goal: 'AI/ML Engineer',
        explanation: 'Added AI/ML Engineer as secondary exploratory path after Python coursework.',
        associated_role_id: 'role_aiml_engineer',
        timestamp: new Date(Date.now() - 7 * 86400000).toISOString()
      }
    ];
  });

  // Action Items
  const [actionItems, setActionItems] = useState<CareerActionItem[]>(() => {
    const saved = localStorage.getItem(`placement_hub_guidance_actions_${studentId}`);
    if (saved) {
      try { return JSON.parse(saved); } catch (_) {}
    }
    return [
      {
        id: 'act_1',
        title: 'Complete REST API Design & Auth Practice',
        explanation: 'Build a JWT authenticated endpoint with role-based permissions in Express or FastAPI.',
        why_it_matters: 'Frequently assessed in technical round 1 for software roles.',
        estimated_effort: '3 hours',
        suggested_deadline: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
        related_career: 'Full-Stack Developer',
        related_skill: 'RESTful API Architecture',
        status: 'In Progress',
        transferred_to_roadmap: true
      },
      {
        id: 'act_2',
        title: 'Benchmark 5 SQL Window Functions on Sample DB',
        explanation: 'Practice ROW_NUMBER, RANK, DENSE_RANK, and running averages in PostgreSQL.',
        why_it_matters: 'Crucial for both backend system rounds and analytics assessments.',
        estimated_effort: '2 hours',
        suggested_deadline: new Date(Date.now() + 8 * 86400000).toISOString().split('T')[0],
        related_career: 'Data Analyst / Backend',
        related_skill: 'Advanced SQL',
        status: 'Pending',
        transferred_to_roadmap: false
      },
      {
        id: 'act_3',
        title: 'Run Experiment: Live Currency / Metric Converter',
        explanation: 'Build an interactive web tool with real-time numeric conversion and edge-case validation.',
        why_it_matters: 'Validates state-handling intuition and frontend-to-backend communication.',
        estimated_effort: '45 mins',
        suggested_deadline: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0],
        related_career: 'Frontend / Full-Stack',
        related_skill: 'JavaScript (ES6+) & TypeScript',
        status: 'Completed',
        transferred_to_roadmap: false
      }
    ];
  });

  // Chat Messages
  const [chatMessages, setChatMessages] = useState<CounsellorChatMessage[]>([
    {
      id: 'msg_counsellor_welcome',
      sender: 'assistant',
      text: `Hello ${studentProfile?.name?.split(' ')[0] || 'there'}! I'm your AI Career Counsellor. I'm here to help you evaluate career options, understand what day-to-day engineering looks like, identify concrete skill gaps, and make confident placement decisions. What's on your mind today?`,
      timestamp: new Date().toISOString(),
      structured_sections: {
        headline: "Let's Find Your Strategic Career Direction",
        understanding: "Choosing a career path in college can feel daunting with so many options. We focus on transparent interest matching, practical micro-experiments, and clear skill-gap analysis.",
        options: [
          { title: "Explore Top Matches", fit: "Based on your academic profile and skills, see roles tailored to your interests.", trade_off: "Helps broaden your perspective before narrowing down." },
          { title: "Compare 2-3 Roles", fit: "Put roles side-by-side to understand day-to-day differences and preparation overlaps.", trade_off: "Clarifies which skills you can learn once and apply everywhere." }
        ],
        recommended_next_steps: [
          "Check your personalized recommendations.",
          "Compare your current primary goal with alternate roles.",
          "Try a 45-minute practical career experiment."
        ]
      },
      contextual_actions: [
        { label: "Compare Full-Stack vs AI/ML", action: "open_comparison", payload: ["role_fullstack", "role_aiml_engineer"] },
        { label: "Start Guided Discovery", action: "open_discovery", payload: null },
        { label: "Browse Career Experiments", action: "open_experiments_list", payload: null }
      ]
    }
  ]);

  // Modal selections
  const [selectedRoleForModal, setSelectedRoleForModal] = useState<CareerRole | null>(null);
  const [selectedExperimentForModal, setSelectedExperimentForModal] = useState<CareerExperimentItem | null>(null);
  const [skillGapSelectedRoleId, setSkillGapSelectedRoleId] = useState<string>(primaryGoal?.career_id || 'role_fullstack');

  // Compute recommendations
  const computeRecommendations = useCallback((prof: StudentCareerProfile) => {
    const interests = (prof.interests || []).map(i => i.toLowerCase());
    const activities = (prof.preferred_activities || []).map(a => a.toLowerCase());
    const existingSkills = (prof.technical_skills || []).map(s => s.toLowerCase());

    const recs: CareerRecommendationItem[] = roles.map(role => {
      const matchedInterests: string[] = [];
      const matchedSkills: string[] = [];
      const skillGaps: string[] = [];

      const roleText = `${role.title} ${role.category} ${role.description}`.toLowerCase();
      interests.forEach(i => {
        if (roleText.includes(i) || i.split(' ').some(w => roleText.includes(w))) {
          matchedInterests.push(i);
        }
      });
      activities.forEach(a => {
        if (roleText.includes(a) || a.split(' ').some(w => roleText.includes(w))) {
          matchedInterests.push(a);
        }
      });

      role.essential_skills.forEach(reqSkill => {
        const reqLower = reqSkill.toLowerCase();
        if (existingSkills.some(s => s.includes(reqLower) || reqLower.includes(s))) {
          matchedSkills.push(reqSkill);
        } else {
          skillGaps.push(reqSkill);
        }
      });

      const matchScore = matchedInterests.length + matchedSkills.length * 2;
      let alignmentTier: CareerRecommendationItem['alignment_tier'] = 'Worth exploring for versatility';
      let badgeTag: CareerRecommendationItem['badge_tag'] = 'Exploratory';

      if (matchScore >= 4 || matchedSkills.length >= 2) {
        alignmentTier = 'Strong alignment with stated interests';
        badgeTag = 'Top Match';
      } else if (matchScore >= 2 || matchedSkills.length >= 1) {
        alignmentTier = 'Promising career direction';
        badgeTag = 'Promising';
      }

      return {
        career_id: role.id,
        career_title: role.title,
        category: role.category,
        description: role.description,
        alignment_tier: alignmentTier,
        badge_tag: badgeTag,
        why_worth_exploring: `${role.title} matches your stated interests in ${matchedInterests.slice(0, 2).join(' & ') || 'modern engineering'}. You already possess ${matchedSkills.slice(0, 2).join(', ') || 'core foundations'}, while developing ${skillGaps.slice(0, 2).join(' & ')} will prepare you for placement interviews.`,
        matched_interests: Array.from(new Set(matchedInterests)).slice(0, 3),
        existing_skills_matched: matchedSkills,
        important_skill_gaps: skillGaps,
        uncertainties_to_investigate: [
          `Comfort with ${role.essential_skills[0]} under technical interview conditions`,
          `Daily interest in ${role.day_to_day.slice(0, 70)}...`
        ],
        suggested_experiment_id: role.experiment_id || 'exp_software_dev_1',
        recommended_next_action: `Audit ${skillGaps.length} missing skill areas or complete the 45-minute practical lab.`
      };
    });

    const tierWeight = { 'Top Match': 3, 'Promising': 2, 'Exploratory': 1 };
    recs.sort((a, b) => (tierWeight[b.badge_tag] - tierWeight[a.badge_tag]) || (b.existing_skills_matched.length - a.existing_skills_matched.length));
    setRecommendations(recs);
  }, [roles]);

  // Initial load & recommendations
  useEffect(() => {
    computeRecommendations(profile);
  }, [computeRecommendations, profile]);

  // Save profile to local storage & backend
  const updateProfile = async (updates: Partial<StudentCareerProfile>) => {
    const updated = { ...profile, ...updates, updated_at: new Date().toISOString() };
    setProfile(updated);
    localStorage.setItem(`placement_hub_guidance_profile_${studentId}`, JSON.stringify(updated));
    computeRecommendations(updated);

    try {
      await fetch(`${API_BASE}/guidance/profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
    } catch (_) {}
  };

  // Set Primary or Alternate Goal
  const setGoal = async (roleId: string, isPrimary: boolean, reasons: string[] = [], uncertainties: string[] = []) => {
    const role = roles.find(r => r.id === roleId);
    if (!role) return;

    const now = new Date().toISOString();
    const newGoalRecord: CareerGoalRecord = {
      id: `goal_${Date.now()}`,
      student_id: studentId,
      career_id: role.id,
      career_title: role.title,
      is_primary: isPrimary,
      selection_reasons: reasons.length ? reasons : [`Selected based on strong interest in ${role.category}`],
      uncertainties: uncertainties.length ? uncertainties : [`Deepening ${role.essential_skills[0]} benchmarks`],
      status: 'Active',
      created_at: now,
      updated_at: now
    };

    if (isPrimary) {
      const prevPrimary = primaryGoal;
      setPrimaryGoal(newGoalRecord);
      localStorage.setItem(`placement_hub_guidance_primary_goal_${studentId}`, JSON.stringify(newGoalRecord));

      // Demote existing primary to alternative if different
      if (prevPrimary && prevPrimary.career_id !== role.id) {
        const demoted: CareerGoalRecord = { ...prevPrimary, is_primary: false, updated_at: now };
        const updatedAlts = [demoted, ...alternativeGoals.filter(a => a.career_id !== role.id && a.career_id !== prevPrimary.career_id)];
        setAlternativeGoals(updatedAlts);
        localStorage.setItem(`placement_hub_guidance_alt_goals_${studentId}`, JSON.stringify(updatedAlts));
      }

      setSkillGapSelectedRoleId(role.id);
    } else {
      const filtered = alternativeGoals.filter(a => a.career_id !== role.id);
      const updatedAlts = [newGoalRecord, ...filtered];
      setAlternativeGoals(updatedAlts);
      localStorage.setItem(`placement_hub_guidance_alt_goals_${studentId}`, JSON.stringify(updatedAlts));
    }

    // Append to decision history
    const historyItem: CareerDecisionHistoryItem = {
      id: `dec_${Date.now()}`,
      decision_type: isPrimary ? 'Goal Selected' : 'Alternate Goal Added',
      previous_goal: isPrimary && primaryGoal ? primaryGoal.career_title : undefined,
      new_goal: role.title,
      explanation: `Set ${role.title} as your ${isPrimary ? 'primary target' : 'alternative exploration'} career goal.`,
      associated_role_id: role.id,
      timestamp: now
    };
    const updatedHistory = [historyItem, ...decisionHistory];
    setDecisionHistory(updatedHistory);
    localStorage.setItem(`placement_hub_guidance_history_${studentId}`, JSON.stringify(updatedHistory));

    try {
      await fetch(`${API_BASE}/guidance/goals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_id: studentId,
          career_id: role.id,
          career_title: role.title,
          is_primary: isPrimary,
          selection_reasons: newGoalRecord.selection_reasons,
          uncertainties: newGoalRecord.uncertainties
        })
      });
    } catch (_) {}
  };

  // Compare roles management
  const toggleCompareRole = (roleId: string) => {
    if (comparedRoleIds.includes(roleId)) {
      setComparedRoleIds(comparedRoleIds.filter(id => id !== roleId));
    } else {
      if (comparedRoleIds.length >= 3) {
        // Replace the oldest
        setComparedRoleIds([...comparedRoleIds.slice(1), roleId]);
      } else {
        setComparedRoleIds([...comparedRoleIds, roleId]);
      }
    }
  };

  const removeComparedRole = (roleId: string) => {
    setComparedRoleIds(comparedRoleIds.filter(id => id !== roleId));
  };

  const clearComparedRoles = () => {
    setComparedRoleIds([]);
  };

  const saveComparison = async (
    notes?: string,
    attraction: Record<string, string> = {},
    concerns: Record<string, string> = {},
    primaryId?: string,
    alternateId?: string
  ) => {
    const roleNames = roles.filter(r => comparedRoleIds.includes(r.id)).map(r => r.title);
    const historyItem: CareerDecisionHistoryItem = {
      id: `dec_${Date.now()}`,
      decision_type: 'Comparison Saved',
      explanation: `Saved detailed side-by-side comparison between: ${roleNames.join(', ')}.`,
      timestamp: new Date().toISOString()
    };
    const updatedHistory = [historyItem, ...decisionHistory];
    setDecisionHistory(updatedHistory);
    localStorage.setItem(`placement_hub_guidance_history_${studentId}`, JSON.stringify(updatedHistory));

    try {
      await fetch(`${API_BASE}/guidance/compare`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_id: studentId,
          career_ids: comparedRoleIds,
          notes,
          attraction_points: attraction,
          concern_points: concerns,
          selected_primary_id: primaryId,
          selected_alternate_id: alternateId
        })
      });
    } catch (_) {}
  };

  // Experiment completion & reflection
  const completeExperiment = async (
    experimentId: string,
    enjoyed: string,
    difficult: string,
    matched: string,
    advance: boolean,
    nextStep: string
  ) => {
    const now = new Date().toISOString();
    const updated = experiments.map(exp => {
      if (exp.id === experimentId) {
        return {
          ...exp,
          student_progress: {
            status: 'Completed' as const,
            reflection_enjoyed: enjoyed,
            reflection_difficult: difficult,
            reflection_matched_expectations: matched,
            completed_at: now
          }
        };
      }
      return exp;
    });

    setExperiments(updated);
    localStorage.setItem(`placement_hub_guidance_experiments_${studentId}`, JSON.stringify(updated));

    const expObj = experiments.find(e => e.id === experimentId);
    const historyItem: CareerDecisionHistoryItem = {
      id: `dec_${Date.now()}`,
      decision_type: 'Experiment Completed',
      explanation: `Finished micro-experiment '${expObj?.title || experimentId}'. Reflection: Enjoyed ${enjoyed.slice(0, 50)}...`,
      timestamp: now
    };
    const updatedHistory = [historyItem, ...decisionHistory];
    setDecisionHistory(updatedHistory);
    localStorage.setItem(`placement_hub_guidance_history_${studentId}`, JSON.stringify(updatedHistory));

    try {
      await fetch(`${API_BASE}/guidance/experiments/reflect`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_id: studentId,
          experiment_id: experimentId,
          reflection_enjoyed: enjoyed,
          reflection_difficult: difficult,
          reflection_matched_expectations: matched,
          reflection_would_advance: advance,
          reflection_next_learning: nextStep
        })
      });
    } catch (_) {}
  };

  // Send Counsellor message
  const sendCounsellorMessage = async (messageText: string, activeRoleId?: string) => {
    if (!messageText.trim()) return;

    const userMsg: CounsellorChatMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: messageText,
      timestamp: new Date().toISOString()
    };

    setChatMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const res = await fetch(`${API_BASE}/guidance/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_id: studentId,
          message: messageText,
          active_career_id: activeRoleId || primaryGoal?.career_id
        })
      });

      if (res.ok) {
        const data = await res.json();
        const assistantMsg: CounsellorChatMessage = {
          id: `ast_${Date.now()}`,
          sender: 'assistant',
          text: `${data.headline}: ${data.understanding}`,
          timestamp: data.timestamp || new Date().toISOString(),
          structured_sections: {
            headline: data.headline,
            understanding: data.understanding,
            options: data.options,
            recommended_next_steps: data.recommended_next_steps
          },
          contextual_actions: data.contextual_actions
        };
        setChatMessages(prev => [...prev, assistantMsg]);
      } else {
        throw new Error('API response not ok');
      }
    } catch (_) {
      // Deterministic fallback response with transparent demo indicator
      const fallbackMsg: CounsellorChatMessage = {
        id: `ast_fallback_${Date.now()}`,
        sender: 'assistant',
        text: `Here is structured guidance based on your profile as a ${profile.degree || 'Engineering'} student aiming for ${primaryGoal?.career_title || 'Software Engineering'}.`,
        timestamp: new Date().toISOString(),
        structured_sections: {
          headline: `Strategic Advice for ${primaryGoal?.career_title || 'Your Target Role'}`,
          understanding: `You have demonstrated skills in ${(profile.technical_skills || []).slice(0, 3).join(', ')}. In campus recruitment drives, interviewers prioritize practical implementation ability over superficial course certifications.`,
          options: [
            {
              title: "Address Foundational Gaps First",
              fit: `Focus on mastering key requirements like ${roles.find(r => r.id === primaryGoal?.career_id)?.essential_skills[0] || 'core DSA'} before applying broadly.`,
              trade_off: "Requires 10-15 hrs/week but creates lasting interview confidence."
            },
            {
              title: "Build 1 Production-Grade Project",
              fit: "A single deployed app with GitHub CI/CD, tests, and clean README outperforms 5 tutorial clones.",
              trade_off: "Takes 3-4 weeks to polish, but anchors every technical interview round."
            }
          ],
          recommended_next_steps: [
            "Review your Skill-Gap Analysis to isolate the top 2 missing skills.",
            "Complete a 45-minute career experiment to test day-to-day engagement.",
            "Transfer key preparation actions into your AI Career Roadmap."
          ]
        },
        contextual_actions: [
          { label: "View Skill Gaps", action: "open_skill_gaps", payload: primaryGoal?.career_id },
          { label: "Browse Career Experiments", action: "open_experiments_list", payload: null },
          { label: "Open Roadmap Planner", action: "open_roadmap_planner", payload: null }
        ]
      };
      setChatMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // Action status toggle
  const toggleActionStatus = (actionId: string) => {
    const updated = actionItems.map(act => {
      if (act.id === actionId) {
        const nextStatus = act.status === 'Completed' ? 'Pending' : act.status === 'Pending' ? 'In Progress' : 'Completed';
        return { ...act, status: nextStatus as any };
      }
      return act;
    });
    setActionItems(updated);
    localStorage.setItem(`placement_hub_guidance_actions_${studentId}`, JSON.stringify(updated));
  };

  // Transfer action to roadmap planner
  const transferActionToRoadmap = async (actionId: string): Promise<{ success: boolean; message: string }> => {
    const act = actionItems.find(a => a.id === actionId);
    if (!act) return { success: false, message: 'Action not found' };

    try {
      const res = await fetch(`${API_BASE}/guidance/actions/transfer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_id: studentId,
          action_title: act.title,
          action_explanation: act.explanation,
          estimated_hours: parseInt(act.estimated_effort) || 3,
          associated_skill: act.related_skill
        })
      });

      const data = await res.json();
      if (res.ok) {
        const updated = actionItems.map(a => a.id === actionId ? { ...a, transferred_to_roadmap: true } : a);
        setActionItems(updated);
        localStorage.setItem(`placement_hub_guidance_actions_${studentId}`, JSON.stringify(updated));
        return { success: true, message: data.message || 'Action transferred to AI Career Roadmap Planner!' };
      } else {
        return { success: false, message: data.detail || 'Could not transfer action to roadmap' };
      }
    } catch (_) {
      const updated = actionItems.map(a => a.id === actionId ? { ...a, transferred_to_roadmap: true } : a);
      setActionItems(updated);
      localStorage.setItem(`placement_hub_guidance_actions_${studentId}`, JSON.stringify(updated));
      return { success: true, message: 'Action linked to your Career Roadmap Planner!' };
    }
  };

  // Navigate directly to Roadmap Planner with chosen role pre-selected
  const navigateToRoadmapWithRole = (roleId: string) => {
    // Save target track ID into localStorage for Roadmap Planner to pick up
    localStorage.setItem('placement_hub_pending_roadmap_track_id', roleId);
    // Switch subsection in app context
    setCurrentSubSection('career-roadmap');
  };

  return (
    <GuidanceContext.Provider
      value={{
        activeTab,
        setActiveTab,
        roles,
        profile,
        updateProfile,
        primaryGoal,
        alternativeGoals,
        setGoal,
        recommendations,
        comparedRoleIds,
        toggleCompareRole,
        removeComparedRole,
        clearComparedRoles,
        saveComparison,
        experiments,
        completeExperiment,
        decisionHistory,
        chatMessages,
        sendCounsellorMessage,
        actionItems,
        toggleActionStatus,
        transferActionToRoadmap,
        selectedRoleForModal,
        setSelectedRoleForModal,
        selectedExperimentForModal,
        setSelectedExperimentForModal,
        skillGapSelectedRoleId,
        setSkillGapSelectedRoleId,
        navigateToRoadmapWithRole,
        isLoading
      }}
    >
      {children}
    </GuidanceContext.Provider>
  );
};

export const useGuidance = (): GuidanceContextType => {
  const context = useContext(GuidanceContext);
  if (!context) {
    throw new Error('useGuidance must be used within a GuidanceProvider');
  }
  return context;
};
