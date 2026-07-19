
import React, { createContext, useContext, useEffect, useReducer } from 'react';
import type { Character, Player, ScreenName, MiniGameId, RoundResult, Tile, GameMode } from './types';
import { BOARD_SIZE, TILES } from './data/tiles';
import { boardScore } from './logic';

const STORAGE_KEY = 'ctpb-save-v1';

export interface GameState {
  screen: ScreenName;
  gameMode: GameMode;
  totalRounds: number;
  round: number;
  players: Player[];
  currentPlayerIdx: number; // index within turnOrder
  turnOrder: number[]; // player ids
  // snapshot of board scores at round start (to compute per-round board delta)
  roundStartBoard: Record<number, number>;
  lastMiniGame: MiniGameId | null;
  roundResults: RoundResult[];
  playersCompletedThisRound: number;
  activeMiniGame: MiniGameId | null;
  // Single player specific
  survivalLives: number;       // Endless mode lives (0-3)
  dailySeed: string;           // Daily challenge seed (YYYY-MM-DD)
  storyChapterId: number;      // Story mode chapter (1-3)
  soloTargetScore: number;     // Solo campaign target
}

function freshPlayer(id: number, character: Character, name: string): Player {
  return {
    id,
    name,
    character,
    position: 0,
    knowledge: 0,
    assets: 30,
    strategy: 0,
    miniScore: 0,
    skipTurns: 0,
    stats: { tilesMoved: 0, eventsHandled: 0, miniGameWins: 0, correctAnswers: 0, optimalDecisions: 0 },
    history: []
  };
}

const initialState: GameState = {
  screen: 'home',
  gameMode: 'multiplayer',
  totalRounds: 5,
  round: 1,
  players: [],
  currentPlayerIdx: 0,
  turnOrder: [0, 1, 2, 3],
  roundStartBoard: {},
  lastMiniGame: null,
  roundResults: [],
  playersCompletedThisRound: 0,
  activeMiniGame: null,
  survivalLives: 3,
  dailySeed: '',
  storyChapterId: 1,
  soloTargetScore: 400,
};

type Action =
{type: 'SET_SCREEN';screen: ScreenName;} |
{type: 'SET_MODE';mode: GameMode;} |
{type: 'START_GAME';players: {character: Character;name: string;}[];totalRounds: number;turnOrder: number[];gameMode?: GameMode;soloTargetScore?: number;dailySeed?: string;storyChapterId?: number;} |
{type: 'MOVE_PLAYER';playerId: number;position: number;tilesMoved: number;} |
{type: 'APPLY_EFFECT';playerId: number;knowledge?: number;assets?: number;strategy?: number;skipNext?: boolean;optimal?: boolean;event?: boolean;teleportTo?: number;} |
{type: 'DECREMENT_SKIP';playerId: number;} |
{type: 'SWAP_POSITIONS';playerId: number;otherId: number;} |
{type: 'END_TURN';} |
{type: 'START_MINIGAME';game: MiniGameId;} |
{type: 'FINISH_MINIGAME';ranking: number[];correctBonus?: Record<number, number>;} |
{type: 'NEXT_ROUND';} |
{type: 'GO_FINAL';} |
{type: 'LOSE_LIFE';} |
{type: 'NEXT_STORY_CHAPTER';} |
{type: 'RESET';} |
{type: 'LOAD';state: GameState;};

function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'SET_SCREEN':
      return { ...state, screen: action.screen };

    case 'SET_MODE':
      return { ...state, gameMode: action.mode };

    case 'START_GAME':{
        const players = action.players.map((p, i) => freshPlayer(i, p.character, p.name));
        const roundStartBoard: Record<number, number> = {};
        players.forEach((p) => roundStartBoard[p.id] = boardScore(p));
        const mode = action.gameMode ?? state.gameMode;
        return {
          ...initialState,
          screen: 'playing',
          gameMode: mode,
          totalRounds: action.totalRounds,
          players,
          turnOrder: action.turnOrder,
          roundStartBoard,
          currentPlayerIdx: 0,
          round: 1,
          survivalLives: mode === 'endless' ? 3 : 0,
          dailySeed: action.dailySeed ?? '',
          storyChapterId: action.storyChapterId ?? 1,
          soloTargetScore: action.soloTargetScore ?? 400,
        };
      }

    case 'MOVE_PLAYER':
      return {
        ...state,
        players: state.players.map((p) =>
        p.id === action.playerId ?
        { ...p, position: action.position, stats: { ...p.stats, tilesMoved: p.stats.tilesMoved + action.tilesMoved } } :
        p
        )
      };

    case 'APPLY_EFFECT':
      return {
        ...state,
        players: state.players.map((p) => {
          if (p.id !== action.playerId) return p;
          return {
            ...p,
            knowledge: Math.max(0, p.knowledge + (action.knowledge || 0)),
            assets: Math.max(0, p.assets + (action.assets || 0)),
            strategy: Math.max(0, p.strategy + (action.strategy || 0)),
            skipTurns: action.skipNext ? p.skipTurns + 1 : p.skipTurns,
            position: action.teleportTo != null ? action.teleportTo : p.position,
            stats: {
              ...p.stats,
              eventsHandled: action.event ? p.stats.eventsHandled + 1 : p.stats.eventsHandled,
              optimalDecisions: action.optimal ? p.stats.optimalDecisions + 1 : p.stats.optimalDecisions
            }
          };
        })
      };

    case 'DECREMENT_SKIP':
      return {
        ...state,
        players: state.players.map((p) =>
        p.id === action.playerId ? { ...p, skipTurns: Math.max(0, p.skipTurns - 1) } : p
        )
      };

    case 'SWAP_POSITIONS':{
        const a = state.players.find((p) => p.id === action.playerId);
        const b = state.players.find((p) => p.id === action.otherId);
        if (!a || !b) return state;
        return {
          ...state,
          players: state.players.map((p) =>
          p.id === a.id ? { ...p, position: b.position } : p.id === b.id ? { ...p, position: a.position } : p
          )
        };
      }

    case 'END_TURN':{
        const completed = state.playersCompletedThisRound + 1;
        const nextIdx = (state.currentPlayerIdx + 1) % state.turnOrder.length;
        return { ...state, currentPlayerIdx: nextIdx, playersCompletedThisRound: completed };
      }

    case 'START_MINIGAME':
      return { ...state, activeMiniGame: action.game, lastMiniGame: action.game };

    case 'FINISH_MINIGAME':{
        const isSolo = state.gameMode !== 'multiplayer';
        const rankPoints = isSolo ? [150, 70, 40, 20] : [100, 70, 40, 20];
        const miniScores: Record<number, number> = {};
        const boardScores: Record<number, number> = {};
        const players = state.players.map((p) => {
          const rank = action.ranking.indexOf(p.id);
          const gained = rank >= 0 ? rankPoints[rank] : 0;
          const bonus = action.correctBonus?.[p.id] || 0;
          miniScores[p.id] = gained + bonus;
          boardScores[p.id] = boardScore(p) - (state.roundStartBoard[p.id] || 0);
          const isWin = rank === 0;
          return {
            ...p,
            miniScore: p.miniScore + gained + bonus,
            stats: { ...p.stats, miniGameWins: p.stats.miniGameWins + (isWin ? 1 : 0) }
          };
        });
        const result: RoundResult = {
          round: state.round,
          boardScores,
          miniScores,
          miniGame: state.activeMiniGame || 'quiz',
          ranking: action.ranking
        };
        return {
          ...state,
          players,
          activeMiniGame: null,
          roundResults: [...state.roundResults, result],
          screen: 'roundSummary'
        };
      }

    case 'NEXT_ROUND':{
        const roundStartBoard: Record<number, number> = {};
        const players = state.players.map((p) => {
          roundStartBoard[p.id] = boardScore(p);
          return { ...p, history: [...p.history, boardScore(p) + p.miniScore] };
        });
        return {
          ...state,
          players,
          round: state.round + 1,
          currentPlayerIdx: 0,
          playersCompletedThisRound: 0,
          roundStartBoard,
          screen: 'playing'
        };
      }

    case 'GO_FINAL':{
        const players = state.players.map((p) => ({ ...p, history: [...p.history, boardScore(p) + p.miniScore] }));
        return { ...state, players, screen: 'finalSummary' };
      }

    case 'LOSE_LIFE':{
        const newLives = Math.max(0, state.survivalLives - 1);
        if (newLives === 0) {
          const players = state.players.map((p) => ({ ...p, history: [...p.history, boardScore(p) + p.miniScore] }));
          return { ...state, players, survivalLives: 0, screen: 'finalSummary' };
        }
        return { ...state, survivalLives: newLives };
      }

    case 'NEXT_STORY_CHAPTER':{
        const nextChapter = state.storyChapterId + 1;
        const roundStartBoard: Record<number, number> = {};
        const players = state.players.map((p) => {
          roundStartBoard[p.id] = boardScore(p);
          return { ...p, position: 0, history: [...p.history, boardScore(p) + p.miniScore] };
        });
        return {
          ...state,
          players,
          storyChapterId: nextChapter,
          soloTargetScore: 300 + nextChapter * 200,
          round: 1,
          currentPlayerIdx: 0,
          playersCompletedThisRound: 0,
          roundStartBoard,
          screen: 'playing'
        };
      }

    case 'RESET':
      return { ...initialState };

    case 'LOAD':
      return action.state;

    default:
      return state;
  }
}

interface Ctx {
  state: GameState;
  dispatch: React.Dispatch<Action>;
  currentPlayer: Player | undefined;
  currentTile: Tile | undefined;
  clearSave: () => void;
}

const GameCtx = createContext<Ctx | null>(null);

export function GameProvider({ children }: {children: React.ReactNode;}) {
  const [state, dispatch] = useReducer(reducer, initialState, (init) => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as GameState;
        if (parsed && parsed.players && parsed.players.length && parsed.screen !== 'home') return parsed;
      }
    } catch {

      /* ignore */}
    return init;
  });

  useEffect(() => {
    try {
      if (state.players.length && state.screen !== 'home') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      }
    } catch {

      /* ignore */}
  }, [state]);

  const currentPlayerId = state.turnOrder[state.currentPlayerIdx];
  const currentPlayer = state.players.find((p) => p.id === currentPlayerId);
  const currentTile = currentPlayer ? TILES[currentPlayer.position % BOARD_SIZE] : undefined;

  const clearSave = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {

      /* ignore */}
  };

  return (
    <GameCtx.Provider value={{ state, dispatch, currentPlayer, currentTile, clearSave }}>
      {children}
    </GameCtx.Provider>);

}

export function useGame() {
  const c = useContext(GameCtx);
  if (!c) throw new Error('useGame must be used within GameProvider');
  return c;
}