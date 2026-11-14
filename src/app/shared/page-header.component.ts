import { Component, input } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle } from '@ionic/angular';

@Component({
  selector: 'app-page-header',
  standalone: true,
  template: '<ion-header><ion-toolbar><ion-title>{{ title() }}</ion-title></ion-toolbar></ion-header>',
  imports: [IonHeader, IonToolbar, IonTitle],
})
export class PageHeaderComponent {
  readonly title = input.required<string>();
}
