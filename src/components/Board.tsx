




import { useMemo } from 'react';
import { motion } from 'framer-motion';
import type { Player } from '../game/types';
import { TILES, BOARD_SIZE } from '../game/data/tiles';
import { Icon } from './Icon';
import { Guilloche } from './Guilloche';

interface Props {
  players: Player[];
  currentPlayerId?: number;
  highlightPos?: number;
}

/** Arrange BOARD_SIZE tiles around a square ring. Returns grid col/row (1-indexed) per tile. */
function useRingLayout(size: number) {
  return useMemo(() => {
    // side length so 4*side - 4 = size (approx). For 44 => side 12 -> 44 exactly.
    const side = Math.round((size + 4) / 4);
    const grid = side; // side x side cells
    const cells: {col: number;row: number;}[] = [];
    // top row left->right
    for (let c = 0; c < grid; c++) cells.push({ col: c + 1, row: 1 });
    // right col top->bottom (skip first)
    for (let r = 1; r < grid; r++) cells.push({ col: grid, row: r + 1 });
    // bottom row right->left (skip first)
    for (let c = grid - 2; c >= 0; c--) cells.push({ col: c + 1, row: grid });
    // left col bottom->top (skip first & last)
    for (let r = grid - 2; r >= 1; r--) cells.push({ col: 1, row: r + 1 });
    return { cells: cells.slice(0, size), grid };
  }, [size]);
}

export function Board({ players, currentPlayerId, highlightPos }: Props) {
  const { cells, grid } = useRingLayout(BOARD_SIZE);

  const tokensByTile = useMemo(() => {
    const map: Record<number, Player[]> = {};
    players.forEach((p) => {
      const pos = p.position % BOARD_SIZE;
      (map[pos] ||= []).push(p);
    });
    return map;
  }, [players]);

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[820px]">
      <div
        className="grid h-full w-full gap-1.5"
        style={{ gridTemplateColumns: `repeat(${grid}, 1fr)`, gridTemplateRows: `repeat(${grid}, 1fr)` }}>
        
        {cells.map((cell, idx) => {
          const tile = TILES[idx];
          const highlight = highlightPos === idx;
          return (
            <motion.div
              key={idx}
              style={{ gridColumn: cell.col, gridRow: cell.row }}
              className="relative">
              
              <div
                className={`group relative flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-lg border p-0.5 text-center transition-all ${
                highlight ? 'border-white ring-2 ring-white' : 'border-white/10'}`
                }
                style={{
                  background: `linear-gradient(160deg, ${tile.color}26, ${tile.color}0d)`
                }}
                title={tile.name}>
                
                <span
                  className="flex h-4 w-4 shrink-0 items-center justify-center rounded-md sm:h-5 sm:w-5 md:h-6 md:w-6"
                  style={{ backgroundColor: tile.color + '33', color: tile.color }}>

                  <Icon name={tile.icon} size={11} />
                </span>
                <span className="mt-0.5 line-clamp-3 px-0.5 text-[7.5px] font-bold leading-[1.15] text-white/85 sm:text-[9px] md:text-[10px]">
                  {tile.name}
                </span>
                {highlight &&
                <motion.span
                  layoutId="tile-glow"
                  className="pointer-events-none absolute inset-0 rounded-lg"
                  style={{ boxShadow: `inset 0 0 14px ${tile.color}` }} />

                }
                {/* tokens */}
                {tokensByTile[idx] &&
                <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-center justify-center gap-0.5 p-0.5">
                    {tokensByTile[idx].map((p) =>
                  <motion.span
                    layoutId={`token-${p.id}`}
                    key={p.id}
                    transition={{ type: 'spring', stiffness: 260, damping: 22 }}
                    className={`flex h-3.5 w-3.5 items-center justify-center rounded-full text-[9px] ring-2 sm:h-4 sm:w-4 ${
                    p.id === currentPlayerId ? 'z-10 animate-floaty' : ''}`
                    }
                    style={{
                      backgroundColor: p.character.color,
                      boxShadow: p.id === currentPlayerId ? `0 0 8px ${p.character.color}` : undefined
                    }}
                    title={p.name}>
                    
                        <span className="text-[8px] leading-none">{p.character.emoji}</span>
                      </motion.span>
                  )}
                  </div>
                }
              </div>
            </motion.div>);

        })}
      </div>

      {/* Center emblem — seal medallion */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="flex flex-col items-center gap-1 rounded-full border border-brass-400/40 bg-ink-900/70 px-6 py-5 text-center backdrop-blur-sm">
          <div className="font-display text-lg font-extrabold text-brass-400 sm:text-2xl">MarxMonopoly</div>
          <div className="text-[9px] font-bold uppercase tracking-[0.25em] text-white/50 sm:text-xs">
            Cờ Tỷ Phú Kinh Tế Học
          </div>
          <Guilloche className="mt-1 w-20 text-brass-400/60" height={6} />
        </div>
      </div>
    </div>);

}