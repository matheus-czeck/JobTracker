import 'dotenv/config'
import app from "./index.js";
import prisma from "./repositories/database.js";

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await prisma.$connect();
    console.log("Banco de dados conectado!");
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log("Erro ao conectar ao banco de dados!")
    console.log(error);
    process.exit(1)
    
  }
}


startServer();