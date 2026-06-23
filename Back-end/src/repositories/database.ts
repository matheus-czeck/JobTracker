import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("Faltou configurar a DATABASE_URL no arquivo .env");
}

const pool = new Pool({ connectionString });

const adapter = new PrismaPg(pool);


const prisma = new PrismaClient({ adapter });

export default prisma;