import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonAccordion, IonAccordionGroup, IonButton, IonContent, IonItem, IonLabel } from '@ionic/angular';

import { PageHeaderComponent } from '../shared/page-header.component';

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
  standalone: true,
  imports: [PageHeaderComponent, IonAccordion, IonAccordionGroup, IonButton, IonContent, IonItem, IonLabel, RouterLink],
})
export class AboutPage {}
