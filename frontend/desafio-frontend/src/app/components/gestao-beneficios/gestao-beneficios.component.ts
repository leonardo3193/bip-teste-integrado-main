import { Component, signal, OnInit, inject, computed } from '@angular/core';
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

  // Armazena o benefício que está sendo editado (null se for criação)
  beneficioEmEdicao = signal<Beneficio | null>(null);

  // Objeto vinculado ao formulário de Cadastro/Edição no HTML
  beneficioForm = {
    nome: '',
    valor: ''
  };

  // Objeto vinculado ao formulário de Transferência
  transferData = {
    fromId: null as number | null,
    toId: null as number | null,
    amount: ''
  };

  paginaAtual = signal<number>(1);
  itensPorPagina = 4;

  beneficios = signal<Beneficio[]>([]);

  beneficiosPaginados = computed(() => {
    const inicio = (this.paginaAtual() - 1) * this.itensPorPagina;
    const fim = inicio + this.itensPorPagina;
    return this.beneficios().slice(inicio, fim);
  });

  totalPaginas = computed(() => Math.ceil(this.beneficios().length / this.itensPorPagina));

  proximaPagina() {
    if (this.paginaAtual() < this.totalPaginas()) {
      this.paginaAtual.update(p => p + 1);
    }
  }

  paginaAnterior() {
    if (this.paginaAtual() > 1) {
      this.paginaAtual.update(p => p - 1);
    }
  }

  ngOnInit(): void {
    this.carregarBeneficios();
  }

  carregarBeneficios(): void {
    this.loading.set(true);
    this.beneficioService.listAll().subscribe({
      next: (dados) => {
        this.beneficios.set(dados);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Erro ao carregar grid:', err);
        this.loading.set(false);
      }
    });
  }

  salvarBeneficio(): void {
    const itemEmEdicao = this.beneficioEmEdicao();
    if (!itemEmEdicao) return;

    // Garante a conversão para número puro
    const valorFormatado = String(this.beneficioForm.valor).replace(/\./g, '').replace(',', '.');

    const payload = {
      id: itemEmEdicao.id, // Alguns backends exigem o ID no corpo também
      nome: this.beneficioForm.nome,
      valor: parseFloat(valorFormatado)
    };

    this.beneficioService.editar(itemEmEdicao.id, payload).subscribe({
      next: () => {
        alert('Atualizado com sucesso!');
        this.cancelarEdicao();
        this.carregarBeneficios();
      },
      error: (err) => {
        console.error('Erro detalhado:', err.error); // Verifique o que o Java respondeu aqui
        alert('Erro ao salvar. Verifique se o valor é válido.');
      }
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
        this.resetTransferForm();
        alert('Transferência concluída!');
        this.carregarBeneficios();
      },
      error: () => this.loading.set(false)
    });
  }

  editar(item: Beneficio) {
    this.beneficioEmEdicao.set(item);
    this.beneficioForm.nome = item.nome;
    this.beneficioForm.valor = item.valor.toString();

    // Rolar para o topo onde geralmente fica o formulário de cadastro/edição
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelarEdicao() {
    this.beneficioEmEdicao.set(null);
    this.beneficioForm = { nome: '', valor: '' };
  }

  deletar(id: number) {
    if (confirm('Deseja realmente excluir este benefício? Esta ação não pode ser desfeita.')) {
      this.beneficioService.deletar(id).subscribe({
        next: () => {
          this.carregarBeneficios();
          console.log(`Benefício #${id} excluído com sucesso.`);
        },
        error: (err) => {
          console.error('Erro ao excluir:', err);
          alert('Erro ao excluir benefício. Verifique se ele não possui vínculos ativos.');
        }
      });
    }
  }

  private resetTransferForm(): void {
    this.transferData = { fromId: null, toId: null, amount: '' };
  }

  voltar() {
    this.router.navigate(['/']);
  }
}