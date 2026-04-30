import { Routes } from '@angular/router';
import { GestaoBeneficiosComponent } from './components/gestao-beneficios/gestao-beneficios.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'gestao-beneficios',
    pathMatch: 'full'
  },
  {
    path: 'gestao-beneficios',
    component: GestaoBeneficiosComponent
  }
];