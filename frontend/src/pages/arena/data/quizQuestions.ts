import { QuizQuestion } from '../types/quiz';

export const STARTER_QUIZ_QUESTIONS: QuizQuestion[] = [
  // =========================================================================
  // 1. PROGRAMMING FUNDAMENTALS (6 questions)
  // =========================================================================
  {
    id: 'pf-01',
    topic: 'Programming Fundamentals',
    difficulty: 'Beginner',
    question: 'What will be the output of the following JavaScript snippet due to variable hoisting?',
    codeSnippet: `console.log(a);
var a = 10;
console.log(b);
let b = 20;`,
    codeLanguage: 'javascript',
    options: [
      'undefined followed by ReferenceError',
      '10 followed by 20',
      'undefined followed by undefined',
      'ReferenceError followed by ReferenceError'
    ],
    correctAnswerIndex: 0,
    explanation: 'Variables declared with `var` are hoisted and initialized to `undefined`. In contrast, variables declared with `let` are hoisted into the Temporal Dead Zone (TDZ) and accessing them before declaration throws a `ReferenceError`.',
    misconception: 'Many candidates assume `let` is not hoisted at all. It is hoisted, but remains uninitialized in the TDZ until the declaration line is reached.',
    estimatedSeconds: 30
  },
  {
    id: 'pf-02',
    topic: 'Programming Fundamentals',
    difficulty: 'Beginner',
    question: 'What is the base case in a recursive function responsible for?',
    options: [
      'Terminating recursion and preventing infinite call stack overflow',
      'Calling the function with a larger input size',
      'Allocating heap memory for local function frames',
      'Optimizing tail call recursion into an iterative loop'
    ],
    correctAnswerIndex: 0,
    explanation: 'The base case defines the stopping condition where the function returns a concrete result without making further recursive calls, preventing infinite recursion and call stack overflow.',
    misconception: 'Recursion does not stop automatically when memory fills up; without a valid base case, it terminates abnormally with a StackOverflow error.',
    estimatedSeconds: 25
  },
  {
    id: 'pf-03',
    topic: 'Programming Fundamentals',
    difficulty: 'Intermediate',
    question: 'What is the exact time complexity of the following nested loop?',
    codeSnippet: `int count = 0;
for (int i = 1; i <= n; i *= 2) {
    for (int j = 0; j < n; j++) {
        count++;
    }
}`,
    codeLanguage: 'cpp',
    options: [
      'O(n log n)',
      'O(n^2)',
      'O(log n)',
      'O(n)'
    ],
    correctAnswerIndex: 0,
    explanation: 'The outer loop multiplies `i` by 2 each iteration, executing in O(log n) steps. For each step, the inner loop runs linearly `n` times. The total operations are O(n * log n).',
    misconception: 'Not all nested loops are O(n^2). Always evaluate how the loop counters advance (linear increment vs. geometric multiplication).',
    estimatedSeconds: 35
  },
  {
    id: 'pf-04',
    topic: 'Programming Fundamentals',
    difficulty: 'Intermediate',
    question: 'In pass-by-value vs pass-by-reference languages like Python or Java, what happens when an object reference is passed into a method?',
    options: [
      'The reference itself is passed by value, allowing field mutation but not caller reference re-assignment',
      'The actual object is cloned and copied byte-for-byte on the stack',
      'The caller reference can be pointed to a new object globally',
      'All variables are strictly immutable once passed across stack frames'
    ],
    correctAnswerIndex: 0,
    explanation: 'Both Java and Python use "pass-by-value of the object reference". Mutating properties of the object affects the caller, but reassigning the parameter variable inside the function does not change what the caller points to.',
    misconception: 'People often confuse modifying an object’s attributes (mutation) with reassigning the variable reference itself.',
    estimatedSeconds: 40
  },
  {
    id: 'pf-05',
    topic: 'Programming Fundamentals',
    difficulty: 'Advanced',
    question: 'What will the following code output regarding integer representation and bitwise operations?',
    codeSnippet: `int x = 5;       // 00000101
int y = ~x;      // Bitwise NOT
System.out.println(y);`,
    codeLanguage: 'java',
    options: [
      '-6',
      '-5',
      '6',
      '250'
    ],
    correctAnswerIndex: 0,
    explanation: 'In two’s complement signed integer representation, the bitwise NOT of any integer `x` equals `-(x + 1)`. Therefore, `~5 = -(5 + 1) = -6`.',
    misconception: 'Bitwise NOT flips all bits including the sign bit. It does not just negate the number into -5.',
    estimatedSeconds: 35
  },
  {
    id: 'pf-06',
    topic: 'Programming Fundamentals',
    difficulty: 'Advanced',
    question: 'Which of the following functions exhibits tail-call optimization (TCO) capability in supporting runtimes?',
    codeSnippet: `// Function A
int factA(int n) {
    if (n <= 1) return 1;
    return n * factA(n - 1);
}

// Function B
int factB(int n, int acc) {
    if (n <= 1) return acc;
    return factB(n - 1, n * acc);
}`,
    codeLanguage: 'cpp',
    options: [
      'Function B only, because the recursive call is the final operation with no pending multiplication',
      'Function A only, because it computes the product directly on return',
      'Both functions can be tail-call optimized identically',
      'Neither function, because recursion always requires maintaining caller frames'
    ],
    correctAnswerIndex: 0,
    explanation: 'Tail-call optimization requires the recursive invocation to be the final action in the caller. In `factA`, the multiplication `n * ...` occurs after the recursive call returns, requiring the stack frame to remain.',
    misconception: 'Merely placing the recursive call on the return line does not make it tail-recursive if an operation is waiting on its result.',
    estimatedSeconds: 40
  },

  // =========================================================================
  // 2. OBJECT-ORIENTED PROGRAMMING (6 questions)
  // =========================================================================
  {
    id: 'oop-01',
    topic: 'Object-Oriented Programming',
    difficulty: 'Beginner',
    question: 'Which OOP pillar is demonstrated by bundling data fields and restricting direct access to them via getters and setters?',
    options: [
      'Encapsulation',
      'Polymorphism',
      'Inheritance',
      'Dynamic Dispatch'
    ],
    correctAnswerIndex: 0,
    explanation: 'Encapsulation is the mechanism of wrapping data (variables) and code acting on the data (methods) together as a single unit while hiding internal representation from external modification.',
    misconception: 'Abstraction hides complexity by showing only essential features; Encapsulation focuses on data protection and binding state with methods.',
    estimatedSeconds: 20
  },
  {
    id: 'oop-02',
    topic: 'Object-Oriented Programming',
    difficulty: 'Beginner',
    question: 'What is the primary difference between method overloading and method overriding?',
    options: [
      'Overloading is compile-time polymorphism in the same class; Overriding is runtime polymorphism in a subclass hierarchy',
      'Overloading requires virtual tables; Overriding does not',
      'Overloading changes the return type only; Overriding changes the parameter list',
      'Overloading occurs across separate processes; Overriding occurs in threads'
    ],
    correctAnswerIndex: 0,
    explanation: 'Overloading happens when methods in the same class share a name but differ in parameters (static/compile-time). Overriding happens when a subclass provides a specific implementation of a parent method with the identical signature (dynamic/runtime).',
    misconception: 'Changing only the return type without altering method parameters does not constitute valid method overloading in C++ or Java.',
    estimatedSeconds: 30
  },
  {
    id: 'oop-03',
    topic: 'Object-Oriented Programming',
    difficulty: 'Intermediate',
    question: 'What will be output by this polymorphism example?',
    codeSnippet: `class Parent {
    void show() { System.out.print("P"); }
}
class Child extends Parent {
    void show() { System.out.print("C"); }
}

Parent obj = new Child();
obj.show();`,
    codeLanguage: 'java',
    options: [
      'C',
      'P',
      'Compile-time Error: Type mismatch',
      'PC'
    ],
    correctAnswerIndex: 0,
    explanation: 'In Java, non-static methods are virtual by default. Dynamic method dispatch inspects the actual runtime object (`Child`), so `Child.show()` is executed.',
    misconception: 'The reference type (`Parent`) determines which methods are accessible at compile time, but the actual instance type (`Child`) determines which overridden implementation executes.',
    estimatedSeconds: 30
  },
  {
    id: 'oop-04',
    topic: 'Object-Oriented Programming',
    difficulty: 'Intermediate',
    question: 'Why can an abstract class NOT be directly instantiated with the `new` operator?',
    options: [
      'It may contain incomplete (abstract) method declarations without an implementation',
      'It does not possess a constructor in memory',
      'All variables inside an abstract class must be static and constant',
      'Abstract classes exist only at compile time and are stripped by the bytecode linker'
    ],
    correctAnswerIndex: 0,
    explanation: 'An abstract class serves as a blueprint and may contain abstract methods that lack an execution body. Allowing instantiation would allow invoking non-existent method logic.',
    misconception: 'Abstract classes do have constructors, which are called by subclasses during constructor chaining via `super()`.',
    estimatedSeconds: 30
  },
  {
    id: 'oop-05',
    topic: 'Object-Oriented Programming',
    difficulty: 'Advanced',
    question: 'What is the "Diamond Problem" in multiple inheritance, and how does C++ address it?',
    options: [
      'Ambiguity when a class inherits from two classes that share a common ancestor; resolved using `virtual` base classes',
      'A circular dependency during memory allocation; resolved by garbage collection',
      'Deadlock caused by multiple mutex locks; resolved by re-entrant monitors',
      'Overriding static constructors across packages; resolved by namespaces'
    ],
    correctAnswerIndex: 0,
    explanation: 'The Diamond Problem occurs when Class D inherits from B and C, both inheriting from A. D would duplicate A’s members with ambiguity. C++ resolves this via `virtual inheritance` (`class B : virtual public A`), ensuring only one shared instance of A exists.',
    misconception: 'Java did not eliminate interfaces because of the diamond problem; it prohibited multiple *class* inheritance while allowing multiple interface implementations.',
    estimatedSeconds: 40
  },
  {
    id: 'oop-06',
    topic: 'Object-Oriented Programming',
    difficulty: 'Advanced',
    question: 'In object-oriented design, what does the Liskov Substitution Principle (LSP) dictate?',
    options: [
      'Subtypes must be substitutable for their base types without altering the correctness of the program',
      'Classes should be open for extension but closed for modification',
      'Clients should not be forced to depend upon interfaces that they do not use',
      'High-level modules should not depend on low-level modules'
    ],
    correctAnswerIndex: 0,
    explanation: 'LSP (the L in SOLID) asserts that if S is a subtype of T, objects of type T may be replaced with objects of type S without breaking preconditions, postconditions, or program invariants.',
    misconception: 'The famous Classic Square-Rectangle problem violates LSP because modifying a Square’s width inadvertently mutates height, violating Rectangle expectations.',
    estimatedSeconds: 35
  },

  // =========================================================================
  // 3. DATA STRUCTURES & ALGORITHMS (7 questions)
  // =========================================================================
  {
    id: 'dsa-01',
    topic: 'Data Structures and Algorithms',
    difficulty: 'Beginner',
    question: 'Which data structure operates on a Last-In, First-Out (LIFO) order of element removal?',
    options: [
      'Stack',
      'Queue',
      'Binary Search Tree',
      'Priority Queue'
    ],
    correctAnswerIndex: 0,
    explanation: 'A Stack follows the LIFO principle where the most recently inserted element via `push()` is the first one removed via `pop()`.',
    misconception: 'A standard Queue follows FIFO (First-In, First-Out), not LIFO.',
    estimatedSeconds: 15
  },
  {
    id: 'dsa-02',
    topic: 'Data Structures and Algorithms',
    difficulty: 'Beginner',
    question: 'What is the average time complexity to search for an element in a Hash Table with a well-distributed hash function?',
    options: [
      'O(1)',
      'O(log n)',
      'O(n)',
      'O(n log n)'
    ],
    correctAnswerIndex: 0,
    explanation: 'With a uniform hash function and low load factor, computing the bucket index and retrieving an entry occurs in O(1) constant average time.',
    misconception: 'While worst-case collision degradation can reach O(n), the average and expected lookup complexity is O(1).',
    estimatedSeconds: 20
  },
  {
    id: 'dsa-03',
    topic: 'Data Structures and Algorithms',
    difficulty: 'Intermediate',
    question: 'Why is QuickSort generally preferred over MergeSort for sorting in-memory arrays, despite both having O(n log n) average complexity?',
    options: [
      'QuickSort is an in-place sort with O(log n) auxiliary stack space and superior CPU cache locality',
      'QuickSort has a guaranteed O(n log n) worst-case time complexity',
      'MergeSort requires O(n^2) space on primitive arrays',
      'QuickSort is inherently stable whereas MergeSort is unstable'
    ],
    correctAnswerIndex: 0,
    explanation: 'MergeSort requires O(n) auxiliary memory for buffer allocations and suffers from cache misses. QuickSort operates in-place with excellent spatial locality, making it faster in practice on hardware caches.',
    misconception: 'QuickSort’s worst-case is O(n^2) when poor pivots are chosen, but randomized pivot selection avoids this in practice.',
    estimatedSeconds: 35
  },
  {
    id: 'dsa-04',
    topic: 'Data Structures and Algorithms',
    difficulty: 'Intermediate',
    question: 'What is the maximum number of nodes on level `k` (where root is level 0) of a binary tree?',
    options: [
      '2^k',
      '2^(k+1) - 1',
      '2^k - 1',
      'k^2'
    ],
    correctAnswerIndex: 0,
    explanation: 'At level 0, there is 2^0 = 1 node. At level 1, 2^1 = 2 nodes. In general, level `k` contains at most 2^k nodes.',
    misconception: '`2^(k+1) - 1` is the *total cumulative* maximum number of nodes in a complete binary tree of height `k`, not just on level `k`.',
    estimatedSeconds: 25
  },
  {
    id: 'dsa-05',
    topic: 'Data Structures and Algorithms',
    difficulty: 'Intermediate',
    question: 'Which algorithm is optimal for finding the shortest path from a single source node in a weighted graph with NO negative edge weights?',
    options: [
      'Dijkstra\'s Algorithm',
      'Bellman-Ford Algorithm',
      'Floyd-Warshall Algorithm',
      'Kruskal\'s Algorithm'
    ],
    correctAnswerIndex: 0,
    explanation: 'Dijkstra’s algorithm finds single-source shortest paths in O((V + E) log V) with a min-priority queue on non-negative weighted graphs.',
    misconception: 'Bellman-Ford is needed if negative weights exist, but is slower (O(V * E)). Kruskal’s is for Minimum Spanning Trees, not shortest paths.',
    estimatedSeconds: 30
  },
  {
    id: 'dsa-06',
    topic: 'Data Structures and Algorithms',
    difficulty: 'Advanced',
    question: 'In a Red-Black Tree, what invariant guarantees that no simple path from root to leaf is more than twice as long as any other path?',
    options: [
      'Every path from a node to descendant leaves contains the exact same number of black nodes, and red nodes cannot have red children',
      'Every non-leaf node must possess exactly two children',
      'All leaf nodes must be painted red',
      'The tree height is strictly recalculated using AVL balance factors (+1, 0, -1)'
    ],
    correctAnswerIndex: 0,
    explanation: 'Because red nodes cannot be adjacent and all paths have the same number of black nodes (black height), the shortest path has only black nodes and the longest has alternating red-black nodes, bounding the height to ≤ 2 log(n + 1).',
    misconception: 'Red-Black trees do not strictly balance heights to within 1 like AVL trees; they maintain approximate balance with fewer rotations on insert/delete.',
    estimatedSeconds: 40
  },
  {
    id: 'dsa-07',
    topic: 'Data Structures and Algorithms',
    difficulty: 'Advanced',
    question: 'What is the amortized time complexity of inserting `n` consecutive elements into a dynamic array (like std::vector or ArrayList) that doubles its capacity upon filling?',
    options: [
      'O(1) amortized per insertion',
      'O(log n) amortized per insertion',
      'O(n) amortized per insertion',
      'O(n log n) amortized per insertion'
    ],
    correctAnswerIndex: 0,
    explanation: 'While doubling capacity causes an occasional O(k) copy operation, these reallocations become exponentially infrequent. Summing copies across n insertions gives 1 + 2 + 4 + ... + n ≈ 2n operations total, yielding O(1) amortized per element.',
    misconception: 'Looking only at the worst-case single insert (O(n)) ignores the aggregate efficiency across a sequence of operations.',
    estimatedSeconds: 35
  },

  // =========================================================================
  // 4. DATABASE MANAGEMENT SYSTEMS (6 questions)
  // =========================================================================
  {
    id: 'dbms-01',
    topic: 'Database Management Systems',
    difficulty: 'Beginner',
    question: 'What is the primary constraint that differentiates a PRIMARY KEY from a UNIQUE KEY in standard relational databases?',
    options: [
      'PRIMARY KEY cannot accept NULL values, whereas UNIQUE KEY permits NULL values',
      'A table can possess multiple PRIMARY KEYs but only one UNIQUE KEY',
      'UNIQUE KEY automatically builds a clustered index by default on all databases',
      'PRIMARY KEY cannot be referenced by a foreign key'
    ],
    correctAnswerIndex: 0,
    explanation: 'A Primary Key uniquely identifies each row and strictly forbids NULLs. A table can only have one Primary Key. A table can have multiple Unique Keys, which permit NULLs depending on SQL vendor semantics.',
    misconception: 'Many developers forget that a composite primary key is still a single primary key composed of multiple columns.',
    estimatedSeconds: 25
  },
  {
    id: 'dbms-02',
    topic: 'Database Management Systems',
    difficulty: 'Beginner',
    question: 'Which SQL clause is used to filter aggregated group records produced by a `GROUP BY` statement?',
    options: [
      'HAVING',
      'WHERE',
      'ORDER BY',
      'FILTER'
    ],
    correctAnswerIndex: 0,
    explanation: '`WHERE` filters individual rows before grouping takes place, while `HAVING` filters aggregate summaries after `GROUP BY` grouping has completed.',
    misconception: 'Using aggregate functions like `COUNT(*)` or `AVG()` directly inside a `WHERE` clause is invalid SQL syntax.',
    estimatedSeconds: 20
  },
  {
    id: 'dbms-03',
    topic: 'Database Management Systems',
    difficulty: 'Intermediate',
    question: 'What does the "I" (Isolation) in ACID transaction properties specifically guard against?',
    options: [
      'Concurrent transactions interfering with each other and producing dirty reads or inconsistent states',
      'Hardware power loss corrupting written database disk sectors',
      'Foreign key constraint violations across child tables',
      'Network timeouts between the client and database server'
    ],
    correctAnswerIndex: 0,
    explanation: 'Isolation ensures that concurrent execution of transactions leaves the database in the same state as if they were executed sequentially, preventing anomalies like dirty reads, non-repeatable reads, and phantom reads.',
    misconception: 'Durability (not Isolation) handles persistence across system crashes and power loss.',
    estimatedSeconds: 30
  },
  {
    id: 'dbms-04',
    topic: 'Database Management Systems',
    difficulty: 'Intermediate',
    question: 'A relational table is said to be in Third Normal Form (3NF) if it is in 2NF and has no:',
    options: [
      'Transitive functional dependencies of non-prime attributes on the candidate key',
      'Partial dependencies on composite primary keys',
      'Multi-valued attributes or repeating groups',
      'Foreign keys referencing external tables'
    ],
    correctAnswerIndex: 0,
    explanation: '1NF eliminates repeating groups. 2NF removes partial dependencies on candidate keys. 3NF removes transitive dependencies (where a non-prime attribute depends on another non-prime attribute: X -> Y -> Z).',
    misconception: 'Partial functional dependency is resolved in 2NF, not 3NF.',
    estimatedSeconds: 30
  },
  {
    id: 'dbms-05',
    topic: 'Database Management Systems',
    difficulty: 'Advanced',
    question: 'What is a "Phantom Read" anomaly in database transaction isolation levels?',
    codeSnippet: `Transaction A: SELECT count(*) FROM students WHERE cgpa > 8.5; -- returns 10
Transaction B: INSERT INTO students (name, cgpa) VALUES ('Alex', 9.2); COMMIT;
Transaction A: SELECT count(*) FROM students WHERE cgpa > 8.5; -- returns 11!`,
    codeLanguage: 'sql',
    options: [
      'A transaction re-executes a range query and discovers new rows inserted by another committed transaction',
      'A transaction reads uncommitted modified data that is subsequently rolled back',
      'A transaction re-reads a specific single row and finds modified column values',
      'A database index points to deleted disk blocks'
    ],
    correctAnswerIndex: 0,
    explanation: 'A Phantom Read occurs when a transaction queries a range of rows matching a predicate, and a second transaction inserts/deletes rows in that range, causing the first transaction to see newly appearing "phantom" rows on re-query.',
    misconception: 'Non-repeatable read applies to updates on *existing* individual rows; Phantom reads involve *new rows* matching range predicates.',
    estimatedSeconds: 40
  },
  {
    id: 'dbms-06',
    topic: 'Database Management Systems',
    difficulty: 'Advanced',
    question: 'Why are B+ Trees favored over standard Binary Search Trees or B-Trees for relational database disk indexing?',
    options: [
      'B+ Tree leaves are linked sequentially for rapid range scans, and internal nodes store only keys to maximize fan-out per disk page',
      'B+ Trees have an O(1) worst-case search complexity',
      'B+ Trees store all actual record data inside root nodes',
      'B+ Trees do not require disk re-balancing during insertions'
    ],
    correctAnswerIndex: 0,
    explanation: 'Disk I/O is slow. B+ Trees have high fan-out (thousands of keys per disk block), keeping tree depth low (3-4). Storing data pointers exclusively in leaves and linking them sequentially allows O(log n) lookups followed by rapid sequential disk scans for range queries.',
    misconception: 'B-Trees store data pointers in internal nodes as well, which reduces the number of keys fitting in a single disk block and slows down range scans.',
    estimatedSeconds: 40
  },

  // =========================================================================
  // 5. OPERATING SYSTEMS (7 questions)
  // =========================================================================
  {
    id: 'os-01',
    topic: 'Operating Systems',
    difficulty: 'Beginner',
    question: 'What fundamental resource distinction exists between processes and threads within the same process?',
    options: [
      'Processes have isolated memory address spaces; threads share the process heap, code, and global data',
      'Threads have separate heaps; processes share the same heap',
      'Threads run in kernel space only; processes run in user space',
      'A process cannot have more than one thread on modern OS kernels'
    ],
    correctAnswerIndex: 0,
    explanation: 'A process is an executing program with its own virtual memory space. Threads are lightweight execution units within a process that share the heap, open file descriptors, and global memory, but have their own registers and call stack.',
    misconception: 'Threads do not share their stack frames; each thread maintains its own private call stack.',
    estimatedSeconds: 25
  },
  {
    id: 'os-02',
    topic: 'Operating Systems',
    difficulty: 'Beginner',
    question: 'Which CPU scheduling algorithm allocates fixed time slices (quanta) cyclically to ready queue processes?',
    options: [
      'Round Robin (RR)',
      'First-Come, First-Served (FCFS)',
      'Shortest Job Next (SJN)',
      'Multilevel Feedback Priority'
    ],
    correctAnswerIndex: 0,
    explanation: 'Round Robin is a preemptive scheduling algorithm that assigns each process a fixed slice of time (quantum). If the process doesn’t finish within the quantum, it is preempted and moved to the back of the ready queue.',
    misconception: 'FCFS is non-preemptive and can cause the "convoy effect" where short jobs wait behind a massive CPU burst job.',
    estimatedSeconds: 20
  },
  {
    id: 'os-03',
    topic: 'Operating Systems',
    difficulty: 'Intermediate',
    question: 'Which of the following is NOT one of Coffman’s four necessary conditions for a Deadlock to occur?',
    options: [
      'Preemption of resources by kernel',
      'Mutual Exclusion',
      'Hold and Wait',
      'Circular Wait'
    ],
    correctAnswerIndex: 0,
    explanation: 'The four Coffman conditions are: 1. Mutual Exclusion, 2. Hold and Wait, 3. No Preemption (resources cannot be forcibly confiscated), and 4. Circular Wait. "Preemption" prevents deadlock rather than causing it.',
    misconception: 'The condition is *No Preemption*, meaning once a process holds a resource, only that process can release it voluntarily.',
    estimatedSeconds: 30
  },
  {
    id: 'os-04',
    topic: 'Operating Systems',
    difficulty: 'Intermediate',
    question: 'What hardware component accelerates virtual-to-physical address translation by caching recent page table mappings?',
    options: [
      'Translation Lookaside Buffer (TLB)',
      'Direct Memory Access (DMA) controller',
      'Interrupt Vector Table (IVT)',
      'Programmable Interval Timer'
    ],
    correctAnswerIndex: 0,
    explanation: 'The TLB is a high-speed associative hardware cache in the Memory Management Unit (MMU) that stores recent virtual-to-physical page mappings, avoiding an extra main-memory lookup on page hits.',
    misconception: 'A page fault occurs when a mapping is absent from physical RAM; a TLB miss simply means the mapping must be looked up in the page table in RAM.',
    estimatedSeconds: 30
  },
  {
    id: 'os-05',
    topic: 'Operating Systems',
    difficulty: 'Intermediate',
    question: 'What is "Thrashing" in a virtual memory operating system?',
    options: [
      'A state where the system spends more time swapping pages in and out of disk than executing instructions',
      'Rapid CPU switching between threads that exhausts hardware registers',
      'Corrupt sector fragmentation on solid-state drives',
      'Repeated synchronization deadlocks in multithreaded code'
    ],
    correctAnswerIndex: 0,
    explanation: 'Thrashing occurs when the total working set of active processes exceeds physical RAM capacity. The OS continuously page-faults and swaps pages to disk, dropping CPU utilization to near zero.',
    misconception: 'Thrashing is not high CPU utilization; it is characterized by high disk I/O wait with plummeting CPU utilization.',
    estimatedSeconds: 30
  },
  {
    id: 'os-06',
    topic: 'Operating Systems',
    difficulty: 'Advanced',
    question: 'How does a counting semaphore differ from a binary mutex lock in thread synchronization?',
    options: [
      'A mutex has ownership semantics (only the locking thread can unlock it); a semaphore has no ownership and can be signaled by any thread',
      'A semaphore can only be accessed in user space, while a mutex is kernel-only',
      'A mutex allows any integer value of concurrent accesses, while a semaphore allows 0 or 1',
      'Semaphores prevent priority inversion automatically via priority inheritance'
    ],
    correctAnswerIndex: 0,
    explanation: 'A mutex is an ownership lock: the thread that acquires it MUST release it. A semaphore is a signaling mechanism representing available resource permits; thread A can wait (`P()`) and thread B can signal (`V()`).',
    misconception: 'A binary semaphore is not identical to a mutex because it lacks thread ownership, making it susceptible to accidental releases across threads.',
    estimatedSeconds: 35
  },
  {
    id: 'os-07',
    topic: 'Operating Systems',
    difficulty: 'Advanced',
    question: 'What happens during a context switch between two different user processes on a modern CPU?',
    options: [
      'CPU registers and program counter are saved to the PCB, the MMU page table base pointer (CR3) is updated, and TLB entries are flushed or tagged',
      'The entire RAM contents of the old process are dumped to swap space on disk',
      'The operating system reboots the CPU microcode',
      'Only the stack pointer register is updated while address spaces remain identical'
    ],
    correctAnswerIndex: 0,
    explanation: 'A process context switch saves the CPU register state to the Process Control Block (PCB), switches the kernel stack, updates page directory registers (e.g. CR3 on x86), and invalidates/switches address translation caches (TLB).',
    misconception: 'Thread switches inside the same process are faster because they don’t switch the page table base pointer or invalidate the virtual memory address space.',
    estimatedSeconds: 40
  },

  // =========================================================================
  // 6. COMPUTER NETWORKS (7 questions)
  // =========================================================================
  {
    id: 'cn-01',
    topic: 'Computer Networks',
    difficulty: 'Beginner',
    question: 'What is the primary difference in transmission reliability between TCP and UDP?',
    options: [
      'TCP is connection-oriented with guaranteed in-order delivery and flow control; UDP is connectionless and best-effort',
      'UDP guarantees delivery with retransmissions; TCP does not check for dropped packets',
      'TCP operates at the Network layer; UDP operates at the Data Link layer',
      'TCP only works over wired fiber cables; UDP is exclusively wireless'
    ],
    correctAnswerIndex: 0,
    explanation: 'TCP (Transmission Control Protocol) establishes a connection via 3-way handshake and guarantees in-order, error-checked packet delivery. UDP (User Datagram Protocol) transmits datagrams without handshake or acknowledgments for minimum latency.',
    misconception: 'UDP is not "inferior" to TCP; it is deliberately chosen for real-time applications (gaming, VoIP, live streaming) where retransmission delays would ruin the user experience.',
    estimatedSeconds: 25
  },
  {
    id: 'cn-02',
    topic: 'Computer Networks',
    difficulty: 'Beginner',
    question: 'What standard protocol translates human-readable domain names (like dypcoe.edu) into IP addresses?',
    options: [
      'DNS (Domain Name System)',
      'DHCP (Dynamic Host Configuration Protocol)',
      'ARP (Address Resolution Protocol)',
      'SNMP (Simple Network Management Protocol)'
    ],
    correctAnswerIndex: 0,
    explanation: 'DNS resolves alphanumeric domain names into numerical IP addresses so network routers can route packets to the destination host.',
    misconception: 'ARP resolves an IP address to a local physical MAC address on an Ethernet segment, not domain names to IP addresses.',
    estimatedSeconds: 20
  },
  {
    id: 'cn-03',
    topic: 'Computer Networks',
    difficulty: 'Intermediate',
    question: 'What sequence of packet flags constitutes the standard TCP 3-Way Handshake for connection establishment?',
    options: [
      'SYN -> SYN-ACK -> ACK',
      'ACK -> SYN -> ACK-SYN',
      'FIN -> ACK -> FIN-ACK',
      'HELLO -> VERIFY -> CONNECT'
    ],
    correctAnswerIndex: 0,
    explanation: 'Client sends a SYN packet with initial sequence number X. Server responds with SYN-ACK containing its own sequence number Y and acknowledging X+1. Client replies with an ACK for Y+1, completing the connection.',
    misconception: 'The 4-way handshake (FIN -> ACK -> FIN -> ACK) is used for connection termination, not establishment.',
    estimatedSeconds: 25
  },
  {
    id: 'cn-04',
    topic: 'Computer Networks',
    difficulty: 'Intermediate',
    question: 'What layer of the OSI 7-layer reference model is responsible for routing packets across intermediate hops and logical IP addressing?',
    options: [
      'Network Layer (Layer 3)',
      'Transport Layer (Layer 4)',
      'Data Link Layer (Layer 2)',
      'Session Layer (Layer 5)'
    ],
    correctAnswerIndex: 0,
    explanation: 'Layer 3 (Network Layer) manages logical addressing (IP addresses) and path determination (routing) across interconnected networks.',
    misconception: 'Switches typically operate at Layer 2 (Data Link / MAC addresses), while Routers operate at Layer 3 (Network / IP addresses).',
    estimatedSeconds: 25
  },
  {
    id: 'cn-05',
    topic: 'Computer Networks',
    difficulty: 'Intermediate',
    question: 'Why does HTTPS require TLS/SSL encryption over standard plaintext HTTP port 80?',
    options: [
      'To provide confidentiality against eavesdropping, integrity against packet tampering, and authentication of the remote server',
      'To compress payload sizes by 90% and speed up static file downloads',
      'To bypass ISP network firewalls automatically',
      'Because modern browsers refuse to compile JavaScript over unencrypted protocols'
    ],
    correctAnswerIndex: 0,
    explanation: 'TLS encrypts data in transit so intermediate network snoops cannot inspect plaintext passwords or session cookies, uses MAC hashes to prevent man-in-the-middle tampering, and validates the server’s certificate identity.',
    misconception: 'HTTPS does not hide the domain name queried in standard DNS or initial SNI, but it encrypts all URL paths, query parameters, headers, and body payloads.',
    estimatedSeconds: 30
  },
  {
    id: 'cn-06',
    topic: 'Computer Networks',
    difficulty: 'Advanced',
    question: 'How does TCP Congestion Control’s "Slow Start" phase increase its congestion window (cwnd)?',
    options: [
      'It increases cwnd exponentially by 1 MSS for every incoming ACK (doubling cwnd every RTT) until ssthresh is reached',
      'It increments cwnd linearly by 1 packet per round-trip time throughout the connection lifetime',
      'It immediately sets cwnd to the maximum receive buffer size announced by the server',
      'It halves cwnd every time an acknowledgment is received'
    ],
    correctAnswerIndex: 0,
    explanation: 'Despite the name "Slow Start", growth is exponential: for every ACK received, cwnd grows by 1 MSS, effectively doubling the congestion window every Round Trip Time (RTT) until reaching the slow-start threshold (`ssthresh`).',
    misconception: 'Slow start is not linear; the phase after slow start (Congestion Avoidance) increases cwnd linearly by 1 MSS per RTT.',
    estimatedSeconds: 35
  },
  {
    id: 'cn-07',
    topic: 'Computer Networks',
    difficulty: 'Advanced',
    question: 'What is the function of the "Time-To-Live" (TTL) field in an IPv4 packet header?',
    options: [
      'It decrements by 1 at each router hop to prevent packets from looping infinitely in network routing loops',
      'It measures the round-trip latency in milliseconds between client and server',
      'It specifies the expiration timestamp for web cookies in HTTP caches',
      'It instructs the destination operating system when to terminate socket connections'
    ],
    correctAnswerIndex: 0,
    explanation: 'TTL is an 8-bit counter decremented by each router that processes the packet. When TTL reaches 0, the packet is discarded and an ICMP "Time Exceeded" message is sent back, preventing forwarding loops from saturating the internet.',
    misconception: 'TTL is not measured in seconds or milliseconds on modern networks; it is a hop counter decremented at each layer-3 router.',
    estimatedSeconds: 35
  },

  // =========================================================================
  // 7. SOFTWARE ENGINEERING (6 questions)
  // =========================================================================
  {
    id: 'se-01',
    topic: 'Software Engineering',
    difficulty: 'Beginner',
    question: 'In Git version control, what is the difference between `git fetch` and `git pull`?',
    options: [
      '`git fetch` downloads remote commits without merging them into your current branch; `git pull` fetches and automatically merges them',
      '`git pull` updates only the remote origin, while `git fetch` modifies working tree files directly',
      '`git fetch` deletes local uncommitted changes; `git pull` stashes them',
      '`git pull` is used for GitHub only, while `git fetch` is used for GitLab'
    ],
    correctAnswerIndex: 0,
    explanation: '`git fetch` updates your local copy of remote tracking branches (e.g. `origin/main`) without modifying your current checked-out branch. `git pull` performs a `git fetch` followed immediately by a `git merge`.',
    misconception: 'Running `git pull` can introduce unexpected merge conflicts if local changes clash with fetched remote commits.',
    estimatedSeconds: 25
  },
  {
    id: 'se-02',
    topic: 'Software Engineering',
    difficulty: 'Beginner',
    question: 'What is the primary objective of "Unit Testing" in the testing pyramid?',
    options: [
      'To test isolated individual functions or classes in isolation from external systems and dependencies',
      'To verify the visual styling and responsiveness of the user interface on real mobile devices',
      'To simulate 10,000 concurrent candidate connections for load testing',
      'To validate end-to-end payment gateway transaction settlement'
    ],
    correctAnswerIndex: 0,
    explanation: 'Unit tests test the smallest testable units of software (functions, classes) in isolation, using mocks/stubs for external dependencies like databases or APIs.',
    misconception: 'A test that connects to a real external database or makes live network calls is an Integration Test, not a pure Unit Test.',
    estimatedSeconds: 20
  },
  {
    id: 'se-03',
    topic: 'Software Engineering',
    difficulty: 'Intermediate',
    question: 'In Agile Scrum methodology, what occurs during the "Sprint Retrospective" meeting?',
    options: [
      'The team inspects past sprint processes, discusses what went well and what didn\'t, and commits to improvements for the next sprint',
      'The product owner assigns story points to unestimated backlog tickets',
      'Developers demo working software features to stakeholders and customers',
      'Management decides engineer compensation and annual promotions'
    ],
    correctAnswerIndex: 0,
    explanation: 'The Sprint Retrospective occurs at the conclusion of a sprint for the Scrum team to inspect itself regarding individuals, interactions, processes, and tools, creating an actionable plan for continuous improvement.',
    misconception: 'Demonstrating working software to stakeholders happens in the Sprint Review (Demo), not the Sprint Retrospective.',
    estimatedSeconds: 25
  },
  {
    id: 'se-04',
    topic: 'Software Engineering',
    difficulty: 'Intermediate',
    question: 'What does "Continuous Integration" (CI) practice require developers to do regularly?',
    options: [
      'Merge their code changes into the shared mainline branch multiple times a day, backed by automated builds and test verification',
      'Deploy code manually to production servers every morning',
      'Write all software code using pair programming exclusively',
      'Avoid using external dependencies or open-source packages'
    ],
    correctAnswerIndex: 0,
    explanation: 'CI is the development practice where developers merge their working code into the central trunk frequently. Each integration is verified by an automated build and automated test suite to detect integration issues immediately.',
    misconception: 'CI refers to continuous integration and automated testing; Continuous Delivery (CD) refers to packaging and deploying that tested code to environments.',
    estimatedSeconds: 30
  },
  {
    id: 'se-05',
    topic: 'Software Engineering',
    difficulty: 'Advanced',
    question: 'What is the distinction between a "Hotfix" and a regular feature branch workflow in production release management?',
    options: [
      'A hotfix branches directly off the production release tag to patch a critical live incident, then merges back to both main and development branches',
      'Hotfixes are unreviewed commits pushed directly to production servers via SSH without tests',
      'Hotfixes can only be authored by the DevOps lead during weekend maintenance windows',
      'Hotfixes apply only to database schema migrations and never application code'
    ],
    correctAnswerIndex: 0,
    explanation: 'A hotfix addresses critical production outages or vulnerabilities. It branches off the release tag, applies the minimum necessary surgical fix, and is merged back into both the release branch and the active development branch to prevent regression.',
    misconception: 'Emergency hotfixes must still follow peer review and test verification; skipping version control directly on servers creates unrepeatable configuration drift.',
    estimatedSeconds: 35
  },
  {
    id: 'se-06',
    topic: 'Software Engineering',
    difficulty: 'Advanced',
    question: 'What architectural principle is championed by the "Strangler Fig" pattern during legacy software modernization?',
    options: [
      'Gradually replacing legacy system functionalities with new microservices piece-by-piece until the old system is completely phased out',
      'Shutting down the legacy monolith overnight and replacing it with a new architecture on a single date',
      'Wrapping all legacy database calls inside stored procedures exclusively',
      'Running old code inside emulated virtual machine hypervisors forever'
    ],
    correctAnswerIndex: 0,
    explanation: 'Inspired by strangler fig trees, this pattern incrementally replaces parts of an old monolithic system with modern services behind an API facade/reverse proxy, mitigating the catastrophic failure risks of a "big bang" rewrite.',
    misconception: 'Big-bang complete rewrites carry enormous business risk and often fail; Strangler Fig provides continuous incremental delivery with zero downtime.',
    estimatedSeconds: 40
  }
];
