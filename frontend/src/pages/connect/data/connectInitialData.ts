import {
  StudentConnectPost,
  ConnectGroup,
  ConnectMentor,
  ConnectMentorshipRequest,
  ConnectChallenge,
  ConnectMotivation,
  ConnectSharedGoal,
  ConnectBadge
} from '../../../types';

export const INITIAL_MOTIVATION: ConnectMotivation = {
  id: 'mot-today',
  quote: 'Progress comes from showing up consistently, even when the results are not immediate.',
  author: 'James Clear • Atomic Habits',
  message: 'Placement preparation is a marathon of compound learning. 30 focused minutes every single day outperforms 10 hours of panic right before the drive.',
  action_today: 'Spend 30 minutes solving one DSA pattern you find challenging or polishing one project bullet point.',
  date: new Date().toISOString().split('T')[0],
  category: 'Consistency & Discipline'
};

export const INITIAL_SAVED_QUOTES: ConnectMotivation[] = [
  INITIAL_MOTIVATION,
  {
    id: 'mot-saved-1',
    quote: 'Discipline is choosing between what you want now and what you want most.',
    author: 'Abraham Lincoln',
    message: 'Keep that goal of clearing your dream placement round front and center when distractions appear.',
    action_today: 'Block off 1 uninterrupted hour today for placement preparation with phone on silent.',
    date: '2026-10-15',
    category: 'Discipline'
  },
  {
    id: 'mot-saved-2',
    quote: "You don't have to be great to start, but you have to start to be great.",
    author: 'Zig Ziglar',
    message: "Don't wait until you've revised everything to begin solving questions. Start today.",
    action_today: 'Attempt 2 new problems without looking at the solutions first.',
    date: '2026-10-12',
    category: 'Initiative'
  }
];

export const INITIAL_GROUPS: ConnectGroup[] = [
  {
    id: 'grp-dsa-mastery',
    name: 'DSA & Problem Solving Circle',
    description: 'Daily LeetCode discussions, graph algorithms, dynamic programming breakdowns, and peer code reviews for campus placements.',
    category: 'DSA & Coding',
    tags: ['LeetCode', 'Dynamic Programming', 'Graphs', 'Trees', 'C++', 'Java'],
    banner_gradient: 'from-indigo-600 to-blue-700',
    icon_name: 'Code2',
    member_count: 342,
    active_today_count: 48,
    is_joined: true,
    pinned_announcement: '📌 7-Day Graph & Tree Marathon is live! Check the Challenges tab to join and track your checklist.',
    rules: [
      'Always include problem link and your thought process before asking for code.',
      'Format code blocks clearly and state time/space complexity.',
      'Be constructive and supportive to peers at all skill levels.'
    ]
  },
  {
    id: 'grp-fullstack-devs',
    name: 'Full-Stack Developers & Builders',
    description: 'Share React, Node.js, FastAPI, Next.js projects, get architecture feedback, and find hackathon teammates.',
    category: 'Web Dev',
    tags: ['React', 'Node.js', 'FastAPI', 'PostgreSQL', 'Tailwind', 'Next.js'],
    banner_gradient: 'from-emerald-600 to-teal-700',
    icon_name: 'Layers',
    member_count: 285,
    active_today_count: 39,
    is_joined: true,
    pinned_announcement: '🚀 Showcase your portfolio projects here to receive genuine peer feedback and resume bullet tips.',
    rules: [
      'No spam or self-promotion without technical value.',
      'Include live demo and GitHub repository link for project reviews.',
      'Share constructive feedback on at least one peer project when posting your own.'
    ]
  },
  {
    id: 'grp-aiml-learners',
    name: 'AI & Machine Learning Hub',
    description: 'Computer Vision, NLP, LLM prompt engineering, RAG pipelines, and deploying deep learning models on cloud.',
    category: 'AI / ML',
    tags: ['PyTorch', 'HuggingFace', 'RAG', 'LLMs', 'Scikit-Learn', 'FastAPI'],
    banner_gradient: 'from-purple-600 to-pink-600',
    icon_name: 'BrainCircuit',
    member_count: 210,
    active_today_count: 31,
    is_joined: false,
    pinned_announcement: '💡 Discussing production RAG architectures for campus recruitment showcase projects.',
    rules: [
      'Explain ML intuition before dropping complex math.',
      'Credit all open-source models and datasets used.'
    ]
  },
  {
    id: 'grp-tcs-ninja-digital',
    name: 'TCS Digital & Prime Preparation',
    description: 'Previous year coding questions, advanced quantitative aptitude, verbal practice, and interview debriefs for TCS drives.',
    category: 'Company Specific',
    tags: ['TCS Digital', 'TCS Prime', 'Advanced Quant', 'Coding Rounds', 'NQT'],
    banner_gradient: 'from-amber-600 to-orange-700',
    icon_name: 'Building2',
    member_count: 418,
    active_today_count: 64,
    is_joined: false,
    pinned_announcement: '📑 Consolidated archive of previous year TCS Digital technical round questions uploaded to Resources.',
    rules: [
      'Do not share copyrighted exam content during active test windows.',
      'Focus on conceptual clarity.'
    ]
  },
  {
    id: 'grp-internship-hunters',
    name: 'Internship Hunters 2026/2027',
    description: 'Off-campus openings, cold email strategies, resume tailoring, and interview experience sharing for pre-final years.',
    category: 'Career Paths',
    tags: ['Off-Campus', 'Cold Email', 'Referrals', 'Resume Review', 'Summer Internships'],
    banner_gradient: 'from-cyan-600 to-blue-600',
    icon_name: 'Briefcase',
    member_count: 390,
    active_today_count: 52,
    is_joined: true,
    pinned_announcement: '📢 Referral request template and cold emailing playbook pinned in the discussions.',
    rules: [
      'Share verified application links only.',
      'Respect mentor and alumni time.'
    ]
  },
  {
    id: 'grp-aptitude-crushers',
    name: 'Aptitude & Core CS Sprint',
    description: 'Operating Systems, DBMS, Computer Networks, OOP concepts, and fast quantitative mental math tricks for preliminary rounds.',
    category: 'Aptitude',
    tags: ['OS', 'DBMS', 'Computer Networks', 'Quantitative Aptitude', 'Logical Reasoning'],
    banner_gradient: 'from-rose-600 to-red-700',
    icon_name: 'Sparkles',
    member_count: 260,
    active_today_count: 35,
    is_joined: false,
    pinned_announcement: '🧠 Weekly 15-question speed quiz posted every Wednesday at 7 PM.',
    rules: [
      'State the reasoning steps clearly with your answers.'
    ]
  }
];

export const INITIAL_POSTS: StudentConnectPost[] = [
  {
    id: 'post-1',
    title: 'How to structure a clean RAG or Full-Stack project so recruiters notice it in 10 seconds?',
    content: `I noticed recruiters spend less than 15-20 seconds on resume project bullets. In my recent campus interviews, what actually made interviewers pause and dive into my code was:

1. A clear live URL (Vercel/Render) right next to the project title.
2. A 2-line visual architecture diagram in the GitHub README explaining data flow.
3. Measurable metrics (e.g., 'reduced latency by 42% using Redis caching', 'processed 50 concurrent websocket clients').

What other specific aspects do senior technical interviewers look for when reviewing student repositories?`,
    post_type: 'discussion',
    topic_tags: ['Projects', 'Resume Tips', 'System Design', 'Recruiter Advice'],
    group_id: 'grp-fullstack-devs',
    group_name: 'Full-Stack Developers & Builders',
    author_id: 'usr-tanvi',
    author_name: 'Tanvi Kulkarni',
    author_role: "BE Computer '24 • Placed at Barclays",
    created_at: '2 hours ago',
    likes_count: 28,
    liked_by_user: true,
    comments_count: 2,
    has_accepted_answer: true,
    is_pinned: true,
    is_saved: true,
    comments: [
      {
        id: 'comm-1',
        author_id: 'usr-rahul',
        author_name: 'Rahul Sharma',
        author_role: "Alumni '21 • Software Engineer at Microsoft",
        content: "Spot on Tanvi! As an interviewer, the #1 red flag is a project that looks copied from a YouTube tutorial without custom tests or deployment. Having a GitHub Actions workflow file that runs automated test suites on pull requests instantly puts you in the top 5% of freshers.",
        created_at: '1 hour ago',
        upvotes: 19,
        is_accepted: true,
        is_mentor_reply: true
      },
      {
        id: 'comm-2',
        author_id: 'usr-bhumit',
        author_name: 'Bhumit Gupta',
        author_role: "BE Computer '25",
        content: "This is super helpful insight. I am adding automated unit tests and Docker Compose to my FastAPI project right now.",
        created_at: '45 mins ago',
        upvotes: 4,
        is_accepted: false,
        is_mentor_reply: false
      }
    ]
  },
  {
    id: 'post-2',
    title: '[Solved] How should a 3rd year student start dynamic programming without feeling overwhelmed?',
    content: `I find simple recursion intuitive, but as soon as DP memoization and tabulation come up (especially 2D grid DP and Knapsack variations), I get stuck on state transitions. What is the exact step-by-step ladder you used to master DP for coding rounds?`,
    post_type: 'question',
    topic_tags: ['DSA', 'Dynamic Programming', 'LeetCode', 'Interview Prep'],
    group_id: 'grp-dsa-mastery',
    group_name: 'DSA & Problem Solving Circle',
    author_id: 'usr-aarav',
    author_name: 'Aarav Joshi',
    author_role: "TE Information Technology '26",
    created_at: '4 hours ago',
    likes_count: 19,
    liked_by_user: false,
    comments_count: 1,
    has_accepted_answer: true,
    is_pinned: false,
    is_saved: false,
    comments: [
      {
        id: 'comm-201',
        author_id: 'usr-priya',
        author_name: 'Priya Nair',
        author_role: "BE Computer '25 • 600+ LeetCode",
        content: `Follow this exact 3-step formula:
1. Solve the pure recursive solution with base cases first.
2. Identify changing parameters (e.g. index, remaining capacity). That tells you whether it's 1D or 2D DP.
3. Add a cache array/hashmap to save subproblem results.
Start with: Fibonacci -> Climbing Stairs -> House Robber -> 0/1 Knapsack -> Longest Common Subsequence. Do not touch DP on Trees or Bitmask until you master these 5!`,
        created_at: '3 hours ago',
        upvotes: 23,
        is_accepted: true,
        is_mentor_reply: false
      }
    ]
  },
  {
    id: 'post-3',
    title: '🎉 Milestone Unlocked: Cleared Barclays Technical Assessment & Completed 7-Day Graph Sprint!',
    content: `Huge thank you to the DSA Practice Circle! Just received confirmation for the Barclays Round 2 technical interview. Spending 1 focused hour each day following the structured sprint made a massive difference in handling graph traversal questions under pressure. Keep pushing everyone!`,
    post_type: 'milestone',
    topic_tags: ['Milestone', 'Barclays', 'Interview Cleared', 'Celebration'],
    group_id: 'grp-dsa-mastery',
    group_name: 'DSA & Problem Solving Circle',
    author_id: 'usr-sneha',
    author_name: 'Sneha Patil',
    author_role: "BE Information Technology '25",
    created_at: '6 hours ago',
    likes_count: 54,
    liked_by_user: true,
    comments_count: 1,
    has_accepted_answer: false,
    is_pinned: false,
    is_saved: false,
    comments: [
      {
        id: 'comm-301',
        author_id: 'usr-bhumit',
        author_name: 'Bhumit Gupta',
        author_role: "BE Computer '25",
        content: "Congratulations Sneha! You have been super consistent on the challenges. Go crush round 2! 🚀",
        created_at: '5 hours ago',
        upvotes: 5,
        is_accepted: false,
        is_mentor_reply: false
      }
    ]
  },
  {
    id: 'post-4',
    title: 'Handcrafted Operating Systems & DBMS 25-Page Cheat Sheet for Campus Technical Rounds',
    content: `Compiled all high-frequency topics asked in preliminary interview rounds: Process vs Thread, Deadlocks & Bankers Algorithm, Virtual Memory & Paging, ACID properties, B+ Tree indexing, and SQL Normalization. No fluff, pure revision bullet points with diagrams.`,
    post_type: 'resource',
    topic_tags: ['Operating Systems', 'DBMS', 'Core CS', 'Interview Cheat Sheet'],
    group_id: 'grp-aptitude-crushers',
    group_name: 'Aptitude & Core CS Sprint',
    resource_url: 'https://github.com/dypcoe-placement/core-cs-revision-notes',
    author_id: 'usr-vikram',
    author_name: 'Vikram Deshmukh',
    author_role: "BE Computer '24 • Placed at Veritas",
    created_at: 'Yesterday',
    likes_count: 87,
    liked_by_user: false,
    comments_count: 0,
    has_accepted_answer: false,
    is_pinned: true,
    is_saved: true,
    comments: []
  }
];

export const INITIAL_MENTORS: ConnectMentor[] = [
  {
    id: 'mentor-1',
    name: 'Rahul Sharma',
    role: 'Software Engineer II',
    company: 'Microsoft',
    college_batch: "DYPCOE '21 Computer Engineering",
    areas_of_expertise: ['Distributed Systems', 'Data Structures & Algorithms', 'System Design', 'Off-Campus Mentoring'],
    career_path: 'Software Development',
    topics: ['Resume Review', 'Mock Technical Interview', 'Off-Campus Strategy', 'System Design Basics'],
    availability_status: 'Available this week • 3 slots open',
    is_verified: true,
    rating: 4.95,
    sessions_completed: 34,
    bio: 'Senior SWE at Microsoft Azure Core. Passionate about helping DYP students break into tier-1 product companies without paid bootcamps.'
  },
  {
    id: 'mentor-2',
    name: 'Tanvi Kulkarni',
    role: 'Technology Analyst',
    company: 'Barclays',
    college_batch: "DYPCOE '24 Computer Engineering",
    areas_of_expertise: ['FinTech Architectures', 'Spring Boot', 'Microservices', 'Campus Drive Prep'],
    career_path: 'Software Development',
    topics: ['Barclays Campus Round Tips', 'Java & Spring Boot Deep Dive', 'Resume Roast', 'HR Round Confidence'],
    availability_status: 'Weekends • 2 slots open',
    is_verified: true,
    rating: 4.9,
    sessions_completed: 22,
    bio: 'Recently navigated the on-campus recruitment cycle at DYPCOE. I can share the exact interview stages, coding level, and behavioral questions asked at Barclays.'
  },
  {
    id: 'mentor-3',
    name: 'Aditya Verma',
    role: 'Machine Learning Engineer',
    company: 'NVIDIA',
    college_batch: "DYPCOE '22 Electronics & Telecomm",
    areas_of_expertise: ['Deep Learning', 'TensorRT', 'CUDA', 'PyTorch', 'Transitioning from ENTC to Tech'],
    career_path: 'AI & Data Science',
    topics: ['AI Project Review', 'Transition from Non-CS to AI', 'NVIDIA & Qualcomm Hiring Process', 'Math for ML'],
    availability_status: 'Available Thursday & Saturday',
    is_verified: true,
    rating: 4.98,
    sessions_completed: 41,
    bio: 'ENTC graduate who successfully pivoted to GPU-accelerated computing at NVIDIA. Happy to guide non-CS branch students aiming for high-package tech roles.'
  },
  {
    id: 'mentor-4',
    name: 'Pooja Mehta',
    role: 'Cloud Infrastructure Engineer',
    company: 'Veritas Technologies',
    college_batch: "DYPCOE '23 Information Technology",
    areas_of_expertise: ['AWS & Kubernetes', 'Linux Systems', 'Storage & File Systems', 'DevOps Pipelines'],
    career_path: 'Cloud & DevOps',
    topics: ['Core OS & Linux Preparation', 'Cloud Certification Path', 'Resume Tailoring for Systems Roles', 'Veritas Interview Prep'],
    availability_status: 'Available Friday evening',
    is_verified: true,
    rating: 4.88,
    sessions_completed: 19,
    bio: 'Working on enterprise scale data protection and cloud storage. Helping students master Linux internals and systems programming for tier-1 infrastructure firms.'
  },
  {
    id: 'mentor-5',
    name: 'Karan Malhotra',
    role: 'Software Development Engineer',
    company: 'Amazon',
    college_batch: "DYPCOE '22 Computer Engineering",
    areas_of_expertise: ['High Scalability', 'Java Backend', 'Leadership Principles', 'DSA Problem Solving'],
    career_path: 'Software Development',
    topics: ['Amazon Leadership Principles & Behavioral', 'Hard DSA Patterns', 'Mock Coding Interview', 'Offer Negotiation'],
    availability_status: 'Busy this week • Next slots open Monday',
    is_verified: true,
    rating: 5.0,
    sessions_completed: 58,
    bio: 'SDE-1 at Amazon. Mentored 40+ college juniors on breaking down complex behavioral scenarios and cracking tough algorithmic rounds.'
  }
];

export const INITIAL_MENTORSHIP_REQUESTS: ConnectMentorshipRequest[] = [
  {
    id: 'req-1',
    mentor_id: 'mentor-1',
    mentor_name: 'Rahul Sharma',
    topic: 'Mock Technical Interview & DSA Code Review',
    description: 'I have an upcoming interview with a tier-1 firm in 10 days. I would love a 30-minute mock session focusing on Graphs and Binary Tree traversals.',
    preferred_format: '1-on-1 Video Session',
    preferred_time: 'Saturday 4:00 PM IST',
    student_name: 'Bhumit Gupta',
    status: 'Accepted',
    created_at: 'Yesterday',
    response_note: 'Looking forward to it! Please have 1 problem you recently struggled with ready to whiteboard.'
  },
  {
    id: 'req-2',
    mentor_id: 'mentor-2',
    mentor_name: 'Tanvi Kulkarni',
    topic: 'Barclays Campus Round Tips & Resume Roast',
    description: 'Could you review my resume project descriptions to verify if they match Barclays tech stack expectations?',
    preferred_format: 'Async Q&A via Chat',
    preferred_time: 'Flexible',
    student_name: 'Bhumit Gupta',
    status: 'Pending',
    created_at: 'Today, 8:30 AM',
    response_note: undefined
  }
];

export const INITIAL_CHALLENGES: ConnectChallenge[] = [
  {
    id: 'ch-7day-dsa',
    title: '7-Day Graph & Tree Marathon',
    tagline: 'Conquer the most feared campus placement interview patterns',
    description: 'A structured daily sprint designed to build muscle memory for BFS, DFS, Cycle Detection, Topological Sort, and Tree DP.',
    duration_days: 7,
    category: 'DSA & Coding',
    difficulty: 'Intermediate',
    reward_badge: 'Graph Gladiator',
    participants_count: 184,
    is_joined: true,
    tasks: [
      { id: 't1', day: 1, title: 'Breadth First Search (BFS) & Shortest Path in Grid', description: 'Solve LeetCode #200 (Number of Islands) and #1091 (Shortest Path in Binary Matrix).', is_completed: true, resource_hint: 'Queue-based level order traversal' },
      { id: 't2', day: 2, title: 'Depth First Search (DFS) & Connected Components', description: 'Solve LeetCode #547 (Number of Provinces) and #130 (Surrounded Regions).', is_completed: true, resource_hint: 'Recursive DFS with visited matrix' },
      { id: 't3', day: 3, title: 'Cycle Detection in Directed & Undirected Graphs', description: "Implement cycle detection using Kahn's Algorithm and DFS recursion stack.", is_completed: true, resource_hint: 'Indegree array vs in-stack boolean tracking' },
      { id: 't4', day: 4, title: 'Topological Sorting & Course Schedule', description: 'Solve LeetCode #207 (Course Schedule I) and #210 (Course Schedule II).', is_completed: false, resource_hint: "Kahn's BFS queue or DFS post-order stack" },
      { id: 't5', day: 5, title: "Dijkstra's Algorithm & Minimum Spanning Tree", description: 'Solve LeetCode #743 (Network Delay Time) and #1584 (Min Cost to Connect Points).', is_completed: false, resource_hint: 'Min-heap priority queue' },
      { id: 't6', day: 6, title: 'Lowest Common Ancestor (LCA) in Binary Trees', description: 'Solve LeetCode #236 (LCA of Binary Tree) and #124 (Binary Tree Maximum Path Sum).', is_completed: false, resource_hint: 'Bottom-up recursive return' },
      { id: 't7', day: 7, title: 'Trie Data Structure & Autocomplete Search', description: 'Implement prefix tree for LeetCode #208 (Implement Trie) and #211 (Word Search II).', is_completed: false, resource_hint: '26-child node array structure' }
    ],
    completed_tasks_count: 3,
    percent_complete: 43
  },
  {
    id: 'ch-sql-week',
    title: 'SQL & DBMS Mastery Week',
    tagline: 'Zero-to-Hero on Window Functions, Indexing & ACID',
    description: 'The top reason students get eliminated in preliminary rounds is basic SQL blunders. Master RANK(), DENSE_RANK(), CTEs, and Group By nuances.',
    duration_days: 5,
    category: 'Database & SQL',
    difficulty: 'Beginner',
    reward_badge: 'SQL Specialist',
    participants_count: 142,
    is_joined: false,
    tasks: [
      { id: 'st1', day: 1, title: 'Joins Deep Dive: Inner vs Left vs Cross vs Anti-Join', description: 'Write queries handling NULL values and join condition pitfalls.', is_completed: false },
      { id: 'st2', day: 2, title: 'Aggregation, Group By, Having & Subqueries', description: 'Solve Nth highest salary using correlated subqueries and CTE.', is_completed: false },
      { id: 'st3', day: 3, title: 'Window Functions: ROW_NUMBER, RANK, DENSE_RANK, LAG/LEAD', description: 'Solve LeetCode SQL 50 window function challenges.', is_completed: false },
      { id: 'st4', day: 4, title: 'B-Trees, Composite Indexing, and Query Optimization', description: 'Explain EXPLAIN ANALYZE output and index selectivity.', is_completed: false },
      { id: 'st5', day: 5, title: 'Transactions, Isolation Levels & Deadlocks', description: 'Review Dirty Read, Non-Repeatable Read, Phantom Read scenarios.', is_completed: false }
    ],
    completed_tasks_count: 0,
    percent_complete: 0
  },
  {
    id: 'ch-mock-interview',
    title: 'AI & Peer Mock Interview Sprint',
    tagline: 'Simulate real high-stakes campus interview pressure',
    description: 'Complete 3 realistic interview rounds: AI Tech Screening, Peer Behavioral, and System Architecture review.',
    duration_days: 3,
    category: 'Interview Prep',
    difficulty: 'Advanced',
    reward_badge: 'Interview Ace',
    participants_count: 98,
    is_joined: true,
    tasks: [
      { id: 'mt1', day: 1, title: 'Complete 1 In-Platform AI Interview in Tech Studio', description: 'Score 80%+ on Technical & Behavioral evaluation in Interview Studio.', is_completed: true, resource_hint: 'Use Interview Studio with Sarah/Alex' },
      { id: 'mt2', day: 2, title: 'STAR Method Behavioral Answers Preparation', description: 'Draft 5 STAR stories: Conflict Resolution, Tight Deadline, Technical Failure, Leadership, Project Pivot.', is_completed: true, resource_hint: 'Situation, Task, Action, Result framework' },
      { id: 'mt3', day: 3, title: '1-on-1 Peer Technical Mock Session', description: 'Conduct a 45-minute peer interview with a classmate or senior mentor.', is_completed: false, resource_hint: 'Trade roles after 20 minutes' }
    ],
    completed_tasks_count: 2,
    percent_complete: 66
  }
];

export const INITIAL_SHARED_GOALS: ConnectSharedGoal[] = [
  {
    id: 'goal-1',
    title: 'Solve 10 LeetCode Medium Problems',
    target_count: 10,
    current_count: 7,
    category: 'DSA',
    is_completed: false,
    week_label: 'Week 42 • Current'
  },
  {
    id: 'goal-2',
    title: 'Revise Operating Systems & Memory Paging',
    target_count: 1,
    current_count: 1,
    category: 'Core CS',
    is_completed: true,
    week_label: 'Week 42 • Current'
  },
  {
    id: 'goal-3',
    title: 'Complete 1 AI Mock Interview Session',
    target_count: 1,
    current_count: 1,
    category: 'Interview',
    is_completed: true,
    week_label: 'Week 42 • Current'
  },
  {
    id: 'goal-4',
    title: 'Review 2 Peer GitHub Repositories',
    target_count: 2,
    current_count: 1,
    category: 'Collaboration',
    is_completed: false,
    week_label: 'Week 42 • Current'
  }
];

export const INITIAL_BADGES: ConnectBadge[] = [
  {
    id: 'badge-1',
    name: 'Graph Gladiator',
    category: 'Challenge Achievement',
    description: 'Completed 3+ tasks in the 7-Day Graph & Tree Marathon.',
    unlocked: true,
    earned_date: 'Yesterday'
  },
  {
    id: 'badge-2',
    name: 'Helpful Community Member',
    category: 'Peer Contribution',
    description: 'Shared a verified answer accepted by a classmate in Q&A.',
    unlocked: true,
    earned_date: '3 days ago'
  },
  {
    id: 'badge-3',
    name: 'Consistent Learner (7-Day Streak)',
    category: 'Discipline',
    description: 'Logged into Student Connect and completed daily preparation 7 days in a row.',
    unlocked: true,
    earned_date: 'Today'
  },
  {
    id: 'badge-4',
    name: 'SQL Specialist',
    category: 'Challenge Achievement',
    description: 'Complete all 5 days of SQL & DBMS Mastery Week.',
    unlocked: false,
    earned_date: undefined
  }
];
