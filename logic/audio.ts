
class AudioEngine {
  private ctx: AudioContext | null = null;
  private enabled: boolean = true;

  constructor() {
    const params = new URLSearchParams(window.location.search);
    this.enabled = params.get('chess_sound') !== 'off';
  }

  private init() {
    if (!this.ctx) this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }

  setEnabled(val: boolean) {
    this.enabled = val;
  }

  private playTone(freq: number, duration: number, type: OscillatorType = 'sine', volume: number = 0.1) {
    if (!this.enabled) return;
    this.init();
    const osc = this.ctx!.createOscillator();
    const gain = this.ctx!.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx!.currentTime);
    
    gain.gain.setValueAtTime(volume, this.ctx!.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx!.currentTime + duration);

    osc.connect(gain);
    gain.connect(this.ctx!.destination);

    osc.start();
    osc.stop(this.ctx!.currentTime + duration);
  }

  move() { this.playTone(400, 0.1, 'sine', 0.05); }
  capture() { this.playTone(300, 0.15, 'triangle', 0.08); }
  check() { 
    this.playTone(600, 0.1, 'square', 0.03);
    setTimeout(() => this.playTone(800, 0.1, 'square', 0.03), 50);
  }
  gameEnd() {
    this.playTone(440, 0.3, 'sine', 0.1);
    setTimeout(() => this.playTone(554, 0.3, 'sine', 0.1), 100);
    setTimeout(() => this.playTone(659, 0.5, 'sine', 0.1), 200);
  }
}

export const audio = new AudioEngine();
