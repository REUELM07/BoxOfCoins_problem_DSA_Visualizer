import React from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  ChevronLeft,
  ChevronRight,
  Repeat,
  Gauge,
} from 'lucide-react';

interface PlaybackControlsProps {
  currentStepIndex: number;
  totalSteps: number;
  isPlaying: boolean;
  onPlayPause: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  onJumpStart: () => void;
  onJumpEnd: () => void;
  onScrub: (index: number) => void;
  speed: number;
  setSpeed: (speed: number) => void;
  isLooping: boolean;
  setIsLooping: (loop: boolean) => void;
}

export const PlaybackControls: React.FC<PlaybackControlsProps> = ({
  currentStepIndex,
  totalSteps,
  isPlaying,
  onPlayPause,
  onStepForward,
  onStepBackward,
  onJumpStart,
  onJumpEnd,
  onScrub,
  speed,
  setSpeed,
  isLooping,
  setIsLooping,
}) => {
  const speeds = [0.5, 1, 1.5, 2, 4];

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-3">
      {/* Top scrubber row */}
      <div className="flex items-center gap-3">
        <span className="font-mono text-xs tabular-nums text-slate-500 font-semibold min-w-[70px]">
          Step {Math.min(currentStepIndex + 1, totalSteps)} / {totalSteps}
        </span>

        <input
          type="range"
          min={0}
          max={Math.max(0, totalSteps - 1)}
          value={currentStepIndex}
          onChange={(e) => onScrub(Number(e.target.value))}
          className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
        />

        <span className="text-xs font-mono text-slate-600 font-medium">
          {totalSteps > 0 ? Math.round(((currentStepIndex + 1) / totalSteps) * 100) : 0}%
        </span>
      </div>

      {/* Control Buttons & Options Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
        {/* Main Transport Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={onJumpStart}
            disabled={currentStepIndex === 0}
            title="Jump to Start"
            className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <SkipBack className="w-4 h-4" />
          </button>
          <button
            onClick={onStepBackward}
            disabled={currentStepIndex === 0}
            title="Step Backward (Left Arrow)"
            className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={onPlayPause}
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-xs text-white bg-amber-600 hover:bg-amber-700 active:bg-amber-800 shadow-xs transition-colors whitespace-nowrap"
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Play Animation</span>
              </>
            )}
          </button>

          <button
            onClick={onStepForward}
            disabled={currentStepIndex >= totalSteps - 1}
            title="Step Forward (Right Arrow)"
            className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={onJumpEnd}
            disabled={currentStepIndex >= totalSteps - 1}
            title="Jump to End"
            className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        {/* Speed and Loop Controls */}
        <div className="flex items-center gap-4">
          {/* Speed Selector */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Gauge className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[11px]">Speed:</span>
            <div className="flex items-center bg-slate-100 rounded-md p-0.5">
              {speeds.map((s) => (
                <button
                  key={s}
                  onClick={() => setSpeed(s)}
                  className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
                    speed === s
                      ? 'bg-white text-slate-900 font-semibold shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>

          {/* Loop Toggle */}
          <button
            onClick={() => setIsLooping(!isLooping)}
            title="Repeat loop when animation reaches end"
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
              isLooping
                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Repeat className="w-3.5 h-3.5" />
            <span>Loop</span>
          </button>
        </div>
      </div>
    </div>
  );
};
