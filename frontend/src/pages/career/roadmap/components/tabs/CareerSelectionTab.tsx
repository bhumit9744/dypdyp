import React, { useState, useMemo } from 'react';
import { useRoadmap } from '../../context/RoadmapContext';
import { CareerTrack } from '../../types/roadmap';
import {
  Compass,
  Search,
  Filter,
  Clock,
  ShieldCheck,
  Target,
  ArrowRight,
  Eye,
  PlusCircle,
  Sparkles,
  Check
} from 'lucide-react';

interface CareerSelectionTabProps {
  onOpenTrackDetail: (track: CareerTrack) => void;
  onSelectTrackForSetup: (track: CareerTrack | null) => void;
}

export const CareerSelectionTab: React.FC<CareerSelectionTabProps> = ({
  onOpenTrackDetail,
  onSelectTrackForSetup
}) => {
  const { careerTracks, roadmap } = useRoadmap();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedLevel, setSelectedLevel] = useState<string>('All');
  const [customGoalInput, setCustomGoalInput] = useState<string>('');

  const categories = ['All', 'Engineering', 'Design', 'Data & AI', 'Cloud & Security', 'Quality'];
  const levels = ['All', 'Beginner-friendly', 'Intermediate'];

  // Filtered tracks
  const filteredTracks = useMemo(() => {
    return careerTracks.filter(track => {
      const matchesSearch =
        searchQuery === '' ||
        track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        track.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        track.core_skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory =
        selectedCategory === 'All' || track.category.toLowerCase() === selectedCategory.toLowerCase();

      const matchesLevel =
        selectedLevel === 'All' || track.level.toLowerCase().includes(selectedLevel.toLowerCase());

      return matchesSearch && matchesCategory && matchesLevel;
    });
  }, [careerTracks, searchQuery, selectedCategory, selectedLevel]);

  const handleStartCustomGoal = () => {
    if (customGoalInput.trim()) {
      onSelectTrackForSetup(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300">
              Structured University Tracks
            </span>
            <span className="text-xs text-slate-400">10 Comprehensive Curricula</span>
          </div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white">
            Choose Your Target Career Path
          </h2>
          <p className="text-xs text-slate-500 max-w-xl leading-relaxed">
            Every track is decomposed into 4-6 phased milestones with hands-on projects, verified resources, and campus interview criteria.
          </p>
        </div>

        {roadmap && (
          <div className="p-3.5 rounded-2xl bg-brand-50/70 dark:bg-brand-950/40 border border-brand-200/60 dark:border-brand-800/40 text-xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Active Selected Track</span>
            <span className="font-extrabold text-brand-700 dark:text-brand-300">
              {roadmap.career_title}
            </span>
          </div>
        )}
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by career title, skill (e.g. React, SQL, PyTorch), or keyword..."
            className="w-full pl-10 pr-4 py-2.5 text-xs rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center overflow-x-auto space-x-1.5 scrollbar-none pb-1 md:pb-0">
          {categories.map(cat => (
            <button
              type="button"
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all ${
                selectedCategory === cat
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-slate-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Career Tracks Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTracks.map(track => {
          const isCurrentActive = roadmap?.career_track_id === track.id || roadmap?.career_title === track.title;

          return (
            <div
              key={track.id}
              className={`rounded-3xl border transition-all duration-300 flex flex-col justify-between overflow-hidden group ${
                isCurrentActive
                  ? 'bg-white dark:bg-slate-900 border-brand-500 ring-2 ring-brand-500/20 shadow-md'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-brand-300 dark:hover:border-brand-700 hover:shadow-lg hover:-translate-y-0.5'
              }`}
            >
              <div className="p-6 space-y-4">
                {/* Header Badge */}
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {track.category}
                  </span>

                  <div className="flex items-center space-x-2 text-[11px] text-slate-400 font-medium">
                    <span>{track.level}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {track.estimated_duration_range}*
                    </span>
                  </div>
                </div>

                {/* Title & Description */}
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white group-hover:text-brand-600 transition-colors">
                    {track.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-3 leading-relaxed">
                    {track.description}
                  </p>
                </div>

                {/* Core Skills Chips */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Core Skills
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {track.core_skills.slice(0, 5).map((sk, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-lg text-[11px] font-medium bg-slate-50 dark:bg-slate-850 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-800"
                      >
                        {sk}
                      </span>
                    ))}
                    {track.core_skills.length > 5 && (
                      <span className="px-2 py-0.5 rounded-lg text-[10px] font-medium text-slate-400 bg-slate-100 dark:bg-slate-800">
                        +{track.core_skills.length - 5} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Practical Outcomes Callout */}
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-850/60 border border-slate-200/60 dark:border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 flex items-center gap-1">
                    <Target className="w-3 h-3" />
                    Practical Milestone Project
                  </span>
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 line-clamp-1">
                    {track.typical_project_outcomes[0]}
                  </p>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-4 sm:p-5 bg-slate-50/70 dark:bg-slate-850/50 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => onOpenTrackDetail(track)}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center space-x-1.5"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Syllabus</span>
                </button>

                <button
                  type="button"
                  onClick={() => onSelectTrackForSetup(track)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                    isCurrentActive
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-brand-600 hover:bg-brand-700 text-white shadow-md shadow-brand-600/20'
                  }`}
                >
                  {isCurrentActive ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Active Track</span>
                    </>
                  ) : (
                    <>
                      <span>Select Track</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Custom Goal Banner (If student has a specialized goal) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 text-white border border-slate-800 space-y-4">
        <div className="flex items-center space-x-2 text-xs font-bold text-brand-400">
          <Sparkles className="w-4 h-4" />
          <span>Have a Special Career Ambition?</span>
        </div>

        <div className="space-y-1">
          <h3 className="text-lg font-bold text-white">
            Custom Career Goal & AI Prototyper
          </h3>
          <p className="text-xs text-slate-400 max-w-xl">
            If your target role is not listed above (e.g. Embedded Robotics, Quant Researcher, or Smart Contract Developer), specify your goal to generate a customizable plan.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 max-w-xl pt-2">
          <input
            type="text"
            value={customGoalInput}
            onChange={e => setCustomGoalInput(e.target.value)}
            placeholder="e.g. Embedded IoT Engineer, NLP Researcher, Game Developer"
            className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-700 bg-slate-800 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />

          <button
            type="button"
            onClick={handleStartCustomGoal}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-500 text-white whitespace-nowrap transition-colors flex items-center justify-center space-x-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Generate Plan</span>
          </button>
        </div>

        <p className="text-[10px] text-slate-500">
          *Note: Timeline ranges are planning estimates for academic workload calculation, not a guarantee of hiring or placement.
        </p>
      </div>
    </div>
  );
};
