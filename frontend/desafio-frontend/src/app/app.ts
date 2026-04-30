import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule // Essencial para o router-outlet funcionar
  ],
  template: `
    <router-outlet></router-outlet>
  `,
  styleUrl: './app.css'
})
export class App {}