




import { motion } from 'framer-motion';
import { useGame } from '../game/GameContext';
import { playSound, resumeAudio } from '../game/sound';
import { Play, BookOpen, RotateCcw, Sparkles, Trophy, Brain, Heart, Calendar } from 'lucide-react';
import { getDailySeed, getDailyHighScore } from '../game/daily';

export function HomeScreen() {
  const { dispatch, state, clearSave } = useGame();
  const hasSave = state.players.length > 0 && state.screen !== 'home';

  // Read high scores for display on home screen
  const dailySeed = getDailySeed();
  const dailyHighScore = getDailyHighScore(dailySeed);
  const endlessHighScore = parseInt(localStorage.getItem('ctpb-endless-high') || '0', 10);

  const go = (screen: 'modeSelect' | 'characters' | 'guide' | 'playing') => {
    resumeAudio();
    playSound('click');
    dispatch({ type: 'SET_SCREEN', screen });
  };

  return (
    <div className="relative flex min-h-full w-full flex-col items-center justify-center overflow-hidden bg-ink-950 bg-grid px-4 py-10">
      {/* floating decorative economic icons */}
      {['💰', '📈', '🏭', '🌐', '🎓', '⚖️', '🤖', '🏦'].map((e, i) =>
      <motion.span
        key={i}
        className="pointer-events-none absolute text-3xl opacity-10 sm:text-5xl"
        style={{ left: `${(i * 12 + 6) % 92}%`, top: `${(i * 27 + 10) % 85}%` }}
        animate={{ y: [0, -18, 0], rotate: [0, 8, 0] }}
        transition={{ duration: 5 + i, repeat: Infinity, ease: 'easeInOut' }}>
        
          {e}
        </motion.span>
      )}

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', stiffness: 120 }} className="relative z-10 flex flex-col items-center text-center">
        <motion.div animate={{ rotate: [0, -4, 4, 0] }} transition={{ duration: 4, repeat: Infinity }} className="mb-3 flex h-20 w-20 items-center justify-center rounded-3xl bg-gold-500 shadow-glow">
          <span className="text-4xl">🎲</span>
        </motion.div>
        <div className="mb-1 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.3em] text-gold-400">
          <Sparkles size={16} /> Board Game Giáo Dục
        </div>
        <h1 className="font-display text-5xl font-extrabold text-white text-shadow-lg sm:text-7xl">
          MarxMonopoly
        </h1>
        <h2 className="font-display text-2xl font-extrabold text-gold-400 sm:text-4xl">CỜ TỶ PHÚ KINH TẾ HỌC</h2>
        <p className="mt-3 max-w-md text-sm text-white/60 sm:text-base">
          Học Kinh tế chính trị Mác – Lênin, kinh tế thị trường, công nghiệp hoá & hội nhập
          qua các chế độ chơi cực kỳ thú vị.
        </p>

        {/* High scores summary bar */}
        {(dailyHighScore > 0 || endlessHighScore > 0) && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }} 
            className="mt-4 flex flex-wrap gap-4 justify-center bg-white/5 border border-white/10 rounded-2xl px-4 py-2 text-xs text-white/70"
          >
            {endlessHighScore > 0 && (
              <span className="flex items-center gap-1">
                <Heart size={12} className="text-rose-500 fill-current" />
                Kỷ lục Sinh tồn: <b className="text-white font-bold">{endlessHighScore}đ</b>
              </span>
            )}
            {dailyHighScore > 0 && (
              <span className="flex items-center gap-1">
                <Calendar size={12} className="text-sky-400" />
                Thử thách Ngày: <b className="text-white font-bold">{dailyHighScore}đ</b>
              </span>
            )}
          </motion.div>
        )}

        <div className="mt-6 flex w-full max-w-xs flex-col gap-3">
          {hasSave &&
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => go('playing')} className="flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 py-4 font-display text-lg font-extrabold text-white shadow-card transition-colors hover:bg-emerald-400">
              <RotateCcw size={22} /> Tiếp tục ván đang chơi
            </motion.button>
          }
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => {clearSave();go('modeSelect');}} className="flex items-center justify-center gap-2 rounded-2xl bg-gold-500 py-4 font-display text-lg font-extrabold text-ink-950 shadow-glow transition-colors hover:bg-gold-400">
            <Play size={22} /> {hasSave ? 'Ván mới' : 'Bắt đầu chơi'}
          </motion.button>
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => go('guide')} className="flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-ink-800 py-3.5 font-bold text-white transition-colors hover:border-white/30">
            <BookOpen size={20} /> Hướng dẫn & Luật chơi
          </motion.button>
        </div>

        <div className="mt-8 flex items-center gap-5 text-xs text-white/40">
          <span className="flex items-center gap-1"><Trophy size={14} /> 5 Chế độ</span>
          <span className="flex items-center gap-1"><Brain size={14} /> 44 ô kiến thức</span>
          <span className="flex items-center gap-1"><Sparkles size={14} /> 5 mini game</span>
        </div>
      </motion.div>
    </div>);
}