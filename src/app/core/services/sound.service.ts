import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SoundService {
  private audioContext?: AudioContext;

  playStartGame(): void {
    this.play('assets/audio/start-game.mp3');
  }

  playEmergencyMeeting(): void {
    this.play('assets/audio/emergency-meeting.mp3');
  }

  playSpyWin(): void {
    this.play('assets/audio/spy-win.mp3');
  }

  playCitizensWin(): void {
    this.play('assets/audio/citizens-win.mp3');
  }

  activateTimerAudio(): void {
    if (typeof AudioContext === 'undefined') return;
    this.audioContext ??= new AudioContext();
    if (this.audioContext.state === 'suspended') void this.audioContext.resume().catch(() => undefined);
  }

  playTimerTick(): void {
    this.playTone(1050, 0.05, 0.055);
  }

  playTimerEnd(): void {
    [880, 1175, 880].forEach((frequency, index) => this.playTone(frequency, 0.16, 0.12, index * 0.2));
  }

  private play(assetPath: string): void {
    const audio = new Audio(new URL(assetPath, document.baseURI).toString());
    void audio.play().catch(() => undefined);
  }

  private playTone(frequency: number, duration: number, volume: number, delay = 0): void {
    const context = this.audioContext;
    if (!context || context.state !== 'running') return;

    const startAt = context.currentTime + delay;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, startAt);
    gain.gain.setValueAtTime(0.0001, startAt);
    gain.gain.exponentialRampToValueAtTime(volume, startAt + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(startAt);
    oscillator.stop(startAt + duration);
  }
}
