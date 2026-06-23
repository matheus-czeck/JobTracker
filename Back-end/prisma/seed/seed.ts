import { PrismaClient, JobStatus} from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

// 1. Recria a conexão com o banco usando o adaptador
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

// 2. Injeta o adaptador no PrismaClient
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Iniciando seed...');

  // Limpa o banco antes de popular (cuidado em produção!)
  await prisma.jobHistory.deleteMany();
  await prisma.jobOpportunity.deleteMany();

  const jobs = [
    {
      title: 'Desenvolvedor Frontend Angular',
      company: 'Tech Corp',
      url: 'https://techcorp.com/vagas/1',
      location: 'Remoto',
      salaryExpect: 'R$ 9.000',
      currentStatus: JobStatus.APLICADO,
    },
    {
      title: 'Engenheiro de Software Fullstack',
      company: 'DataFlow',
      url: 'https://dataflow.io/jobs/2',
      location: 'Híbrido',
      salaryExpect: 'R$ 12.000',
      currentStatus: JobStatus.ENTREVISTA,
    },
    {
      title: 'Tech Lead',
      company: 'Startup X',
      url: 'https://startupx.com/vagas/3',
      location: 'Presencial',
      salaryExpect: 'R$ 15.000',
      currentStatus: JobStatus.PROPOSTA,
    }
  ];

  for (const job of jobs) {
    const createdJob = await prisma.jobOpportunity.create({
      data: job,
    });

    // Cria o histórico inicial para cada vaga
    await prisma.jobHistory.create({
      data: {
        jobOpportunityId: createdJob.id,
        newStatus: job.currentStatus,
        notes: 'Seed: Cadastro inicial de teste',
      },
    });
  }

  console.log('Seed concluído com sucesso!');

}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });