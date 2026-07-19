export type ScreenName =
'home' |
'modeSelect' |
'characters' |
'guide' |
'playing' |
'roundSummary' |
'finalSummary';

export type GameMode = 'multiplayer' | 'solo' | 'endless' | 'story' | 'daily';

export type StarRating = 0 | 1 | 2 | 3;

export interface StoryChapter {
  id: number;
  title: string;
  intro: string;
  targetScore: number;
  emoji: string;
}

export type TileCategory =
'knowledge' // kiến thức lý thuyết (giá trị, lao động...)
| 'event' // ô sự kiện
| 'luck' // ô may mắn
| 'challenge' // ô thử thách
| 'reward' // ô thưởng
| 'penalty' // ô phạt
| 'move' // ô dịch chuyển / đổi vị trí
| 'double' // nhân đôi điểm
| 'skip' // mất lượt
| 'boss' // ô boss
| 'start'; // ô xuất phát

export interface DecisionOption {
  label: string;
  detail: string;
  knowledge?: number;
  assets?: number;
  strategy?: number;
  skipNext?: boolean;
  /** true nếu đây là lựa chọn tối ưu về mặt kinh tế */
  optimal?: boolean;
  outcome: string;
}

export interface Tile {
  id: number;
  name: string;
  category: TileCategory;
  icon: string; // lucide icon name key
  color: string; // tailwind gradient-ish accent
  /** kiến thức kinh tế ngắn gọn */
  knowledge?: string;
  /** câu chuyện ngắn minh hoạ */
  story?: string;
  /** lựa chọn quyết định (nếu có) */
  options?: DecisionOption[];
  /** phần thưởng/hình phạt cố định cho ô không có quyết định */
  fixed?: {
    knowledge?: number;
    assets?: number;
    strategy?: number;
    skipNext?: boolean;
    teleportTo?: number;
    text: string;
  };
}

export interface Character {
  id: string;
  name: string;
  title: string;
  color: string; // hex
  accent: string; // tailwind text color
  emoji: string;
  blurb: string;
}

export interface PlayerStats {
  tilesMoved: number;
  eventsHandled: number;
  miniGameWins: number;
  correctAnswers: number;
  optimalDecisions: number;
}

export interface Player {
  id: number;
  name: string;
  character: Character;
  position: number;
  knowledge: number; // điểm kiến thức
  assets: number; // điểm tài sản
  strategy: number; // điểm chiến lược
  miniScore: number; // điểm mini game tích luỹ
  skipTurns: number;
  stats: PlayerStats;
  /** lịch sử tổng điểm theo vòng để vẽ biểu đồ */
  history: number[];
}

export type MiniGameId =
'quiz' |
'match' |
'reflex' |
'wheel' |
'memory';

export interface RoundResult {
  round: number;
  boardScores: Record<number, number>;
  miniScores: Record<number, number>;
  miniGame: MiniGameId;
  ranking: number[]; // player ids ordered best -> worst
}

export interface GameConfig {
  totalRounds: number;
}