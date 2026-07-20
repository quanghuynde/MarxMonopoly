import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../game/GameContext';
import { CHARACTERS } from '../game/data/characters';
import type { Character } from '../game/types';
import { playSound } from '../game/sound';
import { ArrowLeft, Check, Dices, Play } from 'lucide-react';
import { getDailySeed } from '../game/daily';

const ROUND_OPTIONS = [3, 5, 8];

export function CharacterScreen() {
  const { state, dispatch } = useGame();
  const isSolo = state.gameMode !== 'multiplayer';
  const maxPicksCount = isSolo ? 1 : 4;

  const [rounds, setRounds] = useState(() => {
    if (state.gameMode === 'endless') return 99;
    if (state.gameMode === 'daily') return 5;
    return 5; // default for solo / story / multiplayer
  });
  
  const [picks, setPicks] = useState<(Character | null)[]>(
    isSolo ? [null] : [null, null, null, null]
  );
  
  const [active, setActive] = useState(0);
  const [ordering, setOrdering] = useState(false);
  const [rolls, setRolls] = useState<Record<number, number>>({});

  const chosenIds = picks.filter(Boolean).map((c) => c!.id);
  const allPicked = picks.every(Boolean);

  const choose = (c: Character) => {
    if (chosenIds.includes(c.id) && picks[active]?.id !== c.id) return;
    playSound('click');
    const next = [...picks];
    next[active] = c;
    setPicks(next);
    
    const nextEmpty = next.findIndex((p) => !p);
    if (nextEmpty >= 0 && nextEmpty < maxPicksCount) {
      setActive(nextEmpty);
    }
  };

  const startOrdering = () => {
    if (isSolo) {
      // In solo campaign/survival/etc, no ordering needed. Go straight to setup.
      beginSoloGame();
      return;
    }

    playSound('dice');
    // roll dice for turn order
    const r: Record<number, number> = {};
    picks.forEach((_, i) => r[i] = 1 + Math.floor(Math.random() * 6));
    setRolls(r);
    setOrdering(true);
  };

  const beginSoloGame = () => {
    playSound('reward');
    const dailySeed = state.gameMode === 'daily' ? getDailySeed() : '';
    let target = 400;
    if (state.gameMode === 'story') {
      target = state.storyChapterId === 1 ? 300 : state.storyChapterId === 2 ? 500 : 700;
    } else if (state.gameMode === 'endless') {
      target = 999999; // no target in endless survival
    }

    dispatch({
      type: 'START_GAME',
      players: [{ character: picks[0]!, name: picks[0]!.name }],
      totalRounds: rounds,
      turnOrder: [0],
      gameMode: state.gameMode,
      soloTargetScore: target,
      dailySeed,
      storyChapterId: state.storyChapterId
    });
  };

  const beginGame = () => {
    playSound('reward');
    const order = Object.entries(rolls).
    sort((a, b) => b[1] - a[1]).
    map(([id]) => Number(id));
    dispatch({
      type: 'START_GAME',
      players: picks.map((c) => ({ character: c!, name: c!.name })),
      totalRounds: rounds,
      turnOrder: order,
      gameMode: 'multiplayer'
    });
  };

  return (
    <div className="min-h-full w-full overflow-y-auto bg-ink-950 bg-grid px-4 py-8">
      <div className="mx-auto max-w-3xl">
        <button onClick={() => {playSound('click');dispatch({ type: 'SET_SCREEN', screen: 'modeSelect' });}} className="mb-5 flex items-center gap-2 text-sm font-bold text-white/60 transition-colors hover:text-white">
          <ArrowLeft size={18} /> Chọn chế độ
        </button>

        <AnimatePresence mode="wait">
          {!ordering ?
          <motion.div key="pick" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -30 }}>
              <h1 className="font-display text-3xl font-extrabold text-white text-shadow-lg sm:text-4xl">Chọn nhân vật</h1>
              <p className="mt-1 text-white/60">
                {isSolo ? 'Chọn nhân vật đại diện cho bạn trên thương trường.' : '4 người chơi — mỗi người một nhân vật riêng.'}
              </p>

              {/* player slots */}
              {isSolo ? (
                <div className="mt-5 flex justify-center">
                  {picks.map((p, i) =>
                    <button
                      key={i}
                      onClick={() => {playSound('click');setActive(i);}}
                      className={`flex flex-col items-center gap-1 rounded-2xl border-2 px-8 py-3 transition-all border-brass-400 bg-ink-700`}>
                      <span className="text-[10px] font-bold uppercase tracking-wide text-brass-400">Bạn</span>
                      <span className="text-4xl">{p ? p.emoji : '➕'}</span>
                      <span className="truncate text-sm font-bold text-white">{p ? p.name : 'Chọn'}</span>
                    </button>
                  )}
                </div>
              ) : (
                <div className="mt-5 grid grid-cols-4 gap-2">
                  {picks.map((p, i) =>
                    <button
                      key={i}
                      onClick={() => {playSound('click');setActive(i);}}
                      className={`flex flex-col items-center gap-1 rounded-2xl border-2 p-2.5 transition-all ${active === i ? 'border-brass-400 bg-ink-700' : 'border-white/10 bg-ink-850'}`}>
                      <span className="text-[10px] font-bold uppercase tracking-wide text-white/40">P{i + 1}</span>
                      <span className="text-3xl">{p ? p.emoji : '➕'}</span>
                      <span className="truncate text-xs font-bold text-white">{p ? p.name : 'Chọn'}</span>
                    </button>
                  )}
                </div>
              )}

              {/* character grid */}
              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {CHARACTERS.map((c) => {
                const taken = chosenIds.includes(c.id) && picks[active]?.id !== c.id;
                const selectedHere = picks[active]?.id === c.id;
                return (
                  <motion.button
                    key={c.id}
                    disabled={taken}
                    onClick={() => choose(c)}
                    whileHover={!taken ? { scale: 1.03, y: -3 } : undefined}
                    whileTap={!taken ? { scale: 0.97 } : undefined}
                    className={`relative overflow-hidden rounded-2xl border-2 p-4 text-left transition-all ${selectedHere ? 'border-brass-400' : 'border-white/10'} ${taken ? 'opacity-35' : ''}`}
                    style={{ background: `linear-gradient(150deg, ${c.color}26, ${c.color}08)` }}>
                    
                      {selectedHere && <span className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-brass-400 text-ink-950"><Check size={14} /></span>}
                      <div className="text-4xl">{c.emoji}</div>
                      <div className="mt-2 font-display text-lg font-extrabold text-white">{c.name}</div>
                      <div className={`text-xs font-bold ${c.accent}`}>{c.title}</div>
                      <div className="mt-1 text-[11px] leading-snug text-white/55">{c.blurb}</div>
                    </motion.button>);

              })}
              </div>

              {/* rounds selection (for all round-based modes) */}
              {state.gameMode !== 'endless' && (
                <div className="mt-7">
                  <div className="mb-2 text-sm font-bold text-white/70">Số vòng chơi</div>
                  <div className="flex gap-2">
                    {ROUND_OPTIONS.map((r) =>
                      <button key={r} onClick={() => {playSound('click');setRounds(r);}} className={`flex-1 rounded-xl border-2 py-2.5 font-bold transition-colors ${rounds === r ? 'border-brass-400 bg-brass-400/15 text-brass-400' : 'border-white/10 bg-ink-850 text-white/70'}`}>
                        {r} vòng
                      </button>
                    )}
                  </div>
                </div>
              )}

              <motion.button
                disabled={!allPicked}
                whileHover={allPicked ? { scale: 1.02 } : undefined}
                whileTap={allPicked ? { scale: 0.98 } : undefined}
                onClick={startOrdering}
                className="mt-7 flex w-full items-center justify-center gap-2 rounded-2xl bg-brass-500 py-4 font-display text-lg font-extrabold text-ink-950 shadow-glow transition-colors hover:bg-brass-400 disabled:cursor-not-allowed disabled:opacity-40">
                {isSolo ? (
                  <>
                    <Play size={22} /> Vào bàn cờ
                  </>
                ) : (
                  <>
                    <Dices size={22} /> Tung xúc xắc xác định lượt
                  </>
                )}
              </motion.button>
            </motion.div> :

          <motion.div key="order" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col items-center text-center">
              <h1 className="font-display text-3xl font-extrabold text-white text-shadow-lg">Thứ tự lượt đi</h1>
              <p className="mt-1 text-white/60">Ai tung điểm cao sẽ đi trước!</p>
              <div className="mt-6 w-full max-w-md space-y-2">
                {Object.entries(rolls).sort((a, b) => b[1] - a[1]).map(([id, val], i) => {
                const c = picks[Number(id)]!;
                return (
                  <motion.div key={id} initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.15 }} className={`flex items-center gap-3 rounded-2xl border p-3 ${i === 0 ? 'border-brass-400/60 bg-brass-400/10' : 'border-white/10 bg-ink-850'}`}>
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 font-extrabold text-white">{i + 1}</span>
                      <span className="text-2xl">{c.emoji}</span>
                      <span className="flex-1 text-left font-bold text-white">{c.name}</span>
                      <span className="flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1 font-extrabold text-brass-400"><Dices size={16} /> {val}</span>
                    </motion.div>);

              })}
              </div>
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={beginGame} className="mt-7 flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-10 py-4 font-display text-lg font-extrabold text-white shadow-card transition-colors hover:bg-emerald-400">
                <Play size={22} /> Vào bàn cờ
              </motion.button>
            </motion.div>
          }
        </AnimatePresence>
      </div>
    </div>);
}