









import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import type { Player } from '../../game/types';
import { CONCEPT_PAIRS } from '../../game/data/concepts';
import { playSound } from '../../game/sound';
import { Clock } from 'lucide-react';

interface Props {
  players: Player[];
  onComplete: (scores: Record<number, number>) => void;
}

interface Card {
  key: string;
  pairId: number;
  text: string;
  kind: 'term' | 'def';
}

const PAIRS = 6;
const TIME_LIMIT = 45;

/** Memory: flip cards to match term ↔ definition. Fewer moves & faster = higher score. */
export function MemoryGame({ players, onComplete }: Props) {
  const [pIdx, setPIdx] = useState(0);
  const [scores, setScores] = useState<Record<number, number>>(() => Object.fromEntries(players.map((p) => [p.id, 0])));
  const [intro, setIntro] = useState(true);
  const player = players[pIdx];

  const cards = useMemo<Card[]>(() => {
    const chosen = [...CONCEPT_PAIRS].sort(() => Math.random() - 0.5).slice(0, PAIRS);
    const list: Card[] = [];
    chosen.forEach((c, i) => {
      list.push({ key: `t${i}`, pairId: i, text: c.term, kind: 'term' });
      list.push({ key: `d${i}`, pairId: i, text: c.def, kind: 'def' });
    });
    return list.sort(() => Math.random() - 0.5);
  }, [pIdx]);

  const [flipped, setFlipped] = useState<string[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [time, setTime] = useState(TIME_LIMIT);
  const [lock, setLock] = useState(false);

  useEffect(() => {
    if (intro) return;
    if (time <= 0 || matched.length === PAIRS) {
      finish();
      return;
    }
    const t = setTimeout(() => {setTime((v) => v - 1);if (time <= 6) playSound('tick');}, 1000);
    return () => clearTimeout(t);
  }, [time, intro, matched.length]);

  const finish = () => {
    const bonus = matched.length * 40 + time * 2;
    setScores((s) => {
      const next = { ...s, [player.id]: bonus };
      if (pIdx + 1 < players.length) {
        setTimeout(() => {setPIdx((v) => v + 1);setFlipped([]);setMatched([]);setTime(TIME_LIMIT);setIntro(true);}, 0);
        return next;
      }
      setTimeout(() => onComplete(next), 300);
      return next;
    });
  };

  const flip = (card: Card) => {
    if (lock || flipped.includes(card.key) || matched.includes(card.pairId)) return;
    playSound('click');
    const next = [...flipped, card.key];
    setFlipped(next);
    if (next.length === 2) {
      setLock(true);
      const [aKey, bKey] = next;
      const a = cards.find((c) => c.key === aKey)!;
      const b = cards.find((c) => c.key === bKey)!;
      if (a.pairId === b.pairId && a.kind !== b.kind) {
        setTimeout(() => {playSound('correct');setMatched((m) => [...m, a.pairId]);setFlipped([]);setLock(false);}, 500);
      } else {
        setTimeout(() => {playSound('wrong');setFlipped([]);setLock(false);}, 900);
      }
    }
  };

  if (intro) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
        <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }} className="text-6xl">{player.character.emoji}</motion.div>
        <div className="font-display text-2xl font-extrabold text-white">Lượt của {player.name}</div>
        <div className="text-sm text-white/60">Lật thẻ, ghép khái niệm với định nghĩa trong {TIME_LIMIT}s</div>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => {playSound('click');setIntro(false);setTime(TIME_LIMIT);}} className="mt-2 rounded-xl bg-gold-500 px-8 py-3 font-bold text-ink-950 shadow-glow">Bắt đầu</motion.button>
      </div>);

  }

  return (
    <div className="flex flex-1 flex-col p-4 sm:p-6">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2"><span className="text-2xl">{player.character.emoji}</span><span className="text-sm font-bold text-white">{player.name}</span></div>
        <div className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 font-bold ${time <= 6 ? 'bg-rose-500/20 text-rose-400' : 'bg-white/10 text-white'}`}><Clock size={16} /> {time}s</div>
      </div>
      <div className="grid flex-1 grid-cols-3 gap-2 sm:grid-cols-4">
        {cards.map((card) => {
          const isUp = flipped.includes(card.key) || matched.includes(card.pairId);
          return (
            <button key={card.key} onClick={() => flip(card)} className="perspective aspect-[3/4]" aria-label="Lật thẻ">
              <motion.div className="relative h-full w-full" style={{ transformStyle: 'preserve-3d' }} animate={{ rotateY: isUp ? 180 : 0 }} transition={{ duration: 0.4 }}>
                <div className="absolute inset-0 flex items-center justify-center rounded-xl border border-white/10 bg-ink-700 text-2xl" style={{ backfaceVisibility: 'hidden' }}>❓</div>
                <div
                  className={`absolute inset-0 flex items-center justify-center rounded-xl border p-1.5 text-center text-[10px] font-bold leading-tight sm:text-xs ${
                  matched.includes(card.pairId) ? 'border-emerald-400/50 bg-emerald-500/15 text-emerald-300' : card.kind === 'term' ? 'border-gold-400/40 bg-gold-400/10 text-gold-300' : 'border-sky-400/40 bg-sky-400/10 text-sky-200'}`
                  }
                  style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                  
                  {card.text}
                </div>
              </motion.div>
            </button>);

        })}
      </div>
      <div className="mt-3 text-center text-xs text-white/50">Ghép được {matched.length}/{PAIRS} cặp · Điểm dự kiến: {matched.length * 40 + time * 2}</div>
    </div>);

}