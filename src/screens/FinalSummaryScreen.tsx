import { useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../game/GameContext';
import { rankPlayers, totalScore, awardTitles } from '../game/logic';
import { playSound } from '../game/sound';
import { Home, RotateCcw, Crown, Gamepad2, Award, Star, ArrowRight } from 'lucide-react';
import { STORY_CHAPTERS } from '../game/data/story';
import { saveDailyHighScore } from '../game/daily';

export function FinalSummaryScreen() {
  const { state, dispatch, clearSave } = useGame();
  const ranked = useMemo(() => rankPlayers(state.players), [state.players]);
  const titles = useMemo(() => awardTitles(state.players), [state.players]);
  const champion = ranked[0];

  const isSolo = state.gameMode !== 'multiplayer';
  const score = totalScore(champion);

  // Target score logic
  const target = useMemo(() => {
    if (state.gameMode === 'story') {
      return STORY_CHAPTERS.find((ch) => ch.id === state.storyChapterId)?.targetScore || 300;
    }
    return state.soloTargetScore;
  }, [state.gameMode, state.storyChapterId, state.soloTargetScore]);

  // Save progress & records
  useEffect(() => {
    playSound('victory');
    if (state.gameMode === 'daily') {
      saveDailyHighScore(state.dailySeed, score);
    } else if (state.gameMode === 'endless') {
      const endlessHighScoreKey = 'ctpb-endless-high';
      const maxScore = parseInt(localStorage.getItem(endlessHighScoreKey) || '0', 10);
      if (score > maxScore) {
        localStorage.setItem(endlessHighScoreKey, String(score));
      }
    }
  }, [state.gameMode, state.dailySeed, score]);

  const maxHist = Math.max(1, ...state.players.flatMap((p) => p.history));

  const restart = () => {
    playSound('click');
    clearSave();
    dispatch({ type: 'RESET' });
    dispatch({ type: 'SET_SCREEN', screen: 'characters' });
  };

  const home = () => {
    playSound('click');
    clearSave();
    dispatch({ type: 'RESET' });
    dispatch({ type: 'SET_SCREEN', screen: 'home' });
  };

  const handleNextChapter = () => {
    playSound('reward');
    dispatch({ type: 'NEXT_STORY_CHAPTER' });
  };

  // Solo evaluation rating
  const getSoloEvaluation = () => {
    if (state.gameMode === 'endless') {
      const best = parseInt(localStorage.getItem('ctpb-endless-high') || '0', 10);
      return {
        stars: 0,
        rank: score >= 500 ? 'S' : score >= 350 ? 'A' : score >= 200 ? 'B' : 'C',
        passed: score >= 100,
        desc: score >= best ? '🏆 BẠN ĐÃ LẬP KỶ LỤC MỚI!' : `Kỷ lục hiện tại: ${best} điểm`
      };
    }

    const stars = score >= target ? 3 : score >= target * 0.8 ? 2 : score >= target * 0.5 ? 1 : 0;
    const rank = score >= target * 1.2 ? 'S' : score >= target ? 'A' : score >= target * 0.8 ? 'B' : score >= target * 0.5 ? 'C' : 'F';
    const passed = score >= target;
    const desc = passed ? 'Chúc mừng bạn đã hoàn thành xuất sắc mục tiêu kinh tế!' : 'Không đạt mục tiêu. Hãy thử lại để đạt kết quả tốt hơn nhé.';

    return { stars, rank, passed, desc };
  };

  const evalResult = getSoloEvaluation();

  return (
    <div className="min-h-full w-full overflow-y-auto bg-ink-950 bg-grid px-4 py-8">
      {/* confetti */}
      {evalResult.passed && Array.from({ length: 30 }).map((_, i) =>
        <motion.span
          key={i}
          className="pointer-events-none fixed top-0 text-lg"
          style={{ left: `${i * 37 % 100}%` }}
          initial={{ y: -40, opacity: 0, rotate: 0 }}
          animate={{ y: '100vh', opacity: [0, 1, 1, 0], rotate: 360 }}
          transition={{ duration: 3 + i % 4, repeat: Infinity, delay: i % 10 * 0.3 }}>
          {['🎉', '⭐', '🏆', '💰', '🎊'][i % 5]}
        </motion.span>
      )}

      <div className="relative mx-auto max-w-2xl">
        {isSolo ? (
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="mb-6 flex flex-col items-center text-center">
            {evalResult.passed ? (
              <Crown className="mb-1 text-gold-400 animate-bounce" size={48} />
            ) : (
              <span className="text-5xl mb-2">😢</span>
            )}
            <div className="text-sm font-bold uppercase tracking-[0.2em] text-white/50">
              {state.gameMode === 'solo' && 'Tổng kết Chiến Dịch'}
              {state.gameMode === 'story' && `Tổng kết Chapter ${state.storyChapterId}`}
              {state.gameMode === 'endless' && 'Tổng kết Sinh Tồn'}
              {state.gameMode === 'daily' && 'Tổng kết Challenge Ngày'}
            </div>
            
            <h1 className="mt-2 font-display text-4xl font-extrabold text-white">{champion.name}</h1>
            <div className="mt-1 flex items-center gap-1.5 text-2xl font-extrabold text-gold-400">
              <span>{score} điểm</span>
              {state.gameMode !== 'endless' && (
                <span className="text-xs text-white/40 font-semibold">(Mục tiêu: {target}đ)</span>
              )}
            </div>

            {/* Star Rating display */}
            {state.gameMode !== 'endless' && (
              <div className="mt-3 flex gap-2 text-gold-400">
                {[1, 2, 3].map((s) => (
                  <Star key={s} size={24} fill={evalResult.stars >= s ? 'currentColor' : 'none'} className={evalResult.stars >= s ? 'scale-110 drop-shadow-[0_0_8px_#f5b83d]' : 'opacity-20'} />
                ))}
              </div>
            )}

            {/* Rank badge */}
            <div className="mt-4 flex flex-col items-center">
              <div className={`flex items-center justify-center h-16 w-16 rounded-2xl font-display text-3xl font-black border-2 bg-white/5 shadow-glow ${
                evalResult.rank === 'S' || evalResult.rank === 'A' ? 'text-emerald-400 border-emerald-400/40' :
                evalResult.rank === 'B' || evalResult.rank === 'C' ? 'text-gold-400 border-gold-400/40' : 'text-rose-500 border-rose-500/40'
              }`}>
                {evalResult.rank}
              </div>
              <span className="mt-2 text-xs font-bold text-white/40 uppercase tracking-widest">Xếp hạng năng lực</span>
            </div>

            <p className="mt-4 max-w-sm text-sm text-white/70 font-semibold leading-relaxed">{evalResult.desc}</p>
          </motion.div>
        ) : (
          <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 160 }} className="mb-6 flex flex-col items-center text-center">
            <Crown className="mb-1 text-gold-400" size={40} />
            <div className="text-sm font-bold uppercase tracking-[0.3em] text-gold-400">Nhà vô địch</div>
            <div className="mt-2 text-6xl">{champion.character.emoji}</div>
            <h1 className="font-display text-4xl font-extrabold text-white text-shadow-lg">{champion.name}</h1>
            <div className={`font-bold ${champion.character.accent}`}>{champion.character.title}</div>
            <div className="mt-1 font-display text-3xl font-extrabold text-gold-400">{score} điểm</div>
            {titles[champion.id]?.length > 0 &&
            <div className="mt-2 flex flex-wrap justify-center gap-1.5">
                {titles[champion.id].map((t) =>
              <span key={t} className="rounded-full bg-gold-400/20 px-2.5 py-1 text-xs font-bold text-gold-400">🏅 {t}</span>
              )}
              </div>
            }
          </motion.div>
        )}

        {/* full ranking for multi player */}
        {!isSolo && (
          <>
            <h2 className="mb-3 font-display text-xl font-extrabold text-white">Bảng xếp hạng</h2>
            <div className="space-y-2">
              {ranked.map((p, i) =>
              <motion.div key={p.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.1 }} className={`flex flex-wrap items-center gap-3 rounded-2xl border p-3 ${i === 0 ? 'border-gold-400/60 bg-gold-400/10' : 'border-white/10 bg-ink-850'}`}>
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 font-extrabold text-white">{i + 1}</span>
                  <span className="text-2xl">{p.character.emoji}</span>
                  <div className="min-w-[80px] flex-1">
                    <div className="font-bold text-white">{p.name}</div>
                    <div className="flex flex-wrap gap-1">
                      {(titles[p.id] || []).map((t) =>
                    <span key={t} className="text-[10px] font-bold text-gold-400/80">🏅{t}</span>
                    )}
                    </div>
                  </div>
                  <span className="font-display text-xl font-extrabold text-gold-400">{totalScore(p)}</span>
                </motion.div>
              )}
            </div>
          </>
        )}

        {/* progress chart */}
        <h2 className="mb-3 mt-7 font-display text-xl font-extrabold text-white">Tiến trình điểm</h2>
        <div className="rounded-2xl border border-white/10 bg-ink-850 p-4">
          <div className="relative h-40">
            <svg className="h-full w-full" viewBox="0 0 320 150" preserveAspectRatio="none">
              {state.players.map((p) => {
                const pts = p.history.length > 1 ? p.history : [0, ...p.history];
                const step = 320 / Math.max(1, pts.length - 1);
                const d = pts.map((v, i) => `${i === 0 ? 'M' : 'L'} ${i * step} ${145 - v / maxHist * 135}`).join(' ');
                return <path key={p.id} d={d} fill="none" stroke={p.character.color} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />;
              })}
            </svg>
          </div>
          <div className="mt-2 flex flex-wrap gap-3">
            {state.players.map((p) =>
            <span key={p.id} className="flex items-center gap-1.5 text-xs font-semibold text-white/60">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: p.character.color }} /> {p.name}
              </span>
            )}
          </div>
        </div>

        {/* stats */}
        <h2 className="mb-3 mt-7 font-display text-xl font-extrabold text-white">Thống kê chi tiết</h2>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {ranked.map((p) =>
          <div key={p.id} className="rounded-2xl border border-white/10 bg-ink-850 p-3">
              <div className="mb-1.5 flex items-center gap-1.5 font-bold text-white"><span className="text-lg">{p.character.emoji}</span> {p.name}</div>
              <div className="space-y-0.5 text-[11px] text-white/55">
                <div className="flex justify-between"><span>Ô đã đi</span><span className="font-bold text-white/80">{p.stats.tilesMoved}</span></div>
                <div className="flex justify-between"><span>Sự kiện</span><span className="font-bold text-white/80">{p.stats.eventsHandled}</span></div>
                <div className="flex justify-between"><span className="flex items-center gap-0.5"><Gamepad2 size={11} />Thắng mini</span><span className="font-bold text-white/80">{p.stats.miniGameWins}</span></div>
                <div className="flex justify-between"><span className="flex items-center gap-0.5"><Award size={11} />Quyết định tối ưu</span><span className="font-bold text-white/80">{p.stats.optimalDecisions}</span></div>
              </div>
            </div>
          )}
        </div>

        {/* actions buttons */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          {state.gameMode === 'story' && evalResult.passed && state.storyChapterId < 3 ? (
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={handleNextChapter} className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-purple-600 py-4 font-display text-lg font-extrabold text-white shadow-glow transition-colors hover:bg-purple-500">
              <span>Chương tiếp theo</span> <ArrowRight size={20} />
            </motion.button>
          ) : (
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={restart} className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gold-500 py-4 font-display text-lg font-extrabold text-ink-950 shadow-glow transition-colors hover:bg-gold-400">
              <RotateCcw size={20} /> {state.gameMode === 'story' && !evalResult.passed ? 'Thử lại chương này' : 'Chơi lại'}
            </motion.button>
          )}
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={home} className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-white/15 bg-ink-800 py-4 font-bold text-white transition-colors hover:border-white/30">
            <Home size={20} /> Trang chủ
          </motion.button>
        </div>
      </div>
    </div>
  );
}