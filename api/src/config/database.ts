import { z, ZodError } from 'zod';
import { Logger } from '@/core/utils/logger';
import { config } from 'dotenv';

config();

const databaseSchema = z.object({
  DB_HOST: z.string().default('localhost'),
  DB_PORT: z.number().default(5432),
  DB_USER: z.string().default('yourUsername'),
  DB_PASSWORD: z.string().default('yourPassword'),
  DB_NAME: z.string().default('yourDatabase'),
  DB_SYNCHRONIZE: z.boolean().default(true),
  DB_LOGGING: z.boolean().default(false),
  DB_CONNECTION_LIMIT: z.number().default(10),
  DB_IDLE_TIMEOUT: z.number().default(30000),
  DB_MAX_QUERY_EXEC_TIME: z.number().default(5000),
});

export const databaseConfig = (() => {
  try {
    return databaseSchema.parse({
      DB_HOST: process.env.DB_HOST,
      DB_PORT: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : undefined,
      DB_USER: process.env.DB_USER,
      DB_PASSWORD: process.env.DB_PASSWORD,
      DB_NAME: process.env.DB_NAME,
      DB_SYNCHRONIZE: process.env.DB_SYNCHRONIZE
        ? process.env.DB_SYNCHRONIZE === 'true'
        : undefined,
      DB_LOGGING: process.env.DB_LOGGING ? process.env.DB_LOGGING === 'true' : undefined,
      DB_CONNECTION_LIMIT: process.env.DB_CONNECTION_LIMIT
        ? parseInt(process.env.DB_CONNECTION_LIMIT, 10)
        : undefined,
      DB_IDLE_TIMEOUT: process.env.DB_IDLE_TIMEOUT
        ? parseInt(process.env.DB_IDLE_TIMEOUT, 10)
        : undefined,
      DB_MAX_QUERY_EXEC_TIME: process.env.DB_MAX_QUERY_EXEC_TIME
        ? parseInt(process.env.DB_MAX_QUERY_EXEC_TIME, 10)
        : undefined,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      Logger.error(`databaseConfig: Invalid environment variables`, null, error.errors);
      process.exit(1);
    } else {
      Logger.error(`databaseConfig: Invalid environment variables`, error as Error);
      process.exit(1);
    }
  }
})();
