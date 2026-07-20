







import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import type { Player } from '../../game/types';
import { QUIZ_QUESTIONS } from '../../game/data/quiz';
import { playSound } from '../../game/sound';
import { CheckCircle2, XCircle } from 'lucide-react';

interface Props {
  players: Player[];
  onComplete: (scores: Record<number, number>) => void;
}

const SEGMENTS = [
{ label: 'x1', mult: 1, color: '#38bdf8' },
{ label: 'x2', mult: 2, color: '#c8933f' },
{ label: 'x1', mult: 1, color: '#a3e635' },
{ label: 'x3', mult: 3, color: '#f43f5e' },
{ label: 'x1', mult: 1, color: '#c084fc' },
{ label: 'x2', mult: 2, color: '#2dd4bf' }];


/** Spin wheel for a multiplier, then answer a question. Correct answer × multiplier = score. */
export function WheelGame({ players, onComplete }: Props) {
  const [pIdx, setPIdx] = useState(0);
  const [scores, setScores] = useState<Record<number, number>>(() => Object.fromEntries(players.map((p) => [p.id, 0])));
  const [phase, setPhase] = useState<'intro' | 'spin' | 'question' | 'result'>('intro');
  const [rotation, setRotation] = useState(0);
  const [mult, setMult] = useState(1);
  const [picked, setPicked] = useState<number | null>(null);

  const player = players[pIdx];
  const question = useMemo(() => QUIZ_QUESTIONS[Math.floor(Math.random() * QUIZ_QUESTIONS.length)], [pIdx, phase === 'question']);

  const spin = () => {
    playSound('dice');
    const seg = Math.floor(Math.random() * SEGMENTS.length);
    const segAngle = 360 / SEGMENTS.length;
    const target = 360 * 5 + (360 - (seg * segAngle + segAngle / 2));
    setRotation(target);
    setTimeout(() => {
      setMult(SEGMENTS[seg].mult);
      playSound('reward');
      setPhase('question');
    }, 2600);
  };

  const pick = (i: number) => {
    if (picked !== null) return;
    setPicked(i);
    const correct = i === question.answer;
    if (correct) {
      playSound('correct');
      setScores((s) => ({ ...s, [player.id]: s[player.id] + 50 * mult }));
    } else {
      playSound('wrong');
    }
    setPhase('result');
    setTimeout(() => {
      if (pIdx + 1 < players.length) {
        setPIdx((v) => v + 1);
        setPicked(null);
        setRotation(0);
        setPhase('intro');
      } else {
        onComplete(scores);
      }
    }, 1800);
  };

  return (
    <div className="flex flex-1 flex-col items-center justify-center p-4 sm:p-6">
      <div className="mb-4 flex items-center gap-2"><span className="text-2xl">{player.character.emoji}</span><span className="text-sm font-bold text-white">{player.name}</span></div>

      {(phase === 'intro' || phase === 'spin') &&
      <div className="flex flex-col items-center gap-5">
          <div className="relative">
            <div className="absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-1 text-2xl">🔻</div>
            <motion.div
            className="h-56 w-56 rounded-full border-4 border-white/20 shadow-card"
            animate={{ rotate: rotation }}
            transition={{ duration: 2.6, ease: [0.15, 0.8, 0.2, 1] }}
            style={{
              background: `conic-gradient(${SEGMENTS.map((s, i) => `${s.color} ${i * 100 / SEGMENTS.length}% ${(i + 1) * 100 / SEGMENTS.length}%`).join(', ')})`
            }}>
            
              {SEGMENTS.map((s, i) => {
              const angle = 360 / SEGMENTS.length * i + 360 / SEGMENTS.length / 2;
              return (
                <span
                  key={i}
                  className="absolute left-1/2 top-1/2 font-display text-lg font-extrabold text-ink-950"
                  style={{ transform: `rotate(${angle}deg) translateY(-88px) rotate(-${angle}deg)` }}>
                  
                    {s.label}
                  </span>);

            })}
            </motion.div>
            <div className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink-900 ring-4 ring-white/20" />
          </div>
          <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={phase === 'spin'}
          onClick={() => {setPhase('spin');spin();}}
          className="rounded-xl bg-brass-500 px-8 py-3 font-bold text-ink-950 shadow-glow disabled:opacity-60">
          
            {phase === 'spin' ? 'Đang quay...' : 'Quay!'}
          </motion.button>
        </div>
      }

      {(phase === 'question' || phase === 'result') &&
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <div className="mb-3 text-center">
            <span className="rounded-full bg-brass-400/20 px-3 py-1 font-display text-lg font-extrabold text-brass-400">Hệ số x{mult}</span>
          </div>
          <h3 className="mb-4 text-center text-lg font-bold text-white">{question.q}</h3>
          <div className="grid grid-cols-1 gap-2.5">
            {question.options.map((opt, i) => {
            const isAns = i === question.answer;
            let cls = 'border-white/10 bg-ink-800 hover:border-brass-400/50';
            if (picked !== null) {
              if (isAns) cls = 'border-emerald-400 bg-emerald-500/15';else
              if (i === picked) cls = 'border-rose-400 bg-rose-500/15';else
              cls = 'border-white/5 opacity-50';
            }
            return (
              <motion.button key={i} disabled={picked !== null} onClick={() => pick(i)} whileTap={{ scale: 0.98 }} className={`flex items-center justify-between rounded-xl border p-3.5 text-left text-sm font-semibold text-white transition-colors ${cls}`}>
                  <span>{opt}</span>
                  {picked !== null && isAns && <CheckCircle2 size={18} className="text-emerald-400" />}
                  {picked !== null && i === picked && !isAns && <XCircle size={18} className="text-rose-400" />}
                </motion.button>);

          })}
          </div>
        </motion.div>
      }
    </div>);

}