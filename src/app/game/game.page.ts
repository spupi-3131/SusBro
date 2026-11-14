import type { OnDestroy } from '@angular/core';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonInput,
  IonItem,
  IonList,
  IonRadio,
  IonRadioGroup,
} from '@ionic/angular';

import type { GameState, Player } from '../core/models/game.models';
import { GameSessionService } from '../core/services/game-session.service';
import { SoundService } from '../core/services/sound.service';
import { PageHeaderComponent } from '../shared/page-header.component';

@Component({
  selector: 'app-game',
  templateUrl: './game.page.html',
  styleUrls: ['./game.page.scss'],
  standalone: true,
  imports: [
    FormsModule,
    PageHeaderComponent,
    IonContent,
    IonButton,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonInput,
    IonItem,
    IonList,
    IonRadio,
    IonRadioGroup,
  ],
})
export class GamePage implements OnDestroy {
  readonly session = inject(GameSessionService);
  private readonly sounds = inject(SoundService);
  private readonly router = inject(Router);
  private readonly changeDetector = inject(ChangeDetectorRef);
  roleVisible = false;
  voteLocked = false;
  selectedTarget = '';
  spyGuess = '';
  guessVisible = false;
  timerId?: ReturnType<typeof setInterval>;

  get state(): GameState | undefined {
    return this.session.state;
  }

  ionViewWillEnter(): void {
    this.roleVisible = false;
    this.voteLocked = false;
    this.selectedTarget = '';
    this.spyGuess = '';
    this.guessVisible = false;
    if (!this.state) {
      this.stopTimer();
      return;
    }
    this.startTimer();
  }

  returnToSetup(): void {
    void this.router.navigateByUrl('/setup');
  }

  ngOnDestroy(): void {
    this.stopTimer();
  }

  get currentRevealId(): string {
    return this.state!.players[this.state!.revealIndex].id;
  }
  get currentRevealPlayer(): Player {
    return this.session.player(this.currentRevealId);
  }
  get activeId(): string {
    return this.state!.turnOrder[this.state!.turnIndex];
  }
  get activePlayer(): Player {
    return this.session.player(this.activeId);
  }
  get currentVoterId(): string {
    return this.state!.turnOrder[Object.keys(this.state!.votes).length];
  }
  get currentVoter(): Player {
    return this.session.player(this.currentVoterId);
  }
  get votesCount(): number {
    return Object.keys(this.state!.votes).length;
  }
  get suspects(): Player[] {
    return this.state!.players.filter((player) => player.id !== this.currentVoterId);
  }
  get guessPlayer(): Player {
    return this.session.player(this.state!.spyId);
  }
  get clockText(): string {
    return `00:${String(this.state?.secondsRemaining ?? 0).padStart(2, '0')}`;
  }

  reveal(): void {
    this.roleVisible = true;
  }
  hideRole(): void {
    this.roleVisible = false;
    if (this.state!.revealIndex + 1 < this.state!.players.length) this.state!.revealIndex++;
    else this.enterClues();
  }

  private enterClues(): void {
    this.state!.phase = 'clues';
    this.state!.turnIndex = 0;
    this.state!.secondsRemaining = this.state!.settings.timerDuration;
    this.sounds.activateTimerAudio();
    this.startTimer();
  }

  private startTimer(): void {
    this.stopTimer();
    if (this.state?.phase !== 'clues') return;
    this.timerId = setInterval(() => {
      if (!this.state || this.state.phase !== 'clues') return;
      if (this.state.secondsRemaining <= 1) {
        this.sounds.playTimerEnd();
        this.advanceTurn();
      } else {
        this.state.secondsRemaining--;
        this.sounds.playTimerTick();
      }
      this.changeDetector.detectChanges();
    }, 1000);
  }

  private stopTimer(): void {
    if (this.timerId) clearInterval(this.timerId);
    this.timerId = undefined;
  }

  advanceTurn(): void {
    if (this.state!.phase !== 'clues') return;
    if (this.state!.turnIndex + 1 < this.state!.turnOrder.length) {
      this.state!.turnIndex++;
      this.state!.secondsRemaining = this.state!.settings.timerDuration;
    } else {
      this.beginVoting();
    }
  }

  callMeeting(): void {
    if (this.state!.meetingUsed) return;
    this.sounds.playEmergencyMeeting();
    this.state!.meetingUsed = true;
    this.stopTimer();
    this.state!.phase = 'meeting';
  }

  beginVoting(): void {
    this.stopTimer();
    this.state!.phase = 'voting';
    this.state!.votes = {};
    this.voteLocked = false;
    this.selectedTarget = '';
  }

  confirmVote(): void {
    if (!this.selectedTarget || this.selectedTarget === this.currentVoterId || this.voteLocked) return;
    this.state!.votes[this.currentVoterId] = this.selectedTarget;
    this.voteLocked = true;
  }

  continueVoting(): void {
    if (!this.voteLocked) return;
    this.voteLocked = false;
    this.selectedTarget = '';
    if (Object.keys(this.state!.votes).length < this.state!.players.length) return;
    const completedVotes = { ...this.state!.votes };
    this.state!.voteHistory.push(completedVotes);
    const tally = this.tally(completedVotes);
    const max = Math.max(...Object.values(tally));
    const leaders = Object.entries(tally)
      .filter(([, count]) => count === max)
      .map(([id]) => id);
    if (leaders.length > 1) {
      if (this.state!.voteRound === 1) {
        this.state!.voteRound = 2;
        this.state!.clueCycle = 2;
        this.state!.turnOrder = this.session.shuffle(this.state!.turnOrder);
        this.state!.turnIndex = 0;
        this.state!.secondsRemaining = this.state!.settings.timerDuration;
        this.state!.phase = 'clues';
        this.startTimer();
      } else {
        this.finish('SPY');
      }
    } else if (leaders[0] !== this.state!.spyId) {
      this.finish('SPY');
    } else {
      this.state!.phase = 'guess';
      this.spyGuess = '';
      this.guessVisible = false;
    }
  }

  tally(votes = this.state!.votes): Record<string, number> {
    return Object.values(votes).reduce<Record<string, number>>((counts, target) => {
      counts[target] = (counts[target] ?? 0) + 1;
      return counts;
    }, {});
  }

  submitGuess(): void {
    if (!this.spyGuess.trim()) return;
    this.state!.finalGuess = this.spyGuess.trim();
    this.state!.guessCorrect = this.spyGuess.trim().toLocaleLowerCase() === this.state!.secretWord.toLocaleLowerCase();
    this.finish(this.state!.guessCorrect ? 'SPY' : 'CITIZENS');
  }

  revealGuess(): void {
    this.guessVisible = true;
  }
  hideGuess(): void {
    this.guessVisible = false;
  }

  private finish(winner: 'CITIZENS' | 'SPY'): void {
    this.stopTimer();
    this.state!.winner = winner;
    this.state!.phase = 'results';
    this.session.save();
    void this.router.navigateByUrl('/results');
  }
}
