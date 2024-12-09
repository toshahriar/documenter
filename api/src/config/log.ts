import { z, ZodError } from 'zod';
import path from 'path';
import { Logger } from '@/core/utils/logger';
import { config } from 'dotenv';

config();

const logSchema = z.object({
  DIR: z.string().default(() => path.resolve(process.cwd(), 'logs')),
  LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
  MAX_SIZE: z.string().default('20m'),
  MAX_FILES: z.string().default('14d'),
  CONSOLE_ENABLED: z.boolean().default(true),
  FILE_ENABLED: z.boolean().default(true),
  DATE_FORMAT: z.string().default('YYYY-MM-DD'),
  DATETIME_FORMAT: z.string().default('YYYY-MM-DD HH:mm:ss'),
});

export const logConfig = (() => {
  try {
    return logSchema.parse({
      DIR: process.env.LOG_DIR,
      LEVEL: process.env.LOG_LEVEL,
      MAX_SIZE: process.env.LOG_MAX_SIZE,
      MAX_FILES: process.env.LOG_MAX_FILES,
      CONSOLE_ENABLED: process.env.LOG_CONSOLE_ENABLED !== 'false',
      FILE_ENABLED: process.env.LOG_FILE_ENABLED !== 'false',
      DATE_FORMAT: process.env.LOG_DATE_FORMAT,
      DATETIME_FORMAT: process.env.LOG_DATETIME_FORMAT,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      Logger.error(`logConfig: Invalid environment variables`, null, error.errors);
      process.exit(1);
    } else {
      Logger.error(`logConfig: Invalid environment variables`, error as Error);
      process.exit(1);
    }
  }
})();
