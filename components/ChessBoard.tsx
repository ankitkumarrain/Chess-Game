import React, { useState, useCallback } from 'react';
import { Chess, Square } from 'chess.js';

interface ChessBoardProps {
  game: Chess;
  onMove: (move: any) => boolean;
  playerColor: 'w' | 'b';
  isThinking: boolean;
}

const PIECE_IMAGES: Record<string, string> = {
  wP: 'https://upload.wikimedia.org/wikipedia/commons/4/45/Chess_plt45.svg',
  wN: 'https://upload.wikimedia.org/wikipedia/commons/7/70/Chess_nlt45.svg',
  wB: 'https://upload.wikimedia.org/wikipedia/commons/b/b1/Chess_blt45.svg',
  wR: 'https://upload.wikimedia.org/wikipedia/commons/7/72/Chess_rlt45.svg',
  wQ: 'https://upload.wikimedia.org/wikipedia/commons/1/15/Chess_qlt45.svg',
  wK: 'https://upload.wikimedia.org/wikipedia/commons/4/42/Chess_klt45.svg',
  bP: 'https://upload.wikimedia.org/wikipedia/commons/c/c7/Chess_pdt45.svg',
  bN: 'https://upload.wikimedia.org/wikipedia/commons/e/ef/Chess_ndt45.svg',
  bB: 'https://upload.wikimedia.org/wikipedia/commons/9/98/Chess_bdt45.svg',
  bR: 'https://upload.wikimedia.org/wikipedia/commons/f/ff/Chess_rdt45.svg',
  bQ: 'https://upload.wikimedia.org/wikipedia/commons/4/47/Chess_qdt45.svg',
  bK: 'https://upload.wikimedia.org/wikipedia/commons/f/f0/Chess_kdt45.svg',
};

const ChessBoard: React.FC<ChessBoardProps> = ({ game, onMove, playerColor, isThinking }) => {
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [legalMoves, setLegalMoves] = useState<Square[]>([]);
  const [isInvalid, setIsInvalid] = useState(false);

  const board = game.board();
  const lastMove = game.history({ verbose: true }).pop();

  const handleSquareClick = (square: Square) => {
    if (isThinking || game.isGameOver()) return;

    if (selectedSquare === square) {
      setSelectedSquare(null);
      setLegalMoves([]);
      return;
    }

    if (selectedSquare && legalMoves.includes(square)) {
      const success = onMove({ from: selectedSquare, to: square, promotion: 'q' });
      if (success) {
        setSelectedSquare(null);
        setLegalMoves([]);
      }
      return;
    }

    const piece = game.get(square);
    if (piece && piece.color === game.turn()) {
      setSelectedSquare(square);
      const moves = game.moves({ square, verbose: true }).map(m => m.to as Square);
      setLegalMoves(moves);
    } else {
      // User clicked an invalid square (not their piece, and not a legal move target)
      setIsInvalid(true);
      setTimeout(() => setIsInvalid(false), 300);
      setSelectedSquare(null);
      setLegalMoves([]);
    }
  };

  const rows = playerColor === 'w' ? [0, 1, 2, 3, 4, 5, 6, 7] : [7, 6, 5, 4, 3, 2, 1, 0];
  const cols = playerColor === 'w' ? [0, 1, 2, 3, 4, 5, 6, 7] : [7, 6, 5, 4, 3, 2, 1, 0];

  return (
    <div className={`grid grid-cols-8 grid-rows-8 w-[92vw] h-[92vw] sm:w-[480px] sm:h-[480px] lg:w-[620px] lg:h-[620px] border-2 border-slate-700/50 select-none shadow-inner rounded-sm bg-slate-900 overflow-hidden ${isInvalid ? 'shake' : ''}`}>
      {rows.map((row) => 
        cols.map((col) => {
          const squareName = String.fromCharCode(97 + col) + (8 - row) as Square;
          const piece = board[row][col];
          const isDark = (row + col) % 2 === 1;
          const isSelected = selectedSquare === squareName;
          const isLegal = legalMoves.includes(squareName);
          const isLastMove = lastMove && (lastMove.from === squareName || lastMove.to === squareName);
          const isCheck = game.inCheck() && piece?.type === 'k' && piece?.color === game.turn();

          return (
            <div
              key={squareName}
              onClick={() => handleSquareClick(squareName)}
              className={`
                relative flex items-center justify-center cursor-pointer
                ${isDark ? 'bg-slate-800/80' : 'bg-slate-300/90'}
                ${isLastMove ? 'bg-yellow-400/30' : ''}
                ${isSelected ? 'bg-emerald-400/40' : ''}
                ${isCheck ? 'bg-red-500/40' : ''}
                hover:brightness-110 transition-all duration-150
              `}
            >
              {piece && (
                <img 
                  src={PIECE_IMAGES[`${piece.color}${piece.type.toUpperCase()}`]} 
                  className={`w-[82%] h-[82%] drop-shadow-xl piece-transition ${isSelected ? 'scale-125 -translate-y-2' : ''} ${isThinking ? 'opacity-70 grayscale-[0.2]' : ''}`}
                  alt={piece.type}
                />
              )}
              {isLegal && !piece && (
                <div className="w-4 h-4 rounded-full bg-emerald-500/20 border border-emerald-500/40" />
              )}
              {isLegal && piece && (
                <div className="absolute inset-0 border-[6px] border-emerald-500/30 rounded-full scale-90" />
              )}
              
              {/* Labels */}
              {col === 0 && (
                <span className={`absolute left-0.5 top-0.5 text-[8px] sm:text-[9px] font-black mono ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  {8 - row}
                </span>
              )}
              {row === 7 && (
                <span className={`absolute right-0.5 bottom-0.5 text-[8px] sm:text-[9px] font-black mono ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  {String.fromCharCode(97 + col)}
                </span>
              )}
            </div>
          );
        })
      )}
    </div>
  );
};

export default ChessBoard;