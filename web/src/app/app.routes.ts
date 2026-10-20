import { Routes } from '@angular/router';
import { CookiesComponent } from './pages/cookies/cookies';
import { InicioComponent } from './pages/inicio/inicio';
import { PrivacidadComponent } from './pages/privacidad/privacidad';

export const routes: Routes = [
  {
    path: '',
    component: InicioComponent,
    title: 'Nono Reinaldo · Dulce de leche artesanal para tu negocio',
  },
  {
    path: 'privacidad',
    component: PrivacidadComponent,
    title: 'Política de privacidad · Nono Reinaldo',
  },
  {
    path: 'cookies',
    component: CookiesComponent,
    title: 'Política de cookies · Nono Reinaldo',
  },
  { path: '**', redirectTo: '' },
];
