export function getDailySeed(): string {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export function getDailyHighScore(seed: string): number {
  try {
    const val = localStorage.getItem(`ctpb-daily-high-${seed}`);
    return val ? parseInt(val, 10) : 0;
  } catch {
    return 0;
  }
}

export function saveDailyHighScore(seed: string, score: number): void {
  try {
    const current = getDailyHighScore(seed);
    if (score > current) {
      localStorage.setItem(`ctpb-daily-high-${seed}`, String(score));
    }
  } catch {
    // ignore
  }
}

// LCG (Linear Congruential Generator) for seeded random
export function getSeededRandom(seedStr: string) {
  let h = 0;
  for (let i = 0; i < seedStr.length; i++) {
    h = Math.imul(31, h) + seedStr.charCodeAt(i) | 0;
  }
  
  // LCG parameters
  let state = h;
  return function() {
    state = (Math.imul(1103515245, state) + 12345) & 0x7fffffff;
    return state / 0x80000000;
  };
}
