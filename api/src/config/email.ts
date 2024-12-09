import { z, ZodError } from 'zod';
import { Logger } from '@/core/utils/logger';
import { config } from 'dotenv';

config();

const emailSchema = z.object({
  EMAIL_HOST: z.string().default('smtp.example.com'),
  EMAIL_PORT: z.number().default(587),
  EMAIL_SECURE: z.boolean().default(false),
  EMAIL_USER: z.string(),
  EMAIL_PASS: z.string(),
  EMAIL_FROM: z.string(),
});

export const emailConfig = (() => {
  try {
    return emailSchema.parse({
      EMAIL_HOST: process.env.EMAIL_HOST,
      EMAIL_PORT: process.env.EMAIL_PORT ? parseInt(process.env.EMAIL_PORT, 10) : undefined,
      EMAIL_SECURE: process.env.EMAIL_SECURE ? process.env.EMAIL_SECURE === 'true' : undefined,
      EMAIL_USER: process.env.EMAIL_USER,
      EMAIL_PASS: process.env.EMAIL_PASS,
      EMAIL_FROM: process.env.EMAIL_FROM,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      Logger.error(`emailConfig: Invalid environment variables`, null, error.errors);
      process.exit(1);
    } else {
      Logger.error(`emailConfig: Invalid environment variables`, error as Error);
      process.exit(1);
    }
  }
})();
