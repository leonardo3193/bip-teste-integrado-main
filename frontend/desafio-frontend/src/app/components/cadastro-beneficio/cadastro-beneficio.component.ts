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
    valor: '',
  };

  salvar() {
    // Remove pontos de milhar e troca vírgula por ponto
    const valorFormatado = this.novoBeneficio.valor.replace(/\./g, '').replace(',', '.');
    const valorNumerico = parseFloat(valorFormatado);

    if (!this.novoBeneficio.nome || isNaN(valorNumerico)) {
      alert('Dados inválidos!');
      return;
    }

    const payload = {
      nome: this.novoBeneficio.nome,
      valor: valorNumerico
    };

    this.loading.set(true);
    this.beneficioService.salvar(payload).subscribe({
      next: () => {
        this.router.navigate(['/gestao-beneficios']).then(() => {
        });
      },
      error: (err) => {
        this.loading.set(false);
        console.error('Erro no payload:', err);
      }
    });
  }

  voltar() {
    this.router.navigate(['/']);
  }
}