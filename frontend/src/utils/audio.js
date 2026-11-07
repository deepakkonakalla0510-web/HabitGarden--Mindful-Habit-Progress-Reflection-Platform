/**
 * Web Audio API Botanical Sound Synthesizer
 * Zero external audio assets required. Generates soothing, organic soundscapes
 * for mindful interactions (water droplets, chime of rest, evolution bloom).
 */

class SoundFX {
  constructor() {
    this.ctx = null;
    const stored = typeof window !== 'undefined' ? localStorage.getItem('habitgarden_sound') : null;
    this.enabled = stored !== null ? stored === 'true' : true;
  }

  toggle() {
    this.enabled = !this.enabled;
    if (typeof window !== 'undefined') {
      localStorage.setItem('habitgarden_sound', String(this.enabled));
    }
    return this.enabled;
  }

  isEnabled() {
    return this.enabled;
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  /**
   * Action 1: Gentle water droplet ripple sound
   */
  playWaterDrop() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;

      // Primary droplet oscillator (sine wave with upward frequency sweep)
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.08);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.25);

      // Subtle second resonant harmonic drop
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(900, now + 0.04);
      osc2.frequency.exponentialRampToValueAtTime(1600, now + 0.12);

      gain2.gain.setValueAtTime(0.1, now + 0.04);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc2.connect(gain2);
      gain2.connect(this.ctx.destination);

      osc2.start(now + 0.04);
      osc2.stop(now + 0.28);
    } catch (e) {
      // Audio playback silently ignored if blocked by autoplay policy
    }
  }

  /**
   * Action 2: Grounding, warm singing bowl chime for rest days
   */
  playRestChime() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const fundamental = 330; // E4 warm note

      [fundamental, fundamental * 1.5].forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.12 / (idx + 1), now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.85);
      });
    } catch (e) {}
  }

  /**
   * Canopy Evolution Milestone Fanfare: Gentle crystalline bloom chord
   */
  playBloomChord() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 (Bright botanical harmony)

      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0.15, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 0.7);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.75);
      });
    } catch (e) {}
  }
}

export const sound = new SoundFX();

