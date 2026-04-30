import { Component, signal, OnInit, inject } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { BeneficioService } from '../../services/beneficio.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

// Definição da interface para tipagem forte (Clean Code)
interface Beneficio {
  id: number;
  nome: string;
  valor: number;
}

@Component({
  selector: 'app-gestao-beneficios',
  standalone: true,
  imports: [CommonModule, FormsModule, CurrencyPipe],
  templateUrl: './gestao-beneficios.component.html',
  styleUrl: './gestao-beneficios.component.css'
})
export class GestaoBeneficiosComponent implements OnInit {
  private router = inject(Router);
  private beneficioService = inject(BeneficioService);

  loading = signal<boolean>(false);

  transferData = {
    fromId: null as number | null,
    toId: null as number | null,
    amount: ''
  };

  beneficios = signal<Beneficio[]>([]);

  ngOnInit(): void {
    this.carregarBeneficios();
  }

  carregarBeneficios(): void {
    this.beneficioService.listAll().subscribe({
      next: (dados) => this.beneficios.set(dados),
      error: (err) => console.error('Erro ao carregar grid:', err)
    });
  }

  executarTransferencia(): void {

    const { fromId, toId, amount } = this.transferData;

    const valorLimpo = amount.replace(/\./g, '').replace(',', '.');
    const valorNumerico = parseFloat(valorLimpo);

    if (!fromId || !toId || isNaN(valorNumerico) || valorNumerico <= 0) {
      alert('Dados de transferência inválidos.');
      return;
    }

    this.loading.set(true);

    this.beneficioService.transferir(fromId, toId, valorNumerico).subscribe({
      next: () => {
        this.loading.set(false);
        this.resetForm();
        alert('Transferência concluída!');
        this.carregarBeneficios();
      },
      error: () => this.loading.set(false)
    });
  }

  private resetForm(): void {
    this.transferData = { fromId: null, toId: null, amount: '' };
  }

  voltar() {
    this.router.navigate(['/']);
  }
}