class SoundManager {
  constructor() {
    this.enabled = true;
    this.audioContext = null;
    this.sounds = {};
    this.soundFiles = {
      gameMusic: "/src/assets/sounds/game_music.wav",
      jumpDuckMusic: "/src/assets/sounds/jump-duck_music.wav",
      loseMusic: "/src/assets/sounds/lose_music.wav",
      jump: "/src/assets/sounds/jump-duck_music.wav",
      collision: "/src/assets/sounds/lose_music.wav",
    };
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

  async loadSound(key) {
    if (!this.audioContext || this.sounds[key]) return;

    try {
      const response = await fetch(this.soundFiles[key]);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
      this.sounds[key] = audioBuffer;
    } catch (error) {
      console.warn(`Failed to load sound ${key}:`, error);
      // Fallback to beep sounds
      this.generateBeepSound(key);
    }
  }

  generateBeepSound(key) {
    if (!this.audioContext) return;

    const frequencies = {
      jump: 400,
      collision: 150,
      gameMusic: 300,
      jumpDuckMusic: 350,
      loseMusic: 200,
    };

    this.sounds[key] = { beep: true, frequency: frequencies[key] || 300 };
  }

  playSound(key) {
    if (!this.enabled || !this.audioContext) return;

    if (!this.sounds[key]) {
      this.loadSound(key);
      this.playBeep(key === "jump" ? 400 : 150, 0.1, "square");
      return;
    }

    try {
      if (this.sounds[key].beep) {
        this.playBeep(this.sounds[key].frequency, 0.1, "square");
      } else {
        const source = this.audioContext.createBufferSource();
        source.buffer = this.sounds[key];
        source.connect(this.audioContext.destination);
        source.start();
      }
    } catch (error) {
      console.warn(`Failed to play sound ${key}:`, error);
    }
  }

  // FIX: Sound API for all game events
  playJump() {
    this.playSound("jump");
  }

  // FIX: Duck sound when ducking starts
  playDuck() {
    this.playSound("jumpDuckMusic"); // Using jump-duck music for duck action
  }

  playCollision() {
    this.playSound("collision");
  }

  // FIX: Game state sounds
  playGameMusic() {
    this.playSound("gameMusic");
  }

  playLoseMusic() {
    this.playSound("loseMusic");
  }

  // FIX: UI action sounds
  playRestart() {
    this.playBeep(500, 0.2, "sine"); // Restart sound
  }

  playPause() {
    this.playBeep(300, 0.1, "triangle"); // Pause sound
  }

  playResume() {
    this.playBeep(400, 0.1, "triangle"); // Resume sound
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
