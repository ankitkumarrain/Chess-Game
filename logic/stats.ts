
import { PlayerStats, GameResult } from '../types';

const STORAGE_KEY = 'shell_chess_stats_v1';

const defaultStats: PlayerStats = {
  gamesPlayed: 0,
  wins: 0,
  losses: 0,
  draws: 0,
  totalMoves: 0,
  totalDurationSeconds: 0,
  difficultyHistory: {}
};

export function getStats(): PlayerStats {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : defaultStats;
}

export function saveGameResult(result: GameResult, difficulty: number) {
  const stats = getStats();
  stats.gamesPlayed += 1;
  if (result.winner === 'w') stats.wins += 1;
  else if (result.winner === 'b') stats.losses += 1;
  else stats.draws += 1;

  stats.totalMoves += result.moves;
  stats.totalDurationSeconds += result.duration;
  
  stats.difficultyHistory[difficulty] = (stats.difficultyHistory[difficulty] || 0) + 1;

  localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
}

export function resetStats() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultStats));
}
