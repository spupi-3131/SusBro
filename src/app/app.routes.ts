import type { Routes } from '@angular/router';

export const routes: Routes = [
  { path: 'welcome', loadComponent: () => import('./welcome/welcome.page').then((m) => m.WelcomePage) },
  {
    path: 'setup',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  { path: 'game', loadComponent: () => import('./game/game.page').then((m) => m.GamePage) },
  { path: 'results', loadComponent: () => import('./results/results.page').then((m) => m.ResultsPage) },
  { path: 'about', loadComponent: () => import('./about/about.page').then((m) => m.AboutPage) },
  {
    path: '',
    redirectTo: 'welcome',
    pathMatch: 'full',
  },
  { path: '**', redirectTo: 'welcome' },
];
