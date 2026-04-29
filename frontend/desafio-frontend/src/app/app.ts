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
    fromId: 0,
    toId: 0,
    amount: 0
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
    if (this.transferData.fromId === this.transferData.toId) {
      alert("Selecione contas diferentes!");
      return;
    }

    this.beneficioService.transferir(
      this.transferData.fromId, 
      this.transferData.toId, 
      this.transferData.amount
    ).subscribe({
      next: () => {
        alert('Transferência realizada!');
        this.carregarBeneficios(); // Atualiza os saldos na tela
      },
      error: (err) => alert('Erro: ' + (err.error.error || 'Falha na operação'))
    });
  }
}