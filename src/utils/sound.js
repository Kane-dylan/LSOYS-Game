// Sound management utility
class SoundManager {
  constructor() {
    this.sounds = {};
    this.muted = false;
    this.volume = 0.5;
    this.audioContext = null;
  }

  // Create simple beep sounds using Web Audio API if files don't exist
  createBeepSound(frequency, duration, type = 'sine') {
    if (!this.audioContext) {
      try {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      } catch (e) {
        console.warn('Web Audio not supported');
        return null;
      }
    }

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.type = type;
    
    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(this.volume * 0.3, this.audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
    
    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
    
    return oscillator;
  }

  async loadSound(name, path) {
    try {
      const audio = new Audio(path);
      audio.preload = 'auto';
      audio.volume = this.volume;
      
      // Test if the file loads
      await new Promise((resolve, reject) => {
        audio.addEventListener('canplaythrough', resolve);
        audio.addEventListener('error', reject);
        audio.load();
      });
      
      this.sounds[name] = audio;
    } catch (error) {
      console.warn(`Failed to load sound: ${name}, using fallback`, error);
      // Create fallback sounds
      this.sounds[name] = { fallback: true, name };
    }
  }

  async initializeSounds() {
    const soundPaths = {
      jump: '/src/assets/sound/jump.mp3',
      hit: '/src/assets/sound/hit.mp3',
      flame: '/src/assets/sound/flame.mp3'
    };

    for (const [name, path] of Object.entries(soundPaths)) {
      await this.loadSound(name, path);
    }
  }

  play(soundName) {
    if (this.muted || !this.sounds[soundName]) return;
    
    try {
      const sound = this.sounds[soundName];
      
      if (sound.fallback) {
        // Use beep sounds as fallback
        switch (soundName) {
          case 'jump':
            this.createBeepSound(440, 0.1, 'sine'); // A4 note
            break;
          case 'hit':
            this.createBeepSound(150, 0.3, 'sawtooth'); // Low harsh sound
            break;
          case 'flame':
            this.createBeepSound(800, 0.2, 'triangle'); // High pitched
            break;
        }
      } else {
        sound.currentTime = 0; // Reset to start
        sound.play();
      }
    } catch (error) {
      console.warn(`Failed to play sound: ${soundName}`, error);
    }
  }

  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume));
    Object.values(this.sounds).forEach(sound => {
      if (!sound.fallback) {
        sound.volume = this.volume;
      }
    });
  }

  toggle() {
    this.muted = !this.muted;
    return this.muted;
  }
}

export const soundManager = new SoundManager();
