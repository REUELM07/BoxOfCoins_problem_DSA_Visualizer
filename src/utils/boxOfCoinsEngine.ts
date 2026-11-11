import { TraceStep } from '../types/boxOfCoins';

export interface CodeLineInfo {
  lineNumber: number;
  text: string;
  isComment?: boolean;
  explanation?: string;
}

export const CSHARP_CODE_LINES: CodeLineInfo[] = [
  { lineNumber: 1, text: "namespace BoxOfCoins" },
  { lineNumber: 2, text: "{" },
  { lineNumber: 3, text: "    public class BoxOfCoins" },
  { lineNumber: 4, text: "    {" },
  { lineNumber: 5, text: "        public static int Solve(int[] boxes)" },
  { lineNumber: 6, text: "        {" },
  { lineNumber: 7, text: "            // creating an array to store the best score difference for each range of boxes", isComment: true },
  { lineNumber: 8, text: "            int[] bestDifference = new int[boxes.Length];", explanation: "Allocates 1D array of length N. In-place space optimization for interval DP." },
  { lineNumber: 9, text: "" },
  { lineNumber: 10, text: "            // if only one box, current player takes it. Score difference is simply that box's value", isComment: true },
  { lineNumber: 11, text: "            for (int boxIndex = 0; boxIndex < boxes.Length; boxIndex++)", explanation: "Base cases: length 1 ranges. Each single box [i .. i]." },
  { lineNumber: 12, text: "            {" },
  { lineNumber: 13, text: "                bestDifference[boxIndex] = boxes[boxIndex];", explanation: "For a single box, taking it leaves 0 for the opponent, so net gain is boxes[boxIndex]." },
  { lineNumber: 14, text: "            }" },
  { lineNumber: 15, text: "" },
  { lineNumber: 16, text: "            // Now, start by checking ranges of 2 boxes, then 3 boxes, up to boxes.Length", isComment: true },
  { lineNumber: 17, text: "            for (int rangeLength = 2; rangeLength <= boxes.Length; rangeLength++)", explanation: "Outer loop: increases window size. Builds subproblems from smaller to larger." },
  { lineNumber: 18, text: "            {" },
  { lineNumber: 19, text: "                // moving through the boxes to check each possible range of current length", isComment: true },
  { lineNumber: 20, text: "                for (int leftIndex = 0; leftIndex <= boxes.Length - rangeLength; leftIndex++)", explanation: "Inner loop: slides the window of length rangeLength across the boxes array." },
  { lineNumber: 21, text: "                {" },
  { lineNumber: 22, text: "                    // Finding exact position of the last box in current range", isComment: true },
  { lineNumber: 23, text: "                    int rightIndex = leftIndex + rangeLength - 1;", explanation: "Calculates right boundary: right = left + length - 1." },
  { lineNumber: 24, text: "" },
  { lineNumber: 25, text: "                    // If current player takes left box, opponent gets range [left+1 .. right]", isComment: true },
  { lineNumber: 26, text: "                    int takeLeft = boxes[leftIndex] - bestDifference[leftIndex + 1];", explanation: "Option A: Take left box! Net score = boxes[left] MINUS opponent's optimal advantage from remaining range." },
  { lineNumber: 27, text: "" },
  { lineNumber: 28, text: "                    // If current player takes right box, opponent gets range [left .. right-1]", isComment: true },
  { lineNumber: 29, text: "                    int takeRight = boxes[rightIndex] - bestDifference[leftIndex];", explanation: "Option B: Take right box! Net score = boxes[right] MINUS opponent's optimal advantage from remaining range." },
  { lineNumber: 30, text: "" },
  { lineNumber: 31, text: "                    // Both choices checked and the best score is chosen", isComment: true },
  { lineNumber: 32, text: "                    bestDifference[leftIndex] = Math.Max(takeLeft, takeRight);", explanation: "Picks the choice that maximizes the net difference: max(takeLeft, takeRight)." },
  { lineNumber: 33, text: "                }" },
  { lineNumber: 34, text: "            }" },
  { lineNumber: 35, text: "" },
  { lineNumber: 36, text: "            // After all ranges, index 0 stores the best score difference for entire row", isComment: true },
  { lineNumber: 37, text: "            return bestDifference[0];", explanation: "Returns the global optimal score difference (Alex Total - Cindy Total) for range [0 .. N-1]." },
  { lineNumber: 38, text: "        }" },
  { lineNumber: 39, text: "    }" },
  { lineNumber: 40, text: "}" }
];

export function solveDirect(boxes: number[]): number {
  if (boxes.length === 0) return 0;
  const bestDifference: number[] = new Array(boxes.length);

  for (let boxIndex = 0; boxIndex < boxes.length; boxIndex++) {
    bestDifference[boxIndex] = boxes[boxIndex];
  }

  for (let rangeLength = 2; rangeLength <= boxes.length; rangeLength++) {
    for (let leftIndex = 0; leftIndex <= boxes.length - rangeLength; leftIndex++) {
      const rightIndex = leftIndex + rangeLength - 1;
      const takeLeft = boxes[leftIndex] - bestDifference[leftIndex + 1];
      const takeRight = boxes[rightIndex] - bestDifference[leftIndex];
      bestDifference[leftIndex] = Math.max(takeLeft, takeRight);
    }
  }

  return bestDifference[0];
}

/**
 * Builds the complete 2D DP matrix for subranges [i][j]
 * dp[i][j] = maximum (player score - opponent score) for subarray boxes[i..j]
 */
export function build2DDPMatrix(boxes: number[]): number[][] {
  const n = boxes.length;
  const dp: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));

  for (let i = 0; i < n; i++) {
    dp[i][i] = boxes[i];
  }

  for (let len = 2; len <= n; len++) {
    for (let i = 0; i <= n - len; i++) {
      const j = i + len - 1;
      const takeLeft = boxes[i] - dp[i + 1][j];
      const takeRight = boxes[j] - dp[i][j - 1];
      dp[i][j] = Math.max(takeLeft, takeRight);
    }
  }

  return dp;
}

/**
 * Generates an exhaustive trace of all execution steps for visual step-by-step playback.
 */
export function generateExecutionTrace(boxes: number[]): TraceStep[] {
  const steps: TraceStep[] = [];
  const n = boxes.length;
  if (n === 0) return [];

  // Working copy of 1D array
  const bestDiff: number[] = new Array(n).fill(0);
  
  // Working copy of 2D matrix snapshot
  const dpMatrix: (number | null)[][] = Array.from({ length: n }, () => 
    new Array(n).fill(null)
  );

  function cloneMatrix(): (number | null)[][] {
    return dpMatrix.map(row => [...row]);
  }

  // Step 1: Array Initialization (Line 8)
  steps.push({
    stepIndex: steps.length,
    totalSteps: 0,
    codeLine: 8,
    phase: 'init',
    title: 'Initialize Array: bestDifference',
    explanation: `Create an array bestDifference of size ${n} to store the maximum score difference for each range.`,
    deepExplanation: `In traditional dynamic programming, a 2D matrix dp[N][N] is used where dp[i][j] stores the best score difference for boxes[i..j]. However, this code uses an ingenious space optimization: only a 1D array of size ${n} is needed because each range length only depends on the previous range length!`,
    rangeLength: null,
    leftIndex: null,
    rightIndex: null,
    takeLeft: null,
    takeRight: null,
    chosenScore: null,
    pickedChoice: null,
    bestDifference: [...bestDiff],
    boxes: [...boxes],
    highlightedBoxes: {},
    highlightedArrayIndices: {},
    dpMatrixSnapshot: cloneMatrix()
  });

  // Base cases: range length 1 (Lines 11-14)
  for (let boxIndex = 0; boxIndex < n; boxIndex++) {
    bestDiff[boxIndex] = boxes[boxIndex];
    dpMatrix[boxIndex][boxIndex] = boxes[boxIndex];

    steps.push({
      stepIndex: steps.length,
      totalSteps: 0,
      codeLine: 13,
      phase: 'base_case',
      title: `Base Case: Range of Length 1 at Index ${boxIndex}`,
      explanation: `bestDifference[${boxIndex}] = boxes[${boxIndex}] (${boxes[boxIndex]}).`,
      deepExplanation: `If only 1 box exists in range [${boxIndex} .. ${boxIndex}], the current player is forced to pick it. There are no remaining boxes for the opponent (opponent score = 0). Therefore, the net difference is: boxes[${boxIndex}] - 0 = ${boxes[boxIndex]}.`,
      rangeLength: 1,
      leftIndex: boxIndex,
      rightIndex: boxIndex,
      takeLeft: null,
      takeRight: null,
      chosenScore: boxes[boxIndex],
      pickedChoice: 'left',
      bestDifference: [...bestDiff],
      boxes: [...boxes],
      highlightedBoxes: { left: true, right: true, inRange: true },
      highlightedArrayIndices: { target: boxIndex },
      dpMatrixSnapshot: cloneMatrix()
    });
  }

  // Outer loop: rangeLength from 2 up to boxes.Length
  for (let rangeLength = 2; rangeLength <= n; rangeLength++) {
    for (let leftIndex = 0; leftIndex <= n - rangeLength; leftIndex++) {
      const rightIndex = leftIndex + rangeLength - 1;

      // 1. Step: Set Window (Lines 17, 20, 23)
      steps.push({
        stepIndex: steps.length,
        totalSteps: 0,
        codeLine: 23,
        phase: 'range_start',
        title: `Examine Range [${leftIndex} .. ${rightIndex}] (Length ${rangeLength})`,
        explanation: `Checking window of length ${rangeLength} from index ${leftIndex} to ${rightIndex}.`,
        deepExplanation: `We consider subgame with boxes: [${boxes.slice(leftIndex, rightIndex + 1).join(', ')}]. The current player has two moves: take the left box (${boxes[leftIndex]}) or take the right box (${boxes[rightIndex]}).`,
        rangeLength,
        leftIndex,
        rightIndex,
        takeLeft: null,
        takeRight: null,
        chosenScore: null,
        pickedChoice: null,
        bestDifference: [...bestDiff],
        boxes: [...boxes],
        highlightedBoxes: { left: true, right: true, inRange: true },
        highlightedArrayIndices: { target: leftIndex },
        dpMatrixSnapshot: cloneMatrix()
      });

      // 2. Step: Calculate takeLeft (Line 26)
      // takeLeft = boxes[leftIndex] - bestDifference[leftIndex + 1];
      // Note: bestDifference[leftIndex + 1] contains the optimal score difference for range [leftIndex + 1 .. rightIndex] (length rangeLength - 1)
      const opponentDiffIfTakeLeft = bestDiff[leftIndex + 1];
      const takeLeft = boxes[leftIndex] - opponentDiffIfTakeLeft;

      steps.push({
        stepIndex: steps.length,
        totalSteps: 0,
        codeLine: 26,
        phase: 'calc_take_left',
        title: `Option 1 (Take Left): Box [${leftIndex}] = ${boxes[leftIndex]}`,
        explanation: `takeLeft = boxes[${leftIndex}] - bestDifference[${leftIndex + 1}] = ${boxes[leftIndex]} - (${opponentDiffIfTakeLeft}) = ${takeLeft}`,
        deepExplanation: `If Alex takes left box [${leftIndex}] (value ${boxes[leftIndex]}), Cindy plays next on the remaining range [${leftIndex + 1} .. ${rightIndex}]. Cindy's optimal score advantage in that range is bestDifference[${leftIndex + 1}] = ${opponentDiffIfTakeLeft}. Subtracting Cindy's advantage from Alex's ${boxes[leftIndex]} gives Alex's net score difference of ${takeLeft}.`,
        rangeLength,
        leftIndex,
        rightIndex,
        takeLeft,
        takeRight: null,
        chosenScore: null,
        pickedChoice: null,
        bestDifference: [...bestDiff],
        boxes: [...boxes],
        highlightedBoxes: { left: true, inRange: true },
        highlightedArrayIndices: { target: leftIndex, readLeft: leftIndex + 1 },
        dpMatrixSnapshot: cloneMatrix()
      });

      // 3. Step: Calculate takeRight (Line 29)
      // takeRight = boxes[rightIndex] - bestDifference[leftIndex];
      // Note: bestDifference[leftIndex] currently holds the optimal score difference for range [leftIndex .. rightIndex - 1] (length rangeLength - 1)
      const opponentDiffIfTakeRight = bestDiff[leftIndex];
      const takeRight = boxes[rightIndex] - opponentDiffIfTakeRight;

      steps.push({
        stepIndex: steps.length,
        totalSteps: 0,
        codeLine: 29,
        phase: 'calc_take_right',
        title: `Option 2 (Take Right): Box [${rightIndex}] = ${boxes[rightIndex]}`,
        explanation: `takeRight = boxes[${rightIndex}] - bestDifference[${leftIndex}] = ${boxes[rightIndex]} - (${opponentDiffIfTakeRight}) = ${takeRight}`,
        deepExplanation: `If Alex takes right box [${rightIndex}] (value ${boxes[rightIndex]}), Cindy plays next on the remaining range [${leftIndex} .. ${rightIndex - 1}]. Because bestDifference[${leftIndex}] has not been overwritten yet for this length, it still holds the previous length's answer for range [${leftIndex} .. ${rightIndex - 1}]! Cindy's optimal advantage is ${opponentDiffIfTakeRight}. Alex's net difference is ${boxes[rightIndex]} - (${opponentDiffIfTakeRight}) = ${takeRight}.`,
        rangeLength,
        leftIndex,
        rightIndex,
        takeLeft,
        takeRight,
        chosenScore: null,
        pickedChoice: null,
        bestDifference: [...bestDiff],
        boxes: [...boxes],
        highlightedBoxes: { right: true, inRange: true },
        highlightedArrayIndices: { target: leftIndex, readRight: leftIndex },
        dpMatrixSnapshot: cloneMatrix()
      });

      // 4. Step: Math.Max and write into bestDifference[leftIndex] (Line 32)
      const maxVal = Math.max(takeLeft, takeRight);
      const choice: 'left' | 'right' | 'equal' = 
        takeLeft > takeRight ? 'left' : takeRight > takeLeft ? 'right' : 'equal';
      
      bestDiff[leftIndex] = maxVal;
      dpMatrix[leftIndex][rightIndex] = maxVal;

      steps.push({
        stepIndex: steps.length,
        totalSteps: 0,
        codeLine: 32,
        phase: 'choose_max',
        title: `Choose Best: Math.Max(${takeLeft}, ${takeRight}) = ${maxVal}`,
        explanation: `bestDifference[${leftIndex}] = Math.Max(${takeLeft}, ${takeRight}) = ${maxVal}. (${choice === 'equal' ? 'Either side gives equal score' : `Prefer ${choice.toUpperCase()} box`})`,
        deepExplanation: `Both outcomes are evaluated: taking Left yields ${takeLeft}, taking Right yields ${takeRight}. As a rational player maximizing net score advantage, Alex chooses ${maxVal}. We update bestDifference[${leftIndex}] = ${maxVal} for range [${leftIndex} .. ${rightIndex}].`,
        rangeLength,
        leftIndex,
        rightIndex,
        takeLeft,
        takeRight,
        chosenScore: maxVal,
        pickedChoice: choice,
        bestDifference: [...bestDiff],
        boxes: [...boxes],
        highlightedBoxes: { 
          left: choice === 'left' || choice === 'equal', 
          right: choice === 'right' || choice === 'equal', 
          inRange: true 
        },
        highlightedArrayIndices: { target: leftIndex },
        dpMatrixSnapshot: cloneMatrix()
      });
    }
  }

  // Final Step: return bestDifference[0] (Line 37)
  steps.push({
    stepIndex: steps.length,
    totalSteps: 0,
    codeLine: 37,
    phase: 'final_return',
    title: `Final Result: return bestDifference[0] = ${bestDiff[0]}`,
    explanation: `The optimal score difference for the entire array of boxes [0 .. ${n - 1}] is ${bestDiff[0]}.`,
    deepExplanation: `All ranges from length 1 up to ${n} have been solved bottom-up. The very first slot, bestDifference[0], now holds the maximum difference (Alex Score - Cindy Score) when both play optimally. ${
      bestDiff[0] > 0
        ? `Alex wins with a lead of +${bestDiff[0]} points!`
        : bestDiff[0] < 0
        ? `Cindy wins with a lead of +${Math.abs(bestDiff[0])} points!`
        : 'The game ends in an exact tie (0 difference)!'
    }`,
    rangeLength: n,
    leftIndex: 0,
    rightIndex: n - 1,
    takeLeft: null,
    takeRight: null,
    chosenScore: bestDiff[0],
    pickedChoice: null,
    bestDifference: [...bestDiff],
    boxes: [...boxes],
    highlightedBoxes: { inRange: true, left: true, right: true },
    highlightedArrayIndices: { target: 0 },
    dpMatrixSnapshot: cloneMatrix()
  });

  // Stamp totalSteps
  const total = steps.length;
  steps.forEach(s => { s.totalSteps = total; });

  return steps;
}

/**
 * Computes the optimal game move for the current remaining range [left .. right]
 */
export function getOptimalMove(boxes: number[], left: number, right: number): {
  choice: 'left' | 'right';
  leftValue: number;
  rightValue: number;
  takeLeftNet: number;
  takeRightNet: number;
} {
  const dp = build2DDPMatrix(boxes);
  if (left === right) {
    return {
      choice: 'left',
      leftValue: boxes[left],
      rightValue: boxes[right],
      takeLeftNet: boxes[left],
      takeRightNet: boxes[right]
    };
  }

  const takeLeft = boxes[left] - dp[left + 1][right];
  const takeRight = boxes[right] - dp[left][right - 1];

  return {
    choice: takeLeft >= takeRight ? 'left' : 'right',
    leftValue: boxes[left],
    rightValue: boxes[right],
    takeLeftNet: takeLeft,
    takeRightNet: takeRight
  };
}
