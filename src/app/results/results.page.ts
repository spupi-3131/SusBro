import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonContent } from '@ionic/angular';

import type { GameState } from '../core/models/game.models';
import { GameSessionService } from '../core/services/game-session.service';
import { SoundService } from '../core/services/sound.service';
import { PageHeaderComponent } from '../shared/page-header.component';

@Component({
  selector: 'app-results',
  templateUrl: './results.page.html',
  styleUrls: ['./results.page.scss'],
  standalone: true,
  imports: [
    PageHeaderComponent,
    IonContent,
    IonButton,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    RouterLink,
  ],
})
export class ResultsPage {
  private readonly router = inject(Router);
  private readonly sounds = inject(SoundService);
  readonly session = inject(GameSessionService);

  get state(): GameState | undefined {
    return this.session.state;
  }

  get tallyRows(): { name: string; count: number }[] {
    const state = this.state;
    if (!state?.voteHistory.length) return [];
    const finalBallot = state.voteHistory[state.voteHistory.length - 1];
    const counts = Object.values(finalBallot).reduce<Record<string, number>>((sum, target) => {
      sum[target] = (sum[target] ?? 0) + 1;
      return sum;
    }, {});
    return Object.entries(counts)
      .map(([id, count]) => ({ name: this.session.player(id).name, count }))
      .sort((a, b) => b.count - a.count);
  }

  ionViewWillEnter(): void {
    if (this.state?.winner === 'SPY') this.sounds.playSpyWin();
    else if (this.state?.winner === 'CITIZENS') this.sounds.playCitizensWin();
  }

  playAgain(): void {
    this.session.state = undefined;
    void this.router.navigateByUrl('/setup');
  }
}
