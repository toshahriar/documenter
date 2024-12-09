import { z, ZodError } from 'zod';
import { Logger } from '@/core/utils/logger';
import { config } from 'dotenv';

config();

const redisSchema = z.object({
  REDIS_HOST: z.string().default('localhost'),
  REDIS_PORT: z.number().default(6379),
  REDIS_PASSWORD: z.string().optional(),
  REDIS_DB: z.number().default(0),
  REDIS_MAX_RETRIES: z.number().default(3),
  REDIS_CONNECT_TIMEOUT: z.number().default(10000),
  REDIS_KEEP_ALIVE: z.number().default(30000),
  REDIS_LAZY_CONNECT: z.boolean().default(true),
});

export const redisConfig = (() => {
  try {
    return redisSchema.parse({
      REDIS_HOST: process.env.REDIS_HOST,
      REDIS_PORT: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT, 10) : undefined,
      REDIS_PASSWORD: process.env.REDIS_PASSWORD,
      REDIS_DB: process.env.REDIS_DB ? parseInt(process.env.REDIS_DB, 10) : undefined,
      REDIS_MAX_RETRIES: process.env.REDIS_MAX_RETRIES
        ? parseInt(process.env.REDIS_MAX_RETRIES, 10)
        : undefined,
      REDIS_CONNECT_TIMEOUT: process.env.REDIS_CONNECT_TIMEOUT
        ? parseInt(process.env.REDIS_CONNECT_TIMEOUT, 10)
        : undefined,
      REDIS_KEEP_ALIVE: process.env.REDIS_KEEP_ALIVE
        ? parseInt(process.env.REDIS_KEEP_ALIVE, 10)
        : undefined,
      REDIS_LAZY_CONNECT: process.env.REDIS_LAZY_CONNECT
        ? process.env.REDIS_LAZY_CONNECT === 'true'
        : undefined,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      Logger.error(`redisConfig: Invalid environment variables`, null, error.errors);
      process.exit(1);
    } else {
      Logger.error(`redisConfig: Invalid environment variables`, error as Error);
      process.exit(1);
    }
  }
})();
