import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { IonButton, IonContent } from '@ionic/angular';

import { PageHeaderComponent } from '../shared/page-header.component';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
  standalone: true,
  imports: [PageHeaderComponent, RouterLink, IonButton, IonContent],
})
export class WelcomePage {
  private readonly router = inject(Router);
  readonly tagline = 'One spy. One secret word. Keep your cool.';

  startGame(): void {
    void this.router.navigateByUrl('/setup');
  }
}
