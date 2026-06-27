<div align="center">

<h1>📋 JobTracker</h1>

<p>Aplicação web full stack para rastrear candidaturas a vagas de emprego — cadastre vagas, atualize status e acompanhe seu histórico em um só lugar.</p>

![Status](https://img.shields.io/badge/status-%20finalizado-grenn?style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Angular](https://img.shields.io/badge/Angular-17+-DD0031?style=flat-square&logo=angular&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-22+-339933?style=flat-square&logo=nodedotjs&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17+-4169E1?style=flat-square&logo=postgresql&logoColor=white)

</div>

---

## 📖 Sobre o projeto

O **JobTracker** nasceu de um problema real: durante a busca pela primeira vaga como desenvolvedor, perder o controle de candidaturas virou rotina — links salvos que nunca eram abertos, status esquecidos, processos que avançavam sem perceber.

Este projeto resolve isso com uma aplicação funcional para cadastrar vagas, atualizar o status de cada processo seletivo e visualizar o histórico completo de cada candidatura.

> Projeto desenvolvido como primeiro projeto prático full stack, com foco em aprender na prática com uma stack moderna.

---

## ✨ Funcionalidades

- [x] Cadastro de vagas com empresa, cargo, link e localização
- [x] Atualização de status por candidatura com registro de anotações
- [x] Histórico completo de mudanças de status por vaga
- [x] Filtro por texto (empresa ou cargo) e por status
- [ ] Dashboard com resumo visual das candidaturas por status *(em desenvolvimento)*

---

## 🛠️ Tecnologias

**Back-end**

- [Node.js](https://nodejs.org/) — runtime JavaScript
- [TypeScript](https://www.typescriptlang.org/) — tipagem estática
- [Prisma ORM](https://www.prisma.io/) — mapeamento objeto-relacional
- [PostgreSQL](https://www.postgresql.org/) — banco de dados relacional

**Front-end**

- [Angular](https://angular.io/) — framework SPA
- [PrimeNG](https://primeng.org/) — componentes de UI
- [PrimeIcons](https://primeng.org/icons) — biblioteca de ícones

**Ferramentas**

- [Git](https://git-scm.com/) — controle de versão
- [GitHub](https://github.com/) — repositório remoto

---

## 🏗️ Arquitetura

```
JobTracker/
├── Back-end/
│   ├── src/
│   │   ├── controllers/     # Controladores das rotas
│   │   ├── repositories/    # Acesso ao banco via Prisma
│   │   ├── routes/          # Definição das rotas da API
│   │   ├── services/        # Regras de negócio
│   │   ├── index.ts         # Configuração do app Express
│   │   └── server.ts        # Inicialização do servidor e conexão ao banco
│   │
│   ├── prisma/
│   │   ├── migrations/      # Controle de versão do banco de dados
│   │   ├── seed/            # Popula o banco com dados fictícios
│   │   └── schema.prisma    # Schema do banco de dados
│   │
│   └── package.json
│
└── Front-end/job-tracker/
    ├── src/
    │   └── app/
    │       ├── components/  # Componentes da aplicação
    │       ├── services/    # Serviços e chamadas à API
    │       └── pipes/       # Pipes customizados
    └── package.json
```

---

## 🚀 Como rodar localmente

### Pré-requisitos

- Node.js 22+
- PostgreSQL 17+
- npm

### Configuração

```bash
# 1. Clone o repositório
git clone https://github.com/matheus-czeck/JobTracker.git
cd JobTracker
```

**Back-end**

```bash
cd Back-end

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o .env com suas credenciais do PostgreSQL:
# DATABASE_URL="postgresql://usuario:senha@localhost:5432/jobtracker"

# Rode as migrations
npx prisma migrate dev

# (Opcional) Popule o banco com dados fictícios
npx prisma db seed

# Inicie o servidor
npm run dev
```

**Front-end**

```bash
cd Front-end/job-tracker

# Instale as dependências
npm install

# Inicie a aplicação
npm start
```

Acesse `http://localhost:4200` no navegador.

---

## 🗄️ Modelo de dados

```prisma
model JobOpportunity {
  id            String     @id @default(uuid())
  title         String
  company       String
  url           String
  location      String?
  salaryExpect  String?
  description   String?
  currentStatus JobStatus  @default(APLICADO)
  createdAt     DateTime   @default(now())
  updatedAt     DateTime   @updatedAt

  history       JobHistory[]
  @@map("job_opportunities")
}

model JobHistory {
  id                String         @id @default(uuid())
  jobOpportunityId  String
  oldStatus         JobStatus?
  newStatus         JobStatus
  notes             String?
  changedAt         DateTime       @default(now())

  jobOpportunity    JobOpportunity @relation(fields: [jobOpportunityId], references: [id], onDelete: Cascade)
  @@map("job_histories")
}

enum JobStatus {
  APLICADO
  TRIAGEM
  ENTREVISTA
  TESTE_TECNICO
  PROPOSTA
  PROPOSTA_ACEITA
  REJEITADO
  DESISTENCIA
}
```

---

## 👨‍💻 Autor

**Matheus Henrique Czeck**
Estudante de Engenharia de Software · Dev Web Full Stack em formação

[![LinkedIn](https://img.shields.io/badge/LinkedIn-matheus--hcz-0A66C2?style=flat-square&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/matheus-hcz/)
[![GitHub](https://img.shields.io/badge/GitHub-matheus--czeck-181717?style=flat-square&logo=github&logoColor=white)](https://github.com/matheus-czeck)
