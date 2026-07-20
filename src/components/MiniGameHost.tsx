










import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Player, MiniGameId } from '../game/types';
import { MINI_GAME_META, RANK_POINTS } from '../game/logic';
import { Icon } from './Icon';
import { playSound } from '../game/sound';
import { QuizGame } from './minigames/QuizGame';
import { MatchGame } from './minigames/MatchGame';
import { ReflexGame } from './minigames/ReflexGame';
import { WheelGame } from './minigames/WheelGame';
import { MemoryGame } from './minigames/MemoryGame';
import { Swords, Trophy } from 'lucide-react';

interface Props {
  game: MiniGameId;
  players: Player[];
  round: number;
  isBoss: boolean;
  onDone: (ranking: number[], correctBonus: Record<number, number>) => void;
}

type Phase = 'intro' | 'play' | 'result';

export function MiniGameHost({ game, players, round, isBoss, onDone }: Props) {
  const [phase, setPhase] = useState<Phase>('intro');
  const [scores, setScores] = useState<Record<number, number>>({});
  const meta = MINI_GAME_META[game];

  const ranked = [...players].sort((a, b) => (scores[b.id] || 0) - (scores[a.id] || 0));

  const handleComplete = (result: Record<number, number>) => {
    playSound('minigameEnd');
    setScores(result);
    setPhase('result');
  };

  const finish = () => {
    playSound('click');
    onDone(ranked.map((p) => p.id), scores);
  };

  const renderGame = () => {
    const gp = { players, onComplete: handleComplete };
    switch (game) {
      case 'quiz':return <QuizGame {...gp} />;
      case 'match':return <MatchGame {...gp} />;
      case 'reflex':return <ReflexGame {...gp} />;
      case 'wheel':return <WheelGame {...gp} />;
      case 'memory':return <MemoryGame {...gp} />;
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-ink-950/95 p-3 backdrop-blur-md sm:p-6">
      <div className="flex h-full max-h-[720px] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-white/10 bg-ink-850 shadow-card">
        <div className={`flex items-center justify-between border-b border-white/10 px-5 py-3 ${isBoss ? 'bg-purple-600/20' : 'bg-ink-800'}`}>
          <div className="flex items-center gap-2">
            {isBoss ? <Shield /> : <Icon name={meta.icon} className="text-brass-400" size={20} />}
            <div>
              <div className="font-display text-lg font-extrabold text-white">{isBoss ? 'BOSS: Khủng Hoảng Kinh Tế' : meta.name}</div>
              <div className="text-[11px] text-white/50">{isBoss ? 'Cùng đối đầu — xếp hạng theo đóng góp' : meta.desc}</div>
            </div>
          </div>
          <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white/70">Vòng {round}</span>
        </div>

        <AnimatePresence mode="wait">
          {phase === 'intro' &&
          <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-1 flex-col items-center justify-center gap-5 p-8 text-center">
              <motion.div initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 220 }} className={`flex h-24 w-24 items-center justify-center rounded-3xl ${isBoss ? 'bg-purple-600/30' : 'bg-brass-400/20'}`}>
                {isBoss ? <Shield large /> : <Icon name={meta.icon} size={48} className="text-brass-400" />}
              </motion.div>
              <div>
                <div className="mb-1 flex items-center justify-center gap-2 text-sm font-bold uppercase tracking-wider text-brass-400"><Swords size={16} /> Mini Game</div>
                <h2 className="font-display text-3xl font-extrabold text-white text-shadow-lg">{isBoss ? 'Khủng Hoảng Kinh Tế' : meta.name}</h2>
                <p className="mt-2 max-w-sm text-sm text-white/60">
                  {players.length === 1 
                    ? (isBoss ? 'Hãy vận dụng kiến thức kinh tế để giải quyết các tình huống khẩn cấp và vượt qua khủng hoảng.' : meta.desc)
                    : (isBoss ? 'Cả 4 người phải vận dụng kiến thức để vượt khủng hoảng. Ai đóng góp nhiều nhất sẽ dẫn đầu!' : meta.desc)
                  }
                </p>
              </div>
              <div className="flex items-center gap-2 rounded-xl bg-white/5 px-4 py-2 text-xs text-white/60">
                {players.length === 1 ? (
                  <span>🏆 Mục tiêu: <span className="font-bold text-brass-400">150đ hoàn thành</span> + Điểm thưởng câu hỏi!</span>
                ) : (
                  <span>🏆 Xếp hạng: <span className="font-bold text-brass-400">100 / 70 / 40 / 20</span> điểm</span>
                )}
              </div>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => {playSound('click');setPhase('play');}} className="rounded-xl bg-brass-500 px-10 py-3.5 font-bold text-ink-950 shadow-glow">
                Vào cuộc
              </motion.button>
            </motion.div>
          }

          {phase === 'play' &&
          <motion.div key="play" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-1 flex-col overflow-y-auto">
              {renderGame()}
            </motion.div>
          }

          {phase === 'result' &&
          <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-1 flex-col items-center justify-center gap-4 p-6">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }} className="text-5xl">🏁</motion.div>
              <h2 className="font-display text-2xl font-extrabold text-white">Kết quả Mini Game</h2>
              <div className="w-full max-w-sm space-y-2">
                {players.length === 1 ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center rounded-2xl border border-brass-400/40 bg-brass-400/5 p-5 text-center"
                  >
                    <span className="text-3xl mb-2">{players[0].character.emoji}</span>
                    <span className="font-bold text-white text-lg">{players[0].name}</span>
                    <span className="text-sm text-white/50 mt-1">Đã hoàn thành thử thách!</span>
                    
                    <div className="mt-4 flex flex-col gap-1 w-full bg-white/5 p-3 rounded-xl text-xs text-white/70">
                      <div className="flex justify-between">
                        <span>Điểm thưởng hoàn thành:</span>
                        <span className="font-bold text-brass-400">+150 điểm</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Điểm trả lời câu hỏi:</span>
                        <span className="font-bold text-purple-400">+{scores[players[0].id] || 0} điểm</span>
                      </div>
                      <div className="border-t border-white/10 my-1 pt-1 flex justify-between text-white font-bold">
                        <span>Cộng thêm tổng cộng:</span>
                        <span className="text-emerald-400">+{150 + (scores[players[0].id] || 0)}</span>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  ranked.map((p, i) =>
                    <motion.div
                      key={p.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.12 }}
                      className={`flex items-center gap-3 rounded-xl border p-3 ${i === 0 ? 'border-brass-400/60 bg-brass-400/10' : 'border-white/10 bg-ink-800'}`}>
                      
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-sm font-extrabold text-white">{i + 1}</span>
                      <span className="text-xl">{p.character.emoji}</span>
                      <span className="flex-1 font-bold text-white">{p.name}</span>
                      <span className="text-sm text-white/60">{scores[p.id] || 0} đ</span>
                      <span className="flex items-center gap-1 rounded-md bg-brass-400/15 px-2 py-0.5 text-sm font-extrabold text-brass-400">
                        <Trophy size={13} /> +{RANK_POINTS[i]}
                      </span>
                    </motion.div>
                  )
                )}
              </div>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={finish} className="mt-2 rounded-xl bg-brass-500 px-10 py-3 font-bold text-ink-950 shadow-glow">
                Tổng kết vòng
              </motion.button>
            </motion.div>
          }
        </AnimatePresence>
      </div>
    </div>);

}

function Shield({ large }: {large?: boolean;}) {
  return (
    <span className={large ? 'text-5xl' : 'text-xl'} role="img" aria-label="boss">
      👹
    </span>);

}