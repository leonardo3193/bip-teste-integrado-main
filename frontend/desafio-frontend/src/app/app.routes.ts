import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { GestaoBeneficiosComponent } from './components/gestao-beneficios/gestao-beneficios.component';
import { CadastroBeneficioComponent } from './components/cadastro-beneficio/cadastro-beneficio.component';

export const routes: Routes = [
  { 
    path: '', component: DashboardComponent 
  },
  {
    path: '',
    redirectTo: 'gestao-beneficios',
    pathMatch: 'full'
  },
  {
    path: 'gestao-beneficios',
    component: GestaoBeneficiosComponent
  },
  {
    path: 'novo-beneficio',
    component: CadastroBeneficioComponent
  },
  { path: '**', 
    redirectTo: '' 
  }
];