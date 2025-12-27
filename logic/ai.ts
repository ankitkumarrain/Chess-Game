import { Chess } from 'chess.js';
import { Difficulty } from '../types';

// Positional importance tables (bonus for centralization and forward progress)
const PST: Record<string, number[][]> = {
  p: [
    [0,  0,  0,  0,  0,  0,  0,  0],
    [50, 50, 50, 50, 50, 50, 50, 50],
    [10, 10, 20, 30, 30, 20, 10, 10],
    [5,  5, 10, 25, 25, 10,  5,  5],
    [0,  0,  0, 20, 20,  0,  0,  0],
    [5, -5,-10,  0,  0,-10, -5,  5],
    [5, 10, 10,-20,-20, 10, 10,  5],
    [0,  0,  0,  0,  0,  0,  0,  0]
  ],
  n: [
    [-50,-40,-30,-30,-30,-30,-40,-50],
    [-40,-20,  0,  0,  0,  0,-20,-40],
    [-30,  0, 10, 15, 15, 10,  0,-30],
    [-30,  5, 15, 20, 20, 15,  5,-30],
    [-30,  0, 15, 20, 20, 15,  0,-30],
    [-30,  5, 10, 15, 15, 10,  5,-30],
    [-40,-20,  0,  5,  5,  0,-20,-40],
    [-50,-40,-30,-30,-30,-30,-40,-50]
  ],
  k: [
    [-30, -40, -40, -50, -50, -40, -40, -30],
    [-30, -40, -40, -50, -50, -40, -40, -30],
    [-30, -40, -40, -50, -50, -40, -40, -30],
    [-30, -40, -40, -50, -50, -40, -40, -30],
    [-20, -30, -30, -40, -40, -30, -30, -20],
    [-10, -20, -20, -20, -20, -20, -20, -10],
    [ 20,  20,   0,   0,   0,   0,  20,  20],
    [ 20,  30,  10,   0,   0,  10,  30,  20]
  ]
};

const PIECE_VALUES: Record<string, number> = {
  p: 100, n: 320, b: 330, r: 500, q: 900, k: 20000
};

function evaluateBoard(game: Chess): number {
  let totalEval = 0;
  const board = game.board();

  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      const piece = board[i][j];
      if (piece) {
        let val = PIECE_VALUES[piece.type] || 0;
        
        // Positional bonus
        const table = PST[piece.type];
        if (table) {
          const row = piece.color === 'w' ? 7 - i : i;
          val += table[row][j];
        }

        totalEval += piece.color === 'w' ? val : -val;
      }
    }
  }
  return totalEval;
}

function minimax(game: Chess, depth: number, alpha: number, beta: number, isMaximizing: boolean): number {
  if (depth === 0) return -evaluateBoard(game);

  const moves = game.moves();
  if (moves.length === 0) {
    if (game.inCheck()) return isMaximizing ? -100000 : 100000;
    return 0; // Draw
  }

  if (isMaximizing) {
    let best = -Infinity;
    for (const move of moves) {
      game.move(move);
      best = Math.max(best, minimax(game, depth - 1, alpha, beta, !isMaximizing));
      game.undo();
      alpha = Math.max(alpha, best);
      if (beta <= alpha) break;
    }
    return best;
  } else {
    let best = Infinity;
    for (const move of moves) {
      game.move(move);
      best = Math.min(best, minimax(game, depth - 1, alpha, beta, !isMaximizing));
      game.undo();
      beta = Math.min(beta, best);
      if (beta <= alpha) break;
    }
    return best;
  }
}

export function getBestMove(game: Chess, difficulty: Difficulty): string | null {
  const possibleMoves = game.moves();
  if (possibleMoves.length === 0) return null;

  if (difficulty === Difficulty.EASY) {
    // 80% Random, 20% Simple Best (to feel like a "blundering" AI)
    if (Math.random() > 0.2) {
      return possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
    }
  }

  const depth = difficulty; // Use difficulty as depth directly for simplicity
  let bestMove = null;
  let bestValue = game.turn() === 'w' ? -Infinity : Infinity;

  // Simple move ordering: favor captures
  possibleMoves.sort((a, b) => (b.includes('x') ? 1 : -1));

  for (const move of possibleMoves) {
    game.move(move);
    const val = minimax(game, depth - 1, -Infinity, Infinity, game.turn() === 'w');
    game.undo();

    if (game.turn() === 'w') {
      if (val > bestValue) {
        bestValue = val;
        bestMove = move;
      }
    } else {
      if (val < bestValue) {
        bestValue = val;
        bestMove = move;
      }
    }
  }

  return bestMove || possibleMoves[0];
}
