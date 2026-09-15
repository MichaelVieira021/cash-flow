import { connectDatabase } from './config/database';
import { env } from './config/env';
import { corsMiddleware } from './config/cors';
import { swaggerSpec } from './docs/swagger';
import { errorMiddleware } from './middlewares/error.middleware';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import cors from 'cors';
import './models';
import routes from './routes';

const app = express();

app.use(corsMiddleware);
app.use(cors());
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api', routes);
app.use(errorMiddleware);

async function startServer(): Promise<void> {
  try {
    await connectDatabase();

    app.listen(env.PORT, () => {
      console.log(`🟢 Cash-Flow API rodando em http://localhost:${env.PORT}/api`);
      console.log(`🟢 Documentação em http://localhost:${env.PORT}/api-docs`);
    });
  } catch (error) {
    console.error('🔴 Falha ao iniciar servidor:', error);
    process.exit(1);
  }
}

startServer();
