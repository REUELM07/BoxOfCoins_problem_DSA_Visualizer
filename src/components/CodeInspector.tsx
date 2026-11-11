import React, { useState } from 'react';
import { CSHARP_CODE_LINES, CodeLineInfo } from '../utils/boxOfCoinsEngine';
import { TraceStep } from '../types/boxOfCoins';
import { Code, Eye, Info } from 'lucide-react';

interface CodeInspectorProps {
  currentStep: TraceStep;
}

export const CodeInspector: React.FC<CodeInspectorProps> = ({ currentStep }) => {
  const [selectedLine, setSelectedLine] = useState<number | null>(null);

  const activeLineInfo = CSHARP_CODE_LINES.find((l) => l.lineNumber === currentStep.codeLine);
  const inspectionLine = selectedLine
    ? CSHARP_CODE_LINES.find((l) => l.lineNumber === selectedLine)
    : activeLineInfo;

  return (
    <div className="bg-slate-900 text-slate-100 rounded-xl border border-slate-800 shadow-md overflow-hidden flex flex-col h-full">
      {/* Top Header */}
      <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Code className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-semibold tracking-wide text-slate-200">
            BoxOfCoins.cs — Line-by-Line Execution
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-amber-400 font-semibold bg-amber-950/80 border border-amber-800/60 px-2 py-0.5 rounded">
            Executing Line {currentStep.codeLine}
          </span>
        </div>
      </div>

      {/* Main Code View with Line Numbers */}
      <div className="p-3 font-mono text-xs overflow-x-auto flex-1 max-h-[380px] bg-slate-950/60 divide-y divide-slate-800/30">
        {CSHARP_CODE_LINES.map((line) => {
          const isCurrentExecuting = currentStep.codeLine === line.lineNumber;
          const isUserSelected = selectedLine === line.lineNumber;

          let lineBg = 'hover:bg-slate-800/40';
          if (isCurrentExecuting) {
            lineBg = 'bg-amber-900/40 border-l-2 border-amber-400 text-amber-100';
          } else if (isUserSelected) {
            lineBg = 'bg-slate-800/60 border-l-2 border-sky-400';
          }

          return (
            <div
              key={line.lineNumber}
              onClick={() => setSelectedLine(line.lineNumber)}
              className={`flex items-center gap-3 px-2 py-1 cursor-pointer transition-colors ${lineBg}`}
            >
              {/* Line number */}
              <span
                className={`w-7 text-right text-[11px] select-none font-mono ${
                  isCurrentExecuting ? 'text-amber-400 font-bold' : 'text-slate-600'
                }`}
              >
                {line.lineNumber}
              </span>

              {/* Code content */}
              <span
                className={`flex-1 whitespace-pre ${
                  line.isComment
                    ? 'text-emerald-400 italic'
                    : isCurrentExecuting
                    ? 'text-white font-medium'
                    : 'text-slate-300'
                }`}
              >
                {line.text}
              </span>

              {/* Arrow pointer for executing line */}
              {isCurrentExecuting && (
                <span className="text-[10px] uppercase font-bold text-amber-400 bg-amber-950/90 px-1.5 py-0.2 rounded border border-amber-800/80 animate-pulse whitespace-nowrap">
                  ▶ Executing
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Live Variable Watcher Panel */}
      <div className="p-3 bg-slate-900 border-t border-slate-800 space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-semibold flex items-center gap-1.5 text-slate-300">
            <Eye className="w-3.5 h-3.5 text-sky-400" />
            Live Variable Watcher
          </span>
          <span className="text-[11px] font-mono text-slate-400">Step {currentStep.stepIndex + 1}</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
          <div className="p-2 rounded bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-400 block">rangeLength</span>
            <span className="font-bold text-amber-300 tabular-nums">
              {currentStep.rangeLength !== null ? currentStep.rangeLength : '—'}
            </span>
          </div>
          <div className="p-2 rounded bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-400 block">leftIndex / rightIndex</span>
            <span className="font-bold text-sky-300 tabular-nums">
              {currentStep.leftIndex !== null ? `${currentStep.leftIndex} / ${currentStep.rightIndex}` : '—'}
            </span>
          </div>
          <div className="p-2 rounded bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-400 block">takeLeft</span>
            <span className="font-bold text-emerald-400 tabular-nums">
              {currentStep.takeLeft !== null ? currentStep.takeLeft : '—'}
            </span>
          </div>
          <div className="p-2 rounded bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-400 block">takeRight</span>
            <span className="font-bold text-purple-400 tabular-nums">
              {currentStep.takeRight !== null ? currentStep.takeRight : '—'}
            </span>
          </div>
        </div>

        {/* Selected or Active Line Explanation Note */}
        {inspectionLine?.explanation && (
          <div className="pt-2 border-t border-slate-800/80 flex items-start gap-2 text-xs text-slate-300">
            <Info className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
            <p className="leading-snug text-[11px]">
              <span className="font-bold text-white">Line {inspectionLine.lineNumber}:</span>{' '}
              {inspectionLine.explanation}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
