import { Routes } from '@angular/router';

export const appRoutes: Routes = [
  {
    path: 'checkout',
    loadChildren: () => import('./features/checkout/checkout.routes').then(m => m.CHECKOUT_ROUTES)
  },
  { path: '', redirectTo: '/checkout', pathMatch: 'full' },
  { path: '**', redirectTo: '/checkout' }
];
