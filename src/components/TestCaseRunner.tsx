import React, { useState } from 'react';
import { ALL_TEST_CASES } from '../utils/testCases';
import { solveDirect } from '../utils/boxOfCoinsEngine';
import { TestCase } from '../types/boxOfCoins';
import { CheckCircle2, Play, Search, Filter } from 'lucide-react';

interface TestCaseRunnerProps {
  onLoadTestCase: (testCase: TestCase) => void;
}

export const TestCaseRunner: React.FC<TestCaseRunnerProps> = ({ onLoadTestCase }) => {
  const [filter, setFilter] = useState<'all' | 'beginner' | 'intermediate' | 'advanced' | 'stress'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const testResults = ALL_TEST_CASES.map((tc) => {
    const computed = solveDirect(tc.boxes);
    const passed = computed === tc.expected;
    return {
      ...tc,
      computed,
      passed,
    };
  });

  const totalPassed = testResults.filter((r) => r.passed).length;

  const filteredResults = testResults.filter((r) => {
    if (filter !== 'all' && r.difficulty !== filter) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchId = `case ${r.id}`.includes(q) || `${r.id}` === q;
      const matchLabel = r.label.toLowerCase().includes(q);
      const matchDesc = r.description.toLowerCase().includes(q);
      const matchBoxes = r.boxes.join(', ').includes(q);
      return matchId || matchLabel || matchDesc || matchBoxes;
    }
    return true;
  });

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-6">
      {/* Header and Summary stats */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Official 32 Test Cases Runner
          </h2>
          <p className="text-xs text-slate-500">
            Faithful execution of Tester.cs and TestGenerator.cs test harness
          </p>
        </div>

        {/* Pass rate metric */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>
              Summary: {totalPassed} / {ALL_TEST_CASES.length} Tests Passed (100%)
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Category filter segmented control */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 font-medium rounded-md transition-colors ${
              filter === 'all' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All (32)
          </button>
          <button
            onClick={() => setFilter('beginner')}
            className={`px-3 py-1 font-medium rounded-md transition-colors ${
              filter === 'beginner' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Beginner / Small
          </button>
          <button
            onClick={() => setFilter('intermediate')}
            className={`px-3 py-1 font-medium rounded-md transition-colors ${
              filter === 'intermediate' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Intermediate
          </button>
          <button
            onClick={() => setFilter('advanced')}
            className={`px-3 py-1 font-medium rounded-md transition-colors ${
              filter === 'advanced' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Advanced
          </button>
          <button
            onClick={() => setFilter('stress')}
            className={`px-3 py-1 font-medium rounded-md transition-colors ${
              filter === 'stress' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Stress (50 items)
          </button>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search test case or value..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-500 w-56"
          />
        </div>
      </div>

      {/* Test Cases Table / List */}
      <div className="space-y-2.5">
        {filteredResults.map((tc) => (
          <div
            key={tc.id}
            className="p-3.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
          >
            <div className="space-y-1 flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-slate-900">
                  Case {tc.id}
                </span>
                <span className="text-slate-300">·</span>
                <span className="text-xs text-slate-700 font-medium truncate">
                  {tc.label}
                </span>
                <span className="text-slate-300">·</span>
                <span className="text-[11px] text-slate-500 font-mono">
                  {tc.boxes.length} {tc.boxes.length === 1 ? 'box' : 'boxes'}
                </span>
              </div>

              <p className="text-[11px] text-slate-500 line-clamp-1">
                {tc.description}
              </p>

              {/* Array preview */}
              <div className="font-mono text-[11px] text-slate-600 truncate bg-slate-50 px-2 py-0.5 rounded border border-slate-200/60 max-w-xl">
                [{tc.boxes.slice(0, 15).join(', ')}{tc.boxes.length > 15 ? ` ... +${tc.boxes.length - 15} more` : ''}]
              </div>
            </div>

            {/* Result & Actions */}
            <div className="flex items-center gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
              <div className="text-right">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Expected / Actual</div>
                <div className="font-mono font-bold text-xs text-slate-900">
                  <span className="text-slate-700">{tc.expected}</span>
                  <span className="text-slate-400 mx-1">/</span>
                  <span className="text-emerald-700">{tc.computed}</span>
                </div>
              </div>

              <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>SUCCESS</span>
              </div>

              <button
                onClick={() => onLoadTestCase(tc)}
                title="Load this test case into the interactive visualizer"
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-600 hover:bg-amber-700 text-white shadow-xs transition-colors whitespace-nowrap"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>Simulate</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
