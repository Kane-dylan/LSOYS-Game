// FEATURE: Basic sound feedback system
class SoundManager {
  constructor() {
    this.enabled = true;
    this.audioContext = null;
    this.sounds = {};
    this.initAudioContext();
  }

  initAudioContext() {
    try {
      this.audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
    } catch (error) {
      console.warn("Web Audio API not supported:", error);
    }
  }

  // FEATURE: Generate simple beep sounds
  playJump() {
    if (!this.enabled || !this.audioContext) return;
    this.playBeep(400, 0.1, "square"); // Jump sound
  }

  playCollision() {
    if (!this.enabled || !this.audioContext) return;
    this.playBeep(150, 0.3, "sawtooth"); // Collision sound
  }

  playBeep(frequency, duration, type = "sine") {
    if (!this.audioContext) return;

    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillator.frequency.value = frequency;
      oscillator.type = type;

      gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.001,
        this.audioContext.currentTime + duration
      );

      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + duration);
    } catch (error) {
      console.warn("Failed to play sound:", error);
    }
  }

  toggle() {
    this.enabled = !this.enabled;
    return this.enabled;
  }

  setEnabled(enabled) {
    this.enabled = enabled;
  }
}

export const soundManager = new SoundManager();
