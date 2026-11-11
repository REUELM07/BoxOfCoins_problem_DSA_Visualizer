/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Header } from './components/Header';
import { BoxRowVisualizer } from './components/BoxRowVisualizer';
import { ArrayStateVisualizer } from './components/ArrayStateVisualizer';
import { PlaybackControls } from './components/PlaybackControls';
import { CodeInspector } from './components/CodeInspector';
import { DeepExplainer } from './components/DeepExplainer';
import { GamePlayground } from './components/GamePlayground';
import { TestCaseRunner } from './components/TestCaseRunner';
import { ALL_TEST_CASES, POPULAR_PRESETS } from './utils/testCases';
import { generateExecutionTrace, solveDirect } from './utils/boxOfCoinsEngine';
import { TestCase } from './types/boxOfCoins';
import { Sparkles, Dna, Info, HelpCircle, Code2, PlayCircle, Plus, Shuffle, Check } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'visualizer' | 'code' | 'concept' | 'game' | 'testsuite'>('visualizer');
  
  // Current active boxes input
  const [boxes, setBoxes] = useState<number[]>([4, 9, 2, 7]); // Case 29 default
  const [customInputText, setCustomInputText] = useState<string>('4, 9, 2, 7');
  const [customInputError, setCustomInputError] = useState<string | null>(null);

  // Playback state
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1);
  const [isLooping, setIsLooping] = useState<boolean>(false);

  // Generate trace whenever boxes array changes
  const trace = useMemo(() => {
    return generateExecutionTrace(boxes);
  }, [boxes]);

  const currentStep = trace[currentStepIndex] || trace[0];

  // Auto-play timer effect
  useEffect(() => {
    if (!isPlaying) return;

    const baseDelay = 1200; // ms per step
    const intervalTime = baseDelay / speed;

    const timer = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < trace.length - 1) {
          return prev + 1;
        } else {
          if (isLooping) {
            return 0;
          } else {
            setIsPlaying(false);
            return prev;
          }
        }
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isPlaying, speed, trace.length, isLooping]);

  // Keyboard shortcut navigation (Space for play/pause, Left/Right arrows for step)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if typing in an input
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        setIsPlaying((prev) => !prev);
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        setIsPlaying(false);
        setCurrentStepIndex((prev) => Math.min(trace.length - 1, prev + 1));
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        setIsPlaying(false);
        setCurrentStepIndex((prev) => Math.max(0, prev - 1));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [trace.length]);

  // Load custom array input
  const handleApplyCustomInput = () => {
    try {
      const parsed = customInputText
        .split(/[, \t]+/)
        .map((s) => s.trim())
        .filter((s) => s.length > 0)
        .map((s) => {
          const num = Number(s);
          if (isNaN(num)) throw new Error(`Invalid number "${s}"`);
          return num;
        });

      if (parsed.length === 0) {
        setCustomInputError('Please enter at least 1 number.');
        return;
      }

      if (parsed.length > 12) {
        setCustomInputError('For visual clarity in dry run, please use 12 or fewer boxes.');
        return;
      }

      setCustomInputError(null);
      setBoxes(parsed);
      setCurrentStepIndex(0);
      setIsPlaying(false);
    } catch (err: any) {
      setCustomInputError(err.message || 'Invalid input format.');
    }
  };

  const handleRandomize = () => {
    const len = Math.floor(Math.random() * 4) + 4; // 4 to 7
    const randomArr = Array.from({ length: len }, () => Math.floor(Math.random() * 20) + 1);
    setBoxes(randomArr);
    setCustomInputText(randomArr.join(', '));
    setCustomInputError(null);
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  const handleSelectPreset = (arr: number[]) => {
    setBoxes(arr);
    setCustomInputText(arr.join(', '));
    setCustomInputError(null);
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  const handleLoadTestCase = (tc: TestCase) => {
    setBoxes(tc.boxes);
    setCustomInputText(tc.boxes.join(', '));
    setCustomInputError(null);
    setCurrentStepIndex(0);
    setIsPlaying(false);
    setActiveTab('visualizer');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Bar Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onReset={() => {
          setCurrentStepIndex(0);
          setIsPlaying(false);
        }}
        onRunDemo={() => {
          handleSelectPreset([4, 9, 2, 7]);
          setActiveTab('visualizer');
          setCurrentStepIndex(0);
          setIsPlaying(true);
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* TAB 1: VISUALIZER & STEP-BY-STEP DRY RUN */}
        {activeTab === 'visualizer' && (
          <div className="space-y-6">
            {/* Array Selection & Preset Strip */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-slate-700">Quick Presets:</span>
                <div className="flex flex-wrap gap-1.5">
                  {POPULAR_PRESETS.map((p) => {
                    const isSelected = JSON.stringify(boxes) === JSON.stringify(p.boxes);
                    return (
                      <button
                        key={p.id}
                        onClick={() => handleSelectPreset(p.boxes)}
                        className={`px-2.5 py-1 text-xs rounded-md font-mono transition-colors ${
                          isSelected
                            ? 'bg-amber-100 text-amber-900 border border-amber-300 font-bold'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        [{p.boxes.join(', ')}]
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom input builder */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={customInputText}
                  onChange={(e) => setCustomInputText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleApplyCustomInput()}
                  placeholder="e.g. 4, 9, 2, 7"
                  className="font-mono text-xs px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-500 w-44"
                />
                <button
                  onClick={handleApplyCustomInput}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors"
                >
                  Apply
                </button>
                <button
                  onClick={handleRandomize}
                  title="Generate random boxes"
                  className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  <Shuffle className="w-3.5 h-3.5" />
                </button>
              </div>

              {customInputError && (
                <div className="w-full text-xs text-rose-600 font-medium">
                  {customInputError}
                </div>
              )}
            </div>

            {/* Step Commentary Banner */}
            {currentStep && (
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex items-start gap-3 shadow-xs">
                <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-sm font-bold text-slate-900">
                      {currentStep.title}
                    </h3>
                    <span className="text-xs font-mono text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded">
                      Line {currentStep.codeLine}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 font-medium mt-1">
                    {currentStep.explanation}
                  </p>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {currentStep.deepExplanation}
                  </p>
                </div>
              </div>
            )}

            {/* Playback Scrubber & Speed Controls */}
            <PlaybackControls
              currentStepIndex={currentStepIndex}
              totalSteps={trace.length}
              isPlaying={isPlaying}
              onPlayPause={() => setIsPlaying(!isPlaying)}
              onStepForward={() => {
                setIsPlaying(false);
                setCurrentStepIndex((prev) => Math.min(trace.length - 1, prev + 1));
              }}
              onStepBackward={() => {
                setIsPlaying(false);
                setCurrentStepIndex((prev) => Math.max(0, prev - 1));
              }}
              onJumpStart={() => {
                setIsPlaying(false);
                setCurrentStepIndex(0);
              }}
              onJumpEnd={() => {
                setIsPlaying(false);
                setCurrentStepIndex(trace.length - 1);
              }}
              onScrub={(idx) => {
                setIsPlaying(false);
                setCurrentStepIndex(idx);
              }}
              speed={speed}
              setSpeed={setSpeed}
              isLooping={isLooping}
              setIsLooping={setIsLooping}
            />

            {/* Main Interactive Stage: BoxRow and Code Inspector Split */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left / Top Stage: Box Visualization and Array Memory (7 cols) */}
              <div className="lg:col-span-7 space-y-6">
                {currentStep && <BoxRowVisualizer step={currentStep} />}
                {currentStep && <ArrayStateVisualizer step={currentStep} />}
              </div>

              {/* Right / Bottom Stage: Synchronized Code Inspector (5 cols) */}
              <div className="lg:col-span-5">
                {currentStep && <CodeInspector currentStep={currentStep} />}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CODE BREAKDOWN */}
        {activeTab === 'code' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                  Complete Annotated Code Walkthrough
                </h2>
                <p className="text-sm text-slate-500">
                  Every loop, index, and formula in BoxOfCoins.Solve explained in detail
                </p>
              </div>

              {/* Section 1 */}
              <div className="space-y-4 text-xs">
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-amber-800 text-sm">
                      1. Method Signature & Memory Allocation
                    </span>
                    <span className="font-mono text-slate-500">Lines 5-8</span>
                  </div>
                  <pre className="p-3 bg-slate-900 text-slate-100 rounded-lg font-mono text-[11px] overflow-x-auto">
{`public static int Solve(int[] boxes)
{
    // creating an array to store the best score difference for each range of boxes
    int[] bestDifference = new int[boxes.Length];`}
                  </pre>
                  <p className="text-slate-600 leading-relaxed">
                    <strong>Input:</strong> An array of integers representing the coin boxes in order from left to right.
                    <br />
                    <strong>Array Allocation:</strong> We allocate <code className="font-mono font-semibold">bestDifference</code> of length <code className="font-mono">boxes.Length</code>. This 1D array is reused dynamically as the range length increases, saving immense memory compared to a full 2D table.
                  </p>
                </div>

                {/* Section 2 */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-amber-800 text-sm">
                      2. Base Cases: Range of Length 1
                    </span>
                    <span className="font-mono text-slate-500">Lines 10-14</span>
                  </div>
                  <pre className="p-3 bg-slate-900 text-slate-100 rounded-lg font-mono text-[11px] overflow-x-auto">
{`    // if only one box, current player takes it. Score diff is that box's value
    for (int boxIndex = 0; boxIndex < boxes.Length; boxIndex++)
    {
        bestDifference[boxIndex] = boxes[boxIndex];
    }`}
                  </pre>
                  <p className="text-slate-600 leading-relaxed">
                    When only one box remains in a subgame <code className="font-mono">[i .. i]</code>, the player whose turn it is must take that sole box. The opponent gets 0 points.
                    <br />
                    Hence, the score lead is: <code className="font-mono">boxes[i] - 0 = boxes[i]</code>.
                  </p>
                </div>

                {/* Section 3 */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-amber-800 text-sm">
                      3. Outer Loop: Increasing Range Length (Bottom-Up DP)
                    </span>
                    <span className="font-mono text-slate-500">Lines 16-18</span>
                  </div>
                  <pre className="p-3 bg-slate-900 text-slate-100 rounded-lg font-mono text-[11px] overflow-x-auto">
{`    // Now, start by checking ranges of 2 boxes, then 3 boxes, up to boxes.Length
    for (int rangeLength = 2; rangeLength <= boxes.Length; rangeLength++)
    {`}
                  </pre>
                  <p className="text-slate-600 leading-relaxed">
                    This is the classic hallmark of <strong>Interval Dynamic Programming</strong>. We solve all subranges of length 2 first, then length 3, then length 4, all the way up to <code className="font-mono">boxes.Length</code>. This guarantees that any smaller subrange requested by our transitions has already been solved!
                  </p>
                </div>

                {/* Section 4 */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-amber-800 text-sm">
                      4. Inner Loop: Sliding Window & Decisions (takeLeft vs takeRight)
                    </span>
                    <span className="font-mono text-slate-500">Lines 19-33</span>
                  </div>
                  <pre className="p-3 bg-slate-900 text-slate-100 rounded-lg font-mono text-[11px] overflow-x-auto">
{`        for (int leftIndex = 0; leftIndex <= boxes.Length - rangeLength; leftIndex++)
        {
            int rightIndex = leftIndex + rangeLength - 1;

            int takeLeft = boxes[leftIndex] - bestDifference[leftIndex + 1];
            int takeRight = boxes[rightIndex] - bestDifference[leftIndex];

            bestDifference[leftIndex] = Math.Max(takeLeft, takeRight);
        }`}
                  </pre>
                  <p className="text-slate-600 leading-relaxed">
                    <strong>Right Index Formula:</strong> <code className="font-mono">rightIndex = leftIndex + rangeLength - 1</code> gives the exact right end of the window.
                    <br />
                    <strong>Choice A (Take Left):</strong> Current player receives <code className="font-mono">boxes[leftIndex]</code>. Opponent faces range <code className="font-mono">[leftIndex + 1 .. rightIndex]</code> with advantage <code className="font-mono">bestDifference[leftIndex + 1]</code>.
                    <br />
                    <strong>Choice B (Take Right):</strong> Current player receives <code className="font-mono">boxes[rightIndex]</code>. Opponent faces range <code className="font-mono">[leftIndex .. rightIndex - 1]</code> with advantage <code className="font-mono">bestDifference[leftIndex]</code>.
                    <br />
                    <strong>Maximization:</strong> <code className="font-mono">Math.Max(takeLeft, takeRight)</code> picks the best move.
                  </p>
                </div>

                {/* Section 5 */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-amber-800 text-sm">
                      5. Return Value: Global Optimal Difference
                    </span>
                    <span className="font-mono text-slate-500">Lines 36-37</span>
                  </div>
                  <pre className="p-3 bg-slate-900 text-slate-100 rounded-lg font-mono text-[11px] overflow-x-auto">
{`    // After checking all ranges, index 0 stores the best score difference for entire row
    return bestDifference[0];`}
                  </pre>
                  <p className="text-slate-600 leading-relaxed">
                    When <code className="font-mono">rangeLength == boxes.Length</code>, the only starting position is <code className="font-mono">leftIndex = 0</code>.
                    Therefore, <code className="font-mono">bestDifference[0]</code> contains the optimal score difference for the entire row of boxes <code className="font-mono">[0 .. boxes.Length - 1]</code>!
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: CORE CONCEPTS & MATH */}
        {activeTab === 'concept' && <DeepExplainer />}

        {/* TAB 4: PLAY GAME (Alex vs Cindy Sandbox) */}
        {activeTab === 'game' && <GamePlayground />}

        {/* TAB 5: 32 TEST CASES RUNNER */}
        {activeTab === 'testsuite' && (
          <TestCaseRunner onLoadTestCase={handleLoadTestCase} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>BoxOfCoins Dynamic Programming Visualizer & Interactive Educational Sandbox</span>
          <span className="font-mono">Time Complexity: O(N²) · Space Complexity: O(N)</span>
        </div>
      </footer>
    </div>
  );
}
