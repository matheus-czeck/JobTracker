-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('APLICADO', 'TRIAGEM', 'ENTREVISTA', 'TESTE_TECNICO', 'PROPOSTA', 'PROPOSTA_ACEITA', 'REJEITADO', 'DESISTENCIA');

-- CreateTable
CREATE TABLE "job_opportunities" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "location" TEXT,
    "salaryExpect" TEXT,
    "description" TEXT,
    "currentStatus" "JobStatus" NOT NULL DEFAULT 'APLICADO',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "job_opportunities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job_histories" (
    "id" TEXT NOT NULL,
    "jobOpportunityId" TEXT NOT NULL,
    "oldStatus" "JobStatus",
    "newStatus" "JobStatus" NOT NULL,
    "notes" TEXT,
    "changedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "job_histories_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "job_histories" ADD CONSTRAINT "job_histories_jobOpportunityId_fkey" FOREIGN KEY ("jobOpportunityId") REFERENCES "job_opportunities"("id") ON DELETE CASCADE ON UPDATE CASCADE;
