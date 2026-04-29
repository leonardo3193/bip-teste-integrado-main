import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { BeneficioService } from './services/beneficio.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  private readonly beneficioService = inject(BeneficioService);

  // Signals para estado reativo
  beneficios = signal<any[]>([]);
  loading = signal(false);

  // Dados do formulário
  transferData = {
    fromId: null as any,
    toId: null as any,
    amount: null as any
  };

  ngOnInit() {
    this.carregarBeneficios();
  }

  carregarBeneficios() {
    this.loading.set(true);
    this.beneficioService.listAll().subscribe({
      next: (data) => this.beneficios.set(data),
      error: (err) => console.error('Erro ao carregar', err),
      complete: () => this.loading.set(false)
    });
  }

  executarTransferencia() {
    this.loading.set(true);

    // Tratamento para garantir que o valor seja numérico (converte vírgula para ponto se necessário)
    let valorFormatado = this.transferData.amount;
    if (typeof valorFormatado === 'string') {
      valorFormatado = parseFloat(valorFormatado.replace(',', '.'));
    }

    // Validação básica no front antes de disparar
    if (isNaN(valorFormatado) || valorFormatado <= 0) {
      alert('Informe um valor válido para a operação.');
      this.loading.set(false);
      return;
    }

    this.beneficioService.transferir(
      this.transferData.fromId,
      this.transferData.toId,
      valorFormatado
    ).subscribe({
      next: () => {
        alert('Transferência realizada com sucesso!');
        this.carregarBeneficios();
        // Limpa o formulário após sucesso
        this.transferData = { fromId: null as any, toId: null as any, amount: null as any };
      },
      error: (err: any) => {
        this.loading.set(false);
        console.error('Erro detalhado:', err);
        const mensagemErro = err.error?.error || err.error?.message || "Verifique o saldo ou os IDs informados.";
        alert('Erro na Operação: ' + mensagemErro);
      },
      complete: () => this.loading.set(false)
    });
  }
}