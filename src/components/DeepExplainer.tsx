import React, { useState } from 'react';
import {
  HelpCircle,
  TrendingDown,
  Minimize2,
  GitBranch,
  ArrowRight,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';

export const DeepExplainer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'minus_sign' | 'space_opt' | 'greedy_trap' | 'loop_order'>('minus_sign');

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 tracking-tight">
          Visual Conceptual Guide: Demystifying BoxOfCoins
        </h2>
        <p className="text-sm text-slate-500 mt-0.5">
          Step-by-step mathematical reasoning behind every single line of code
        </p>
      </div>

      {/* Navigation Tabs (Interactive Segmented Control) */}
      <div className="flex flex-wrap gap-2 p-1 bg-slate-100 rounded-lg">
        <button
          onClick={() => setActiveTab('minus_sign')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
            activeTab === 'minus_sign'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
          <span>The Minus Sign Mystery</span>
        </button>
        <button
          onClick={() => setActiveTab('space_opt')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
            activeTab === 'space_opt'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Minimize2 className="w-3.5 h-3.5 text-indigo-600" />
          <span>1D Memory Compaction Trick</span>
        </button>
        <button
          onClick={() => setActiveTab('greedy_trap')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
            activeTab === 'greedy_trap'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
          <span>Why Greedy Fails: [2, 7, 3]</span>
        </button>
        <button
          onClick={() => setActiveTab('loop_order')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
            activeTab === 'loop_order'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <GitBranch className="w-3.5 h-3.5 text-emerald-600" />
          <span>Interval DP Loop Order</span>
        </button>
      </div>

      {/* Content 1: The Minus Sign Mystery */}
      {activeTab === 'minus_sign' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200">
            <h3 className="text-sm font-bold text-amber-950 mb-1">
              Why do we subtract instead of add?
            </h3>
            <p className="text-xs text-amber-900 leading-relaxed font-mono">
              takeLeft = boxes[leftIndex] - bestDifference[leftIndex + 1];
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <h4 className="font-bold text-slate-900">1. Definition of bestDifference</h4>
              <p className="text-slate-600 leading-relaxed">
                In this game, <code className="font-mono text-amber-800 font-semibold">bestDifference</code> does NOT simply store the player's total coin value.
                Instead, it stores the <strong className="text-slate-900">Score Lead (Net Margin)</strong>:
              </p>
              <div className="p-2.5 rounded bg-white border border-slate-200 font-mono text-center text-slate-800 font-semibold">
                Difference = (Current Player Score) - (Opponent Score)
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <h4 className="font-bold text-slate-900">2. The Algebraic Substitution</h4>
              <p className="text-slate-600 leading-relaxed">
                When Alex picks <code className="font-mono text-amber-800">boxes[left]</code>, Cindy now gets to play on the remaining boxes. Cindy's optimal lead over Alex in that subgame is:
              </p>
              <div className="p-2.5 rounded bg-white border border-slate-200 font-mono text-center text-slate-800 text-[11px]">
                Opponent Lead = Cindy - Alex = bestDifference[left + 1]
              </div>
              <p className="text-slate-600 leading-relaxed pt-1">
                From Alex's perspective:
                <br />
                <span className="font-mono font-semibold text-slate-900">
                  Alex - Cindy = boxes[left] - (Cindy - Alex)
                </span>
                <br />
                <span className="font-mono font-bold text-amber-800">
                  = boxes[left] - bestDifference[left + 1]
                </span>
              </p>
            </div>
          </div>

          <div className="p-3 bg-white border border-slate-200 rounded-lg text-xs text-slate-600">
            <span className="font-semibold text-slate-800">Key Takeaway:</span> By maximizing the difference, we do not need to pass player turns ("isAlexTurn ? ...") into the dynamic programming state! Both players follow the exact same optimal symmetric strategy.
          </div>
        </div>
      )}

      {/* Content 2: 1D Space Compaction Trick */}
      {activeTab === 'space_opt' && (
        <div className="space-y-4 text-xs">
          <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-200">
            <h3 className="text-sm font-bold text-indigo-950 mb-1">
              From O(N²) Table to O(N) Array
            </h3>
            <p className="text-xs text-indigo-900 leading-relaxed">
              Why don't we need a 2D array <code className="font-mono">int[,] dp = new int[N, N]</code>?
            </p>
          </div>

          <div className="space-y-3">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <h4 className="font-bold text-slate-900">The Overwrite Invariant</h4>
              <p className="text-slate-600 leading-relaxed">
                Look at the two lookups for a range of length <code className="font-mono">len</code> starting at <code className="font-mono">left</code>:
              </p>
              <ul className="space-y-2 pl-4 list-disc text-slate-600">
                <li>
                  <strong className="text-slate-900 font-mono">bestDifference[left + 1]</strong>: Subrange <code className="font-mono">[left + 1 .. right]</code> has length <code className="font-mono">len - 1</code>. Its value was calculated in the <em>previous iteration</em> of the outer loop and is waiting untouched.
                </li>
                <li>
                  <strong className="text-slate-900 font-mono">bestDifference[left]</strong>: Subrange <code className="font-mono">[left .. right - 1]</code> also has length <code className="font-mono">len - 1</code>. Because the inner loop moves from left to right, we read <code className="font-mono">bestDifference[left]</code> <em>immediately before</em> writing the new value into it!
                </li>
              </ul>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
              <h4 className="font-bold text-slate-900">Memory Comparison</h4>
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-3 bg-rose-50 rounded-lg border border-rose-200">
                  <span className="text-[11px] text-rose-700 block font-semibold">Standard 2D DP</span>
                  <span className="font-mono font-bold text-sm text-rose-950">N × N integers</span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">For N=50: 2,500 cells</span>
                </div>
                <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                  <span className="text-[11px] text-emerald-700 block font-semibold">This 1D Implementation</span>
                  <span className="font-mono font-bold text-sm text-emerald-950">N integers</span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">For N=50: only 50 cells</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content 3: Why Greedy Fails */}
      {activeTab === 'greedy_trap' && (
        <div className="space-y-4 text-xs">
          <div className="p-4 rounded-xl bg-rose-50/70 border border-rose-200">
            <h3 className="text-sm font-bold text-rose-950 mb-1">
              Why "Pick the Bigger End" Fails (Greedy Trap)
            </h3>
            <p className="text-xs text-rose-900 leading-relaxed">
              A naive player might always choose whichever of the two ends is larger right now.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
            <h4 className="font-bold text-slate-900">Concrete Counterexample: [2, 7, 3]</h4>
            <div className="flex items-center justify-center gap-3 py-2">
              <div className="w-12 h-12 rounded border-2 border-slate-300 bg-white flex items-center justify-center font-mono font-bold text-sm">
                2
              </div>
              <div className="w-12 h-12 rounded border-2 border-amber-400 bg-amber-100 flex items-center justify-center font-mono font-bold text-sm text-amber-900">
                7
              </div>
              <div className="w-12 h-12 rounded border-2 border-slate-300 bg-white flex items-center justify-center font-mono font-bold text-sm">
                3
              </div>
            </div>

            <div className="space-y-2 text-slate-600">
              <p>
                • <strong className="text-rose-700">Greedy Approach:</strong> Alex looks at ends <span className="font-mono font-bold">2</span> and <span className="font-mono font-bold">3</span>. Since <span className="font-mono font-bold">3 &gt; 2</span>, Alex takes <span className="font-mono font-bold">3</span>.
                <br />
                Now Cindy is left with <span className="font-mono">[2, 7]</span>. Cindy joyfully takes <span className="font-mono font-bold text-amber-900">7</span>!
                <br />
                Finally, Alex must take <span className="font-mono font-bold">2</span>.
                <br />
                <span className="font-mono font-bold text-rose-700">
                  Alex Total = 3 + 2 = 5 | Cindy Total = 7 | Difference = 5 - 7 = -2 (Alex Loses!)
                </span>
              </p>
              <p>
                • <strong className="text-emerald-700">Optimal DP Approach:</strong> Alex anticipates Cindy's moves!
                <br />
                Even though <span className="font-mono">2 &lt; 3</span>, neither move can avoid Cindy eventually getting 7 in this case. The DP calculation correctly reveals that the maximum achievable difference is indeed <span className="font-mono font-bold">-2</span>.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
            <h4 className="font-bold text-slate-900">Case 20: [9, 100, 1, 8]</h4>
            <p className="text-slate-600 leading-relaxed">
              If Alex greedily picked <span className="font-mono font-bold">9</span> (because 9 &gt; 8), Cindy would immediately take <span className="font-mono font-bold text-amber-900">100</span>!
              <br />
              Instead, Alex chooses <span className="font-mono font-bold">8</span>. Cindy is trapped between 9 and 1. Whichever Cindy picks, Alex claims the 100 on turn 2, winning with <span className="font-mono font-bold text-emerald-700">+98</span> points!
            </p>
          </div>
        </div>
      )}

      {/* Content 4: Interval DP Loop Order */}
      {activeTab === 'loop_order' && (
        <div className="space-y-4 text-xs">
          <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200">
            <h3 className="text-sm font-bold text-emerald-950 mb-1">
              Why Does the Outer Loop Count Range Length?
            </h3>
            <p className="text-xs text-emerald-900 leading-relaxed font-mono">
              for (int rangeLength = 2; rangeLength &lt;= boxes.Length; rangeLength++)
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
            <h4 className="font-bold text-slate-900">Dependency Order in Interval DP</h4>
            <p className="text-slate-600 leading-relaxed">
              In standard array DP (like Fibonacci or Knapsack), we iterate linearly <code className="font-mono">i = 0 .. N</code>. But in <strong>Interval DP</strong> (games, matrix chain multiplication, palindrome partitioning), a problem of size <span className="font-mono font-bold">L</span> depends on subproblems of size <span className="font-mono font-bold">L - 1</span>!
            </p>

            <div className="space-y-2 font-mono text-[11px] bg-white p-3 rounded-lg border border-slate-200">
              <div className="flex items-center gap-2">
                <span className="w-20 font-bold text-slate-900">Length 1:</span>
                <span className="text-slate-600">[0], [1], [2], [3] (Base cases)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-20 font-bold text-slate-900">Length 2:</span>
                <span className="text-slate-600">[0..1], [1..2], [2..3] (uses length 1)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-20 font-bold text-slate-900">Length 3:</span>
                <span className="text-slate-600">[0..2], [1..3] (uses length 2)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-20 font-bold text-slate-900">Length 4:</span>
                <span className="text-slate-600">[0..3] (Full array, final answer at bestDifference[0]!)</span>
              </div>
            </div>

            <p className="text-slate-600 leading-relaxed">
              If we looped through <code className="font-mono">leftIndex</code> first before <code className="font-mono">rangeLength</code>, the subproblems would not be ready when needed!
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
