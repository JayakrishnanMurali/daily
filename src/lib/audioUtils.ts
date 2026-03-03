/** Plays an in-browser synthesized sound for key events */

function createAudioContext(): AudioContext | null {
  try {
    return new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  } catch {
    return null;
  }
}

function playTone(
  frequency: number,
  duration: number,
  type: OscillatorType = "sine",
  gain = 0.3,
  delay = 0
): void {
  const ctx = createAudioContext();
  if (!ctx) return;

  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, ctx.currentTime + delay);

  gainNode.gain.setValueAtTime(0, ctx.currentTime + delay);
  gainNode.gain.linearRampToValueAtTime(gain, ctx.currentTime + delay + 0.01);
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + duration);

  oscillator.start(ctx.currentTime + delay);
  oscillator.stop(ctx.currentTime + delay + duration);
}

/** Victory chord — played on task completion */
export function playCelebrationSound(): void {
  playTone(523.25, 0.15, "sine", 0.25, 0);       // C5
  playTone(659.25, 0.15, "sine", 0.25, 0.1);      // E5
  playTone(783.99, 0.15, "sine", 0.25, 0.2);      // G5
  playTone(1046.5, 0.3, "sine", 0.3, 0.35);       // C6
}

/** Dissonant shock — played on streak loss */
export function playDevastationSound(): void {
  playTone(220, 0.4, "sawtooth", 0.2, 0);
  playTone(207.65, 0.6, "sawtooth", 0.15, 0.1);   // Slight dissonance
  playTone(110, 0.8, "square", 0.1, 0.4);
}

/** Soft ping — played on heart loss */
export function playHeartLostSound(): void {
  playTone(440, 0.1, "sine", 0.2, 0);
  playTone(330, 0.3, "sine", 0.15, 0.1);
}

/** Trophy unlock jingle */
export function playTrophySound(): void {
  playTone(659.25, 0.1, "sine", 0.2, 0);         // E5
  playTone(783.99, 0.1, "sine", 0.2, 0.12);       // G5
  playTone(1046.5, 0.1, "sine", 0.2, 0.24);       // C6
  playTone(1318.5, 0.25, "sine", 0.25, 0.36);     // E6
}
