import { Routes } from '@angular/router';
import { authGuard } from './core/guard/auth.guard';

export const routes: Routes = [
  {
    path: 'challenge',
    loadComponent: () =>
      import('./features/auth-challenge/login-challenge/login-challenge.component').then((m) => m.LoginChallengeComponent),
  },
  {
    path: '',
    loadComponent: () =>
      import('./features/landing-page/landing-page').then((m) => m.LandingPageComponent),
  },
  {
    path: 'loan-application',
    loadComponent: () =>
      import('./features/loan-application/loan-application.component').then((m) => m.LoanApplicationListComponent),
  },
  {
    path: 'master-cabang',
    loadComponent: () =>
      import('./features/master-cabang/master-cabang').then((m) => m.MasterCabang),
  },
  {
    path: 'master-product',
    // canActivate: [authGuard],
    loadComponent: () =>
      import('./features/product/product.component').then((m) => m.ProductComponent),
  },

  {
    path: '403',
    loadComponent: () =>
      import('./features/forbidden/forbidden.component').then((m) => m.ForbiddenComponent),
  },

  {
    path: '404',
    loadComponent: () =>
      import('./features/not-found/not-found.component').then((m) => m.NotFoundComponent),
  },

  {
    path: '**',
    redirectTo: '404',
  },
];
