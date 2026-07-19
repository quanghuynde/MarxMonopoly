


import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { playSound } from '../game/sound';

const PIPS: Record<number, [number, number][]> = {
  1: [[1, 1]],
  2: [[0, 0], [2, 2]],
  3: [[0, 0], [1, 1], [2, 2]],
  4: [[0, 0], [0, 2], [2, 0], [2, 2]],
  5: [[0, 0], [0, 2], [1, 1], [2, 0], [2, 2]],
  6: [[0, 0], [0, 2], [1, 0], [1, 2], [2, 0], [2, 2]]
};

interface Props {
  onResult: (value: number) => void;
  disabled?: boolean;
  accent?: string;
}

export function Dice({ onResult, disabled, accent = '#f5b83d' }: Props) {
  const [value, setValue] = useState(1);
  const [rolling, setRolling] = useState(false);

  const roll = () => {
    if (rolling || disabled) return;
    setRolling(true);
    playSound('dice');
    let ticks = 0;
    const iv = setInterval(() => {
      setValue(1 + Math.floor(Math.random() * 6));
      ticks++;
      if (ticks > 9) {
        clearInterval(iv);
        const final = 1 + Math.floor(Math.random() * 6);
        setValue(final);
        setRolling(false);
        setTimeout(() => onResult(final), 250);
      }
    }, 70);
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <motion.button
        onClick={roll}
        disabled={rolling || disabled}
        aria-label="Tung xúc xắc"
        whileHover={!disabled && !rolling ? { scale: 1.06 } : undefined}
        whileTap={!disabled && !rolling ? { scale: 0.92 } : undefined}
        animate={rolling ? { rotate: [0, -18, 18, -12, 8, 0] } : { rotate: 0 }}
        transition={rolling ? { duration: 0.7 } : { type: 'spring', stiffness: 300 }}
        className="relative grid grid-cols-3 grid-rows-3 gap-0.5 rounded-2xl bg-white p-3 shadow-card ring-4 disabled:cursor-not-allowed disabled:opacity-60"
        style={{ width: 84, height: 84, boxShadow: `0 8px 0 -2px rgba(0,0,0,.3), 0 0 22px -4px ${accent}` }}>
        
        {Array.from({ length: 9 }).map((_, i) => {
          const r = Math.floor(i / 3);
          const c = i % 3;
          const on = PIPS[value].some(([pr, pc]) => pr === r && pc === c);
          return (
            <span key={i} className="flex items-center justify-center">
              {on && <span className="h-3 w-3 rounded-full bg-ink-900" />}
            </span>);

        })}
      </motion.button>
      <span className="text-xs font-semibold uppercase tracking-wider text-white/50">
        {rolling ? 'Đang tung...' : disabled ? 'Chờ lượt' : 'Chạm để tung'}
      </span>
    </div>);

}