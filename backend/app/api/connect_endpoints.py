import datetime
import uuid
from typing import List, Optional, Dict, Any
from fastapi import APIRouter, HTTPException, Query, status
from pydantic import BaseModel, Field

router = APIRouter(prefix="/connect", tags=["Student Connect"])

# ---------------------------------------------------------------------------
# Pydantic Schemas
# ---------------------------------------------------------------------------

class MotivationCard(BaseModel):
    id: str
    quote: str
    author: str
    message: str
    action_today: str
    date: str
    category: str

class CommentModel(BaseModel):
    id: str
    author_id: str
    author_name: str
    author_avatar: Optional[str] = None
    author_role: str
    content: str
    created_at: str
    upvotes: int = 0
    is_accepted: bool = False
    is_mentor_reply: bool = False

class PostCreate(BaseModel):
    title: str
    content: str
    post_type: str = "discussion" # discussion | question | resource | milestone | announcement
    topic_tags: List[str] = Field(default_factory=list)
    group_id: Optional[str] = None
    group_name: Optional[str] = None
    resource_url: Optional[str] = None
    author_name: Optional[str] = "Bhumit Gupta"
    author_role: Optional[str] = "BE Computer '25"
    author_avatar: Optional[str] = None

class PostModel(BaseModel):
    id: str
    title: str
    content: str
    post_type: str # discussion | question | resource | milestone | announcement
    topic_tags: List[str]
    group_id: Optional[str] = None
    group_name: Optional[str] = None
    resource_url: Optional[str] = None
    author_id: str
    author_name: str
    author_avatar: Optional[str] = None
    author_role: str
    created_at: str
    likes_count: int = 0
    liked_by_user: bool = False
    comments_count: int = 0
    comments: List[CommentModel] = Field(default_factory=list)
    has_accepted_answer: bool = False
    is_pinned: bool = False
    is_saved: bool = False

class GroupModel(BaseModel):
    id: str
    name: str
    description: str
    category: str # Career Paths | DSA & Coding | Web Dev | AI / ML | Aptitude | Company Specific | Projects
    tags: List[str]
    banner_gradient: str
    icon_name: str
    member_count: int
    active_today_count: int
    is_joined: bool = False
    pinned_announcement: Optional[str] = None
    rules: List[str] = Field(default_factory=list)

class GroupCreate(BaseModel):
    name: str
    description: str
    category: str
    tags: List[str] = Field(default_factory=list)

class MentorModel(BaseModel):
    id: str
    name: str
    avatar: Optional[str] = None
    role: str
    company: str
    college_batch: str
    areas_of_expertise: List[str]
    career_path: str
    topics: List[str]
    availability_status: str
    is_verified: bool = True
    rating: float = 4.9
    sessions_completed: int = 18
    bio: str

class MentorshipRequestCreate(BaseModel):
    mentor_id: str
    mentor_name: str
    topic: str
    description: str
    preferred_format: str # Async Q&A | 1-on-1 Video | Code/Resume Review
    preferred_time: Optional[str] = None
    student_name: Optional[str] = "Bhumit Gupta"
    student_email: Optional[str] = "bhumit.gupta@dypcoe.edu"

class MentorshipRequestModel(BaseModel):
    id: str
    mentor_id: str
    mentor_name: str
    topic: str
    description: str
    preferred_format: str
    preferred_time: Optional[str] = None
    student_name: str
    status: str # Pending | Accepted | Declined | Completed
    created_at: str
    response_note: Optional[str] = None

class ChallengeTask(BaseModel):
    id: str
    day: int
    title: str
    description: str
    is_completed: bool = False
    resource_hint: Optional[str] = None

class ChallengeModel(BaseModel):
    id: str
    title: str
    tagline: str
    description: str
    duration_days: int
    category: str
    difficulty: str # Beginner | Intermediate | Advanced
    reward_badge: str
    participants_count: int
    is_joined: bool = False
    tasks: List[ChallengeTask]
    completed_tasks_count: int = 0
    percent_complete: int = 0

class SharedGoalModel(BaseModel):
    id: str
    title: str
    target_count: int
    current_count: int
    category: str
    is_completed: bool = False
    week_label: str

# ---------------------------------------------------------------------------
# In-Memory / Realistic Seed Store with Persistent Mutation
# ---------------------------------------------------------------------------

_DAILY_MOTIVATION = MotivationCard(
    id="mot-today",
    quote="Progress comes from showing up consistently, even when the results are not immediate.",
    author="James Clear • Atomic Habits",
    message="Placement preparation is a marathon of compound learning. 30 focused minutes every single day outperforms 10 hours of panic before the drive.",
    action_today="Spend 30 minutes solving one DSA pattern you find challenging or polishing one project bullet point.",
    date=datetime.date.today().isoformat(),
    category="Consistency & Discipline"
)

_GROUPS: List[GroupModel] = [
    GroupModel(
        id="grp-dsa-mastery",
        name="DSA & Problem Solving Circle",
        description="Daily LeetCode discussions, graph algorithms, dynamic programming breakdowns, and peer code reviews for campus placements.",
        category="DSA & Coding",
        tags=["LeetCode", "Dynamic Programming", "Graphs", "Trees", "C++", "Java"],
        banner_gradient="from-indigo-600 to-blue-700",
        icon_name="Code2",
        member_count=342,
        active_today_count=48,
        is_joined=True,
        pinned_announcement="📌 7-Day Graph & Tree Marathon is live! Check the Challenges tab to join and track your checklist.",
        rules=[
            "Always include problem link and your thought process before asking for code.",
            "Format code blocks clearly and state time/space complexity.",
            "Be constructive and supportive to peers at all skill levels."
        ]
    ),
    GroupModel(
        id="grp-fullstack-devs",
        name="Full-Stack Developers & Builders",
        description="Share React, Node.js, FastAPI, Next.js projects, get architecture feedback, and find hackathon teammates.",
        category="Web Dev",
        tags=["React", "Node.js", "FastAPI", "PostgreSQL", "Tailwind", "Next.js"],
        banner_gradient="from-emerald-600 to-teal-700",
        icon_name="Layers",
        member_count=285,
        active_today_count=39,
        is_joined=True,
        pinned_announcement="🚀 Showcase your portfolio projects here to receive genuine peer feedback and resume bullet tips.",
        rules=[
            "No spam or self-promotion without technical value.",
            "Include live demo and GitHub repository link for project reviews.",
            "Share constructive feedback on at least one peer project when posting your own."
        ]
    ),
    GroupModel(
        id="grp-aiml-learners",
        name="AI & Machine Learning Hub",
        description="Computer Vision, NLP, LLM prompt engineering, RAG pipelines, and deploying deep learning models on cloud.",
        category="AI / ML",
        tags=["PyTorch", "HuggingFace", "RAG", "LLMs", "Scikit-Learn", "FastAPI"],
        banner_gradient="from-purple-600 to-pink-600",
        icon_name="BrainCircuit",
        member_count=210,
        active_today_count=31,
        is_joined=False,
        pinned_announcement="💡 Discussing production RAG architectures for campus recruitment showcase projects.",
        rules=["Explain ML intuition before dropping complex math.", "Credit all open-source models and datasets used."]
    ),
    GroupModel(
        id="grp-tcs-ninja-digital",
        name="TCS Digital & Prime Preparation",
        description="Previous year coding questions, advanced quantitative aptitude, verbal practice, and interview debriefs for TCS drives.",
        category="Company Specific",
        tags=["TCS Digital", "TCS Prime", "Advanced Quant", "Coding Rounds", "NQT"],
        banner_gradient="from-amber-600 to-orange-700",
        icon_name="Building2",
        member_count=418,
        active_today_count=64,
        is_joined=False,
        pinned_announcement="📑 Consolidated archive of previous year TCS Digital technical round questions uploaded to Resources.",
        rules=["Do not share copyrighted exam content during active test windows.", "Focus on conceptual clarity."]
    ),
    GroupModel(
        id="grp-internship-hunters",
        name="Internship Hunters 2026/2027",
        description="Off-campus openings, cold email strategies, resume tailoring, and interview experience sharing for pre-final years.",
        category="Career Paths",
        tags=["Off-Campus", "Cold Email", "Referrals", "Resume Review", "Summer Internships"],
        banner_gradient="from-cyan-600 to-blue-600",
        icon_name="Briefcase",
        member_count=390,
        active_today_count=52,
        is_joined=True,
        pinned_announcement="📢 Referral request template and cold emailing playbook pinned in the discussions.",
        rules=["Share verified application links only.", "Respect mentor and alumni time."]
    ),
    GroupModel(
        id="grp-aptitude-crushers",
        name="Aptitude & Core CS Sprint",
        description="Operating Systems, DBMS, Computer Networks, OOP concepts, and fast quantitative mental math tricks for preliminary rounds.",
        category="Aptitude",
        tags=["OS", "DBMS", "Computer Networks", "Quantitative Aptitude", "Logical Reasoning"],
        banner_gradient="from-rose-600 to-red-700",
        icon_name="Sparkles",
        member_count=260,
        active_today_count=35,
        is_joined=False,
        pinned_announcement="🧠 Weekly 15-question speed quiz posted every Wednesday at 7 PM.",
        rules=["State the reasoning steps clearly with your answers."]
    )
]

_POSTS: List[PostModel] = [
    PostModel(
        id="post-1",
        title="How to structure a clean RAG or Full-Stack project so recruiters notice it in 10 seconds?",
        content="I noticed recruiters spend less than 15-20 seconds on resume project bullets. In my recent interviews, what actually impressed them was:\n1. A clear live URL (Vercel/Render) right next to the title.\n2. 2-line visual architecture diagram in the GitHub README.\n3. Measurable metrics (e.g. 'reduced latency by 42% using Redis caching', 'handles 50 concurrent requests').\n\nWhat other specific aspects do senior interviewers look for in project codebases?",
        post_type="discussion",
        topic_tags=["Projects", "Resume Tips", "System Design", "Recruiter Advice"],
        group_id="grp-fullstack-devs",
        group_name="Full-Stack Developers & Builders",
        author_id="usr-tanvi",
        author_name="Tanvi Kulkarni",
        author_role="BE Computer '24 • Placed at Barclays",
        created_at="2 hours ago",
        likes_count=28,
        liked_by_user=True,
        comments_count=4,
        has_accepted_answer=True,
        is_pinned=True,
        is_saved=True,
        comments=[
            CommentModel(
                id="comm-1",
                author_id="usr-rahul",
                author_name="Rahul Sharma",
                author_role="Alumni '23 • Software Engineer at Microsoft",
                content="Spot on Tanvi! As an interviewer, the #1 red flag is a project that looks copied from a YouTube tutorial without any custom test cases or deployment. Having a CI/CD GitHub Actions workflow file that runs automated tests instantly puts you in the top 5% of freshers.",
                created_at="1 hour ago",
                upvotes=19,
                is_accepted=True,
                is_mentor_reply=True
            ),
            CommentModel(
                id="comm-2",
                author_id="usr-bhumit",
                author_name="Bhumit Gupta",
                author_role="BE Computer '25",
                content="This is super helpful. I'm adding automated unit tests and Docker Compose to my FastAPI project right now.",
                created_at="45 mins ago",
                upvotes=4,
                is_accepted=False,
                is_mentor_reply=False
            )
        ]
    ),
    PostModel(
        id="post-2",
        title="[Solved] How should a 3rd year student start dynamic programming without feeling overwhelmed?",
        content="I find recursion intuitive, but as soon as DP memoization and tabulation come up (especially 2D grid DP and Knapsack variations), I get stuck on state transitions. What is the exact step-by-step ladder you used to master DP?",
        post_type="question",
        topic_tags=["DSA", "Dynamic Programming", "LeetCode", "Interview Prep"],
        group_id="grp-dsa-mastery",
        group_name="DSA & Problem Solving Circle",
        author_id="usr-aarav",
        author_name="Aarav Joshi",
        author_role="TE Information Technology '26",
        created_at="4 hours ago",
        likes_count=19,
        liked_by_user=False,
        comments_count=3,
        has_accepted_answer=True,
        is_pinned=False,
        is_saved=False,
        comments=[
            CommentModel(
                id="comm-201",
                author_id="usr-priya",
                author_name="Priya Nair",
                author_role="BE Computer '25 • 600+ LeetCode",
                content="Follow this exact 3-step formula:\n1. Solve the pure recursive solution with base cases first.\n2. Identify changing parameters (e.g. index, remaining capacity). That tells you whether it's 1D or 2D DP.\n3. Add a cache array/hashmap to save subproblem results.\nStart with: Fibonacci -> Climbing Stairs -> House Robber -> 0/1 Knapsack -> Longest Common Subsequence. Do not touch DP on Trees or Bitmask until you master these 5.",
                created_at="3 hours ago",
                upvotes=23,
                is_accepted=True,
                is_mentor_reply=False
            )
        ]
    ),
    PostModel(
        id="post-3",
        title="🎉 Milestone Unlocked: Cleared Barclays Technical Assessment & Completed 7-Day Graph Sprint!",
        content="Huge thank you to the DSA Practice Circle! Just received confirmation for the Barclays Round 2 technical interview. Spending 1 hour each day following the structured sprint made a massive difference in handling graph traversal questions under pressure. Keep pushing everyone!",
        post_type="milestone",
        topic_tags=["Milestone", "Barclays", "Interview Cleared", "Celebration"],
        group_id="grp-dsa-mastery",
        group_name="DSA & Problem Solving Circle",
        author_id="usr-sneha",
        author_name="Sneha Patil",
        author_role="BE Information Technology '25",
        created_at="6 hours ago",
        likes_count=54,
        liked_by_user=True,
        comments_count=6,
        has_accepted_answer=False,
        is_pinned=False,
        is_saved=False,
        comments=[
            CommentModel(
                id="comm-301",
                author_id="usr-bhumit",
                author_name="Bhumit Gupta",
                author_role="BE Computer '25",
                content="Congratulations Sneha! You've been super consistent on the leaderboard. Go crush the interview! 🚀",
                created_at="5 hours ago",
                upvotes=5,
                is_accepted=False,
                is_mentor_reply=False
            )
        ]
    ),
    PostModel(
        id="post-4",
        title="Handcrafted Operating Systems & DBMS 25-Page Cheat Sheet for Campus Technical Rounds",
        content="Compiled all high-frequency topics asked in preliminary interview rounds: Process vs Thread, Deadlocks & Bankers Algorithm, Virtual Memory & Paging, ACID properties, B+ Tree indexing, and SQL Normalization. No fluff, pure revision bullet points with diagrams.",
        post_type="resource",
        topic_tags=["Operating Systems", "DBMS", "Core CS", "Interview Cheat Sheet"],
        group_id="grp-aptitude-crushers",
        group_name="Aptitude & Core CS Sprint",
        resource_url="https://github.com/dypcoe-placement/core-cs-revision-notes",
        author_id="usr-vikram",
        author_name="Vikram Deshmukh",
        author_role="BE Computer '24 • Placed at Veritas",
        created_at="Yesterday",
        likes_count=87,
        liked_by_user=False,
        comments_count=8,
        has_accepted_answer=False,
        is_pinned=True,
        is_saved=True,
        comments=[]
    )
]

_MENTORS: List[MentorModel] = [
    MentorModel(
        id="mentor-1",
        name="Rahul Sharma",
        role="Software Engineer II",
        company="Microsoft",
        college_batch="DYPCOE '21 Computer Engineering",
        areas_of_expertise=["Distributed Systems", "Data Structures & Algorithms", "System Design", "Off-Campus Mentoring"],
        career_path="Software Development",
        topics=["Resume Review", "Mock Technical Interview", "Off-Campus Strategy", "System Design Basics"],
        availability_status="Available this week • 3 slots open",
        is_verified=True,
        rating=4.95,
        sessions_completed=34,
        bio="Senior SWE at Microsoft Azure Core. Passionate about helping DYP students break into tier-1 product companies without paid bootcamps."
    ),
    MentorModel(
        id="mentor-2",
        name="Tanvi Kulkarni",
        role="Technology Analyst",
        company="Barclays",
        college_batch="DYPCOE '24 Computer Engineering",
        areas_of_expertise=["FinTech Architectures", "Spring Boot", "Microservices", "Campus Drive Prep"],
        career_path="Software Development",
        topics=["Barclays Campus Round Tips", "Java & Spring Boot Deep Dive", "Resume Roast", "HR Round Confidence"],
        availability_status="Weekends • 2 slots open",
        is_verified=True,
        rating=4.9,
        sessions_completed=22,
        bio="Recently navigated the on-campus recruitment cycle at DYPCOE. I can share the exact interview stages, coding level, and behavioral questions asked at Barclays."
    ),
    MentorModel(
        id="mentor-3",
        name="Aditya Verma",
        role="Machine Learning Engineer",
        company="NVIDIA",
        college_batch="DYPCOE '22 Electronics & Telecomm",
        areas_of_expertise=["Deep Learning", "TensorRT", "CUDA", "PyTorch", "Transitioning from ENTC to Tech"],
        career_path="AI & Data Science",
        topics=["AI Project Review", "Transition from Non-CS to AI", "NVIDIA & Qualcomm Hiring Process", "Math for ML"],
        availability_status="Available Thursday & Saturday",
        is_verified=True,
        rating=4.98,
        sessions_completed=41,
        bio="ENTC graduate who successfully pivoted to GPU-accelerated computing at NVIDIA. Happy to guide non-CS branch students aiming for high-package tech roles."
    ),
    MentorModel(
        id="mentor-4",
        name="Pooja Mehta",
        role="Cloud Infrastructure Engineer",
        company="Veritas Technologies",
        college_batch="DYPCOE '23 Information Technology",
        areas_of_expertise=["AWS & Kubernetes", "Linux Systems", "Storage & File Systems", "DevOps Pipelines"],
        career_path="Cloud & DevOps",
        topics=["Core OS & Linux Preparation", "Cloud Certification Path", "Resume Tailoring for Systems Roles", "Veritas Interview Prep"],
        availability_status="Available Friday evening",
        is_verified=True,
        rating=4.88,
        sessions_completed=19,
        bio="Working on enterprise scale data protection and cloud storage. Helping students master Linux internals and systems programming for tier-1 infrastructure firms."
    ),
    MentorModel(
        id="mentor-5",
        name="Karan Malhotra",
        role="Software Development Engineer",
        company="Amazon",
        college_batch="DYPCOE '22 Computer Engineering",
        areas_of_expertise=["High Scalability", "Java Backend", "Leadership Principles", "DSA Problem Solving"],
        career_path="Software Development",
        topics=["Amazon Leadership Principles & Behavioral", "Hard DSA Patterns", "Mock Coding Interview", "Offer Negotiation"],
        availability_status="Busy this week • Next slots open Monday",
        is_verified=True,
        rating=5.0,
        sessions_completed=58,
        bio="SDE-1 at Amazon. Mentored 40+ college juniors on breaking down complex behavioral scenarios and cracking tough algorithmic rounds."
    )
]

_MENTORSHIP_REQUESTS: List[MentorshipRequestModel] = [
    MentorshipRequestModel(
        id="req-1",
        mentor_id="mentor-1",
        mentor_name="Rahul Sharma",
        topic="Mock Technical Interview & DSA Code Review",
        description="I have an upcoming interview with a tier-1 firm in 10 days. I'd love a 30-minute mock session focusing on Graphs and Binary Tree traversals.",
        preferred_format="1-on-1 Video Session",
        preferred_time="Saturday 4:00 PM IST",
        student_name="Bhumit Gupta",
        status="Accepted",
        created_at="Yesterday",
        response_note="Looking forward to it! Please have 1 problem you recently struggled with ready to whiteboard."
    ),
    MentorshipRequestModel(
        id="req-2",
        mentor_id="mentor-2",
        mentor_name="Tanvi Kulkarni",
        topic="Barclays Campus Round Tips & Resume Roast",
        description="Could you review my resume project descriptions to verify if they match Barclays tech stack expectations?",
        preferred_format="Async Q&A via Chat",
        preferred_time="Flexible",
        student_name="Bhumit Gupta",
        status="Pending",
        created_at="Today, 8:30 AM",
        response_note=None
    )
]

_CHALLENGES: List[ChallengeModel] = [
    ChallengeModel(
        id="ch-7day-dsa",
        title="7-Day Graph & Tree Marathon",
        tagline="Conquer the most feared campus placement interview patterns",
        description="A structured daily sprint designed to build muscle memory for BFS, DFS, Cycle Detection, Topological Sort, and Tree DP.",
        duration_days=7,
        category="DSA & Coding",
        difficulty="Intermediate",
        reward_badge="Graph Gladiator",
        participants_count=184,
        is_joined=True,
        tasks=[
            ChallengeTask(id="t1", day=1, title="Breadth First Search (BFS) & Shortest Path in Unweighted Grid", description="Solve LeetCode #200 (Number of Islands) and #1091 (Shortest Path in Binary Matrix).", is_completed=True, resource_hint="Queue-based level order traversal"),
            ChallengeTask(id="t2", day=2, title="Depth First Search (DFS) & Connected Components", description="Solve LeetCode #547 (Number of Provinces) and #130 (Surrounded Regions).", is_completed=True, resource_hint="Recursive DFS with visited matrix"),
            ChallengeTask(id="t3", day=3, title="Cycle Detection in Directed & Undirected Graphs", description="Implement Cycle detection using Kahn's Algorithm and DFS recursion stack.", is_completed=True, resource_hint="Indegree array vs in-stack boolean tracking"),
            ChallengeTask(id="t4", day=4, title="Topological Sorting & Course Schedule", description="Solve LeetCode #207 (Course Schedule I) and #210 (Course Schedule II).", is_completed=False, resource_hint="Kahn's BFS queue or DFS post-order stack"),
            ChallengeTask(id="t5", day=5, title="Dijkstra's Algorithm & Minimum Spanning Tree", description="Solve LeetCode #743 (Network Delay Time) and #1584 (Min Cost to Connect Points).", is_completed=False, resource_hint="Min-heap priority queue"),
            ChallengeTask(id="t6", day=6, title="Lowest Common Ancestor (LCA) in Binary Trees", description="Solve LeetCode #236 (LCA of Binary Tree) and #124 (Binary Tree Maximum Path Sum).", is_completed=False, resource_hint="Bottom-up recursive return"),
            ChallengeTask(id="t7", day=7, title="Trie Data Structure & Autocomplete Search", description="Implement prefix tree for LeetCode #208 (Implement Trie) and #211 (Word Search II).", is_completed=False, resource_hint="26-child node array structure")
        ],
        completed_tasks_count=3,
        percent_complete=43
    ),
    ChallengeModel(
        id="ch-sql-week",
        title="SQL & DBMS Mastery Week",
        tagline="Zero-to-Hero on Window Functions, Indexing & ACID",
        description="The top reason students get eliminated in preliminary rounds is basic SQL blunders. Master RANK(), DENSE_RANK(), CTEs, and Group By nuances.",
        duration_days=5,
        category="Database & SQL",
        difficulty="Beginner to Intermediate",
        reward_badge="SQL Specialist",
        participants_count=142,
        is_joined=False,
        tasks=[
            ChallengeTask(id="st1", day=1, title="Joins Deep Dive: Inner vs Left vs Cross vs Anti-Join", description="Write queries handling NULL values and join condition pitfalls.", is_completed=False),
            ChallengeTask(id="st2", day=2, title="Aggregation, Group By, Having & Subqueries", description="Solve Nth highest salary using correlated subqueries and CTE.", is_completed=False),
            ChallengeTask(id="st3", day=3, title="Window Functions: ROW_NUMBER, RANK, DENSE_RANK, LAG/LEAD", description="Solve LeetCode SQL 50 window function challenges.", is_completed=False),
            ChallengeTask(id="st4", day=4, title="B-Trees, Composite Indexing, and Query Optimization", description="Explain EXPLAIN ANALYZE output and index selectivity.", is_completed=False),
            ChallengeTask(id="st5", day=5, title="Transactions, Isolation Levels & Deadlocks", description="Read Dirty Read, Non-Repeatable Read, Phantom Read scenarios.", is_completed=False)
        ],
        completed_tasks_count=0,
        percent_complete=0
    ),
    ChallengeModel(
        id="ch-mock-interview",
        title="AI & Peer Mock Interview Sprint",
        tagline="Simulate real high-stakes campus interview pressure",
        description="Complete 3 realistic interview rounds: AI Tech Screening, Peer Behavioral, and System Architecture review.",
        duration_days=3,
        category="Interview Prep",
        difficulty="Advanced",
        reward_badge="Interview Ace",
        participants_count=98,
        is_joined=True,
        tasks=[
            ChallengeTask(id="mt1", day=1, title="Complete 1 In-Platform AI Interview in Tech Studio", description="Score 80%+ on Technical & Behavioral evaluation in Interview Studio.", is_completed=True, resource_hint="Use Interview Studio with Sarah/Alex"),
            ChallengeTask(id="mt2", day=2, title="STAR Method Behavioral Answers Preparation", description="Draft 5 STAR stories: Conflict Resolution, Tight Deadline, Technical Failure, Leadership, Project Pivot.", is_completed=True, resource_hint="Situation, Task, Action, Result framework"),
            ChallengeTask(id="mt3", day=3, title="1-on-1 Peer Technical Mock Session", description="Conduct a 45-minute peer interview with a classmate or senior mentor.", is_completed=False, resource_hint="Trade roles after 20 minutes")
        ],
        completed_tasks_count=2,
        percent_complete=66
    )
]

_SHARED_GOALS: List[SharedGoalModel] = [
    SharedGoalModel(
        id="goal-1",
        title="Solve 10 LeetCode Medium Problems",
        target_count=10,
        current_count=7,
        category="DSA",
        is_completed=False,
        week_label="Week 42 • Current"
    ),
    SharedGoalModel(
        id="goal-2",
        title="Revise Operating Systems & Memory Paging",
        target_count=1,
        current_count=1,
        category="Core CS",
        is_completed=True,
        week_label="Week 42 • Current"
    ),
    SharedGoalModel(
        id="goal-3",
        title="Complete 1 AI Mock Interview Session",
        target_count=1,
        current_count=1,
        category="Interview",
        is_completed=True,
        week_label="Week 42 • Current"
    ),
    SharedGoalModel(
        id="goal-4",
        title="Review 2 Peer GitHub Repositories",
        target_count=2,
        current_count=1,
        category="Collaboration",
        is_completed=False,
        week_label="Week 42 • Current"
    )
]

_SAVED_MOTIVATION_QUOTES: List[MotivationCard] = [
    _DAILY_MOTIVATION,
    MotivationCard(
        id="mot-saved-1",
        quote="Discipline is choosing between what you want now and what you want most.",
        author="Abraham Lincoln",
        message="Keep that goal of clearing your dream placement round front and center when distractions appear.",
        action_today="Block off 1 uninterrupted hour today for placement preparation with phone on silent.",
        date="2026-10-15",
        category="Discipline"
    ),
    MotivationCard(
        id="mot-saved-2",
        quote="You don't have to be great to start, but you have to start to be great.",
        author="Zig Ziglar",
        message="Don't wait until you've revised everything to begin solving questions. Start today.",
        action_today="Attempt 2 new problems without looking at the solutions first.",
        date="2026-10-12",
        category="Initiative"
    )
]

# ---------------------------------------------------------------------------
# API Endpoints
# ---------------------------------------------------------------------------

@router.get("/motivation", response_model=MotivationCard)
def get_daily_motivation():
    """Returns today's curated motivation card, message, and actionable task."""
    return _DAILY_MOTIVATION

@router.get("/motivation/saved", response_model=List[MotivationCard])
def get_saved_motivations():
    """Returns list of student's saved motivational reminders."""
    return _SAVED_MOTIVATION_QUOTES

@router.post("/motivation/save", response_model=Dict[str, Any])
def toggle_save_motivation(card_id: str = Query(...)):
    """Toggle save status for a motivation reminder."""
    global _SAVED_MOTIVATION_QUOTES
    existing = next((m for m in _SAVED_MOTIVATION_QUOTES if m.id == card_id), None)
    if existing:
        _SAVED_MOTIVATION_QUOTES = [m for m in _SAVED_MOTIVATION_QUOTES if m.id != card_id]
        return {"status": "removed", "saved": False, "count": len(_SAVED_MOTIVATION_QUOTES)}
    else:
        _SAVED_MOTIVATION_QUOTES.append(_DAILY_MOTIVATION)
        return {"status": "saved", "saved": True, "count": len(_SAVED_MOTIVATION_QUOTES)}

# ---------------------------------------------------------------------------
# Posts & Feed
# ---------------------------------------------------------------------------

@router.get("/posts", response_model=List[PostModel])
def get_posts(
    post_type: Optional[str] = Query(None, description="Filter: all | question | resource | milestone | discussion"),
    group_id: Optional[str] = Query(None, description="Filter by group ID"),
    search: Optional[str] = Query(None, description="Search query")
):
    """Retrieve community activity feed with optional filtering and search."""
    results = _POSTS.copy()

    if group_id and group_id != "all":
        results = [p for p in results if p.group_id == group_id]

    if post_type and post_type != "all":
        results = [p for p in results if p.post_type == post_type]

    if search:
        q = search.lower().strip()
        results = [
            p for p in results
            if q in p.title.lower() or q in p.content.lower() or any(q in t.lower() for t in p.topic_tags)
        ]

    # Return with pinned posts on top
    results.sort(key=lambda x: (not x.is_pinned))
    return results

@router.post("/posts", response_model=PostModel, status_code=status.HTTP_201_CREATED)
def create_post(payload: PostCreate):
    """Publish a new question, project resource, discussion, or milestone to Student Connect."""
    new_id = f"post-{uuid.uuid4().hex[:8]}"
    post = PostModel(
        id=new_id,
        title=payload.title,
        content=payload.content,
        post_type=payload.post_type,
        topic_tags=payload.topic_tags or ["Community"],
        group_id=payload.group_id,
        group_name=payload.group_name,
        resource_url=payload.resource_url,
        author_id="usr-bhumit",
        author_name=payload.author_name or "Bhumit Gupta",
        author_avatar=payload.author_avatar,
        author_role=payload.author_role or "BE Computer '25",
        created_at="Just now",
        likes_count=1,
        liked_by_user=True,
        comments_count=0,
        comments=[],
        has_accepted_answer=False,
        is_pinned=False,
        is_saved=False
    )
    _POSTS.insert(0, post)
    return post

@router.post("/posts/{post_id}/react")
def toggle_post_reaction(post_id: str):
    """Toggle like / reaction on a post."""
    for post in _POSTS:
        if post.id == post_id:
            if post.liked_by_user:
                post.liked_by_user = False
                post.likes_count = max(0, post.likes_count - 1)
            else:
                post.liked_by_user = True
                post.likes_count += 1
            return {"post_id": post_id, "liked": post.liked_by_user, "likes_count": post.likes_count}
    raise HTTPException(status_code=404, detail="Post not found")

@router.post("/posts/{post_id}/save")
def toggle_save_post(post_id: str):
    """Toggle bookmark on a post."""
    for post in _POSTS:
        if post.id == post_id:
            post.is_saved = not post.is_saved
            return {"post_id": post_id, "is_saved": post.is_saved}
    raise HTTPException(status_code=404, detail="Post not found")

@router.post("/posts/{post_id}/comments", response_model=CommentModel)
def add_comment(post_id: str, content: str = Query(...)):
    """Add a helpful reply or comment to a discussion/question."""
    for post in _POSTS:
        if post.id == post_id:
            comment = CommentModel(
                id=f"comm-{uuid.uuid4().hex[:6]}",
                author_id="usr-bhumit",
                author_name="Bhumit Gupta",
                author_avatar=None,
                author_role="BE Computer '25",
                content=content,
                created_at="Just now",
                upvotes=0,
                is_accepted=False,
                is_mentor_reply=False
            )
            post.comments.append(comment)
            post.comments_count = len(post.comments)
            return comment
    raise HTTPException(status_code=404, detail="Post not found")

@router.post("/posts/{post_id}/accept-answer/{comment_id}")
def mark_accepted_answer(post_id: str, comment_id: str):
    """Mark an answer as accepted for a student question."""
    for post in _POSTS:
        if post.id == post_id:
            for c in post.comments:
                if c.id == comment_id:
                    c.is_accepted = True
                    post.has_accepted_answer = True
                    return {"status": "success", "accepted_comment_id": comment_id}
    raise HTTPException(status_code=404, detail="Post or comment not found")

@router.post("/posts/{post_id}/report")
def report_post(post_id: str, reason: str = Query("Inappropriate content")):
    """Report an inappropriate post for TPO / moderator audit."""
    return {"status": "reported", "post_id": post_id, "message": "Thank you. Our TPO student moderators will review this post within 2 hours."}

# ---------------------------------------------------------------------------
# Communities / Groups
# ---------------------------------------------------------------------------

@router.get("/groups", response_model=List[GroupModel])
def get_groups(category: Optional[str] = Query(None)):
    """List all community groups with optional category filtering."""
    if category and category != "all":
        return [g for g in _GROUPS if g.category.lower() == category.lower()]
    return _GROUPS

@router.get("/groups/{group_id}", response_model=GroupModel)
def get_group_detail(group_id: str):
    """Get group details including pinned announcements and community rules."""
    for g in _GROUPS:
        if g.id == group_id:
            return g
    raise HTTPException(status_code=404, detail="Group not found")

@router.post("/groups", response_model=GroupModel, status_code=status.HTTP_201_CREATED)
def create_group(payload: GroupCreate):
    """Create a new student study or placement circle."""
    new_group = GroupModel(
        id=f"grp-{uuid.uuid4().hex[:6]}",
        name=payload.name,
        description=payload.description,
        category=payload.category,
        tags=payload.tags or ["Student Circle"],
        banner_gradient="from-indigo-700 to-purple-800",
        icon_name="Users",
        member_count=1,
        active_today_count=1,
        is_joined=True,
        pinned_announcement=f"Welcome to {payload.name}! Introduce yourself and share your placement goals.",
        rules=["Be courteous and collaborative.", "Keep discussions focused on placement and learning."]
    )
    _GROUPS.append(new_group)
    return new_group

@router.post("/groups/{group_id}/toggle-join")
def toggle_join_group(group_id: str):
    """Join or leave a community group."""
    for g in _GROUPS:
        if g.id == group_id:
            g.is_joined = not g.is_joined
            g.member_count += 1 if g.is_joined else -1
            return {"group_id": group_id, "is_joined": g.is_joined, "member_count": g.member_count}
    raise HTTPException(status_code=404, detail="Group not found")

# ---------------------------------------------------------------------------
# Senior & Alumni Mentors
# ---------------------------------------------------------------------------

@router.get("/mentors", response_model=List[MentorModel])
def get_mentors(
    career_path: Optional[str] = Query(None),
    company: Optional[str] = Query(None),
    search: Optional[str] = Query(None)
):
    """Search and filter senior and alumni mentors."""
    results = _MENTORS.copy()
    if career_path and career_path != "all":
        results = [m for m in results if career_path.lower() in m.career_path.lower() or any(career_path.lower() in a.lower() for a in m.areas_of_expertise)]
    if company and company != "all":
        results = [m for m in results if company.lower() in m.company.lower()]
    if search:
        q = search.lower().strip()
        results = [
            m for m in results
            if q in m.name.lower() or q in m.company.lower() or q in m.role.lower() or any(q in a.lower() for a in m.areas_of_expertise) or any(q in t.lower() for t in m.topics)
        ]
    return results

@router.post("/mentorship-requests", response_model=MentorshipRequestModel, status_code=status.HTTP_201_CREATED)
def create_mentorship_request(payload: MentorshipRequestCreate):
    """Submit a structured mentorship request to a senior or alumnus."""
    req = MentorshipRequestModel(
        id=f"req-{uuid.uuid4().hex[:6]}",
        mentor_id=payload.mentor_id,
        mentor_name=payload.mentor_name,
        topic=payload.topic,
        description=payload.description,
        preferred_format=payload.preferred_format,
        preferred_time=payload.preferred_time or "This weekend",
        student_name=payload.student_name or "Bhumit Gupta",
        status="Pending",
        created_at="Just now",
        response_note=None
    )
    _MENTORSHIP_REQUESTS.insert(0, req)
    return req

@router.get("/mentorship-requests", response_model=List[MentorshipRequestModel])
def get_my_mentorship_requests():
    """Get the current student's active and historical mentorship requests."""
    return _MENTORSHIP_REQUESTS

@router.post("/mentorship-requests/{request_id}/status")
def update_mentorship_request_status(request_id: str, status_val: str = Query(...)):
    """Simulate or update request state (Pending, Accepted, Declined, Completed)."""
    for req in _MENTORSHIP_REQUESTS:
        if req.id == request_id:
            req.status = status_val
            if status_val == "Accepted":
                req.response_note = "Your mentor has accepted this request. Check your college inbox or chat room for connection details."
            elif status_val == "Declined":
                req.response_note = "Mentor is currently unavailable for this topic. Please feel free to request another mentor."
            return req
    raise HTTPException(status_code=404, detail="Request not found")

# ---------------------------------------------------------------------------
# Challenges & Shared Progress
# ---------------------------------------------------------------------------

@router.get("/challenges", response_model=List[ChallengeModel])
def get_challenges():
    """List all placement prep challenges with student completion progress."""
    return _CHALLENGES

@router.post("/challenges/{challenge_id}/toggle-join")
def toggle_join_challenge(challenge_id: str):
    """Join or leave a community challenge."""
    for ch in _CHALLENGES:
        if ch.id == challenge_id:
            ch.is_joined = not ch.is_joined
            ch.participants_count += 1 if ch.is_joined else -1
            return {"challenge_id": challenge_id, "is_joined": ch.is_joined, "participants_count": ch.participants_count}
    raise HTTPException(status_code=404, detail="Challenge not found")

@router.post("/challenges/{challenge_id}/toggle-task/{task_id}")
def toggle_challenge_task(challenge_id: str, task_id: str):
    """Check or uncheck a task in a challenge sprint."""
    for ch in _CHALLENGES:
        if ch.id == challenge_id:
            for task in ch.tasks:
                if task.id == task_id:
                    task.is_completed = not task.is_completed
                    completed = sum(1 for t in ch.tasks if t.is_completed)
                    ch.completed_tasks_count = completed
                    ch.percent_complete = int((completed / len(ch.tasks)) * 100) if ch.tasks else 0
                    return {
                        "challenge_id": challenge_id,
                        "task_id": task_id,
                        "is_completed": task.is_completed,
                        "percent_complete": ch.percent_complete,
                        "badge_unlocked": ch.percent_complete == 100,
                        "reward_badge": ch.reward_badge if ch.percent_complete == 100 else None
                    }
    raise HTTPException(status_code=404, detail="Challenge or task not found")

@router.get("/shared-goals", response_model=List[SharedGoalModel])
def get_shared_goals():
    """Get active weekly peer goals."""
    return _SHARED_GOALS

@router.post("/shared-goals/{goal_id}/toggle")
def toggle_goal(goal_id: str):
    """Increment or toggle a shared goal."""
    for g in _SHARED_GOALS:
        if g.id == goal_id:
            g.is_completed = not g.is_completed
            if g.is_completed:
                g.current_count = g.target_count
            else:
                g.current_count = max(0, g.target_count - 1)
            return g
    raise HTTPException(status_code=404, detail="Goal not found")

@router.get("/badges")
def get_user_badges():
    """Get student recognition badges earned through genuine community participation."""
    return [
        {
            "id": "badge-1",
            "name": "Graph Gladiator",
            "category": "Challenge Achievement",
            "description": "Completed 3+ tasks in the 7-Day Graph & Tree Marathon.",
            "unlocked": True,
            "earned_date": "Yesterday"
        },
        {
            "id": "badge-2",
            "name": "Helpful Community Member",
            "category": "Peer Contribution",
            "description": "Shared a verified answer accepted by a classmate in Q&A.",
            "unlocked": True,
            "earned_date": "3 days ago"
        },
        {
            "id": "badge-3",
            "name": "Consistent Learner (7-Day Streak)",
            "category": "Discipline",
            "description": "Logged into Student Connect and completed daily preparation 7 days in a row.",
            "unlocked": True,
            "earned_date": "Today"
        },
        {
            "id": "badge-4",
            "name": "SQL Specialist",
            "category": "Challenge Achievement",
            "description": "Complete all 5 days of SQL & DBMS Mastery Week.",
            "unlocked": False,
            "earned_date": None
        }
    ]
