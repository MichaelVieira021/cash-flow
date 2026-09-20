import pg from 'pg';
import { Sequelize } from 'sequelize';

import { env } from './env';

export const sequelize = new Sequelize(env.DATABASE_URL, {
  dialect: 'postgres',
  dialectModule: pg,
  logging: false,
  timezone: 'UTC',
  define: {
    underscored: true,
    timestamps: true,
  },
});

export async function connectDatabase(): Promise<void> {
  await sequelize.authenticate();
  console.log('Conexão com PostgreSQL estabelecida');
}
