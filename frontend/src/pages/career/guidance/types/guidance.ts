export type GuidanceTab =
  | 'home'
  | 'profile'
  | 'discovery'
  | 'recommendations'
  | 'compare'
  | 'skill-gaps'
  | 'experiments'
  | 'decisions'
  | 'counsellor'
  | 'action-plan';

export interface CareerRole {
  id: string;
  title: string;
  category: 'Software Engineering' | 'AI & Data Science' | 'Design & Product' | 'Business & Strategy' | 'Cloud & Infrastructure' | 'Quality & Testing' | 'Hardware & Systems';
  description: string;
  day_to_day: string;
  core_responsibilities: string[];
  essential_skills: string[];
  useful_skills: string[];
  academic_foundations: string[];
  tools_technologies: string[];
  example_projects: string[];
  entry_job_titles: string[];
  interview_focus: string[];
  portfolio_expectations: string;
  prerequisites: string[];
  experiment_id?: string;
}

export interface StudentCareerProfile {
  id: string;
  student_id: string;
  degree?: string;
  department?: string;
  batch?: string;
  graduation_year?: number;
  cgpa?: number;
  interests: string[];
  preferred_activities: string[];
  disliked_activities: string[];
  technical_skills: string[];
  verified_skills?: string[];
  soft_skills: string[];
  academic_focus: string[];
  practical_experiences: string[];
  weekly_hours_available: number;
  preparation_timeline: '3 Months' | '6 Months' | '1 Year' | 'Custom';
  preferred_learning_format: 'Project-first' | 'Guided Videos' | 'Reading & Docs' | 'Interactive Labs';
  preparation_challenges: string[];
  immediate_priority: 'Exploration' | 'Internship' | 'Placement' | 'Skill Development';
  target_companies: string[];
  updated_at?: string;
}

export interface CareerRecommendationItem {
  career_id: string;
  career_title: string;
  category: string;
  description: string;
  alignment_tier: 'Strong alignment with stated interests' | 'Promising career direction' | 'Worth exploring for versatility';
  badge_tag: 'Top Match' | 'Promising' | 'Exploratory';
  why_worth_exploring: string;
  matched_interests: string[];
  existing_skills_matched: string[];
  important_skill_gaps: string[];
  uncertainties_to_investigate: string[];
  suggested_experiment_id: string;
  recommended_next_action: string;
}

export interface CareerGoalRecord {
  id: string;
  student_id: string;
  career_id: string;
  career_title: string;
  is_primary: boolean;
  selection_reasons: string[];
  uncertainties: string[];
  status: 'Active' | 'Exploring' | 'Archived';
  created_at: string;
  updated_at: string;
}

export interface CareerComparisonData {
  id: string;
  student_id: string;
  career_ids: string[];
  notes?: string;
  attraction_points: Record<string, string>;
  concern_points: Record<string, string>;
  unanswered_questions: string[];
  selected_primary_id?: string;
  selected_alternate_id?: string;
  created_at: string;
  updated_at?: string;
}

export interface CareerExperimentItem {
  id: string;
  career_category: string;
  title: string;
  difficulty: 'Beginner' | 'Intermediate';
  expected_duration: string;
  learning_objective: string;
  prerequisites: string[];
  instructions: string[];
  required_tools: string[];
  expected_deliverable: string;
  completion_criteria: string[];
  resources: string[];
  student_progress?: {
    status: 'Not Started' | 'In Progress' | 'Completed';
    reflection_enjoyed?: string;
    reflection_difficult?: string;
    reflection_matched_expectations?: string;
    completed_at?: string;
  };
}

export interface CareerDecisionHistoryItem {
  id: string;
  decision_type: 'Goal Selected' | 'Goal Updated' | 'Alternate Goal Added' | 'Comparison Saved' | 'Experiment Completed' | 'Action Plan Created';
  previous_goal?: string;
  new_goal?: string;
  explanation: string;
  associated_role_id?: string;
  timestamp: string;
}

export interface CounsellorChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  structured_sections?: {
    headline?: string;
    understanding?: string;
    options?: { title: string; fit: string; trade_off: string }[];
    recommended_next_steps?: string[];
  };
  contextual_actions?: {
    label: string;
    action: 'open_comparison' | 'open_experiment' | 'open_discovery' | 'open_experiments_list' | 'open_skill_gaps' | 'open_roadmap_planner' | 'open_recommendations';
    payload?: any;
  }[];
}

export interface CareerActionItem {
  id: string;
  title: string;
  explanation: string;
  why_it_matters: string;
  estimated_effort: string;
  suggested_deadline?: string;
  related_career: string;
  related_skill: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  transferred_to_roadmap: boolean;
}

export interface DiscoveryQuestionAnswer {
  questionId: number;
  question: string;
  selectedOptions: string[];
  customNote?: string;
}
