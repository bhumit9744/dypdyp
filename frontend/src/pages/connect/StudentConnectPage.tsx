import React, { useState, useEffect, useCallback } from 'react';
import {
  Users,
  Search,
  Plus,
  HelpCircle,
  MessageSquare,
  GraduationCap,
  Trophy,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  Flame,
  CheckCircle2,
  X,
  Send,
  Flag,
  Share2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  StudentConnectPost,
  ConnectGroup,
  ConnectMentor,
  ConnectMentorshipRequest,
  ConnectChallenge,
  ConnectMotivation,
  ConnectSharedGoal,
  ConnectBadge,
  ConnectSubSection
} from '../../types';
import {
  INITIAL_MOTIVATION,
  INITIAL_SAVED_QUOTES,
  INITIAL_GROUPS,
  INITIAL_POSTS,
  INITIAL_MENTORS,
  INITIAL_MENTORSHIP_REQUESTS,
  INITIAL_CHALLENGES,
  INITIAL_SHARED_GOALS,
  INITIAL_BADGES
} from './data/connectInitialData';
import { DailyMotivationCard } from './components/DailyMotivationCard';
import { SavedQuotesModal } from './components/SavedQuotesModal';
import { CreatePostModal } from './components/CreatePostModal';
import { ConnectFeed } from './components/ConnectFeed';
import { CommunitiesTab } from './components/CommunitiesTab';
import { MentorsTab } from './components/MentorsTab';
import { ChallengesTab } from './components/ChallengesTab';
import { API_BASE } from '../../config/api';

export const StudentConnectPage: React.FC = () => {
  const { currentSubSection, setCurrentSubSection, studentProfile } = useApp();

  // Primary State
  const [activeTab, setActiveTab] = useState<ConnectSubSection>(
    (currentSubSection as ConnectSubSection) || 'home'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [feedFilter, setFeedFilter] = useState('all');

  // Data State
  const [motivation, setMotivation] = useState<ConnectMotivation>(() => {
    const saved = localStorage.getItem('connect_daily_motivation');
    return saved ? JSON.parse(saved) : INITIAL_MOTIVATION;
  });
  const [savedQuotes, setSavedQuotes] = useState<ConnectMotivation[]>(() => {
    const saved = localStorage.getItem('connect_saved_quotes');
    return saved ? JSON.parse(saved) : INITIAL_SAVED_QUOTES;
  });
  const [groups, setGroups] = useState<ConnectGroup[]>(() => {
    const saved = localStorage.getItem('connect_groups');
    return saved ? JSON.parse(saved) : INITIAL_GROUPS;
  });
  const [posts, setPosts] = useState<StudentConnectPost[]>(() => {
    const saved = localStorage.getItem('connect_posts');
    return saved ? JSON.parse(saved) : INITIAL_POSTS;
  });
  const [mentors, setMentors] = useState<ConnectMentor[]>(() => {
    const saved = localStorage.getItem('connect_mentors');
    return saved ? JSON.parse(saved) : INITIAL_MENTORS;
  });
  const [mentorshipRequests, setMentorshipRequests] = useState<ConnectMentorshipRequest[]>(() => {
    const saved = localStorage.getItem('connect_mentorship_requests');
    return saved ? JSON.parse(saved) : INITIAL_MENTORSHIP_REQUESTS;
  });
  const [challenges, setChallenges] = useState<ConnectChallenge[]>(() => {
    const saved = localStorage.getItem('connect_challenges');
    return saved ? JSON.parse(saved) : INITIAL_CHALLENGES;
  });
  const [sharedGoals, setSharedGoals] = useState<ConnectSharedGoal[]>(() => {
    const saved = localStorage.getItem('connect_shared_goals');
    return saved ? JSON.parse(saved) : INITIAL_SHARED_GOALS;
  });
  const [badges, setBadges] = useState<ConnectBadge[]>(() => {
    const saved = localStorage.getItem('connect_badges');
    return saved ? JSON.parse(saved) : INITIAL_BADGES;
  });

  // Modal State
  const [isSavedQuotesOpen, setIsSavedQuotesOpen] = useState(false);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [createPostDefaultType, setCreatePostDefaultType] = useState<
    'question' | 'discussion' | 'resource' | 'milestone'
  >('discussion');
  const [createPostSelectedGroupId, setCreatePostSelectedGroupId] = useState<string | undefined>(undefined);

  // Reporting State
  const [reportingPostId, setReportingPostId] = useState<string | null>(null);
  const [reportSuccessMsg, setReportSuccessMsg] = useState<string | null>(null);

  // Sync activeTab with AppContext's currentSubSection if it changes from sidebar
  useEffect(() => {
    if (
      currentSubSection === 'home' ||
      currentSubSection === 'communities' ||
      currentSubSection === 'mentors' ||
      currentSubSection === 'challenges'
    ) {
      setActiveTab(currentSubSection as ConnectSubSection);
    }
  }, [currentSubSection]);

  const handleTabChange = (tab: ConnectSubSection) => {
    setActiveTab(tab);
    setCurrentSubSection(tab);
  };

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('connect_saved_quotes', JSON.stringify(savedQuotes));
  }, [savedQuotes]);

  useEffect(() => {
    localStorage.setItem('connect_groups', JSON.stringify(groups));
  }, [groups]);

  useEffect(() => {
    localStorage.setItem('connect_posts', JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem('connect_mentorship_requests', JSON.stringify(mentorshipRequests));
  }, [mentorshipRequests]);

  useEffect(() => {
    localStorage.setItem('connect_challenges', JSON.stringify(challenges));
  }, [challenges]);

  useEffect(() => {
    localStorage.setItem('connect_shared_goals', JSON.stringify(sharedGoals));
  }, [sharedGoals]);

  // Fetch from backend API if available
  useEffect(() => {
    const loadFromBackend = async () => {
      try {
        const [motRes, grpRes, postRes, mentRes, reqRes, chRes] = await Promise.all([
          fetch(`${API_BASE}/connect/motivation`).catch(() => null),
          fetch(`${API_BASE}/connect/groups`).catch(() => null),
          fetch(`${API_BASE}/connect/posts`).catch(() => null),
          fetch(`${API_BASE}/connect/mentors`).catch(() => null),
          fetch(`${API_BASE}/connect/mentorship-requests`).catch(() => null),
          fetch(`${API_BASE}/connect/challenges`).catch(() => null)
        ]);

        if (motRes && motRes.ok) setMotivation(await motRes.json());
        if (grpRes && grpRes.ok) setGroups(await grpRes.json());
        if (postRes && postRes.ok) setPosts(await postRes.json());
        if (mentRes && mentRes.ok) setMentors(await mentRes.json());
        if (reqRes && reqRes.ok) setMentorshipRequests(await reqRes.json());
        if (chRes && chRes.ok) setChallenges(await chRes.json());
      } catch (e) {
        // Fall back gracefully to local storage
      }
    };
    loadFromBackend();
  }, []);

  // --- Handlers ---
  const handleToggleSaveMotivation = (quote: ConnectMotivation) => {
    const exists = savedQuotes.some((q) => q.id === quote.id || q.quote === quote.quote);
    if (exists) {
      setSavedQuotes((prev) => prev.filter((q) => q.id !== quote.id && q.quote !== quote.quote));
    } else {
      setSavedQuotes((prev) => [quote, ...prev]);
    }
    // Attempt backend sync
    fetch(`${API_BASE}/connect/motivation/save?card_id=${encodeURIComponent(quote.id)}`, {
      method: 'POST'
    }).catch(() => null);
  };

  const handleRemoveSavedQuote = (id: string) => {
    setSavedQuotes((prev) => prev.filter((q) => q.id !== id));
  };

  const handleToggleLikePost = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const liked = !p.liked_by_user;
          return {
            ...p,
            liked_by_user: liked,
            likes_count: liked ? p.likes_count + 1 : Math.max(0, p.likes_count - 1)
          };
        }
        return p;
      })
    );
    fetch(`${API_BASE}/connect/posts/${postId}/react`, { method: 'POST' }).catch(() => null);
  };

  const handleToggleSavePost = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, is_saved: !p.is_saved } : p))
    );
    fetch(`${API_BASE}/connect/posts/${postId}/save`, { method: 'POST' }).catch(() => null);
  };

  const handleAddComment = (postId: string, text: string) => {
    const newComment = {
      id: `comm-${Date.now()}`,
      author_id: 'usr-bhumit',
      author_name: studentProfile?.name || 'Bhumit Gupta',
      author_role: "BE Computer '25",
      content: text,
      created_at: 'Just now',
      upvotes: 0,
      is_accepted: false,
      is_mentor_reply: false
    };

    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const updated = [...p.comments, newComment];
          return {
            ...p,
            comments: updated,
            comments_count: updated.length
          };
        }
        return p;
      })
    );

    fetch(`${API_BASE}/connect/posts/${postId}/comments?content=${encodeURIComponent(text)}`, {
      method: 'POST'
    }).catch(() => null);
  };

  const handleAcceptAnswer = (postId: string, commentId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            has_accepted_answer: true,
            comments: p.comments.map((c) =>
              c.id === commentId ? { ...c, is_accepted: true } : c
            )
          };
        }
        return p;
      })
    );
    fetch(`${API_BASE}/connect/posts/${postId}/accept-answer/${commentId}`, {
      method: 'POST'
    }).catch(() => null);
  };

  const handleCreatePost = (postData: {
    title: string;
    content: string;
    post_type: 'question' | 'discussion' | 'resource' | 'milestone';
    topic_tags: string[];
    group_id?: string;
    group_name?: string;
    resource_url?: string;
  }) => {
    const newPost: StudentConnectPost = {
      id: `post-${Date.now()}`,
      title: postData.title,
      content: postData.content,
      post_type: postData.post_type,
      topic_tags: postData.topic_tags,
      group_id: postData.group_id,
      group_name: postData.group_name,
      resource_url: postData.resource_url,
      author_id: 'usr-bhumit',
      author_name: studentProfile?.name || 'Bhumit Gupta',
      author_role: "BE Computer '25",
      created_at: 'Just now',
      likes_count: 1,
      liked_by_user: true,
      comments_count: 0,
      comments: [],
      has_accepted_answer: false,
      is_pinned: false,
      is_saved: false
    };

    setPosts((prev) => [newPost, ...prev]);

    fetch(`${API_BASE}/connect/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postData)
    }).catch(() => null);
  };

  const handleToggleJoinGroup = (groupId: string) => {
    setGroups((prev) =>
      prev.map((g) => {
        if (g.id === groupId) {
          const joined = !g.is_joined;
          return {
            ...g,
            is_joined: joined,
            member_count: joined ? g.member_count + 1 : Math.max(0, g.member_count - 1)
          };
        }
        return g;
      })
    );
    fetch(`${API_BASE}/connect/groups/${groupId}/toggle-join`, { method: 'POST' }).catch(() => null);
  };

  const handleSubmitMentorshipRequest = (reqData: {
    mentor_id: string;
    mentor_name: string;
    topic: string;
    description: string;
    preferred_format: string;
    preferred_time?: string;
  }) => {
    const newReq: ConnectMentorshipRequest = {
      id: `req-${Date.now()}`,
      mentor_id: reqData.mentor_id,
      mentor_name: reqData.mentor_name,
      topic: reqData.topic,
      description: reqData.description,
      preferred_format: reqData.preferred_format,
      preferred_time: reqData.preferred_time || 'This weekend',
      student_name: studentProfile?.name || 'Bhumit Gupta',
      status: 'Pending',
      created_at: 'Just now',
      response_note: undefined
    };

    setMentorshipRequests((prev) => [newReq, ...prev]);

    fetch(`${API_BASE}/connect/mentorship-requests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reqData)
    }).catch(() => null);
  };

  const handleToggleJoinChallenge = (challengeId: string) => {
    setChallenges((prev) =>
      prev.map((ch) => {
        if (ch.id === challengeId) {
          const joined = !ch.is_joined;
          return {
            ...ch,
            is_joined: joined,
            participants_count: joined ? ch.participants_count + 1 : Math.max(0, ch.participants_count - 1)
          };
        }
        return ch;
      })
    );
    fetch(`${API_BASE}/connect/challenges/${challengeId}/toggle-join`, { method: 'POST' }).catch(() => null);
  };

  const handleToggleChallengeTask = (challengeId: string, taskId: string) => {
    setChallenges((prev) =>
      prev.map((ch) => {
        if (ch.id === challengeId) {
          const updatedTasks = ch.tasks.map((t) =>
            t.id === taskId ? { ...t, is_completed: !t.is_completed } : t
          );
          const completedCount = updatedTasks.filter((t) => t.is_completed).length;
          const percent = Math.round((completedCount / updatedTasks.length) * 100);
          return {
            ...ch,
            tasks: updatedTasks,
            completed_tasks_count: completedCount,
            percent_complete: percent
          };
        }
        return ch;
      })
    );
    fetch(`${API_BASE}/connect/challenges/${challengeId}/toggle-task/${taskId}`, { method: 'POST' }).catch(() => null);
  };

  const handleToggleGoal = (goalId: string) => {
    setSharedGoals((prev) =>
      prev.map((g) => {
        if (g.id === goalId) {
          const done = !g.is_completed;
          return {
            ...g,
            is_completed: done,
            current_count: done ? g.target_count : Math.max(0, g.target_count - 1)
          };
        }
        return g;
      })
    );
    fetch(`${API_BASE}/connect/shared-goals/${goalId}/toggle`, { method: 'POST' }).catch(() => null);
  };

  const handleShareWinToFeed = (challengeTitle: string, badgeName: string) => {
    handleCreatePost({
      title: `🎉 Milestone Achieved: Completed the ${challengeTitle}!`,
      content: `I just marked 100% on all daily tasks in the ${challengeTitle} and unlocked the "${badgeName}" badge on Placement Hub! Consistent practice makes complex patterns feel second nature. Highly recommend this sprint to everyone preparing for campus drives!`,
      post_type: 'milestone',
      topic_tags: ['Milestone', 'ChallengeCompleted', badgeName.replace(/\s+/g, ''), 'PlacementPrep']
    });
    handleTabChange('home');
  };

  const handleConfirmReport = (reason: string) => {
    if (!reportingPostId) return;
    setReportSuccessMsg('Report submitted. Our TPO student moderators will review this item.');
    setTimeout(() => {
      setReportingPostId(null);
      setReportSuccessMsg(null);
    }, 2200);
  };

  // Filtered posts for search
  const filteredPosts = posts.filter((p) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.title.toLowerCase().includes(q) ||
      p.content.toLowerCase().includes(q) ||
      p.topic_tags.some((t) => t.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6 pb-12 animate-in fade-in">
      {/* 1. Header Section */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#6366F1] to-[#8057F5] text-white flex items-center justify-center shadow-xs">
                <Users className="w-5 h-5" />
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#17172B] dark:text-white">
                Student Connect
              </h1>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-brand-600 dark:text-brand-400">
              Connect. Collaborate. Grow.
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xl">
              A student-focused placement community to prepare together, discuss DSA & full stack architectures, and get 1-on-1 guidance from verified alumni seniors.
            </p>
          </div>

          {/* Search bar & Create Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search discussions & groups..."
                className="w-full sm:w-64 pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <button
              onClick={() => {
                setCreatePostDefaultType('question');
                setCreatePostSelectedGroupId(undefined);
                setIsCreatePostOpen(true);
              }}
              className="flex items-center justify-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all"
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
              <span>Ask Question</span>
            </button>

            <button
              onClick={() => {
                setCreatePostDefaultType('discussion');
                setCreatePostSelectedGroupId(undefined);
                setIsCreatePostOpen(true);
              }}
              className="flex items-center justify-center space-x-1.5 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-xs shadow-brand-600/30 transition-all hover:scale-[1.02]"
            >
              <Plus className="w-4 h-4" />
              <span>Create Post</span>
            </button>
          </div>
        </div>

        {/* 4 Primary Entry Points (Quick Access Navigation) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-6 mt-6 border-t border-slate-100 dark:border-slate-800">
          {[
            {
              id: 'home',
              label: 'Community Home',
              desc: 'Activity Feed & Daily Motivation',
              icon: Sparkles,
              color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/40 border-amber-200/80 dark:border-amber-900/40'
            },
            {
              id: 'communities',
              label: 'Communities & Q&A',
              desc: 'Find groups & ask technical questions',
              icon: MessageSquare,
              color: 'text-brand-600 bg-brand-50 dark:bg-brand-950/40 border-brand-200/80 dark:border-brand-900/40'
            },
            {
              id: 'mentors',
              label: 'Senior & Alumni Mentoring',
              desc: '1-on-1 guidance & referral advice',
              icon: GraduationCap,
              color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200/80 dark:border-emerald-900/40'
            },
            {
              id: 'challenges',
              label: 'Challenges & Progress',
              desc: 'Sprints, tasks & student milestones',
              icon: Trophy,
              color: 'text-purple-600 bg-purple-50 dark:bg-purple-950/40 border-purple-200/80 dark:border-purple-900/40'
            }
          ].map((item) => {
            const Icon = item.icon;
            const isCurrent = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabChange(item.id as ConnectSubSection)}
                className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                  isCurrent
                    ? 'bg-brand-50/60 dark:bg-brand-950/30 border-brand-500 shadow-xs'
                    : 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/80 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${item.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  {isCurrent && (
                    <span className="w-2 h-2 rounded-full bg-brand-600 dark:bg-brand-400" />
                  )}
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                    {item.label}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                    {item.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Daily Motivation Card (Compact, Visually Striking) */}
      <DailyMotivationCard
        motivation={motivation}
        savedQuotes={savedQuotes}
        onToggleSave={handleToggleSaveMotivation}
        onOpenSavedModal={() => setIsSavedQuotesOpen(true)}
      />

      {/* 3. Tab Specific Render */}
      {activeTab === 'home' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Activity Feed (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Recent Community Activity & Discussions
              </h2>
              <span className="text-xs text-slate-500">
                {filteredPosts.length} posts
              </span>
            </div>

            <ConnectFeed
              posts={filteredPosts}
              onToggleLike={handleToggleLikePost}
              onToggleSave={handleToggleSavePost}
              onAddComment={handleAddComment}
              onAcceptAnswer={handleAcceptAnswer}
              onOpenReportModal={(id) => setReportingPostId(id)}
              activeFilter={feedFilter}
              setActiveFilter={setFeedFilter}
            />
          </div>

          {/* Secondary Panel (4 cols on desktop) */}
          <div className="lg:col-span-4 space-y-5">
            {/* Recommended Communities */}
            <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 space-y-4 shadow-xs">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                  Recommended Communities
                </h3>
                <button
                  onClick={() => handleTabChange('communities')}
                  className="text-[11px] font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center space-x-0.5"
                >
                  <span>View all</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <div className="space-y-2.5">
                {groups.slice(0, 3).map((g) => (
                  <div
                    key={g.id}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 flex items-center justify-between"
                  >
                    <div className="min-w-0 pr-2">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {g.name}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate">
                        {g.member_count} members • {g.category}
                      </p>
                    </div>

                    <button
                      onClick={() => handleToggleJoinGroup(g.id)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold shrink-0 transition-all ${
                        g.is_joined
                          ? 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                          : 'bg-brand-600 text-white hover:bg-brand-500'
                      }`}
                    >
                      {g.is_joined ? 'Joined' : '+ Join'}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Active Challenge Sprint Spotlight */}
            {challenges[0] && (
              <div className="rounded-2xl bg-gradient-to-br from-indigo-900 to-slate-900 border border-indigo-800/50 p-5 text-white space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-300">
                    🔥 Featured Sprint
                  </span>
                  <span className="text-xs text-indigo-200 font-semibold">
                    {challenges[0].participants_count} enrolled
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-white">
                    {challenges[0].title}
                  </h4>
                  <p className="text-xs text-indigo-200 mt-1 line-clamp-2">
                    {challenges[0].description}
                  </p>
                </div>

                <div className="space-y-1 pt-1">
                  <div className="flex items-center justify-between text-[11px] text-indigo-300">
                    <span>Progress: {challenges[0].completed_tasks_count}/{challenges[0].tasks.length} tasks</span>
                    <span className="font-bold">{challenges[0].percent_complete}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-white/20 overflow-hidden">
                    <div
                      className="h-full bg-emerald-400 rounded-full"
                      style={{ width: `${challenges[0].percent_complete}%` }}
                    />
                  </div>
                </div>

                <button
                  onClick={() => handleTabChange('challenges')}
                  className="w-full py-2 rounded-xl bg-white text-slate-900 text-xs font-bold hover:bg-white/90 transition-all flex items-center justify-center space-x-1"
                >
                  <span>Open Challenge Workspace</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Verified Mentors Shortcut */}
            <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 space-y-3.5 shadow-xs">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                  Senior Alumni Mentors
                </h3>
                <button
                  onClick={() => handleTabChange('mentors')}
                  className="text-[11px] font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center space-x-0.5"
                >
                  <span>View all ({mentors.length})</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <div className="space-y-2.5">
                {mentors.slice(0, 2).map((m) => (
                  <div
                    key={m.id}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1.5">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {m.name}
                        </span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      </div>
                      <span className="text-[10px] font-bold text-brand-600 dark:text-brand-400">
                        {m.company}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-500 line-clamp-1">
                      {m.role} • {m.college_batch}
                    </p>

                    <button
                      onClick={() => handleTabChange('mentors')}
                      className="text-[11px] font-bold text-brand-600 hover:underline pt-0.5 block"
                    >
                      Request Guidance →
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Community Standards Notice */}
            <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 p-4 space-y-2 text-xs text-slate-500">
              <div className="flex items-center space-x-2 text-slate-700 dark:text-slate-300 font-bold">
                <ShieldAlert className="w-4 h-4 text-brand-600" />
                <span>Placement Hub Standards</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Student Connect is dedicated to collaborative learning and genuine placement preparation. Respectful feedback and verified advice keep this space valuable for everyone.
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'communities' && (
        <CommunitiesTab
          groups={groups}
          posts={posts}
          onToggleJoinGroup={handleToggleJoinGroup}
          onOpenCreateGroupModal={() => setIsCreatePostOpen(true)}
          onOpenCreatePostModal={(gid) => {
            setCreatePostSelectedGroupId(gid);
            setCreatePostDefaultType('discussion');
            setIsCreatePostOpen(true);
          }}
          onToggleLike={handleToggleLikePost}
          onToggleSave={handleToggleSavePost}
          onAddComment={handleAddComment}
          onAcceptAnswer={handleAcceptAnswer}
          onOpenReportModal={(id) => setReportingPostId(id)}
        />
      )}

      {activeTab === 'mentors' && (
        <MentorsTab
          mentors={mentors}
          requests={mentorshipRequests}
          onSubmitRequest={handleSubmitMentorshipRequest}
        />
      )}

      {activeTab === 'challenges' && (
        <ChallengesTab
          challenges={challenges}
          sharedGoals={sharedGoals}
          badges={badges}
          onToggleJoinChallenge={handleToggleJoinChallenge}
          onToggleTask={handleToggleChallengeTask}
          onToggleGoal={handleToggleGoal}
          onShareWinToFeed={handleShareWinToFeed}
        />
      )}

      {/* --- Modals --- */}
      <SavedQuotesModal
        isOpen={isSavedQuotesOpen}
        onClose={() => setIsSavedQuotesOpen(false)}
        savedQuotes={savedQuotes}
        onRemoveQuote={handleRemoveSavedQuote}
      />

      <CreatePostModal
        isOpen={isCreatePostOpen}
        onClose={() => setIsCreatePostOpen(false)}
        groups={groups}
        selectedGroupId={createPostSelectedGroupId}
        defaultType={createPostDefaultType}
        onSubmitPost={handleCreatePost}
      />

      {/* Report Post Modal */}
      {reportingPostId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-rose-600">
                <Flag className="w-5 h-5" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Report Inappropriate Content
                </h3>
              </div>
              <button
                onClick={() => setReportingPostId(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {reportSuccessMsg ? (
              <div className="py-4 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  {reportSuccessMsg}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Please select why this post violates community guidelines:
                </p>
                <div className="space-y-2">
                  {[
                    'Spam, advertising, or duplicate content',
                    'Disrespectful or non-constructive behavior',
                    'Copyrighted exam material leak',
                    'Misleading career or placement advice'
                  ].map((reason) => (
                    <button
                      key={reason}
                      onClick={() => handleConfirmReport(reason)}
                      className="w-full text-left p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors"
                    >
                      {reason}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
