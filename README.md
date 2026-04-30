# Portal Integrado - Gestão de Benefícios 

Sistema de gestão e transferência de benefícios desenvolvido como parte do desafio técnico. O projeto utiliza uma arquitetura robusta baseada em **Micro-módulos Java** e **Angular Signals**.

## Arquitetura e Tecnologias

O projeto segue o padrão de separação de responsabilidades em camadas:
- **Frontend**: Angular 17+ com Signals e Bootstrap Icons.
- **Backend (API)**: Spring Boot 3 / Java 17.
- **Core Business (EJB)**: Jakarta EE Stateless Session Beans.
- **Banco de Dados**: PostgreSQL/H2 com scripts de migração automática.

---

## Correção do Bug Crítico (EJB)

Um dos requisitos principais foi a correção do bug de concorrência no módulo de transferências.
- **Problema**: A transferência original não validava saldo e era suscetível a *Race Conditions* (Gasto Duplo).
- **Solução**: Implementado **Pessimistic Locking (`PESSIMISTIC_WRITE`)** no JPA. Isso garante que, durante a transferência, as linhas das contas envolvidas fiquem travadas para escrita, impedindo inconsistências em ambientes de alta concorrência.

---

## Como Rodar o Projeto

### 1. Banco de Dados
Execute os scripts localizados na pasta `/db` para preparar o ambiente:
- `schema.sql`: Criação das tabelas.
- `seed.sql`: Inserção de dados iniciais (incluindo o benefício **Auxílio Creche**).

### 2. Backend (Java)
Navegue até a raiz do projeto e utilize o Maven:
```bash
mvn clean install
cd backend-module
mvn spring-boot:run

A API estará disponível em: http://localhost:8080
Documentação Swagger: http://localhost:8080/swagger-ui.html


### 3. Frontend (Angular)

cd frontend/desafio-frontend
npm install
ng serve

Acesse o portal em: http://localhost:4200