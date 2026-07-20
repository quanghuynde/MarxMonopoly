






import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Player } from '../../game/types';
import { playSound } from '../../game/sound';
import { Clock, Coins, Bomb } from 'lucide-react';

interface Props {
  players: Player[];
  onComplete: (scores: Record<number, number>) => void;
}

const DURATION = 15;

interface Target {
  id: number;
  x: number;
  y: number;
  type: 'coin' | 'bomb';
}

/** "Ai nhanh hơn": tap coins (giá trị) fast, avoid bombs (khủng hoảng). Reflex per player. */
export function ReflexGame({ players, onComplete }: Props) {
  const [pIdx, setPIdx] = useState(0);
  const [scores, setScores] = useState<Record<number, number>>(() => Object.fromEntries(players.map((p) => [p.id, 0])));
  const [intro, setIntro] = useState(true);
  const [time, setTime] = useState(DURATION);
  const [targets, setTargets] = useState<Target[]>([]);
  const [score, setScore] = useState(0);
  const idRef = useRef(0);

  const player = players[pIdx];

  useEffect(() => {
    if (intro) return;
    if (time <= 0) {
      finish();
      return;
    }
    const t = setTimeout(() => setTime((v) => v - 1), 1000);
    return () => clearTimeout(t);
  }, [time, intro]);

  useEffect(() => {
    if (intro) return;
    const spawn = setInterval(() => {
      const isBomb = Math.random() < 0.28;
      const target: Target = {
        id: idRef.current++,
        x: 8 + Math.random() * 82,
        y: 8 + Math.random() * 80,
        type: isBomb ? 'bomb' : 'coin'
      };
      setTargets((t) => [...t, target]);
      setTimeout(() => setTargets((t) => t.filter((x) => x.id !== target.id)), 1100);
    }, 650);
    return () => clearInterval(spawn);
  }, [intro]);

  const finish = () => {
    setScores((s) => {
      const next = { ...s, [player.id]: score };
      if (pIdx + 1 < players.length) {
        setTimeout(() => {
          setPIdx((v) => v + 1);
          setScore(0);
          setTargets([]);
          setTime(DURATION);
          setIntro(true);
        }, 0);
        return next;
      }
      setTimeout(() => onComplete(next), 300);
      return next;
    });
  };

  const hit = (t: Target) => {
    setTargets((ts) => ts.filter((x) => x.id !== t.id));
    if (t.type === 'coin') {
      playSound('reward');
      setScore((s) => s + 15);
    } else {
      playSound('penalty');
      setScore((s) => Math.max(0, s - 20));
    }
  };

  if (intro) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
        <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }} className="text-6xl">{player.character.emoji}</motion.div>
        <div className="font-display text-2xl font-extrabold text-white">Lượt của {player.name}</div>
        <div className="max-w-xs text-sm text-white/60">Chạm <span className="text-brass-400">💰 Giá trị</span> để ghi điểm, tránh <span className="text-rose-400">💥 Khủng hoảng</span>!</div>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => {playSound('click');setIntro(false);setTime(DURATION);}} className="mt-2 rounded-xl bg-brass-500 px-8 py-3 font-bold text-ink-950 shadow-glow">Bắt đầu</motion.button>
      </div>);

  }

  return (
    <div className="flex flex-1 flex-col p-4 sm:p-6">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2"><span className="text-2xl">{player.character.emoji}</span><span className="text-sm font-bold text-white">{player.name}</span></div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 font-bold text-brass-400"><Coins size={16} /> {score}</span>
          <span className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 font-bold ${time <= 5 ? 'bg-rose-500/20 text-rose-400' : 'bg-white/10 text-white'}`}><Clock size={16} /> {time}s</span>
        </div>
      </div>
      <div className="relative flex-1 overflow-hidden rounded-2xl border border-white/10 bg-ink-900 bg-grid">
        <AnimatePresence>
          {targets.map((t) =>
          <motion.button
            key={t.id}
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 18 }}
            onClick={() => hit(t)}
            style={{ left: `${t.x}%`, top: `${t.y}%` }}
            className={`absolute flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-2xl shadow-lg ${
            t.type === 'coin' ? 'bg-brass-400/25 ring-2 ring-brass-400' : 'bg-rose-500/25 ring-2 ring-rose-500'}`
            }>
            
              {t.type === 'coin' ? <Coins className="text-brass-400" size={24} /> : <Bomb className="text-rose-400" size={24} />}
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>);

}