import React, { useState } from 'react';
import {
  Users,
  Search,
  Plus,
  ArrowRight,
  Pin,
  CheckCircle2,
  Code2,
  Layers,
  BrainCircuit,
  Building2,
  Briefcase,
  Sparkles,
  ArrowLeft,
  ShieldAlert,
  MessageSquare
} from 'lucide-react';
import { ConnectGroup, StudentConnectPost } from '../../../types';
import { ConnectFeed } from './ConnectFeed';

interface CommunitiesTabProps {
  groups: ConnectGroup[];
  posts: StudentConnectPost[];
  onToggleJoinGroup: (groupId: string) => void;
  onOpenCreateGroupModal: () => void;
  onOpenCreatePostModal: (groupId?: string) => void;
  onToggleLike: (postId: string) => void;
  onToggleSave: (postId: string) => void;
  onAddComment: (postId: string, text: string) => void;
  onAcceptAnswer?: (postId: string, commentId: string) => void;
  onOpenReportModal: (postId: string) => void;
}

export const CommunitiesTab: React.FC<CommunitiesTabProps> = ({
  groups,
  posts,
  onToggleJoinGroup,
  onOpenCreateGroupModal,
  onOpenCreatePostModal,
  onToggleLike,
  onToggleSave,
  onAddComment,
  onAcceptAnswer,
  onOpenReportModal
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeGroupId, setActiveGroupId] = useState<string | null>(null);
  const [groupFeedFilter, setGroupFeedFilter] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Communities' },
    { id: 'DSA & Coding', label: 'DSA & Coding' },
    { id: 'Web Dev', label: 'Web Dev' },
    { id: 'AI / ML', label: 'AI & ML' },
    { id: 'Company Specific', label: 'Company Specific' },
    { id: 'Career Paths', label: 'Career Paths' },
    { id: 'Aptitude', label: 'Aptitude & Core CS' }
  ];

  const filteredGroups = groups.filter((group) => {
    const matchesCat =
      selectedCategory === 'all' ||
      group.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      searchQuery.trim() === '' ||
      group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const activeGroup = groups.find((g) => g.id === activeGroupId);
  const activeGroupPosts = posts.filter((p) => p.group_id === activeGroupId);

  const getGroupIcon = (iconName: string) => {
    switch (iconName) {
      case 'Code2':
        return <Code2 className="w-5 h-5 text-white" />;
      case 'Layers':
        return <Layers className="w-5 h-5 text-white" />;
      case 'BrainCircuit':
        return <BrainCircuit className="w-5 h-5 text-white" />;
      case 'Building2':
        return <Building2 className="w-5 h-5 text-white" />;
      case 'Briefcase':
        return <Briefcase className="w-5 h-5 text-white" />;
      default:
        return <Users className="w-5 h-5 text-white" />;
    }
  };

  // If viewing a specific group's hub:
  if (activeGroup) {
    return (
      <div className="space-y-6 animate-in fade-in">
        {/* Back navigation & group hero header */}
        <div className="space-y-4">
          <button
            onClick={() => setActiveGroupId(null)}
            className="inline-flex items-center space-x-2 text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Communities</span>
          </button>

          <div
            className={`rounded-2xl bg-gradient-to-r ${activeGroup.banner_gradient} p-6 sm:p-8 text-white shadow-md relative overflow-hidden`}
          >
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center space-x-2.5">
                  <span className="px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-bold uppercase tracking-wider">
                    {activeGroup.category}
                  </span>
                  <span className="text-xs text-white/80">
                    • {activeGroup.member_count} Members • {activeGroup.active_today_count} Active Today
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                  {activeGroup.name}
                </h2>

                <p className="text-xs sm:text-sm text-white/90 leading-relaxed">
                  {activeGroup.description}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {activeGroup.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-md bg-white/15 text-[11px] font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
                <button
                  onClick={() => onToggleJoinGroup(activeGroup.id)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    activeGroup.is_joined
                      ? 'bg-white/20 hover:bg-white/30 text-white border border-white/30'
                      : 'bg-white text-slate-900 hover:bg-white/90 shadow-md'
                  }`}
                >
                  {activeGroup.is_joined ? 'Joined (Member)' : '+ Join Group'}
                </button>

                <button
                  onClick={() => onOpenCreatePostModal(activeGroup.id)}
                  className="px-4 py-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-900 text-white text-xs font-bold border border-white/20 transition-all shadow-md"
                >
                  Post in this Group
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Group Content Grid: Feed (Left 8 cols) + Announcements/Rules (Right 4 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Group Discussion & Q&A Stream ({activeGroupPosts.length})
              </h3>
            </div>

            <ConnectFeed
              posts={activeGroupPosts}
              onToggleLike={onToggleLike}
              onToggleSave={onToggleSave}
              onAddComment={onAddComment}
              onAcceptAnswer={onAcceptAnswer}
              onOpenReportModal={onOpenReportModal}
              activeFilter={groupFeedFilter}
              setActiveFilter={setGroupFeedFilter}
            />
          </div>

          <div className="lg:col-span-4 space-y-4">
            {/* Pinned Announcement */}
            {activeGroup.pinned_announcement && (
              <div className="rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/40 p-4 space-y-2">
                <div className="flex items-center space-x-1.5 text-amber-800 dark:text-amber-300 font-bold text-xs">
                  <Pin className="w-3.5 h-3.5" />
                  <span>Pinned Announcement</span>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  {activeGroup.pinned_announcement}
                </p>
              </div>
            )}

            {/* Group Rules */}
            <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 space-y-3 shadow-xs">
              <div className="flex items-center space-x-2 text-slate-900 dark:text-white font-bold text-xs">
                <ShieldAlert className="w-4 h-4 text-brand-600" />
                <span>Community Guidelines</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                {activeGroup.rules.map((rule, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <span className="font-bold text-brand-600 shrink-0">{idx + 1}.</span>
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Primary Communities Directory Grid
  return (
    <div className="space-y-6">
      {/* Top Controls: Search, Category Filters, Create Group Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search communities (e.g. DSA, TCS, Full-Stack, AI)..."
            className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <button
          onClick={onOpenCreateGroupModal}
          className="flex items-center justify-center space-x-1.5 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-xs shadow-brand-600/30 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Create Community</span>
        </button>
      </div>

      {/* Category Pills */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat.id
                ? 'bg-[#17172B] dark:bg-white text-white dark:text-[#17172B] shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-800'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Groups Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredGroups.map((group) => {
          return (
            <div
              key={group.id}
              className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
            >
              {/* Card Banner Header */}
              <div className={`p-4 bg-gradient-to-r ${group.banner_gradient} text-white`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                    {getGroupIcon(group.icon_name)}
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-extrabold uppercase tracking-wider">
                    {group.category}
                  </span>
                </div>
                <h4 className="font-extrabold text-base leading-snug tracking-tight">
                  {group.name}
                </h4>
              </div>

              {/* Body */}
              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2">
                  {group.description}
                </p>

                <div className="flex flex-wrap gap-1">
                  {group.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-medium text-slate-600 dark:text-slate-400"
                    >
                      #{tag}
                    </span>
                  ))}
                  {group.tags.length > 3 && (
                    <span className="px-1.5 py-0.5 rounded-md text-[10px] text-slate-400">
                      +{group.tags.length - 3}
                    </span>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex items-center space-x-1.5">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span>{group.member_count} members</span>
                  </div>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-[11px]">
                    ● {group.active_today_count} active today
                  </span>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                <button
                  onClick={() => onToggleJoinGroup(group.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    group.is_joined
                      ? 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200'
                      : 'bg-brand-600 hover:bg-brand-500 text-white shadow-xs'
                  }`}
                >
                  {group.is_joined ? 'Joined' : 'Join'}
                </button>

                <button
                  onClick={() => setActiveGroupId(group.id)}
                  className="flex items-center space-x-1 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-brand-600 dark:hover:text-brand-400 group-hover:translate-x-0.5 transition-transform"
                >
                  <span>Open Hub</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
