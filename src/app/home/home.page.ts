import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonSegment,
  IonSegmentButton,
} from '@ionic/angular';

import type { Player } from '../core/models/game.models';
import { GameSessionService } from '../core/services/game-session.service';
import { SoundService } from '../core/services/sound.service';
import { WordService } from '../core/services/word.service';
import { PageHeaderComponent } from '../shared/page-header.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    PageHeaderComponent,
    IonContent,
    IonButton,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonInput,
    IonItem,
    IonLabel,
    IonList,
    IonNote,
    IonSegment,
    IonSegmentButton,
  ],
})
export class HomePage {
  private readonly words = inject(WordService);
  private readonly session = inject(GameSessionService);
  private readonly sounds = inject(SoundService);
  private readonly router = inject(Router);
  private readonly changeDetector = inject(ChangeDetectorRef);
  players: Player[] = Array.from({ length: 4 }, (_, index) => ({ id: `p${index + 1}`, name: '' }));
  newPlayer = '';
  theme = '';
  timerDuration: 30 | 45 | 60 = 45;
  loading = false;
  errorMessage = '';

  get duplicateNames(): boolean {
    const names = this.players.map((player) => player.name.trim().toLocaleLowerCase()).filter(Boolean);
    return new Set(names).size !== names.length;
  }

  get canStart(): boolean {
    return (
      this.players.length >= 4 &&
      this.players.length <= 10 &&
      this.players.every((player) => player.name.trim()) &&
      !this.duplicateNames &&
      !!this.theme.trim() &&
      !this.loading
    );
  }

  addPlayer(): void {
    const name = this.newPlayer.trim();
    if (
      !name ||
      this.players.length >= 10 ||
      this.players.some((p) => p.name.trim().toLocaleLowerCase() === name.toLocaleLowerCase())
    )
      return;
    this.players = [...this.players, { id: `p${Date.now()}`, name }];
    this.newPlayer = '';
  }

  removePlayer(id: string): void {
    if (this.players.length > 4) this.players = this.players.filter((player) => player.id !== id);
  }

  startGame(): void {
    if (!this.canStart) return;
    this.sounds.playStartGame();
    this.loading = true;
    this.errorMessage = '';
    this.words.getRelatedWords(this.theme).subscribe({
      next: (suggestions) => {
        this.loading = false;
        if (!suggestions.length) {
          this.errorMessage = 'No usable words came back for that theme.';
          this.changeDetector.detectChanges();
          return;
        }
        const secret = suggestions[Math.floor(Math.random() * suggestions.length)].word;
        this.session.start(
          this.players.map((player) => ({ ...player, name: player.name.trim() })),
          this.theme.trim(),
          this.timerDuration,
          secret,
        );
        void this.router.navigateByUrl('/game');
      },
      error: (error: unknown) => {
        this.loading = false;
        console.error('Datamuse word API request failed:', error);
        this.errorMessage = 'The word API request failed. Please try again.';
        this.changeDetector.detectChanges();
      },
    });
  }
}
