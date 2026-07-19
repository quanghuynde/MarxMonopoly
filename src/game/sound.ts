


/**
 * Sound engine dùng Web Audio API — tổng hợp âm thanh trực tiếp,
 * không cần tải file. Âm cho: tung xúc xắc, di chuyển, nhận thưởng,
 * kết thúc mini game, click, phạt, chiến thắng.
 */

type SoundName =
'dice' |
'move' |
'reward' |
'penalty' |
'click' |
'correct' |
'wrong' |
'minigameEnd' |
'victory' |
'tick';

let ctx: AudioContext | null = null;
let muted = false;

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!ctx) {
    const AC = window.AudioContext || (window as any).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === 'suspended') void ctx.resume();
  return ctx;
}

function tone(
freq: number,
start: number,
dur: number,
type: OscillatorType,
gain: number,
slideTo?: number)
{
  const ac = getCtx();
  if (!ac) return;
  const osc = ac.createOscillator();
  const g = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, ac.currentTime + start);
  if (slideTo) {
    osc.frequency.exponentialRampToValueAtTime(slideTo, ac.currentTime + start + dur);
  }
  g.gain.setValueAtTime(0.0001, ac.currentTime + start);
  g.gain.exponentialRampToValueAtTime(gain, ac.currentTime + start + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + start + dur);
  osc.connect(g);
  g.connect(ac.destination);
  osc.start(ac.currentTime + start);
  osc.stop(ac.currentTime + start + dur + 0.02);
}

function noise(start: number, dur: number, gain: number) {
  const ac = getCtx();
  if (!ac) return;
  const bufferSize = ac.sampleRate * dur;
  const buffer = ac.createBuffer(1, bufferSize, ac.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
  const src = ac.createBufferSource();
  src.buffer = buffer;
  const g = ac.createGain();
  g.gain.setValueAtTime(gain, ac.currentTime + start);
  g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + start + dur);
  const filter = ac.createBiquadFilter();
  filter.type = 'highpass';
  filter.frequency.value = 900;
  src.connect(filter);
  filter.connect(g);
  g.connect(ac.destination);
  src.start(ac.currentTime + start);
  src.stop(ac.currentTime + start + dur);
}

export function playSound(name: SoundName) {
  if (muted) return;
  switch (name) {
    case 'dice':
      noise(0, 0.06, 0.18);
      noise(0.08, 0.05, 0.14);
      noise(0.16, 0.05, 0.12);
      tone(220, 0.22, 0.1, 'square', 0.08, 320);
      break;
    case 'move':
      tone(440, 0, 0.07, 'triangle', 0.12, 560);
      break;
    case 'reward':
      tone(523, 0, 0.1, 'triangle', 0.14);
      tone(659, 0.09, 0.1, 'triangle', 0.14);
      tone(784, 0.18, 0.16, 'triangle', 0.16);
      break;
    case 'penalty':
      tone(300, 0, 0.16, 'sawtooth', 0.12, 120);
      break;
    case 'click':
      tone(600, 0, 0.04, 'square', 0.08);
      break;
    case 'correct':
      tone(660, 0, 0.09, 'sine', 0.14);
      tone(880, 0.08, 0.14, 'sine', 0.16);
      break;
    case 'wrong':
      tone(200, 0, 0.18, 'sawtooth', 0.12, 90);
      break;
    case 'tick':
      tone(880, 0, 0.03, 'square', 0.05);
      break;
    case 'minigameEnd':
      tone(523, 0, 0.12, 'triangle', 0.14);
      tone(659, 0.1, 0.12, 'triangle', 0.14);
      tone(784, 0.2, 0.12, 'triangle', 0.14);
      tone(1047, 0.3, 0.22, 'triangle', 0.16);
      break;
    case 'victory':
      tone(523, 0, 0.14, 'triangle', 0.15);
      tone(659, 0.14, 0.14, 'triangle', 0.15);
      tone(784, 0.28, 0.14, 'triangle', 0.15);
      tone(1047, 0.42, 0.32, 'triangle', 0.18);
      tone(784, 0.42, 0.32, 'sine', 0.1);
      break;
  }
}

export function setMuted(v: boolean) {
  muted = v;
}
export function isMuted() {
  return muted;
}

export function resumeAudio() {
  getCtx();
}