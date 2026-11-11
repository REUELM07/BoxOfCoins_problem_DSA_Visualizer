import React, { useState } from 'react';
import { TraceStep } from '../types/boxOfCoins';
import { Database, Grid, Layers, HelpCircle } from 'lucide-react';

interface ArrayStateVisualizerProps {
  step: TraceStep;
}

export const ArrayStateVisualizer: React.FC<ArrayStateVisualizerProps> = ({ step }) => {
  const [viewMode, setViewMode] = useState<'1d' | '2d' | 'both'>('both');
  const {
    bestDifference,
    highlightedArrayIndices,
    leftIndex,
    rightIndex,
    rangeLength,
    dpMatrixSnapshot,
    boxes,
  } = step;

  const { target, readLeft, readRight } = highlightedArrayIndices;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
      {/* Header and View Mode Segmented Switch */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-sky-50 text-sky-700 flex items-center justify-center">
            <Database className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              DP State Memory Visualizer
            </h3>
            <p className="text-xs text-slate-500">
              Inspect how the 1D array <code className="font-mono text-slate-700">bestDifference[]</code> compresses the 2D matrix
            </p>
          </div>
        </div>

        {/* View Toggle (Interactive Segmented Control) */}
        <div className="flex items-center p-0.5 bg-slate-100 rounded-lg text-xs font-medium text-slate-600">
          <button
            onClick={() => setViewMode('1d')}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              viewMode === '1d' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
            }`}
          >
            1D Optimized Array
          </button>
          <button
            onClick={() => setViewMode('2d')}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              viewMode === '2d' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
            }`}
          >
            2D Matrix View
          </button>
          <button
            onClick={() => setViewMode('both')}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              viewMode === 'both' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
            }`}
          >
            Side-by-Side Dual View
          </button>
        </div>
      </div>

      <div className={`grid gap-4 ${viewMode === 'both' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
        {/* 1D Optimized Array Section */}
        {(viewMode === '1d' || viewMode === 'both') && (
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-amber-600" />
                1D Array: bestDifference[0 .. {bestDifference.length - 1}]
              </span>
              <span className="text-[11px] text-slate-500 font-mono">
                Space: O(N) = {bestDifference.length} ints
              </span>
            </div>

            {/* Visual 1D Cells */}
            <div className="flex items-center gap-2 overflow-x-auto py-2">
              {bestDifference.map((val, idx) => {
                const isTarget = target === idx;
                const isReadLeft = readLeft === idx;
                const isReadRight = readRight === idx;

                let cellBorder = 'border-slate-300';
                let cellBg = 'bg-white';
                let tagText: string | null = null;
                let tagBg = 'bg-slate-100 text-slate-600';

                if (isTarget) {
                  cellBorder = 'border-amber-500 ring-2 ring-amber-400/40';
                  cellBg = 'bg-amber-50';
                  tagText = 'Target (Writing)';
                  tagBg = 'bg-amber-100 text-amber-800';
                } else if (isReadLeft) {
                  cellBorder = 'border-sky-500 ring-2 ring-sky-300/40';
                  cellBg = 'bg-sky-50';
                  tagText = 'Read (takeLeft)';
                  tagBg = 'bg-sky-100 text-sky-800';
                } else if (isReadRight) {
                  cellBorder = 'border-purple-500 ring-2 ring-purple-300/40';
                  cellBg = 'bg-purple-50';
                  tagText = 'Read (takeRight)';
                  tagBg = 'bg-purple-100 text-purple-800';
                }

                return (
                  <div key={idx} className="flex flex-col items-center min-w-[58px]">
                    <span className="text-[10px] font-mono text-slate-600 mb-1">
                      [{idx}]
                    </span>
                    <div
                      className={`w-14 h-14 rounded-lg border-2 ${cellBorder} ${cellBg} flex flex-col items-center justify-center font-mono font-bold text-sm text-slate-900 shadow-xs transition-all`}
                    >
                      <span className="tabular-nums">{val}</span>
                    </div>
                    <div className="h-5 mt-1 flex items-center justify-center">
                      {tagText && (
                        <span
                          className={`text-[9px] px-1 py-0.5 rounded font-medium whitespace-nowrap ${tagBg}`}
                        >
                          {tagText}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Explanatory callout for current array operation */}
            <div className="text-xs text-slate-600 bg-white p-3 rounded-lg border border-slate-200 space-y-1">
              <div className="font-semibold text-slate-800 flex items-center gap-1">
                <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
                Why does 1D in-place overwrite work safely?
              </div>
              <p className="text-slate-600 leading-relaxed text-[11px]">
                Notice that when computing for range length <span className="font-semibold font-mono text-amber-800">{rangeLength ?? 1}</span> at index <span className="font-mono font-semibold">{leftIndex ?? 0}</span>:
                <br />
                • <code className="font-mono text-sky-700 bg-sky-50 px-1 rounded">bestDifference[left + 1]</code> was computed in the <em>previous length</em> (<span className="font-mono">{rangeLength ? rangeLength - 1 : 1}</span>).
                <br />
                • <code className="font-mono text-purple-700 bg-purple-50 px-1 rounded">bestDifference[left]</code> is read <em>before</em> we overwrite it, so it also safely contains the subproblem from the previous length!
              </p>
            </div>
          </div>
        )}

        {/* 2D Matrix Section */}
        {(viewMode === '2d' || viewMode === 'both') && (
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Grid className="w-3.5 h-3.5 text-indigo-600" />
                2D DP Interval Matrix: dp[left][right]
              </span>
              <span className="text-[11px] text-slate-500 font-mono">
                Full Pyramid View
              </span>
            </div>

            {/* 2D Matrix Table */}
            {dpMatrixSnapshot && (
              <div className="overflow-x-auto py-1">
                <table className="w-full border-collapse font-mono text-xs">
                  <thead>
                    <tr>
                      <th className="p-1 text-[10px] text-slate-400 font-normal">
                        L \ R
                      </th>
                      {boxes.map((_, col) => (
                        <th
                          key={col}
                          className={`p-1 text-[10px] text-center font-bold ${
                            rightIndex === col ? 'text-purple-600 bg-purple-50 rounded-t' : 'text-slate-500'
                          }`}
                        >
                          R={col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {boxes.map((_, row) => (
                      <tr key={row}>
                        <td
                          className={`p-1 text-[10px] text-right font-bold pr-2 ${
                            leftIndex === row ? 'text-sky-600 bg-sky-50 rounded-l' : 'text-slate-500'
                          }`}
                        >
                          L={row}
                        </td>
                        {boxes.map((_, col) => {
                          const val = dpMatrixSnapshot[row]?.[col];
                          const isInvalid = row > col;
                          const isActiveCell = leftIndex === row && rightIndex === col;
                          const isDiagonal = row === col;

                          let bgClass = 'bg-white';
                          let textClass = 'text-slate-800';
                          let borderClass = 'border border-slate-200';

                          if (isInvalid) {
                            bgClass = 'bg-slate-100/50';
                            textClass = 'text-slate-300';
                          } else if (isActiveCell) {
                            bgClass = 'bg-amber-100 ring-2 ring-amber-500';
                            textClass = 'text-amber-950 font-bold';
                          } else if (val !== null && val !== undefined) {
                            bgClass = isDiagonal ? 'bg-slate-50' : 'bg-emerald-50/60';
                            textClass = 'text-emerald-950';
                          }

                          return (
                            <td
                              key={col}
                              className={`p-1.5 text-center text-xs tabular-nums ${bgClass} ${textClass} ${borderClass}`}
                              title={
                                !isInvalid
                                  ? `dp[${row}][${col}] = ${val !== null ? val : 'Uncomputed'}`
                                  : 'Invalid range (L > R)'
                              }
                            >
                              {isInvalid ? '—' : val !== null && val !== undefined ? val : '·'}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="text-[11px] text-slate-500">
              <span className="font-semibold text-slate-700">Insight:</span> The 1D array corresponds to computing diagonal-by-diagonal (lengths 1, 2, 3...) upwards until reaching <code className="font-mono font-semibold text-indigo-700">dp[0][N-1]</code> at the top right!
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
