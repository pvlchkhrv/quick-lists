import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.components'),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
];
