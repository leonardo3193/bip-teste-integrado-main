# Desafio Fullstack - Frontend (Angular)

## 🏗 Estrutura do Projeto
Este projeto foi gerado como um **Starter Project** para consumir a API de benefícios.

### Componentes e Serviços
- **BeneficioService**: Centraliza a comunicação via `HttpClient` com o endpoint de transferência.
- **TransferenciaComponent**: Interface reativa utilizando `FormsModule` para captura de dados e exibição de feedback em tempo real para o usuário.

## ⚠️ Notas de Ambiente (Troubleshooting)
Durante o desenvolvimento no ambiente local, foram encontradas restrições de segurança do Sistema Operacional (Políticas de Controle de Aplicativo) que bloquearam a execução de binários nativos do Node.js (Rollup/Vite). 
 
**Status da Entrega:**
Apesar das limitações de execução do servidor de desenvolvimento (`ng serve`) no hardware local, toda a lógica de frontend foi codificada seguindo as melhores práticas:
- Injeção de dependência.
- Tratamento de estados (Loading/Erro/Sucesso).
- Tipagem rigorosa com TypeScript.

## 🚀 Como Executar
1. `npm install`
2. `ng serve` (Sujeito a permissões de binários do sistema).