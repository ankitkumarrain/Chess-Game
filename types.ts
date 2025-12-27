
export type PieceSymbol = 'p' | 'n' | 'b' | 'r' | 'q' | 'k';
export type Color = 'w' | 'b';

export interface Move {
  from: string;
  to: string;
  promotion?: string;
}

export enum Difficulty {
  EASY = 1,
  MEDIUM = 2,
  HARD = 3,
  GRANDMASTER = 4
}

export interface PlayerStats {
  gamesPlayed: number;
  wins: number;
  losses: number;
  draws: number;
  totalMoves: number;
  totalDurationSeconds: number;
  difficultyHistory: Record<number, number>;
}

export interface GameResult {
  winner: Color | 'draw' | null;
  reason: 'checkmate' | 'stalemate' | 'draw' | 'resignation' | 'timeout';
  moves: number;
  duration: number;
}
