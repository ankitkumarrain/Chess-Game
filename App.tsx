
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Chess } from 'chess.js';
import ChessBoard from './components/ChessBoard';
import Sidebar from './components/Sidebar';
import SplashScreen from './components/SplashScreen';
import WinnerDashboard from './components/WinnerDashboard';
import { getBestMove } from './logic/ai';
import { Difficulty, GameResult } from './types';
import { saveGameResult } from './logic/stats';
import { audio } from './logic/audio';
import confetti from 'canvas-confetti';

const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [game, setGame] = useState(new Chess());
  const [gameStartTime, setGameStartTime] = useState(Date.now());
  const [gameResult, setGameResult] = useState<GameResult | null>(null);
  
  const initialDifficulty = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    return (parseInt(params.get('ai_level') || '2')) as Difficulty;
  }, []);

  const [difficulty, setDifficulty] = useState<Difficulty>(initialDifficulty);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [playerColor, setPlayerColor] = useState<'w' | 'b'>('w');
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    '$ shell-chess --init',
    '$ Loading engine v1.2.4... OK',
  ]);

  const logToTerminal = (msg: string) => {
    setTerminalLogs(prev => [...prev.slice(-30), `$ ${msg}`]);
  };

  const handleGameEnd = useCallback((winner: any, reason: any) => {
    const duration = Math.floor((Date.now() - gameStartTime) / 1000);
    const result: GameResult = {
      winner,
      reason,
      moves: game.history().length,
      duration
    };
    setGameResult(result);
    saveGameResult(result, difficulty);
    audio.gameEnd();
  }, [game, gameStartTime, difficulty]);

  const makeMove = useCallback((move: any) => {
    try {
      const isCapture = !!game.get(move.to);
      const result = game.move(move);
      if (result) {
        setGame(new Chess(game.fen()));
        setMoveHistory(game.history());
        logToTerminal(`MOVE: ${result.san} [${result.color}]`);
        
        // Sound effects
        if (game.isCheckmate() || game.inCheck()) audio.check();
        else if (isCapture) audio.capture();
        else audio.move();

        if (game.isGameOver()) {
          const winner = game.isCheckmate() ? (game.turn() === 'w' ? 'b' : 'w') : 'draw';
          const reason = game.isCheckmate() ? 'checkmate' : 'draw';
          handleGameEnd(winner, reason);
          if (winner === 'w') confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
        }
        
        return true;
      }
    } catch (e) {
      logToTerminal('ERR: INVALID_MOVE');
      return false;
    }
    return false;
  }, [game, handleGameEnd]);

  const resetGame = () => {
    setGame(new Chess());
    setGameResult(null);
    setMoveHistory([]);
    setGameStartTime(Date.now());
    logToTerminal('$ systemctl restart session');
  };

  useEffect(() => {
    if (!showSplash && !gameResult && game.turn() !== playerColor && !game.isGameOver()) {
      setIsAiThinking(true);
      const timer = setTimeout(() => {
        const bestMove = getBestMove(game, difficulty);
        if (bestMove) makeMove(bestMove);
        setIsAiThinking(false);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [game, playerColor, difficulty, makeMove, showSplash, gameResult]);

  if (showSplash) return <SplashScreen onFinish={() => setShowSplash(false)} />;

  return (
    <div className="flex flex-col lg:flex-row h-screen w-screen bg-slate-950 text-slate-200 overflow-hidden fade-in">
      {gameResult && (
        <WinnerDashboard 
          result={gameResult}
          onRematch={resetGame}
          onNext={() => { resetGame(); setShowSplash(true); }}
          onDifficulty={() => { resetGame(); /* Logic for modal if added */ }}
        />
      )}
      
      <div className="flex-1 flex items-center justify-center p-2 lg:p-8 bg-slate-950">
        <div className="relative group">
          <div className="absolute -inset-2 bg-emerald-500/10 rounded-lg blur-xl"></div>
          <div className="relative bg-slate-900/40 p-1 lg:p-4 rounded-xl border border-slate-800">
            <ChessBoard 
              game={game} 
              onMove={makeMove} 
              playerColor={playerColor} 
              isThinking={isAiThinking}
            />
          </div>
        </div>
      </div>

      <Sidebar 
        game={game}
        difficulty={difficulty}
        setDifficulty={setDifficulty}
        terminalLogs={terminalLogs}
        history={moveHistory}
        onUndo={() => { game.undo(); game.undo(); setGame(new Chess(game.fen())); }}
        onReset={resetGame}
        playerColor={playerColor}
        setPlayerColor={setPlayerColor}
      />
    </div>
  );
};

export default App;
