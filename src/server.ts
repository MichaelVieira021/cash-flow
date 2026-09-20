import './models';

import express from 'express';
import helmet from 'helmet';

// import swaggerUi from 'swagger-ui-express';
import { corsMiddleware } from './config/cors';
import { connectDatabase } from './config/database';
import { env } from './config/env';
// import { swaggerSpec } from './config/swagger/swagger';
import { errorMiddleware } from './middlewares/errorMiddleware';
import routes from './routes';

const app = express();

app.use(helmet());
app.use(corsMiddleware);
app.use(express.json());
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api', routes);
app.use(errorMiddleware);

async function startServer(): Promise<void> {
  try {
    await connectDatabase();

    app.listen(env.PORT, () => {
      console.log(`CashFlow API rodando em http://localhost:${env.PORT}/api`);
      console.log(`Documentação em http://localhost:${env.PORT}/api-docs`);
    });
  } catch (error) {
    console.error('Erro ao iniciar servidor:', error);
    process.exit(1);
  }
}

startServer();
