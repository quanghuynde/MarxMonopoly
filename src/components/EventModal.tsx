




import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Tile, Player, DecisionOption } from '../game/types';
import { Icon } from './Icon';
import { playSound } from '../game/sound';
import { Brain, Coins, Target, ArrowRight } from 'lucide-react';

interface EffectResult {
  knowledge?: number;
  assets?: number;
  strategy?: number;
  skipNext?: boolean;
  optimal?: boolean;
  teleportTo?: number;
  swap?: boolean;
}

interface Props {
  tile: Tile;
  player: Player;
  onResolve: (r: EffectResult, message: string) => void;
}

function StatChip({ icon, value, color }: {icon: React.ReactNode;value: number;color: string;}) {
  if (!value) return null;
  const pos = value > 0;
  return (
    <span className={`flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs font-bold ${pos ? 'bg-emerald-500/15 text-emerald-400' : 'bg-rose-500/15 text-rose-400'}`}>
      {icon}
      {pos ? '+' : ''}
      {value}
    </span>);

}

export function EventModal({ tile, player, onResolve }: Props) {
  const [chosen, setChosen] = useState<DecisionOption | null>(null);
  const [resolved, setResolved] = useState<{msg: string;} | null>(null);

  const categoryLabel: Record<string, string> = {
    knowledge: 'Kiến thức kinh tế',
    event: 'Sự kiện',
    luck: 'May mắn',
    challenge: 'Thử thách',
    reward: 'Phần thưởng',
    penalty: 'Rủi ro',
    move: 'Dịch chuyển',
    double: 'Nhân đôi',
    skip: 'Mất lượt',
    boss: 'Cảnh báo Boss',
    start: 'Xuất phát'
  };

  const handleFixed = () => {
    playSound(tile.fixed && (tile.fixed.assets || 0) < 0 ? 'penalty' : 'reward');
    const f = tile.fixed!;
    setResolved({ msg: f.text });
    setTimeout(
      () =>
      onResolve(
        {
          knowledge: f.knowledge,
          assets: f.assets,
          strategy: f.strategy,
          skipNext: f.skipNext,
          teleportTo: f.teleportTo,
          swap: tile.category === 'move' && tile.name.includes('Đổi')
        },
        f.text
      ),
      1100
    );
  };

  const handleOption = (opt: DecisionOption) => {
    playSound(opt.optimal ? 'correct' : 'click');
    setChosen(opt);
    setResolved({ msg: opt.outcome });
    setTimeout(
      () =>
      onResolve(
        { knowledge: opt.knowledge, assets: opt.assets, strategy: opt.strategy, skipNext: opt.skipNext, optimal: opt.optimal },
        opt.outcome
      ),
      1300
    );
  };

  const isSwap = tile.category === 'move' && tile.name.includes('Đổi');

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}>
      
      <motion.div
        initial={{ scale: 0.85, y: 30, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
        className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-ink-850 shadow-card">
        
        {/* header */}
        <div className="relative overflow-hidden p-5" style={{ background: `linear-gradient(140deg, ${tile.color}40, ${tile.color}12)` }}>
          <div className="absolute -right-6 -top-6 opacity-20">
            <Icon name={tile.icon} size={120} className="text-white" />
          </div>
          <span className="relative inline-flex items-center gap-1.5 rounded-full bg-black/30 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white/80">
            {categoryLabel[tile.category]}
          </span>
          <div className="relative mt-2 flex items-center gap-3">
            <motion.span
              initial={{ rotate: -20, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, delay: 0.1 }}
              className="flex h-12 w-12 items-center justify-center rounded-2xl"
              style={{ backgroundColor: tile.color + '40', color: '#fff' }}>
              
              <Icon name={tile.icon} size={26} />
            </motion.span>
            <h2 className="font-display text-2xl font-extrabold text-white text-shadow-lg">{tile.name}</h2>
          </div>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-5">
          {tile.knowledge &&
          <div className="mb-3 rounded-xl border border-sky-400/20 bg-sky-400/5 p-3">
              <div className="mb-1 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-sky-400">
                <Brain size={13} /> Kiến thức
              </div>
              <p className="text-sm leading-relaxed text-white/85">{tile.knowledge}</p>
            </div>
          }
          {tile.story && <p className="mb-4 text-sm italic leading-relaxed text-white/60">“{tile.story}”</p>}

          <AnimatePresence mode="wait">
            {resolved ?
            <motion.div
              key="resolved"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-brass-400/30 bg-brass-400/10 p-4 text-center">
              
                <div className="mb-1 text-3xl">✨</div>
                <p className="text-sm font-semibold text-white">{resolved.msg}</p>
                {isSwap && <p className="mt-1 text-xs text-white/60">Vị trí sẽ được hoán đổi...</p>}
              </motion.div> :
            tile.options ?
            <motion.div key="options" className="space-y-2.5">
                <div className="mb-1 text-xs font-bold uppercase tracking-wide text-white/50">Quyết định của bạn</div>
                {tile.options.map((opt, i) =>
              <motion.button
                key={i}
                onClick={() => handleOption(opt)}
                whileHover={{ scale: 1.02, x: 3 }}
                whileTap={{ scale: 0.98 }}
                className="group flex w-full items-center justify-between gap-3 rounded-xl border border-white/10 bg-ink-800 p-3 text-left transition-colors hover:border-brass-400/50 hover:bg-ink-700">
                
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="truncate text-sm font-bold text-white">{opt.label}</span>
                        {opt.optimal && <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 text-[9px] font-bold uppercase text-emerald-400">Tối ưu</span>}
                      </div>
                      <div className="truncate text-xs text-white/50">{opt.detail}</div>
                    </div>
                    <div className="flex shrink-0 flex-wrap items-center justify-end gap-1">
                      <StatChip icon={<Brain size={11} />} value={opt.knowledge || 0} color="sky" />
                      <StatChip icon={<Coins size={11} />} value={opt.assets || 0} color="gold" />
                      <StatChip icon={<Target size={11} />} value={opt.strategy || 0} color="lime" />
                    </div>
                  </motion.button>
              )}
              </motion.div> :

            <motion.button
              key="continue"
              onClick={handleFixed}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-brass-500 py-3 font-bold text-ink-950 shadow-glow transition-colors hover:bg-brass-400">
              
                Tiếp tục <ArrowRight size={18} />
              </motion.button>
            }
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>);

}