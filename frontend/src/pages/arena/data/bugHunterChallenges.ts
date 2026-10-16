import { BugChallenge } from '../types/bugHunter';

export const STARTER_BUG_CHALLENGES: BugChallenge[] = [
  // 1. Python - Binary Search Loop Trap (Beginner - Logic)
  {
    id: 'bug-01',
    title: 'Binary Search Infinite Loop on Missing Key',
    language: 'Python',
    difficulty: 'Beginner',
    category: 'Logic',
    problemStatement: 'Search for target in a sorted list. When the target is not present, the search should return -1. Instead, it hangs indefinitely.',
    expectedBehavior: 'Returns index if target exists, or -1 when target is absent.',
    actualBehavior: 'Loops forever when searching for elements between existing values or larger than max.',
    faultyCode: `def binary_search(arr, target):
    low = 0
    high = len(arr) - 1
    while low <= high:
        mid = (low + high) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            low = mid
        else:
            high = mid - 1
    return -1`,
    faultyLineNumber: 9,
    bugOptions: [
      { category: 'Logic', explanation: 'Line 9 sets low = mid instead of low = mid + 1, preventing the search window from shrinking when low == mid.', isCorrect: true },
      { category: 'Syntax', explanation: 'Integer division // is invalid in Python 3 for indices.', isCorrect: false },
      { category: 'Runtime', explanation: 'IndexError occurs because high exceeds the array length.', isCorrect: false },
      { category: 'Edge Cases', explanation: 'The function does not support even-length lists.', isCorrect: false }
    ],
    fixOptions: [
      { id: 'f1', codeSnippet: 'low = mid + 1', explanation: 'Advance low past mid so the search interval strictly decreases.', isCorrect: true },
      { id: 'f2', codeSnippet: 'low = mid - 1', explanation: 'Sets low to before mid, corrupting the search direction.', isCorrect: false },
      { id: 'f3', codeSnippet: 'high = mid', explanation: 'Adjusts the wrong boundary pointer.', isCorrect: false }
    ],
    correctedCode: `def binary_search(arr, target):
    low = 0
    high = len(arr) - 1
    while low <= high:
        mid = (low + high) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1`,
    correctDiagnosis: 'Off-by-one pointer advance: low = mid allows low and high to get stuck when low == mid, looping forever.',
    whyOriginalFailed: 'When arr[mid] < target and high == low + 1, mid evaluates to low. Setting low = mid leaves low unchanged, causing an infinite loop.',
    whyFixWorks: 'Advancing low to mid + 1 guarantees that the interval (high - low) strictly shrinks in every iteration.',
    testCases: [
      { id: 'tc-1', name: 'Element Found', input: 'arr = [2, 5, 8, 12, 16], target = 8', expectedOutput: '2', actualWithBug: '2', exposesBug: false, explanation: 'Direct hit on first mid calculation.' },
      { id: 'tc-2', name: 'Element Missing (Between)', input: 'arr = [2, 5, 8, 12, 16], target = 6', expectedOutput: '-1', actualWithBug: 'Time Limit Exceeded (Infinite Loop)', exposesBug: true, explanation: 'Window narrows to indices 1 and 2, then freezes at mid = 1.' },
      { id: 'tc-3', name: 'Target Greater than All', input: 'arr = [1, 3, 5], target = 7', expectedOutput: '-1', actualWithBug: 'Time Limit Exceeded (Infinite Loop)', exposesBug: true, explanation: 'Mid stays stuck at 2 without progressing past high.' }
    ],
    exposingTestCaseId: 'tc-2',
    hints: [
      { text: 'Look closely at lines 8 to 11 where the interval pointers update.', penalty: 3 },
      { text: 'Check what happens to low when (low + high) // 2 equals low.', penalty: 5 },
      { text: 'In binary search, the midpoint has already been checked and rejected. You must skip it: low = mid + 1.', penalty: 8 }
    ],
    points: 15,
    timeLimitSeconds: 75,
    interviewTip: 'Interviewers look for binary search termination proofs. Always ensure both branches strictly reduce the search window by at least 1 element.'
  },

  // 2. Java - String Equality Identity vs Content (Beginner - Syntax)
  {
    id: 'bug-02',
    title: 'Java String Content Comparison with ==',
    language: 'Java',
    difficulty: 'Beginner',
    category: 'Syntax',
    problemStatement: 'Authenticate a user password against a stored secret. Passwords with identical characters are being rejected.',
    expectedBehavior: 'Returns true when the entered password matches the stored password in text content.',
    actualBehavior: 'Returns false for dynamically generated or user-inputted strings with identical text.',
    faultyCode: `public class AuthValidator {
    public static boolean checkPassword(String input, String expected) {
        if (input == null || expected == null) {
            return false;
        }
        if (input == expected) {
            return true;
        }
        return false;
    }
}`,
    faultyLineNumber: 6,
    bugOptions: [
      { category: 'Syntax', explanation: 'Using == compares object memory references rather than character sequence equality.', isCorrect: true },
      { category: 'Logic', explanation: 'The null check should throw an exception instead of returning false.', isCorrect: false },
      { category: 'Runtime', explanation: 'String indexing throws NullPointerException on empty strings.', isCorrect: false },
      { category: 'Algorithms', explanation: 'Strings in Java must be hashed with hashCode() before comparison.', isCorrect: false }
    ],
    fixOptions: [
      { id: 'f1', codeSnippet: 'return input.equals(expected);', explanation: 'Compares the actual character contents of both String objects.', isCorrect: true },
      { id: 'f2', codeSnippet: 'return input.compareTo(expected) == 1;', explanation: 'compareTo returns 0 on match, not 1.', isCorrect: false },
      { id: 'f3', codeSnippet: 'return input.hashCode() == expected.hashCode();', explanation: 'Hash code equality suffers from collisions and does not guarantee content equality.', isCorrect: false }
    ],
    correctedCode: `public class AuthValidator {
    public static boolean checkPassword(String input, String expected) {
        if (input == null || expected == null) {
            return false;
        }
        return input.equals(expected);
    }
}`,
    correctDiagnosis: 'In Java, == checks reference equality (memory address), while .equals() compares value equality.',
    whyOriginalFailed: 'When strings are created at runtime (e.g. from Scanner or HTTP request), they are allocated new heap addresses outside the string intern pool, causing input == expected to evaluate to false.',
    whyFixWorks: 'The String.equals() method overrides Object.equals to inspect the underlying char array byte-by-byte.',
    testCases: [
      { id: 'tc-1', name: 'Identical String Literals', input: 'input = "admin", expected = "admin"', expectedOutput: 'true', actualWithBug: 'true', exposesBug: false, explanation: 'Compilers intern identical string literals to the same pool address.' },
      { id: 'tc-2', name: 'Heap Allocated Duplicate', input: 'input = new String("secret"), expected = "secret"', expectedOutput: 'true', actualWithBug: 'false', exposesBug: true, explanation: 'Distinct heap instances have different memory addresses, failing ==.' },
      { id: 'tc-3', name: 'Null Input', input: 'input = null, expected = "secret"', expectedOutput: 'false', actualWithBug: 'false', exposesBug: false, explanation: 'Caught by guard clause.' }
    ],
    exposingTestCaseId: 'tc-2',
    hints: [
      { text: 'Look at how input is compared to expected on line 6.', penalty: 3 },
      { text: 'Remember Java primitive types vs reference objects.', penalty: 5 },
      { text: 'Replace == with input.equals(expected) to compare string contents.', penalty: 8 }
    ],
    points: 15,
    timeLimitSeconds: 60,
    interviewTip: 'A classic Java screening question: == checks reference identity; .equals() checks logical content equality.'
  },

  // 3. JavaScript - Array Sort Numerical Trap (Beginner - Logic)
  {
    id: 'bug-03',
    title: 'JavaScript Default Lexicographical Sort',
    language: 'JavaScript',
    difficulty: 'Beginner',
    category: 'Logic',
    problemStatement: 'Sort an array of scores in ascending numerical order. Scores like 100 appear before 25.',
    expectedBehavior: 'Returns numbers sorted numerically: [5, 9, 25, 100].',
    actualBehavior: 'Produces [100, 25, 5, 9] because elements are sorted as strings alphabetically.',
    faultyCode: `function sortScores(scores) {
    if (!Array.isArray(scores)) return [];
    
    // Sort scores ascending
    const sorted = [...scores].sort();
    return sorted;
}`,
    faultyLineNumber: 5,
    bugOptions: [
      { category: 'Logic', explanation: 'Array.prototype.sort() without a comparator converts elements to strings and compares UTF-16 code units.', isCorrect: true },
      { category: 'Syntax', explanation: 'The spread operator [...scores] is invalid inside array sorting.', isCorrect: false },
      { category: 'Runtime', explanation: 'Calling sort() on an array throws TypeError in modern ECMAScript.', isCorrect: false },
      { category: 'Edge Cases', explanation: 'The function fails when scores has fewer than 2 elements.', isCorrect: false }
    ],
    fixOptions: [
      { id: 'f1', codeSnippet: 'const sorted = [...scores].sort((a, b) => a - b);', explanation: 'Passes a numeric comparator that compares a - b.', isCorrect: true },
      { id: 'f2', codeSnippet: 'const sorted = [...scores].sort((a, b) => a > b);', explanation: 'Comparator must return negative, zero, or positive number, not boolean.', isCorrect: false },
      { id: 'f3', codeSnippet: 'const sorted = [...scores].reverse();', explanation: 'Simply reverses the list without sorting.', isCorrect: false }
    ],
    correctedCode: `function sortScores(scores) {
    if (!Array.isArray(scores)) return [];
    
    // Sort scores ascending numerically
    const sorted = [...scores].sort((a, b) => a - b);
    return sorted;
}`,
    correctDiagnosis: 'Default JavaScript sort converts all values to strings. "100" comes before "25" in lexicographical order.',
    whyOriginalFailed: 'Array.prototype.sort() converts numbers to strings by default. The string "100" begins with "1", which is lexicographically smaller than "2".',
    whyFixWorks: 'Providing (a, b) => a - b instructs the sorting algorithm to evaluate numerical difference.',
    testCases: [
      { id: 'tc-1', name: 'Single Digit Numbers', input: '[3, 1, 4]', expectedOutput: '[1, 3, 4]', actualWithBug: '[1, 3, 4]', exposesBug: false, explanation: 'Single digits coincidentally order identically in string and numeric sort.' },
      { id: 'tc-2', name: 'Mixed Digits Order', input: '[25, 100, 9, 5]', expectedOutput: '[5, 9, 25, 100]', actualWithBug: '[100, 25, 5, 9]', exposesBug: true, explanation: 'String "100" sorts before "25", revealing the lexicographical bug.' },
      { id: 'tc-3', name: 'Negative Numbers', input: '[-5, -10, 0, 5]', expectedOutput: '[-10, -5, 0, 5]', actualWithBug: '[-10, -5, 0, 5]', exposesBug: false, explanation: 'Negative signs sort first by ASCII.' }
    ],
    exposingTestCaseId: 'tc-2',
    hints: [
      { text: 'Examine line 5 where .sort() is invoked with no arguments.', penalty: 3 },
      { text: 'Think about how JavaScript treats numbers when converting them implicitly.', penalty: 5 },
      { text: 'Use a comparator function: .sort((a, b) => a - b).', penalty: 8 }
    ],
    points: 15,
    timeLimitSeconds: 60,
    interviewTip: 'Always pass a comparison callback to JS Array.prototype.sort() when sorting numbers or custom objects.'
  },

  // 4. C++ - Array Out of Bounds in Loop Condition (Beginner - Runtime)
  {
    id: 'bug-04',
    title: 'C++ Off-by-One Array Boundary Violation',
    language: 'C++',
    difficulty: 'Beginner',
    category: 'Runtime',
    problemStatement: 'Sum all elements in a standard std::vector<int>. On large tests, memory corruption or segmentation faults occur.',
    expectedBehavior: 'Computes sum of vector elements from index 0 to size - 1.',
    actualBehavior: 'Reads unallocated memory past the vector buffer and crashes with Segmentation Fault.',
    faultyCode: `#include <vector>

int computeSum(const std::vector<int>& arr) {
    int total = 0;
    for (size_t i = 0; i <= arr.size(); ++i) {
        total += arr[i];
    }
    return total;
}`,
    faultyLineNumber: 5,
    bugOptions: [
      { category: 'Runtime', explanation: 'Condition i <= arr.size() accesses arr[arr.size()], which is an out-of-bounds read.', isCorrect: true },
      { category: 'Syntax', explanation: 'size_t cannot be used as an index type in C++.', isCorrect: false },
      { category: 'Logic', explanation: 'The total variable must be initialized to 1 for vector sums.', isCorrect: false },
      { category: 'Algorithms', explanation: 'C++ vectors cannot be passed by const reference.', isCorrect: false }
    ],
    fixOptions: [
      { id: 'f1', codeSnippet: 'for (size_t i = 0; i < arr.size(); ++i)', explanation: 'Changes <= to < so the last accessed index is arr.size() - 1.', isCorrect: true },
      { id: 'f2', codeSnippet: 'for (size_t i = 1; i <= arr.size(); ++i)', explanation: 'Skips index 0 and still reads out of bounds at arr.size().', isCorrect: false },
      { id: 'f3', codeSnippet: 'for (size_t i = 0; i < arr.size() - 1; ++i)', explanation: 'Omits the final valid element of the vector.', isCorrect: false }
    ],
    correctedCode: `#include <vector>

int computeSum(const std::vector<int>& arr) {
    int total = 0;
    for (size_t i = 0; i < arr.size(); ++i) {
        total += arr[i];
    }
    return total;
}`,
    correctDiagnosis: 'Zero-indexed arrays of size N have indices 0 to N-1. The <= operator evaluates at index N.',
    whyOriginalFailed: 'When i reaches arr.size(), arr[i] accesses memory beyond the allocated vector storage, invoking undefined behavior or segfault.',
    whyFixWorks: 'Using i < arr.size() ensures loop termination as soon as i reaches size, accessing strictly valid elements.',
    testCases: [
      { id: 'tc-1', name: 'Empty Vector', input: 'arr = {}', expectedOutput: '0', actualWithBug: 'Undefined Memory Access', exposesBug: true, explanation: 'Attempts to read arr[0] when vector is empty.' },
      { id: 'tc-2', name: 'Standard 3-Element Vector', input: 'arr = {10, 20, 30}', expectedOutput: '60', actualWithBug: 'Garbage memory added (e.g. 60 + random)', exposesBug: true, explanation: 'Reads index 3 (out of bounds).' }
    ],
    exposingTestCaseId: 'tc-1',
    hints: [
      { text: 'Look at the loop termination operator on line 5.', penalty: 3 },
      { text: 'What is the highest valid index of a vector with size N?', penalty: 5 },
      { text: 'Change i <= arr.size() to i < arr.size().', penalty: 8 }
    ],
    points: 15,
    timeLimitSeconds: 60,
    interviewTip: 'Off-by-one boundary leaks are a primary cause of buffer overflow vulnerabilities in C/C++.'
  },

  // 5. Python - Two Sum Self-Match Bug (Beginner - Edge Cases)
  {
    id: 'bug-05',
    title: 'Two Sum Duplicate Element Self-Matching',
    language: 'Python',
    difficulty: 'Beginner',
    category: 'Edge Cases',
    problemStatement: 'Find two indices whose values add up to target. Each element may be used at most once.',
    expectedBehavior: 'Returns two distinct indices [i, j] where i != j.',
    actualBehavior: 'Returns [i, i] reusing the same element twice when target == 2 * arr[i].',
    faultyCode: `def two_sum(nums, target):
    lookup = {}
    for i, num in enumerate(nums):
        lookup[num] = i
        
    for i, num in enumerate(nums):
        complement = target - num
        if complement in lookup:
            return [i, lookup[complement]]
    return []`,
    faultyLineNumber: 9,
    bugOptions: [
      { category: 'Edge Cases', explanation: 'Line 9 fails to verify that lookup[complement] != i, allowing an element to pair with itself.', isCorrect: true },
      { category: 'Syntax', explanation: 'Enumerate cannot unpack index and value simultaneously.', isCorrect: false },
      { category: 'Runtime', explanation: 'Dictionary lookup throws KeyError on missing keys.', isCorrect: false },
      { category: 'Algorithms', explanation: 'Two Sum cannot be solved using a hash map.', isCorrect: false }
    ],
    fixOptions: [
      { id: 'f1', codeSnippet: 'if complement in lookup and lookup[complement] != i:', explanation: 'Ensures the complement is located at a different index.', isCorrect: true },
      { id: 'f2', codeSnippet: 'if complement != num:', explanation: 'Incorrectly rejects valid cases where two separate elements share the same value (e.g. [3, 3]).', isCorrect: false },
      { id: 'f3', codeSnippet: 'if complement in lookup and i > 0:', explanation: 'Arbitrarily blocks index 0 from being returned.', isCorrect: false }
    ],
    correctedCode: `def two_sum(nums, target):
    lookup = {}
    for i, num in enumerate(nums):
        lookup[num] = i
        
    for i, num in enumerate(nums):
        complement = target - num
        if complement in lookup and lookup[complement] != i:
            return [i, lookup[complement]]
    return []`,
    correctDiagnosis: 'Self-matching bug: when target == 2 * num, lookup[complement] matches the current index i.',
    whyOriginalFailed: 'If nums = [4, 2, 7] and target = 8, complement is 4. The dictionary lookup finds 4 at index 0, returning [0, 0] instead of looking for distinct elements.',
    whyFixWorks: 'Checking lookup[complement] != i enforces the rule that distinct array indices must be chosen.',
    testCases: [
      { id: 'tc-1', name: 'Distinct Numbers', input: 'nums = [2, 7, 11, 15], target = 9', expectedOutput: '[0, 1]', actualWithBug: '[0, 1]', exposesBug: false, explanation: 'Target 9 is formed by 2 and 7 at different indices.' },
      { id: 'tc-2', name: 'Self Matching Single Value', input: 'nums = [4, 5, 9], target = 8', expectedOutput: '[]', actualWithBug: '[0, 0]', exposesBug: true, explanation: 'Element 4 pairs with itself to falsely claim 8.' },
      { id: 'tc-3', name: 'Two Identical Values', input: 'nums = [3, 3], target = 6', expectedOutput: '[0, 1]', actualWithBug: '[0, 1]', exposesBug: false, explanation: 'Second 3 overwrote lookup[3] = 1, so index 0 paired with 1.' }
    ],
    exposingTestCaseId: 'tc-2',
    hints: [
      { text: 'Look at the condition on line 9 inside the second loop.', penalty: 3 },
      { text: 'What happens when target is exactly twice the value of an element in nums?', penalty: 5 },
      { text: 'Add lookup[complement] != i to ensure the element does not pair with itself.', penalty: 8 }
    ],
    points: 20,
    timeLimitSeconds: 75,
    interviewTip: 'In hash map lookups, always consider if the queried key could be the current element itself.'
  },

  // 6. Java - Integer Division Truncation in Average (Beginner - Logic)
  {
    id: 'bug-06',
    title: 'Java Integer Division Truncating Decimals',
    language: 'Java',
    difficulty: 'Beginner',
    category: 'Logic',
    problemStatement: 'Compute the average score of students. The returned double value loses all fractional precision.',
    expectedBehavior: 'Returns precise floating point average: 7 / 2 should return 3.5.',
    actualBehavior: 'Returns 3.0 because integer division truncates before casting to double.',
    faultyCode: `public class GradeCalculator {
    public static double computeAverage(int[] grades) {
        if (grades == null || grades.length == 0) return 0.0;
        
        int sum = 0;
        for (int grade : grades) {
            sum += grade;
        }
        double average = sum / grades.length;
        return average;
    }
}`,
    faultyLineNumber: 9,
    bugOptions: [
      { category: 'Logic', explanation: 'sum / grades.length performs integer division first, discarding the remainder before assigning to double.', isCorrect: true },
      { category: 'Syntax', explanation: 'Enhanced for-loops cannot accumulate primitive integers.', isCorrect: false },
      { category: 'Runtime', explanation: 'Division by length throws ArithmeticException for non-zero arrays.', isCorrect: false },
      { category: 'Algorithms', explanation: 'Arrays must be sorted before calculating averages.', isCorrect: false }
    ],
    fixOptions: [
      { id: 'f1', codeSnippet: 'double average = (double) sum / grades.length;', explanation: 'Casts sum to double so floating-point division is performed.', isCorrect: true },
      { id: 'f2', codeSnippet: 'double average = (double) (sum / grades.length);', explanation: 'Still performs integer division first before casting the truncated result.', isCorrect: false },
      { id: 'f3', codeSnippet: 'double average = sum / (double) 2;', explanation: 'Hardcodes divisor to 2 instead of array length.', isCorrect: false }
    ],
    correctedCode: `public class GradeCalculator {
    public static double computeAverage(int[] grades) {
        if (grades == null || grades.length == 0) return 0.0;
        
        int sum = 0;
        for (int grade : grades) {
            sum += grade;
        }
        double average = (double) sum / grades.length;
        return average;
    }
}`,
    correctDiagnosis: 'In Java, dividing two integers always yields an integer. Casting the result after division preserves the truncated value.',
    whyOriginalFailed: 'sum / grades.length operates on ints. 7 / 2 evaluates to integer 3, which is then widened to 3.0.',
    whyFixWorks: '(double) sum promotes the dividend to a 64-bit float, forcing floating-point division to yield 3.5.',
    testCases: [
      { id: 'tc-1', name: 'Even Division', input: 'grades = [10, 20, 30]', expectedOutput: '20.0', actualWithBug: '20.0', exposesBug: false, explanation: '60 / 3 divides cleanly.' },
      { id: 'tc-2', name: 'Fractional Division', input: 'grades = [4, 5]', expectedOutput: '4.5', actualWithBug: '4.0', exposesBug: true, explanation: '9 / 2 truncates to 4 before assigning to double.' }
    ],
    exposingTestCaseId: 'tc-2',
    hints: [
      { text: 'Look at line 9: double average = sum / grades.length.', penalty: 3 },
      { text: 'What is the type of sum and the type of grades.length?', penalty: 5 },
      { text: 'Cast at least one operand to double before division: (double) sum / grades.length.', penalty: 8 }
    ],
    points: 15,
    timeLimitSeconds: 60,
    interviewTip: 'Be alert to integer division truncation in math calculations like percentages, rates, and midpoint indices.'
  },

  // 7. Python - Mutable Default Argument Gotcha (Intermediate - Logic)
  {
    id: 'bug-07',
    title: 'Python Mutable Default Argument Accumulator',
    language: 'Python',
    difficulty: 'Intermediate',
    category: 'Logic',
    problemStatement: 'Function appends an item to a log list. Successive calls with default arguments leak items from previous invocations.',
    expectedBehavior: 'Each call without an explicit list creates a fresh independent list containing only the passed item.',
    actualBehavior: 'Items accumulate across independent function calls because the default list is created once at definition time.',
    faultyCode: `def record_event(event_name, events=[]):
    events.append(event_name)
    return events`,
    faultyLineNumber: 1,
    bugOptions: [
      { category: 'Logic', explanation: 'Default arguments are evaluated once when the function is defined, sharing the same list across all calls.', isCorrect: true },
      { category: 'Syntax', explanation: 'Default arguments must be specified with tuples instead of lists.', isCorrect: false },
      { category: 'Runtime', explanation: 'Appending to a default argument triggers UnboundLocalError.', isCorrect: false },
      { category: 'Edge Cases', explanation: 'String event names cannot be added to a list.', isCorrect: false }
    ],
    fixOptions: [
      { id: 'f1', codeSnippet: `def record_event(event_name, events=None):
    if events is None:
        events = []
    events.append(event_name)
    return events`, explanation: 'Uses None sentinel and instantiates a new list on each call.', isCorrect: true },
      { id: 'f2', codeSnippet: `def record_event(event_name, events=list()):
    events.append(event_name)
    return events`, explanation: 'list() is still evaluated once at function definition time.', isCorrect: false },
      { id: 'f3', codeSnippet: `def record_event(event_name, events=[]):
    return [event_name] + events`, explanation: 'Avoids modifying events in-place, but keeps referencing stale defaults.', isCorrect: false }
    ],
    correctedCode: `def record_event(event_name, events=None):
    if events is None:
        events = []
    events.append(event_name)
    return events`,
    correctDiagnosis: 'Python mutable default arguments are bound at module load time and retained across invocations.',
    whyOriginalFailed: 'def record_event(event_name, events=[]) attaches a single list instance to the function object. Calling record_event("A") and then record_event("B") results in ["A", "B"].',
    whyFixWorks: 'Setting default to None and checking if events is None ensures a new list instance is allocated inside the function scope on every call.',
    testCases: [
      { id: 'tc-1', name: 'Explicit Passed List', input: 'record_event("X", ["existing"])', expectedOutput: '["existing", "X"]', actualWithBug: '["existing", "X"]', exposesBug: false, explanation: 'Explicit list argument bypasses default argument.' },
      { id: 'tc-2', name: 'Sequential Default Calls', input: 'call 1: record_event("login"), call 2: record_event("logout")', expectedOutput: '["logout"]', actualWithBug: '["login", "logout"]', exposesBug: true, explanation: 'Second call retains data from the first call.' }
    ],
    exposingTestCaseId: 'tc-2',
    hints: [
      { text: 'Look at the function signature on line 1: events=[].', penalty: 3 },
      { text: 'When does Python evaluate default parameter expressions?', penalty: 5 },
      { text: 'Use the standard Python idiom: default to None and assign events = [] inside the body.', penalty: 8 }
    ],
    points: 20,
    timeLimitSeconds: 75,
    interviewTip: 'Never use mutable objects (lists, dicts, sets) as default parameter values in Python. Always use None as the sentinel.'
  },

  // 8. JavaScript - Closure Inside Async Loop (Intermediate - Runtime)
  {
    id: 'bug-08',
    title: 'Async/Await Ignored in forEach Callback',
    language: 'JavaScript',
    difficulty: 'Intermediate',
    category: 'Runtime',
    problemStatement: 'Fetch user profiles sequentially and return the aggregate list. The function returns an empty array before any fetch finishes.',
    expectedBehavior: 'Awaits each async request and returns the fully populated profile list.',
    actualBehavior: 'Returns [] immediately because Array.prototype.forEach does not await async callback promises.',
    faultyCode: `async function fetchAllProfiles(userIds, fetchFn) {
    const results = [];
    
    userIds.forEach(async (id) => {
        const profile = await fetchFn(id);
        results.push(profile);
    });
    
    return results;
}`,
    faultyLineNumber: 4,
    bugOptions: [
      { category: 'Runtime', explanation: 'forEach does not pause for promises returned by its callback; execution proceeds straight to return results.', isCorrect: true },
      { category: 'Syntax', explanation: 'async cannot be used inside arrow function expressions.', isCorrect: false },
      { category: 'Logic', explanation: 'results.push is an immutable method that does not modify the array.', isCorrect: false },
      { category: 'Algorithms', explanation: 'userIds must be converted to an Object before iteration.', isCorrect: false }
    ],
    fixOptions: [
      { id: 'f1', codeSnippet: `for (const id of userIds) {
    const profile = await fetchFn(id);
    results.push(profile);
}`, explanation: 'Uses standard for..of loop which properly awaits sequential async iterations.', isCorrect: true },
      { id: 'f2', codeSnippet: `await userIds.forEach(async (id) => {
    const profile = await fetchFn(id);
    results.push(profile);
});`, explanation: 'forEach returns undefined, so await on forEach has no effect.', isCorrect: false },
      { id: 'f3', codeSnippet: `return userIds.map(async (id) => await fetchFn(id));`, explanation: 'Returns an array of pending Promises instead of resolved values.', isCorrect: false }
    ],
    correctedCode: `async function fetchAllProfiles(userIds, fetchFn) {
    const results = [];
    
    for (const id of userIds) {
        const profile = await fetchFn(id);
        results.push(profile);
    }
    
    return results;
}`,
    correctDiagnosis: 'forEach ignores Promise returns from async callbacks and executes synchronously without waiting.',
    whyOriginalFailed: 'Array.prototype.forEach invokes the callback without tracking the returned Promise. The outer function reaches return results before any await resolves.',
    whyFixWorks: 'A for..of loop executes within the async function body, pausing on await before advancing to the next iteration.',
    testCases: [
      { id: 'tc-1', name: 'Empty User List', input: 'userIds = []', expectedOutput: '[]', actualWithBug: '[]', exposesBug: false, explanation: 'Trivially returns empty array.' },
      { id: 'tc-2', name: 'Multiple User IDs', input: 'userIds = ["u1", "u2"]', expectedOutput: '[{id: "u1"}, {id: "u2"}]', actualWithBug: '[]', exposesBug: true, explanation: 'Returns [] immediately before async mock resolve.' }
    ],
    exposingTestCaseId: 'tc-2',
    hints: [
      { text: 'Inspect line 4 where userIds.forEach is combined with async.', penalty: 3 },
      { text: 'Does Array.prototype.forEach await promises returned by its callback?', penalty: 5 },
      { text: 'Replace userIds.forEach with a standard for (const id of userIds) loop.', penalty: 8 }
    ],
    points: 20,
    timeLimitSeconds: 75,
    interviewTip: 'Never use async callbacks inside forEach, filter, or reduce unless you deliberately intend "fire and forget" execution.'
  },

  // 9. C++ - Iterator Invalidation on Vector Erase (Intermediate - Runtime)
  {
    id: 'bug-09',
    title: 'C++ Iterator Invalidation During Vector Erase',
    language: 'C++',
    difficulty: 'Intermediate',
    category: 'Runtime',
    problemStatement: 'Remove all even numbers from a std::vector<int>. The loop crashes or skips adjacent elements.',
    expectedBehavior: 'Removes all even integers cleanly: {1, 2, 4, 5} becomes {1, 5}.',
    actualBehavior: 'Accesses invalidated iterator or increments past the end, triggering a crash.',
    faultyCode: `#include <vector>

void removeEvens(std::vector<int>& vec) {
    for (auto it = vec.begin(); it != vec.end(); ++it) {
        if (*it % 2 == 0) {
            vec.erase(it);
        }
    }
}`,
    faultyLineNumber: 6,
    bugOptions: [
      { category: 'Runtime', explanation: 'vec.erase(it) invalidates it and subsequent iterators; ++it then advances an invalid iterator.', isCorrect: true },
      { category: 'Syntax', explanation: 'auto cannot deduce vector iterator types in modern C++.', isCorrect: false },
      { category: 'Logic', explanation: 'The modulo operator % only works on unsigned integers.', isCorrect: false },
      { category: 'Edge Cases', explanation: 'Vector size must be checked before calling begin().', isCorrect: false }
    ],
    fixOptions: [
      { id: 'f1', codeSnippet: `for (auto it = vec.begin(); it != vec.end(); ) {
    if (*it % 2 == 0) {
        it = vec.erase(it);
    } else {
        ++it;
    }
}`, explanation: 'vec.erase(it) returns the valid iterator following the erased element.', isCorrect: true },
      { id: 'f2', codeSnippet: `vec.erase(it); --it;`, explanation: 'Decrements on begin() causes underflow undefined behavior.', isCorrect: false },
      { id: 'f3', codeSnippet: `for (auto it = vec.end() - 1; it >= vec.begin(); --it)`, explanation: 'Still invalidates iterators after erase.', isCorrect: false }
    ],
    correctedCode: `#include <vector>

void removeEvens(std::vector<int>& vec) {
    for (auto it = vec.begin(); it != vec.end(); ) {
        if (*it % 2 == 0) {
            it = vec.erase(it);
        } else {
            ++it;
        }
    }
}`,
    correctDiagnosis: 'vec.erase() invalidates iterators at and beyond the erased position. The loop must reassign it = vec.erase(it).',
    whyOriginalFailed: 'Erasing an element shifts elements left and renders it dangling. The subsequent ++it in the for-loop header advances a destroyed iterator.',
    whyFixWorks: 'vec.erase(it) returns an iterator pointing to the new location of the element that followed the erased one.',
    testCases: [
      { id: 'tc-1', name: 'No Even Elements', input: '{1, 3, 5}', expectedOutput: '{1, 3, 5}', actualWithBug: '{1, 3, 5}', exposesBug: false, explanation: 'No erase calls executed.' },
      { id: 'tc-2', name: 'Consecutive Evens', input: '{1, 2, 4, 5}', expectedOutput: '{1, 5}', actualWithBug: 'Skips element 4 or crashes', exposesBug: true, explanation: 'Erasing 2 shifts 4 to its spot, then ++it jumps over 4.' }
    ],
    exposingTestCaseId: 'tc-2',
    hints: [
      { text: 'Look at line 6 where vec.erase(it) is called inside a standard ++it for-loop.', penalty: 3 },
      { text: 'What does std::vector::erase do to existing iterators?', penalty: 5 },
      { text: 'Capture the return value: it = vec.erase(it) and only increment ++it in the else branch.', penalty: 8 }
    ],
    points: 20,
    timeLimitSeconds: 75,
    interviewTip: 'Iterator invalidation is a favorite C++ technical interview topic. Know how erase-remove idiom or it = vec.erase(it) works.'
  },

  // 10. Java - Binary Search Midpoint Overflow (Intermediate - Edge Cases)
  {
    id: 'bug-10',
    title: 'Java Integer Overflow in Midpoint Calculation',
    language: 'Java',
    difficulty: 'Intermediate',
    category: 'Edge Cases',
    problemStatement: 'Search in huge arrays (> 1 billion elements). The search throws ArrayIndexOutOfBoundsException with negative indices.',
    expectedBehavior: 'Calculates the correct midpoint between low and high without signed 32-bit overflow.',
    actualBehavior: '(low + high) overflows Integer.MAX_VALUE into negative numbers, yielding negative mid.',
    faultyCode: `public class LargeBinarySearch {
    public static int search(int[] arr, int target) {
        int low = 0;
        int high = arr.length - 1;
        while (low <= high) {
            int mid = (low + high) / 2;
            if (arr[mid] == target) {
                return mid;
            } else if (arr[mid] < target) {
                low = mid + 1;
            } else {
                high = mid - 1;
            }
        }
        return -1;
    }
}`,
    faultyLineNumber: 6,
    bugOptions: [
      { category: 'Edge Cases', explanation: '(low + high) can exceed Integer.MAX_VALUE (2^31 - 1), wrapping into a negative integer and causing ArrayIndexOutOfBoundsException.', isCorrect: true },
      { category: 'Syntax', explanation: 'int[] cannot hold more than 1000 items in Java.', isCorrect: false },
      { category: 'Logic', explanation: 'high should be initialized to arr.length instead of arr.length - 1.', isCorrect: false },
      { category: 'Runtime', explanation: 'Integer division by 2 causes hardware interrupts on large numbers.', isCorrect: false }
    ],
    fixOptions: [
      { id: 'f1', codeSnippet: 'int mid = low + (high - low) / 2;', explanation: 'Calculates midpoint using difference, preventing integer sum overflow.', isCorrect: true },
      { id: 'f2', codeSnippet: 'int mid = (high - low) / 2;', explanation: 'Computes distance from 0 instead of offset from low.', isCorrect: false },
      { id: 'f3', codeSnippet: 'int mid = (low + high) >> 2;', explanation: 'Shifting by 2 divides by 4, not 2.', isCorrect: false }
    ],
    correctedCode: `public class LargeBinarySearch {
    public static int search(int[] arr, int target) {
        int low = 0;
        int high = arr.length - 1;
        while (low <= high) {
            int mid = low + (high - low) / 2;
            if (arr[mid] == target) {
                return mid;
            } else if (arr[mid] < target) {
                low = mid + 1;
            } else {
                high = mid - 1;
            }
        }
        return -1;
    }
}`,
    correctDiagnosis: 'Famous Joshua Bloch JDK bug: (low + high) overflows 32-bit signed integer when sum >= 2^31.',
    whyOriginalFailed: 'When low and high are both large positive integers near 1.5 billion, their sum wraps to a negative value. Dividing by 2 keeps it negative, causing arr[negative] to throw ArrayIndexOutOfBoundsException.',
    whyFixWorks: 'low + (high - low) / 2 only subtracts high - low, which is always positive and <= high, avoiding overflow.',
    testCases: [
      { id: 'tc-1', name: 'Small Array', input: 'low = 0, high = 10', expectedOutput: 'mid = 5', actualWithBug: '5', exposesBug: false, explanation: 'Sum 10 is well within integer limits.' },
      { id: 'tc-2', name: 'Large Index Bounds', input: 'low = 1073741824, high = 2147483640', expectedOutput: '1610612732', actualWithBug: '-536870912 (Negative Index Crash)', exposesBug: true, explanation: 'Sum 3221225464 overflows signed 32-bit int.' }
    ],
    exposingTestCaseId: 'tc-2',
    hints: [
      { text: 'Look at line 6: int mid = (low + high) / 2.', penalty: 3 },
      { text: 'What happens if low and high are each greater than 1 billion?', penalty: 5 },
      { text: 'Write the midpoint formula as low + (high - low) / 2 or (low + high) >>> 1.', penalty: 8 }
    ],
    points: 20,
    timeLimitSeconds: 75,
    interviewTip: 'This was a live bug in the Java standard library for 9 years. Demonstrating knowledge of low + (high - low) / 2 signals software engineering maturity.'
  },

  // 11. Python - Kadane's Max Subarray All Negatives (Advanced - Edge Cases)
  {
    id: 'bug-11',
    title: "Kadane's Algorithm Failure on All Negative Numbers",
    language: 'Python',
    difficulty: 'Advanced',
    category: 'Edge Cases',
    problemStatement: 'Find maximum sum of a non-empty contiguous subarray. When all numbers are negative, the function incorrectly returns 0.',
    expectedBehavior: 'Returns the largest negative single element (e.g. max([-3, -1, -5]) == -1).',
    actualBehavior: 'Returns 0 because max_so_far is initialized to 0 and negative sums are reset to 0.',
    faultyCode: `def max_subarray_sum(nums):
    if not nums:
        return 0
        
    max_so_far = 0
    current_sum = 0
    
    for x in nums:
        current_sum += x
        if current_sum > max_so_far:
            max_so_far = current_sum
        if current_sum < 0:
            current_sum = 0
            
    return max_so_far`,
    faultyLineNumber: 5,
    bugOptions: [
      { category: 'Edge Cases', explanation: 'Initializing max_so_far to 0 fails when all numbers are negative, because an empty subarray is not allowed.', isCorrect: true },
      { category: 'Algorithms', explanation: "Kadane's algorithm has O(N^2) complexity and times out.", isCorrect: false },
      { category: 'Logic', explanation: 'current_sum should be multiplied by x instead of added.', isCorrect: false },
      { category: 'Runtime', explanation: 'Looping over nums without index throws TypeError.', isCorrect: false }
    ],
    fixOptions: [
      { id: 'f1', codeSnippet: `max_so_far = nums[0]
current_sum = nums[0]
for x in nums[1:]:
    current_sum = max(x, current_sum + x)
    max_so_far = max(max_so_far, current_sum)`, explanation: 'Initializes max_so_far to the first element and handles all-negative inputs correctly.', isCorrect: true },
      { id: 'f2', codeSnippet: 'max_so_far = -1', explanation: 'Fails if all numbers are smaller than -1 (e.g. [-5, -8]).', isCorrect: false },
      { id: 'f3', codeSnippet: 'return max(max_so_far, 0)', explanation: 'Still yields 0 on all-negative arrays.', isCorrect: false }
    ],
    correctedCode: `def max_subarray_sum(nums):
    if not nums:
        return 0
        
    max_so_far = nums[0]
    current_sum = nums[0]
    
    for x in nums[1:]:
        current_sum = max(x, current_sum + x)
        max_so_far = max(max_so_far, current_sum)
            
    return max_so_far`,
    correctDiagnosis: 'max_so_far initialized to 0 assumes at least one non-negative element exists. Non-empty subarray requirement requires max_so_far = nums[0].',
    whyOriginalFailed: 'If nums = [-5, -2, -8], max_so_far remains 0 because every negative sum is smaller than 0, returning 0 (an empty subarray).',
    whyFixWorks: 'Seeding both max_so_far and current_sum with nums[0] ensures any negative maximum is preserved.',
    testCases: [
      { id: 'tc-1', name: 'Mixed Array', input: 'nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]', expectedOutput: '6', actualWithBug: '6', exposesBug: false, explanation: 'Positive sum [4, -1, 2, 1] dominates.' },
      { id: 'tc-2', name: 'All Negative Array', input: 'nums = [-3, -1, -5]', expectedOutput: '-1', actualWithBug: '0', exposesBug: true, explanation: 'Returns 0 instead of maximum single negative element -1.' }
    ],
    exposingTestCaseId: 'tc-2',
    hints: [
      { text: 'Look at how max_so_far is initialized on line 5.', penalty: 3 },
      { text: 'What is the expected output if nums contains only negative numbers like [-4, -2, -7]?', penalty: 5 },
      { text: 'Initialize max_so_far = nums[0] and use current_sum = max(x, current_sum + x).', penalty: 8 }
    ],
    points: 25,
    timeLimitSeconds: 90,
    interviewTip: "Always clarify with the interviewer whether an empty subarray is allowed (returning 0) or if at least one element must be chosen."
  },

  // 12. JavaScript - Shallow Copy Nested Object Mutation (Intermediate - Logic)
  {
    id: 'bug-12',
    title: 'Object Spread Shallow Copy Mutating Nested State',
    language: 'JavaScript',
    difficulty: 'Intermediate',
    category: 'Logic',
    problemStatement: 'Clone and update user preferences in state. The original user object is accidentally mutated.',
    expectedBehavior: 'Creates an independent copy of the user object with updated theme preference.',
    actualBehavior: 'Mutates originalUser.settings.theme because the spread operator only shallow copies top-level properties.',
    faultyCode: `function updateTheme(originalUser, newTheme) {
    const updatedUser = { ...originalUser };
    updatedUser.settings.theme = newTheme;
    return updatedUser;
}`,
    faultyLineNumber: 3,
    bugOptions: [
      { category: 'Logic', explanation: 'Spread syntax { ...originalUser } performs a shallow copy; nested object settings still references the exact same memory.', isCorrect: true },
      { category: 'Syntax', explanation: 'Object spread operator requires Babel polyfill in Node.js.', isCorrect: false },
      { category: 'Runtime', explanation: 'Direct property mutation on const updatedUser throws TypeError.', isCorrect: false },
      { category: 'Algorithms', explanation: 'Objects in JavaScript are passed by value and cannot be mutated.', isCorrect: false }
    ],
    fixOptions: [
      { id: 'f1', codeSnippet: `const updatedUser = {
    ...originalUser,
    settings: {
        ...originalUser.settings,
        theme: newTheme
    }
};`, explanation: 'Deeply spreads both the top-level user and the nested settings object.', isCorrect: true },
      { id: 'f2', codeSnippet: `const updatedUser = Object.assign(originalUser);`, explanation: 'Object.assign without target {} mutates originalUser directly.', isCorrect: false },
      { id: 'f3', codeSnippet: `const updatedUser = originalUser;`, explanation: 'Copies the reference without any cloning.', isCorrect: false }
    ],
    correctedCode: `function updateTheme(originalUser, newTheme) {
    const updatedUser = {
        ...originalUser,
        settings: {
            ...originalUser.settings,
            theme: newTheme
        }
    };
    return updatedUser;
}`,
    correctDiagnosis: 'Spread syntax {...obj} only clones top-level keys. Nested objects remain references to the original object.',
    whyOriginalFailed: 'originalUser.settings and updatedUser.settings point to the same memory object. Modifying updatedUser.settings.theme corrupts originalUser.',
    whyFixWorks: 'Spreading settings creates a new nested object with only the theme property overwritten, preserving immutability.',
    testCases: [
      { id: 'tc-1', name: 'Updated User Theme', input: 'original = { name: "Alex", settings: { theme: "light" } }, newTheme = "dark"', expectedOutput: 'updatedUser.settings.theme == "dark"', actualWithBug: '"dark"', exposesBug: false, explanation: 'The return value looks correct in isolation.' },
      { id: 'tc-2', name: 'Original State Immutability', input: 'check originalUser.settings.theme after update', expectedOutput: '"light"', actualWithBug: '"dark" (Corrupted Original)', exposesBug: true, explanation: 'The caller original state was illegally mutated.' }
    ],
    exposingTestCaseId: 'tc-2',
    hints: [
      { text: 'Look at line 3: updatedUser.settings.theme = newTheme.', penalty: 3 },
      { text: 'Does { ...originalUser } clone nested objects inside settings?', penalty: 5 },
      { text: 'Nested objects must also be spread: settings: { ...originalUser.settings, theme: newTheme }.', penalty: 8 }
    ],
    points: 20,
    timeLimitSeconds: 75,
    interviewTip: 'Essential for React/Redux interviews: shallow copying causes subtle UI re-render bugs because state immutability is violated.'
  },

  // 13. Java - NullPointerException on Auto-Unboxing (Intermediate - Runtime)
  {
    id: 'bug-13',
    title: 'Java NullPointerException on Map Auto-Unboxing',
    language: 'Java',
    difficulty: 'Intermediate',
    category: 'Runtime',
    problemStatement: 'Increment frequency of words in a sentence. Throws NullPointerException when encountering a word for the first time.',
    expectedBehavior: 'Inserts new word with count 1 or increments existing count.',
    actualBehavior: 'Throws java.lang.NullPointerException when unboxing null Integer into primitive int.',
    faultyCode: `import java.util.HashMap;
import java.util.Map;

public class WordCounter {
    public static Map<String, Integer> countWords(String[] words) {
        Map<String, Integer> map = new HashMap<>();
        for (String word : words) {
            int currentCount = map.get(word);
            map.put(word, currentCount + 1);
        }
        return map;
    }
}`,
    faultyLineNumber: 8,
    bugOptions: [
      { category: 'Runtime', explanation: 'map.get(word) returns null for unseen keys; assigning it to primitive int invokes .intValue() on null, throwing NullPointerException.', isCorrect: true },
      { category: 'Syntax', explanation: 'HashMap cannot map from String to Integer.', isCorrect: false },
      { category: 'Logic', explanation: 'map.put must be called before map.get.', isCorrect: false },
      { category: 'Algorithms', explanation: 'Hash maps require sorting keys before insertion.', isCorrect: false }
    ],
    fixOptions: [
      { id: 'f1', codeSnippet: 'map.put(word, map.getOrDefault(word, 0) + 1);', explanation: 'Uses getOrDefault(word, 0) to provide a fallback 0 for missing keys.', isCorrect: true },
      { id: 'f2', codeSnippet: 'int currentCount = map.get(word) == null ? 0 : map.get(word);', explanation: 'Verbose fallback that also fixes the unboxing issue.', isCorrect: false },
      { id: 'f3', codeSnippet: 'map.put(word, 1);', explanation: 'Always sets count to 1, losing cumulative counts.', isCorrect: false }
    ],
    correctedCode: `import java.util.HashMap;
import java.util.Map;

public class WordCounter {
    public static Map<String, Integer> countWords(String[] words) {
        Map<String, Integer> map = new HashMap<>();
        for (String word : words) {
            map.put(word, map.getOrDefault(word, 0) + 1);
        }
        return map;
    }
}`,
    correctDiagnosis: 'Implicit auto-unboxing of wrapper Integer to primitive int throws NullPointerException when the key does not exist.',
    whyOriginalFailed: 'When word is not yet in map, map.get(word) returns null. The assignment int currentCount = (Integer) null tries to execute null.intValue(), throwing NPE.',
    whyFixWorks: 'map.getOrDefault(word, 0) returns Integer.valueOf(0) instead of null when word is absent.',
    testCases: [
      { id: 'tc-1', name: 'Duplicate Words', input: 'words = ["apple", "apple"]', expectedOutput: '{apple=2}', actualWithBug: 'NullPointerException on first word', exposesBug: true, explanation: 'Fails immediately on the first iteration for "apple".' },
      { id: 'tc-2', name: 'Empty Array', input: 'words = []', expectedOutput: '{}', actualWithBug: '{}', exposesBug: false, explanation: 'Loop does not run.' }
    ],
    exposingTestCaseId: 'tc-1',
    hints: [
      { text: 'Look at line 8: int currentCount = map.get(word);', penalty: 3 },
      { text: 'What does map.get return if the key is not present in the map?', penalty: 5 },
      { text: 'Use map.getOrDefault(word, 0) to avoid auto-unboxing null into an int.', penalty: 8 }
    ],
    points: 20,
    timeLimitSeconds: 75,
    interviewTip: 'Auto-unboxing NullPointerExceptions are among the most common bugs in Java coding interviews. Always use getOrDefault.'
  },

  // 14. C++ - Operator Precedence Bitwise AND vs Equality (Intermediate - Logic)
  {
    id: 'bug-14',
    title: 'C++ Operator Precedence Between & and ==',
    language: 'C++',
    difficulty: 'Intermediate',
    category: 'Logic',
    problemStatement: 'Check if a specific flag bit is enabled in an integer bitmask. The condition always evaluates to false.',
    expectedBehavior: 'Returns true when (flags & mask) is non-zero.',
    actualBehavior: 'Evaluates mask == 0 first because == has higher precedence than &, corrupting the bit check.',
    faultyCode: `bool isFlagActive(int flags, int mask) {
    // Check if mask bit is set in flags
    if (flags & mask == 0) {
        return false;
    }
    return true;
}`,
    faultyLineNumber: 3,
    bugOptions: [
      { category: 'Logic', explanation: 'Equality operator == has higher precedence than bitwise AND &. It evaluates mask == 0 first, changing the logic to flags & (mask == 0).', isCorrect: true },
      { category: 'Syntax', explanation: 'Bitwise AND & cannot be used in boolean if-conditions.', isCorrect: false },
      { category: 'Runtime', explanation: 'Bitwise operations on signed integers invoke undefined behavior.', isCorrect: false },
      { category: 'Edge Cases', explanation: 'Flags cannot exceed 255 in C++.', isCorrect: false }
    ],
    fixOptions: [
      { id: 'f1', codeSnippet: 'if ((flags & mask) == 0)', explanation: 'Wraps the bitwise operation in parentheses before comparing to 0.', isCorrect: true },
      { id: 'f2', codeSnippet: 'if (flags && mask == 0)', explanation: 'Logical AND && does not perform bitwise masking.', isCorrect: false },
      { id: 'f3', codeSnippet: 'if (flags | mask == 0)', explanation: 'Bitwise OR has lower precedence as well and tests the wrong condition.', isCorrect: false }
    ],
    correctedCode: `bool isFlagActive(int flags, int mask) {
    // Check if mask bit is set in flags
    if ((flags & mask) == 0) {
        return false;
    }
    return true;
}`,
    correctDiagnosis: 'In C and C++, == has higher precedence than &. (flags & mask == 0) is parsed as flags & (mask == 0).',
    whyOriginalFailed: 'If mask is 4 (non-zero), mask == 0 evaluates to false (0). Then flags & 0 is 0, which triggers the if branch and returns false even when the bit is set.',
    whyFixWorks: 'Adding parentheses ((flags & mask) == 0) forces the bitwise masking to occur before the equality test.',
    testCases: [
      { id: 'tc-1', name: 'Mask Is Zero', input: 'flags = 5, mask = 0', expectedOutput: 'false', actualWithBug: 'false', exposesBug: false, explanation: 'mask == 0 happens to be true.' },
      { id: 'tc-2', name: 'Active Bit Flag', input: 'flags = 5 (0101b), mask = 4 (0100b)', expectedOutput: 'true', actualWithBug: 'false', exposesBug: true, explanation: 'Bit is set, but mask == 0 evaluates first, returning false.' }
    ],
    exposingTestCaseId: 'tc-2',
    hints: [
      { text: 'Look at the condition on line 3: if (flags & mask == 0).', penalty: 3 },
      { text: 'Which operator has higher precedence in C++: & or == ?', penalty: 5 },
      { text: 'Add parentheses around the bitwise expression: ((flags & mask) == 0).', penalty: 8 }
    ],
    points: 20,
    timeLimitSeconds: 75,
    interviewTip: 'Operator precedence pitfalls in C++: relational/equality operators (<, >, ==, !=) always bind tighter than bitwise (&, ^, |).'
  },

  // 15. Python - Merge Intervals Adjacent Equal Boundary (Advanced - Algorithms)
  {
    id: 'bug-15',
    title: 'Merge Intervals Missing Touching Boundaries',
    language: 'Python',
    difficulty: 'Advanced',
    category: 'Algorithms',
    problemStatement: 'Merge all overlapping intervals. Intervals that touch at boundary points (e.g. [1, 4] and [4, 5]) are incorrectly left separate.',
    expectedBehavior: 'Merges touching intervals into a single range: [1, 4] and [4, 5] should become [1, 5].',
    actualBehavior: 'Leaves [1, 4] and [4, 5] as two separate intervals because the comparison strictly uses <.',
    faultyCode: `def merge_intervals(intervals):
    if not intervals:
        return []
        
    intervals.sort(key=lambda x: x[0])
    merged = [intervals[0]]
    
    for current in intervals[1:]:
        prev = merged[-1]
        if current[0] < prev[1]:
            prev[1] = max(prev[1], current[1])
        else:
            merged.append(current)
            
    return merged`,
    faultyLineNumber: 9,
    bugOptions: [
      { category: 'Algorithms', explanation: 'Condition current[0] < prev[1] uses strict inequality; it should be current[0] <= prev[1] to merge touching intervals.', isCorrect: true },
      { category: 'Syntax', explanation: 'Sorting by lambda x: x[0] is not supported for nested lists.', isCorrect: false },
      { category: 'Runtime', explanation: 'Modifying prev[1] in-place triggers ValueError on immutable slices.', isCorrect: false },
      { category: 'Edge Cases', explanation: 'Intervals must be sorted by ending times instead of start times.', isCorrect: false }
    ],
    fixOptions: [
      { id: 'f1', codeSnippet: 'if current[0] <= prev[1]:', explanation: 'Uses <= to merge overlapping and touching intervals.', isCorrect: true },
      { id: 'f2', codeSnippet: 'if current[0] == prev[1]:', explanation: 'Only merges touching intervals, ignoring overlapping ones.', isCorrect: false },
      { id: 'f3', codeSnippet: 'if current[1] <= prev[0]:', explanation: 'Compares the wrong endpoints.', isCorrect: false }
    ],
    correctedCode: `def merge_intervals(intervals):
    if not intervals:
        return []
        
    intervals.sort(key=lambda x: x[0])
    merged = [intervals[0]]
    
    for current in intervals[1:]:
        prev = merged[-1]
        if current[0] <= prev[1]:
            prev[1] = max(prev[1], current[1])
        else:
            merged.append(current)
            
    return merged`,
    correctDiagnosis: 'Overlapping intervals include touching boundaries. Strict inequality < misses adjacent ranges.',
    whyOriginalFailed: 'For intervals [1, 4] and [4, 5], current[0] is 4 and prev[1] is 4. Since 4 < 4 is false, [4, 5] is appended as a new interval instead of extending prev to [1, 5].',
    whyFixWorks: 'Changing to current[0] <= prev[1] treats meeting boundaries as contiguous intervals.',
    testCases: [
      { id: 'tc-1', name: 'Clearly Overlapping Intervals', input: 'intervals = [[1, 5], [2, 6]]', expectedOutput: '[[1, 6]]', actualWithBug: '[[1, 6]]', exposesBug: false, explanation: '2 < 5 is true, so overlap is detected.' },
      { id: 'tc-2', name: 'Touching Boundary Intervals', input: 'intervals = [[1, 4], [4, 5]]', expectedOutput: '[[1, 5]]', actualWithBug: '[[1, 4], [4, 5]]', exposesBug: true, explanation: '4 < 4 evaluates to false, failing to merge.' }
    ],
    exposingTestCaseId: 'tc-2',
    hints: [
      { text: 'Look at the comparison on line 9: if current[0] < prev[1].', penalty: 3 },
      { text: 'What should happen when one interval starts at the exact second another ends?', penalty: 5 },
      { text: 'Change current[0] < prev[1] to current[0] <= prev[1].', penalty: 8 }
    ],
    points: 25,
    timeLimitSeconds: 90,
    interviewTip: 'Boundary conditions are the primary differentiator in LeetCode Medium/Hard intervals problems.'
  },

  // 16. Python - Stack Underflow on Valid Parentheses (Intermediate - Edge Cases)
  {
    id: 'bug-16',
    title: 'Stack Underflow on Unmatched Closing Bracket',
    language: 'Python',
    difficulty: 'Intermediate',
    category: 'Edge Cases',
    problemStatement: 'Validate brackets string contains balanced parentheses. Strings starting with closing brackets crash with IndexError.',
    expectedBehavior: 'Returns False for strings with unmatched closing brackets like ")(" or "}".',
    actualBehavior: 'Crashes with IndexError: pop from empty list when encountering a closing bracket with an empty stack.',
    faultyCode: `def is_valid_parentheses(s):
    bracket_map = {')': '(', '}': '{', ']': '['}
    stack = []
    
    for char in s:
        if char in bracket_map:
            top_element = stack.pop()
            if top_element != bracket_map[char]:
                return False
        else:
            stack.append(char)
            
    return len(stack) == 0`,
    faultyLineNumber: 7,
    bugOptions: [
      { category: 'Edge Cases', explanation: 'stack.pop() is called without checking if the stack is empty, throwing IndexError on strings starting with closing brackets.', isCorrect: true },
      { category: 'Syntax', explanation: 'Dictionary values cannot be checked using bracket_map[char].', isCorrect: false },
      { category: 'Logic', explanation: 'The return statement should be return True regardless of stack length.', isCorrect: false },
      { category: 'Algorithms', explanation: 'A queue must be used instead of a stack for parenthesis matching.', isCorrect: false }
    ],
    fixOptions: [
      { id: 'f1', codeSnippet: `if not stack or stack.pop() != bracket_map[char]:
    return False`, explanation: 'Checks if stack is empty before popping; returns False if underflow occurs.', isCorrect: true },
      { id: 'f2', codeSnippet: 'top_element = stack[0]', explanation: 'Inspects the bottom of the stack instead of the top.', isCorrect: false },
      { id: 'f3', codeSnippet: 'stack.clear()', explanation: 'Empties the stack without validating the closing bracket.', isCorrect: false }
    ],
    correctedCode: `def is_valid_parentheses(s):
    bracket_map = {')': '(', '}': '{', ']': '['}
    stack = []
    
    for char in s:
        if char in bracket_map:
            if not stack or stack.pop() != bracket_map[char]:
                return False
        else:
            stack.append(char)
            
    return len(stack) == 0`,
    correctDiagnosis: 'Popping an empty stack raises IndexError when an extra or leading closing bracket appears.',
    whyOriginalFailed: 'When s = "]", stack is initially empty. Calling stack.pop() crashes with IndexError: pop from empty list.',
    whyFixWorks: 'Checking if not stack immediately detects an unmatched closing bracket and safely returns False.',
    testCases: [
      { id: 'tc-1', name: 'Balanced String', input: 's = "({[]})"', expectedOutput: 'True', actualWithBug: 'True', exposesBug: false, explanation: 'Every opening bracket has a matching closing bracket.' },
      { id: 'tc-2', name: 'Starting with Closing Bracket', input: 's = "]"', expectedOutput: 'False', actualWithBug: 'IndexError: pop from empty list', exposesBug: true, explanation: 'Pops empty stack and crashes.' },
      { id: 'tc-3', name: 'Extra Closing Bracket at End', input: 's = "()" + ")"', expectedOutput: 'False', actualWithBug: 'IndexError: pop from empty list', exposesBug: true, explanation: 'Second closing bracket finds stack already empty.' }
    ],
    exposingTestCaseId: 'tc-2',
    hints: [
      { text: 'Look at line 7 where stack.pop() is called directly.', penalty: 3 },
      { text: 'What is inside stack if the input string begins with ")"?', penalty: 5 },
      { text: 'Add a guard: if not stack or stack.pop() != bracket_map[char]: return False.', penalty: 8 }
    ],
    points: 20,
    timeLimitSeconds: 75,
    interviewTip: 'Every stack pop or peek operation in an interview must be defended by an emptiness check.'
  },

  // 17. Java - String Index Out of Bounds in Substring Loop (Beginner - Runtime)
  {
    id: 'bug-17',
    title: 'Java StringIndexOutOfBoundsException in Substring',
    language: 'Java',
    difficulty: 'Beginner',
    category: 'Runtime',
    problemStatement: 'Extract all 3-character prefixes/ngrams from a string. The loop throws StringIndexOutOfBoundsException on the final iteration.',
    expectedBehavior: 'Generates valid 3-character substrings from index 0 to str.length() - 3.',
    actualBehavior: 'Loops until str.length(), attempting to read past the end with substring(i, i + 3).',
    faultyCode: `import java.util.ArrayList;
import java.util.List;

public class NgramGenerator {
    public static List<String> getTrigrams(String str) {
        List<String> trigrams = new ArrayList<>();
        if (str == null || str.length() < 3) return trigrams;
        
        for (int i = 0; i < str.length(); i++) {
            trigrams.add(str.substring(i, i + 3));
        }
        return trigrams;
    }
}`,
    faultyLineNumber: 9,
    bugOptions: [
      { category: 'Runtime', explanation: 'Condition i < str.length() allows i to exceed str.length() - 3, causing substring(i, i + 3) to throw StringIndexOutOfBoundsException.', isCorrect: true },
      { category: 'Syntax', explanation: 'List<String> cannot be instantiated as ArrayList<String>.', isCorrect: false },
      { category: 'Logic', explanation: 'str.substring end index is inclusive rather than exclusive.', isCorrect: false },
      { category: 'Algorithms', explanation: 'Trigrams can only be computed using regular expressions.', isCorrect: false }
    ],
    fixOptions: [
      { id: 'f1', codeSnippet: 'for (int i = 0; i <= str.length() - 3; i++)', explanation: 'Ensures i + 3 never exceeds str.length().', isCorrect: true },
      { id: 'f2', codeSnippet: 'for (int i = 0; i < str.length() - 2; i++)', explanation: 'Produces correct iterations (same as <= length - 3).', isCorrect: true },
      { id: 'f3', codeSnippet: 'for (int i = 3; i < str.length(); i++)', explanation: 'Skips the initial trigrams at indices 0, 1, 2.', isCorrect: false }
    ],
    correctedCode: `import java.util.ArrayList;
import java.util.List;

public class NgramGenerator {
    public static List<String> getTrigrams(String str) {
        List<String> trigrams = new ArrayList<>();
        if (str == null || str.length() < 3) return trigrams;
        
        for (int i = 0; i <= str.length() - 3; i++) {
            trigrams.add(str.substring(i, i + 3));
        }
        return trigrams;
    }
}`,
    correctDiagnosis: 'Windowing algorithms must stop their start pointer at string length minus window size.',
    whyOriginalFailed: 'When i = str.length() - 1, i + 3 reaches str.length() + 2, triggering StringIndexOutOfBoundsException.',
    whyFixWorks: 'Limiting the loop condition to i <= str.length() - 3 ensures the second argument to substring never exceeds str.length().',
    testCases: [
      { id: 'tc-1', name: 'Exact 3-Letter String', input: 'str = "cat"', expectedOutput: '["cat"]', actualWithBug: 'StringIndexOutOfBoundsException at i = 1', exposesBug: true, explanation: 'Loop continues to i = 1 and i = 2, crashing.' },
      { id: 'tc-2', name: 'Short String', input: 'str = "hi"', expectedOutput: '[]', actualWithBug: '[]', exposesBug: false, explanation: 'Caught by guard clause.' }
    ],
    exposingTestCaseId: 'tc-1',
    hints: [
      { text: 'Look at the loop upper bound on line 9: i < str.length().', penalty: 3 },
      { text: 'What is the value of i + 3 when i reaches str.length() - 1?', penalty: 5 },
      { text: 'Set the upper bound to i <= str.length() - 3.', penalty: 8 }
    ],
    points: 15,
    timeLimitSeconds: 60,
    interviewTip: 'When using sliding windows of size K, the starting index loop must terminate at length - K.'
  },

  // 18. JavaScript - Loose Equality 0 vs False in Pagination (Beginner - Logic)
  {
    id: 'bug-18',
    title: 'Falsy Value Bug on Page Offset 0 in JavaScript',
    language: 'JavaScript',
    difficulty: 'Beginner',
    category: 'Logic',
    problemStatement: 'Parse page offset query parameter. When user requests page offset 0 (first page), the system defaults to offset 10.',
    expectedBehavior: 'Offset 0 is preserved as 0.',
    actualBehavior: 'Offset 0 is treated as falsy, triggering the default fallback: offset || 10 evaluates to 10.',
    faultyCode: `function getQueryOffset(requestedOffset) {
    // If requestedOffset is missing or invalid, default to 10
    const offset = requestedOffset || 10;
    return offset;
}`,
    faultyLineNumber: 3,
    bugOptions: [
      { category: 'Logic', explanation: 'The logical OR || operator treats 0 as falsy, replacing a valid requested offset of 0 with 10.', isCorrect: true },
      { category: 'Syntax', explanation: 'const variables cannot be assigned expression returns.', isCorrect: false },
      { category: 'Runtime', explanation: 'Passing 0 to logical OR throws ReferenceError in strict mode.', isCorrect: false },
      { category: 'Edge Cases', explanation: 'Numbers in JavaScript cannot be equal to 10.', isCorrect: false }
    ],
    fixOptions: [
      { id: 'f1', codeSnippet: 'const offset = requestedOffset ?? 10;', explanation: 'Uses nullish coalescing operator ?? to only default on null or undefined.', isCorrect: true },
      { id: 'f2', codeSnippet: 'const offset = requestedOffset && 10;', explanation: 'Logical AND returns 10 when requestedOffset is truthy, and 0 when 0.', isCorrect: false },
      { id: 'f3', codeSnippet: 'const offset = !requestedOffset ? 10 : requestedOffset;', explanation: 'Still evaluates !0 as true, defaulting 0 to 10.', isCorrect: false }
    ],
    correctedCode: `function getQueryOffset(requestedOffset) {
    // Default to 10 only if requestedOffset is null or undefined
    const offset = requestedOffset ?? 10;
    return offset;
}`,
    correctDiagnosis: 'In JavaScript, 0, "", false, and NaN are falsy. Using || for default numbers replaces 0 with the fallback.',
    whyOriginalFailed: '0 || 10 evaluates the left operand as falsy, proceeding to the right operand and returning 10.',
    whyFixWorks: 'Nullish coalescing (??) only replaces null and undefined, allowing 0 to pass through untouched.',
    testCases: [
      { id: 'tc-1', name: 'Undefined Parameter', input: 'requestedOffset = undefined', expectedOutput: '10', actualWithBug: '10', exposesBug: false, explanation: 'Undefined correctly falls back to default 10.' },
      { id: 'tc-2', name: 'Zero Offset (Page 1)', input: 'requestedOffset = 0', expectedOutput: '0', actualWithBug: '10', exposesBug: true, explanation: '0 is falsely replaced with 10.' }
    ],
    exposingTestCaseId: 'tc-2',
    hints: [
      { text: 'Look at line 3: const offset = requestedOffset || 10.', penalty: 3 },
      { text: 'What is the boolean evaluation of Boolean(0) in JavaScript?', penalty: 5 },
      { text: 'Replace || with the nullish coalescing operator ??.', penalty: 8 }
    ],
    points: 15,
    timeLimitSeconds: 60,
    interviewTip: 'Always use ?? (nullish coalescing) instead of || when defaulting numbers or booleans in JavaScript/TypeScript.'
  },

  // 19. C++ - Return Reference to Local Stack Variable (Advanced - Runtime)
  {
    id: 'bug-19',
    title: 'C++ Dangling Reference to Local Stack Variable',
    language: 'C++',
    difficulty: 'Advanced',
    category: 'Runtime',
    problemStatement: 'Construct a formatted message string. Accessing the returned string causes garbage output or memory segmentation faults.',
    expectedBehavior: 'Returns a valid, readable string by value.',
    actualBehavior: 'Returns a reference to a stack-allocated variable that is destroyed when the function returns.',
    faultyCode: `#include <string>

const std::string& formatUserTag(const std::string& username, int id) {
    std::string tag = username + "#" + std::to_string(id);
    return tag;
}`,
    faultyLineNumber: 5,
    bugOptions: [
      { category: 'Runtime', explanation: 'tag is a local stack variable destroyed at function exit; returning const std::string& creates a dangling reference to deallocated stack memory.', isCorrect: true },
      { category: 'Syntax', explanation: 'std::to_string cannot convert primitive integers to strings.', isCorrect: false },
      { category: 'Logic', explanation: 'String concatenation using + is not allowed with const references.', isCorrect: false },
      { category: 'Algorithms', explanation: 'Strings must be allocated using malloc in C++.', isCorrect: false }
    ],
    fixOptions: [
      { id: 'f1', codeSnippet: `std::string formatUserTag(const std::string& username, int id) {
    std::string tag = username + "#" + std::to_string(id);
    return tag;
}`, explanation: 'Changes the return type from reference (const std::string&) to value (std::string).', isCorrect: true },
      { id: 'f2', codeSnippet: 'return const_cast<std::string&>(tag);', explanation: 'Casting does not extend the lifetime of a stack variable.', isCorrect: false },
      { id: 'f3', codeSnippet: 'static std::string tag;', explanation: 'Makes the function non-reentrant and causes race conditions in multithreaded code.', isCorrect: false }
    ],
    correctedCode: `#include <string>

std::string formatUserTag(const std::string& username, int id) {
    std::string tag = username + "#" + std::to_string(id);
    return tag;
}`,
    correctDiagnosis: 'Lifetime violation: never return a reference or pointer to a non-static local variable in C++.',
    whyOriginalFailed: 'When formatUserTag exits, the stack frame is popped and the destructor for tag runs. The caller receives a reference pointing to recycled stack memory.',
    whyFixWorks: 'Returning std::string by value allows Return Value Optimization (RVO) or move semantics to safely transfer ownership without extra copy overhead.',
    testCases: [
      { id: 'tc-1', name: 'Calling Function Return', input: 'formatUserTag("Dev", 101)', expectedOutput: '"Dev#101"', actualWithBug: 'Garbage characters or Crash', exposesBug: true, explanation: 'Reading deallocated stack memory yields corrupted bytes.' }
    ],
    exposingTestCaseId: 'tc-1',
    hints: [
      { text: 'Look at the function return type on line 3: const std::string&.', penalty: 3 },
      { text: 'Where is tag allocated, and what happens to it when the function returns?', penalty: 5 },
      { text: 'Remove the reference & from the return type to return by value: std::string.', penalty: 8 }
    ],
    points: 25,
    timeLimitSeconds: 90,
    interviewTip: 'Returning references to local stack variables is a classic C++ security and stability vulnerability.'
  },

  // 20. Python - Coin Change Unreachable Amount Returning Zero (Advanced - Algorithms)
  {
    id: 'bug-20',
    title: 'Dynamic Programming Coin Change Impossible Target Bug',
    language: 'Python',
    difficulty: 'Advanced',
    category: 'Algorithms',
    problemStatement: 'Find fewest coins needed to make up amount. If that amount of money cannot be made up, return -1. Currently returns 0.',
    expectedBehavior: 'Returns -1 when no combination of coins can sum to the target amount.',
    actualBehavior: 'Returns 0 when amount cannot be formed because dp table default check is flawed.',
    faultyCode: `def coin_change(coins, amount):
    if amount == 0:
        return 0
        
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    
    for coin in coins:
        for x in range(coin, amount + 1):
            dp[x] = min(dp[x], dp[x - coin] + 1)
            
    if dp[amount] > amount:
        return 0
    return dp[amount]`,
    faultyLineNumber: 13,
    bugOptions: [
      { category: 'Algorithms', explanation: 'Line 13 returns 0 when the target is unreachable (dp[amount] is inf); it should return -1 as specified.', isCorrect: true },
      { category: 'Syntax', explanation: 'float("inf") cannot be stored inside Python lists.', isCorrect: false },
      { category: 'Logic', explanation: 'Inner loop range should run in reverse from amount down to coin.', isCorrect: false },
      { category: 'Runtime', explanation: 'dp[x - coin] throws IndexError on small coin denominations.', isCorrect: false }
    ],
    fixOptions: [
      { id: 'f1', codeSnippet: `if dp[amount] == float('inf'):
    return -1
return dp[amount]`, explanation: 'Properly detects unachievable state and returns -1.', isCorrect: true },
      { id: 'f2', codeSnippet: 'return dp[amount] if dp[amount] <= amount else -1', explanation: 'Valid alternative if all coin denominations are >= 1.', isCorrect: true },
      { id: 'f3', codeSnippet: 'return 0', explanation: 'Always returns 0.', isCorrect: false }
    ],
    correctedCode: `def coin_change(coins, amount):
    if amount == 0:
        return 0
        
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    
    for coin in coins:
        for x in range(coin, amount + 1):
            dp[x] = min(dp[x], dp[x - coin] + 1)
            
    return dp[amount] if dp[amount] != float('inf') else -1`,
    correctDiagnosis: 'Problem specifications state: return -1 if target amount cannot be formed. Returning 0 implies 0 coins can form the amount.',
    whyOriginalFailed: 'When amount = 7 and coins = [2], dp[7] remains float("inf"). The check returns 0 instead of -1.',
    whyFixWorks: 'Checking dp[amount] != float("inf") correctly returns -1 when target is impossible.',
    testCases: [
      { id: 'tc-1', name: 'Achievable Amount', input: 'coins = [1, 2, 5], amount = 11', expectedOutput: '3', actualWithBug: '3', exposesBug: false, explanation: '5 + 5 + 1 = 11 using 3 coins.' },
      { id: 'tc-2', name: 'Impossible Target', input: 'coins = [2], amount = 3', expectedOutput: '-1', actualWithBug: '0', exposesBug: true, explanation: 'Odd number cannot be formed with even coins; returns 0 instead of -1.' }
    ],
    exposingTestCaseId: 'tc-2',
    hints: [
      { text: 'Look at lines 12 to 14 where the return value is calculated.', penalty: 3 },
      { text: 'What does the problem state should be returned when the amount cannot be made up?', penalty: 5 },
      { text: 'Return -1 if dp[amount] == float("inf") else dp[amount].', penalty: 8 }
    ],
    points: 25,
    timeLimitSeconds: 90,
    interviewTip: 'Pay rigorous attention to problem specification edge cases: unreachable targets in DP must return -1, not 0.'
  },

  // 21. Java - Double-Checked Locking Missing Volatile (Advanced - Logic)
  {
    id: 'bug-21',
    title: 'Singleton Double-Checked Locking Missing volatile',
    language: 'Java',
    difficulty: 'Advanced',
    category: 'Logic',
    problemStatement: 'Implement thread-safe lazy Singleton. Under high concurrency, threads occasionally observe a partially constructed instance.',
    expectedBehavior: 'All threads observe a fully initialized Singleton instance with no race conditions.',
    actualBehavior: 'Instruction reordering allows other threads to see a non-null instance before the constructor finishes.',
    faultyCode: `public class DatabaseConnection {
    private static DatabaseConnection instance;
    private String connectionUrl;

    private DatabaseConnection() {
        this.connectionUrl = "jdbc:postgresql://localhost:5432/main";
    }

    public static DatabaseConnection getInstance() {
        if (instance == null) {
            synchronized (DatabaseConnection.class) {
                if (instance == null) {
                    instance = new DatabaseConnection();
                }
            }
        }
        return instance;
    }
}`,
    faultyLineNumber: 2,
    bugOptions: [
      { category: 'Logic', explanation: 'instance must be declared volatile to prevent CPU instruction reordering where memory is assigned to instance before constructor execution.', isCorrect: true },
      { category: 'Syntax', explanation: 'synchronized blocks cannot lock on class objects in Java.', isCorrect: false },
      { category: 'Runtime', explanation: 'Calling new inside a synchronized block throws IllegalMonitorStateException.', isCorrect: false },
      { category: 'Algorithms', explanation: 'Singletons must use ReentrantLock instead of synchronized.', isCorrect: false }
    ],
    fixOptions: [
      { id: 'f1', codeSnippet: 'private static volatile DatabaseConnection instance;', explanation: 'Adds volatile keyword to enforce happens-before memory ordering.', isCorrect: true },
      { id: 'f2', codeSnippet: 'public synchronized static DatabaseConnection getInstance()', explanation: 'Synchronization on every call works but causes severe performance bottlenecks.', isCorrect: false },
      { id: 'f3', codeSnippet: 'private final static DatabaseConnection instance = null;', explanation: 'Final field set to null cannot be reassigned.', isCorrect: false }
    ],
    correctedCode: `public class DatabaseConnection {
    private static volatile DatabaseConnection instance;
    private String connectionUrl;

    private DatabaseConnection() {
        this.connectionUrl = "jdbc:postgresql://localhost:5432/main";
    }

    public static DatabaseConnection getInstance() {
        if (instance == null) {
            synchronized (DatabaseConnection.class) {
                if (instance == null) {
                    instance = new DatabaseConnection();
                }
            }
        }
        return instance;
    }
}`,
    correctDiagnosis: 'Without volatile, Java memory model permits instructions to reorder: memory allocation -> instance reference set -> constructor call.',
    whyOriginalFailed: 'Thread A allocates memory and sets instance != null before the constructor runs. Thread B enters the outer if (instance == null), sees false, and returns the half-baked object.',
    whyFixWorks: 'The volatile keyword inserts memory barriers that prevent write-reordering across the assignment.',
    testCases: [
      { id: 'tc-1', name: 'Single Thread Access', input: 'Single thread call to getInstance()', expectedOutput: 'Valid connection object', actualWithBug: 'Valid connection object', exposesBug: false, explanation: 'No concurrency race on single thread.' },
      { id: 'tc-2', name: 'High Concurrent Contention', input: '100 threads calling getInstance() simultaneously', expectedOutput: 'All threads read non-null initialized fields', actualWithBug: 'Thread reads connectionUrl == null', exposesBug: true, explanation: 'Instruction reordering exposes uninitialized fields.' }
    ],
    exposingTestCaseId: 'tc-2',
    hints: [
      { text: 'Look at the field declaration on line 2: private static DatabaseConnection instance.', penalty: 3 },
      { text: 'What keyword does Java require for double-checked locking in concurrent multithreading?', penalty: 5 },
      { text: 'Declare the field as volatile: private static volatile DatabaseConnection instance;', penalty: 8 }
    ],
    points: 25,
    timeLimitSeconds: 90,
    interviewTip: 'A legendary Java concurrency interview question: double-checked locking is broken in Java without volatile.'
  },

  // 22. Python - Palindrome Check Failing on Punctuation and Case (Intermediate - Edge Cases)
  {
    id: 'bug-22',
    title: 'Valid Palindrome Sensitive to Case and Punctuation',
    language: 'Python',
    difficulty: 'Intermediate',
    category: 'Edge Cases',
    problemStatement: 'Determine if a sentence is a palindrome, considering only alphanumeric characters and ignoring cases.',
    expectedBehavior: '"A man, a plan, a canal: Panama" should return True.',
    actualBehavior: 'Returns False because punctuation and uppercase characters are not sanitized.',
    faultyCode: `def is_palindrome(s):
    # Check if string is palindrome
    left = 0
    right = len(s) - 1
    
    while left < right:
        if s[left] != s[right]:
            return False
        left += 1
        right -= 1
        
    return True`,
    faultyLineNumber: 7,
    bugOptions: [
      { category: 'Edge Cases', explanation: 'The algorithm compares raw characters without filtering non-alphanumeric symbols or normalizing letter casing.', isCorrect: true },
      { category: 'Syntax', explanation: 'Strings cannot be indexed using two pointer indices in Python.', isCorrect: false },
      { category: 'Logic', explanation: 'The loop condition should be left <= right instead of left < right.', isCorrect: false },
      { category: 'Runtime', explanation: 'Calling len(s) on strings throws TypeError.', isCorrect: false }
    ],
    fixOptions: [
      { id: 'f1', codeSnippet: `clean = [c.lower() for c in s if c.isalnum()]
return clean == clean[::-1]`, explanation: 'Sanitizes characters and checks palindrome symmetry cleanly.', isCorrect: true },
      { id: 'f2', codeSnippet: `while left < right:
    while left < right and not s[left].isalnum(): left += 1
    while left < right and not s[right].isalnum(): right -= 1
    if s[left].lower() != s[right].lower(): return False
    left += 1; right -= 1`, explanation: 'In-place two-pointer approach skipping non-alphanumeric characters.', isCorrect: true },
      { id: 'f3', codeSnippet: 'return s.lower() == s[::-1].lower()', explanation: 'Lowercases but still fails on spaces and commas.', isCorrect: false }
    ],
    correctedCode: `def is_palindrome(s):
    clean = [c.lower() for c in s if c.isalnum()]
    return clean == clean[::-1]`,
    correctDiagnosis: 'Interview palindrome problems require skipping non-alphanumeric characters and comparing case-insensitively.',
    whyOriginalFailed: 's[left] = "A" and s[right] = "a" are compared directly, and punctuation like commas and colons are treated as letters.',
    whyFixWorks: 'Filtering with c.isalnum() and lowercasing eliminates punctuation and case mismatches.',
    testCases: [
      { id: 'tc-1', name: 'Simple Lowercase Palindrome', input: 's = "racecar"', expectedOutput: 'True', actualWithBug: 'True', exposesBug: false, explanation: 'All lowercase characters with no spaces.' },
      { id: 'tc-2', name: 'Sentence with Punctuation and Case', input: 's = "A man, a plan, a canal: Panama"', expectedOutput: 'True', actualWithBug: 'False', exposesBug: true, explanation: 'Fails on first character: "A" != "a" and compares space to letter.' }
    ],
    exposingTestCaseId: 'tc-2',
    hints: [
      { text: 'Look at lines 6 to 9 where characters are compared directly.', penalty: 3 },
      { text: 'What does the problem specification require regarding casing and punctuation?', penalty: 5 },
      { text: 'Filter with c.isalnum() and convert to lowercase with .lower().', penalty: 8 }
    ],
    points: 20,
    timeLimitSeconds: 75,
    interviewTip: 'Always clarify if spaces, symbols, and letter casing should be ignored in string matching problems.'
  },

  // 23. JavaScript - Debounce Function Context Loss (Advanced - Runtime)
  {
    id: 'bug-23',
    title: 'Debounce Utility Losing Function this Context',
    language: 'JavaScript',
    difficulty: 'Advanced',
    category: 'Runtime',
    problemStatement: 'Debounce an object method. Calling the debounced method throws TypeError: Cannot read properties of undefined (reading this.name).',
    expectedBehavior: 'Executes the debounced callback preserving the original `this` context and arguments.',
    actualBehavior: 'Executes callback with global/undefined this because arrow function wraps without apply(this, args).',
    faultyCode: `function debounce(fn, delay) {
    let timerId;
    return function (...args) {
        clearTimeout(timerId);
        timerId = setTimeout(() => {
            fn(args);
        }, delay);
    };
}`,
    faultyLineNumber: 6,
    bugOptions: [
      { category: 'Runtime', explanation: 'fn(args) passes the arguments array as a single argument instead of spreading them, and loses the caller this context.', isCorrect: true },
      { category: 'Syntax', explanation: 'setTimeout does not accept arrow function callbacks.', isCorrect: false },
      { category: 'Logic', explanation: 'clearTimeout should be called after setTimeout.', isCorrect: false },
      { category: 'Algorithms', explanation: 'Debounce cannot be implemented using JavaScript timers.', isCorrect: false }
    ],
    fixOptions: [
      { id: 'f1', codeSnippet: `timerId = setTimeout(() => {
    fn.apply(this, args);
}, delay);`, explanation: 'Preserves the caller this reference and spreads the arguments array.', isCorrect: true },
      { id: 'f2', codeSnippet: `fn(...args);`, explanation: 'Spreads arguments but still loses this context on non-arrow outer functions.', isCorrect: false },
      { id: 'f3', codeSnippet: `timerId = null; fn(args);`, explanation: 'Destroys timer tracking.', isCorrect: false }
    ],
    correctedCode: `function debounce(fn, delay) {
    let timerId;
    return function (...args) {
        clearTimeout(timerId);
        timerId = setTimeout(() => {
            fn.apply(this, args);
        }, delay);
    };
}`,
    correctDiagnosis: 'Debounced wrappers must preserve both this context and the original argument parameter list.',
    whyOriginalFailed: 'fn(args) sends an Array as arg 0 rather than expanding arguments, and does not bind this to the executing object.',
    whyFixWorks: 'fn.apply(this, args) correctly binds the caller context and spreads arguments to the wrapped function.',
    testCases: [
      { id: 'tc-1', name: 'Standalone Function', input: 'debounce(console.log, 100)("hello")', expectedOutput: 'Logs "hello"', actualWithBug: 'Logs ["hello"] as array', exposesBug: true, explanation: 'Arguments are nested inside an extra array.' }
    ],
    exposingTestCaseId: 'tc-1',
    hints: [
      { text: 'Look at line 6: fn(args).', penalty: 3 },
      { text: 'How are arguments and this passed to fn inside setTimeout?', penalty: 5 },
      { text: 'Use fn.apply(this, args) to preserve this and spread arguments.', penalty: 8 }
    ],
    points: 25,
    timeLimitSeconds: 90,
    interviewTip: 'A staple frontend engineering interview question: explain throttle vs debounce and how this and arguments are forwarded.'
  },

  // 24. C++ - Missing Base Case in Tree Recursion (Intermediate - Logic)
  {
    id: 'bug-24',
    title: 'Missing Null Check in Binary Tree Max Depth',
    language: 'C++',
    difficulty: 'Intermediate',
    category: 'Logic',
    problemStatement: 'Calculate max depth of a binary tree. Throws segmentation fault when called on an empty tree or null child.',
    expectedBehavior: 'Returns 0 for null root, or 1 + max(left, right).',
    actualBehavior: 'Attempts to dereference root->left and root->right on null pointer, crashing with Segmentation Fault.',
    faultyCode: `struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
};

int maxDepth(TreeNode* root) {
    if (root->left == nullptr && root->right == nullptr) {
        return 1;
    }
    int leftDepth = maxDepth(root->left);
    int rightDepth = maxDepth(root->right);
    return 1 + std::max(leftDepth, rightDepth);
}`,
    faultyLineNumber: 8,
    bugOptions: [
      { category: 'Logic', explanation: 'Missing the base case if (root == nullptr) return 0; Line 8 dereferences root without verifying root != nullptr.', isCorrect: true },
      { category: 'Syntax', explanation: 'nullptr is deprecated in modern C++.', isCorrect: false },
      { category: 'Runtime', explanation: 'std::max cannot compare two integer depths.', isCorrect: false },
      { category: 'Algorithms', explanation: 'Tree depth can only be computed with BFS queue traversal.', isCorrect: false }
    ],
    fixOptions: [
      { id: 'f1', codeSnippet: `if (root == nullptr) {
    return 0;
}`, explanation: 'Adds the universal null base case at the top of the recursive function.', isCorrect: true },
      { id: 'f2', codeSnippet: 'if (!root->left) return 0;', explanation: 'Only checks left child and still crashes on null root.', isCorrect: false },
      { id: 'f3', codeSnippet: 'return root ? 1 : 0;', explanation: 'Does not compute recursive depth.', isCorrect: false }
    ],
    correctedCode: `struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
};

int maxDepth(TreeNode* root) {
    if (root == nullptr) {
        return 0;
    }
    int leftDepth = maxDepth(root->left);
    int rightDepth = maxDepth(root->right);
    return 1 + std::max(leftDepth, rightDepth);
}`,
    correctDiagnosis: 'Tree recursion requires checking if root itself is null before accessing root->left or root->right.',
    whyOriginalFailed: 'If root is nullptr or a node has only one child (e.g. left exists, right is null), maxDepth(root->right) passes nullptr, which then evaluates root->left on nullptr, crashing immediately.',
    whyFixWorks: 'Checking root == nullptr as the very first guard terminates leaf branches cleanly with depth 0.',
    testCases: [
      { id: 'tc-1', name: 'Empty Tree', input: 'root = nullptr', expectedOutput: '0', actualWithBug: 'Segmentation Fault', exposesBug: true, explanation: 'root->left evaluated on nullptr.' },
      { id: 'tc-2', name: 'Single Child Tree (Skewed)', input: 'root with only left child', expectedOutput: '2', actualWithBug: 'Segmentation Fault on right recursive call', exposesBug: true, explanation: 'Right child nullptr dereferenced in recursive call.' }
    ],
    exposingTestCaseId: 'tc-1',
    hints: [
      { text: 'Look at line 8: if (root->left == nullptr && root->right == nullptr).', penalty: 3 },
      { text: 'What happens if root is nullptr when passed into maxDepth?', penalty: 5 },
      { text: 'Add if (root == nullptr) return 0; as the first line of the function.', penalty: 8 }
    ],
    points: 20,
    timeLimitSeconds: 75,
    interviewTip: 'Always check if the current node is null as the base case instead of trying to inspect its children before recurring.'
  },

  // 25. Python - Modifying List While Iterating (Intermediate - Logic)
  {
    id: 'bug-25',
    title: 'Python List Index Shift During In-Loop remove()',
    language: 'Python',
    difficulty: 'Intermediate',
    category: 'Logic',
    problemStatement: 'Remove all occurrences of a target value from a list in Python. Adjacent target elements are skipped and left in the list.',
    expectedBehavior: 'Removes all matching values: [2, 3, 3, 4] with target 3 should become [2, 4].',
    actualBehavior: 'Produces [2, 3, 4] because removing an item shifts subsequent elements to the left while the loop index advances.',
    faultyCode: `def remove_all(items, target):
    for item in items:
        if item == target:
            items.remove(item)
    return items`,
    faultyLineNumber: 2,
    bugOptions: [
      { category: 'Logic', explanation: 'Modifying a list while iterating over it causes the internal iteration index to skip the element immediately following a deleted item.', isCorrect: true },
      { category: 'Syntax', explanation: 'items.remove() is an invalid method in Python.', isCorrect: false },
      { category: 'Runtime', explanation: 'Modifying a list in-place triggers ConcurrentModificationException in Python.', isCorrect: false },
      { category: 'Edge Cases', explanation: 'items cannot contain integer values.', isCorrect: false }
    ],
    fixOptions: [
      { id: 'f1', codeSnippet: 'return [item for item in items if item != target]', explanation: 'Creates a clean filtered list using list comprehension.', isCorrect: true },
      { id: 'f2', codeSnippet: `items[:] = [item for item in items if item != target]
return items`, explanation: 'Mutates the existing list in-place via slice assignment without skipping.', isCorrect: true },
      { id: 'f3', codeSnippet: `for i in range(len(items)):
    if items[i] == target:
        items.remove(target)`, explanation: 'Still causes IndexError as the list length shrinks during iteration.', isCorrect: false }
    ],
    correctedCode: `def remove_all(items, target):
    items[:] = [item for item in items if item != target]
    return items`,
    correctDiagnosis: 'Mutating a sequence while iterating over it shifts indices, causing the iterator to skip adjacent target elements.',
    whyOriginalFailed: 'When items = [2, 3, 3, 4] and index 1 (value 3) is removed, the second 3 moves to index 1. The iterator advances to index 2 (value 4), skipping the second 3.',
    whyFixWorks: 'List comprehension creates the filtered collection, and items[:] = ... mutates the original reference in-place.',
    testCases: [
      { id: 'tc-1', name: 'Isolated Targets', input: 'items = [1, 2, 3, 4, 3], target = 3', expectedOutput: '[1, 2, 4]', actualWithBug: '[1, 2, 4]', exposesBug: false, explanation: 'Non-consecutive targets happen not to be skipped.' },
      { id: 'tc-2', name: 'Adjacent Duplicate Targets', input: 'items = [2, 3, 3, 4], target = 3', expectedOutput: '[2, 4]', actualWithBug: '[2, 3, 4]', exposesBug: true, explanation: 'Second 3 is skipped due to index shift.' }
    ],
    exposingTestCaseId: 'tc-2',
    hints: [
      { text: 'Look at line 2: for item in items and items.remove(item).', penalty: 3 },
      { text: 'What happens to the indices of remaining elements when an item is deleted?', penalty: 5 },
      { text: 'Use a list comprehension: items[:] = [x for x in items if x != target].', penalty: 8 }
    ],
    points: 20,
    timeLimitSeconds: 75,
    interviewTip: 'Never mutate a collection while directly iterating over it. Iterate over a copy, use list comprehension, or iterate backward.'
  },

  // 26. Java - PriorityQueue Default Min-Heap vs Max-Heap (Intermediate - Algorithms)
  {
    id: 'bug-26',
    title: 'Java PriorityQueue Default Ordering in Top K Elements',
    language: 'Java',
    difficulty: 'Intermediate',
    category: 'Algorithms',
    problemStatement: 'Find K-th largest element in an unsorted array using a heap. The method returns the K-th smallest element instead.',
    expectedBehavior: 'Returns the K-th largest element in O(N log K) time using a min-heap of size K.',
    actualBehavior: 'Builds a max-heap incorrectly or extracts from the wrong direction.',
    faultyCode: `import java.util.PriorityQueue;

public class KthLargestFinder {
    public static int findKthLargest(int[] nums, int k) {
        // Find K-th largest element
        PriorityQueue<Integer> pq = new PriorityQueue<>((a, b) -> b - a);
        for (int num : nums) {
            pq.offer(num);
            if (pq.size() > k) {
                pq.poll();
            }
        }
        return pq.peek();
    }
}`,
    faultyLineNumber: 6,
    bugOptions: [
      { category: 'Algorithms', explanation: 'To keep the K largest elements, a Min-Heap is required so that smaller elements are evicted when size > K. Using (a, b) -> b - a creates a Max-Heap that evicts the largest numbers.', isCorrect: true },
      { category: 'Syntax', explanation: 'PriorityQueue does not accept comparator lambdas.', isCorrect: false },
      { category: 'Logic', explanation: 'pq.poll() must be called before pq.offer().', isCorrect: false },
      { category: 'Runtime', explanation: 'pq.peek() throws NullPointerException on non-empty queues.', isCorrect: false }
    ],
    fixOptions: [
      { id: 'f1', codeSnippet: 'PriorityQueue<Integer> pq = new PriorityQueue<>();', explanation: 'Uses Java default natural ordering (Min-Heap) so the smallest of the top K sits at the top.', isCorrect: true },
      { id: 'f2', codeSnippet: 'PriorityQueue<Integer> pq = new PriorityQueue<>((a, b) -> a.compareTo(b));', explanation: 'Explicit min-heap comparator.', isCorrect: true },
      { id: 'f3', codeSnippet: 'return pq.poll();', explanation: 'Polls the top element but does not fix the inverted heap ordering.', isCorrect: false }
    ],
    correctedCode: `import java.util.PriorityQueue;

public class KthLargestFinder {
    public static int findKthLargest(int[] nums, int k) {
        // Min-heap keeps top K elements; peek() is the K-th largest
        PriorityQueue<Integer> pq = new PriorityQueue<>();
        for (int num : nums) {
            pq.offer(num);
            if (pq.size() > k) {
                pq.poll();
            }
        }
        return pq.peek();
    }
}`,
    correctDiagnosis: 'Finding K largest requires a min-heap of size K so the root is the smallest of the K largest (the K-th largest).',
    whyOriginalFailed: 'With a max-heap ((a, b) -> b - a), pq.poll() drops the largest number every time size exceeds K, discarding the answer.',
    whyFixWorks: 'Default PriorityQueue in Java is a min-heap. Evicting the minimum leaves the K largest elements, with the K-th largest at the root.',
    testCases: [
      { id: 'tc-1', name: 'Array with Distinct Elements', input: 'nums = [3, 2, 1, 5, 6, 4], k = 2', expectedOutput: '5', actualWithBug: '2', exposesBug: true, explanation: 'Returns 2 (2nd smallest) instead of 5 (2nd largest).' },
      { id: 'tc-2', name: 'K Equals 1 (Max Element)', input: 'nums = [10, 20, 30], k = 1', expectedOutput: '30', actualWithBug: '10', exposesBug: true, explanation: 'Returns 10 instead of 30.' }
    ],
    exposingTestCaseId: 'tc-1',
    hints: [
      { text: 'Look at line 6: PriorityQueue<Integer> pq = new PriorityQueue<>((a, b) -> b - a);', penalty: 3 },
      { text: 'When size > k, which element does pq.poll() evict from a max-heap?', penalty: 5 },
      { text: 'Use a min-heap (new PriorityQueue<>()) to retain the K largest elements.', penalty: 8 }
    ],
    points: 20,
    timeLimitSeconds: 75,
    interviewTip: 'Counter-intuitive rule: Use a MIN-heap to find K LARGEST elements; use a MAX-heap to find K SMALLEST elements.'
  },

  // 27. JavaScript - Missing Return in Array.map Callback (Beginner - Syntax)
  {
    id: 'bug-27',
    title: 'Undefined Elements from Curly Braces in Arrow Map',
    language: 'JavaScript',
    difficulty: 'Beginner',
    category: 'Syntax',
    problemStatement: 'Double every price in an array of numbers. The output array contains [undefined, undefined, undefined].',
    expectedBehavior: 'Returns transformed array: [20, 40, 60].',
    actualBehavior: 'Returns [undefined, undefined, undefined] because curly braces {} were used without a return statement.',
    faultyCode: `function doublePrices(prices) {
    const doubled = prices.map(price => {
        price * 2;
    });
    return doubled;
}`,
    faultyLineNumber: 3,
    bugOptions: [
      { category: 'Syntax', explanation: 'Arrow functions with curly braces {} require an explicit return statement, otherwise they return undefined.', isCorrect: true },
      { category: 'Logic', explanation: 'price * 2 does not modify the price variable.', isCorrect: false },
      { category: 'Runtime', explanation: 'prices.map is not an array method in JavaScript.', isCorrect: false },
      { category: 'Edge Cases', explanation: 'Prices must be strings to be mapped.', isCorrect: false }
    ],
    fixOptions: [
      { id: 'f1', codeSnippet: 'const doubled = prices.map(price => price * 2);', explanation: 'Uses concise arrow function body with implicit return.', isCorrect: true },
      { id: 'f2', codeSnippet: `const doubled = prices.map(price => {
    return price * 2;
});`, explanation: 'Adds explicit return statement inside the block body.', isCorrect: true },
      { id: 'f3', codeSnippet: 'prices.forEach(price => price * 2);', explanation: 'forEach returns undefined.', isCorrect: false }
    ],
    correctedCode: `function doublePrices(prices) {
    const doubled = prices.map(price => price * 2);
    return doubled;
}`,
    correctDiagnosis: 'In ES6 arrow functions, wrapping the body in {} denotes a block, which returns undefined unless return is explicitly specified.',
    whyOriginalFailed: 'price => { price * 2; } calculates the multiplication as an unused expression statement and returns undefined for every element.',
    whyFixWorks: 'price => price * 2 uses an expression body with an implicit return.',
    testCases: [
      { id: 'tc-1', name: 'Positive Prices', input: 'prices = [10, 20, 30]', expectedOutput: '[20, 40, 60]', actualWithBug: '[undefined, undefined, undefined]', exposesBug: true, explanation: 'All elements mapped to undefined.' },
      { id: 'tc-2', name: 'Empty Array', input: 'prices = []', expectedOutput: '[]', actualWithBug: '[]', exposesBug: false, explanation: 'Map produces empty array.' }
    ],
    exposingTestCaseId: 'tc-1',
    hints: [
      { text: 'Look at line 2 and 3: price => { price * 2; }.', penalty: 3 },
      { text: 'Does an arrow function with {} automatically return the last evaluated expression?', penalty: 5 },
      { text: 'Remove the curly braces or add an explicit return keyword: return price * 2.', penalty: 8 }
    ],
    points: 15,
    timeLimitSeconds: 60,
    interviewTip: 'Arrow function concise body (=> x) vs block body (=> { return x; }) is a frequent source of bugs in frontend callbacks.'
  },

  // 28. Python - Modifying Loop Counter Variable Inside While Loop (Beginner - Logic)
  {
    id: 'bug-28',
    title: 'Python Missing Step Increment in While Loop',
    language: 'Python',
    difficulty: 'Beginner',
    category: 'Logic',
    problemStatement: 'Print countdown or gather even numbers below N. The function runs forever and exhausts CPU.',
    expectedBehavior: 'Collects even numbers below N and terminates.',
    actualBehavior: 'Loops infinitely because the loop increment is accidentally placed inside an if-statement.',
    faultyCode: `def collect_evens(n):
    evens = []
    i = 0
    while i < n:
        if i % 2 == 0:
            evens.append(i)
            i += 1
    return evens`,
    faultyLineNumber: 7,
    bugOptions: [
      { category: 'Logic', explanation: 'i += 1 is indented inside the if block, so when i is odd, it never increments and the while loop hangs forever.', isCorrect: true },
      { category: 'Syntax', explanation: 'While loop conditions in Python must be enclosed in parentheses.', isCorrect: false },
      { category: 'Runtime', explanation: 'evens.append fails on odd integers.', isCorrect: false },
      { category: 'Edge Cases', explanation: 'Function fails when n is negative.', isCorrect: false }
    ],
    fixOptions: [
      { id: 'f1', codeSnippet: `while i < n:
    if i % 2 == 0:
        evens.append(i)
    i += 1`, explanation: 'Unindents i += 1 so it executes on every iteration.', isCorrect: true },
      { id: 'f2', codeSnippet: 'return list(range(0, n, 2))', explanation: 'Idiomatic Python range with step 2.', isCorrect: true },
      { id: 'f3', codeSnippet: 'i += 2', explanation: 'If i starts at 1, still loops forever.', isCorrect: false }
    ],
    correctedCode: `def collect_evens(n):
    evens = []
    i = 0
    while i < n:
        if i % 2 == 0:
            evens.append(i)
        i += 1
    return evens`,
    correctDiagnosis: 'Indentation error: placing counter increment inside a conditional branch freezes the counter on the alternate branch.',
    whyOriginalFailed: 'When i = 0, it appends 0 and increments to 1. On the next iteration, i % 2 == 0 is false, so i += 1 never runs and i stays 1 forever.',
    whyFixWorks: 'Unindenting i += 1 guarantees advancement on every pass of the while loop.',
    testCases: [
      { id: 'tc-1', name: 'N = 1', input: 'n = 1', expectedOutput: '[0]', actualWithBug: '[0]', exposesBug: false, explanation: '0 is even, increments to 1, then terminates.' },
      { id: 'tc-2', name: 'N = 4', input: 'n = 4', expectedOutput: '[0, 2]', actualWithBug: 'Time Limit Exceeded (Freezes at i = 1)', exposesBug: true, explanation: 'Hangs on i = 1 indefinitely.' }
    ],
    exposingTestCaseId: 'tc-2',
    hints: [
      { text: 'Look at the indentation of line 7: i += 1.', penalty: 3 },
      { text: 'What happens to i when i % 2 == 0 is False?', penalty: 5 },
      { text: 'Unindent i += 1 so it runs outside the if condition.', penalty: 8 }
    ],
    points: 15,
    timeLimitSeconds: 60,
    interviewTip: 'In Python, indentation defines block scoping. Always inspect whether loop counters are trapped inside conditional branches.'
  },

  // 29. C++ - Missing Virtual Destructor in Polymorphic Base Class (Advanced - Runtime)
  {
    id: 'bug-29',
    title: 'C++ Memory Leak from Non-Virtual Base Destructor',
    language: 'C++',
    difficulty: 'Advanced',
    category: 'Runtime',
    problemStatement: 'Delete a derived class instance via a pointer to its base class. Derived class resources (e.g. buffers) are never freed.',
    expectedBehavior: 'Derived destructor executes, cleaning up heap memory.',
    actualBehavior: 'Only Base destructor executes; Derived destructor is bypassed, leaking memory and invoking undefined behavior.',
    faultyCode: `class Base {
public:
    Base() {}
    ~Base() {} // Missing virtual
};

class Derived : public Base {
private:
    int* buffer;
public:
    Derived() : buffer(new int[1000]) {}
    ~Derived() { delete[] buffer; }
};

void cleanup(Base* ptr) {
    delete ptr;
}`,
    faultyLineNumber: 4,
    bugOptions: [
      { category: 'Runtime', explanation: 'Deleting a derived class object through a pointer to a base class with a non-virtual destructor results in undefined behavior and skips the derived destructor.', isCorrect: true },
      { category: 'Syntax', explanation: 'Derived classes cannot allocate arrays with new.', isCorrect: false },
      { category: 'Logic', explanation: 'delete[] should be written as free(buffer).', isCorrect: false },
      { category: 'Edge Cases', explanation: 'Base class cannot have a default constructor.', isCorrect: false }
    ],
    fixOptions: [
      { id: 'f1', codeSnippet: 'virtual ~Base() {}', explanation: 'Marks base destructor as virtual to enable polymorphic destruction dispatch.', isCorrect: true },
      { id: 'f2', codeSnippet: 'virtual ~Derived() {}', explanation: 'Derived is already virtual if base is virtual, but base destructor must be virtual.', isCorrect: false },
      { id: 'f3', codeSnippet: 'Base* ptr = static_cast<Derived*>(ptr);', explanation: 'Invalid syntax inside cleanup function.', isCorrect: false }
    ],
    correctedCode: `class Base {
public:
    Base() {}
    virtual ~Base() {}
};

class Derived : public Base {
private:
    int* buffer;
public:
    Derived() : buffer(new int[1000]) {}
    ~Derived() { delete[] buffer; }
};

void cleanup(Base* ptr) {
    delete ptr;
}`,
    correctDiagnosis: 'C++ standard: deleting an object of derived class through a pointer to base class without a virtual destructor is undefined behavior.',
    whyOriginalFailed: 'Because Base::~Base() is non-virtual, the compiler statically binds delete ptr to Base::~Base(), bypassing Derived::~Derived() and leaking buffer.',
    whyFixWorks: 'Declaring virtual ~Base() registers the destructor in the vtable, ensuring the runtime dispatches to the most derived destructor first.',
    testCases: [
      { id: 'tc-1', name: 'Polymorphic Delete', input: 'cleanup(new Derived())', expectedOutput: 'Derived destructor called, 0 memory leaked', actualWithBug: 'Derived destructor skipped, 1000 ints leaked', exposesBug: true, explanation: 'Static dispatch invokes only Base destructor.' }
    ],
    exposingTestCaseId: 'tc-1',
    hints: [
      { text: 'Look at the destructor declaration on line 4: ~Base() {}.', penalty: 3 },
      { text: 'What keyword must precede the destructor of any polymorphic base class?', penalty: 5 },
      { text: 'Add the virtual keyword: virtual ~Base() {}.', penalty: 8 }
    ],
    points: 25,
    timeLimitSeconds: 90,
    interviewTip: 'Golden rule in C++: If a class has ANY virtual function, or is meant to be inherited polymorphically, its destructor MUST be virtual.'
  },

  // 30. Java - String Split Regex Special Character Trap (Intermediate - Syntax)
  {
    id: 'bug-30',
    title: 'Java String.split Dot Regex Escaping Pitfall',
    language: 'Java',
    difficulty: 'Intermediate',
    category: 'Syntax',
    problemStatement: 'Split an IP address or domain name by the dot character ".". The resulting array is unexpectedly empty.',
    expectedBehavior: 'Splits "192.168.1.1" into 4 tokens: ["192", "168", "1", "1"].',
    actualBehavior: 'Returns an empty array [] because "." in regular expressions matches every character.',
    faultyCode: `public class DomainParser {
    public static String[] parseDomain(String domain) {
        if (domain == null) return new String[0];
        
        // Split by period delimiter
        String[] parts = domain.split(".");
        return parts;
    }
}`,
    faultyLineNumber: 6,
    bugOptions: [
      { category: 'Syntax', explanation: 'String.split() takes a regular expression. In regex, dot . matches any character, so split(".") consumes all characters and returns an empty array.', isCorrect: true },
      { category: 'Logic', explanation: 'Domain names cannot be split into arrays in Java.', isCorrect: false },
      { category: 'Runtime', explanation: 'String.split throws PatternSyntaxException on dots.', isCorrect: false },
      { category: 'Edge Cases', explanation: 'Arrays must be explicitly sized before calling split.', isCorrect: false }
    ],
    fixOptions: [
      { id: 'f1', codeSnippet: 'String[] parts = domain.split("\\\\.");', explanation: 'Escapes the dot with double backslashes for regex.', isCorrect: true },
      { id: 'f2', codeSnippet: 'String[] parts = domain.split(java.util.regex.Pattern.quote("."));', explanation: 'Uses Pattern.quote to treat the string as a literal.', isCorrect: true },
      { id: 'f3', codeSnippet: 'String[] parts = domain.split("/.");', explanation: 'Forward slash is not the escape character.', isCorrect: false }
    ],
    correctedCode: `public class DomainParser {
    public static String[] parseDomain(String domain) {
        if (domain == null) return new String[0];
        
        // Escape dot for regex
        String[] parts = domain.split("\\\\.");
        return parts;
    }
}`,
    correctDiagnosis: 'Java String.split(regex) interprets . as the wildcard regex character. You must escape it as "\\\\." or use Pattern.quote(".").',
    whyOriginalFailed: 'Since . matches any character, split(".") splits on every single character, stripping all text and returning String[0].',
    whyFixWorks: '\\\\. escapes the regex dot so it matches literal periods only.',
    testCases: [
      { id: 'tc-1', name: 'IP Address String', input: 'domain = "192.168.1.1"', expectedOutput: '["192", "168", "1", "1"]', actualWithBug: '[]', exposesBug: true, explanation: 'All characters consumed by unescaped dot regex.' }
    ],
    exposingTestCaseId: 'tc-1',
    hints: [
      { text: 'Look at line 6: domain.split(".").', penalty: 3 },
      { text: 'Remember that String.split takes a regular expression, not a literal character.', penalty: 5 },
      { text: 'Escape the dot with double backslashes: domain.split("\\\\.").', penalty: 8 }
    ],
    points: 20,
    timeLimitSeconds: 75,
    interviewTip: 'When using String.split in Java, remember special regex characters: . | ^ $ * + ? ( ) [ { \\ must all be escaped.'
  },

  // 31. Python - Variable Scope Shadowing in Recursive Helper (Intermediate - Logic)
  {
    id: 'bug-31',
    title: 'Python UnboundLocalError on Outer Scope Counter',
    language: 'Python',
    difficulty: 'Intermediate',
    category: 'Logic',
    problemStatement: 'Count leaves in a tree using an internal DFS helper. Python crashes with UnboundLocalError: local variable referenced before assignment.',
    expectedBehavior: 'Increments leaf count and returns total leaf count.',
    actualBehavior: 'Crashes on count += 1 because assigning to count marks it as a local variable without nonlocal declaration.',
    faultyCode: `def count_leaves(root):
    count = 0
    
    def dfs(node):
        if not node:
            return
        if not node.left and not node.right:
            count += 1
            return
        dfs(node.left)
        dfs(node.right)
        
    dfs(root)
    return count`,
    faultyLineNumber: 8,
    bugOptions: [
      { category: 'Logic', explanation: 'Inside dfs(), count += 1 binds count as a local variable. Because it is read before assignment, Python raises UnboundLocalError.', isCorrect: true },
      { category: 'Syntax', explanation: 'Functions cannot be defined inside other functions in Python.', isCorrect: false },
      { category: 'Runtime', explanation: 'Recursive functions cannot access outer variables.', isCorrect: false },
      { category: 'Edge Cases', explanation: 'Leaf count cannot start at 0.', isCorrect: false }
    ],
    fixOptions: [
      { id: 'f1', codeSnippet: `def dfs(node):
    nonlocal count
    if not node:
        return`, explanation: 'Adds nonlocal count so Python modifies the outer scope variable.', isCorrect: true },
      { id: 'f2', codeSnippet: `def count_leaves(root):
    if not root: return 0
    if not root.left and not root.right: return 1
    return count_leaves(root.left) + count_leaves(root.right)`, explanation: 'Pure recursive function returning the sum directly without mutable outer state.', isCorrect: true },
      { id: 'f3', codeSnippet: 'global count', explanation: 'Looks for count in module global scope instead of enclosing function scope.', isCorrect: false }
    ],
    correctedCode: `def count_leaves(root):
    count = 0
    
    def dfs(node):
        nonlocal count
        if not node:
            return
        if not node.left and not node.right:
            count += 1
            return
        dfs(node.left)
        dfs(node.right)
        
    dfs(root)
    return count`,
    correctDiagnosis: 'In Python, reassigning a variable in an inner function makes it local to that function unless declared nonlocal.',
    whyOriginalFailed: 'Python sees count += 1 (which compiles to count = count + 1) and treats count as local to dfs. Evaluating count on the right-hand side before it is assigned locally raises UnboundLocalError.',
    whyFixWorks: 'nonlocal count explicitly instructs the Python interpreter that assignments target the enclosing scope variable.',
    testCases: [
      { id: 'tc-1', name: 'Tree with 2 Leaves', input: 'Root with left and right leaf nodes', expectedOutput: '2', actualWithBug: 'UnboundLocalError: local variable "count" referenced before assignment', exposesBug: true, explanation: 'Fails on first leaf visit.' }
    ],
    exposingTestCaseId: 'tc-1',
    hints: [
      { text: 'Look at line 8 where count += 1 is called inside the nested dfs function.', penalty: 3 },
      { text: 'What scope does Python assign to a variable when it is modified with += inside a closure?', penalty: 5 },
      { text: 'Add nonlocal count at the top of the dfs function.', penalty: 8 }
    ],
    points: 20,
    timeLimitSeconds: 75,
    interviewTip: 'LEGB rule in Python: Local, Enclosing, Global, Built-in. Reassigning enclosing variables requires the nonlocal keyword.'
  },

  // 32. JavaScript - Optional Chaining Nested Property Access (Beginner - Syntax)
  {
    id: 'bug-32',
    title: 'Uncaught TypeError Reading Deep Property of Undefined',
    language: 'JavaScript',
    difficulty: 'Beginner',
    category: 'Syntax',
    problemStatement: 'Extract street address from an API response where the address or user may be omitted. Crashes on missing addresses.',
    expectedBehavior: 'Returns "N/A" safely when address object is absent.',
    actualBehavior: 'Throws Uncaught TypeError: Cannot read properties of undefined (reading "street").',
    faultyCode: `function getUserStreet(response) {
    // Return street name or "N/A"
    if (response.data.user.address.street) {
        return response.data.user.address.street;
    }
    return "N/A";
}`,
    faultyLineNumber: 3,
    bugOptions: [
      { category: 'Syntax', explanation: 'Chaining dot notation .address.street throws TypeError if any intermediate property (data, user, or address) is undefined or null.', isCorrect: true },
      { category: 'Logic', explanation: 'Strings cannot be returned from a function taking an object.', isCorrect: false },
      { category: 'Runtime', explanation: 'if statements in JavaScript cannot evaluate string truthiness.', isCorrect: false },
      { category: 'Edge Cases', explanation: 'JSON responses cannot have nested objects.', isCorrect: false }
    ],
    fixOptions: [
      { id: 'f1', codeSnippet: 'return response?.data?.user?.address?.street ?? "N/A";', explanation: 'Uses optional chaining (?.) and nullish coalescing (??) for safe deep traversal.', isCorrect: true },
      { id: 'f2', codeSnippet: 'return response.data && response.data.user && response.data.user.address ? response.data.user.address.street : "N/A";', explanation: 'Classic guard chain approach.', isCorrect: true },
      { id: 'f3', codeSnippet: 'return response.street || "N/A";', explanation: 'Ignores the nested data structure.', isCorrect: false }
    ],
    correctedCode: `function getUserStreet(response) {
    // Safe traversal with optional chaining
    return response?.data?.user?.address?.street ?? "N/A";
}`,
    correctDiagnosis: 'In JavaScript, accessing properties on null or undefined throws a fatal TypeError. Optional chaining (?.) short-circuits gracefully.',
    whyOriginalFailed: 'If response.data.user has no address property (address is undefined), address.street crashes immediately.',
    whyFixWorks: 'Optional chaining (?.) evaluates to undefined as soon as any step in the chain is nullish, and ?? "N/A" returns the fallback.',
    testCases: [
      { id: 'tc-1', name: 'Complete User Object', input: '{ data: { user: { address: { street: "Main St" } } } }', expectedOutput: '"Main St"', actualWithBug: '"Main St"', exposesBug: false, explanation: 'All properties exist.' },
      { id: 'tc-2', name: 'Missing Address Field', input: '{ data: { user: { name: "Bob" } } }', expectedOutput: '"N/A"', actualWithBug: 'TypeError: Cannot read properties of undefined (reading "street")', exposesBug: true, explanation: 'Crashes on accessing .street on undefined address.' }
    ],
    exposingTestCaseId: 'tc-2',
    hints: [
      { text: 'Look at line 3 where properties are accessed across 4 levels.', penalty: 3 },
      { text: 'What happens if response.data.user does not have an address property?', penalty: 5 },
      { text: 'Use optional chaining: response?.data?.user?.address?.street ?? "N/A".', penalty: 8 }
    ],
    points: 15,
    timeLimitSeconds: 60,
    interviewTip: 'Optional chaining (?.) and nullish coalescing (??) are essential modern JS syntax for robust API response parsing.'
  }
];
