import { TestCase } from '../types/boxOfCoins';

export const ALL_TEST_CASES: TestCase[] = [
  {
    id: 0,
    boxes: [7, 2],
    expected: 5,
    label: "Case 0: [7, 2]",
    description: "Two boxes. Alex takes 7, Cindy takes 2. Net difference: 7 - 2 = 5.",
    difficulty: "beginner"
  },
  {
    id: 1,
    boxes: [2, 7, 3],
    expected: -2,
    label: "Case 1: [2, 7, 3] (Greedy Trap)",
    description: "Greedy trap! If Alex greedily takes 3, Cindy takes 7! Alex gets 2+3=5, Cindy gets 7. Diff: 5 - 7 = -2.",
    difficulty: "beginner"
  },
  {
    id: 2,
    boxes: [1000, 1000, 1000, 1000, 1000],
    expected: 1000,
    label: "Case 2: 5 identical 1000s",
    description: "Odd number of identical values. Alex gets 3 boxes (3000), Cindy gets 2 (2000). Net: 1000.",
    difficulty: "beginner"
  },
  {
    id: 3,
    boxes: [823, 912, 345, 100000, 867, 222, 991, 3, 40000],
    expected: -58111,
    label: "Case 3: High value in middle",
    description: "Huge 100,000 prize in the middle. Cindy secures it, resulting in negative difference for Alex.",
    difficulty: "intermediate"
  },
  {
    id: 4,
    boxes: [23, 35, 12, 100000, 99234, 86123, 3245],
    expected: -83644,
    label: "Case 4: Clustered large values (7 boxes)",
    description: "Odd length with massive values clustered. Second player dominates.",
    difficulty: "intermediate"
  },
  {
    id: 5,
    boxes: [23, 35, 12, 100000, 99234, 86123, 3245, 1],
    expected: 83645,
    label: "Case 5: Even length parity shift",
    description: "Adding 1 box to Case 4 flips parity completely! Alex wins by 83,645.",
    difficulty: "intermediate"
  },
  {
    id: 6,
    boxes: [7, 7, 7, 7, 7, 7, 80, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7],
    expected: -66,
    label: "Case 6: 47 sevens and one 80",
    description: "47 items of value 7 with an 80 at index 6. Cindy claims 80.",
    difficulty: "advanced"
  },
  {
    id: 7,
    boxes: [7, 7, 7, 7, 7, 7, 7, 80, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7],
    expected: 73,
    label: "Case 7: 48 sevens and one 80",
    description: "48 items of value 7 with an 80 at index 7. Parity shifts to Alex.",
    difficulty: "advanced"
  },
  {
    id: 8,
    boxes: [91, 56, 23, 45, 87, 65, 45, 45, 78, 23, 20, 41, 17, 54, 51, 51, 94, 62, 74, 42, 76, 76],
    expected: 96,
    label: "Case 8: 22 medium numbers",
    description: "Realistic randomized scores with multiple equal choices.",
    difficulty: "intermediate"
  },
  {
    id: 9,
    boxes: [92834, 95461, 15911, 56189, 6369, 80545, 31811, 51263, 30076, 68867, 36905, 32499, 59799, 334, 82991, 46636, 98741, 66601],
    expected: 42958,
    label: "Case 9: 18 large 5-digit numbers",
    description: "High variance numbers testing dynamic programming range propagation.",
    difficulty: "intermediate"
  },
  {
    id: 10,
    boxes: [129],
    expected: 129,
    label: "Case 10: Single box [129]",
    description: "Base case! Exactly 1 box. Alex takes it, Cindy gets 0. Net difference is 129.",
    difficulty: "beginner"
  },
  {
    id: 11,
    boxes: [35463, 88121, 4362, 94457, 86235, 83680, 72686, 6003, 93069, 2015, 10436, 2139, 93162, 30380, 19067, 76335, 78941, 48620, 55887, 15679],
    expected: 101879,
    label: "Case 11: 20 fluctuating values",
    description: "Even-length sequence with steep valuation peaks and valleys.",
    difficulty: "advanced"
  },
  {
    id: 12,
    boxes: [19335, 97643, 11468, 86267, 79718, 59584, 12129, 52642, 86575, 62307, 11545, 52658, 72377, 39986, 74850, 1992, 86928],
    expected: 1846,
    label: "Case 12: 17 values, close finish",
    description: "Odd-length sequence resulting in a razor-thin 1,846 margin.",
    difficulty: "advanced"
  },
  {
    id: 13,
    boxes: [91883, 97793, 54567, 64714, 98624],
    expected: 82567,
    label: "Case 13: 5 large numbers",
    description: "Compact 5-box high value array demonstrating Minimax defense.",
    difficulty: "intermediate"
  },
  {
    id: 14,
    boxes: [98473, 41866, 71129, 65936, 42626, 9194, 46718, 96921, 45613, 47677, 8763, 54634, 47259, 71448, 9918, 22666, 32711, 21692, 40207, 2017, 23040, 86083, 77809, 15472, 30718, 39085, 87911, 54827, 41686, 28354, 37203, 6548, 74184, 3043, 43961, 95189, 1238, 22002, 93507, 63546, 32527, 42778, 31614],
    expected: -14953,
    label: "Case 14: 43 random boxes",
    description: "Long game testing deep subproblem caching.",
    difficulty: "stress"
  },
  {
    id: 15,
    boxes: Array.from({ length: 50 }, (_, i) => i + 1),
    expected: 25,
    label: "Case 15: Natural numbers 1 to 50",
    description: "Consecutive integers 1, 2, ..., 50. Alex can force parity to gain +25.",
    difficulty: "intermediate"
  },
  {
    id: 16,
    boxes: Array.from({ length: 50 }, () => 1),
    expected: 0,
    label: "Case 16: Fifty 1s (Perfect Draw)",
    description: "50 equal coins of value 1. Both get 25. Net difference: 0.",
    difficulty: "beginner"
  },
  {
    id: 17,
    boxes: [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 11, 11, 11, 11, 111, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 112, 312, 312, 123, 123, 123, 123, 123, 123, 123, 123, 123, 123, 123, 123, 123, 123, 231, 31, 312],
    expected: 316,
    label: "Case 17: 50 skewed elements",
    description: "50 elements with repeated runs and sudden spikes.",
    difficulty: "stress"
  },
  {
    id: 18,
    boxes: [1234, 1233, 12, 312, 32, 23, 434, 12, 312, 45, 1234, 1233, 12, 312, 32, 23, 434, 12, 312, 45, 1234, 1233, 12, 312, 32, 23, 434, 12, 312, 45, 1234, 1233, 12, 312, 32, 23, 434, 12, 312, 45, 1234, 1233, 12, 312, 32, 23, 434, 12, 312, 45],
    expected: 1995,
    label: "Case 18: Repeated periodic patterns",
    description: "50 periodic repeating elements.",
    difficulty: "stress"
  },
  {
    id: 19,
    boxes: [1, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
    expected: 1,
    label: "Case 19: 34 numbers with long identical run",
    description: "Start with 1, 2, followed by 32 threes.",
    difficulty: "intermediate"
  },
  {
    id: 20,
    boxes: [9, 100, 1, 8],
    expected: 98,
    label: "Case 20: [9, 100, 1, 8] (Classic Interview)",
    description: "Famous textbook game: Alex chooses 8. Cindy must take 1 or 9, leaving 100 for Alex! Alex gets 108, Cindy gets 10. Net: 98.",
    difficulty: "beginner"
  },
  {
    id: 21,
    boxes: [1, 2, 3, 4, 5, 6, 7, 8, 9, 8, 7, 66, 5, 4, 3, 4, 5, 6, 7, 8, 9, 8, 7, 6, 6, 5, 4, 5, 6, 3, 4, 4, 5, 6, 3, 4, 5, 6, 3, 4, 5, 6, 3, 4, 5, 6, 3, 4, 5, 6],
    expected: 68,
    label: "Case 21: 50 undulating values",
    description: "Wave-like array of 50 numbers.",
    difficulty: "stress"
  },
  {
    id: 22,
    boxes: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3, 4, 5, 1, 2, 3, 4, 65, 67, 2, 3, 4, 7, 2, 3, 4, 6, 6, 7, 2, 3, 4, 7, 78, 8, 82, 2, 3, 4, 7, 2, 2, 34, 4, 6, 7, 3, 2],
    expected: 128,
    label: "Case 22: 50 multi-peak items",
    description: "Complex multi-peak landscape of 50 values.",
    difficulty: "stress"
  },
  {
    id: 23,
    boxes: [100, 10, 10],
    expected: 100,
    label: "Case 23: [100, 10, 10]",
    description: "Alex takes 100, Cindy takes 10, Alex takes 10. Alex: 110, Cindy: 10. Net: 100.",
    difficulty: "beginner"
  },
  {
    id: 24,
    boxes: [1],
    expected: 1,
    label: "Case 24: Single item [1]",
    description: "Simplest base case. 1 box with value 1.",
    difficulty: "beginner"
  },
  {
    id: 25,
    boxes: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 2, 4, 3, 5, 4, 6, 7, 5, 6, 10, 2, 5, 4, 3, 4, 5, 6, 7, 9, 10],
    expected: 28,
    label: "Case 25: 50 digits pattern",
    description: "Cycles of 1..10 followed by random digits.",
    difficulty: "stress"
  },
  {
    id: 26,
    boxes: [6, 4, 3, 5, 8, 8],
    expected: 2,
    label: "Case 26: [6, 4, 3, 5, 8, 8]",
    description: "Six boxes with duplicate top values at the right edge.",
    difficulty: "intermediate"
  },
  {
    id: 27,
    boxes: [1, 5, 20, 2, 1],
    expected: -13,
    label: "Case 27: [1, 5, 20, 2, 1]",
    description: "Odd length 5 with 20 trapped in center. Cindy forces the 20.",
    difficulty: "intermediate"
  },
  {
    id: 28,
    boxes: [1, 2, 3, 4, 5, 6, 6, 7, 8, 767, 765, 111, 76576, 5, 64, 654, 64, 7, 7657, 76575, 64, 65, 6454, 64, 654, 65464, 7, 5435, 65, 746, 7, 546, 7, 654, 7, 5435, 547, 6, 6, 7, 6547, 7654, 6, 754, 54353, 65, 7, 8],
    expected: 118231,
    label: "Case 28: 48 huge elements",
    description: "Maximum complexity test case from generator.",
    difficulty: "stress"
  },
  {
    id: 29,
    boxes: [4, 9, 2, 7],
    expected: 10,
    label: "Case 29: [4, 9, 2, 7] (Ideal Teaching Demo)",
    description: "Clean 4-box sequence. Alex takes 7, forcing Cindy to take 2 or 4. Alex then takes 9. Alex: 7+9=16, Cindy: 4+2=6. Net: 16 - 6 = 10.",
    difficulty: "beginner"
  },
  {
    id: 30,
    boxes: [5, 5, 5, 5],
    expected: 0,
    label: "Case 30: [5, 5, 5, 5] (Even Draw)",
    description: "Four identical boxes. Both players obtain 10. Net difference: 0.",
    difficulty: "beginner"
  },
  {
    id: 31,
    boxes: [10, 1, 1],
    expected: 10,
    label: "Case 31: [10, 1, 1]",
    description: "Alex takes 10 immediately! Cindy takes 1, Alex takes 1. Alex: 11, Cindy: 1. Net: 10.",
    difficulty: "beginner"
  }
];

export const POPULAR_PRESETS = [
  ALL_TEST_CASES[29], // [4, 9, 2, 7]
  ALL_TEST_CASES[1],  // [2, 7, 3]
  ALL_TEST_CASES[20], // [9, 100, 1, 8]
  ALL_TEST_CASES[0],  // [7, 2]
  ALL_TEST_CASES[27], // [1, 5, 20, 2, 1]
  ALL_TEST_CASES[31], // [10, 1, 1]
];
