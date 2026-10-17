import React, { useState, useMemo } from 'react';
import { useRoadmap } from '../../context/RoadmapContext';
import { LearningResource, ResourceType, DifficultyLevel, PriceStatus } from '../../types/roadmap';
import {
  BookOpen,
  Search,
  Filter,
  Bookmark,
  BookmarkCheck,
  ExternalLink,
  Plus,
  ShieldCheck,
  Clock,
  Tag,
  CheckCircle2,
  Edit2,
  Save,
  Globe
} from 'lucide-react';

export const ResourceLibraryTab: React.FC = () => {
  const {
    resources,
    toggleSaveResource,
    updateResourceNotes,
    addCustomResource,
    careerTracks,
    roadmap
  } = useRoadmap();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTrackFilter, setSelectedTrackFilter] = useState<string>('All');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('All');
  const [selectedDifficultyFilter, setSelectedDifficultyFilter] = useState<string>('All');
  const [selectedPriceFilter, setSelectedPriceFilter] = useState<string>('All');
  const [showSavedOnly, setShowSavedOnly] = useState<boolean>(false);

  // Add Resource Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newDesc, setNewDesc] = useState<string>('');
  const [newType, setNewType] = useState<ResourceType>('Documentation');
  const [newProvider, setNewProvider] = useState<string>('');
  const [newUrl, setNewUrl] = useState<string>('');
  const [newSkills, setNewSkills] = useState<string>('');
  const [newDifficulty, setNewDifficulty] = useState<DifficultyLevel>('Beginner');
  const [newPrice, setNewPrice] = useState<PriceStatus>('Free');

  // Editing notes state
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [notesInput, setNotesInput] = useState<string>('');

  const resourceTypes: (ResourceType | 'All')[] = [
    'All',
    'Documentation',
    'Tutorial',
    'Course',
    'Article',
    'Practice Platform',
    'Repository',
    'Video'
  ];

  const filteredResources = useMemo(() => {
    return resources.filter(res => {
      const matchesSearch =
        searchQuery === '' ||
        res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        res.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        res.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
        res.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesTrack =
        selectedTrackFilter === 'All' ||
        res.career_tracks.includes(selectedTrackFilter);

      const matchesType =
        selectedTypeFilter === 'All' ||
        res.resource_type.toLowerCase() === selectedTypeFilter.toLowerCase();

      const matchesDifficulty =
        selectedDifficultyFilter === 'All' ||
        res.difficulty.toLowerCase() === selectedDifficultyFilter.toLowerCase();

      const matchesPrice =
        selectedPriceFilter === 'All' ||
        res.price_status.toLowerCase() === selectedPriceFilter.toLowerCase();

      const matchesSaved = !showSavedOnly || Boolean(res.saved_for_later);

      return matchesSearch && matchesTrack && matchesType && matchesDifficulty && matchesPrice && matchesSaved;
    });
  }, [
    resources,
    searchQuery,
    selectedTrackFilter,
    selectedTypeFilter,
    selectedDifficultyFilter,
    selectedPriceFilter,
    showSavedOnly
  ]);

  const handleSaveNotes = (id: string) => {
    updateResourceNotes(id, notesInput);
    setEditingNotesId(null);
  };

  const handleCreateResource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newUrl.trim()) return;

    const newRes: LearningResource = {
      id: `res_usr_${Date.now()}`,
      title: newTitle.trim(),
      description: newDesc.trim() || 'Curated learning material for technical preparation.',
      resource_type: newType,
      provider: newProvider.trim() || 'Industry Standard',
      url: newUrl.trim().startsWith('http') ? newUrl.trim() : `https://${newUrl.trim()}`,
      career_tracks: roadmap?.career_track_id ? [roadmap.career_track_id] : ['track_fullstack'],
      skills: newSkills.split(',').map(s => s.trim()).filter(Boolean),
      difficulty: newDifficulty,
      language: 'English',
      price_status: newPrice,
      estimated_duration: 'Self-paced',
      tags: ['Verified', 'Student Added'],
      verification_status: 'Community Submitted',
      last_reviewed: new Date().toISOString()
    };

    addCustomResource(newRes);
    setIsAddModalOpen(false);
    setNewTitle('');
    setNewDesc('');
    setNewUrl('');
    setNewProvider('');
    setNewSkills('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300">
              Verified Educational Knowledge Base
            </span>
            <span className="text-xs text-slate-400">• Extensible Model</span>
          </div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white">
            Curated Resource Library
          </h2>
          <p className="text-xs text-slate-500 max-w-xl leading-relaxed">
            Linked directly to tasks and career paths. Save materials for later review and maintain personal technical notes.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-md shadow-brand-600/20 transition-all flex items-center space-x-2 self-start md:self-center"
        >
          <Plus className="w-4 h-4" />
          <span>Add Resource</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search guides by title, skill, or topic (e.g. React, SQL, PyTorch)..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 text-slate-900 dark:text-white"
            />
          </div>

          <button
            type="button"
            onClick={() => setShowSavedOnly(prev => !prev)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors flex items-center space-x-1.5 ${
              showSavedOnly
                ? 'bg-brand-600 text-white'
                : 'bg-slate-100 dark:bg-slate-850 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <BookmarkCheck className="w-3.5 h-3.5" />
            <span>Saved for Later ({resources.filter(r => r.saved_for_later).length})</span>
          </button>
        </div>

        {/* Filter Badges Strip */}
        <div className="flex items-center space-x-2 overflow-x-auto scrollbar-none text-xs pt-1">
          <span className="text-slate-400 text-[11px] font-semibold shrink-0">Type:</span>
          {resourceTypes.map(t => (
            <button
              type="button"
              key={t}
              onClick={() => setSelectedTypeFilter(t)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium shrink-0 transition-colors ${
                selectedTypeFilter === t
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                  : 'bg-slate-50 dark:bg-slate-850 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Resource Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredResources.map(res => {
          const isEditingThis = editingNotesId === res.id;

          return (
            <div
              key={res.id}
              className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-brand-300 dark:hover:border-brand-700 shadow-xs flex flex-col justify-between space-y-4 transition-all"
            >
              <div className="space-y-3">
                {/* Meta Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                      {res.resource_type}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-400">
                      {res.difficulty}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleSaveResource(res.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-brand-600 transition-colors"
                    title={res.saved_for_later ? 'Bookmarked' : 'Save for later'}
                  >
                    {res.saved_for_later ? (
                      <BookmarkCheck className="w-4 h-4 text-brand-600" />
                    ) : (
                      <Bookmark className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Title and Provider */}
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-2">
                    {res.title}
                  </h4>
                  <span className="text-[11px] text-slate-400 font-medium">
                    By {res.provider} • {res.price_status}
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
                  {res.description}
                </p>

                {/* Skills tags */}
                <div className="flex flex-wrap gap-1">
                  {res.skills.map((s, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                    >
                      {s}
                    </span>
                  ))}
                </div>

                {/* Personal Notes Display */}
                {res.personal_notes && !isEditingThis && (
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-850/60 border border-slate-200/60 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
                    <span className="text-[10px] font-bold text-slate-400 block mb-0.5">My Note:</span>
                    <p className="italic text-[11px]">{res.personal_notes}</p>
                  </div>
                )}

                {/* Personal Notes Edit Box */}
                {isEditingThis && (
                  <div className="space-y-1.5 pt-1">
                    <textarea
                      rows={2}
                      value={notesInput}
                      onChange={e => setNotesInput(e.target.value)}
                      placeholder="Add personal study notes for this resource..."
                      className="w-full p-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-850"
                    />
                    <div className="flex justify-end space-x-1.5">
                      <button
                        type="button"
                        onClick={() => setEditingNotesId(null)}
                        className="px-2 py-1 text-[11px] text-slate-400"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSaveNotes(res.id)}
                        className="px-2.5 py-1 text-[11px] font-bold bg-brand-600 text-white rounded-lg"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                {!isEditingThis && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingNotesId(res.id);
                      setNotesInput(res.personal_notes || '');
                    }}
                    className="text-xs text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 flex items-center gap-1"
                  >
                    <Edit2 className="w-3 h-3" />
                    <span>{res.personal_notes ? 'Edit Note' : 'Add Note'}</span>
                  </button>
                )}

                <a
                  href={res.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-brand-50 hover:bg-brand-100 dark:bg-brand-950 dark:hover:bg-brand-900 text-brand-700 dark:text-brand-300 transition-colors flex items-center space-x-1 ml-auto"
                >
                  <span>Open Resource</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {filteredResources.length === 0 && (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
          <BookOpen className="w-8 h-8 text-slate-400 mx-auto" />
          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">No Matching Resources Found</h4>
          <p className="text-xs text-slate-500">
            Try adjusting your search query or clear active filters to discover learning materials.
          </p>
        </div>
      )}

      {/* Add Resource Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-lg my-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-5">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700"
            >
              ×
            </button>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                Resource Expansion
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Add Curated Learning Resource
              </h3>
              <p className="text-xs text-slate-500">
                Register verified documentation, tutorials, or open courses into the shared library.
              </p>
            </div>

            <form onSubmit={handleCreateResource} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="e.g. Full-Stack Open 2026, FastAPI Tutorial"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-850"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">URL *</label>
                <input
                  type="url"
                  required
                  value={newUrl}
                  onChange={e => setNewUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-850"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Type</label>
                  <select
                    value={newType}
                    onChange={e => setNewType(e.target.value as ResourceType)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-850"
                  >
                    {resourceTypes.filter(t => t !== 'All').map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Provider</label>
                  <input
                    type="text"
                    value={newProvider}
                    onChange={e => setNewProvider(e.target.value)}
                    placeholder="e.g. Mozilla, Harvard, FreeCodeCamp"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-850"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Relevant Skills (comma separated)</label>
                <input
                  type="text"
                  value={newSkills}
                  onChange={e => setNewSkills(e.target.value)}
                  placeholder="e.g. React, TypeScript, SQL"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-850"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl font-bold text-slate-500 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl font-bold bg-brand-600 hover:bg-brand-700 text-white"
                >
                  Save Resource
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
