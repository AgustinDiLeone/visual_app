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
    path: 'menu/:tipo',
    loadComponent: () =>
      import('./pages/menu/menu.page').then((m) => m.MenuPage),
  },
  {
    path: 'listado/:tipo',
    loadComponent: () =>
      import('./pages/listado/listado.page').then((m) => m.ListadoPage),
  },
  {
    path: 'graficos/:tipo',
    loadComponent: () =>
      import('./pages/graficos/graficos.page').then((m) => m.GraficosPage),
  },
  {
    path: 'imagen-detalle',
    loadComponent: () =>
      import('./Componentes/imagen-detalle/imagen-detalle.component').then(
        (m) => m.ImagenDetalleComponent
      ),
  },
];
