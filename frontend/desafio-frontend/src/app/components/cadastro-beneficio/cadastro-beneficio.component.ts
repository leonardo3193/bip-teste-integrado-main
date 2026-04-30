import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BeneficioService } from '../../services/beneficio.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cadastro-beneficio',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cadastro-beneficio.component.html',
  styleUrl: './cadastro-beneficio.component.css'
})
export class CadastroBeneficioComponent {
  private beneficioService = inject(BeneficioService);
  private router = inject(Router);

  loading = signal(false);
  
  novoBeneficio = {
    nome: '',
    valor: null as number | null
  };

  salvar() {
    if (!this.novoBeneficio.nome || !this.novoBeneficio.valor) {
      alert('Preencha todos os campos!');
      return;
    }

    this.loading.set(true);
    
    this.beneficioService.salvar(this.novoBeneficio).subscribe({
      next: () => {
        alert('Benefício cadastrado com sucesso!');
        this.router.navigate(['/gestao-beneficios']);
      },
      error: (err) => {
        this.loading.set(false);
        console.error(err);
        alert('Erro ao salvar o registro.');
      }
    });
  }

  voltar() {
    this.router.navigate(['/']);
  }
}