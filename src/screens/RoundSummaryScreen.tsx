








import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../game/GameContext';
import { totalScore } from '../game/logic';
import { playSound } from '../game/sound';
import { ArrowRight, Brain, Coins, Target, Gamepad2, Heart } from 'lucide-react';
import { STORY_CHAPTERS } from '../game/data/story';

export function RoundSummaryScreen() {
  const { state, dispatch } = useGame();
  const last = state.roundResults[state.roundResults.length - 1];
  const isFinalRound = state.round >= state.totalRounds;
  const isSolo = state.gameMode !== 'multiplayer';

  const ranked = [...state.players].sort((a, b) => totalScore(b) - totalScore(a));

  useEffect(() => {
    playSound('reward');
  }, []);

  const next = () => {
    playSound('click');
    if (isFinalRound && state.gameMode !== 'endless') {
      playSound('victory');
      dispatch({ type: 'GO_FINAL' });
    } else {
      dispatch({ type: 'NEXT_ROUND' });
    }
  };

  return (
    <div className="min-h-full w-full overflow-y-auto bg-ink-950 bg-grid px-4 py-8">
      <div className="mx-auto max-w-2xl">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6 text-center">
          <div className="text-sm font-bold uppercase tracking-[0.3em] text-brass-400">Tổng kết</div>
          <h1 className="font-display text-4xl font-extrabold text-white text-shadow-lg">Vòng {state.round}</h1>
        </motion.div>

        <div className="space-y-3">
          {isSolo ? (
            state.players.map((p) => {
              const board = last?.boardScores[p.id] ?? 0;
              const mini = last?.miniScores[p.id] ?? 0;
              const total = totalScore(p);
              const target = state.gameMode === 'story' 
                ? (STORY_CHAPTERS.find((ch) => ch.id === state.storyChapterId)?.targetScore || 300) 
                : state.soloTargetScore;
              const hasTarget = state.gameMode === 'solo' || state.gameMode === 'story';
              return (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 140 }}
                  className="overflow-hidden rounded-2xl border border-brass-400/40 bg-brass-400/5 p-5"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">{p.character.emoji}</span>
                    <div className="flex-1">
                      <div className="font-display text-lg font-extrabold text-white">{p.name}</div>
                      <div className={`text-xs font-bold ${p.character.accent}`}>{p.character.title}</div>
                    </div>
                    <div className="text-right">
                      <motion.div key={total} initial={{ scale: 1.4, color: '#c8933f' }} animate={{ scale: 1, color: '#ffffff' }} className="font-display text-3xl font-extrabold text-brass-400">
                        {total}
                      </motion.div>
                      <div className="text-[10px] uppercase tracking-wide text-white/40">tổng điểm</div>
                    </div>
                  </div>

                  {hasTarget && (
                    <div className="mt-4 border-t border-white/5 pt-4">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-white/50">Mục tiêu đạt điểm:</span>
                        <span className="font-bold text-white">{total}/{target} điểm</span>
                      </div>
                      <div className="h-2.5 w-full rounded-full bg-white/10 overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-brass-500 to-brass-400 transition-all duration-500" style={{ width: `${Math.min(100, (total / target) * 100)}%` }} />
                      </div>
                      {total >= target ? (
                        <div className="text-emerald-400 text-[11px] font-bold mt-1.5 flex items-center gap-1">
                          🎉 Đạt mục tiêu vượt vòng!
                        </div>
                      ) : (
                        <div className="text-white/40 text-[11px] mt-1.5">
                          Cần thêm <span className="text-brass-400 font-bold">{target - total}</span> điểm nữa.
                        </div>
                      )}
                    </div>
                  )}

                  {state.gameMode === 'endless' && (
                    <div className="mt-4 border-t border-white/5 pt-4 flex items-center justify-between text-xs">
                      <span className="text-white/50">Mạng sống còn lại:</span>
                      <div className="flex gap-1">
                        {Array.from({ length: 3 }).map((_, idx) => (
                          <Heart key={idx} size={15} fill={idx < state.survivalLives ? '#f43f5e' : 'none'} className={idx < state.survivalLives ? 'text-rose-500' : 'text-white/20'} />
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-1.5">
                      <span className="text-white/50 text-[11px]">Bàn cờ vòng này</span>
                      <span className={`font-bold ${board >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>{board >= 0 ? '+' : ''}{board}</span>
                    </div>
                    <div className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-1.5">
                      <span className="text-white/50 text-[11px]">Mini game vòng này</span>
                      <span className="font-bold text-purple-400">+{mini}</span>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center gap-3 text-[11px] font-semibold text-white/50 justify-center">
                    <span className="flex items-center gap-1"><Brain size={12} className="text-sky-400" />Tri thức: {p.knowledge}</span>
                    <span className="flex items-center gap-1"><Coins size={12} className="text-brass-400" />Tài sản: {p.assets}</span>
                    <span className="flex items-center gap-1"><Target size={12} className="text-lime-400" />Chiến lược: {p.strategy}</span>
                  </div>
                </motion.div>
              );
            })
          ) : (
            ranked.map((p, i) => {
              const board = last?.boardScores[p.id] ?? 0;
              const mini = last?.miniScores[p.id] ?? 0;
              return (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.12, type: 'spring', stiffness: 140 }}
                  className={`overflow-hidden rounded-2xl border p-4 ${i === 0 ? 'border-brass-400/60 bg-brass-400/10' : 'border-white/10 bg-ink-850'}`}>
                  
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 font-extrabold text-white">{i + 1}</span>
                    <span className="text-3xl">{p.character.emoji}</span>
                    <div className="flex-1">
                      <div className="font-display text-lg font-extrabold text-white">{p.name}</div>
                      <div className={`text-xs font-bold ${p.character.accent}`}>{p.character.title}</div>
                    </div>
                    <div className="text-right">
                      <motion.div key={totalScore(p)} initial={{ scale: 1.4, color: '#c8933f' }} animate={{ scale: 1, color: '#ffffff' }} className="font-display text-2xl font-extrabold text-white">
                        {totalScore(p)}
                      </motion.div>
                      <div className="text-[10px] uppercase tracking-wide text-white/40">tổng điểm</div>
                    </div>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-1.5">
                      <span className="text-white/50">Điểm bàn cờ vòng này</span>
                      <span className={`font-bold ${board >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>{board >= 0 ? '+' : ''}{board}</span>
                    </div>
                    <div className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-1.5">
                      <span className="text-white/50">Điểm mini game</span>
                      <span className="font-bold text-purple-400">+{mini}</span>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center gap-3 text-[11px] font-semibold text-white/50">
                    <span className="flex items-center gap-1"><Brain size={12} className="text-sky-400" />{p.knowledge}</span>
                    <span className="flex items-center gap-1"><Coins size={12} className="text-brass-400" />{p.assets}</span>
                    <span className="flex items-center gap-1"><Target size={12} className="text-lime-400" />{p.strategy}</span>
                    <span className="flex items-center gap-1"><Gamepad2 size={12} className="text-purple-400" />{p.miniScore}</span>
                  </div>
                </motion.div>);
            })
          )}
        </div>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={next}
          className="mt-7 flex w-full items-center justify-center gap-2 rounded-2xl bg-brass-500 py-4 font-display text-lg font-extrabold text-ink-950 shadow-glow transition-colors hover:bg-brass-400">
          
          {isFinalRound ? 'Xem nhà vô địch' : `Bắt đầu vòng ${state.round + 1}`} <ArrowRight size={22} />
        </motion.button>
      </div>
    </div>);

}