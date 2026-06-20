
<div align="center">

<h1>📋 JobTracker</h1>

---

## 📖 Sobre o projeto

O JobTracker nasceu de um problema real: durante a busca pela primeira vaga como desenvolvedor, perder o controle de candidaturas virou rotina. links salvos que nunca eram abertos, status esquecidos, processos que avançavam sem perceber.

Este projeto resolve isso com uma aplicação simples e funcional para cadastrar vagas, atualizar o status de cada processo seletivo e visualizar um painel com o resumo das candidaturas.

> Projeto desenvolvido como primeiro projeto prático full stack, com foco em aprender na prática com uma stack moderna.

---

## ✨ Funcionalidades

- Cadastro de vagas com empresa, cargo e link da vaga
- Atualização de status por candidatura (Aplicado · Entrevista · Oferta · Recusado)
- Dashboard com resumo visual das candidaturas por status

---

## 🛠️ Tecnologias

**Back-end**
- [Node.js]
- [TypeScript]
- [Prisma ORM]
- [PostgreSQL]

**Front-end**
- [Angular]
- [PrimeIcons]

**Ferramentas**
- [Git](https://git-scm.com/)
- [GitHub](https://github.com/)

---

## 🏗️ Arquitetura

```
jobtracker/
├── Back-end/
│   ├── src/
│   │   ├── controllers/     # Controladores das rotas
│   │   ├── services/        # Regras de negócio
│   │   ├── repositories/    # Acesso ao banco via Prisma
│   │   └── routes/          # Definição das rotas da API
│   ├── prisma/
│   │   └── schema.prisma    # Schema do banco de dados
│   └── package.json
│
└── Front-end/
    ├── src/
    │   ├── app/
    │   │   ├── pages/       # Páginas da aplicação
    │   │   ├── components/  # Componentes reutilizáveis
    │   │   └── services/    # Serviços e chamadas à API
    └── package.json
```

---

## 🚀 Como rodar localmente

### Pré-requisitos

- Node.js 20+
- PostgreSQL 16+
- npm ou yarn

### Configuração

```bash
# 1. Clone o repositório
git clone https://github.com/matheus-czeck/jobtracker.git
cd jobtracker
```

**Back-end**

```bash
cd backend

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env

# Edite o .env com suas credenciais do PostgreSQL
# - *Em desenvolvimento*

# Rode as migrations
npx prisma migrate dev

# Inicie o servidor
npm run dev
```

**Front-end**

```bash
cd frontend

# Instale as dependências
npm install

# Inicie a aplicação
npm start
```

Acesse `http://localhost:4200` no navegador.

---


## 👨‍💻 Autor

**Matheus Henrique Czeck**
Estudante de Engenharia de Software · Dev Web Full Stack em formação

[![LinkedIn]: www.linkedin.com/in/matheus-hcz/
[![GitHub]: https://github.com/matheus-czeck

