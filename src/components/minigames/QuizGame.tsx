




import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Player } from '../../game/types';
import { QUIZ_QUESTIONS } from '../../game/data/quiz';
import { playSound } from '../../game/sound';
import { CheckCircle2, XCircle, Clock } from 'lucide-react';

interface Props {
  players: Player[];
  onComplete: (scores: Record<number, number>) => void;
}

const QUESTIONS_PER_PLAYER = 3;
const TIME_PER_Q = 12;

/** Turn-based quiz: each player answers 3 questions against the clock. Speed & correctness = score. */
export function QuizGame({ players, onComplete }: Props) {
  const questions = useMemo(() => {
    const shuffled = [...QUIZ_QUESTIONS].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, players.length * QUESTIONS_PER_PLAYER);
  }, [players.length]);

  const [pIdx, setPIdx] = useState(0);
  const [qNum, setQNum] = useState(0); // 0..QUESTIONS_PER_PLAYER-1 within player
  const [scores, setScores] = useState<Record<number, number>>(() => Object.fromEntries(players.map((p) => [p.id, 0])));
  const [time, setTime] = useState(TIME_PER_Q);
  const [picked, setPicked] = useState<number | null>(null);
  const [intro, setIntro] = useState(true);

  const player = players[pIdx];
  const qGlobalIdx = pIdx * QUESTIONS_PER_PLAYER + qNum;
  const question = questions[qGlobalIdx];

  useEffect(() => {
    if (intro || picked !== null) return;
    if (time <= 0) {
      handlePick(-1);
      return;
    }
    const t = setTimeout(() => {
      setTime((v) => v - 1);
      if (time <= 4) playSound('tick');
    }, 1000);
    return () => clearTimeout(t);
  }, [time, picked, intro]);

  const advance = () => {
    setPicked(null);
    setTime(TIME_PER_Q);
    if (qNum + 1 < QUESTIONS_PER_PLAYER) {
      setQNum((v) => v + 1);
    } else if (pIdx + 1 < players.length) {
      setPIdx((v) => v + 1);
      setQNum(0);
      setIntro(true);
    } else {
      onComplete(scores);
    }
  };

  const handlePick = (i: number) => {
    if (picked !== null) return;
    setPicked(i);
    const correct = i === question.answer;
    if (correct) {
      const pts = 30 + time * 5; // faster = more
      setScores((s) => ({ ...s, [player.id]: s[player.id] + pts }));
      playSound('correct');
    } else {
      playSound('wrong');
    }
    setTimeout(advance, 1600);
  };

  if (intro) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
        <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-6xl">
          {player.character.emoji}
        </motion.div>
        <div className="font-display text-2xl font-extrabold text-white">Lượt của {player.name}</div>
        <div className="text-sm text-white/60">{QUESTIONS_PER_PLAYER} câu hỏi · Trả lời càng nhanh, điểm càng cao</div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            playSound('click');
            setIntro(false);
            setTime(TIME_PER_Q);
          }}
          className="mt-2 rounded-xl bg-gold-500 px-8 py-3 font-bold text-ink-950 shadow-glow">
          
          Bắt đầu
        </motion.button>
      </div>);

  }

  return (
    <div className="flex flex-1 flex-col p-4 sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{player.character.emoji}</span>
          <div>
            <div className="text-sm font-bold text-white">{player.name}</div>
            <div className="text-[11px] text-white/50">Câu {qNum + 1}/{QUESTIONS_PER_PLAYER}</div>
          </div>
        </div>
        <div className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 font-bold ${time <= 4 ? 'bg-rose-500/20 text-rose-400' : 'bg-white/10 text-white'}`}>
          <Clock size={16} /> {time}s
        </div>
      </div>

      <div className="mb-4 h-1.5 overflow-hidden rounded-full bg-white/10">
        <motion.div className="h-full bg-gold-400" animate={{ width: `${time / TIME_PER_Q * 100}%` }} transition={{ ease: 'linear' }} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={qGlobalIdx} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="flex flex-1 flex-col">
          <h3 className="mb-4 text-lg font-bold text-white">{question.q}</h3>
          <div className="grid flex-1 grid-cols-1 gap-2.5 sm:grid-cols-2">
            {question.options.map((opt, i) => {
              const isAns = i === question.answer;
              const isPicked = i === picked;
              let cls = 'border-white/10 bg-ink-800 hover:border-gold-400/50';
              if (picked !== null) {
                if (isAns) cls = 'border-emerald-400 bg-emerald-500/15';else
                if (isPicked) cls = 'border-rose-400 bg-rose-500/15';else
                cls = 'border-white/5 bg-ink-800/50 opacity-50';
              }
              return (
                <motion.button
                  key={i}
                  disabled={picked !== null}
                  onClick={() => handlePick(i)}
                  whileHover={picked === null ? { scale: 1.02 } : undefined}
                  whileTap={picked === null ? { scale: 0.98 } : undefined}
                  className={`flex items-center justify-between gap-2 rounded-xl border p-3.5 text-left text-sm font-semibold text-white transition-colors ${cls}`}>
                  
                  <span>{opt}</span>
                  {picked !== null && isAns && <CheckCircle2 size={18} className="shrink-0 text-emerald-400" />}
                  {picked !== null && isPicked && !isAns && <XCircle size={18} className="shrink-0 text-rose-400" />}
                </motion.button>);

            })}
          </div>
          {picked !== null &&
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-3 rounded-xl bg-white/5 p-3 text-xs text-white/70">
              💡 {question.explain}
            </motion.div>
          }
        </motion.div>
      </AnimatePresence>
    </div>);

}