export type TaskStatus = 'Not Started' | 'In Progress' | 'Completed' | 'Blocked';
export type TaskPriority = 'High' | 'Medium' | 'Low';
export type PhaseStatus = 'Upcoming' | 'In Progress' | 'Completed' | 'Blocked';
export type MilestoneStatus = 'Upcoming' | 'In Progress' | 'Completed' | 'Overdue';
export type ProjectStatus = 'Not Started' | 'In Progress' | 'Completed';
export type ResourceType = 'Video' | 'Article' | 'Documentation' | 'Course' | 'Tutorial' | 'Practice Platform' | 'Repository' | 'Other';
export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced';
export type PriceStatus = 'Free' | 'Freemium' | 'Paid';
export type LearningStyle = 'Reading' | 'Videos' | 'Guided Practice' | 'Project-First';
export type StartingProficiency = 'Beginner' | 'Intermediate' | 'Advanced';

export interface LearningResource {
  id: string;
  title: string;
  description: string;
  resource_type: ResourceType;
  provider: string;
  url: string;
  career_tracks: string[];
  skills: string[];
  difficulty: DifficultyLevel;
  language: string;
  price_status: PriceStatus;
  estimated_duration?: string;
  tags: string[];
  verification_status: 'Verified Official' | 'Verified Platform' | 'Community Submitted';
  saved_for_later?: boolean;
  is_reviewed?: boolean;
  personal_notes?: string;
  last_reviewed?: string;
}

export interface RoadmapTask {
  id: string;
  phase_id: string;
  roadmap_id: string;
  task_number: number;
  week_number: number;
  title: string;
  description: string;
  associated_skill: string;
  learning_objective: string;
  why_it_matters: string;
  estimated_hours: number;
  priority: TaskPriority;
  prerequisites: string[];
  resource_ids: string[];
  practical_exercise?: string;
  completion_criteria: string;
  status: TaskStatus;
  due_date?: string;
  completed_at?: string;
  notes?: string;
}

export interface RoadmapPhase {
  id: string;
  roadmap_id: string;
  phase_number: number;
  title: string;
  description: string;
  why_it_matters: string;
  learning_objectives: string[];
  skills_covered: string[];
  prerequisites: string[];
  estimated_duration_weeks: number;
  practical_milestone: string;
  completion_criteria: string[];
  status: PhaseStatus;
  tasks: RoadmapTask[];
}

export interface ProjectChecklistItem {
  label: string;
  done: boolean;
}

export interface RoadmapProject {
  id: string;
  roadmap_id: string;
  title: string;
  problem_statement: string;
  expected_outcome: string;
  skills_practiced: string[];
  prerequisite_tasks: string[];
  suggested_tech: string[];
  feature_checklist: ProjectChecklistItem[];
  definition_of_done: string;
  expected_hours: number;
  portfolio_relevance: string;
  github_url?: string;
  demo_url?: string;
  status: ProjectStatus;
  completed_at?: string;
}

export interface RoadmapMilestone {
  id: string;
  roadmap_id: string;
  title: string;
  target_date: string;
  status: MilestoneStatus;
  associated_phase_or_project?: string;
  completed_at?: string;
}

export interface ProgressSnapshot {
  timestamp: string;
  completed_task_count: number;
  total_task_count: number;
  completion_percentage: number;
  completed_hours: number;
  planned_hours: number;
}

export interface CareerTrack {
  id: string;
  title: string;
  description: string;
  category: 'Engineering' | 'Design' | 'Data & AI' | 'Cloud & Security' | 'Quality';
  level: 'Beginner-friendly' | 'Intermediate' | 'Advanced';
  estimated_duration_range: string;
  core_skills: string[];
  prerequisites: string[];
  typical_project_outcomes: string[];
  template_phases: {
    phase_number: number;
    title: string;
    description: string;
    why_it_matters: string;
    estimated_duration_weeks: number;
    skills_covered: string[];
    practical_milestone: string;
    completion_criteria: string[];
    prerequisites?: string[];
  }[];
}

export interface StudentRoadmap {
  id: string;
  student_id: string;
  career_track_id?: string;
  career_title: string;
  custom_goal?: string;
  specialization?: string;
  starting_proficiency: StartingProficiency;
  target_timeline_months: number;
  weekly_hours_available: number;
  learning_style: LearningStyle;
  priority_focus: string;
  target_companies: string[];
  status: 'Active' | 'Paused' | 'Completed';
  current_phase_index: number;
  created_at: string;
  updated_at: string;
  metrics: {
    total_tasks: number;
    completed_tasks: number;
    completion_percentage: number;
    completed_hours: number;
    planned_hours: number;
    remaining_hours: number;
  };
  phases: RoadmapPhase[];
  projects: RoadmapProject[];
  milestones: RoadmapMilestone[];
  snapshots: ProgressSnapshot[];
}

export interface RoadmapSetupPreferences {
  career_track_id?: string;
  career_title: string;
  custom_goal?: string;
  specialization?: string;
  starting_proficiency: StartingProficiency;
  target_timeline_months: number;
  weekly_hours_available: number;
  learning_style: LearningStyle;
  priority_focus: string;
  target_companies: string[];
  already_known_skills: string[];
}

export interface RoadmapAdaptationProposal {
  proposal_id: string;
  title: string;
  reason: string;
  changes: {
    type: string;
    description: string;
  }[];
  affected_tasks_count: number;
  affected_timeline_months?: number;
  new_weekly_hours?: number;
}

export interface RoadmapAssistantMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
  proposal?: RoadmapAdaptationProposal | null;
  diagnosticSkill?: string | null;
}

export interface SkillComparisonItem {
  skill: string;
  required_level: number; // 0 - 100
  demonstrated_level: number; // 0 - 100 based on verified skills/evidence, or 0 if unverified
  self_reported_level: number; // 0 - 100 based on student claim
  is_verified: boolean;
  verification_source?: string;
  status: 'Demonstrated' | 'Self-Reported' | 'Not Assessed';
}
