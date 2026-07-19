


import type { Player, MiniGameId } from './types';

export const MINI_GAMES: MiniGameId[] = ['quiz', 'match', 'reflex', 'wheel', 'memory'];

export const MINI_GAME_META: Record<MiniGameId, {name: string;desc: string;icon: string;}> = {
  quiz: { name: 'Trắc Nghiệm Nhanh', desc: 'Trả lời đúng và nhanh để ghi điểm', icon: 'ListChecks' },
  match: { name: 'Ghép Khái Niệm', desc: 'Nối khái niệm với định nghĩa đúng', icon: 'Link' },
  reflex: { name: 'Ai Nhanh Hơn', desc: 'Bấm đúng mục tiêu, tránh bẫy', icon: 'Zap' },
  wheel: { name: 'Vòng Quay May Mắn', desc: 'Quay và trả lời câu hỏi thưởng', icon: 'Disc3' },
  memory: { name: 'Memory Card', desc: 'Lật thẻ ghép cặp khái niệm', icon: 'LayoutGrid' }
};

export const RANK_POINTS = [100, 70, 40, 20];

/** Điểm bàn cờ của một người chơi = tri thức + tài sản + chiến lược */
export function boardScore(p: Player): number {
  return p.knowledge + p.assets + p.strategy;
}

/**
 * Tổng điểm cuối cùng theo trọng số:
 * 40% điểm bàn cờ + 40% điểm mini game + 20% thành tích đặc biệt (chiến lược*2 + quyết định tối ưu*5)
 */
export function totalScore(p: Player): number {
  const board = boardScore(p);
  const mini = p.miniScore;
  const special = p.strategy * 2 + p.stats.optimalDecisions * 5 + p.stats.miniGameWins * 8;
  return Math.round(board * 0.4 + mini * 0.4 + special * 0.2);
}

export function rankPlayers(players: Player[]): Player[] {
  return [...players].sort((a, b) => totalScore(b) - totalScore(a));
}

export const TITLES = [
{ id: 'investor', name: 'Nhà Đầu Tư', key: 'assets' as const, desc: 'Tài sản cao nhất' },
{ id: 'market', name: 'Chuyên Gia Thị Trường', key: 'strategy' as const, desc: 'Chiến lược sắc bén nhất' },
{ id: 'knowledge', name: 'Vua Tri Thức', key: 'knowledge' as const, desc: 'Tri thức uyên bác nhất' },
{ id: 'mini', name: 'Bậc Thầy Mini Game', key: 'miniScore' as const, desc: 'Điểm mini game cao nhất' }];


export function awardTitles(players: Player[]): Record<number, string[]> {
  const result: Record<number, string[]> = {};
  players.forEach((p) => result[p.id] = []);
  for (const t of TITLES) {
    let best = players[0];
    for (const p of players) {
      if (p[t.key] as number > (best[t.key] as number)) best = p;
    }
    if (best[t.key] as number > 0) result[best.id].push(t.name);
  }
  // Người cải cách: nhiều quyết định tối ưu nhất
  let reformer = players[0];
  for (const p of players) if (p.stats.optimalDecisions > reformer.stats.optimalDecisions) reformer = p;
  if (reformer.stats.optimalDecisions > 0) result[reformer.id].push('Người Cải Cách');
  return result;
}