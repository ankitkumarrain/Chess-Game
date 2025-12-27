
import React, { useRef, useEffect, useState } from 'react';
import { Chess } from 'chess.js';
import { Difficulty } from '../types';
import { audio } from '../logic/audio';
import { getStats, resetStats } from '../logic/stats';

interface SidebarProps {
  game: Chess;
  difficulty: Difficulty;
  setDifficulty: (d: Difficulty) => void;
  terminalLogs: string[];
  history: string[];
  onUndo: () => void;
  onReset: () => void;
  playerColor: 'w' | 'b';
  setPlayerColor: (c: 'w' | 'b') => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  game,
  difficulty,
  setDifficulty,
  terminalLogs,
  history,
  onUndo,
  onReset,
  playerColor,
  setPlayerColor
}) => {
  const [showStats, setShowStats] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalLogs]);

  const stats = getStats();
  const winRate = stats.gamesPlayed > 0 ? ((stats.wins / stats.gamesPlayed) * 100).toFixed(1) : 0;

  const isGameOver = game.isGameOver();
  const status = isGameOver 
    ? (game.isCheckmate() ? 'CHECKMATE' : 'DRAW')
    : (game.inCheck() ? 'CHECK' : `${game.turn() === 'w' ? 'WHITE' : 'BLACK'}'S TURN`);

  return (
    <div className="w-full lg:w-96 bg-slate-900 border-l border-slate-800 flex flex-col h-full overflow-hidden shadow-2xl z-10">
      <div className="p-6 border-b border-slate-800 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-black mono tracking-tighter text-emerald-500">SHELL_CHESS_v1</h1>
          <p className="text-[10px] text-slate-500 font-medium">ENGINE ACTIVE_</p>
        </div>
        <button 
          onClick={() => { setSoundEnabled(!soundEnabled); audio.setEnabled(!soundEnabled); }}
          className={`p-2 rounded border border-slate-700 transition-colors ${soundEnabled ? 'text-emerald-500' : 'text-slate-600'}`}
        >
          {soundEnabled ? '🔈' : '🔇'}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {showStats ? (
          <div className="p-6 space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
              <h3 className="mono font-bold text-slate-300">PLAYER_PERFORMANCE</h3>
              <button onClick={() => setShowStats(false)} className="text-[10px] mono text-emerald-500 underline">CLOSE</button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-slate-800/50 rounded border border-slate-700">
                <span className="block text-[8px] text-slate-500 uppercase">Win Rate</span>
                <span className="text-lg font-bold mono text-emerald-400">{winRate}%</span>
              </div>
              <div className="p-3 bg-slate-800/50 rounded border border-slate-700">
                <span className="block text-[8px] text-slate-500 uppercase">Games</span>
                <span className="text-lg font-bold mono">{stats.gamesPlayed}</span>
              </div>
              <div className="p-3 bg-slate-800/50 rounded border border-slate-700">
                <span className="block text-[8px] text-slate-500 uppercase">Wins</span>
                <span className="text-lg font-bold mono text-emerald-500">{stats.wins}</span>
              </div>
              <div className="p-3 bg-slate-800/50 rounded border border-slate-700">
                <span className="block text-[8px] text-slate-500 uppercase">Losses</span>
                <span className="text-lg font-bold mono text-red-400">{stats.losses}</span>
              </div>
            </div>
            <button 
              onClick={() => { if(confirm('Wipe stats?')) { resetStats(); window.location.reload(); }}}
              className="w-full py-2 text-[10px] mono text-red-500 border border-red-500/20 rounded hover:bg-red-500/5"
            >
              RESET_ALL_DATA
            </button>
          </div>
        ) : (
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-slate-700">
              <span className="text-[10px] font-bold mono text-slate-400">STATUS</span>
              <span className={`text-sm font-black mono ${isGameOver ? 'text-red-500' : 'text-emerald-400'}`}>
                {status}
              </span>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold mono text-slate-500 tracking-widest uppercase">Engine Difficulty</label>
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 4].map((d) => (
                  <button key={d} onClick={() => setDifficulty(d as Difficulty)} className={`py-2 px-1 rounded text-xs mono border transition-all ${difficulty === d ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500'}`}>LVL{d}</button>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <button onClick={() => setPlayerColor('w')} className={`flex-1 py-2 rounded text-xs mono border ${playerColor === 'w' ? 'bg-slate-100 text-slate-900 font-bold border-white' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>WHITE</button>
              <button onClick={() => setPlayerColor('b')} className={`flex-1 py-2 rounded text-xs mono border ${playerColor === 'b' ? 'bg-slate-800 text-slate-100 font-bold border-slate-500' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>BLACK</button>
            </div>

            <div className="h-48 bg-slate-950 rounded border border-slate-800 flex flex-col overflow-hidden font-mono text-[10px]">
              <div className="p-2 border-b border-slate-800 text-slate-500 flex justify-between">
                <span>TERMINAL_LOG</span>
                <span onClick={() => setShowStats(true)} className="cursor-pointer text-emerald-500 hover:underline">VIEW_STATS</span>
              </div>
              <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
                {terminalLogs.map((log, i) => (
                  <div key={i} className={log.includes('MOVE') ? 'text-emerald-400' : 'text-slate-500'}>{log}</div>
                ))}
                <div ref={logEndRef} />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-6 border-t border-slate-800 space-y-3">
        <div className="flex gap-2">
          <button onClick={onUndo} disabled={history.length === 0} className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-[10px] font-bold mono rounded border border-slate-700">UNDO</button>
          <button onClick={onReset} className="flex-1 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 text-[10px] font-bold mono rounded border border-red-500/30">RESET</button>
        </div>
        <p className="text-[9px] text-center text-slate-600 mono truncate">{game.fen()}</p>
      </div>
    </div>
  );
};

export default Sidebar;
