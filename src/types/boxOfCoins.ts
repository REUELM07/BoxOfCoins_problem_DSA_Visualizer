export type StepPhase = 
  | 'init'
  | 'base_case'
  | 'range_start'
  | 'calc_take_left'
  | 'calc_take_right'
  | 'choose_max'
  | 'final_return';

export interface TraceStep {
  stepIndex: number;
  totalSteps: number;
  codeLine: number; // 1-indexed matching the C# code
  phase: StepPhase;
  title: string;
  explanation: string;
  deepExplanation: string;
  
  // Variables at this moment
  rangeLength: number | null;
  leftIndex: number | null;
  rightIndex: number | null;
  
  // Calculations
  takeLeft: number | null;
  takeRight: number | null;
  chosenScore: number | null;
  pickedChoice: 'left' | 'right' | 'equal' | null;
  
  // Array states
  bestDifference: number[];
  boxes: number[];
  
  // Visual highlights
  highlightedBoxes: {
    left?: boolean;
    right?: boolean;
    inRange?: boolean;
  };
  highlightedArrayIndices: {
    target?: number; // being written to
    readLeft?: number; // read for takeLeft
    readRight?: number; // read for takeRight
  };
  
  // 2D DP matrix state snapshot (for dual-view)
  dpMatrixSnapshot?: (number | null)[][];
}

export interface TestCase {
  id: number;
  boxes: number[];
  expected: number;
  label: string;
  description: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced' | 'stress';
}

export interface GameMove {
  player: 'Alex' | 'Cindy';
  choice: 'left' | 'right';
  boxIndex: number;
  boxValue: number;
  alexScoreAfter: number;
  cindyScoreAfter: number;
  remainingBoxes: number[];
  wasOptimal: boolean;
  optimalChoice: 'left' | 'right';
}

export interface GameState {
  originalBoxes: number[];
  leftIndex: number;
  rightIndex: number;
  alexScore: number;
  cindyScore: number;
  currentTurn: 'Alex' | 'Cindy';
  history: GameMove[];
  isGameOver: boolean;
  winner: 'Alex' | 'Cindy' | 'Tie' | null;
}
