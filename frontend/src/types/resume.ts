/**
 * Type definitions for AI Resume Studio
 */

export interface ContactInfo {
  full_name: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  portfolio?: string;
}

export interface EducationItem {
  institution: string;
  degree: string;
  field?: string;
  start_year: string;
  end_year: string;
  score_or_cgpa?: string;
  coursework?: string[];
}

export interface SkillCategory {
  category: string;
  items: string[];
}

export interface ProjectItem {
  title: string;
  description?: string;
  tech_stack: string[];
  bullets: string[];
  github_url?: string;
  live_url?: string;
}

export interface ExperienceItem {
  role: string;
  company: string;
  location?: string;
  start_date: string;
  end_date?: string;
  current?: boolean;
  bullets: string[];
}

export interface CertificationItem {
  name: string;
  issuer?: string;
  issue_date?: string;
  credential_url?: string;
}

export interface ResumeContent {
  contact: ContactInfo;
  summary: string;
  education: EducationItem[];
  skills: SkillCategory[];
  experience: ExperienceItem[];
  projects: ProjectItem[];
  certifications?: CertificationItem[];
  achievements?: string[];
  publications?: string[];
}

export interface StylingConfig {
  font_family: 'inter' | 'serif' | 'mono' | 'garamond';
  font_size: '9pt' | '10pt' | '11pt';
  line_height: '1.3' | '1.4' | '1.5';
  margins: 'compact' | 'standard' | 'spacious';
  accent_color: string;
}

export interface ResumeVersionSummary {
  id: string;
  title: string;
  target_role: string;
  target_company?: string;
  template_id: string;
  is_master: boolean;
  is_archived: boolean;
  last_updated: string;
  ats_score: number;
  ats_breakdown?: Record<string, any>;
  evidence_backed_claims: number;
  summary?: string;
}

export interface FullResumeDocument extends ResumeVersionSummary {
  student_id: string;
  styling_config: StylingConfig;
  sections_order: string[];
  content: ResumeContent;
  evidence_links: ClaimVerification[];
  scoring_report: ScoreReport;
  tailoring_history: TailoringProposal[];
}

export type ClaimStatus =
  | 'Supported by linked evidence'
  | 'Partially supported'
  | 'Student-confirmed'
  | 'Unverified'
  | 'Conflicting evidence';

export interface ClaimVerification {
  claim_id: string;
  section: string;
  statement: string;
  status: ClaimStatus;
  evidence_source: string;
  evidence_url?: string | null;
  evidence_strength: 'High' | 'Moderate' | 'Limited' | 'None';
  limitations: string;
  recommended_correction?: string | null;
}

export interface TailoringProposal {
  id: string;
  section: string;
  target_item_title?: string | null;
  proposal_type: 'bullet_improvement' | 'summary_polish' | 'keyword_integration' | 'section_reordering';
  original_text: string;
  suggested_text: string;
  reasoning: string;
  status: 'pending' | 'accepted' | 'rejected';
}

export interface TailoringReport {
  job_analysis: {
    target_role: string;
    target_company: string;
    key_requirements: string[];
    preferred_qualifications: string[];
    priority_technologies: string[];
  };
  qualification_match: {
    matched_skills: string[];
    missing_skills: string[];
    match_percentage: number;
  };
  tailoring_proposals: TailoringProposal[];
  recommended_sections_order?: string[];
  overall_recommendation: string;
}

export interface ScoreCategory {
  score: number;
  max: number;
  label: string;
  description: string;
}

export interface ScoreReport {
  overall_score: number;
  breakdown: Record<string, ScoreCategory>;
  matched_requirements: string[];
  missing_requirements: string[];
  unsupported_claims_count: number;
  improvement_actions: string[];
  disclaimer: string;
}

export interface AlumniExample {
  id: string;
  alumni_name: string;
  graduation_year: number;
  role: string;
  industry: string;
  template_id: string;
  placement_outcome?: string;
  is_anonymized: boolean;
  skills: string[];
  projects_summary: string[];
  resume_content: ResumeContent;
}

export interface BestRecommendation {
  recommended_version: {
    id: string;
    title: string;
    target_role: string;
    target_company?: string;
    overall_score: number;
    composite_score: number;
    evidence_backed_claims: number;
  } | null;
  target_role: string;
  reasons: string[];
  all_comparisons: any[];
  disclaimer: string;
}
