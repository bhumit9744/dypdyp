import React, { useState } from 'react';
import { useRoadmap } from '../../context/RoadmapContext';
import { RoadmapProject, ProjectStatus } from '../../types/roadmap';
import {
  Target,
  CheckCircle2,
  Clock,
  Globe,
  ExternalLink,
  ShieldCheck,
  Code2,
  Layers,
  Sparkles,
  Save,
  CheckSquare,
  Square
} from 'lucide-react';
import { GithubIcon } from '../../../../../components/common/Icons';

export const ProjectMilestonesTab: React.FC = () => {
  const { roadmap, updateProject, setActiveTab } = useRoadmap();

  if (!roadmap) {
    return (
      <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
        <Target className="w-10 h-10 text-slate-400 mx-auto" />
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          No Milestone Projects Scheduled
        </h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Configure a career roadmap to initialize practical portfolio deliverables with checklists and demo verifications.
        </p>
        <button
          type="button"
          onClick={() => setActiveTab('explore-careers')}
          className="px-5 py-2.5 rounded-xl text-xs font-bold bg-brand-600 text-white"
        >
          Choose Career Track
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300">
              Practical Portfolio Evidence
            </span>
            <span className="text-xs text-slate-400">• Evaluated Deliverables</span>
          </div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white">
            Practical Project Milestones ({roadmap.projects.length})
          </h2>
          <p className="text-xs text-slate-500 max-w-xl leading-relaxed">
            Real portfolio projects that substantiate your technical capability during campus recruitment technical rounds.
          </p>
        </div>

        <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200/60 self-start md:self-auto">
          {roadmap.projects.filter(p => p.status === 'Completed').length} of {roadmap.projects.length} Completed
        </span>
      </div>

      {/* Projects List */}
      <div className="space-y-6">
        {roadmap.projects.map((project, idx) => {
          return (
            <ProjectCard
              key={project.id}
              project={project}
              index={idx + 1}
              onUpdate={updates => updateProject(project.id, updates)}
            />
          );
        })}
      </div>
    </div>
  );
};

interface ProjectCardProps {
  project: RoadmapProject;
  index: number;
  onUpdate: (updates: Partial<RoadmapProject>) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, index, onUpdate }) => {
  const [githubUrlInput, setGithubUrlInput] = useState<string>(project.github_url || '');
  const [demoUrlInput, setDemoUrlInput] = useState<string>(project.demo_url || '');
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSaveUrls = () => {
    onUpdate({
      github_url: githubUrlInput.trim() || undefined,
      demo_url: demoUrlInput.trim() || undefined
    });
    setFeedback('Links updated!');
    setTimeout(() => setFeedback(null), 2000);
  };

  const handleToggleChecklist = (itemIndex: number) => {
    const updated = project.feature_checklist.map((item, i) =>
      i === itemIndex ? { ...item, done: !item.done } : item
    );
    onUpdate({ feature_checklist: updated });
  };

  const completedChecks = project.feature_checklist.filter(c => c.done).length;
  const totalChecks = project.feature_checklist.length;

  return (
    <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300">
              Project #{index}
            </span>
            <span className="text-[11px] text-slate-400 font-semibold">
              ~{project.expected_hours} Hours Target
            </span>
          </div>

          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            {project.title}
          </h3>

          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {project.problem_statement}
          </p>
        </div>

        {/* Status Dropdown */}
        <div className="shrink-0">
          <select
            value={project.status}
            onChange={e => onUpdate({ status: e.target.value as ProjectStatus })}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
              project.status === 'Completed'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300'
                : project.status === 'In Progress'
                ? 'bg-brand-50 text-brand-800 border-brand-300 dark:bg-brand-950 dark:text-brand-300'
                : 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-850 dark:text-slate-300'
            }`}
          >
            <option value="Not Started">Not Started</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Skills & Suggested Tech */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-850/60 border border-slate-200/80 dark:border-slate-800 text-xs">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Skills Practiced
          </span>
          <div className="flex flex-wrap gap-1">
            {project.skills_practiced.map((sk, sIdx) => (
              <span
                key={sIdx}
                className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium"
              >
                {sk}
              </span>
            ))}
          </div>
        </div>

        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Suggested Technology Stack
          </span>
          <div className="flex flex-wrap gap-1">
            {project.suggested_tech.map((tech, tIdx) => (
              <span
                key={tIdx}
                className="px-2 py-0.5 rounded-md bg-brand-50 dark:bg-brand-950 border border-brand-200/50 dark:border-brand-800/40 text-brand-700 dark:text-brand-300 font-medium"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Feature Checklist */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-800 dark:text-slate-200">
            Feature Checklist & Acceptance Criteria ({completedChecks}/{totalChecks})
          </span>
          <span className="text-[11px] text-slate-400">
            Check off features as you build
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {project.feature_checklist.map((item, cIdx) => (
            <button
              type="button"
              key={cIdx}
              onClick={() => handleToggleChecklist(cIdx)}
              className={`p-3 rounded-xl border text-xs text-left transition-all flex items-start space-x-2.5 ${
                item.done
                  ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 font-semibold'
                  : 'bg-white dark:bg-slate-850 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
              }`}
            >
              {item.done ? (
                <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <Square className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              )}
              <span className={item.done ? 'line-through opacity-80' : ''}>
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Definition of Done & Portfolio Relevance */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850/50 border border-slate-200/60 dark:border-slate-800 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block">
            Definition of Done
          </span>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            {project.definition_of_done}
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850/50 border border-slate-200/60 dark:border-slate-800 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 block">
            Portfolio & Recruiter Relevance
          </span>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            {project.portfolio_relevance}
          </p>
        </div>
      </div>

      {/* Verification Links (GitHub & Live Demo) */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850/80 border border-slate-200 dark:border-slate-800 space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
          <span>Project Deliverable Proof Links (Optional for Verification)</span>
          {feedback && <span className="text-emerald-600 font-bold">{feedback}</span>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="relative">
            <GithubIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="url"
              placeholder="https://github.com/username/repo"
              value={githubUrlInput}
              onChange={e => setGithubUrlInput(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs"
            />
          </div>

          <div className="relative">
            <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="url"
              placeholder="https://my-app.vercel.app (Live Demo)"
              value={demoUrlInput}
              onChange={e => setDemoUrlInput(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center space-x-2 text-xs">
            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1 font-semibold"
              >
                <GithubIcon className="w-3.5 h-3.5" />
                <span>Open Repo</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
            {project.demo_url && (
              <a
                href={project.demo_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 font-semibold ml-2"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Open Live Demo</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>

          <button
            type="button"
            onClick={handleSaveUrls}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white flex items-center space-x-1.5 transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Links</span>
          </button>
        </div>
      </div>
    </div>
  );
};
