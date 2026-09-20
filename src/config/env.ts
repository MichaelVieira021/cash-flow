import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

export const enum Environment {
  DEVELOPMENT = 'development',
  STAGING = 'staging',
  PRODUCTION = 'production',
}

const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string().url('DATABASE_URL inválida'),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET deve ter ao menos 32 caracteres'),
  JWT_EXPIRES_IN: z.string().default('24h'),
  CORS_ORIGIN: z.string().url('CORS_ORIGIN inválida'),
  NODE_ENV: z
    .enum([Environment.DEVELOPMENT, Environment.STAGING, Environment.PRODUCTION])
    .default(Environment.DEVELOPMENT),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('🔴 Variáveis de ambiente inválidas:');
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;
