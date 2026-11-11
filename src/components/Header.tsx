import React from 'react';
import { Play, RotateCcw, Sparkles } from 'lucide-react';

interface HeaderProps {
  activeTab: 'visualizer' | 'code' | 'concept' | 'game' | 'testsuite';
  setActiveTab: (tab: 'visualizer' | 'code' | 'concept' | 'game' | 'testsuite') => void;
  onReset: () => void;
  onRunDemo: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onReset,
  onRunDemo,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold text-lg shadow-sm">
            🪙
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap">
            BoxOfCoins Studio
          </span>
        </div>

        {/* Zone 2: Navigation Links (single-line text links) */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <button
            onClick={() => setActiveTab('visualizer')}
            className={`transition-colors whitespace-nowrap hover:text-slate-900 pb-1 border-b-2 ${
              activeTab === 'visualizer'
                ? 'border-amber-500 text-slate-900 font-semibold'
                : 'border-transparent text-slate-600'
            }`}
          >
            Visualizer & Dry Run
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`transition-colors whitespace-nowrap hover:text-slate-900 pb-1 border-b-2 ${
              activeTab === 'code'
                ? 'border-amber-500 text-slate-900 font-semibold'
                : 'border-transparent text-slate-600'
            }`}
          >
            Code Breakdown
          </button>
          <button
            onClick={() => setActiveTab('concept')}
            className={`transition-colors whitespace-nowrap hover:text-slate-900 pb-1 border-b-2 ${
              activeTab === 'concept'
                ? 'border-amber-500 text-slate-900 font-semibold'
                : 'border-transparent text-slate-600'
            }`}
          >
            Core Concepts & Math
          </button>
          <button
            onClick={() => setActiveTab('game')}
            className={`transition-colors whitespace-nowrap hover:text-slate-900 pb-1 border-b-2 ${
              activeTab === 'game'
                ? 'border-amber-500 text-slate-900 font-semibold'
                : 'border-transparent text-slate-600'
            }`}
          >
            Play Game (Alex vs Cindy)
          </button>
          <button
            onClick={() => setActiveTab('testsuite')}
            className={`transition-colors whitespace-nowrap hover:text-slate-900 pb-1 border-b-2 ${
              activeTab === 'testsuite'
                ? 'border-amber-500 text-slate-900 font-semibold'
                : 'border-transparent text-slate-600'
            }`}
          >
            32 Test Cases
          </button>
        </nav>

        {/* Zone 3: Primary Action buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onReset}
            title="Reset to beginning of dry run"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restart</span>
          </button>
          <button
            onClick={onRunDemo}
            className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 active:bg-amber-800 rounded-lg shadow-sm transition-colors whitespace-nowrap"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Interactive Demo</span>
          </button>
        </div>
      </div>

      {/* Mobile nav row */}
      <div className="md:hidden flex items-center justify-between overflow-x-auto px-4 py-2 border-t border-slate-100 bg-slate-50 gap-2 text-xs">
        <button
          onClick={() => setActiveTab('visualizer')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${
            activeTab === 'visualizer' ? 'bg-amber-600 text-white font-medium' : 'text-slate-600'
          }`}
        >
          Visualizer
        </button>
        <button
          onClick={() => setActiveTab('code')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${
            activeTab === 'code' ? 'bg-amber-600 text-white font-medium' : 'text-slate-600'
          }`}
        >
          Code
        </button>
        <button
          onClick={() => setActiveTab('concept')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${
            activeTab === 'concept' ? 'bg-amber-600 text-white font-medium' : 'text-slate-600'
          }`}
        >
          Concepts
        </button>
        <button
          onClick={() => setActiveTab('game')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${
            activeTab === 'game' ? 'bg-amber-600 text-white font-medium' : 'text-slate-600'
          }`}
        >
          Play Game
        </button>
        <button
          onClick={() => setActiveTab('testsuite')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${
            activeTab === 'testsuite' ? 'bg-amber-600 text-white font-medium' : 'text-slate-600'
          }`}
        >
          32 Tests
        </button>
      </div>
    </header>
  );
};
