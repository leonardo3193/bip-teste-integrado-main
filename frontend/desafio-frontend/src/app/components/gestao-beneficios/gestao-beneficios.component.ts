import { Component, signal, computed,inject } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
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
export class GestaoBeneficiosComponent {
  private router = inject(Router);


  beneficios = signal<Beneficio[]>([
    { id: 12, nome: 'Vale Transporte', valor: 797.00 },
    { id: 123, nome: 'Auxílio Alimentação', valor: 703.00 }
  ]);


  transferData = {
    fromId: null as number | null,
    toId: null as number | null,
    amount: ''
  };

  loading = signal<boolean>(false);

  executarTransferencia(): void {
    const { fromId, toId, amount } = this.transferData;

    // SOLUÇÃO: 
    // 1. Remove todos os pontos (milhares)
    // 2. Troca a vírgula por ponto (decimal)
    const valorLimpo = amount.toString().replace(/\./g, '').replace(',', '.');
    const valorNumerico = parseFloat(valorLimpo);

    if (!fromId || !toId || isNaN(valorNumerico) || valorNumerico <= 0) {
      alert('Por favor, informe um valor válido para a operação.');
      return;
    }

    this.loading.set(true);

    // Simulação do Backend
    setTimeout(() => {
      this.beneficios.update(lista => {
        return lista.map(b => {
          // Usando Number(fromId) para garantir comparação correta caso o input venha como string
          if (Number(b.id) === Number(fromId)) return { ...b, valor: b.valor - valorNumerico };
          if (Number(b.id) === Number(toId)) return { ...b, valor: b.valor + valorNumerico };
          return b;
        });
      });

      this.loading.set(false);
      this.resetForm();
      alert('Transferência realizada com sucesso!');
    }, 800);
  }

  voltar() {
    this.router.navigate(['/']);
  }


  private resetForm(): void {
    this.transferData = {
      fromId: null,
      toId: null,
      amount: ''
    };
  }
}