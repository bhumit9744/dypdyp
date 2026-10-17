import React, { useState } from 'react';
import {
  Heart,
  MessageSquare,
  Bookmark,
  BookmarkCheck,
  Share2,
  Flag,
  CheckCircle2,
  HelpCircle,
  Trophy,
  FileCode2,
  ExternalLink,
  Send,
  Sparkles,
  Pin,
  Check
} from 'lucide-react';
import { StudentConnectPost, ConnectComment } from '../../../types';

interface ConnectFeedProps {
  posts: StudentConnectPost[];
  currentStudentName?: string;
  onToggleLike: (postId: string) => void;
  onToggleSave: (postId: string) => void;
  onAddComment: (postId: string, text: string) => void;
  onAcceptAnswer?: (postId: string, commentId: string) => void;
  onOpenReportModal: (postId: string) => void;
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
}

export const ConnectFeed: React.FC<ConnectFeedProps> = ({
  posts,
  currentStudentName = 'Bhumit Gupta',
  onToggleLike,
  onToggleSave,
  onAddComment,
  onAcceptAnswer,
  onOpenReportModal,
  activeFilter,
  setActiveFilter
}) => {
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({
    'post-1': true,
    'post-2': true
  });
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const toggleComments = (postId: string) => {
    setExpandedComments((prev) => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const handleCommentSubmit = (postId: string, e: React.FormEvent) => {
    e.preventDefault();
    const text = commentInputs[postId]?.trim();
    if (!text) return;
    onAddComment(postId, text);
    setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
    setExpandedComments((prev) => ({ ...prev, [postId]: true }));
  };

  const handleSharePost = (post: StudentConnectPost) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(
        `Placement Hub Student Connect:\n“${post.title}”\nBy ${post.author_name} (${post.author_role})`
      );
      setCopiedId(post.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const getPostTypeBadge = (type: string) => {
    switch (type) {
      case 'question':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200/60 text-[11px] font-bold">
            <HelpCircle className="w-3 h-3 text-amber-500" />
            Question
          </span>
        );
      case 'resource':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 text-[11px] font-bold">
            <FileCode2 className="w-3 h-3 text-emerald-500" />
            Resource
          </span>
        );
      case 'milestone':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200/60 text-[11px] font-bold">
            <Trophy className="w-3 h-3 text-purple-500" />
            Milestone
          </span>
        );
      case 'announcement':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200/60 text-[11px] font-bold">
            <Sparkles className="w-3 h-3 text-rose-500" />
            Official
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 text-[11px] font-bold">
            <MessageSquare className="w-3 h-3 text-indigo-500" />
            Discussion
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Feed Filter Pills */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'all', label: 'All Activity' },
          { id: 'question', label: 'Questions & Answers' },
          { id: 'discussion', label: 'Discussions' },
          { id: 'resource', label: 'Shared Resources' },
          { id: 'milestone', label: 'Milestones & Wins' }
        ].map((filter) => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeFilter === filter.id
                ? 'bg-[#17172B] dark:bg-white text-white dark:text-[#17172B] shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-800'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Posts Stream */}
      {posts.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
          <MessageSquare className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
            No posts found in this feed
          </h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Be the first student to ask a question, share a useful preparation resource, or celebrate your placement milestone!
          </p>
        </div>
      ) : (
        posts.map((post) => {
          const isCommentsOpen = Boolean(expandedComments[post.id]);
          const commentInput = commentInputs[post.id] || '';

          return (
            <article
              key={post.id}
              className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-5 md:p-6 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all space-y-3.5"
            >
              {/* Post Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center space-x-3">
                  {post.author_avatar ? (
                    <img
                      src={post.author_avatar}
                      alt={post.author_name}
                      className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#6366F1] to-[#8057F5] text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                      {post.author_name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                    </div>
                  )}

                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                        {post.author_name}
                      </span>
                      {post.author_role.includes('Barclays') ||
                      post.author_role.includes('Microsoft') ||
                      post.author_role.includes('Alumni') ? (
                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold border border-emerald-200/60">
                          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                          Alumni Senior
                        </span>
                      ) : null}
                    </div>
                    <div className="flex items-center space-x-2 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      <span>{post.author_role}</span>
                      <span>•</span>
                      <span>{post.created_at}</span>
                      {post.group_name && (
                        <>
                          <span>•</span>
                          <span className="font-semibold text-brand-600 dark:text-brand-400">
                            in {post.group_name}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Header Status */}
                <div className="flex items-center space-x-2 shrink-0">
                  {post.is_pinned && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 px-2 py-0.5 rounded-full border border-indigo-200/60">
                      <Pin className="w-3 h-3" />
                      Pinned
                    </span>
                  )}
                  {getPostTypeBadge(post.post_type)}
                </div>
              </div>

              {/* Title & Content */}
              <div className="space-y-2">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug">
                  {post.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line font-sans">
                  {post.content}
                </p>

                {/* Resource Link Banner if present */}
                {post.resource_url && (
                  <a
                    href={post.resource_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center space-x-2 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline mt-1"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Open Resource Repository ({post.resource_url.replace('https://', '')})</span>
                  </a>
                )}
              </div>

              {/* Topic Tags */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {post.topic_tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] font-medium text-slate-600 dark:text-slate-400"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Action Bar (Like, Comment, Save, Share, Report) */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center space-x-3 sm:space-x-4">
                  {/* Like button */}
                  <button
                    onClick={() => onToggleLike(post.id)}
                    className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl font-semibold transition-colors ${
                      post.liked_by_user
                        ? 'text-rose-600 bg-rose-50 dark:bg-rose-950/40 font-bold'
                        : 'hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${post.liked_by_user ? 'fill-rose-500 text-rose-500' : ''}`} />
                    <span>{post.likes_count}</span>
                  </button>

                  {/* Comment Toggle */}
                  <button
                    onClick={() => toggleComments(post.id)}
                    className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl font-semibold hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>
                      {post.comments_count} {post.comments_count === 1 ? 'Reply' : 'Replies'}
                    </span>
                  </button>

                  {/* Bookmark Save */}
                  <button
                    onClick={() => onToggleSave(post.id)}
                    className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl font-semibold transition-colors ${
                      post.is_saved
                        ? 'text-amber-600 bg-amber-50 dark:bg-amber-950/40 font-bold'
                        : 'hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                    title={post.is_saved ? 'Saved in bookmarks' : 'Save post'}
                  >
                    {post.is_saved ? (
                      <BookmarkCheck className="w-4 h-4 text-amber-600" />
                    ) : (
                      <Bookmark className="w-4 h-4" />
                    )}
                    <span className="hidden sm:inline">{post.is_saved ? 'Saved' : 'Save'}</span>
                  </button>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleSharePost(post)}
                    className="p-1.5 rounded-lg hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="Share link"
                  >
                    {copiedId === post.id ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Share2 className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={() => onOpenReportModal(post.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                    title="Report post"
                  >
                    <Flag className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Comment Thread (Collapsible) */}
              {isCommentsOpen && (
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-3 animate-in fade-in">
                  {/* Answers / Replies List */}
                  {post.comments.length > 0 && (
                    <div className="space-y-2.5">
                      {post.comments.map((comment) => (
                        <div
                          key={comment.id}
                          className={`p-3.5 rounded-xl text-xs space-y-1.5 ${
                            comment.is_accepted
                              ? 'bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50'
                              : 'bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <span className="font-bold text-slate-900 dark:text-white">
                                {comment.author_name}
                              </span>
                              <span className="text-[10px] text-slate-500 dark:text-slate-400">
                                • {comment.author_role}
                              </span>
                              {comment.is_mentor_reply && (
                                <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                                  Verified Mentor
                                </span>
                              )}
                            </div>

                            {comment.is_accepted && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-emerald-700 dark:text-emerald-300 bg-emerald-100/70 dark:bg-emerald-900/40 px-2 py-0.5 rounded-full">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                Accepted by Author
                              </span>
                            )}
                          </div>

                          <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                            {comment.content}
                          </p>

                          <div className="flex items-center justify-between pt-1 text-[10px] text-slate-400">
                            <span>{comment.created_at}</span>
                            {!comment.is_accepted && onAcceptAnswer && post.post_type === 'question' && (
                              <button
                                onClick={() => onAcceptAnswer(post.id, comment.id)}
                                className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline"
                              >
                                Mark as Helpful / Accepted
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add Reply Input */}
                  <form onSubmit={(e) => handleCommentSubmit(post.id, e)} className="flex items-center space-x-2 pt-1">
                    <input
                      type="text"
                      value={commentInput}
                      onChange={(e) =>
                        setCommentInputs((prev) => ({ ...prev, [post.id]: e.target.value }))
                      }
                      placeholder={
                        post.post_type === 'question'
                          ? 'Write a helpful answer or tip...'
                          : 'Share your perspective or congratulate...'
                      }
                      className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-brand-500"
                    />
                    <button
                      type="submit"
                      disabled={!commentInput.trim()}
                      className="px-3.5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white text-xs font-bold transition-all inline-flex items-center gap-1"
                    >
                      <Send className="w-3 h-3" />
                      <span>Reply</span>
                    </button>
                  </form>
                </div>
              )}
            </article>
          );
        })
      )}
    </div>
  );
};
