export interface BugChallenge {
  id: string;
  title: string;
  language: 'typescript' | 'python' | 'sql' | 'cpp' | 'react';
  difficulty: 'Junior' | 'Mid' | 'Senior';
  domain: string;
  xpReward: number;
  timeLimitSeconds: number;
  description: string;
  symptom: string;
  buggyCode: string;
  correctCode: string;
  bugLineNumbers: number[]; // 1-indexed lines containing the issue
  options: {
    id: string;
    description: string;
    fixSnippet: string;
    isCorrect: boolean;
    explanation: string;
  }[];
  hints: string[];
  testCases: {
    name: string;
    input: string;
    expected: string;
    actualWhenBuggy: string;
  }[];
  interviewerInsight: string;
}

export const BUG_CHALLENGES: BugChallenge[] = [
  {
    id: 'bug-1',
    title: 'The Stale Closure State Trap',
    language: 'react',
    difficulty: 'Junior',
    domain: 'Frontend React Architecture',
    xpReward: 150,
    timeLimitSeconds: 90,
    description: 'A live placement countdown timer resets improperly or retains a stale count reference when interval fires.',
    symptom: 'The timer gets stuck at "Time Left: 59s" and never decrements past 58s, repeating the same value.',
    buggyCode: `import React, { useState, useEffect } from 'react';

export const PlacementTimer: React.FC = () => {
  const [seconds, setSeconds] = useState(60);

  useEffect(() => {
    const timer = setInterval(() => {
      // BUG: Uses stale closure reference to 'seconds'
      setSeconds(seconds - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []); // Empty dependency array captures initial 'seconds = 60'

  return <div>Time Left: {seconds}s</div>;
};`,
    correctCode: `import React, { useState, useEffect } from 'react';

export const PlacementTimer: React.FC = () => {
  const [seconds, setSeconds] = useState(60);

  useEffect(() => {
    const timer = setInterval(() => {
      // FIX: Functional state update prevents stale closure capture
      setSeconds(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return <div>Time Left: {seconds}s</div>;
};`,
    bugLineNumbers: [9],
    options: [
      {
        id: 'opt-1a',
        description: 'Add `seconds` to the dependency array `[seconds]` without functional update',
        fixSnippet: `}, [seconds]);`,
        isCorrect: false,
        explanation: 'While this updates the state, it causes the interval to be cleared and recreated every second, introducing jitter and timer drift.'
      },
      {
        id: 'opt-1b',
        description: 'Use functional updater `setSeconds(prev => (prev > 0 ? prev - 1 : 0))`',
        fixSnippet: `setSeconds(prev => (prev > 0 ? prev - 1 : 0));`,
        isCorrect: true,
        explanation: 'Functional updater receives the most current state from React runtime, breaking the stale closure trap without timer restarts.'
      },
      {
        id: 'opt-1c',
        description: 'Convert `seconds` to a global variable outside the component',
        fixSnippet: `let globalSeconds = 60;`,
        isCorrect: false,
        explanation: 'Mutating a global variable breaks React reactivity and causes cross-instance pollution across candidate sessions.'
      }
    ],
    hints: [
      'Look at the variable `seconds` inside the `setInterval` callback.',
      'Because the dependency array `[]` is empty, the callback retains the initial value from the first render.',
      'React state setters accept a callback function `(prevState) => nextState`.'
    ],
    testCases: [
      {
        name: 'Initial Tick: 60s -> 59s',
        input: 'Timer tick at T=1000ms',
        expected: 'seconds = 59',
        actualWhenBuggy: 'seconds = 59'
      },
      {
        name: 'Consecutive Tick: 59s -> 58s',
        input: 'Timer tick at T=2000ms',
        expected: 'seconds = 58',
        actualWhenBuggy: 'seconds = 59 (Stuck at 59)'
      },
      {
        name: 'Zero Boundary: Prevent Negative Countdown',
        input: 'Timer reaches 0s',
        expected: 'seconds = 0 (Terminated)',
        actualWhenBuggy: 'seconds = 59'
      }
    ],
    interviewerInsight: 'Stale closures in hooks are asked by Top Product companies (Google, Microsoft, Razorpay) to verify your understanding of the JavaScript Execution Context and React Fiber reconciliation.'
  },
  {
    id: 'bug-2',
    title: 'Off-By-One Binary Search Infinite Loop',
    language: 'typescript',
    difficulty: 'Junior',
    domain: 'Data Structures & Algorithms',
    xpReward: 180,
    timeLimitSeconds: 100,
    description: 'An algorithm intended to locate a student ID in a sorted campus roll number array enters an infinite loop when the target is absent.',
    symptom: 'Process times out with 100% CPU usage or "Maximum Call Stack / RangeError: script unresponsive".',
    buggyCode: `export function searchStudentRoll(arr: number[], target: number): number {
  let low = 0;
  let high = arr.length - 1;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);

    if (arr[mid] === target) {
      return mid;
    } else if (arr[mid] < target) {
      // Correctly advances pointer
      low = mid + 1;
    } else {
      // BUG: Should be high = mid - 1, causes infinite loop when low === high
      high = mid;
    }
  }

  return -1;
}`,
    correctCode: `export function searchStudentRoll(arr: number[], target: number): number {
  let low = 0;
  let high = arr.length - 1;

  while (low <= high) {
    // Avoid integer overflow in typed environments
    const mid = low + Math.floor((high - low) / 2);

    if (arr[mid] === target) {
      return mid;
    } else if (arr[mid] < target) {
      low = mid + 1;
    } else {
      high = mid - 1; // FIX: Exclude mid from next search space
    }
  }

  return -1;
}`,
    bugLineNumbers: [15],
    options: [
      {
        id: 'opt-2a',
        description: 'Set `high = mid - 1` to strictly shrink the upper partition',
        fixSnippet: `high = mid - 1;`,
        isCorrect: true,
        explanation: 'Because `arr[mid]` is strictly greater than `target`, `mid` itself cannot be the answer. Shrinking to `mid - 1` guarantees loop convergence.'
      },
      {
        id: 'opt-2b',
        description: 'Change loop condition to `while (low < high - 1)`',
        fixSnippet: `while (low < high - 1)`,
        isCorrect: false,
        explanation: 'This misses single-element arrays or targets located at the extreme boundaries.'
      },
      {
        id: 'opt-2c',
        description: 'Increment `low++` on every loop iteration',
        fixSnippet: `low++; high = mid;`,
        isCorrect: false,
        explanation: 'This degrades the O(log N) binary search into an O(N) or incorrect traversal.'
      }
    ],
    hints: [
      'Trace what happens when `arr = [10]`, `target = 5`. `low = 0`, `high = 0`, `mid = 0`.',
      'If `arr[0] > 5`, what becomes of `high` on line 15?',
      'If `high = mid`, then `high` remains 0 and `low <= high` stays true forever.'
    ],
    testCases: [
      {
        name: 'Target Present: Mid Position',
        input: 'arr = [101, 105, 110, 115], target = 110',
        expected: 'Index 2',
        actualWhenBuggy: 'Index 2'
      },
      {
        name: 'Target Absent: Smaller Than Min Element',
        input: 'arr = [101, 105, 110], target = 99',
        expected: '-1 (Terminated in 2 steps)',
        actualWhenBuggy: 'Infinite loop (low=0, high=0, mid=0 repeatedly)'
      },
      {
        name: 'Target Absent: In-between Gap',
        input: 'arr = [10, 20, 30], target = 15',
        expected: '-1',
        actualWhenBuggy: 'Infinite loop'
      }
    ],
    interviewerInsight: 'Off-by-one errors in binary search are famous interview filters used by Amazon and Goldman Sachs to verify boundary condition discipline.'
  },
  {
    id: 'bug-3',
    title: 'Async Race Condition & Unordered Fetch',
    language: 'typescript',
    difficulty: 'Mid',
    domain: 'Full Stack Async Protocols',
    xpReward: 220,
    timeLimitSeconds: 120,
    description: 'When filtering jobs rapidly by typing in search input, older slow HTTP responses overwrite the latest fast response.',
    symptom: 'User searches for "Google", quickly retypes "Amazon", but the UI suddenly flashes and displays "Google" results.',
    buggyCode: `export function useCompanySearch(query: string) {
  const [data, setData] = useState<Company[]>([]);

  useEffect(() => {
    // BUG: No cleanup or abort controller; fast response for 'Amazon'
    // can be overwritten by slower network roundtrip for earlier 'Google' query
    fetchCompaniesApi(query).then(res => {
      setData(res.data);
    });
  }, [query]);

  return data;
}`,
    correctCode: `export function useCompanySearch(query: string) {
  const [data, setData] = useState<Company[]>([]);

  useEffect(() => {
    const abortController = new AbortController();

    fetchCompaniesApi(query, { signal: abortController.signal })
      .then(res => {
        setData(res.data);
      })
      .catch(err => {
        if (err.name !== 'AbortError') {
          console.error(err);
        }
      });

    return () => {
      // FIX: Cancels in-flight requests when query changes or unmounts
      abortController.abort();
    };
  }, [query]);

  return data;
}`,
    bugLineNumbers: [6, 7, 8],
    options: [
      {
        id: 'opt-3a',
        description: 'Add `setTimeout` delay of 500ms without aborting earlier requests',
        fixSnippet: `setTimeout(() => fetchCompaniesApi(query)..., 500);`,
        isCorrect: false,
        explanation: 'Debouncing reduces request volume, but network latency jitter can still cause a 600ms older response to arrive after a 100ms newer response.'
      },
      {
        id: 'opt-3b',
        description: 'Use `AbortController` in cleanup or an `active` boolean guard flag',
        fixSnippet: `const controller = new AbortController(); ... return () => controller.abort();`,
        isCorrect: true,
        explanation: 'Cancelling stale in-flight fetches or ignoring their resolution ensures only the latest initiated query updates state.'
      },
      {
        id: 'opt-3c',
        description: 'Store previous query in a ref and check `query !== prev` synchronously',
        fixSnippet: `if (query === prevQuery.current) setData(res.data);`,
        isCorrect: false,
        explanation: 'A plain ref check doesn’t cancel in-flight network bandwidth and can fail when user queries revert.'
      }
    ],
    hints: [
      'Network requests are asynchronous and non-deterministic in arrival time.',
      'How does React effect cleanup handle in-flight network promises?',
      'Look into `AbortController` or a boolean `let isCurrent = true` flag.'
    ],
    testCases: [
      {
        name: 'Single Query Resolution',
        input: 'Query: "TCS"',
        expected: 'Displays TCS results',
        actualWhenBuggy: 'Displays TCS results'
      },
      {
        name: 'Rapid Succession ("A" [400ms delay] then "B" [50ms delay])',
        input: 'Query sequence: "Google" -> "Amazon"',
        expected: 'Displays "Amazon" (latest)',
        actualWhenBuggy: 'Displays "Google" (stale slow response arrived last)'
      }
    ],
    interviewerInsight: 'Race conditions in async UI applications are standard Senior Frontend / Fullstack questions asked by Uber, Atlassian, and Stripe.'
  },
  {
    id: 'bug-4',
    title: 'Accidental Quadratic O(N²) Lookups in Loops',
    language: 'python',
    difficulty: 'Mid',
    domain: 'Algorithmic Optimization & Big-O',
    xpReward: 200,
    timeLimitSeconds: 110,
    description: 'A student eligibility filter checking 50,000 applicants against a blacklist of opted-out IDs freezes the backend microservice.',
    symptom: 'Processing 50,000 students takes over 42 seconds instead of 18 milliseconds, causing gateway HTTP 504 timeouts.',
    buggyCode: `def filter_eligible_candidates(candidates: list, opted_out_ids: list) -> list:
    eligible = []
    
    # BUG: opted_out_ids is a Python list!
    # Checking 'candidate.id not in opted_out_ids' performs an O(M) linear scan
    # Inside an N-iteration loop, this yields O(N * M) quadratic runtime
    for candidate in candidates:
        if candidate["id"] not in opted_out_ids:
            eligible.append(candidate)
            
    return eligible`,
    correctCode: `def filter_eligible_candidates(candidates: list, opted_out_ids: list) -> list:
    eligible = []
    
    # FIX: Hash set conversion provides O(1) average lookup time
    # Total time complexity reduced from O(N * M) to O(N + M)
    opted_out_set = set(opted_out_ids)
    
    for candidate in candidates:
        if candidate["id"] not in opted_out_set:
            eligible.append(candidate)
            
    return eligible`,
    bugLineNumbers: [7],
    options: [
      {
        id: 'opt-4a',
        description: 'Convert `opted_out_ids` into a `set` once before the loop for O(1) lookup',
        fixSnippet: `opted_out_set = set(opted_out_ids)\nif candidate["id"] not in opted_out_set:`,
        isCorrect: true,
        explanation: 'Converting to a hash set takes O(M). Subsequent lookups `item in set` are O(1), cutting runtime from 40s to 15ms.'
      },
      {
        id: 'opt-4b',
        description: 'Use a list comprehension `[c for c in candidates if c["id"] not in opted_out_ids]`',
        fixSnippet: `return [c for c in candidates if c["id"] not in opted_out_ids]`,
        isCorrect: false,
        explanation: 'List comprehension is written in C under the hood, but the algorithmic complexity remains strictly O(N * M) quadratic.'
      },
      {
        id: 'opt-4c',
        description: 'Sort both lists and use binary search without sets',
        fixSnippet: `opted_out_ids.sort() ... bisect()`,
        isCorrect: false,
        explanation: 'While O(N log M) is better than O(N * M), O(N + M) with a hash set is strictly optimal and idiomatic Python.'
      }
    ],
    hints: [
      'What is the time complexity of `x in list` in Python?',
      'What data structure provides constant O(1) average membership testing?',
      'Pre-processing the collection before the loop will drop complexity to linear time.'
    ],
    testCases: [
      {
        name: 'Small Dataset (N=100, M=10)',
        input: '100 candidates, 10 opted-out',
        expected: '1ms execution',
        actualWhenBuggy: '1.2ms execution'
      },
      {
        name: 'Campus Scale Dataset (N=50,000, M=10,000)',
        input: '50,000 candidates, 10,000 opted-out',
        expected: '16ms execution',
        actualWhenBuggy: '42,100ms (42.1s - Gateway Timeout)'
      }
    ],
    interviewerInsight: 'Checking collections membership complexity is a classic warm-up question at Meta and Oracle to assess Big-O intuition.'
  },
  {
    id: 'bug-5',
    title: 'SQL Unparameterized String Concatenation & Data Leak',
    language: 'sql',
    difficulty: 'Senior',
    domain: 'Backend Security & Database Integrity',
    xpReward: 260,
    timeLimitSeconds: 120,
    description: 'A placement coordinator search query allows malicious or accidental input injection to bypass CGPA filter or dump confidential salary offers.',
    symptom: 'Entering single quote `\'` crashes the query with SQL syntax error, and `\' OR \'1\'=\'1` dumps all confidential records.',
    buggyCode: `def get_shortlisted_students(department: str, min_cgpa: float, db_session):
    # CRITICAL BUG: Direct f-string concatenation into raw SQL
    query = f"""
        SELECT student_id, name, roll_no, cgpa, offer_package
        FROM candidates
        WHERE department = '{department}' AND cgpa >= {min_cgpa}
    """
    return db_session.execute(query).fetchall()`,
    correctCode: `def get_shortlisted_students(department: str, min_cgpa: float, db_session):
    # FIX: Parameterized SQL with bind variables
    query = """
        SELECT student_id, name, roll_no, cgpa, offer_package
        FROM candidates
        WHERE department = :dept AND cgpa >= :min_cgpa
    """
    return db_session.execute(query, {"dept": department, "min_cgpa": min_cgpa}).fetchall()`,
    bugLineNumbers: [3, 4, 5, 6],
    options: [
      {
        id: 'opt-5a',
        description: 'Replace single quotes with double quotes `"{department}"` in f-string',
        fixSnippet: `WHERE department = "{department}"`,
        isCorrect: false,
        explanation: 'Changing quote delimiters does not prevent SQL injection and breaks standard SQL compliance.'
      },
      {
        id: 'opt-5b',
        description: 'Sanitize string with `.replace("\'", "")` manually',
        fixSnippet: `department.replace("'", "")`,
        isCorrect: false,
        explanation: 'Manual blacklisting fails against encoded payloads, comments (`--`), and second-order injections.'
      },
      {
        id: 'opt-5c',
        description: 'Use parameterized queries with named bind parameters `:dept` and `:min_cgpa`',
        fixSnippet: `db_session.execute(query, {"dept": department, "min_cgpa": min_cgpa})`,
        isCorrect: true,
        explanation: 'Parameterized queries compile the SQL plan first and treat user inputs strictly as literal data, rendering injection impossible.'
      }
    ],
    hints: [
      'What happens if `department` equals `"Computer\' OR \'1\'=\'1"`?',
      'Never format or interpolate user variables directly into SQL strings.',
      'Use database bind parameters (e.g. `:param` or `%s`).'
    ],
    testCases: [
      {
        name: 'Normal Query: Department = "Computer", CGPA = 8.5',
        input: 'dept="Computer", cgpa=8.5',
        expected: 'Returns 24 filtered rows',
        actualWhenBuggy: 'Returns 24 rows'
      },
      {
        name: 'Security Test: Payload = "Computer\' OR \'1\'=\'1"',
        input: 'dept="Computer\' OR \'1\'=\'1"',
        expected: 'Returns 0 rows (treated as literal string)',
        actualWhenBuggy: 'Dumps all 1,200 confidential records across all departments!'
      }
    ],
    interviewerInsight: 'SQL injection and query parameterization questions are mandatory compliance checks in cybersecurity and fintech engineering interviews.'
  },
  {
    id: 'bug-6',
    title: 'Unbounded Memory Leak from Orphan Event Listeners',
    language: 'typescript',
    difficulty: 'Senior',
    domain: 'Browser Engine & Memory Profiling',
    xpReward: 250,
    timeLimitSeconds: 120,
    description: 'During a 3-hour campus proctored exam, the browser tab memory climbs to 2.4 GB and crashes the student assessment.',
    symptom: 'Chrome Task Manager shows JavaScript memory increasing by 15 MB every 10 seconds until the tab crashes with "Out of Memory".',
    buggyCode: `export class LiveAudioVisualizer {
  private mediaStream: MediaStream;
  private canvas: HTMLCanvasElement;

  constructor(stream: MediaStream, canvas: HTMLCanvasElement) {
    this.mediaStream = stream;
    this.canvas = canvas;
    this.init();
  }

  private init() {
    // BUG: Adds window resize listener with closure capturing 'this'
    // but provides no destroy/cleanup method to removeEventListener
    window.addEventListener('resize', () => {
      this.resizeCanvas();
    });
  }

  private resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = 300;
  }
}`,
    correctCode: `export class LiveAudioVisualizer {
  private mediaStream: MediaStream;
  private canvas: HTMLCanvasElement;
  private handleResize = () => this.resizeCanvas();

  constructor(stream: MediaStream, canvas: HTMLCanvasElement) {
    this.mediaStream = stream;
    this.canvas = canvas;
    this.init();
  }

  private init() {
    window.addEventListener('resize', this.handleResize);
  }

  public destroy() {
    // FIX: Explicit teardown removes listener and releases object graph reference
    window.removeEventListener('resize', this.handleResize);
  }

  private resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = 300;
  }
}`,
    bugLineNumbers: [13, 14, 15],
    options: [
      {
        id: 'opt-6a',
        description: 'Provide a retained handler reference and a public `destroy()` method calling `removeEventListener`',
        fixSnippet: `public destroy() {\n  window.removeEventListener('resize', this.handleResize);\n}`,
        isCorrect: true,
        explanation: 'An anonymous arrow function passed to `addEventListener` cannot be unhooked later. Retaining the reference allows complete teardown.'
      },
      {
        id: 'opt-6b',
        description: 'Set `window.onresize = null` inside constructor',
        fixSnippet: `window.onresize = null;`,
        isCorrect: false,
        explanation: 'Overwriting `window.onresize` will clobber other application event listeners across the Placement Hub.'
      },
      {
        id: 'opt-6c',
        description: 'Run `this.canvas = null` inside the resize callback',
        fixSnippet: `this.canvas = null;`,
        isCorrect: false,
        explanation: 'This triggers a NullPointerException on the very next resize event and does not remove the event listener.'
      }
    ],
    hints: [
      'Can you remove an anonymous inline arrow function with `removeEventListener`?',
      'If you create 100 instances of this class without teardown, what happens to the global `window` listeners list?',
      'Store the bound callback as an instance property and remove it upon component disposal.'
    ],
    testCases: [
      {
        name: 'Mount & Unmount 50 Times',
        input: '50 component unmount cycles',
        expected: 'Active Window Listeners: 0 (Heap flat at 18 MB)',
        actualWhenBuggy: 'Active Window Listeners: 50 (Heap retained at 420 MB)'
      }
    ],
    interviewerInsight: 'Memory leak diagnosis in long-running Single Page Applications is a key differentiator in Principal & Senior Software Engineer evaluations.'
  }
];

export interface PlayerStats {
  xp: number;
  level: number;
  bugsSquashed: number;
  streak: number;
  maxStreak: number;
  accuracy: number;
  solvedChallengeIds: string[];
  badges: {
    id: string;
    title: string;
    description: string;
    icon: string;
    unlockedAt?: string;
  }[];
}

export const INITIAL_PLAYER_STATS: PlayerStats = {
  xp: 420,
  level: 2,
  bugsSquashed: 3,
  streak: 2,
  maxStreak: 4,
  accuracy: 85,
  solvedChallengeIds: ['bug-1'],
  badges: [
    {
      id: 'first-blood',
      title: 'First Blood',
      description: 'Squash your first production bug in the Arena',
      icon: 'Award',
      unlockedAt: 'Today'
    },
    {
      id: 'closure-survivor',
      title: 'Closure Survivor',
      description: 'Mastered React Fiber & Execution Context traps',
      icon: 'Zap',
      unlockedAt: 'Yesterday'
    },
    {
      id: 'speed-demon',
      title: 'Speed Sleuth',
      description: 'Diagnose a defect in under 30 seconds',
      icon: 'Flame'
    },
    {
      id: 'zero-leak',
      title: 'Memory Warden',
      description: 'Eliminate complex garbage collection leaks',
      icon: 'ShieldCheck'
    }
  ]
};

export interface LeaderboardEntry {
  rank: number;
  name: string;
  rollNo: string;
  department: string;
  level: string;
  xp: number;
  bugsSquashed: number;
  streak: number;
  accuracy: number;
  badge: string;
  isCurrentUser?: boolean;
}

export const MOCK_ARENA_LEADERBOARD: LeaderboardEntry[] = [
  {
    rank: 1,
    name: 'Aarav Deshmukh',
    rollNo: 'BE-CS-042',
    department: 'Computer Engineering',
    level: 'Staff Code Sleuth',
    xp: 2840,
    bugsSquashed: 26,
    streak: 9,
    accuracy: 96,
    badge: '🏆 Grandmaster'
  },
  {
    rank: 2,
    name: 'Bhumit Deshmukh',
    rollNo: 'BE-CS-018',
    department: 'Computer Engineering',
    level: 'Senior Forensic Engineer',
    xp: 2150,
    bugsSquashed: 19,
    streak: 5,
    accuracy: 91,
    badge: '🔥 On Fire',
    isCurrentUser: true
  },
  {
    rank: 3,
    name: 'Riya Kulkarni',
    rollNo: 'BE-IT-089',
    department: 'Information Technology',
    level: 'Senior Forensic Engineer',
    xp: 1980,
    bugsSquashed: 17,
    streak: 4,
    accuracy: 88,
    badge: '⚡ Blitz Ace'
  },
  {
    rank: 4,
    name: 'Tanmay Joshi',
    rollNo: 'BE-AIDS-012',
    department: 'AI & Data Science',
    level: 'Mid Troubleshooter',
    xp: 1620,
    bugsSquashed: 14,
    streak: 3,
    accuracy: 84,
    badge: '🎯 Sharp Eye'
  },
  {
    rank: 5,
    name: 'Sneha Patil',
    rollNo: 'BE-CS-104',
    department: 'Computer Engineering',
    level: 'Mid Troubleshooter',
    xp: 1450,
    bugsSquashed: 12,
    streak: 2,
    accuracy: 82,
    badge: '🛡️ Bug Shield'
  },
  {
    rank: 6,
    name: 'Aditya Shinde',
    rollNo: 'BE-IT-034',
    department: 'Information Technology',
    level: 'Junior Debugger',
    xp: 980,
    bugsSquashed: 8,
    streak: 1,
    accuracy: 79,
    badge: '🌱 Rising Star'
  }
];
