





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

const PAIRS_PER_ROUND = 5;
const TIME_LIMIT = 30;

/** Each player matches 5 terms to definitions against the clock. Correct matches & speed = score. */
export function MatchGame({ players, onComplete }: Props) {
  const [pIdx, setPIdx] = useState(0);
  const [scores, setScores] = useState<Record<number, number>>(() => Object.fromEntries(players.map((p) => [p.id, 0])));
  const [intro, setIntro] = useState(true);

  const player = players[pIdx];
  const pairs = useMemo(
    () => [...CONCEPT_PAIRS].sort(() => Math.random() - 0.5).slice(0, PAIRS_PER_ROUND),
    [pIdx]
  );
  const defs = useMemo(() => [...pairs].sort(() => Math.random() - 0.5), [pairs]);

  const [selectedTerm, setSelectedTerm] = useState<string | null>(null);
  const [matched, setMatched] = useState<Record<string, boolean>>({});
  const [wrongFlash, setWrongFlash] = useState<string | null>(null);
  const [time, setTime] = useState(TIME_LIMIT);

  const doneCount = Object.keys(matched).length;

  useEffect(() => {
    if (intro) return;
    if (time <= 0 || doneCount === pairs.length) {
      finishPlayer();
      return;
    }
    const t = setTimeout(() => {
      setTime((v) => v - 1);
      if (time <= 5) playSound('tick');
    }, 1000);
    return () => clearTimeout(t);
  }, [time, intro, doneCount]);

  const finishPlayer = () => {
    if (pIdx + 1 < players.length) {
      setPIdx((v) => v + 1);
      setSelectedTerm(null);
      setMatched({});
      setTime(TIME_LIMIT);
      setIntro(true);
    } else {
      onComplete(scores);
    }
  };

  const pickTerm = (term: string) => {
    if (matched[term]) return;
    playSound('click');
    setSelectedTerm(term);
  };

  const pickDef = (def: string) => {
    if (!selectedTerm) return;
    const pair = pairs.find((p) => p.term === selectedTerm);
    if (pair && pair.def === def) {
      playSound('correct');
      setMatched((m) => ({ ...m, [selectedTerm]: true }));
      setScores((s) => ({ ...s, [player.id]: s[player.id] + 40 + time }));
      setSelectedTerm(null);
    } else {
      playSound('wrong');
      setWrongFlash(def);
      setScores((s) => ({ ...s, [player.id]: Math.max(0, s[player.id] - 5) }));
      setTimeout(() => setWrongFlash(null), 400);
    }
  };

  if (intro) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
        <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }} className="text-6xl">{player.character.emoji}</motion.div>
        <div className="font-display text-2xl font-extrabold text-white">Lượt của {player.name}</div>
        <div className="text-sm text-white/60">Nối khái niệm với định nghĩa đúng trong {TIME_LIMIT}s</div>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => {playSound('click');setIntro(false);setTime(TIME_LIMIT);}} className="mt-2 rounded-xl bg-gold-500 px-8 py-3 font-bold text-ink-950 shadow-glow">Bắt đầu</motion.button>
      </div>);

  }

  return (
    <div className="flex flex-1 flex-col p-4 sm:p-6">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2"><span className="text-2xl">{player.character.emoji}</span><span className="text-sm font-bold text-white">{player.name}</span></div>
        <div className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 font-bold ${time <= 5 ? 'bg-rose-500/20 text-rose-400' : 'bg-white/10 text-white'}`}><Clock size={16} /> {time}s</div>
      </div>
      <div className="grid flex-1 grid-cols-2 gap-3">
        <div className="space-y-2">
          <div className="text-[11px] font-bold uppercase tracking-wide text-white/40">Khái niệm</div>
          {pairs.map((p) =>
          <motion.button
            key={p.term}
            disabled={matched[p.term]}
            onClick={() => pickTerm(p.term)}
            whileTap={{ scale: 0.97 }}
            className={`w-full rounded-xl border p-2.5 text-left text-sm font-bold transition-colors ${
            matched[p.term] ? 'border-emerald-400/40 bg-emerald-500/10 text-emerald-400 line-through opacity-60' : selectedTerm === p.term ? 'border-gold-400 bg-gold-400/15 text-white' : 'border-white/10 bg-ink-800 text-white hover:border-white/30'}`
            }>
            
              {p.term}
            </motion.button>
          )}
        </div>
        <div className="space-y-2">
          <div className="text-[11px] font-bold uppercase tracking-wide text-white/40">Định nghĩa</div>
          {defs.map((p) => {
            const used = matched[pairs.find((x) => x.def === p.def)?.term || ''];
            return (
              <motion.button
                key={p.def}
                disabled={!!used}
                onClick={() => pickDef(p.def)}
                animate={wrongFlash === p.def ? { x: [0, -6, 6, -4, 0] } : {}}
                whileTap={{ scale: 0.97 }}
                className={`w-full rounded-xl border p-2.5 text-left text-xs font-semibold transition-colors ${
                used ? 'border-emerald-400/40 bg-emerald-500/10 text-emerald-400/60 opacity-50' : 'border-white/10 bg-ink-800 text-white/85 hover:border-white/30'}`
                }>
                
                {p.def}
              </motion.button>);

          })}
        </div>
      </div>
      <div className="mt-3 text-center text-xs text-white/50">Đã ghép {doneCount}/{pairs.length} · Điểm: {scores[player.id]}</div>
    </div>);

}