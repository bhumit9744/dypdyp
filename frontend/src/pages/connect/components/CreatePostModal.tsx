import React, { useState } from 'react';
import {
  X,
  HelpCircle,
  MessageSquare,
  FileCode2,
  Trophy,
  Send,
  Tag,
  Link2,
  Users
} from 'lucide-react';
import { ConnectGroup, StudentConnectPost } from '../../../types';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  groups: ConnectGroup[];
  selectedGroupId?: string;
  defaultType?: 'question' | 'discussion' | 'resource' | 'milestone';
  onSubmitPost: (postData: {
    title: string;
    content: string;
    post_type: 'question' | 'discussion' | 'resource' | 'milestone';
    topic_tags: string[];
    group_id?: string;
    group_name?: string;
    resource_url?: string;
  }) => void;
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
  isOpen,
  onClose,
  groups,
  selectedGroupId,
  defaultType = 'discussion',
  onSubmitPost
}) => {
  const [postType, setPostType] = useState<'question' | 'discussion' | 'resource' | 'milestone'>(defaultType);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [groupId, setGroupId] = useState(selectedGroupId || '');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(['InterviewPrep']);
  const [resourceUrl, setResourceUrl] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAddTag = () => {
    const trimmed = tagInput.trim().replace(/^#/, '');
    if (trimmed && !tags.includes(trimmed) && tags.length < 5) {
      setTags([...tags, trimmed]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim().length < 5) {
      setError('Title must be at least 5 characters long.');
      return;
    }
    if (content.trim().length < 15) {
      setError('Content must be at least 15 characters long.');
      return;
    }

    const selectedGroup = groups.find((g) => g.id === groupId);

    onSubmitPost({
      title: title.trim(),
      content: content.trim(),
      post_type: postType,
      topic_tags: tags.length > 0 ? tags : ['General'],
      group_id: groupId || undefined,
      group_name: selectedGroup?.name,
      resource_url: resourceUrl.trim() || undefined
    });

    // Reset and close
    setTitle('');
    setContent('');
    setResourceUrl('');
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 shrink-0">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {postType === 'question' ? 'Ask a Question' : 'Create Community Post'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Share knowledge, get peer feedback, or celebrate a placement milestone
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs font-semibold text-rose-600 dark:text-rose-400">
              {error}
            </div>
          )}

          {/* Post Type Selector Tabs */}
          <div className="grid grid-cols-4 gap-2 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl">
            <button
              type="button"
              onClick={() => setPostType('question')}
              className={`flex items-center justify-center space-x-1.5 py-2 px-2 rounded-lg text-xs font-bold transition-all ${
                postType === 'question'
                  ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Question</span>
            </button>

            <button
              type="button"
              onClick={() => setPostType('discussion')}
              className={`flex items-center justify-center space-x-1.5 py-2 px-2 rounded-lg text-xs font-bold transition-all ${
                postType === 'discussion'
                  ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Discussion</span>
            </button>

            <button
              type="button"
              onClick={() => setPostType('resource')}
              className={`flex items-center justify-center space-x-1.5 py-2 px-2 rounded-lg text-xs font-bold transition-all ${
                postType === 'resource'
                  ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <FileCode2 className="w-3.5 h-3.5" />
              <span>Resource</span>
            </button>

            <button
              type="button"
              onClick={() => setPostType('milestone')}
              className={`flex items-center justify-center space-x-1.5 py-2 px-2 rounded-lg text-xs font-bold transition-all ${
                postType === 'milestone'
                  ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>Milestone</span>
            </button>
          </div>

          {/* Group Destination Picker */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center space-x-1.5">
              <Users className="w-3.5 h-3.5 text-slate-400" />
              <span>Post to Community Group (Optional)</span>
            </label>
            <select
              value={groupId}
              onChange={(e) => setGroupId(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-brand-500"
            >
              <option value="">🌐 General Placement Hub Feed (All Students)</option>
              {groups.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.name} ({group.category})
                </option>
              ))}
            </select>
          </div>

          {/* Post Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              {postType === 'question' ? 'Question Title *' : 'Title *'}
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={
                postType === 'question'
                  ? 'e.g., How should I start preparing for 2D Dynamic Programming for Barclays?'
                  : postType === 'resource'
                  ? 'e.g., Handcrafted Operating Systems & DBMS 25-Page Revision Notes'
                  : postType === 'milestone'
                  ? 'e.g., 🎉 Passed Round 1 Technical Assessment at Veritas Technologies!'
                  : 'e.g., Architecture review: What makes recruiter-grade full stack projects standout?'
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-brand-500"
              required
            />
          </div>

          {/* Resource URL (If Resource) */}
          {postType === 'resource' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center space-x-1.5">
                <Link2 className="w-3.5 h-3.5 text-slate-400" />
                <span>Resource or Repository Link</span>
              </label>
              <input
                type="url"
                value={resourceUrl}
                onChange={(e) => setResourceUrl(e.target.value)}
                placeholder="https://github.com/... or https://docs..."
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-brand-500"
              />
            </div>
          )}

          {/* Content Textarea */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              {postType === 'question' ? 'Describe your question in detail *' : 'Content / Details *'}
            </label>
            <textarea
              rows={5}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={
                postType === 'question'
                  ? 'Include what you have already tried, code snippets or time complexity constraints...'
                  : 'Write your thoughts, tips, or milestone experience...'
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-brand-500 font-sans"
              required
            />
          </div>

          {/* Topic Tags Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center space-x-1.5">
              <Tag className="w-3.5 h-3.5 text-slate-400" />
              <span>Topic Tags (up to 5)</span>
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                placeholder="Type a tag (e.g., LeetCode, React, Aptitude) and press Enter"
                className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-brand-500"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-bold text-slate-700 dark:text-slate-300"
              >
                Add
              </button>
            </div>

            {/* Rendered Tags */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 border border-brand-200/60 text-[11px] font-bold"
                >
                  <span>#{tag}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-rose-500 ml-1"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </form>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-slate-400">
            Posting as: <strong className="text-slate-700 dark:text-slate-200">Bhumit Gupta (BE Comp '25)</strong>
          </span>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="flex items-center space-x-1.5 px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-xs shadow-brand-600/30 transition-all hover:scale-[1.02]"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Publish Post</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
