import { Component, signal, computed } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
export class GestaoBeneficiosComponent {
  
  // Lista de benefícios utilizando Signals para reatividade performática
  beneficios = signal<Beneficio[]>([
    { id: 12, nome: 'Vale Transporte', valor: 797.00 },
    { id: 123, nome: 'Auxílio Alimentação', valor: 703.00 }
  ]);

  // Estado do formulário de transferência
  transferData = {
    fromId: null as number | null,
    toId: null as number | null,
    amount: ''
  };

  // Signal para controle de estado da UI (Loading)
  loading = signal<boolean>(false);

  /**
   * Executa a lógica de transferência entre contas de benefícios.
   * Em um cenário real, aqui seria feita a chamada ao seu backend Java/Spring Boot.
   */
  executarTransferencia(): void {
    const { fromId, toId, amount } = this.transferData;
    const valorNumerico = parseFloat(amount.replace(',', '.'));

    if (!fromId || !toId || isNaN(valorNumerico)) {
      alert('Por favor, preencha todos os campos corretamente.');
      return;
    }

    this.loading.set(true);

    // Simulação de processamento (Mock do serviço)
    setTimeout(() => {
      this.beneficios.update(lista => {
        return lista.map(b => {
          if (b.id === fromId) return { ...b, valor: b.valor - valorNumerico };
          if (b.id === toId) return { ...b, valor: b.valor + valorNumerico };
          return b;
        });
      });

      this.loading.set(false);
      this.resetForm();
      alert('Transferência realizada com sucesso!');
    }, 800);
  }

  private resetForm(): void {
    this.transferData = {
      fromId: null,
      toId: null,
      amount: ''
    };
  }
}