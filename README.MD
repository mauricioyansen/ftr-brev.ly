# Brev.ly - Encurtador de Links Full-Stack

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![Fastify](https://img.shields.io/badge/Fastify-000000?style=for-the-badge&logo=fastify&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

Brev.ly é uma aplicação full-stack completa de encurtamento de links, construída com um backend robusto em NestJS com Fastify e um frontend reativo e moderno em React (Vite).

## 📖 Sobre o Projeto

Este projeto foi desenvolvido como uma solução completa para o gerenciamento de URLs, permitindo aos usuários transformar links longos e complexos em URLs curtas, fáceis de partilhar e memorizar. Além da funcionalidade básica de encurtamento, a plataforma oferece recursos avançados como a personalização de links (vanity URLs), o rastreamento do número de acessos e a exportação de relatórios em CSV para uma CDN.

A arquitetura foi pensada para ser escalável, segura e de alta performance, utilizando tecnologias modernas e as melhores práticas de desenvolvimento, incluindo um ambiente de desenvolvimento containerizado com Docker e uma suíte de testes completa (E2E e Unitários).

## ✨ Funcionalidades

### Backend (API - `server/`)
- ✅ **Criação de Links:** Suporte para códigos curtos aleatórios (`nanoid`) ou customizados.
- ✅ **Validação Robusta:** Utilização do Zod para garantir a integridade dos dados de entrada.
- ✅ **Redirecionamento:** Endpoint público de alta performance para redirecionamento.
- ✅ **Contagem de Acessos:** Incremento atómico do contador de acessos a cada redirecionamento.
- ✅ **Gestão de Links:** Endpoints para listar e deletar links.
- ✅ **Exportação para CSV:** Geração de relatórios em CSV e upload automático para uma CDN (Cloudflare R2).
- ✅ **Banco de Dados Moderno:** Integração com PostgreSQL através do Drizzle ORM, com um fluxo de migrações.
- ✅ **Testes Automatizados:** Suíte de testes completa com testes End-to-End (Jest + Supertest) e Unitários (Jest).

### Frontend (Dashboard - `web/`)
- ✅ **Interface Reativa:** Single-Page Application (SPA) construída com React e Vite.
- ✅ **Criação e Gestão:** Formulário interativo para criar e listar links em tempo real.
- ✅ **Experiência do Utilizador (UX):**
    - Atualizações otimistas para uma sensação de resposta instantânea.
    - Estados de carregamento (`loading`), erro e vazio (`empty state`).
    - Feedback ao utilizador através de toasts (`sonner`).
    - Validação de formulários no lado do cliente com React Hook Form e Zod.
- ✅ **Layout Responsivo:** Interface adaptável para desktops e dispositivos móveis.
- ✅ **Página Intermediária de Redirecionamento:** Efeito visual para o fluxo de redirecionamento.
- ✅ **Download de Relatórios:** Botão para solicitar e baixar o relatório em CSV gerado pelo backend.

## 🛠️ Ferramentas e Tecnologias

O projeto foi construído utilizando um stack moderno e robusto:

### Backend (`server/`)
- **Framework:** [NestJS](https://nestjs.com/) com adaptador [Fastify](https://www.fastify.io/)
- **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
- **ORM:** [Drizzle ORM](https://orm.drizzle.team/)
- **Base de Dados:** [PostgreSQL](https://www.postgresql.org/)
- **Validação:** [Zod](https://zod.dev/)
- **Containerização:** [Docker](https://www.docker.com/) e Docker Compose
- **Testes:** [Jest](https://jestjs.io/) e [Supertest](https://github.com/ladjs/supertest)

### Frontend (`web/`)
- **Biblioteca:** [React](https://react.dev/)
- **Bundler:** [Vite](https://vitejs.dev/)
- **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
- **Estilização:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Componentes:** [shadcn/ui](https://ui.shadcn.com/)
- **Gestão de Estado de Servidor:** [TanStack Query (React Query)](https://tanstack.com/query/latest)
- **Gestão de Formulários:** [React Hook Form](https://react-hook-form.com/)
- **Cliente HTTP:** [Axios](https://axios-http.com/)

## 🚀 Como Executar o Projeto

Siga os passos abaixo para configurar e executar a aplicação localmente.

### Pré-requisitos
- [Node.js](https://nodejs.org/) (versão 20.x ou superior)
- [NPM](https://www.npmjs.com/) (geralmente instalado com o Node.js)
- [Docker](https://www.docker.com/products/docker-desktop/) e Docker Compose

### 1. Clonar o Repositório
```bash
git clone https://github.com/mauricioyansen/ftr-brev.ly.git
cd ftr-brev.ly
```

### 2. Configuração do Backend (`server/`)

**a. Aceda a pasta e instale as dependências:**
```bash
cd server
npm install
```

**b. Configure as Variáveis de Ambiente:**
Crie uma cópia do ficheiro `.env.example` e renomeie-a para `.env`. Preencha as variáveis com as suas credenciais.
```bash
cp .env.example .env
```
Crie também uma cópia para o ambiente de testes.
```bash
cp .env.example .env.test
```
*Lembre-se de ajustar a `DATABASE_URL` no `.env.test` para apontar para o banco de dados de teste (porta `5434`).*

**c. Suba os Contentores Docker:**
Este comando irá iniciar os bancos de dados de desenvolvimento e de teste.
```bash
docker-compose up -d
```

**d. Execute as Migrações:**
Este comando irá criar as tabelas no seu banco de dados de desenvolvimento.
```bash
npm run db:migrate
```

**e. Execute a Aplicação Backend:**
```bash
npm run start:dev
```
O servidor backend estará a correr em `http://localhost:3333`.

### 3. Configuração do Frontend (`web/`)

**a. Aceda a pasta (num novo terminal) e instale as dependências:**
```bash
# A partir da raiz do projeto
cd web
npm install
```

**b. Configure as Variáveis de Ambiente:**
Crie uma cópia do ficheiro `.env.example` e renomeie-a para `.env.local`.
```bash
cp .env.example .env.local
```
*Os valores padrão (`http://localhost:5173` e `http://localhost:3333`) devem funcionar para o ambiente de desenvolvimento local.*

**c. Execute a Aplicação Frontend:**
```bash
npm run dev
```
A aplicação frontend estará acessível em `http://localhost:5173`.

### 4. Rodando os Testes (Backend)
Para executar os testes, certifique-se de que os contentores Docker estão a correr.

**a. Testes Unitários:**
```bash
# Dentro da pasta server/
npm test
```

**b. Testes End-to-End:**
Este comando irá preparar automaticamente a base de dados de teste e executar os testes.
```bash
# Dentro da pasta server/
npm run test:e2e
```

## 🔗 Endpoints da API

A API expõe os seguintes endpoints de gestão na rota `/links`:

- `POST /links`: Cria um novo link.
- `GET /links`: Lista os últimos 100 links criados.
- `DELETE /links/:id`: Deleta um link específico.
- `GET /links/code/:code`: Busca os dados de um link pelo seu código (usado pelo frontend para o redirecionamento).
- `POST /links/export`: Inicia a exportação de todos os links para um ficheiro CSV.

A rota pública de redirecionamento é:
- `GET /:code`: Redireciona para a URL original.