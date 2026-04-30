# Portal Integrado - Gestão de Benefícios

Sistema de alta disponibilidade para gestão e transferência de benefícios, desenvolvido como parte do desafio técnico para a posição de Desenvolvedor Sênior. Este projeto foca em integridade de dados, arquitetura modular e reatividade no frontend.

## Arquitetura e Tecnologias

O projeto foi estruturado para garantir a separação clara de responsabilidades entre as camadas:

*   **Frontend**: Angular 17+ utilizando **Signals** para gestão de estado reativa e **Bootstrap Icons** para a interface.
*   **Backend (API)**: Spring Boot 3 / Java 17, atuando como camada de orquestração REST.
*   **Core Business (EJB)**: Camada de persistência e regras de negócio utilizando **Jakarta EE Stateless Session Beans**.
*   **Banco de Dados**: PostgreSQL/H2 com scripts de inicialização automatizados.

---

## Resolução do Bug Crítico (EJB)

O foco principal da intervenção técnica foi o módulo de transferências, que apresentava falhas de segurança transacional:

*   **O Problema**: A implementação original permitia **Race Conditions** (Gasto Duplo) e não validava o saldo antes da operação, podendo gerar saldos negativos e inconsistências.
*   **A Solução Sênior**: Implementação de **Pessimistic Locking (`PESSIMISTIC_WRITE`)** via JPA.
    *   Esta abordagem bloqueia os registros das contas de origem e destino no banco de dados durante a transação, impedindo alterações simultâneas por outros processos.
    *   Adicionada validação rigorosa de saldo com lançamento de exceção `IllegalStateException`, garantindo o rollback automático em caso de erro.

---

## Qualidade e Testes

O projeto conta com cobertura de testes automatizados para garantir a estabilidade das entregas:

### Backend (JUnit 5 + Mockito)
Testes unitários no módulo EJB que validam:
*   Fluxo de sucesso de transferência e atualização de saldos.
*   Cenário de erro para saldo insuficiente.
*   Garantia de que o Lock Pessimista está sendo solicitado corretamente ao EntityManager.

### Frontend (Vitest)
Uso do motor **Vitest** para validar a integração do `BeneficioService`:
*   Garantia de que as requisições POST estão sendo enviadas com o payload correto para a API.
*   Mock de HttpClient para isolamento de testes de serviço.

---

## Como Rodar o Projeto

### 1. Preparação do Banco de Dados
Os scripts estão na pasta `/db`. Execute-os na ordem:
1.  `schema.sql`: Criação das tabelas.
2.  `seed.sql`: Inserção de dados iniciais (inclui o benefício **Auxílio Creche**).

### 2. Backend (Java)
```bash
# Na raiz do projeto
mvn clean install
cd backend-module
mvn spring-boot:run

API: http://localhost:8080

Documentação Swagger: http://localhost:8080/swagger-ui.html

### 3. Execução de Testes
Para rodar os testes do Backend:
mvn test

### 4. Frontend (Angular)

cd frontend/desafio-frontend
npm install
npx ng serve

### 5. Para rodar os testes do Frontend:
npx ng test --watch=false

-------------------------------------------------------------

Checklist de Entregas
[x] Correção do Bug de Concorrência (Pessimistic Locking).

[x] Dashboard reativo com Angular Signals e Bootstrap.

[x] Listagem com Paginação Real.

[x] Documentação de API com Swagger.

[x] Testes Unitários e de Integração (Backend e Frontend).

Desenvolvido por: Leonardo Souza - Java Full Stack Developer