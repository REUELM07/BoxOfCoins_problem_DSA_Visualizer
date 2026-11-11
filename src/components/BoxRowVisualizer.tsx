import React from 'react';
import { TraceStep } from '../types/boxOfCoins';
import { ArrowDown, Check, ChevronLeft, ChevronRight, Coins } from 'lucide-react';

interface BoxRowVisualizerProps {
  step: TraceStep;
  interactive?: boolean;
  onPickLeft?: () => void;
  onPickRight?: () => void;
  gameTurn?: 'Alex' | 'Cindy';
}

export const BoxRowVisualizer: React.FC<BoxRowVisualizerProps> = ({
  step,
  interactive = false,
  onPickLeft,
  onPickRight,
  gameTurn = 'Alex',
}) => {
  const {
    boxes,
    rangeLength,
    leftIndex,
    rightIndex,
    takeLeft,
    takeRight,
    chosenScore,
    pickedChoice,
    phase,
  } = step;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
      {/* Top status bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-amber-50 text-amber-700 flex items-center justify-center">
            <Coins className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              {interactive ? `Turn: ${gameTurn}'s Move` : 'Coin Boxes Row (Input Array)'}
            </h3>
            <p className="text-xs text-slate-500">
              {interactive
                ? 'Pick either the leftmost or rightmost coin box'
                : rangeLength !== null && leftIndex !== null && rightIndex !== null
                ? `Active window: [${leftIndex} .. ${rightIndex}] · Window size: ${rangeLength}`
                : `Total boxes: ${boxes.length}`}
            </p>
          </div>
        </div>

        {/* Phase tag */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400">Current Phase:</span>
          <span className="font-medium text-slate-700 capitalize">
            {phase.replace('_', ' ')}
          </span>
        </div>
      </div>

      {/* Main Boxes Visual Row */}
      <div className="py-8 overflow-x-auto flex justify-center items-center min-h-[160px]">
        <div className="relative flex items-center gap-3 px-4 py-6">
          {/* Active Range Bracket Overlay */}
          {leftIndex !== null && rightIndex !== null && (
            <div
              className="absolute -top-3 -bottom-3 rounded-xl border-2 border-dashed border-amber-400/80 bg-amber-50/20 pointer-events-none transition-all duration-300"
              style={{
                left: `${leftIndex * 76 + 12}px`,
                width: `${(rightIndex - leftIndex + 1) * 76 - 8}px`,
              }}
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-xs whitespace-nowrap">
                Range Length: {rangeLength}
              </div>
            </div>
          )}

          {boxes.map((val, idx) => {
            const isLeft = leftIndex === idx;
            const isRight = rightIndex === idx;
            const inRange =
              leftIndex !== null && rightIndex !== null && idx >= leftIndex && idx <= rightIndex;

            let borderColor = 'border-slate-200';
            let bgGradient = 'bg-slate-50 hover:bg-slate-100';
            let textColor = 'text-slate-800';

            if (isLeft && isRight) {
              borderColor = 'border-amber-500 ring-2 ring-amber-400/30';
              bgGradient = 'bg-amber-100/70';
              textColor = 'text-amber-900 font-bold';
            } else if (isLeft) {
              borderColor =
                pickedChoice === 'left' || pickedChoice === 'equal'
                  ? 'border-emerald-500 ring-2 ring-emerald-400/40'
                  : 'border-sky-500 ring-2 ring-sky-300';
              bgGradient =
                pickedChoice === 'left' || pickedChoice === 'equal'
                  ? 'bg-emerald-50'
                  : 'bg-sky-50';
              textColor = 'text-slate-900 font-bold';
            } else if (isRight) {
              borderColor =
                pickedChoice === 'right' || pickedChoice === 'equal'
                  ? 'border-emerald-500 ring-2 ring-emerald-400/40'
                  : 'border-purple-500 ring-2 ring-purple-300';
              bgGradient =
                pickedChoice === 'right' || pickedChoice === 'equal'
                  ? 'bg-emerald-50'
                  : 'bg-purple-50';
              textColor = 'text-slate-900 font-bold';
            } else if (inRange) {
              borderColor = 'border-amber-300';
              bgGradient = 'bg-amber-50/40';
              textColor = 'text-slate-700';
            }

            return (
              <div key={idx} className="relative flex flex-col items-center">
                {/* Top Left/Right Pointer indicator */}
                <div className="h-6 flex items-center justify-center">
                  {isLeft && (
                    <div className="flex flex-col items-center animate-bounce">
                      <span className="text-[10px] font-bold text-sky-700">L ({idx})</span>
                      <ArrowDown className="w-3 h-3 text-sky-600" />
                    </div>
                  )}
                  {isRight && !isLeft && (
                    <div className="flex flex-col items-center animate-bounce">
                      <span className="text-[10px] font-bold text-purple-700">R ({idx})</span>
                      <ArrowDown className="w-3 h-3 text-purple-600" />
                    </div>
                  )}
                </div>

                {/* Box card */}
                <div
                  className={`relative w-16 h-18 rounded-lg border-2 ${borderColor} ${bgGradient} flex flex-col items-center justify-center transition-all duration-200 shadow-xs group`}
                >
                  {/* Coin icon badge */}
                  <span className="text-xs mb-0.5">🪙</span>

                  {/* Value */}
                  <span
                    className={`font-mono text-sm tabular-nums tracking-tight ${textColor}`}
                  >
                    {val}
                  </span>

                  {/* Subtle index tag at bottom */}
                  <span className="text-[9px] text-slate-600 mt-1 font-mono">
                    idx {idx}
                  </span>

                  {/* Interactive pick affordances for game mode */}
                  {interactive && (isLeft || isRight) && (
                    <button
                      onClick={isLeft ? onPickLeft : onPickRight}
                      className="absolute -bottom-7 px-2 py-0.5 text-[10px] font-semibold rounded bg-amber-600 text-white hover:bg-amber-700 shadow-xs whitespace-nowrap"
                    >
                      {isLeft ? 'Take Left' : 'Take Right'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Decision Fork Explanation (When computing options) */}
      {(takeLeft !== null || takeRight !== null) && leftIndex !== null && rightIndex !== null && (
        <div className="mt-4 pt-4 border-t border-slate-100">
          <div className="text-xs font-semibold text-slate-700 mb-3 flex items-center gap-1.5">
            <span>Evaluating Options for Window [{leftIndex} .. {rightIndex}]:</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Take Left card */}
            <div
              className={`p-3 rounded-lg border transition-all ${
                pickedChoice === 'left' || pickedChoice === 'equal'
                  ? 'border-emerald-300 bg-emerald-50/50'
                  : 'border-slate-200 bg-slate-50/60'
              }`}
            >
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-semibold text-sky-800 flex items-center gap-1">
                  <ChevronLeft className="w-3.5 h-3.5" />
                  Option A: Take Left (Box #{leftIndex})
                </span>
                {(pickedChoice === 'left' || pickedChoice === 'equal') && (
                  <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                    <Check className="w-3 h-3" /> Best Choice
                  </span>
                )}
              </div>

              <div className="text-xs text-slate-600 font-mono space-y-1">
                <div className="flex justify-between">
                  <span>Box value:</span>
                  <span className="font-semibold text-slate-900">{boxes[leftIndex]}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Opponent advantage [idx {leftIndex + 1}..{rightIndex}]:</span>
                  <span className="text-rose-600">
                    - ({step.bestDifference[leftIndex + 1] ?? 0})
                  </span>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-200/60 font-bold text-slate-900">
                  <span>takeLeft Net Score:</span>
                  <span className="tabular-nums text-sky-700">{takeLeft ?? '...'}</span>
                </div>
              </div>
            </div>

            {/* Take Right card */}
            <div
              className={`p-3 rounded-lg border transition-all ${
                pickedChoice === 'right' || pickedChoice === 'equal'
                  ? 'border-emerald-300 bg-emerald-50/50'
                  : 'border-slate-200 bg-slate-50/60'
              }`}
            >
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-semibold text-purple-800 flex items-center gap-1">
                  Option B: Take Right (Box #{rightIndex})
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
                {(pickedChoice === 'right' || pickedChoice === 'equal') && (
                  <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                    <Check className="w-3 h-3" /> Best Choice
                  </span>
                )}
              </div>

              <div className="text-xs text-slate-600 font-mono space-y-1">
                <div className="flex justify-between">
                  <span>Box value:</span>
                  <span className="font-semibold text-slate-900">{boxes[rightIndex]}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Opponent advantage [idx {leftIndex}..{rightIndex - 1}]:</span>
                  <span className="text-rose-600">
                    - ({step.bestDifference[leftIndex] ?? 0})
                  </span>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-200/60 font-bold text-slate-900">
                  <span>takeRight Net Score:</span>
                  <span className="tabular-nums text-purple-700">{takeRight ?? '...'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Chosen max summary */}
          {chosenScore !== null && (
            <div className="mt-3 p-2.5 rounded-lg bg-amber-50/80 border border-amber-200/80 flex items-center justify-between text-xs">
              <span className="text-amber-900 font-medium">
                Math.Max({takeLeft}, {takeRight})
              </span>
              <span className="font-bold text-amber-950 font-mono tabular-nums">
                Result = {chosenScore} (Stored at bestDifference[{leftIndex}])
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
