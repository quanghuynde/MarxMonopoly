



import React from 'react';
import { motion } from 'framer-motion';
import type { Player } from '../game/types';
import { boardScore, totalScore } from '../game/logic';
import { Brain, Coins, Target, Gamepad2 } from 'lucide-react';

interface Props {
  players: Player[];
  currentPlayerId?: number;
  compact?: boolean;
}

export function ScoreBar({ players, currentPlayerId, compact }: Props) {
  const ranked = [...players].sort((a, b) => totalScore(b) - totalScore(a));
  return (
    <div className={`grid gap-2 ${compact ? 'grid-cols-2' : 'grid-cols-1'}`}>
      {ranked.map((p, i) => {
        const active = p.id === currentPlayerId;
        return (
          <motion.div
            layout
            key={p.id}
            className={`relative overflow-hidden rounded-xl border p-2.5 transition-colors ${
            active ? 'border-brass-400/70 bg-ink-700' : 'border-white/10 bg-ink-800/70'}`
            }>
            
            {active &&
            <motion.span
              layoutId="scorebar-active"
              className="absolute inset-0 -z-0 bg-brass-400/10" />

            }
            <div className="relative z-10 flex items-center gap-2">
              <span
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-lg"
                style={{ backgroundColor: p.character.color + '33' }}>
                
                {p.character.emoji}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <span className="truncate text-sm font-bold text-white">{p.name}</span>
                  <span className="rounded-md bg-brass-400/15 px-1.5 py-0.5 text-xs font-mono font-extrabold text-brass-400">
                    {totalScore(p)}
                  </span>
                </div>
                <div className="mt-1 flex items-center gap-2 text-[10px] font-semibold text-white/55">
                  <span className="flex items-center gap-0.5"><Brain size={11} className="text-sky-400" />{p.knowledge}</span>
                  <span className="flex items-center gap-0.5"><Coins size={11} className="text-brass-400" />{p.assets}</span>
                  <span className="flex items-center gap-0.5"><Target size={11} className="text-lime-400" />{p.strategy}</span>
                  <span className="flex items-center gap-0.5"><Gamepad2 size={11} className="text-purple-400" />{p.miniScore}</span>
                </div>
              </div>
              {i === 0 && <span className="text-lg" title="Dẫn đầu">👑</span>}
            </div>
          </motion.div>);

      })}
    </div>);

}