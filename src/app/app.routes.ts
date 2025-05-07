import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./pages/home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'lindas',
    loadComponent: () =>
      import('./pages/lindas/lindas.component').then((m) => m.LindasComponent),
  },
  {
    path: 'feas',
    loadComponent: () =>
      import('./pages/feas/feas.component').then((m) => m.FeasComponent),
  },
  {
    path: 'menu/:tipo',
    loadComponent: () =>
      import('./pages/menu/menu.page').then((m) => m.MenuPage),
  },
];
