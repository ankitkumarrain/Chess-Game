
import React from 'react';
import { GameResult } from '../types';

interface WinnerDashboardProps {
  result: GameResult;
  onRematch: () => void;
  onNext: () => void;
  onDifficulty: () => void;
}

const WinnerDashboard: React.FC<WinnerDashboardProps> = ({ result, onRematch, onNext, onDifficulty }) => {
  const isWin = result.winner === 'w';
  const isDraw = result.winner === 'draw';

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 p-8 rounded-2xl shadow-2xl max-w-md w-full animate-fade-in text-center space-y-6">
        <div className="text-emerald-500 font-mono">
          <pre className="text-[8px] leading-tight mb-4 inline-block">
{`      ___________
     '._==_==_==_.'
     .-\\:      /-.
    | (|:.     |) |
     '-|:.     |-'
       \\::.    /
        '::. .'
          ) (
        _.' '._
       '-------'`}
          </pre>
          <h2 className="text-3xl font-black tracking-tighter uppercase italic">
            {isDraw ? 'STALEMATE' : isWin ? 'YOU WON' : 'AI VICTORIOUS'}
          </h2>
          <p className="text-slate-400 text-xs mono mt-1">
            TERMINATED VIA {result.reason.toUpperCase()}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-800 mono">
          <div className="text-left">
            <span className="text-slate-500 text-[10px] block uppercase">Moves Played</span>
            <span className="text-slate-200 text-xl font-bold">{result.moves}</span>
          </div>
          <div className="text-left">
            <span className="text-slate-500 text-[10px] block uppercase">Time Elapsed</span>
            <span className="text-slate-200 text-xl font-bold">{Math.floor(result.duration / 60)}m {result.duration % 60}s</span>
          </div>
        </div>

        <div className="space-y-3 pt-4">
          <button 
            onClick={onRematch}
            className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black mono rounded transition-all active:scale-95"
          >
            ▶ REMATCH
          </button>
          <button 
            onClick={onNext}
            className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold mono rounded border border-slate-700 transition-all"
          >
            🔁 PLAY NEXT GAME
          </button>
          <div className="flex gap-3">
            <button onClick={onDifficulty} className="flex-1 py-2 bg-slate-800/50 hover:bg-slate-800 text-slate-400 text-[10px] font-bold mono rounded border border-slate-700">
              GEAR DIFFICULTY
            </button>
            <button onClick={() => window.location.reload()} className="flex-1 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 text-[10px] font-bold mono rounded border border-red-500/30">
              EXIT TERMINAL
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WinnerDashboard;
