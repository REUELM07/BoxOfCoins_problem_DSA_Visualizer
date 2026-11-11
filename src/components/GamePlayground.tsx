import React, { useState } from 'react';
import { getOptimalMove, solveDirect } from '../utils/boxOfCoinsEngine';
import { POPULAR_PRESETS } from '../utils/testCases';
import { Bot, User, RotateCcw, Lightbulb, Trophy, AlertCircle, ArrowLeft, ArrowRight } from 'lucide-react';

export const GamePlayground: React.FC = () => {
  const [selectedPreset, setSelectedPreset] = useState<number[]>(POPULAR_PRESETS[0].boxes);
  const [boxes, setBoxes] = useState<number[]>([...POPULAR_PRESETS[0].boxes]);
  const [leftIndex, setLeftIndex] = useState<number>(0);
  const [rightIndex, setRightIndex] = useState<number>(POPULAR_PRESETS[0].boxes.length - 1);
  const [alexScore, setAlexScore] = useState<number>(0);
  const [cindyScore, setCindyScore] = useState<number>(0);
  const [currentTurn, setCurrentTurn] = useState<'Alex' | 'Cindy'>('Alex');
  const [aiOpponent, setAiOpponent] = useState<boolean>(true);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [moveHistory, setMoveHistory] = useState<
    {
      player: 'Alex' | 'Cindy';
      choice: 'left' | 'right';
      value: number;
      optimal: boolean;
      hintReason: string;
    }[]
  >([]);

  const isGameOver = leftIndex > rightIndex;
  const theoreticalBestDiff = solveDirect(selectedPreset);

  const resetGame = (newPreset?: number[]) => {
    const arr = newPreset || selectedPreset;
    setSelectedPreset(arr);
    setBoxes([...arr]);
    setLeftIndex(0);
    setRightIndex(arr.length - 1);
    setAlexScore(0);
    setCindyScore(0);
    setCurrentTurn('Alex');
    setShowHint(false);
    setMoveHistory([]);
  };

  const handlePick = (choice: 'left' | 'right') => {
    if (isGameOver) return;

    const opt = getOptimalMove(boxes, leftIndex, rightIndex);
    const isOptimal = opt.choice === choice;
    const value = choice === 'left' ? boxes[leftIndex] : boxes[rightIndex];
    const newLeft = choice === 'left' ? leftIndex + 1 : leftIndex;
    const newRight = choice === 'right' ? rightIndex - 1 : rightIndex;

    const hintReason =
      choice === 'left'
        ? `Option Left net lead: ${opt.takeLeftNet} vs Right net lead: ${opt.takeRightNet}`
        : `Option Right net lead: ${opt.takeRightNet} vs Left net lead: ${opt.takeLeftNet}`;

    const newMove = {
      player: currentTurn,
      choice,
      value,
      optimal: isOptimal,
      hintReason,
    };

    const newAlexScore = currentTurn === 'Alex' ? alexScore + value : alexScore;
    const newCindyScore = currentTurn === 'Cindy' ? cindyScore + value : cindyScore;

    setAlexScore(newAlexScore);
    setCindyScore(newCindyScore);
    setLeftIndex(newLeft);
    setRightIndex(newRight);
    setMoveHistory((prev) => [...prev, newMove]);
    setShowHint(false);

    // If AI opponent is enabled and game is not over, make Cindy's move after short delay
    if (aiOpponent && currentTurn === 'Alex' && newLeft <= newRight) {
      setCurrentTurn('Cindy');
      setTimeout(() => {
        const cindyOpt = getOptimalMove(boxes, newLeft, newRight);
        const cindyChoice = cindyOpt.choice;
        const cindyVal = cindyChoice === 'left' ? boxes[newLeft] : boxes[newRight];
        const nextLeft = cindyChoice === 'left' ? newLeft + 1 : newLeft;
        const nextRight = cindyChoice === 'right' ? newRight - 1 : newRight;

        setCindyScore((prev) => prev + cindyVal);
        setLeftIndex(nextLeft);
        setRightIndex(nextRight);
        setMoveHistory((prev) => [
          ...prev,
          {
            player: 'Cindy',
            choice: cindyChoice,
            value: cindyVal,
            optimal: true,
            hintReason: `AI calculated optimal choice: ${cindyChoice.toUpperCase()} (Net: ${
              cindyChoice === 'left' ? cindyOpt.takeLeftNet : cindyOpt.takeRightNet
            })`,
          },
        ]);
        setCurrentTurn('Alex');
      }, 450);
    } else {
      setCurrentTurn(currentTurn === 'Alex' ? 'Cindy' : 'Alex');
    }
  };

  const currentOptimal = !isGameOver ? getOptimalMove(boxes, leftIndex, rightIndex) : null;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-6">
      {/* Top Bar: Title & Preset Selector */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Playable Game Sandbox: Alex vs Cindy
          </h2>
          <p className="text-xs text-slate-500">
            Test your intuition against the optimal Minimax Dynamic Programming engine
          </p>
        </div>

        {/* Preset Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Choose Setup:</span>
          <select
            value={JSON.stringify(selectedPreset)}
            onChange={(e) => resetGame(JSON.parse(e.target.value))}
            className="text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
          >
            {POPULAR_PRESETS.map((p) => (
              <option key={p.id} value={JSON.stringify(p.boxes)}>
                {p.label} (Expected diff: {p.expected})
              </option>
            ))}
          </select>

          <button
            onClick={() => resetGame()}
            title="Reset game board"
            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Opponent Mode Switch */}
      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-slate-700">Cindy's Controller:</span>
          <div className="flex items-center gap-1 bg-white p-0.5 rounded-md border border-slate-200">
            <button
              onClick={() => setAiOpponent(true)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs transition-colors ${
                aiOpponent ? 'bg-amber-100 text-amber-900 font-semibold' : 'text-slate-600'
              }`}
            >
              <Bot className="w-3.5 h-3.5" />
              <span>Optimal AI Bot</span>
            </button>
            <button
              onClick={() => setAiOpponent(false)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs transition-colors ${
                !aiOpponent ? 'bg-amber-100 text-amber-900 font-semibold' : 'text-slate-600'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Pass & Play (2 Players)</span>
            </button>
          </div>
        </div>

        <div className="text-slate-500">
          Theoretical Optimal Difference:{' '}
          <span className="font-mono font-bold text-slate-900">
            {theoreticalBestDiff > 0 ? `+${theoreticalBestDiff}` : theoreticalBestDiff}
          </span>
        </div>
      </div>

      {/* Scoreboard */}
      <div className="grid grid-cols-3 gap-3 text-center">
        {/* Alex Score */}
        <div
          className={`p-3 rounded-xl border transition-all ${
            currentTurn === 'Alex' && !isGameOver
              ? 'border-emerald-400 bg-emerald-50/70 shadow-xs'
              : 'border-slate-200 bg-slate-50'
          }`}
        >
          <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-emerald-800 mb-0.5">
            <User className="w-3.5 h-3.5" />
            <span>Alex (Player 1)</span>
          </div>
          <span className="text-xl font-bold font-mono text-emerald-950 tabular-nums">
            {alexScore}
          </span>
          {currentTurn === 'Alex' && !isGameOver && (
            <span className="block text-[10px] text-emerald-700 font-semibold mt-0.5">
              Your Turn
            </span>
          )}
        </div>

        {/* Lead Difference */}
        <div className="p-3 rounded-xl border border-amber-200 bg-amber-50/60 flex flex-col items-center justify-center">
          <span className="text-[11px] font-semibold text-amber-900">Score Lead (Alex - Cindy)</span>
          <span className="text-xl font-bold font-mono text-amber-950 tabular-nums">
            {alexScore - cindyScore > 0 ? `+${alexScore - cindyScore}` : alexScore - cindyScore}
          </span>
        </div>

        {/* Cindy Score */}
        <div
          className={`p-3 rounded-xl border transition-all ${
            currentTurn === 'Cindy' && !isGameOver
              ? 'border-purple-400 bg-purple-50/70 shadow-xs'
              : 'border-slate-200 bg-slate-50'
          }`}
        >
          <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-purple-800 mb-0.5">
            {aiOpponent ? <Bot className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
            <span>Cindy (Player 2)</span>
          </div>
          <span className="text-xl font-bold font-mono text-purple-950 tabular-nums">
            {cindyScore}
          </span>
          {currentTurn === 'Cindy' && !isGameOver && (
            <span className="block text-[10px] text-purple-700 font-semibold mt-0.5">
              {aiOpponent ? 'Thinking...' : 'Cindy\'s Turn'}
            </span>
          )}
        </div>
      </div>

      {/* Interactive Boxes Row */}
      <div className="py-6 flex flex-col items-center">
        {!isGameOver ? (
          <div className="space-y-4 w-full">
            <div className="flex items-center justify-center gap-3 overflow-x-auto py-4">
              {boxes.map((val, idx) => {
                const isLeftEdge = idx === leftIndex;
                const isRightEdge = idx === rightIndex;
                const isAvailable = idx >= leftIndex && idx <= rightIndex;

                if (!isAvailable) {
                  return (
                    <div
                      key={idx}
                      className="w-14 h-16 rounded-lg border border-dashed border-slate-200 bg-slate-100/50 flex flex-col items-center justify-center opacity-30 select-none"
                    >
                      <span className="text-xs font-mono text-slate-400">{val}</span>
                      <span className="text-[9px] text-slate-400">taken</span>
                    </div>
                  );
                }

                return (
                  <div key={idx} className="flex flex-col items-center gap-1.5">
                    {/* Action button if on active edge */}
                    <div className="h-6">
                      {isLeftEdge && (
                        <button
                          onClick={() => handlePick('left')}
                          className="px-2 py-0.5 text-[10px] font-bold text-white bg-sky-600 hover:bg-sky-700 active:bg-sky-800 rounded shadow-xs flex items-center gap-1 transition-all"
                        >
                          <ArrowLeft className="w-3 h-3" /> Pick Left
                        </button>
                      )}
                      {isRightEdge && !isLeftEdge && (
                        <button
                          onClick={() => handlePick('right')}
                          className="px-2 py-0.5 text-[10px] font-bold text-white bg-purple-600 hover:bg-purple-700 active:bg-purple-800 rounded shadow-xs flex items-center gap-1 transition-all"
                        >
                          Pick Right <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>

                    {/* Box */}
                    <div
                      className={`w-14 h-16 rounded-xl border-2 flex flex-col items-center justify-center transition-all ${
                        isLeftEdge || isRightEdge
                          ? 'border-amber-500 bg-amber-50 shadow-sm'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      <span className="text-xs">🪙</span>
                      <span className="font-mono font-bold text-sm text-slate-900 tabular-nums">
                        {val}
                      </span>
                      <span className="text-[9px] text-slate-500">idx {idx}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Hint & Strategy Assistance */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => setShowHint(!showHint)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-amber-900 bg-amber-100 hover:bg-amber-200 transition-colors"
              >
                <Lightbulb className="w-3.5 h-3.5 text-amber-700" />
                <span>{showHint ? 'Hide DP Algorithm Recommendation' : 'Ask DP Algorithm for Optimal Move'}</span>
              </button>

              {showHint && currentOptimal && (
                <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-950 font-medium">
                  DP recommends picking{' '}
                  <strong className="underline uppercase">{currentOptimal.choice} box ({currentOptimal.choice === 'left' ? currentOptimal.leftValue : currentOptimal.rightValue})</strong>.{' '}
                  (TakeLeft yields {currentOptimal.takeLeftNet}, TakeRight yields {currentOptimal.takeRightNet})
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Game Over Screen */
          <div className="text-center py-6 space-y-3">
            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
              <Trophy className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Game Over!</h3>
            <p className="text-sm text-slate-600">
              {alexScore > cindyScore
                ? `Alex won by +${alexScore - cindyScore} points!`
                : cindyScore > alexScore
                ? `Cindy won by +${cindyScore - alexScore} points!`
                : 'The game ended in an exact tie!'}
            </p>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs inline-block text-left space-y-1">
              <div>
                Your Final Lead (Alex - Cindy):{' '}
                <span className="font-mono font-bold">{alexScore - cindyScore}</span>
              </div>
              <div>
                Theoretical Maximum (C# Solve):{' '}
                <span className="font-mono font-bold text-amber-700">{theoreticalBestDiff}</span>
              </div>
              {alexScore - cindyScore === theoreticalBestDiff ? (
                <div className="text-emerald-700 font-semibold pt-1">
                  🌟 Perfect Play! You matched the theoretical optimal Minimax strategy!
                </div>
              ) : (
                <div className="text-rose-600 font-semibold pt-1">
                  ⚠️ Suboptimal choices were made! The theoretical maximum is higher.
                </div>
              )}
            </div>

            <div>
              <button
                onClick={() => resetGame()}
                className="px-4 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-xs"
              >
                Play Again
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Move History Log */}
      {moveHistory.length > 0 && (
        <div className="border-t border-slate-100 pt-4 space-y-2">
          <span className="text-xs font-semibold text-slate-700">Move History:</span>
          <div className="flex flex-wrap gap-2">
            {moveHistory.map((m, i) => (
              <div
                key={i}
                className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-0.5"
              >
                <div className="flex items-center gap-1 font-semibold text-slate-800">
                  <span className={m.player === 'Alex' ? 'text-emerald-700' : 'text-purple-700'}>
                    {m.player}
                  </span>
                  <span>took {m.choice.toUpperCase()} ({m.value})</span>
                  {m.optimal ? (
                    <span className="text-emerald-600 text-[10px]">✓</span>
                  ) : (
                    <span className="text-rose-500 text-[10px]">✕</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
