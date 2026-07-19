import React from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../game/GameContext';
import { playSound } from '../game/sound';
import { Target, Infinity, BookOpen, Calendar, ArrowLeft, Users } from 'lucide-react';
import { getDailySeed, getDailyHighScore } from '../game/daily';
import { GameMode } from '../game/types';

interface ModeOption {
  id: GameMode;
  title: string;
  desc: string;
  icon: React.ReactNode;
  color: string;
  accent: string;
  benefits: string[];
}

export function ModeSelectScreen() {
  const { dispatch } = useGame();

  const handleBack = () => {
    playSound('click');
    dispatch({ type: 'SET_SCREEN', screen: 'home' });
  };

  const selectMode = (mode: GameMode) => {
    playSound('click');
    dispatch({ type: 'SET_MODE', mode });
    
    if (mode === 'multiplayer') {
      // Multiplayer goes to characters selection screen
      dispatch({ type: 'SET_SCREEN', screen: 'characters' });
    } else if (mode === 'solo') {
      // Solo Campaign: target 400 pts, 5 rounds
      dispatch({
        type: 'SET_SCREEN',
        screen: 'characters',
      });
    } else if (mode === 'endless') {
      // Endless Survival: 3 lives
      dispatch({
        type: 'SET_SCREEN',
        screen: 'characters',
      });
    } else if (mode === 'story') {
      // Story mode: starts at chapter 1
      dispatch({
        type: 'SET_SCREEN',
        screen: 'characters',
      });
    } else if (mode === 'daily') {
      // Daily challenge
      dispatch({
        type: 'SET_SCREEN',
        screen: 'characters',
      });
    }
  };

  const dailySeed = getDailySeed();
  const dailyHighScore = getDailyHighScore(dailySeed);

  const modes: ModeOption[] = [
    {
      id: 'solo',
      title: 'Solo Campaign (Chiến Dịch)',
      desc: 'Hoàn thành mục tiêu điểm số kinh tế trong giới hạn 5 vòng đấu.',
      icon: <Target className="h-8 w-8 text-gold-400" />,
      color: 'from-gold-600/20 to-gold-400/5 hover:border-gold-400/40 border-white/10',
      accent: 'text-gold-400',
      benefits: ['Đặt mục tiêu 400 điểm', 'Đánh giá xếp hạng sao (⭐)', 'Rèn luyện kỹ năng kinh tế']
    },
    {
      id: 'endless',
      title: 'Endless Survival (Sinh Tồn)',
      desc: 'Đi xa nhất có thể trên bàn cờ. Tránh để rơi vào trạng thái phá sản!',
      icon: <Infinity className="h-8 w-8 text-rose-400" />,
      color: 'from-rose-600/20 to-rose-400/5 hover:border-rose-400/40 border-white/10',
      accent: 'text-rose-400',
      benefits: ['Bắt đầu với 3 mạng sống (❤️)', 'Mất 1 mạng nếu Assets về 0', 'Thử thách sinh tồn vô tận']
    },
    {
      id: 'story',
      title: 'Story Mode (Cốt Truyện)',
      desc: 'Trải nghiệm 3 chương cốt truyện kinh tế từ học thuyết đến thực tiễn.',
      icon: <BookOpen className="h-8 w-8 text-purple-400" />,
      color: 'from-purple-600/20 to-purple-400/5 hover:border-purple-400/40 border-white/10',
      accent: 'text-purple-400',
      benefits: ['3 chương cốt truyện sâu sắc', 'Mục tiêu tăng dần khó hơn', 'Mở khóa tri thức Mác-Lênin']
    },
    {
      id: 'daily',
      title: 'Daily Challenge (Thử Thách Ngày)',
      desc: `Bản đồ ngẫu nhiên mỗi ngày. Bạn đạt được bao nhiêu điểm hôm nay?`,
      icon: <Calendar className="h-8 w-8 text-sky-400" />,
      color: 'from-sky-600/20 to-sky-400/5 hover:border-sky-400/40 border-white/10',
      accent: 'text-sky-400',
      benefits: [`Seed: ${dailySeed}`, dailyHighScore > 0 ? `Kỷ lục hôm nay: ${dailyHighScore} điểm` : 'Chưa có kỷ lục hôm nay', 'Cạnh tranh kỷ lục cá nhân']
    }
  ];

  return (
    <div className="relative min-h-full w-full bg-ink-950 bg-grid px-4 py-8 overflow-y-auto">
      <div className="mx-auto max-w-4xl">
        {/* header */}
        <div className="mb-6 flex items-center justify-between">
          <button onClick={handleBack} className="flex items-center gap-1.5 rounded-lg bg-white/5 px-3 py-1.5 text-sm font-bold text-white/70 transition-colors hover:text-white">
            <ArrowLeft size={16} /> <span>Quay lại</span>
          </button>
          <div className="text-right">
            <div className="font-display text-sm font-bold uppercase tracking-wider text-gold-400">Chế độ chơi</div>
            <div className="text-[10px] text-white/40 uppercase tracking-widest">Chọn chế độ Single-Player hoặc Multiplayer</div>
          </div>
        </div>

        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 text-center">
          <h1 className="font-display text-3xl font-extrabold text-white sm:text-4xl">CHỌN CHẾ ĐỘ CHƠI</h1>
          <p className="mx-auto mt-2 max-w-md text-sm text-white/60">
            Học tập và thử thách bản thân qua các chế độ chơi đơn đa dạng hoặc tranh tài cùng bạn bè.
          </p>
        </motion.div>

        {/* cards grid */}
        <div className="grid gap-4 sm:grid-cols-2">
          {modes.map((m, i) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, type: 'spring', stiffness: 100 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => selectMode(m.id)}
              className={`cursor-pointer flex flex-col justify-between rounded-3xl border bg-gradient-to-br p-6 transition-all shadow-card ${m.color}`}
            >
              <div>
                <div className="mb-4 flex items-center justify-between">
                  {m.icon}
                  <span className={`text-[10px] uppercase font-bold tracking-wider rounded-full px-2.5 py-0.5 bg-white/5 ${m.accent}`}>
                    Single Player
                  </span>
                </div>
                <h3 className="font-display text-lg font-extrabold text-white">{m.title}</h3>
                <p className="mt-2 text-xs text-white/60 leading-relaxed">{m.desc}</p>
              </div>

              <div className="mt-6 border-t border-white/5 pt-4">
                <ul className="space-y-1.5">
                  {m.benefits.map((b, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-[11px] text-white/50 font-medium">
                      <span className={`h-1.5 w-1.5 rounded-full`} style={{ backgroundColor: 'currentColor' }} />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        {/* bottom multiplayer option */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 flex justify-center"
        >
          <button
            onClick={() => selectMode('multiplayer')}
            className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-6 py-4 font-bold text-white transition-colors hover:bg-white/10 hover:border-white/20"
          >
            <Users size={20} className="text-gold-400" />
            <span>Chế độ nhiều người chơi (Local Multiplayer)</span>
          </button>
        </motion.div>
      </div>
    </div>
  );
}
