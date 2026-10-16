import { AlgorithmChallenge } from '../types/algorithmRush';

export const STARTER_ALGORITHM_CHALLENGES: AlgorithmChallenge[] = [
  // ==========================================
  // ARRAYS & STRINGS (1-7)
  // ==========================================
  {
    id: 'algo-arr-01',
    title: 'Two Sum Optimal Approach',
    mode: 'quick-solve',
    topic: 'Arrays & Strings',
    difficulty: 'Beginner',
    language: 'Python',
    problemStatement:
      'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. Each input has exactly one solution, and you may not use the same element twice. What is the optimal single-pass approach?',
    inputFormat: 'nums: int[], target: int',
    outputFormat: '[index1, index2]: int[]',
    constraints: ['2 <= nums.length <= 10^4', '-10^9 <= nums[i] <= 10^9', 'Exactly one valid answer exists.'],
    examples: [
      { input: 'nums = [2, 7, 11, 15], target = 9', output: '[0, 1]', explanation: 'nums[0] + nums[1] == 9, so return [0, 1].' },
      { input: 'nums = [3, 2, 4], target = 6', output: '[1, 2]', explanation: 'nums[1] + nums[2] == 6.' }
    ],
    edgeCases: ['Array with negative integers', 'Target sum with zeros (e.g., [0, 4, 3, 0], target = 0)'],
    options: [
      {
        id: 'opt-a',
        label: 'Hash Map single-pass lookup',
        codeSnippet: `seen = {}\nfor i, num in enumerate(nums):\n    diff = target - num\n    if diff in seen:\n        return [seen[diff], i]\n    seen[num] = i`,
        explanation: 'Stores each number and its index in a hash map as we iterate. Checks complement existence in O(1) average time.',
        isCorrect: true
      },
      {
        id: 'opt-b',
        label: 'Sort array and apply Two Pointers',
        codeSnippet: `nums.sort()\nleft, right = 0, len(nums) - 1\nwhile left < right:\n    ...`,
        explanation: 'Sorting takes O(n log n) and modifies original element indices, requiring extra storage to track initial positions.',
        isCorrect: false
      },
      {
        id: 'opt-c',
        label: 'Nested loops brute-force',
        codeSnippet: `for i in range(len(nums)):\n    for j in range(i + 1, len(nums)):\n        if nums[i] + nums[j] == target:\n            return [i, j]`,
        explanation: 'Checks all pairs in O(n^2) time, which is too slow for 10^4 inputs.',
        isCorrect: false
      },
      {
        id: 'opt-d',
        label: 'Binary search for each element complement',
        codeSnippet: `for i in range(len(nums)):\n    # binary search target - nums[i]`,
        explanation: 'Binary search requires sorted data. If unsorted, binary searching yields incorrect results.',
        isCorrect: false
      }
    ],
    correctOptionId: 'opt-a',
    detailedExplanation:
      'The Hash Map complement pattern trades O(n) auxiliary space for O(n) linear runtime. As you iterate through each element x, you compute complement = target - x. If complement already exists in the map, its index and current index form the answer.',
    optimalApproach: 'Single-pass Hash Map storing element -> index mapping.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    commonPitfall: 'Using the same element twice (e.g., when target is 6 and an element is 3). Inserting into the map after checking prevents this.',
    interviewTip: 'Always clarify if the input is sorted or if indices vs values must be returned.',
    pattern: 'Hashing',
    hints: [
      { text: 'Instead of looking forward for every pair, store previously visited numbers.', penalty: 2 },
      { text: 'For each number x, the required partner is target - x.', penalty: 3 },
      { text: 'A hash table maps values to their original array indices in O(1) average time.', penalty: 5 }
    ],
    points: 10,
    timeLimitSeconds: 60
  },
  {
    id: 'algo-arr-02',
    title: 'Container With Most Water Complexity',
    mode: 'complexity-clash',
    topic: 'Arrays & Strings',
    difficulty: 'Intermediate',
    language: 'Language-Independent',
    problemStatement:
      'Given n non-negative integers representing heights of vertical lines, find two lines that together with the x-axis form a container holding the maximum water. What are the time and space complexities of the standard two-pointer optimal solution?',
    codeSnippet: `left = 0, right = n - 1, max_water = 0
while left < right:
    h = min(height[left], height[right])
    max_water = max(max_water, h * (right - left))
    if height[left] < height[right]:
        left += 1
    else:
        right -= 1`,
    constraints: ['n >= 2', '0 <= height[i] <= 10^4'],
    examples: [
      { input: 'height = [1,8,6,2,5,4,8,3,7]', output: '49', explanation: 'Lines at index 1 (height 8) and index 8 (height 7) hold area min(8,7) * (8 - 1) = 49.' }
    ],
    options: [
      { id: 'opt-a', label: 'Time: O(n), Space: O(1)', explanation: 'Each pointer moves at most n times inward without allocating memory.', isCorrect: true },
      { id: 'opt-b', label: 'Time: O(n log n), Space: O(1)', explanation: 'No sorting or divide-and-conquer is performed.', isCorrect: false },
      { id: 'opt-c', label: 'Time: O(n^2), Space: O(1)', explanation: 'That is the brute force checking all pairs (i, j).', isCorrect: false },
      { id: 'opt-d', label: 'Time: O(n), Space: O(n)', explanation: 'Only two pointer variables are used, requiring O(1) auxiliary memory.', isCorrect: false }
    ],
    correctOptionId: 'opt-a',
    detailedExplanation:
      'The two-pointer technique starts at the extreme boundaries (left = 0, right = n - 1). At each step, width decreases by 1. To potentially find a larger area despite smaller width, we must move the pointer with the shorter height. Since left and right converge, exactly n steps occur.',
    optimalApproach: 'Two-pointer greedy convergence from both ends.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    commonPitfall: 'Advancing the pointer with the taller height, which can never increase the area.',
    interviewTip: 'Explain why moving the taller line is strictly suboptimal: width shrinks and height cannot exceed the current shorter line.',
    pattern: 'Two Pointers',
    hints: [
      { text: 'Observe how many times left and right pointers increment or decrement.', penalty: 3 },
      { text: 'In each step of the while loop, right - left strictly decreases by 1.', penalty: 5 },
      { text: 'No auxiliary arrays or recursive stacks are allocated.', penalty: 8 }
    ],
    points: 20,
    timeLimitSeconds: 75
  },
  {
    id: 'algo-arr-03',
    title: 'Longest Substring Without Repeating Characters',
    mode: 'pattern-match',
    topic: 'Arrays & Strings',
    difficulty: 'Intermediate',
    language: 'Language-Independent',
    problemStatement:
      'Given a string s, find the length of the longest substring without repeating characters. Which algorithmic design pattern is most optimal for achieving O(n) runtime with a single pass?',
    constraints: ['0 <= s.length <= 5 * 10^4', 's consists of English letters, digits, symbols and spaces.'],
    examples: [
      { input: 's = "abcabcbb"', output: '3', explanation: 'The answer is "abc", with the length of 3.' },
      { input: 's = "bbbbb"', output: '1', explanation: 'The answer is "b", with length 1.' },
      { input: 's = "pwwkew"', output: '3', explanation: 'The answer is "wke", with length 3.' }
    ],
    options: [
      { id: 'opt-a', label: 'Sliding Window with Hash Table / Index Map', explanation: 'Maintains window [left, right] and shifts left forward whenever a duplicate character enters the right end.', isCorrect: true },
      { id: 'opt-b', label: 'Divide and Conquer', explanation: 'Splitting strings in halves leads to complex boundary merge overhead O(n log n).', isCorrect: false },
      { id: 'opt-c', label: 'Dynamic Programming with 2D Matrix', explanation: '2D DP table would take O(n^2) space and time, which exceeds limits for n = 50,000.', isCorrect: false },
      { id: 'opt-d', label: 'Monotonic Stack', explanation: 'Monotonic stacks solve next greater/smaller element queries, not contiguous unique substrings.', isCorrect: false }
    ],
    correctOptionId: 'opt-a',
    detailedExplanation:
      'A Sliding Window dynamically expands by moving right pointer. An index map tracks the last seen index of each character. If s[right] was seen inside the current window, left jumps to last_seen[s[right]] + 1, ensuring all characters in [left, right] remain unique in O(n) time.',
    optimalApproach: 'Variable-size Sliding Window with character last-seen index map.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(min(m, n)) where m is charset size',
    commonPitfall: 'Forgetting to check if the duplicate character index is >= left before jumping left forward.',
    interviewTip: 'Mention character set size (ASCII 128 or 256) when discussing space complexity bounds.',
    pattern: 'Sliding Window',
    hints: [
      { text: 'Think about contiguous subarrays/substrings with a dynamic start and end boundary.', penalty: 3 },
      { text: 'When a character repeats, can we shrink the beginning of our current range?', penalty: 5 },
      { text: 'Expanding right and contracting left is the signature of a Sliding Window.', penalty: 8 }
    ],
    points: 20,
    timeLimitSeconds: 70
  },
  {
    id: 'algo-arr-04',
    title: 'Valid Palindrome After Removing At Most One Character',
    mode: 'quick-solve',
    topic: 'Arrays & Strings',
    difficulty: 'Beginner',
    language: 'JavaScript',
    problemStatement:
      'Given a string s, return true if the s can be palindrome after deleting at most one character from it. How should the two-pointer comparison handle the first mismatch?',
    constraints: ['1 <= s.length <= 10^5', 's consists of lowercase English letters.'],
    examples: [
      { input: 's = "aba"', output: 'true' },
      { input: 's = "abca"', output: 'true', explanation: 'Delete character "c" to get "aba".' },
      { input: 's = "abc"', output: 'false' }
    ],
    options: [
      {
        id: 'opt-a',
        label: 'When s[left] !== s[right], check if s[left+1...right] OR s[left...right-1] is a palindrome',
        codeSnippet: `function isPal(l, r) {\n  while (l < r) {\n    if (s[l++] !== s[r--]) return false;\n  }\n  return true;\n}\nwhile (left < right) {\n  if (s[left] !== s[right]) {\n    return isPal(left + 1, right) || isPal(left, right - 1);\n  }\n  left++; right--;\n}\nreturn true;`,
        explanation: 'At the first mismatch, you have two choices: delete left character or delete right character. If either remainder is a palindrome, return true.',
        isCorrect: true
      },
      {
        id: 'opt-b',
        label: 'Delete both mismatched characters and continue',
        explanation: 'The problem statement allows deleting at most ONE character, not two.',
        isCorrect: false
      },
      {
        id: 'opt-c',
        label: 'Always skip the left character only',
        explanation: 'If deleting the right character would have yielded a palindrome (e.g. "abca"), skipping only left fails.',
        isCorrect: false
      },
      {
        id: 'opt-d',
        label: 'Generate all substrings by deleting each character in turn',
        explanation: 'Generating all n substrings takes O(n^2) time, which times out for n = 100,000.',
        isCorrect: false
      }
    ],
    correctOptionId: 'opt-a',
    detailedExplanation:
      'Two pointers advance from outer ends while s[left] === s[right]. When the first mismatch occurs at (left, right), one character must be dropped. We test the two sub-slices: s[left+1..right] (skipping left) and s[left..right-1] (skipping right). Since at most one branch occurs, total time is O(n).',
    optimalApproach: 'Two-pointer greedy with single-branch palindrome check on mismatch.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    commonPitfall: 'Assuming greedily that skipping left is always preferred over skipping right.',
    interviewTip: 'Point out that branching only occurs once, so runtime is 2 * n operations = O(n).',
    pattern: 'Two Pointers',
    hints: [
      { text: 'Start with standard two pointers from left and right inward.', penalty: 2 },
      { text: 'As soon as characters differ, you can delete at most one of the two mismatched characters.', penalty: 3 },
      { text: 'Check if s[left+1..right] is palindrome OR s[left..right-1] is palindrome.', penalty: 5 }
    ],
    points: 10,
    timeLimitSeconds: 60
  },
  {
    id: 'algo-arr-05',
    title: 'Trapping Rain Water Best Pattern',
    mode: 'pattern-match',
    topic: 'Arrays & Strings',
    difficulty: 'Advanced',
    language: 'Language-Independent',
    problemStatement:
      'Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining. Which pattern allows solving this in O(n) time and O(1) auxiliary space without precomputing prefix and suffix max arrays?',
    constraints: ['n == height.length', '1 <= n <= 2 * 10^4', '0 <= height[i] <= 10^5'],
    examples: [
      { input: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]', output: '6', explanation: '6 units of rain water are trapped between bars.' }
    ],
    options: [
      { id: 'opt-a', label: 'Two Pointers with Left-Max and Right-Max trackers', explanation: 'Maintain left, right, left_max, right_max. Move the pointer with the smaller max inward, trapping max - current.', isCorrect: true },
      { id: 'opt-b', label: 'Disjoint Set Union (Union-Find)', explanation: 'Union-find handles connectivity, not height-bounded water volume.', isCorrect: false },
      { id: 'opt-c', label: '2D Breadth-First Search (BFS)', explanation: 'BFS on a 1D elevation profile adds unnecessary queue overhead O(n) space.', isCorrect: false },
      { id: 'opt-d', label: 'Segment Tree with Range Minimum Queries', explanation: 'Segment trees require O(n) space and O(n log n) construction.', isCorrect: false }
    ],
    correctOptionId: 'opt-a',
    detailedExplanation:
      'Water trapped above index i is determined by min(max_left, max_right) - height[i]. By keeping two pointers left and right and tracking left_max and right_max, we know that if left_max < right_max, the bottleneck for left is guaranteed to be left_max regardless of what lies between. This yields O(n) time and O(1) space.',
    optimalApproach: 'Two Pointers maintaining running left_max and right_max.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    commonPitfall: 'Allocating prefix_max and suffix_max arrays which use O(n) auxiliary space.',
    interviewTip: 'Contrast the 3 standard solutions: Brute Force O(n^2), Prefix/Suffix arrays O(n) time & O(n) space, and Two Pointers O(n) time & O(1) space.',
    pattern: 'Two Pointers',
    hints: [
      { text: 'Water trapped at any column depends on the lower of its maximum left and right boundaries.', penalty: 5 },
      { text: 'If left_max < right_max, the limiting factor for height[left] is definitely left_max.', penalty: 8 },
      { text: 'Two pointers converging from ends can track both bounds in O(1) space.', penalty: 10 }
    ],
    points: 30,
    timeLimitSeconds: 90
  },
  {
    id: 'algo-arr-06',
    title: 'Kadane Algorithm Maximum Subarray Complexity',
    mode: 'complexity-clash',
    topic: 'Arrays & Strings',
    difficulty: 'Beginner',
    language: 'C++',
    problemStatement:
      'Kadane’s algorithm finds the contiguous subarray with the largest sum in an integer array. What are its optimal time and auxiliary space complexities?',
    codeSnippet: `int maxSubArray(vector<int>& nums) {
    int current_sum = nums[0];
    int max_sum = nums[0];
    for (size_t i = 1; i < nums.size(); ++i) {
        current_sum = max(nums[i], current_sum + nums[i]);
        max_sum = max(max_sum, current_sum);
    }
    return max_sum;
}`,
    constraints: ['1 <= nums.size() <= 10^5', '-10^4 <= nums[i] <= 10^4'],
    examples: [
      { input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]', output: '6', explanation: 'The subarray [4,-1,2,1] has the largest sum = 6.' }
    ],
    options: [
      { id: 'opt-a', label: 'Time: O(n), Space: O(1)', explanation: 'A single pass with two scalar variables maintains current and global maximum.', isCorrect: true },
      { id: 'opt-b', label: 'Time: O(n log n), Space: O(log n)', explanation: 'That is the divide-and-conquer approach.', isCorrect: false },
      { id: 'opt-c', label: 'Time: O(n), Space: O(n)', explanation: 'A full DP table would be O(n) space, but Kadane compresses it to O(1).', isCorrect: false },
      { id: 'opt-d', label: 'Time: O(n^2), Space: O(1)', explanation: 'Checking all subarray sums takes O(n^2).', isCorrect: false }
    ],
    correctOptionId: 'opt-a',
    detailedExplanation:
      'At each index i, we decide whether to add nums[i] to the existing running subarray (current_sum + nums[i]) or start a fresh subarray at nums[i]. This dynamic programming state depends only on the immediate prior value, allowing space optimization to O(1).',
    optimalApproach: 'Kadane’s dynamic programming with running state compression.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    commonPitfall: 'Initializing max_sum to 0 instead of nums[0] when all elements are negative.',
    interviewTip: 'Highlight how Kadane is space-optimized 1D Dynamic Programming.',
    pattern: 'Dynamic Programming',
    hints: [
      { text: 'Look at how many times the loop iterates through nums.', penalty: 2 },
      { text: 'Notice only two integer variables are updated in each iteration.', penalty: 3 },
      { text: 'No vector or recursion stack is created.', penalty: 5 }
    ],
    points: 10,
    timeLimitSeconds: 60
  },
  {
    id: 'algo-arr-07',
    title: 'Rotate Array in Place',
    mode: 'rush-ladder',
    topic: 'Arrays & Strings',
    difficulty: 'Intermediate',
    language: 'Java',
    problemStatement:
      'Given an integer array nums, rotate the array to the right by k steps, where k is non-negative. What is the standard 3-reversal algorithm?',
    inputFormat: 'nums: int[], k: int',
    outputFormat: 'void (in-place modification)',
    constraints: ['1 <= nums.length <= 10^5', '0 <= k <= 10^5'],
    examples: [
      { input: 'nums = [1,2,3,4,5,6,7], k = 3', output: '[5,6,7,1,2,3,4]', explanation: 'Rotate 3 steps right.' }
    ],
    options: [
      {
        id: 'opt-a',
        label: 'Reverse entire array, reverse first k, reverse remaining n-k',
        codeSnippet: `k = k % nums.length;\nreverse(nums, 0, n - 1);\nreverse(nums, 0, k - 1);\nreverse(nums, k, n - 1);`,
        explanation: 'Three reversals neatly place the rotated segments in their final slots in O(n) time and O(1) space.',
        isCorrect: true
      },
      {
        id: 'opt-b',
        label: 'Rotate 1 step to the right k times',
        codeSnippet: `for (int i = 0; i < k; i++) rotateByOne(nums);`,
        explanation: 'Takes O(k * n) time, which degrades to O(n^2) when k ~ n/2.',
        isCorrect: false
      },
      {
        id: 'opt-c',
        label: 'Allocate a new array of size n and copy elements',
        codeSnippet: `int[] copy = new int[n];\nfor (int i = 0; i < n; i++) copy[(i + k) % n] = nums[i];`,
        explanation: 'Works in O(n) time but consumes O(n) auxiliary space instead of in-place O(1).',
        isCorrect: false
      },
      {
        id: 'opt-d',
        label: 'Sort the array descending then ascending',
        explanation: 'Sorting scrambles the relative order of elements.',
        isCorrect: false
      }
    ],
    correctOptionId: 'opt-a',
    detailedExplanation:
      'The 3-reverse method is the canonical in-place array rotation algorithm. After reducing k = k % n: 1) Reverse the entire array [0, n-1]. 2) Reverse the first k elements [0, k-1]. 3) Reverse the remaining n-k elements [k, n-1]. Each element is swapped twice, achieving O(n) time and O(1) space.',
    optimalApproach: 'Triple array reversal with k modulo normalization.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    commonPitfall: 'Forgetting k = k % nums.length when k >= nums.length.',
    interviewTip: 'Walk through a small 4-element example to prove the reverse mechanism visually to the interviewer.',
    pattern: 'Two Pointers',
    hints: [
      { text: 'First remember to take k = k % n.', penalty: 3 },
      { text: 'Reversing shifts the last k elements to the front, but in inverted order.', penalty: 5 },
      { text: 'Reversing the two sub-segments restores their proper internal order.', penalty: 8 }
    ],
    points: 20,
    timeLimitSeconds: 75
  },

  // ==========================================
  // SEARCHING & SORTING (8-14)
  // ==========================================
  {
    id: 'algo-search-08',
    title: 'Binary Search Edge-Condition Trap',
    mode: 'quick-solve',
    topic: 'Searching & Sorting',
    difficulty: 'Beginner',
    language: 'Java',
    problemStatement:
      'Given a sorted array of distinct integers and a target value, return the index if target is found. How should the midpoint be calculated to prevent integer 32-bit arithmetic overflow in languages like Java and C++?',
    constraints: ['1 <= nums.length <= 10^5', '-10^4 <= nums[i], target <= 10^4', 'nums is strictly sorted in ascending order.'],
    examples: [
      { input: 'nums = [-1,0,3,5,9,12], target = 9', output: '4' },
      { input: 'nums = [-1,0,3,5,9,12], target = 2', output: '-1' }
    ],
    options: [
      {
        id: 'opt-a',
        label: 'int mid = low + (high - low) / 2;',
        explanation: 'Guarantees (high - low) is positive and adding to low never exceeds maximum integer value.',
        isCorrect: true
      },
      {
        id: 'opt-b',
        label: 'int mid = (low + high) / 2;',
        explanation: 'When low + high exceeds Integer.MAX_VALUE (2^31 - 1), it overflows to a negative number, causing ArrayIndexOutOfBoundsException.',
        isCorrect: false
      },
      {
        id: 'opt-c',
        label: 'int mid = (low + high) * 2;',
        explanation: 'Multiplying by 2 computes twice the sum, completely breaking midpoint indexing.',
        isCorrect: false
      },
      {
        id: 'opt-d',
        label: 'int mid = low + high / 2;',
        explanation: 'Due to operator precedence, division occurs before addition, evaluating low + (high / 2).',
        isCorrect: false
      }
    ],
    correctOptionId: 'opt-a',
    detailedExplanation:
      'In languages with fixed-width 32-bit signed integers, low + high can exceed 2,147,483,647 when low and high are large (e.g. 1.5 billion each), wrapping around to negative. Using low + (high - low) / 2 mathematically equals the midpoint while guaranteeing no overflow.',
    optimalApproach: 'Safe midpoint calculation: low + (high - low) / 2.',
    timeComplexity: 'O(log n)',
    spaceComplexity: 'O(1)',
    commonPitfall: 'Using (low + high) / 2 which famously existed in standard Java libraries for years before being fixed.',
    interviewTip: 'Mentioning low + (high - low) / 2 immediately signals senior coding hygiene.',
    pattern: 'Binary Search',
    hints: [
      { text: 'Think about integer limits when low and high are close to 2^31 - 1.', penalty: 2 },
      { text: 'What happens to the sum low + high when both are 1.5 billion?', penalty: 3 },
      { text: 'low + (high - low) / 2 never exceeds high.', penalty: 5 }
    ],
    points: 10,
    timeLimitSeconds: 60
  },
  {
    id: 'algo-search-09',
    title: 'Search in Rotated Sorted Array Pattern',
    mode: 'pattern-match',
    topic: 'Searching & Sorting',
    difficulty: 'Intermediate',
    language: 'Language-Independent',
    problemStatement:
      'Given an integer array sorted in ascending order with distinct values, rotated at an unknown pivot index k, search for a target value in O(log n) time. Which pattern applies?',
    constraints: ['1 <= nums.length <= 5000', '-10^4 <= nums[i] <= 10^4', 'All values of nums are unique.'],
    examples: [
      { input: 'nums = [4,5,6,7,0,1,2], target = 0', output: '4' },
      { input: 'nums = [4,5,6,7,0,1,2], target = 3', output: '-1' }
    ],
    options: [
      { id: 'opt-a', label: 'Modified Binary Search with Sorted Half Detection', explanation: 'At any pivot, at least one half [low..mid] or [mid..high] is guaranteed to be strictly sorted. Test if target falls in that sorted range.', isCorrect: true },
      { id: 'opt-b', label: 'Linear Search with Early Exit', explanation: 'Linear search takes O(n) worst-case time, failing the O(log n) requirement.', isCorrect: false },
      { id: 'opt-c', label: 'Monotonic Queue', explanation: 'Used for sliding window maximums, not searching in rotated sorted arrays.', isCorrect: false },
      { id: 'opt-d', label: 'Quickselect', explanation: 'Quickselect finds k-th order statistics in unsorted arrays, not searching target values.', isCorrect: false }
    ],
    correctOptionId: 'opt-a',
    detailedExplanation:
      'In a rotated sorted array, the midpoint divides the array such that at least one half is always normally ordered. If nums[low] <= nums[mid], the left half is sorted. If target lies within [nums[low], nums[mid]], search left; otherwise search right. If the right half is sorted, apply symmetric logic.',
    optimalApproach: 'Binary search identifying the normally sorted partition in each step.',
    timeComplexity: 'O(log n)',
    spaceComplexity: 'O(1)',
    commonPitfall: 'Not including the equality check nums[low] <= nums[mid] when low == mid.',
    interviewTip: 'Draw a rotated array on the whiteboard and split at mid to show that one half is always monotonic.',
    pattern: 'Binary Search',
    hints: [
      { text: 'Even after rotation, splitting an array at mid yields at least one perfectly sorted half.', penalty: 3 },
      { text: 'Compare nums[low] and nums[mid] to determine which half is normally sorted.', penalty: 5 },
      { text: 'Check if target lies within the boundaries of the sorted half.', penalty: 8 }
    ],
    points: 20,
    timeLimitSeconds: 70
  },
  {
    id: 'algo-search-10',
    title: 'Merge Sort vs Quick Sort Space Complexity Clash',
    mode: 'complexity-clash',
    topic: 'Searching & Sorting',
    difficulty: 'Intermediate',
    language: 'Language-Independent',
    problemStatement:
      'Compare standard Merge Sort (on arrays) and standard in-place Quick Sort (Lomuto or Hoare partition). What are their auxiliary space complexities?',
    options: [
      { id: 'opt-a', label: 'Merge Sort: O(n) auxiliary space | Quick Sort: O(log n) call stack space average', explanation: 'Merge sort requires a temporary buffer of size n to merge halves. In-place Quick Sort only requires stack frames for recursion.', isCorrect: true },
      { id: 'opt-b', label: 'Merge Sort: O(1) auxiliary space | Quick Sort: O(n) auxiliary space', explanation: 'Array merge sort cannot merge two sorted subarrays in-place in O(n) time.', isCorrect: false },
      { id: 'opt-c', label: 'Merge Sort: O(log n) auxiliary space | Quick Sort: O(1) auxiliary space', explanation: 'Quick Sort recursion stack is not O(1) unless implemented iteratively with manual recursion elimination.', isCorrect: false },
      { id: 'opt-d', label: 'Both require O(n) auxiliary buffer space', explanation: 'In-place Quick Sort does not allocate an auxiliary array of size n.', isCorrect: false }
    ],
    correctOptionId: 'opt-a',
    detailedExplanation:
      'Standard Merge Sort on arrays requires O(n) additional space for the merge step to hold combined elements. Quick Sort partitions elements in-place within the array and only uses recursion stack frames: O(log n) average case, O(n) worst case if partition is highly unbalanced.',
    optimalApproach: 'Merge Sort O(n) auxiliary buffer; Quick Sort O(log n) call stack.',
    timeComplexity: 'Merge Sort: O(n log n) all cases | Quick Sort: O(n log n) avg, O(n^2) worst',
    spaceComplexity: 'Merge Sort: O(n) | Quick Sort: O(log n) avg stack',
    commonPitfall: 'Claiming Quick Sort uses O(1) auxiliary space by ignoring the recursion call stack.',
    interviewTip: 'Mention that Merge Sort is stable, whereas standard Quick Sort is not stable.',
    pattern: 'Divide & Conquer',
    hints: [
      { text: 'What does the merge() helper allocate to combine two halves?', penalty: 3 },
      { text: 'Does Quick Sort allocate a second array, or does it swap elements in-place?', penalty: 5 },
      { text: 'Remember that recursive function call frames consume space on the call stack.', penalty: 8 }
    ],
    points: 20,
    timeLimitSeconds: 70
  },
  {
    id: 'algo-search-11',
    title: 'Find Peak Element in O(log n)',
    mode: 'rush-ladder',
    topic: 'Searching & Sorting',
    difficulty: 'Intermediate',
    language: 'Python',
    problemStatement:
      'A peak element is an element that is strictly greater than its neighbors. Given an integer array nums where nums[i] != nums[i+1], find a peak element and return its index in O(log n) time.',
    inputFormat: 'nums: int[]',
    outputFormat: 'peakIndex: int',
    constraints: ['1 <= nums.length <= 1000', '-2^31 <= nums[i] <= 2^31 - 1', 'nums[i] != nums[i + 1] for all valid i.'],
    examples: [
      { input: 'nums = [1,2,3,1]', output: '2', explanation: '3 is a peak element and your function should return the index number 2.' },
      { input: 'nums = [1,2,1,3,5,6,4]', output: '5', explanation: 'Index 5 (value 6) or index 1 (value 2) are valid peaks.' }
    ],
    options: [
      {
        id: 'opt-a',
        label: 'Binary search comparing nums[mid] with nums[mid + 1]',
        codeSnippet: `left, right = 0, len(nums) - 1\nwhile left < right:\n    mid = left + (right - left) // 2\n    if nums[mid] < nums[mid + 1]:\n        left = mid + 1\n    else:\n        right = mid\nreturn left`,
        explanation: 'If nums[mid] < nums[mid+1], an upward slope exists toward the right, guaranteeing at least one peak to the right.',
        isCorrect: true
      },
      {
        id: 'opt-b',
        label: 'Linear scan checking if nums[i] > nums[i-1] and nums[i] > nums[i+1]',
        codeSnippet: `for i in range(1, len(nums) - 1):\n    if nums[i] > nums[i-1] and nums[i] > nums[i+1]:\n        return i`,
        explanation: 'Takes O(n) time, which violates the required O(log n) runtime constraint.',
        isCorrect: false
      },
      {
        id: 'opt-c',
        label: 'Sort the array and take the last element',
        explanation: 'Sorting destroys original indices and takes O(n log n) time.',
        isCorrect: false
      },
      {
        id: 'opt-d',
        label: 'Two pointers from both ends moving inward by 1',
        explanation: 'Two pointers moving by 1 still scans elements in O(n) time.',
        isCorrect: false
      }
    ],
    correctOptionId: 'opt-a',
    detailedExplanation:
      'Even though the array is not fully sorted, local slopes guide binary search. If nums[mid] < nums[mid + 1], you are on an ascending slope; following that slope upwards guarantees finding a peak on the right. If nums[mid] > nums[mid + 1], a peak exists on the left (or mid itself).',
    optimalApproach: 'Slope-guided Binary Search.',
    timeComplexity: 'O(log n)',
    spaceComplexity: 'O(1)',
    commonPitfall: 'Writing while left <= right and accessing mid + 1 out of bounds.',
    interviewTip: 'Explain why binary search works on unsorted data here: we only need any peak, not a globally sorted order.',
    pattern: 'Binary Search',
    hints: [
      { text: 'Think of the array as a mountain landscape with slopes.', penalty: 3 },
      { text: 'If nums[mid] is smaller than nums[mid+1], walking towards mid+1 climbs uphill.', penalty: 5 },
      { text: 'An uphill walk must eventually reach a peak because values at ends drop off to -infinity.', penalty: 8 }
    ],
    points: 20,
    timeLimitSeconds: 70
  },
  {
    id: 'algo-search-12',
    title: 'Kth Largest Element in an Array Optimal Pattern',
    mode: 'pattern-match',
    topic: 'Searching & Sorting',
    difficulty: 'Intermediate',
    language: 'Language-Independent',
    problemStatement:
      'Given an integer array nums and an integer k, return the kth largest element in the array. Which algorithm provides O(n) average time complexity without sorting the entire array?',
    constraints: ['1 <= k <= nums.length <= 10^5', '-10^4 <= nums[i] <= 10^4'],
    examples: [
      { input: 'nums = [3,2,1,5,6,4], k = 2', output: '5' },
      { input: 'nums = [3,2,3,1,2,4,5,5,6], k = 4', output: '4' }
    ],
    options: [
      { id: 'opt-a', label: 'Quickselect (Hoare’s Selection Algorithm)', explanation: 'Partitions like QuickSort but only recurses into the partition containing index n - k, yielding n + n/2 + n/4... = O(n) average time.', isCorrect: true },
      { id: 'opt-b', label: 'Full Merge Sort', explanation: 'Takes O(n log n) time and O(n) space.', isCorrect: false },
      { id: 'opt-c', label: 'Breadth-First Search (BFS)', explanation: 'BFS is for graph and tree level order traversals, not order statistics.', isCorrect: false },
      { id: 'opt-d', label: 'Two Pointers on unsorted array', explanation: 'Two pointers cannot determine order statistics on unsorted data without partitioning.', isCorrect: false }
    ],
    correctOptionId: 'opt-a',
    detailedExplanation:
      'Quickselect uses partition logic: place a pivot at its sorted position p. If p == target_index, return nums[p]. If p < target_index, recurse into the right partition only; else left partition. The geometric sum n + n/2 + n/4 + ... converges to O(n) average time.',
    optimalApproach: 'Quickselect with randomized pivot selection (or Min-Heap of size k for O(n log k)).',
    timeComplexity: 'O(n) average, O(n^2) worst case',
    spaceComplexity: 'O(1) auxiliary space',
    commonPitfall: 'Confusing 1-indexed kth largest with index k.',
    interviewTip: 'Compare Quickselect (O(n) avg) vs Min-Heap of size k (O(n log k) guaranteed). Mention Min-Heap is ideal for streaming data.',
    pattern: 'Divide & Conquer',
    hints: [
      { text: 'Recall the partition step of Quick Sort.', penalty: 3 },
      { text: 'Do we need to sort both sides after finding the pivot position?', penalty: 5 },
      { text: 'Only recursing into the half containing our target index drops average time to O(n).', penalty: 8 }
    ],
    points: 20,
    timeLimitSeconds: 70
  },
  {
    id: 'algo-search-13',
    title: 'Counting Inversions in an Array Complexity',
    mode: 'complexity-clash',
    topic: 'Searching & Sorting',
    difficulty: 'Advanced',
    language: 'Language-Independent',
    problemStatement:
      'Two elements a[i] and a[j] form an inversion if a[i] > a[j] and i < j. What is the optimal time complexity to count all inversions in an array of size n?',
    constraints: ['1 <= n <= 10^5', '1 <= a[i] <= 10^9'],
    examples: [
      { input: 'a = [2, 4, 1, 3, 5]', output: '3', explanation: 'Inversions are (2,1), (4,1), and (4,3).' }
    ],
    options: [
      { id: 'opt-a', label: 'O(n log n) using Modified Merge Sort or Fenwick Tree', explanation: 'During Merge Sort merge step, whenever a[right] < a[left], all remaining elements in left half form inversions.', isCorrect: true },
      { id: 'opt-b', label: 'O(n^2) using nested loops', explanation: 'Brute force checks all pairs, which is suboptimal for n = 100,000.', isCorrect: false },
      { id: 'opt-c', label: 'O(n) using Hash Map', explanation: 'A simple hash map cannot track relative order and magnitude comparison simultaneously in O(n).', isCorrect: false },
      { id: 'opt-d', label: 'O(log n) using Binary Search', explanation: 'O(log n) is impossible since all n elements must be inspected.', isCorrect: false }
    ],
    correctOptionId: 'opt-a',
    detailedExplanation:
      'Modified Merge Sort counts inversions during the merge step: if left subarray has element L[i] > R[j], then because L is sorted, all elements from L[i] to L[mid] are also > R[j], contributing (mid - i + 1) inversions in O(1) calculation. Total time matches Merge Sort: O(n log n).',
    optimalApproach: 'Modified Merge Sort or Binary Indexed Tree (Fenwick Tree).',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(n)',
    commonPitfall: 'Counting inversions one by one inside the merge step instead of adding (mid - i + 1).',
    interviewTip: 'Mention both Modified Merge Sort and Fenwick Tree / Segment Tree approaches.',
    pattern: 'Divide & Conquer',
    hints: [
      { text: 'Think about how sorting elements reveals out-of-order pairs.', penalty: 5 },
      { text: 'During Merge Sort, if an element from the right half is placed first, what does it say about remaining left elements?', penalty: 8 },
      { text: 'Every remaining element in the left half is greater than the right element, adding multiple inversions at once.', penalty: 10 }
    ],
    points: 30,
    timeLimitSeconds: 85
  },
  {
    id: 'algo-search-14',
    title: 'First and Last Position of Element in Sorted Array',
    mode: 'quick-solve',
    topic: 'Searching & Sorting',
    difficulty: 'Intermediate',
    language: 'Python',
    problemStatement:
      'Given an array of integers nums sorted in non-decreasing order, find the starting and ending position of a given target value. If target is not found, return [-1, -1]. What is the cleanest O(log n) technique?',
    constraints: ['0 <= nums.length <= 10^5', '-10^9 <= nums[i] <= 10^9', 'nums is sorted in ascending order.'],
    examples: [
      { input: 'nums = [5,7,7,8,8,10], target = 8', output: '[3,4]' },
      { input: 'nums = [5,7,7,8,8,10], target = 6', output: '[-1,-1]' }
    ],
    options: [
      {
        id: 'opt-a',
        label: 'Two separate binary searches: one biased left, one biased right',
        codeSnippet: `def findBound(isFirst):\n    l, r, ans = 0, len(nums) - 1, -1\n    while l <= r:\n        mid = (l + r) // 2\n        if nums[mid] == target:\n            ans = mid\n            if isFirst: r = mid - 1\n            else: l = mid + 1\n        elif nums[mid] < target: l = mid + 1\n        else: r = mid - 1\n    return ans\nreturn [findBound(True), findBound(False)]`,
        explanation: 'When nums[mid] == target, save mid and continue searching left (r = mid - 1) for first position, or right (l = mid + 1) for last position.',
        isCorrect: true
      },
      {
        id: 'opt-b',
        label: 'Find one target with binary search, then expand linearly left and right',
        explanation: 'If all elements equal target (e.g., 100,000 identical numbers), linear expansion degrades to O(n).',
        isCorrect: false
      },
      {
        id: 'opt-c',
        label: 'Use linear scan from both ends',
        explanation: 'Takes O(n) time, violating the O(log n) requirement.',
        isCorrect: false
      },
      {
        id: 'opt-d',
        label: 'Store elements in a Hash Map',
        explanation: 'Hash map construction takes O(n) time and O(n) space.',
        isCorrect: false
      }
    ],
    correctOptionId: 'opt-a',
    detailedExplanation:
      'Running binary search twice: 1) First search finds the leftmost boundary by continuing search in left half even when nums[mid] == target. 2) Second search finds rightmost boundary by continuing search in right half. Both runs take O(log n), preserving strict O(log n) total runtime.',
    optimalApproach: 'Dual binary searches (lower_bound and upper_bound).',
    timeComplexity: 'O(log n)',
    spaceComplexity: 'O(1)',
    commonPitfall: 'Finding one target with binary search and then using a while loop to expand outward, degrading to O(n).',
    interviewTip: 'Reference C++ std::lower_bound and std::upper_bound or Python bisect_left and bisect_right.',
    pattern: 'Binary Search',
    hints: [
      { text: 'When you find target at mid, do not stop immediately.', penalty: 3 },
      { text: 'To find the first position, record mid and continue searching left.', penalty: 5 },
      { text: 'Run a second binary search continuing right to find the last position.', penalty: 8 }
    ],
    points: 20,
    timeLimitSeconds: 70
  },

  // ==========================================
  // HASHING (15-18)
  // ==========================================
  {
    id: 'algo-hash-15',
    title: 'Group Anagrams Canonical Pattern',
    mode: 'pattern-match',
    topic: 'Hashing',
    difficulty: 'Intermediate',
    language: 'Language-Independent',
    problemStatement:
      'Given an array of strings strs, group the anagrams together. You can return the answer in any order. Which pattern provides the most efficient grouping key?',
    constraints: ['1 <= strs.length <= 10^4', '0 <= strs[i].length <= 100', 'strs[i] consists of lowercase English letters.'],
    examples: [
      { input: 'strs = ["eat","tea","tan","ate","nat","bat"]', output: '[["bat"],["nat","tan"],["ate","eat","tea"]]' }
    ],
    options: [
      { id: 'opt-a', label: 'Hash Map with Character Frequency Tuple or Sorted String as key', explanation: 'All anagrams produce the exact same character count vector (26-element tuple) or sorted string, grouping them in O(N * K) time.', isCorrect: true },
      { id: 'opt-b', label: 'Trie with Depth First Search', explanation: 'Trie stores prefixes; anagrams share character counts, not common prefixes.', isCorrect: false },
      { id: 'opt-c', label: 'Breadth First Search (BFS)', explanation: 'Graph search is inapplicable to string character frequency categorization.', isCorrect: false },
      { id: 'opt-d', label: 'Two Pointers with pairwise comparison', explanation: 'Pairwise string comparisons take O(N^2 * K) time.', isCorrect: false }
    ],
    correctOptionId: 'opt-a',
    detailedExplanation:
      'Two strings are anagrams if and only if their character counts are identical. For each string of length K, compute a 26-tuple count array of frequencies #a#b#c... or sort the string in O(K log K). Use this canonical representation as the hash table key mapping to a list of matching words.',
    optimalApproach: 'Hash Map with 26-element character count frequency tuple as key.',
    timeComplexity: 'O(N * K) where N is number of strings and K is max string length',
    spaceComplexity: 'O(N * K)',
    commonPitfall: 'Using sum of ASCII values as key, which causes hash collisions (e.g. "ac" and "bb" have equal ASCII sums).',
    interviewTip: 'Mention that character count hashing O(N * K) is faster than sorting each string O(N * K log K) for long strings.',
    pattern: 'Hashing',
    hints: [
      { text: 'What property is identical for all anagrams of a word?', penalty: 3 },
      { text: 'A frequency array of length 26 uniquely identifies any anagram class.', penalty: 5 },
      { text: 'Use this frequency tuple as a dictionary key.', penalty: 8 }
    ],
    points: 20,
    timeLimitSeconds: 70
  },
  {
    id: 'algo-hash-16',
    title: 'Subarray Sum Equals K Optimal Prefix Sum Pattern',
    mode: 'quick-solve',
    topic: 'Hashing',
    difficulty: 'Intermediate',
    language: 'Python',
    problemStatement:
      'Given an array of integers nums and an integer k, return the total number of subarrays whose sum equals to k. How does the Hash Map prefix sum technique count them in O(n) time?',
    constraints: ['1 <= nums.length <= 2 * 10^4', '-1000 <= nums[i] <= 1000', '-10^7 <= k <= 10^7'],
    examples: [
      { input: 'nums = [1,1,1], k = 2', output: '2' },
      { input: 'nums = [1,2,3], k = 3', output: '2' }
    ],
    options: [
      {
        id: 'opt-a',
        label: 'Hash Map storing prefix_sum frequencies, initialize prefix_counts = {0: 1}',
        codeSnippet: `counts = {0: 1}\ncurr_sum = 0\ntotal = 0\nfor x in nums:\n    curr_sum += x\n    total += counts.get(curr_sum - k, 0)\n    counts[curr_sum] = counts.get(curr_sum, 0) + 1\nreturn total`,
        explanation: 'If curr_sum - (curr_sum - k) == k, any prior occurrence of (curr_sum - k) marks a valid subarray ending at current index.',
        isCorrect: true
      },
      {
        id: 'opt-b',
        label: 'Sliding Window shrinking left when curr_sum > k',
        explanation: 'nums contains negative integers! A sliding window fails because adding an element can decrease the sum.',
        isCorrect: false
      },
      {
        id: 'opt-c',
        label: 'Compute prefix array and check all pairs (i, j)',
        explanation: 'Checking all pairs takes O(n^2) time.',
        isCorrect: false
      },
      {
        id: 'opt-d',
        label: 'Sort the array and apply Two Pointers',
        explanation: 'Sorting destroys subarray contiguity.',
        isCorrect: false
      }
    ],
    correctOptionId: 'opt-a',
    detailedExplanation:
      'The sum of subarray nums[i..j] is prefix[j] - prefix[i-1]. We need prefix[j] - prefix[i-1] == k, which rearranges to prefix[i-1] = prefix[j] - k. As we traverse, we query the hash map for how many times (curr_sum - k) has appeared. We initialize map[0] = 1 to handle subarrays starting at index 0.',
    optimalApproach: 'Running prefix sum with frequency hash map.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    commonPitfall: 'Attempting sliding window when numbers can be negative; sliding window only works for strictly non-negative arrays.',
    interviewTip: 'Emphasize why {0: 1} must be in the map before starting the loop.',
    pattern: 'Hashing',
    hints: [
      { text: 'Express subarray sum from i to j in terms of cumulative prefix sums.', penalty: 3 },
      { text: 'prefix[j] - prefix[i] = k translates to prefix[i] = prefix[j] - k.', penalty: 5 },
      { text: 'A hash table can count frequencies of seen prefix sums in O(1) time.', penalty: 8 }
    ],
    points: 20,
    timeLimitSeconds: 75
  },
  {
    id: 'algo-hash-17',
    title: 'Longest Consecutive Sequence in O(n) Time',
    mode: 'complexity-clash',
    topic: 'Hashing',
    difficulty: 'Intermediate',
    language: 'Language-Independent',
    problemStatement:
      'Given an unsorted array of integers nums, find the length of the longest consecutive elements sequence in O(n) time. Why does checking (num - 1) not in hash_set ensure O(n) total operations?',
    codeSnippet: `num_set = set(nums)
longest = 0
for num in num_set:
    if (num - 1) not in num_set:
        curr = num
        streak = 1
        while (curr + 1) in num_set:
            curr += 1
            streak += 1
        longest = max(longest, streak)`,
    constraints: ['0 <= nums.length <= 10^5', '-10^9 <= nums[i] <= 10^9'],
    examples: [
      { input: 'nums = [100,4,200,1,3,2]', output: '4', explanation: 'The longest consecutive sequence is [1, 2, 3, 4]. Its length is 4.' }
    ],
    options: [
      { id: 'opt-a', label: 'Each number is entered at most twice: once in for-loop, and at most once in inner while-loop', explanation: 'Only sequence starting numbers (where num - 1 is absent) trigger the inner loop, guaranteeing each element is traversed at most twice across the entire algorithm.', isCorrect: true },
      { id: 'opt-b', label: 'The set sorts elements internally in O(1) time', explanation: 'Hash set does not sort elements.', isCorrect: false },
      { id: 'opt-c', label: 'The while loop runs in O(log n) time', explanation: 'The while loop increments by 1, it does not binary divide.', isCorrect: false },
      { id: 'opt-d', label: 'The algorithm is actually O(n^2) worst case', explanation: 'Because only sequence origins are expanded, total inner loop iterations cannot exceed n.', isCorrect: false }
    ],
    correctOptionId: 'opt-a',
    detailedExplanation:
      'The condition `if (num - 1) not in num_set` ensures that we only attempt to build a consecutive streak from the very first number of that streak. Numbers in the middle or end of a streak are skipped in O(1). Consequently, each number is visited once during the outer loop and once during streak construction, yielding exactly O(n) time.',
    optimalApproach: 'Hash Set sequence start detection.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    commonPitfall: 'Iterating over nums with duplicates instead of num_set, which wastes time on identical starts.',
    interviewTip: 'Be prepared to prove amortized O(n) complexity rigorously by showing each element is traversed at most twice.',
    pattern: 'Hashing',
    hints: [
      { text: 'What does the condition (num - 1) not in num_set mean for num?', penalty: 3 },
      { text: 'It means num is the start of a consecutive streak.', penalty: 5 },
      { text: 'Since we only expand from streak starts, every number in a streak is touched at most twice.', penalty: 8 }
    ],
    points: 20,
    timeLimitSeconds: 70
  },
  {
    id: 'algo-hash-18',
    title: 'First Unique Character in a String',
    mode: 'rush-ladder',
    topic: 'Hashing',
    difficulty: 'Beginner',
    language: 'Python',
    problemStatement:
      'Given a string s, find the first non-repeating character in it and return its index. If it does not exist, return -1.',
    constraints: ['1 <= s.length <= 10^5', 's consists of only lowercase English letters.'],
    examples: [
      { input: 's = "leetcode"', output: '0', explanation: '"l" is the first character that does not repeat.' },
      { input: 's = "loveleetcode"', output: '2', explanation: '"v" is the first non-repeating character.' },
      { input: 's = "aabb"', output: '-1' }
    ],
    options: [
      {
        id: 'opt-a',
        label: 'Two-pass frequency count: build frequency map, then iterate s to find first count == 1',
        codeSnippet: `count = {}\nfor ch in s:\n    count[ch] = count.get(ch, 0) + 1\nfor i, ch in enumerate(s):\n    if count[ch] == 1:\n        return i\nreturn -1`,
        explanation: 'First pass counts all character occurrences in O(n). Second pass inspects characters in original string order to find the first with frequency 1.',
        isCorrect: true
      },
      {
        id: 'opt-b',
        label: 'Check s.count(ch) == 1 for each character',
        codeSnippet: `for i, ch in enumerate(s):\n    if s.count(ch) == 1:\n        return i`,
        explanation: 's.count() scans the entire string in O(n), creating an O(n^2) algorithm that times out.',
        isCorrect: false
      },
      {
        id: 'opt-c',
        label: 'Sort characters and inspect neighbors',
        explanation: 'Sorting takes O(n log n) and loses original indices.',
        isCorrect: false
      },
      {
        id: 'opt-d',
        label: 'Remove duplicates into a set',
        explanation: 'Sets do not record original indices or frequencies.',
        isCorrect: false
      }
    ],
    correctOptionId: 'opt-a',
    detailedExplanation:
      'Using a fixed-size frequency array of 26 integers or a hash map: 1) First pass populates frequency counts in O(n). 2) Second pass iterates through s from index 0 to n-1 and returns the index of the first character whose count is 1. If none, return -1. Total time O(n), auxiliary space O(1) (at most 26 lowercase letters).',
    optimalApproach: 'Two-pass frequency counting with array or hash table.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1) auxiliary space (26 characters)',
    commonPitfall: 'Using Python string count() or JavaScript indexOf() inside a loop, creating accidental O(n^2) quadratic blowup.',
    interviewTip: 'Emphasize that auxiliary space is O(1) because the English alphabet has a constant size (26 letters).',
    pattern: 'Hashing',
    hints: [
      { text: 'You need to know how many times each character appears in total.', penalty: 2 },
      { text: 'Can you count all characters in a first pass?', penalty: 3 },
      { text: 'In a second pass through s, the first character with count 1 is your answer.', penalty: 5 }
    ],
    points: 10,
    timeLimitSeconds: 60
  },

  // ==========================================
  // LINKED LISTS (19-23)
  // ==========================================
  {
    id: 'algo-ll-19',
    title: 'Reverse Linked List In-Place Technique',
    mode: 'quick-solve',
    topic: 'Linked Lists',
    difficulty: 'Beginner',
    language: 'Java',
    problemStatement:
      'Given the head of a singly linked list, reverse the list, and return the reversed list. What is the standard 3-pointer iterative manipulation?',
    constraints: ['The number of nodes in the list is the range [0, 5000].', '-5000 <= Node.val <= 5000'],
    examples: [
      { input: 'head = [1,2,3,4,5]', output: '[5,4,3,2,1]' },
      { input: 'head = [1,2]', output: '[2,1]' },
      { input: 'head = []', output: '[]' }
    ],
    options: [
      {
        id: 'opt-a',
        label: 'Three pointers: prev = null, curr = head, nextTemp',
        codeSnippet: `ListNode prev = null;\nListNode curr = head;\nwhile (curr != null) {\n    ListNode nextTemp = curr.next;\n    curr.next = prev;\n    prev = curr;\n    curr = nextTemp;\n}\nreturn prev;`,
        explanation: 'Saves curr.next, reverses current pointer to point to prev, shifts prev forward, and advances curr.',
        isCorrect: true
      },
      {
        id: 'opt-b',
        label: 'Swap head and tail values iteratively',
        explanation: 'Singly linked lists have no backward pointers, so reaching the tail and moving backwards takes O(n^2) time.',
        isCorrect: false
      },
      {
        id: 'opt-c',
        label: 'Push all node values to an array, reverse the array, create new nodes',
        explanation: 'Uses O(n) extra heap allocation instead of in-place O(1) pointer redirection.',
        isCorrect: false
      },
      {
        id: 'opt-d',
        label: 'Set curr.next = curr without saving next node',
        explanation: 'Creates an immediate self-referential cycle and loses the rest of the list.',
        isCorrect: false
      }
    ],
    correctOptionId: 'opt-a',
    detailedExplanation:
      'To reverse in-place in O(n) time and O(1) space, maintain prev (starts null) and curr (starts head). Inside the loop, temporarily hold nextTemp = curr.next. Then invert curr.next = prev. Advance prev = curr, and curr = nextTemp. When curr reaches null, prev is the new head.',
    optimalApproach: 'Iterative 3-pointer in-place reversal.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    commonPitfall: 'Forgetting to save curr.next before modifying curr.next, which detaches and loses the remainder of the linked list.',
    interviewTip: 'Be prepared to also explain the recursive implementation and its O(n) stack space overhead.',
    pattern: 'Linked Lists',
    hints: [
      { text: 'Before changing curr.next, you must save where curr was going.', penalty: 2 },
      { text: 'Point curr.next backwards to prev.', penalty: 3 },
      { text: 'Step prev and curr forward one node at a time.', penalty: 5 }
    ],
    points: 10,
    timeLimitSeconds: 60
  },
  {
    id: 'algo-ll-20',
    title: 'Detect Cycle in Linked List (Floyd’s Algorithm)',
    mode: 'pattern-match',
    topic: 'Linked Lists',
    difficulty: 'Beginner',
    language: 'Language-Independent',
    problemStatement:
      'Given head, the head of a linked list, determine if the linked list has a cycle in it. Can you solve it using O(1) memory? Which pattern applies?',
    constraints: ['The number of the nodes in the list is in the range [0, 10^4].', '-10^5 <= Node.val <= 10^5'],
    examples: [
      { input: 'head = [3,2,0,-4], pos = 1 (tail connects to node index 1)', output: 'true' }
    ],
    options: [
      { id: 'opt-a', label: 'Fast and Slow Pointers (Floyd’s Tortoise and Hare)', explanation: 'Slow moves 1 step, fast moves 2 steps. If a cycle exists, fast catches up to slow inside the cycle with O(1) space.', isCorrect: true },
      { id: 'opt-b', label: 'Breadth-First Search with Visited Set', explanation: 'A visited set requires O(n) auxiliary memory.', isCorrect: false },
      { id: 'opt-c', label: 'Binary Search on node memory addresses', explanation: 'Linked lists are non-contiguous and cannot be binary searched.', isCorrect: false },
      { id: 'opt-d', label: 'Divide and Conquer', explanation: 'Linked lists cannot be easily divided without traversing.', isCorrect: false }
    ],
    correctOptionId: 'opt-a',
    detailedExplanation:
      'Floyd’s Cycle-Finding Algorithm uses two pointers: slow advances 1 step (slow = slow.next) while fast advances 2 steps (fast = fast.next.next). If there is no cycle, fast reaches null. If a cycle exists, the relative distance between fast and slow decreases by 1 in each step until they collide.',
    optimalApproach: 'Floyd’s Cycle Detection (Tortoise and Hare).',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    commonPitfall: 'Not checking `fast != null && fast.next != null` before advancing fast.',
    interviewTip: 'If asked to find the *entry point* of the cycle, reset slow to head after collision and advance both 1 step until they meet.',
    pattern: 'Two Pointers',
    hints: [
      { text: 'Think about two runners on a circular track with different speeds.', penalty: 2 },
      { text: 'A runner going twice as fast will eventually lap the slower runner.', penalty: 3 },
      { text: 'Advance slow by 1 and fast by 2.', penalty: 5 }
    ],
    points: 10,
    timeLimitSeconds: 60
  },
  {
    id: 'algo-ll-21',
    title: 'Middle of the Linked List Complexity',
    mode: 'complexity-clash',
    topic: 'Linked Lists',
    difficulty: 'Beginner',
    language: 'C++',
    problemStatement:
      'Given the head of a singly linked list, return the middle node. If there are two middle nodes, return the second middle node. What are the time and space complexities of the two-pointer approach?',
    codeSnippet: `ListNode* middleNode(ListNode* head) {
    ListNode* slow = head;
    ListNode* fast = head;
    while (fast != nullptr && fast->next != nullptr) {
        slow = slow->next;
        fast = fast->next->next;
    }
    return slow;
}`,
    constraints: ['The number of nodes in the list is in the range [1, 100].', '1 <= Node.val <= 100'],
    examples: [
      { input: 'head = [1,2,3,4,5]', output: '[3,4,5]', explanation: 'The middle node of the list is node 3.' },
      { input: 'head = [1,2,3,4,5,6]', output: '[4,5,6]', explanation: 'Since the list has two middle nodes with values 3 and 4, we return the second one.' }
    ],
    options: [
      { id: 'opt-a', label: 'Time: O(n), Space: O(1)', explanation: 'Single pass where fast traverses n nodes and slow traverses n/2 nodes with two pointer references.', isCorrect: true },
      { id: 'opt-b', label: 'Time: O(n log n), Space: O(1)', explanation: 'No sorting or log-factor division is performed.', isCorrect: false },
      { id: 'opt-c', label: 'Time: O(n), Space: O(n)', explanation: 'No auxiliary array or node copying occurs.', isCorrect: false },
      { id: 'opt-d', label: 'Time: O(n^2), Space: O(1)', explanation: 'The list is only traversed once, not in nested loops.', isCorrect: false }
    ],
    correctOptionId: 'opt-a',
    detailedExplanation:
      'The fast pointer moves at twice the speed of the slow pointer. When fast reaches the end of the list (or fast.next is null), slow has moved exactly halfway, pointing directly to the middle node. This requires a single traversal of n nodes in O(n) time and O(1) auxiliary space.',
    optimalApproach: 'Fast & Slow pointer single-pass traversal.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    commonPitfall: 'Creating an array of nodes which takes O(n) extra space.',
    interviewTip: 'Note how the loop condition handles both odd and even length lists cleanly.',
    pattern: 'Two Pointers',
    hints: [
      { text: 'How far does fast travel relative to slow?', penalty: 2 },
      { text: 'When fast finishes the track, slow is halfway through.', penalty: 3 },
      { text: 'Only two pointer variables are allocated.', penalty: 5 }
    ],
    points: 10,
    timeLimitSeconds: 60
  },
  {
    id: 'algo-ll-22',
    title: 'Merge Two Sorted Lists with Dummy Node',
    mode: 'rush-ladder',
    topic: 'Linked Lists',
    difficulty: 'Intermediate',
    language: 'Python',
    problemStatement:
      'You are given the heads of two sorted linked lists list1 and list2. Merge the two lists into one sorted list. Why is using a dummy sentinel node best practice?',
    inputFormat: 'list1: ListNode, list2: ListNode',
    outputFormat: 'mergedHead: ListNode',
    constraints: ['The number of nodes in both lists is in the range [0, 50].', '-100 <= Node.val <= 100', 'Both lists are sorted.'],
    examples: [
      { input: 'list1 = [1,2,4], list2 = [1,3,4]', output: '[1,1,2,3,4,4]' },
      { input: 'list1 = [], list2 = []', output: '[]' }
    ],
    options: [
      {
        id: 'opt-a',
        label: 'Dummy node eliminates special edge case checks for initializing head',
        codeSnippet: `dummy = ListNode(-1)\ntail = dummy\nwhile list1 and list2:\n    if list1.val <= list2.val:\n        tail.next = list1\n        list1 = list1.next\n    else:\n        tail.next = list2\n        list2 = list2.next\n    tail = tail.next\ntail.next = list1 or list2\nreturn dummy.next`,
        explanation: 'Avoids checking `if head is None` on the first insertion, making list stitching clean and bug-free.',
        isCorrect: true
      },
      {
        id: 'opt-b',
        label: 'Dummy node reduces the runtime from O(n) to O(log n)',
        explanation: 'A dummy node has no effect on asymptotic time complexity.',
        isCorrect: false
      },
      {
        id: 'opt-c',
        label: 'Dummy node sorts the values automatically',
        explanation: 'A dummy node is just an empty placeholder node.',
        isCorrect: false
      },
      {
        id: 'opt-d',
        label: 'Dummy node allows backward traversal',
        explanation: 'A dummy node does not add a prev pointer.',
        isCorrect: false
      }
    ],
    correctOptionId: 'opt-a',
    detailedExplanation:
      'A dummy (sentinel) node serves as a persistent anchor for the head of the new list. A tail pointer appends the smaller node at each step. At the end, whichever list has remaining nodes is attached in O(1) via `tail.next = list1 or list2`. Returning `dummy.next` seamlessly returns the true head.',
    optimalApproach: 'Iterative two-way merge using a dummy sentinel node.',
    timeComplexity: 'O(n + m)',
    spaceComplexity: 'O(1)',
    commonPitfall: 'Iterating through remaining elements one by one instead of splicing `tail.next = list1 or list2` in O(1).',
    interviewTip: 'Dummy nodes are standard across all linked list problems involving deletions or insertions at the head.',
    pattern: 'Linked Lists',
    hints: [
      { text: 'Think about how you pick the very first node of the merged list without a dummy.', penalty: 3 },
      { text: 'A dummy node holds the starting position so you never worry about null head.', penalty: 5 },
      { text: 'Return dummy.next at the end.', penalty: 8 }
    ],
    points: 20,
    timeLimitSeconds: 70
  },
  {
    id: 'algo-ll-23',
    title: 'Remove Nth Node From End of List in One Pass',
    mode: 'rush-ladder',
    topic: 'Linked Lists',
    difficulty: 'Advanced',
    language: 'Java',
    problemStatement:
      'Given the head of a linked list, remove the nth node from the end of the list and return its head in a single pass. How do two pointers achieve this?',
    constraints: ['The number of nodes in the list is sz.', '1 <= sz <= 30', '0 <= Node.val <= 100', '1 <= n <= sz'],
    examples: [
      { input: 'head = [1,2,3,4,5], n = 2', output: '[1,2,3,5]', explanation: 'Removing the 2nd node from end removes node 4.' },
      { input: 'head = [1], n = 1', output: '[]' }
    ],
    options: [
      {
        id: 'opt-a',
        label: 'Advance fast pointer n+1 steps ahead, then move slow and fast together until fast is null',
        codeSnippet: `ListNode dummy = new ListNode(0);\ndummy.next = head;\nListNode fast = dummy;\nListNode slow = dummy;\nfor (int i = 0; i <= n; i++) fast = fast.next;\nwhile (fast != null) {\n    slow = slow.next;\n    fast = fast.next;\n}\nslow.next = slow.next.next;\nreturn dummy.next;`,
        explanation: 'Maintaining a gap of n+1 nodes between fast and slow ensures that when fast reaches null, slow is positioned directly before the node to be removed.',
        isCorrect: true
      },
      {
        id: 'opt-b',
        label: 'Reverse list, remove nth node from front, reverse list again',
        explanation: 'Takes 3 passes over the list instead of a single pass.',
        isCorrect: false
      },
      {
        id: 'opt-c',
        label: 'First pass count length L, second pass remove (L - n + 1)-th node',
        explanation: 'Requires two passes over the list instead of a single pass.',
        isCorrect: false
      },
      {
        id: 'opt-d',
        label: 'Store nodes in an array list and remove index len - n',
        explanation: 'Consumes O(sz) auxiliary space instead of O(1).',
        isCorrect: false
      }
    ],
    correctOptionId: 'opt-a',
    detailedExplanation:
      'By placing a dummy node before head and advancing fast by n + 1 steps, slow and fast are separated by a fixed window of n + 1 nodes. When fast hits null (end of list), slow is guaranteed to stop at the node immediately preceding the target node, enabling immediate removal via `slow.next = slow.next.next`.',
    optimalApproach: 'Two-pointer fixed gap window with sentinel dummy node.',
    timeComplexity: 'O(L) single pass where L is list length',
    spaceComplexity: 'O(1)',
    commonPitfall: 'Not handling removing the head node (e.g. n == length); a dummy node handles this seamlessly.',
    interviewTip: 'Emphasize that the dummy node avoids special branches when removing the first node of the list.',
    pattern: 'Two Pointers',
    hints: [
      { text: 'Create a gap between two pointers equal to n.', penalty: 5 },
      { text: 'When the leading pointer reaches the end, where will the trailing pointer be?', penalty: 8 },
      { text: 'Position the trailing pointer one node BEFORE the node to delete.', penalty: 10 }
    ],
    points: 30,
    timeLimitSeconds: 85
  },

  // ==========================================
  // STACKS & QUEUES (24-28)
  // ==========================================
  {
    id: 'algo-stk-24',
    title: 'Valid Parentheses Matching Rule',
    mode: 'quick-solve',
    topic: 'Stacks & Queues',
    difficulty: 'Beginner',
    language: 'Python',
    problemStatement:
      'Given a string s containing just the characters "(", ")", "{", "}", "[" and "]", determine if the input string is valid. What is the fundamental invariant of the Stack approach?',
    constraints: ['1 <= s.length <= 10^4', 's consists of parentheses only "()[]{}"'],
    examples: [
      { input: 's = "()"', output: 'true' },
      { input: 's = "()[]{}"', output: 'true' },
      { input: 's = "(]"', output: 'false' }
    ],
    options: [
      {
        id: 'opt-a',
        label: 'Push open brackets to stack; on closing bracket, pop and verify matching type; stack must be empty at end',
        codeSnippet: `stack = []\nmapping = {')': '(', '}': '{', ']': '['}\nfor ch in s:\n    if ch in mapping:\n        top = stack.pop() if stack else '#'\n        if mapping[ch] != top: return False\n    else:\n        stack.append(ch)\nreturn len(stack) == 0`,
        explanation: 'The Last-In-First-Out (LIFO) property of a stack matches the inner-most opening bracket with the first encountered closing bracket.',
        isCorrect: true
      },
      {
        id: 'opt-b',
        label: 'Count numbers of open vs closed parentheses of each type',
        explanation: 'Fails ordering checks! For example, "[(])" has matching counts but invalid nesting.',
        isCorrect: false
      },
      {
        id: 'opt-c',
        label: 'Replace "()", "{}", "[]" repeatedly with empty string',
        explanation: 'String replacements take O(n^2) time, which times out on 10,000 characters.',
        isCorrect: false
      },
      {
        id: 'opt-d',
        label: 'Use two pointers from left and right ends',
        explanation: 'Fails consecutive pairs such as "()[]{}".',
        isCorrect: false
      }
    ],
    correctOptionId: 'opt-a',
    detailedExplanation:
      'Brackets must close in reverse of the order they were opened. A stack naturally tracks open brackets. Whenever a closing bracket appears, the most recently opened bracket must be on top of the stack and of matching type. Finally, the stack must be empty (all brackets closed).',
    optimalApproach: 'LIFO Stack with bracket map.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    commonPitfall: 'Forgetting to check if stack is empty at the end (e.g. s = "((" has no mismatched closures but is invalid).',
    interviewTip: 'Using a mapping dictionary makes adding new bracket types trivial without changing algorithm logic.',
    pattern: 'Stack',
    hints: [
      { text: 'Which data structure enforces Last-In, First-Out order?', penalty: 2 },
      { text: 'Push opening brackets; pop when you encounter a closing bracket.', penalty: 3 },
      { text: 'Remember that any unclosed brackets left in the stack make the string invalid.', penalty: 5 }
    ],
    points: 10,
    timeLimitSeconds: 60
  },
  {
    id: 'algo-stk-25',
    title: 'Min Stack Design Complexity Clash',
    mode: 'complexity-clash',
    topic: 'Stacks & Queues',
    difficulty: 'Intermediate',
    language: 'Java',
    problemStatement:
      'Design a stack that supports push, pop, top, and retrieving the minimum element in constant time. What are the time complexities of push, pop, and getMin in the two-stack approach?',
    codeSnippet: `class MinStack {
    private Stack<Integer> stack = new Stack<>();
    private Stack<Integer> minStack = new Stack<>();
    public void push(int val) {
        stack.push(val);
        if (minStack.isEmpty() || val <= minStack.peek()) minStack.push(val);
    }
    public void pop() {
        if (stack.pop().equals(minStack.peek())) minStack.pop();
    }
    public int getMin() { return minStack.peek(); }
}`,
    constraints: ['Methods pop, top and getMin operations will always be called on non-empty stacks.', 'At most 3 * 10^4 calls.'],
    options: [
      { id: 'opt-a', label: 'All operations: push, pop, top, getMin are O(1) time', explanation: 'By maintaining an auxiliary minStack that mirrors minimums, getMin simply returns minStack.peek() in O(1).', isCorrect: true },
      { id: 'opt-b', label: 'push: O(1), pop: O(1), getMin: O(n)', explanation: 'Scanning the stack for the minimum would be O(n), but the design requires O(1).', isCorrect: false },
      { id: 'opt-c', label: 'push: O(log n), pop: O(1), getMin: O(1)', explanation: 'No binary search or priority queue is used, so push is O(1).', isCorrect: false },
      { id: 'opt-d', label: 'push: O(n), pop: O(1), getMin: O(1)', explanation: 'Pushing takes O(1) time.', isCorrect: false }
    ],
    correctOptionId: 'opt-a',
    detailedExplanation:
      'An auxiliary stack `minStack` maintains the minimum value seen so far for each corresponding height of the primary stack. When pushing, if val <= minStack.peek(), push to minStack. When popping, if the removed value equals minStack.peek(), pop minStack too. All operations remain strictly O(1) time.',
    optimalApproach: 'Dual-stack or single-stack with (val, min_so_far) pairs.',
    timeComplexity: 'O(1) for all operations',
    spaceComplexity: 'O(n) auxiliary space',
    commonPitfall: 'Using `==` instead of `.equals()` in Java when comparing Integer wrapper objects above 127.',
    interviewTip: 'Mention you can also store pairs `(val, current_min)` in a single stack.',
    pattern: 'Stack',
    hints: [
      { text: 'Can an auxiliary stack remember the minimum at each state?', penalty: 3 },
      { text: 'Look at how minStack only pushes when val <= minStack.peek().', penalty: 5 },
      { text: 'Every method does a constant number of peek/push/pop operations.', penalty: 8 }
    ],
    points: 20,
    timeLimitSeconds: 70
  },
  {
    id: 'algo-stk-26',
    title: 'Daily Temperatures / Next Greater Element Pattern',
    mode: 'pattern-match',
    topic: 'Stacks & Queues',
    difficulty: 'Intermediate',
    language: 'Language-Independent',
    problemStatement:
      'Given an array of integers temperatures representing daily temperatures, return an array answer such that answer[i] is the number of days you have to wait after the ith day to get a warmer temperature. Which data structure pattern solves this in O(n) total time?',
    constraints: ['1 <= temperatures.length <= 10^5', '30 <= temperatures[i] <= 100'],
    examples: [
      { input: 'temperatures = [73,74,75,71,69,72,76,73]', output: '[1,1,4,2,1,1,0,0]' }
    ],
    options: [
      { id: 'opt-a', label: 'Monotonic Decreasing Stack storing indices', explanation: 'Stores indices of unresolved days in descending order of temperature. When a warmer day arrives, resolve all smaller temperatures on top of the stack.', isCorrect: true },
      { id: 'opt-b', label: 'Priority Queue (Min-Heap)', explanation: 'Heap operations incur O(n log n) overhead instead of linear O(n).', isCorrect: false },
      { id: 'opt-c', label: 'Two Pointers moving outward', explanation: 'Two pointers cannot locate next greater elements in unsorted arrays in O(n).', isCorrect: false },
      { id: 'opt-d', label: 'Breadth First Search', explanation: 'Graph exploration is inapplicable to 1D monotonic index tracking.', isCorrect: false }
    ],
    correctOptionId: 'opt-a',
    detailedExplanation:
      'A Monotonic Stack maintains indices whose temperatures are in decreasing order. As you scan each day i: while the stack is not empty and temperatures[i] > temperatures[stack.top()], pop the previous day prev_day and set answer[prev_day] = i - prev_day. Each index is pushed and popped at most once, yielding O(n) total runtime.',
    optimalApproach: 'Monotonic decreasing stack of indices.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    commonPitfall: 'Storing temperature values instead of indices in the stack, losing day difference computation.',
    interviewTip: 'Whenever a problem asks for "next greater element" or "next smaller element", immediately consider a Monotonic Stack.',
    pattern: 'Stack',
    hints: [
      { text: 'Think about keeping unresolved past days in a stack.', penalty: 3 },
      { text: 'If today is warmer than the day on top of the stack, you found the answer for that day.', penalty: 5 },
      { text: 'The stack stays monotonically decreasing in temperatures.', penalty: 8 }
    ],
    points: 20,
    timeLimitSeconds: 70
  },
  {
    id: 'algo-stk-27',
    title: 'Implement Queue using Two Stacks Amortized Cost',
    mode: 'complexity-clash',
    topic: 'Stacks & Queues',
    difficulty: 'Intermediate',
    language: 'Language-Independent',
    problemStatement:
      'Implement a first-in first-out (FIFO) queue using only two LIFO stacks (in_stack and out_stack). What is the amortized time complexity of the pop() and peek() operations?',
    codeSnippet: `def push(x):
    in_stack.append(x)

def pop():
    if not out_stack:
        while in_stack:
            out_stack.append(in_stack.pop())
    return out_stack.pop()`,
    constraints: ['At most 100 calls to push, pop, peek, and empty.'],
    options: [
      { id: 'opt-a', label: 'Amortized O(1) time per operation', explanation: 'Each element is pushed to in_stack once, popped to out_stack once, and popped from out_stack once: exactly 3 operations per element over its entire lifetime.', isCorrect: true },
      { id: 'opt-b', label: 'Worst-case O(1) time for every single call', explanation: 'When out_stack is empty, pouring in_stack into out_stack takes O(n) worst-case time for that specific call.', isCorrect: false },
      { id: 'opt-c', label: 'Amortized O(n) time per operation', explanation: 'The cost is distributed over all preceding pushes, yielding O(1) amortized.', isCorrect: false },
      { id: 'opt-d', label: 'O(log n) time', explanation: 'Stack operations take O(1) each, no log factor is involved.', isCorrect: false }
    ],
    correctOptionId: 'opt-a',
    detailedExplanation:
      'Even though a single call to pop() can take O(n) when transferring elements from in_stack to out_stack, each element is moved between stacks at most once in its entire existence. Thus, for any sequence of m operations, the total cost is O(m), giving an amortized cost of O(1) per operation.',
    optimalApproach: 'Lazy transfer between input and output stacks.',
    timeComplexity: 'Amortized O(1) for pop/peek; O(1) worst-case for push',
    spaceComplexity: 'O(n) auxiliary space',
    commonPitfall: 'Transferring elements back from out_stack to in_stack after every pop, which ruins the O(1) amortized guarantee and makes it O(n^2).',
    interviewTip: 'Explain accounting/aggregate analysis: each element is pushed twice and popped twice across its lifecycle.',
    pattern: 'Stacks & Queues',
    hints: [
      { text: 'How many times does any single element move from in_stack to out_stack?', penalty: 3 },
      { text: 'An element is transferred at most once during its entire lifetime in the queue.', penalty: 5 },
      { text: 'Total operations divided by number of elements gives amortized O(1).', penalty: 8 }
    ],
    points: 20,
    timeLimitSeconds: 70
  },
  {
    id: 'algo-stk-28',
    title: 'Sliding Window Maximum with Monotonic Deque',
    mode: 'rush-ladder',
    topic: 'Stacks & Queues',
    difficulty: 'Advanced',
    language: 'Python',
    problemStatement:
      'Given an array nums and a sliding window of size k moving from left to right, return the max sliding window. Which deque invariant achieves optimal O(n) time?',
    constraints: ['1 <= nums.length <= 10^5', '-10^4 <= nums[i] <= 10^4', '1 <= k <= nums.length'],
    examples: [
      { input: 'nums = [1,3,-1,-3,5,3,6,7], k = 3', output: '[3,3,5,5,6,7]' }
    ],
    options: [
      {
        id: 'opt-a',
        label: 'Monotonic decreasing deque: pop smaller elements from back before inserting, pop out-of-window from front',
        codeSnippet: `from collections import deque\nq = deque() # stores indices\nres = []\nfor i, x in enumerate(nums):\n    if q and q[0] <= i - k: q.popleft()\n    while q and nums[q[-1]] < x: q.pop()\n    q.append(i)\n    if i >= k - 1: res.append(nums[q[0]])\nreturn res`,
        explanation: 'Front of deque always holds the maximum element index for the current window. Each index is inserted and removed at most once.',
        isCorrect: true
      },
      {
        id: 'opt-b',
        label: 'Recompute max(nums[i:i+k]) for every window',
        explanation: 'Takes O(k * (n - k)) = O(n * k) time, which times out when n, k = 10^5.',
        isCorrect: false
      },
      {
        id: 'opt-c',
        label: 'Maintain a max-heap and remove departed elements by rebuilding heap',
        explanation: 'Heap removal takes O(k) or heap size grows to n, yielding O(n log n) instead of linear O(n).',
        isCorrect: false
      },
      {
        id: 'opt-d',
        label: 'Use two pointers without a deque',
        explanation: 'Two pointers alone cannot maintain sliding window maximums without a supporting data structure.',
        isCorrect: false
      }
    ],
    correctOptionId: 'opt-a',
    detailedExplanation:
      'A double-ended queue (deque) stores indices of elements in monotonically decreasing order of value. When considering nums[i]: 1) Evict front index if it has fallen out of the k-window (`q[0] <= i - k`). 2) Evict back elements while `nums[q[-1]] < nums[i]`, because they can never be the maximum again. 3) Push i to back. The front `q[0]` is always the window maximum in O(1).',
    optimalApproach: 'Monotonic Deque storing candidate maximum indices.',
    timeComplexity: 'O(n) where each element is pushed/popped at most once',
    spaceComplexity: 'O(k) for the deque',
    commonPitfall: 'Storing values instead of indices in the deque, making it impossible to check if the maximum has left the window.',
    interviewTip: 'Contrast Monotonic Deque O(n) vs Max-Heap O(n log k).',
    pattern: 'Stacks & Queues',
    hints: [
      { text: 'If a newly arrived element is larger than previous elements in the window, those previous elements can never be the max.', penalty: 5 },
      { text: 'Maintain indices in decreasing order of value inside a deque.', penalty: 8 },
      { text: 'The element at the front of the deque is always the maximum of the current window.', penalty: 10 }
    ],
    points: 30,
    timeLimitSeconds: 85
  },

  // ==========================================
  // TREES & GRAPHS (29-33)
  // ==========================================
  {
    id: 'algo-tree-29',
    title: 'Maximum Depth of Binary Tree Recursion',
    mode: 'quick-solve',
    topic: 'Trees & Graphs',
    difficulty: 'Beginner',
    language: 'Java',
    problemStatement:
      'Given the root of a binary tree, return its maximum depth (the number of nodes along the longest path from the root node down to the farthest leaf node). What is the optimal recursive post-order formulation?',
    constraints: ['The number of nodes in the tree is in the range [0, 10^4].', '-100 <= Node.val <= 100'],
    examples: [
      { input: 'root = [3,9,20,null,null,15,7]', output: '3' },
      { input: 'root = [1,null,2]', output: '2' }
    ],
    options: [
      {
        id: 'opt-a',
        label: '1 + Math.max(maxDepth(root.left), maxDepth(root.right)) with base case root == null -> 0',
        codeSnippet: `public int maxDepth(TreeNode root) {\n    if (root == null) return 0;\n    return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));\n}`,
        explanation: 'Post-order DFS computes depth of left and right subtrees, takes the maximum, and adds 1 for the current node.',
        isCorrect: true
      },
      {
        id: 'opt-b',
        label: '1 + Math.min(maxDepth(root.left), maxDepth(root.right))',
        explanation: 'Math.min computes minimum depth, not maximum depth.',
        isCorrect: false
      },
      {
        id: 'opt-c',
        label: 'maxDepth(root.left) + maxDepth(root.right)',
        explanation: 'Sums all node depths together instead of taking the longest single path.',
        isCorrect: false
      },
      {
        id: 'opt-d',
        label: 'Count total nodes and return log2(n)',
        explanation: 'Only holds true for perfectly balanced complete binary trees, not skewed trees.',
        isCorrect: false
      }
    ],
    correctOptionId: 'opt-a',
    detailedExplanation:
      'The height of any subtree rooted at node is 1 plus the maximum of the heights of its left and right children. The base case is a null node which contributes 0. This depth-first search visits every node exactly once in O(n) time and uses O(h) call stack memory, where h is tree height.',
    optimalApproach: 'Recursive DFS post-order traversal.',
    timeComplexity: 'O(n) where n is number of nodes',
    spaceComplexity: 'O(h) call stack space (O(log n) balanced, O(n) worst-case skewed)',
    commonPitfall: 'Assuming tree height is always O(log n); in a linked-list style skewed tree, height is O(n).',
    interviewTip: 'Mention both DFS recursive and BFS level-order queue implementations.',
    pattern: 'Recursion',
    hints: [
      { text: 'What is the depth of an empty tree (root == null)?', penalty: 2 },
      { text: 'If you know the depths of left and right subtrees, the current depth is 1 + max(left, right).', penalty: 3 },
      { text: 'Post-order traversal visits children first before computing parent depth.', penalty: 5 }
    ],
    points: 10,
    timeLimitSeconds: 60
  },
  {
    id: 'algo-tree-30',
    title: 'Shortest Path in Unweighted Graph Pattern',
    mode: 'pattern-match',
    topic: 'Trees & Graphs',
    difficulty: 'Intermediate',
    language: 'Language-Independent',
    problemStatement:
      'Given an unweighted undirected graph and two vertices source and destination, find the length of the shortest path between them. Which graph traversal algorithm guarantees the shortest path in unweighted graphs in O(V + E) time?',
    constraints: ['Graph is unweighted', 'V <= 10^5, E <= 2 * 10^5'],
    options: [
      { id: 'opt-a', label: 'Breadth-First Search (BFS) using a FIFO Queue', explanation: 'BFS explores vertices in concentric levels of increasing distance from source, guaranteeing that the first time destination is visited is its shortest path.', isCorrect: true },
      { id: 'opt-b', label: 'Depth-First Search (DFS) with recursion', explanation: 'DFS explores deep branches first and does not guarantee shortest paths without checking all exponential paths.', isCorrect: false },
      { id: 'opt-c', label: 'Bellman-Ford Algorithm', explanation: 'Bellman-Ford is for weighted graphs with negative edges and takes O(V * E) time, which is too slow for 10^5 vertices.', isCorrect: false },
      { id: 'opt-d', label: 'Floyd-Warshall Algorithm', explanation: 'Floyd-Warshall is all-pairs shortest path in O(V^3) time.', isCorrect: false }
    ],
    correctOptionId: 'opt-a',
    detailedExplanation:
      'In an unweighted graph (or any graph where all edges have identical weight 1), Breadth-First Search visits all nodes at distance 1, then distance 2, then distance 3, etc. Thus, the first time the target node is dequeued, the current level count is mathematically guaranteed to be the minimal edge count in O(V + E) time.',
    optimalApproach: 'Breadth-First Search with FIFO queue and visited set.',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
    commonPitfall: 'Using DFS to find shortest path, which can follow a convoluted long path first and requires visiting all paths.',
    interviewTip: 'Contrast BFS for unweighted graphs vs Dijkstra for non-negative weighted graphs.',
    pattern: 'Breadth-First Search',
    hints: [
      { text: 'Which traversal visits all neighbors at distance d before moving to distance d + 1?', penalty: 3 },
      { text: 'Level-by-level exploration guarantees the first encounter of destination is the shortest.', penalty: 5 },
      { text: 'BFS using a FIFO queue achieves this in O(V + E) time.', penalty: 8 }
    ],
    points: 20,
    timeLimitSeconds: 70
  },
  {
    id: 'algo-tree-31',
    title: 'Lowest Common Ancestor in Binary Search Tree',
    mode: 'complexity-clash',
    topic: 'Trees & Graphs',
    difficulty: 'Intermediate',
    language: 'Python',
    problemStatement:
      'Given a Binary Search Tree (BST) and two nodes p and q, find the Lowest Common Ancestor (LCA). Utilizing BST ordering properties, what are the time and auxiliary space complexities of the iterative approach?',
    codeSnippet: `def lowestCommonAncestor(root, p, q):
    curr = root
    while curr:
        if p.val > curr.val and q.val > curr.val:
            curr = curr.right
        elif p.val < curr.val and q.val < curr.val:
            curr = curr.left
        else:
            return curr`,
    constraints: ['The number of nodes in the tree is in the range [2, 10^5].', 'All Node.val are unique.', 'p and q will exist in the BST.'],
    options: [
      { id: 'opt-a', label: 'Time: O(h), Space: O(1)', explanation: 'Iteratively walks down one branch of the tree following BST properties without allocating call stack or extra memory.', isCorrect: true },
      { id: 'opt-b', label: 'Time: O(n), Space: O(n)', explanation: 'That is for a general binary tree requiring full recursion or parent pointer maps.', isCorrect: false },
      { id: 'opt-c', label: 'Time: O(n log n), Space: O(1)', explanation: 'We only traverse down height h, taking at most O(h) comparisons.', isCorrect: false },
      { id: 'opt-d', label: 'Time: O(1), Space: O(1)', explanation: 'Finding the split node still requires descending the tree of height h.', isCorrect: false }
    ],
    correctOptionId: 'opt-a',
    detailedExplanation:
      'In a BST, values in the left subtree are < curr.val, and values in the right subtree are > curr.val. If both p and q are greater than curr, LCA must be in the right subtree. If both are smaller, LCA must be in the left subtree. The moment p and q diverge (or one equals curr), curr is the Lowest Common Ancestor. In an iterative loop, auxiliary space is strictly O(1).',
    optimalApproach: 'Iterative BST property descent.',
    timeComplexity: 'O(h) where h is tree height (O(log n) balanced, O(n) skewed)',
    spaceComplexity: 'O(1) auxiliary space',
    commonPitfall: 'Treating a BST like an arbitrary binary tree and performing expensive general LCA recursion.',
    interviewTip: 'Point out how the BST sorted invariant simplifies LCA from O(n) general tree traversal to a simple O(h) walk.',
    pattern: 'Binary Search',
    hints: [
      { text: 'Remember that in a BST, left child < parent < right child.', penalty: 3 },
      { text: 'If p and q are on opposite sides of curr, can any deeper node be an ancestor of both?', penalty: 5 },
      { text: 'The split point where p and q diverge is the LCA.', penalty: 8 }
    ],
    points: 20,
    timeLimitSeconds: 70
  },
  {
    id: 'algo-tree-32',
    title: 'Number of Connected Components / Islands',
    mode: 'rush-ladder',
    topic: 'Trees & Graphs',
    difficulty: 'Intermediate',
    language: 'Language-Independent',
    problemStatement:
      'Given an m x n 2D binary grid which represents a map of "1"s (land) and "0"s (water), return the number of islands. What is the standard in-place DFS flood-fill approach?',
    constraints: ['m == grid.length', 'n == grid[i].length', '1 <= m, n <= 300', 'grid[i][j] is "0" or "1"'],
    examples: [
      { input: 'grid = [["1","1","0"],["1","1","0"],["0","0","1"]]', output: '2', explanation: 'One top-left island of size 4, one bottom-right island of size 1.' }
    ],
    options: [
      {
        id: 'opt-a',
        label: 'Iterate every cell; on finding "1", increment island count and DFS flood-fill all connected 4-directional lands to "0"',
        explanation: 'Sinking visited land to "0" avoids extra O(m * n) visited array allocation and counts each connected component once.',
        isCorrect: true
      },
      {
        id: 'opt-b',
        label: 'Count the total number of "1"s in the grid',
        explanation: 'Counts individual cells, not connected multi-cell islands.',
        isCorrect: false
      },
      {
        id: 'opt-c',
        label: 'Run Dijkstra algorithm from top-left cell',
        explanation: 'Dijkstra computes shortest weighted paths, not connected components.',
        isCorrect: false
      },
      {
        id: 'opt-d',
        label: 'Binary search the grid dimensions',
        explanation: 'Grids are not sorted arrays; binary search is inapplicable.',
        isCorrect: false
      }
    ],
    correctOptionId: 'opt-a',
    detailedExplanation:
      'Traverse each grid cell (r, c). When a "1" is encountered, increment the island counter and invoke DFS/BFS to recursively sink all 4-directionally adjacent "1"s by changing them to "0" (or marking visited). Each cell is visited at most 5 times (once in main loops, up to 4 times by neighbors), achieving O(m * n) time.',
    optimalApproach: 'DFS or BFS flood-fill component discovery.',
    timeComplexity: 'O(m * n)',
    spaceComplexity: 'O(m * n) worst-case recursion stack (when grid is completely filled with land)',
    commonPitfall: 'Forgetting boundary checks (r < 0 || r >= m || c < 0 || c >= n) before checking grid[r][c].',
    interviewTip: 'Ask the interviewer if modifying the input grid in-place is permitted; if not, use a `visited[m][n]` boolean matrix.',
    pattern: 'Depth-First Search',
    hints: [
      { text: 'Think of this as finding connected components in an undirected grid graph.', penalty: 3 },
      { text: 'When you find land, visit all neighboring lands and mark them so they aren’t recounted.', penalty: 5 },
      { text: 'You can "sink" the island by flipping visited land from "1" to "0".', penalty: 8 }
    ],
    points: 20,
    timeLimitSeconds: 75
  },
  {
    id: 'algo-tree-33',
    title: 'Detect Cycle in Directed Graph with 3 Colors',
    mode: 'rush-ladder',
    topic: 'Trees & Graphs',
    difficulty: 'Advanced',
    language: 'Python',
    problemStatement:
      'Given a directed graph with V vertices and E edges, determine if it contains a cycle. Why is 3-color DFS (White=0, Gray=1, Black=2) preferred over a simple boolean visited array?',
    constraints: ['1 <= V <= 10^5', '1 <= E <= 2 * 10^5'],
    options: [
      {
        id: 'opt-a',
        label: 'Gray indicates the node is currently in the active recursion call stack; encountering a Gray node identifies a back-edge (cycle)',
        codeSnippet: `WHITE, GRAY, BLACK = 0, 1, 2\nstate = [WHITE] * V\ndef dfs(u):\n    state[u] = GRAY\n    for v in adj[u]:\n        if state[v] == GRAY: return True # Back-edge found!\n        if state[v] == WHITE and dfs(v): return True\n    state[u] = BLACK\n    return False`,
        explanation: 'A simple boolean visited array cannot distinguish between cross-edges in previously finished subtrees (which are valid in DAGs) and actual back-edges in the current ancestor path.',
        isCorrect: true
      },
      {
        id: 'opt-b',
        label: '3 colors compress memory to 2 bits per node',
        explanation: 'The distinction is algorithmic correctness, not bit packing.',
        isCorrect: false
      },
      {
        id: 'opt-c',
        label: '3 colors are required because graph edges can be negative',
        explanation: 'Cycle detection on unweighted directed graphs is unrelated to edge weights.',
        isCorrect: false
      },
      {
        id: 'opt-d',
        label: 'A simple boolean visited array works identically without flaw',
        explanation: 'In a DAG (e.g. 0 -> 1, 0 -> 2, 1 -> 3, 2 -> 3), node 3 is visited from both 1 and 2; a simple visited flag would falsely report a cycle.',
        isCorrect: false
      }
    ],
    correctOptionId: 'opt-a',
    detailedExplanation:
      'In directed graphs, an edge pointing to an already visited vertex does NOT necessarily mean a cycle (it could be a forward or cross edge in a DAG). A cycle exists if and only if a directed back-edge points to an ancestor currently in the active DFS recursion stack (colored Gray). Nodes fully processed are colored Black.',
    optimalApproach: '3-color DFS or Kahn’s topological sort BFS.',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
    commonPitfall: 'Using a single boolean visited array, which falsely flags diamond-shaped DAGs (e.g., A->B->D, A->C->D) as having cycles.',
    interviewTip: 'Mention Kahn’s algorithm (in-degree reduction) as an alternative: if topological sort processes fewer than V nodes, a cycle exists.',
    pattern: 'Depth-First Search',
    hints: [
      { text: 'In directed graphs, can two paths converge on the same node without a cycle?', penalty: 5 },
      { text: 'Yes, a diamond graph has no cycles. A cycle only occurs when an edge points back to an ancestor.', penalty: 8 },
      { text: 'Gray state tracks active recursion ancestors.', penalty: 10 }
    ],
    points: 30,
    timeLimitSeconds: 85
  },

  // ==========================================
  // RECURSION & BACKTRACKING (34-36)
  // ==========================================
  {
    id: 'algo-rec-34',
    title: 'Generate All Subsets (Power Set) Complexity',
    mode: 'complexity-clash',
    topic: 'Recursion & Backtracking',
    difficulty: 'Intermediate',
    language: 'Language-Independent',
    problemStatement:
      'Given an integer array nums of unique elements, return all possible subsets (the power set). For an array of size n, what are the total number of subsets and the time complexity to generate them?',
    constraints: ['1 <= nums.length <= 10', '-10 <= nums[i] <= 10', 'All numbers of nums are unique.'],
    examples: [
      { input: 'nums = [1,2,3]', output: '[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]', explanation: '2^3 = 8 subsets.' }
    ],
    options: [
      { id: 'opt-a', label: '2^n total subsets; Time: O(n * 2^n)', explanation: 'There are 2^n total subsets. Copying each subset of average size n/2 into the result list takes O(n) per subset.', isCorrect: true },
      { id: 'opt-b', label: 'n! total subsets; Time: O(n!)', explanation: 'n! is the number of permutations, not subsets.', isCorrect: false },
      { id: 'opt-c', label: '2^n total subsets; Time: O(2^n)', explanation: 'Ignores the O(n) time needed to copy each subset array into the result.', isCorrect: false },
      { id: 'opt-d', label: 'n^2 total subsets; Time: O(n^2)', explanation: 'n^2 is the count of contiguous subarrays, not arbitrary subsets.', isCorrect: false }
    ],
    correctOptionId: 'opt-a',
    detailedExplanation:
      'Each element has 2 choices: include or exclude. For n elements, there are 2 * 2 * ... * 2 = 2^n possible subsets. Since creating a deep copy of each subset to add to the answer takes O(n) time, total runtime is O(n * 2^n). Space complexity is also O(n * 2^n) to store all subsets.',
    optimalApproach: 'Backtracking (include/exclude) or Bitmask generation from 0 to 2^n - 1.',
    timeComplexity: 'O(n * 2^n)',
    spaceComplexity: 'O(n * 2^n) output space, O(n) recursion stack',
    commonPitfall: 'Forgetting that copying array slices takes O(n) time, leading to the false claim that time is O(2^n).',
    interviewTip: 'Contrast the backtracking approach with bit manipulation: iterate mask from 0 to (1 << n) - 1.',
    pattern: 'Recursion & Backtracking',
    hints: [
      { text: 'For each element, you have two choices: pick it or skip it.', penalty: 3 },
      { text: 'Multiply 2 choices across n elements to find total subsets.', penalty: 5 },
      { text: 'Remember that copying each subset into the results array takes O(n) time.', penalty: 8 }
    ],
    points: 20,
    timeLimitSeconds: 70
  },
  {
    id: 'algo-rec-35',
    title: 'Permutations Backtracking State Management',
    mode: 'quick-solve',
    topic: 'Recursion & Backtracking',
    difficulty: 'Intermediate',
    language: 'Python',
    problemStatement:
      'Given an array nums of distinct integers, return all the possible permutations. What is the standard backtracking pattern to construct paths without duplicates?',
    constraints: ['1 <= nums.length <= 6', '-10 <= nums[i] <= 10', 'All the integers of nums are unique.'],
    examples: [
      { input: 'nums = [1,2,3]', output: '[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]' }
    ],
    options: [
      {
        id: 'opt-a',
        label: 'Choose candidate -> Recurse -> Backtrack (undo choice)',
        codeSnippet: `def backtrack(path, used):\n    if len(path) == len(nums):\n        res.append(path[:])\n        return\n    for i in range(len(nums)):\n        if used[i]: continue\n        used[i] = True\n        path.append(nums[i])\n        backtrack(path, used)\n        path.pop()       # Undo choice\n        used[i] = False  # Undo choice`,
        explanation: 'Backtracking explores decisions depth-first and systematically reverts changes (popping path, clearing used flag) to explore alternative branches.',
        isCorrect: true
      },
      {
        id: 'opt-b',
        label: 'Sort the array and take prefix slices',
        explanation: 'Sorting produces only 1 ordered slice, not all permutations.',
        isCorrect: false
      },
      {
        id: 'opt-c',
        label: 'Randomly shuffle array until n! unique arrays are gathered',
        explanation: 'Las Vegas randomized shuffling is non-deterministic and asymptotically horrible.',
        isCorrect: false
      },
      {
        id: 'opt-d',
        label: 'Nested loops for every element',
        explanation: 'Nested loops require hardcoded depth, which cannot handle dynamic input sizes.',
        isCorrect: false
      }
    ],
    correctOptionId: 'opt-a',
    detailedExplanation:
      'Backtracking follows a universal 3-step paradigm: 1) Make a choice (append element to path, mark used). 2) Explore recursively (call backtrack). 3) Undo the choice (pop from path, unmark used). This state restoration enables exploring all n! permutations using a single shared path buffer.',
    optimalApproach: 'Depth-first recursive backtracking with state unmaking.',
    timeComplexity: 'O(n * n!)',
    spaceComplexity: 'O(n) recursion stack',
    commonPitfall: 'Appending `path` instead of `path[:]` (shallow copy) in Python, resulting in a list of empty arrays.',
    interviewTip: 'Mention that swap-based permutation generation avoids the `used` array entirely in O(1) extra space.',
    pattern: 'Recursion & Backtracking',
    hints: [
      { text: 'Think about the decision tree for building a sequence.', penalty: 3 },
      { text: 'When returning from recursion, you must restore the state so other branches can use that number.', penalty: 5 },
      { text: 'path.pop() and unmarking used is the classic backtrack step.', penalty: 8 }
    ],
    points: 20,
    timeLimitSeconds: 70
  },
  {
    id: 'algo-rec-36',
    title: 'N-Queens Constraints Checking',
    mode: 'pattern-match',
    topic: 'Recursion & Backtracking',
    difficulty: 'Advanced',
    language: 'Language-Independent',
    problemStatement:
      'The n-queens puzzle is the problem of placing n queens on an n x n chessboard such that no two queens attack each other. Which technique allows O(1) validity checking for diagonals instead of scanning the board?',
    constraints: ['1 <= n <= 9'],
    options: [
      { id: 'opt-a', label: 'Hash Sets or Boolean Arrays for cols, (row - col) diagonals, and (row + col) anti-diagonals', explanation: 'All cells on a diagonal have constant (row - col), and all cells on an anti-diagonal have constant (row + col). Checking set membership takes O(1).', isCorrect: true },
      { id: 'opt-b', label: 'Scanning all 8 directions on the 2D matrix', explanation: 'Directional scanning takes O(n) per queen placement check.', isCorrect: false },
      { id: 'opt-c', label: 'Dynamic Programming memoization table', explanation: 'Chessboard configurations cannot be simply memoized as overlapping subproblems.', isCorrect: false },
      { id: 'opt-d', label: 'Breadth First Search', explanation: 'BFS would maintain a massive queue of incomplete boards, exhausting memory.', isCorrect: false }
    ],
    correctOptionId: 'opt-a',
    detailedExplanation:
      'For any cell (r, c) on a grid: 1) Column is c. 2) Main diagonal from top-left to bottom-right has constant difference: r - c. 3) Anti-diagonal from top-right to bottom-left has constant sum: r + c. Tracking placed queens in three boolean sets `cols`, `diag1`, `diag2` enables O(1) safety verification.',
    optimalApproach: 'Backtracking with O(1) mathematical diagonal sets.',
    timeComplexity: 'O(n!)',
    spaceComplexity: 'O(n) auxiliary space for sets and board',
    commonPitfall: 'Scanning the board diagonally in nested while loops, adding an unnecessary O(n) factor to each state.',
    interviewTip: 'Bitmasking takes this even further: represent cols, diag1, diag2 as 3 integers and use bitwise operations.',
    pattern: 'Recursion & Backtracking',
    hints: [
      { text: 'Observe the mathematical relationship between row and column indices on diagonals.', penalty: 5 },
      { text: 'Along any main diagonal, row - col is constant.', penalty: 8 },
      { text: 'Along any anti-diagonal, row + col is constant.', penalty: 10 }
    ],
    points: 30,
    timeLimitSeconds: 85
  },

  // ==========================================
  // GREEDY ALGORITHMS (37-39)
  // ==========================================
  {
    id: 'algo-greedy-37',
    title: 'Non-overlapping Intervals Greedy Criterion',
    mode: 'pattern-match',
    topic: 'Greedy Algorithms',
    difficulty: 'Intermediate',
    language: 'Language-Independent',
    problemStatement:
      'Given an array of intervals intervals where intervals[i] = [starti, endi], return the minimum number of intervals you need to remove to make the rest of the intervals non-overlapping. Which greedy sorting criterion is mathematically optimal?',
    constraints: ['1 <= intervals.length <= 10^5', 'intervals[i].length == 2', '-5 * 10^4 <= starti < endi <= 5 * 10^4'],
    examples: [
      { input: 'intervals = [[1,2],[2,3],[3,4],[1,3]]', output: '1', explanation: '[1,3] can be removed and the rest of the intervals are non-overlapping.' },
      { input: 'intervals = [[1,2],[1,2],[1,2]]', output: '2' }
    ],
    options: [
      { id: 'opt-a', label: 'Sort intervals by end time ascending; greedily pick the one that finishes earliest', explanation: 'An interval that finishes early leaves maximum possible room for subsequent intervals to fit without conflict.', isCorrect: true },
      { id: 'opt-b', label: 'Sort intervals by start time ascending', explanation: 'An interval starting early could be arbitrarily long (e.g. [0, 100]), blocking many shorter intervals.', isCorrect: false },
      { id: 'opt-c', label: 'Sort intervals by interval length (end - start) ascending', explanation: 'Short intervals located in the middle can conflict with two disjoint intervals on left and right.', isCorrect: false },
      { id: 'opt-d', label: 'Remove intervals with highest number of overlaps first', explanation: 'Computing full intersection graphs takes O(n^2) and is not guaranteed to be optimal.', isCorrect: false }
    ],
    correctOptionId: 'opt-a',
    detailedExplanation:
      'This is the classic Activity Selection Problem. Minimizing removals is equivalent to maximizing the number of compatible non-overlapping intervals. By sorting by end time, the interval that ends first frees up the timeline earliest, leaving maximum remaining time for subsequent intervals.',
    optimalApproach: 'Greedy activity selection sorted by end time.',
    timeComplexity: 'O(n log n) due to sorting',
    spaceComplexity: 'O(1) or O(log n) sorting space',
    commonPitfall: 'Sorting by start time instead of end time.',
    interviewTip: 'State the duality: "Minimizing intervals to remove is identical to maximizing non-overlapping intervals (Activity Selection)".',
    pattern: 'Greedy Algorithms',
    hints: [
      { text: 'Think about when a meeting finishes.', penalty: 3 },
      { text: 'If a meeting finishes earlier, does it leave more or less room for future meetings?', penalty: 5 },
      { text: 'Sort by end time ascending.', penalty: 8 }
    ],
    points: 20,
    timeLimitSeconds: 70
  },
  {
    id: 'algo-greedy-38',
    title: 'Jump Game Reachability Condition',
    mode: 'quick-solve',
    topic: 'Greedy Algorithms',
    difficulty: 'Intermediate',
    language: 'JavaScript',
    problemStatement:
      'You are given an integer array nums. You are initially positioned at the array’s first index, and each element in the array represents your maximum jump length at that position. Return true if you can reach the last index. What is the optimal O(n) greedy invariant?',
    constraints: ['1 <= nums.length <= 10^4', '0 <= nums[i] <= 10^5'],
    examples: [
      { input: 'nums = [2,3,1,1,4]', output: 'true', explanation: 'Jump 1 step from index 0 to 1, then 3 steps to the last index.' },
      { input: 'nums = [3,2,1,0,4]', output: 'false', explanation: 'You will always arrive at index 3 no matter what. Its maximum jump length is 0, which makes it impossible to reach the last index.' }
    ],
    options: [
      {
        id: 'opt-a',
        label: 'Maintain max_reachable index; if current index > max_reachable, return false; update max_reachable = max(max_reachable, i + nums[i])',
        codeSnippet: `let maxReach = 0;\nfor (let i = 0; i < nums.length; i++) {\n  if (i > maxReach) return false;\n  maxReach = Math.max(maxReach, i + nums[i]);\n  if (maxReach >= nums.length - 1) return true;\n}\nreturn true;`,
        explanation: 'At each index i, if i is within reach, we extend the maximum horizon we can ever reach to max(maxReach, i + nums[i]).',
        isCorrect: true
      },
      {
        id: 'opt-b',
        label: 'Always jump the maximum possible distance nums[i]',
        explanation: 'Fails! For [2,3,1,1,4], jumping max distance 2 from 0 lands on index 2 (value 1) instead of index 1 (value 3).',
        isCorrect: false
      },
      {
        id: 'opt-c',
        label: 'Recursively explore all jump branches without memoization',
        explanation: 'Explores an exponential O(2^n) decision tree, which completely freezes for n = 10,000.',
        isCorrect: false
      },
      {
        id: 'opt-d',
        label: 'Check if there are no zeros in the array',
        explanation: 'Zeros can easily be jumped over (e.g., [2, 0, 0] can reach index 2 from 0).',
        isCorrect: false
      }
    ],
    correctOptionId: 'opt-a',
    detailedExplanation:
      'Instead of deciding exact jump paths, track the furthest boundary reachable so far. As you iterate i from 0 to n-1: if i > maxReach, you have hit an unreachable gap, so return false. Otherwise, update maxReach = max(maxReach, i + nums[i]). If maxReach >= n - 1, return true.',
    optimalApproach: 'Greedy maximum horizon expansion.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    commonPitfall: 'Greedily jumping nums[i] every time instead of maintaining the maximum reach horizon.',
    interviewTip: 'You can also solve this backwards: maintain the last valid index that can reach the end, shifting target leftward.',
    pattern: 'Greedy Algorithms',
    hints: [
      { text: 'You do not need to determine the exact jump sequence, just the furthest point reachable.', penalty: 3 },
      { text: 'If your current index exceeds the furthest reachable point, you are stuck.', penalty: 5 },
      { text: 'Keep updating maxReach = max(maxReach, i + nums[i]).', penalty: 8 }
    ],
    points: 20,
    timeLimitSeconds: 70
  },
  {
    id: 'algo-greedy-39',
    title: 'Gas Station Circular Tour Invariant',
    mode: 'rush-ladder',
    topic: 'Greedy Algorithms',
    difficulty: 'Advanced',
    language: 'Python',
    problemStatement:
      'There are n gas stations along a circular route, where the amount of gas at the ith station is gas[i]. Traveling from station i to i + 1 costs cost[i]. Return the starting gas station index if you can travel around the circuit once in the clockwise direction, otherwise return -1.',
    constraints: ['n == gas.length == cost.length', '1 <= n <= 10^5', '0 <= gas[i], cost[i] <= 10^4'],
    examples: [
      { input: 'gas = [1,2,3,4,5], cost = [3,4,5,1,2]', output: '3', explanation: 'Start at station 3 (index 3). Total gas collected allows full circular completion.' }
    ],
    options: [
      {
        id: 'opt-a',
        label: 'If sum(gas) < sum(cost), impossible (-1). Otherwise, if tank drops below 0 at station i, reset start to i + 1',
        codeSnippet: `if sum(gas) < sum(cost): return -1\ntotal_tank, curr_tank, start = 0, 0, 0\nfor i in range(len(gas)):\n    curr_tank += gas[i] - cost[i]\n    if curr_tank < 0:\n        start = i + 1\n        curr_tank = 0\nreturn start`,
        explanation: 'If a car starting at A fails at B, NO station between A and B can reach B either, because the car arrived at those stations with non-negative surplus gas.',
        isCorrect: true
      },
      {
        id: 'opt-b',
        label: 'Simulate starting from every station 0 to n-1 in full circles',
        explanation: 'Simulating n stations for n steps takes O(n^2) time, which times out for n = 100,000.',
        isCorrect: false
      },
      {
        id: 'opt-c',
        label: 'Always start at the station with the maximum gas[i]',
        explanation: 'The highest gas station might be immediately followed by an even higher cost, causing immediate stall.',
        isCorrect: false
      },
      {
        id: 'opt-d',
        label: 'Sort gas and cost arrays',
        explanation: 'Sorting destroys circular topological station order.',
        isCorrect: false
      }
    ],
    correctOptionId: 'opt-a',
    detailedExplanation:
      'Two mathematical theorems solve this: 1) If sum(gas) >= sum(cost), a valid starting station is guaranteed to exist. 2) If starting at index A causes the tank to go negative at index B, NO station k between A and B (A <= k <= B) can be the start either, because the car arrived at k with tank >= 0 and still failed at B. Thus, we safely jump start to B + 1 in a single O(n) pass.',
    optimalApproach: 'Greedy single-pass with failure jump.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    commonPitfall: 'Testing all starting points with quadratic simulation.',
    interviewTip: 'Explicitly state the proof of why start can jump to i + 1 when curr_tank < 0.',
    pattern: 'Greedy Algorithms',
    hints: [
      { text: 'First check if total gas available is at least total cost required.', penalty: 5 },
      { text: 'If starting at A fails at B, could starting at any station between A and B succeed?', penalty: 8 },
      { text: 'No, because you reached them with >= 0 gas and still failed. Reset start to B + 1.', penalty: 10 }
    ],
    points: 30,
    timeLimitSeconds: 85
  },

  // ==========================================
  // DYNAMIC PROGRAMMING (40-42)
  // ==========================================
  {
    id: 'algo-dp-40',
    title: 'Climbing Stairs State Transition',
    mode: 'quick-solve',
    topic: 'Dynamic Programming',
    difficulty: 'Beginner',
    language: 'Java',
    problemStatement:
      'You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?',
    constraints: ['1 <= n <= 45'],
    examples: [
      { input: 'n = 2', output: '2', explanation: '1 step + 1 step, or 2 steps.' },
      { input: 'n = 3', output: '3', explanation: '1+1+1, 1+2, or 2+1.' }
    ],
    options: [
      {
        id: 'opt-a',
        label: 'dp[i] = dp[i-1] + dp[i-2] with base cases dp[1] = 1, dp[2] = 2 (Fibonacci sequence)',
        codeSnippet: `if (n <= 2) return n;\nint prev2 = 1, prev1 = 2;\nfor (int i = 3; i <= n; i++) {\n    int curr = prev1 + prev2;\n    prev2 = prev1;\n    prev1 = curr;\n}\nreturn prev1;`,
        explanation: 'To reach step i, you could only have come from step i-1 (by taking 1 step) or step i-2 (by taking 2 steps).',
        isCorrect: true
      },
      {
        id: 'opt-b',
        label: 'dp[i] = dp[i-1] * dp[i-2]',
        explanation: 'Independent ways to reach preceding steps are added, not multiplied.',
        isCorrect: false
      },
      {
        id: 'opt-c',
        label: 'dp[i] = 1 + Math.min(dp[i-1], dp[i-2])',
        explanation: 'That computes minimum steps to reach the end, not number of distinct paths.',
        isCorrect: false
      },
      {
        id: 'opt-d',
        label: 'Return 2^n',
        explanation: 'Overcounts invalid combinations where step sizes do not sum to n.',
        isCorrect: false
      }
    ],
    correctOptionId: 'opt-a',
    detailedExplanation:
      'Any valid sequence of steps ending at stair i must make its final move from either stair i - 1 (a 1-step move) or stair i - 2 (a 2-step move). Therefore, ways(i) = ways(i - 1) + ways(i - 2). This is isomorphic to the Fibonacci sequence, computable in O(n) time and O(1) space with two variables.',
    optimalApproach: 'Bottom-up dynamic programming with rolling state variables.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    commonPitfall: 'Using unmemoized recursion `climbStairs(n-1) + climbStairs(n-2)` which blows up exponentially to O(2^n).',
    interviewTip: 'Connect this directly to combinatorics and Pascal’s triangle.',
    pattern: 'Dynamic Programming',
    hints: [
      { text: 'How could you possibly land on step n?', penalty: 2 },
      { text: 'Only by stepping from n-1 or n-2.', penalty: 3 },
      { text: 'Therefore, ways(n) = ways(n-1) + ways(n-2).', penalty: 5 }
    ],
    points: 10,
    timeLimitSeconds: 60
  },
  {
    id: 'algo-dp-41',
    title: 'Coin Change Fewest Coins Complexity',
    mode: 'complexity-clash',
    topic: 'Dynamic Programming',
    difficulty: 'Intermediate',
    language: 'Language-Independent',
    problemStatement:
      'Given an integer array coins representing coins of different denominations and an integer amount, compute the fewest number of coins needed to make up that amount. What are the time and space complexities of the 1D bottom-up DP table?',
    codeSnippet: `dp = [infinity] * (amount + 1)
dp[0] = 0
for a in range(1, amount + 1):
    for c in coins:
        if a - c >= 0:
            dp[a] = min(dp[a], 1 + dp[a - c])
return dp[amount] if dp[amount] != infinity else -1`,
    constraints: ['1 <= coins.length <= 12', '1 <= coins[i] <= 2^31 - 1', '0 <= amount <= 10^4'],
    examples: [
      { input: 'coins = [1,2,5], amount = 11', output: '3', explanation: '11 = 5 + 5 + 1 (3 coins)' }
    ],
    options: [
      { id: 'opt-a', label: 'Time: O(amount * len(coins)), Space: O(amount)', explanation: 'Outer loop runs amount times; inner loop iterates len(coins) times. DP array of size amount + 1 stores fewest coins.', isCorrect: true },
      { id: 'opt-b', label: 'Time: O(amount^2), Space: O(amount^2)', explanation: 'Only a 1D array of size amount is needed, and inner loop is bounded by number of coins, not amount.', isCorrect: false },
      { id: 'opt-c', label: 'Time: O(len(coins) * log(amount)), Space: O(1)', explanation: 'Subproblems cannot be skipped with binary search.', isCorrect: false },
      { id: 'opt-d', label: 'Time: O(2^amount), Space: O(amount)', explanation: '2^amount is naive recursion; dynamic programming memoization reduces it to polynomial time.', isCorrect: false }
    ],
    correctOptionId: 'opt-a',
    detailedExplanation:
      'For each sub-amount a from 1 to `amount`, we test every coin denomination c. If a - c >= 0, dp[a] = min(dp[a], 1 + dp[a - c]). The outer loop executes `amount` times, and the inner loop executes `len(coins)` times. Hence time complexity is O(amount * len(coins)) and space is O(amount).',
    optimalApproach: 'Bottom-up 1D Dynamic Programming.',
    timeComplexity: 'O(amount * len(coins))',
    spaceComplexity: 'O(amount)',
    commonPitfall: 'Assuming a greedy approach works (taking largest coin first). Greedy fails for coins = [1, 3, 4] and amount = 6: greedy picks 4 + 1 + 1 (3 coins), whereas DP finds 3 + 3 (2 coins).',
    interviewTip: 'Always give a counterexample showing why greedy fails on arbitrary coin systems.',
    pattern: 'Dynamic Programming',
    hints: [
      { text: 'Look at the bounds of the two nested loops.', penalty: 3 },
      { text: 'Outer loop goes from 1 to amount; inner loop checks each coin.', penalty: 5 },
      { text: 'Array dp has size amount + 1.', penalty: 8 }
    ],
    points: 20,
    timeLimitSeconds: 70
  },
  {
    id: 'algo-dp-42',
    title: 'Longest Increasing Subsequence Patience Sorting Pattern',
    mode: 'pattern-match',
    topic: 'Dynamic Programming',
    difficulty: 'Advanced',
    language: 'Language-Independent',
    problemStatement:
      'Given an integer array nums, return the length of the longest strictly increasing subsequence. Which advanced algorithm optimizes this from standard O(n^2) DP down to O(n log n) runtime?',
    constraints: ['1 <= nums.length <= 2500', '-10^4 <= nums[i] <= 10^4'],
    examples: [
      { input: 'nums = [10,9,2,5,3,7,101,18]', output: '4', explanation: 'The longest increasing subsequence is [2,3,7,101], length 4.' }
    ],
    options: [
      { id: 'opt-a', label: 'Patience Sorting / Binary Search (tails array with bisect_left)', explanation: 'Maintains tails array where tails[i] is smallest tail of all increasing subsequences of length i+1. Binary search finds insertion position in O(log n).', isCorrect: true },
      { id: 'opt-b', label: 'Two Pointers from ends', explanation: 'Subsequences are not contiguous subarrays, so two pointers cannot track non-adjacent leaps.', isCorrect: false },
      { id: 'opt-c', label: 'Monotonic Queue', explanation: 'Monotonic queues solve sliding window bounds, not arbitrary scattered subsequences.', isCorrect: false },
      { id: 'opt-d', label: 'Breadth First Search', explanation: 'BFS on all subsets explodes exponentially to O(2^n).', isCorrect: false }
    ],
    correctOptionId: 'opt-a',
    detailedExplanation:
      'Standard DP computes `dp[i] = max(dp[j] + 1)` for j < i in O(n^2). The O(n log n) Patience Sorting algorithm maintains an array `tails`. For each number x in nums: binary search for x in `tails`. If x is greater than all elements in tails, append it (extending max length). Otherwise, replace the first element >= x with x. The length of tails is the LIS length.',
    optimalApproach: 'Patience Sorting with Binary Search.',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(n)',
    commonPitfall: 'Believing that `tails` contains the actual LIS elements; tails only accurately tracks the *length* of the LIS, not its specific elements.',
    interviewTip: 'Mention both the intuitive O(n^2) DP approach and the O(n log n) Patience Sorting optimization.',
    pattern: 'Dynamic Programming',
    hints: [
      { text: 'Standard DP checks all previous elements in O(n^2).', penalty: 5 },
      { text: 'Can we maintain an array of the smallest tail elements of each subsequence length?', penalty: 8 },
      { text: 'Because the tails array is strictly sorted, you can binary search it in O(log n).', penalty: 10 }
    ],
    points: 30,
    timeLimitSeconds: 85
  }
];
