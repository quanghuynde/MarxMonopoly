import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../game/GameContext';
import { TILES, BOARD_SIZE } from '../game/data/tiles';
import { MINI_GAMES, totalScore } from '../game/logic';
import type { MiniGameId } from '../game/types';
import { Board } from '../components/Board';
import { Dice } from '../components/Dice';
import { ScoreBar } from '../components/ScoreBar';
import { EventModal } from '../components/EventModal';
import { MiniGameHost } from '../components/MiniGameHost';
import { playSound, setMuted, isMuted } from '../game/sound';
import { Volume2, VolumeX, Home, ScrollText, Swords, Heart, Trophy, Star, BookOpen, Sparkles, Calendar } from 'lucide-react';
import { STORY_CHAPTERS } from '../game/data/story';
import { getDailyHighScore } from '../game/daily';

interface LogEntry {
  id: number;
  player: string;
  emoji: string;
  text: string;
}

type Phase = 'awaitRoll' | 'moving' | 'event' | 'minigame';

export function PlayScreen() {
  const { state, dispatch, currentPlayer } = useGame();
  const [phase, setPhase] = useState<Phase>('awaitRoll');
  const [log, setLog] = useState<LogEntry[]>([]);
  const [muted, setMutedState] = useState(isMuted());
  const [activeMini, setActiveMini] = useState<MiniGameId | null>(null);
  const [storyIntroDismissed, setStoryIntroDismissed] = useState(false);
  const logId = useRef(0);

  const isSolo = state.gameMode !== 'multiplayer';
  const roundComplete = state.playersCompletedThisRound >= state.turnOrder.length;
  const isBossRound = state.round % 5 === 0;

  const pushLog = (text: string) => {
    if (!currentPlayer) return;
    setLog((l) => [{ id: logId.current++, player: currentPlayer.name, emoji: currentPlayer.character.emoji, text }, ...l].slice(0, 30));
  };

  // Auto-skip players who must miss a turn
  useEffect(() => {
    if (phase !== 'awaitRoll' || roundComplete || !currentPlayer) return;
    if (currentPlayer.skipTurns > 0) {
      pushLog('bị mất lượt do đứt gãy chuỗi cung ứng.');
      playSound('penalty');
      dispatch({ type: 'DECREMENT_SKIP', playerId: currentPlayer.id });
      const t = setTimeout(() => dispatch({ type: 'END_TURN' }), 700);
      return () => clearTimeout(t);
    }
  }, [currentPlayer?.id, phase, roundComplete]);

  // Check survival mode lose life condition
  useEffect(() => {
    if (state.gameMode === 'endless' && currentPlayer && currentPlayer.assets <= 0 && phase === 'awaitRoll') {
      pushLog('đã hết tài sản! Mất 1 mạng sống (❤️)');
      playSound('penalty');
      dispatch({ type: 'LOSE_LIFE' });
      // Reset assets to 30 to continue surviving
      dispatch({ type: 'APPLY_EFFECT', playerId: currentPlayer.id, assets: 30 });
    }
  }, [currentPlayer?.assets, phase, state.gameMode]);

  // trigger mini game once round of turns complete
  useEffect(() => {
    if (roundComplete && phase !== 'minigame') {
      const pick = isBossRound ? 'quiz' : MINI_GAMES[Math.floor(Math.random() * MINI_GAMES.length)];
      setActiveMini(pick as MiniGameId);
      setPhase('minigame');
      dispatch({ type: 'START_MINIGAME', game: pick as MiniGameId });
      playSound('minigameEnd');
    }
  }, [roundComplete]);

  const handleRoll = (value: number) => {
    if (!currentPlayer) return;
    setPhase('moving');
    playSound('move');
    const newPos = (currentPlayer.position + value) % BOARD_SIZE;
    // animate step-by-step
    let step = 0;
    const stepIv = setInterval(() => {
      step++;
      const interim = (currentPlayer.position + step) % BOARD_SIZE;
      dispatch({ type: 'MOVE_PLAYER', playerId: currentPlayer.id, position: interim, tilesMoved: 1 });
      playSound('move');
      if (step >= value) {
        clearInterval(stepIv);
        setTimeout(() => {
          pushLog(`tung được ${value}, dừng tại "${TILES[newPos].name}".`);
          setPhase('event');
        }, 250);
      }
    }, 260);
  };

  const handleResolve = (
  r: {knowledge?: number;assets?: number;strategy?: number;skipNext?: boolean;optimal?: boolean;teleportTo?: number;swap?: boolean;},
  message: string) =>
  {
    if (!currentPlayer) return;
    dispatch({
      type: 'APPLY_EFFECT',
      playerId: currentPlayer.id,
      knowledge: r.knowledge,
      assets: r.assets,
      strategy: r.strategy,
      skipNext: r.skipNext,
      optimal: r.optimal,
      teleportTo: r.teleportTo,
      event: true
    });
    if (r.swap && !isSolo) {
      const others = state.players.filter((p) => p.id !== currentPlayer.id);
      const other = others[Math.floor(Math.random() * others.length)];
      if (other) {
        dispatch({ type: 'SWAP_POSITIONS', playerId: currentPlayer.id, otherId: other.id });
        pushLog(`hoán đổi vị trí với ${other.name}!`);
      }
    }
    pushLog(message);
    playSound('reward');
    setPhase('awaitRoll');
    setTimeout(() => dispatch({ type: 'END_TURN' }), 400);
  };

  const handleMiniDone = (ranking: number[], correctBonus: Record<number, number>) => {
    dispatch({ type: 'FINISH_MINIGAME', ranking, correctBonus });
    setActiveMini(null);
  };

  const toggleMute = () => {
    const next = !muted;
    setMuted(next);
    setMutedState(next);
    if (!next) playSound('click');
  };

  const currentTile = currentPlayer ? TILES[currentPlayer.position % BOARD_SIZE] : TILES[0];
  const currentTotalScore = currentPlayer ? totalScore(currentPlayer) : 0;
  const currentChapter = STORY_CHAPTERS.find((ch) => ch.id === state.storyChapterId) || STORY_CHAPTERS[0];
  const dailyHighScore = getDailyHighScore(state.dailySeed);

  // Calculate stars for display under Solo & Story modes
  const getProjectedStars = () => {
    const target = state.soloTargetScore;
    if (currentTotalScore >= target) return 3;
    if (currentTotalScore >= target * 0.8) return 2;
    if (currentTotalScore >= target * 0.5) return 1;
    return 0;
  };

  const projectedStars = getProjectedStars();

  return (
    <div className="relative min-h-full w-full bg-ink-950 bg-grid">
      {/* top bar */}
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-white/10 bg-ink-900/90 px-3 py-2.5 backdrop-blur">
        <button onClick={() => {playSound('click');dispatch({ type: 'SET_SCREEN', screen: 'home' });}} className="flex items-center gap-1.5 rounded-lg bg-white/5 px-3 py-1.5 text-sm font-bold text-white/70 transition-colors hover:text-white">
          <Home size={16} /> <span className="hidden sm:inline">Trang chủ</span>
        </button>
        <div className="flex items-center gap-3">
          <div className="text-center">
            {state.gameMode === 'endless' ? (
              <>
                <div className="font-display text-lg font-extrabold leading-none text-white">Vòng {state.round}</div>
                <div className="text-[10px] uppercase tracking-wide text-rose-400 font-bold">♾️ Chế độ Sinh Tồn</div>
              </>
            ) : (
              <>
                <div className="font-display text-lg font-extrabold leading-none text-white">Vòng {state.round}<span className="text-white/40">/{state.totalRounds}</span></div>
                <div className="text-[10px] uppercase tracking-wide text-white/40">{isBossRound ? '👹 Vòng Boss' : 'Đang chơi'}</div>
              </>
            )}
          </div>
        </div>
        <button onClick={toggleMute} aria-label={muted ? 'Bật âm thanh' : 'Tắt âm thanh'} className="rounded-lg bg-white/5 p-2 text-white/70 transition-colors hover:text-white">
          {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
      </div>

      {/* Story Chapter Intro Modal */}
      {state.gameMode === 'story' && state.round === 1 && !storyIntroDismissed && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-ink-950/80 p-4 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-md rounded-3xl border border-purple-500/30 bg-ink-900 p-6 text-center shadow-glow"
          >
            <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-500/20 text-4xl">
              {currentChapter.emoji}
            </div>
            <h2 className="font-display text-xl font-extrabold text-white">{currentChapter.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-white/70">{currentChapter.intro}</p>
            
            <div className="mt-5 flex items-center justify-between rounded-xl bg-white/5 p-3 text-xs">
              <span className="text-white/50">Mục tiêu qua màn</span>
              <span className="font-bold text-purple-400">{currentChapter.targetScore} điểm</span>
            </div>

            <button
              onClick={() => { playSound('click'); setStoryIntroDismissed(true); }}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-purple-500 py-3.5 font-display text-base font-extrabold text-white shadow-card hover:bg-purple-400"
            >
              <span>Bắt đầu Chương</span>
            </button>
          </motion.div>
        </div>
      )}

      {/* round progress / objective bar */}
      <div className="px-3 pt-3">
        {state.gameMode === 'multiplayer' ? (
          <div>
            <div className="mb-1 flex items-center justify-between text-[11px] font-semibold text-white/50">
              <span>Tiến trình lượt đi</span>
              <span>{state.playersCompletedThisRound}/{state.turnOrder.length} người xong</span>
            </div>
            <div className="flex gap-1.5">
              {state.turnOrder.map((pid, i) => {
                const p = state.players.find((x) => x.id === pid)!;
                const done = i < state.playersCompletedThisRound;
                const active = i === state.currentPlayerIdx && !roundComplete;
                return (
                  <div key={pid} className={`flex-1 rounded-full py-1 text-center text-xs font-bold transition-all ${done ? 'bg-emerald-500/25 text-emerald-400' : active ? 'bg-gold-400/25 text-gold-400 ring-1 ring-gold-400' : 'bg-white/5 text-white/40'}`}>
                    {p.character.emoji}
                  </div>);
              })}
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-white/5 bg-ink-900/60 p-3 sm:px-4">
            {state.gameMode === 'solo' && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <div className="flex items-center gap-2 text-xs font-bold text-gold-400">
                  <Trophy size={14} />
                  <span>Chiến dịch Solo &mdash; Mục tiêu: {state.soloTargetScore} điểm</span>
                </div>
                <div className="flex items-center gap-3">
                  {/* Stars Progress */}
                  <div className="flex gap-0.5 text-gold-400">
                    {[1, 2, 3].map((s) => (
                      <Star key={s} size={14} fill={projectedStars >= s ? 'currentColor' : 'none'} className={projectedStars >= s ? 'animate-pulse' : 'opacity-30'} />
                    ))}
                  </div>
                  {/* Progress fill */}
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-white/60 font-semibold">{currentTotalScore}đ</span>
                    <div className="h-2 w-28 rounded-full bg-white/10 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-gold-500 to-gold-400 transition-all duration-500" style={{ width: `${Math.min(100, (currentTotalScore / state.soloTargetScore) * 100)}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {state.gameMode === 'story' && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <div className="flex items-center gap-2 text-xs font-bold text-purple-400">
                  <BookOpen size={14} />
                  <span>{currentChapter.title} &mdash; Mục tiêu: {currentChapter.targetScore} điểm</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex gap-0.5 text-purple-400">
                    {[1, 2, 3].map((s) => (
                      <Star key={s} size={14} fill={projectedStars >= s ? 'currentColor' : 'none'} className={projectedStars >= s ? 'animate-pulse' : 'opacity-30'} />
                    ))}
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-white/60 font-semibold">{currentTotalScore}đ</span>
                    <div className="h-2 w-28 rounded-full bg-white/10 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-purple-500 to-indigo-400 transition-all duration-500" style={{ width: `${Math.min(100, (currentTotalScore / currentChapter.targetScore) * 100)}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {state.gameMode === 'endless' && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-rose-500">
                  <Heart size={14} className="fill-current" />
                  <span>Sinh Tồn &mdash; Mạng sống:</span>
                  <div className="flex gap-1.5 ml-1">
                    {Array.from({ length: 3 }).map((_, idx) => (
                      <Heart key={idx} size={16} fill={idx < state.survivalLives ? '#f43f5e' : 'none'} className={idx < state.survivalLives ? 'text-rose-500' : 'text-white/20'} />
                    ))}
                  </div>
                </div>
                <div className="text-xs font-semibold text-white/50 flex items-center gap-1.5">
                  <Sparkles size={12} className="text-rose-400" />
                  <span>Điểm tích luỹ: <b className="text-white font-bold">{currentTotalScore}</b></span>
                </div>
              </div>
            )}

            {state.gameMode === 'daily' && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-sky-400">
                  <Calendar size={14} />
                  <span>Daily Challenge &mdash; Seed: {state.dailySeed}</span>
                </div>
                <div className="text-xs font-semibold text-white/50 flex gap-4">
                  {dailyHighScore > 0 && (
                    <span>Kỷ lục ngày: <b className="text-white">{dailyHighScore}đ</b></span>
                  )}
                  <span>Điểm hiện tại: <b className="text-sky-400">{currentTotalScore}đ</b></span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mx-auto grid max-w-6xl gap-4 p-3 lg:grid-cols-[1fr_320px]">
        {/* board + dice */}
        <div className="flex flex-col gap-4">
          <div className="rounded-3xl border border-white/10 bg-ink-900/60 p-3 sm:p-5">
            <Board players={state.players} currentPlayerId={currentPlayer?.id} highlightPos={currentPlayer?.position} />
          </div>

          {/* turn controls */}
          <div className="flex items-center justify-between gap-4 rounded-3xl border border-white/10 bg-ink-850 p-4">
            <div className="flex items-center gap-3">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl text-3xl" style={{ backgroundColor: (currentPlayer?.character.color || '#fff') + '33' }}>
                {currentPlayer?.character.emoji}
              </span>
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wide text-white/40">{isSolo ? 'Lượt của bạn' : 'Lượt của'}</div>
                <div className="font-display text-xl font-extrabold text-white">{currentPlayer?.name}</div>
                <div className={`text-xs font-bold ${currentPlayer?.character.accent}`}>{currentTile.name}</div>
              </div>
            </div>
            <Dice onResult={handleRoll} disabled={phase !== 'awaitRoll' || roundComplete} accent={currentPlayer?.character.color} />
          </div>
        </div>

        {/* sidebar */}
        <div className="flex flex-col gap-4">
          <div className="rounded-3xl border border-white/10 bg-ink-850 p-3">
            <div className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-white/50">
              <Swords size={14} className="text-gold-400" /> Bảng điểm
            </div>
            <ScoreBar players={state.players} currentPlayerId={currentPlayer?.id} />
          </div>

          <div className="rounded-3xl border border-white/10 bg-ink-850 p-3">
            <div className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-white/50">
              <ScrollText size={14} className="text-gold-400" /> Nhật ký sự kiện
            </div>
            <div className="max-h-52 space-y-1.5 overflow-y-auto pr-1">
              <AnimatePresence initial={false}>
                {log.length === 0 && <div className="py-4 text-center text-xs text-white/30">Chưa có sự kiện nào.</div>}
                {log.map((e) =>
                <motion.div key={e.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex gap-2 rounded-lg bg-white/5 p-2 text-xs">
                    <span>{e.emoji}</span>
                    <span className="text-white/70"><span className="font-bold text-white">{e.player}</span> {e.text}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* mini game hint */}
          <div className="rounded-2xl border border-gold-400/20 bg-gold-400/5 p-3 text-xs text-white/60">
            {isSolo ? (
              <span>Sau lượt đi này, bạn sẽ tham gia <span className="font-bold text-gold-400">mini game</span> tích điểm. {isBossRound && 'Đây là vòng đấu Boss!'}</span>
            ) : (
              <span>Sau khi cả 4 người đi xong sẽ có <span className="font-bold text-gold-400">mini game</span> tranh tài. {isBossRound && 'Vòng này là trận Boss!'}</span>
            )}
          </div>
        </div>
      </div>

      {/* event modal */}
      <AnimatePresence>
        {phase === 'event' && currentPlayer &&
        <EventModal tile={currentTile} player={currentPlayer} onResolve={handleResolve} />
        }
      </AnimatePresence>

      {/* minigame */}
      <AnimatePresence>
        {phase === 'minigame' && activeMini &&
        <MiniGameHost game={activeMini} players={state.players} round={state.round} isBoss={isBossRound} onDone={handleMiniDone} />
        }
      </AnimatePresence>
    </div>);
}