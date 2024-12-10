import { z, ZodError } from 'zod';
import { Logger } from '@/core/utils/logger';
import { config } from 'dotenv';

config();

const rabbitMQSchema = z.object({
  RABBITMQ_HOST: z.string().default('rabbitmq'),
  RABBITMQ_PORT: z.number().default(5672),
  RABBITMQ_USER: z.string().default('documenter'),
  RABBITMQ_PASSWORD: z.string().default('p@ssword'),
});

export const rabbitMQConfig = (() => {
  try {
    return rabbitMQSchema.parse({
      RABBITMQ_HOST: process.env.RABBITMQ_HOST,
      RABBITMQ_PORT: process.env.RABBITMQ_PORT
        ? parseInt(process.env.RABBITMQ_PORT, 10)
        : undefined,
      RABBITMQ_USER: process.env.RABBITMQ_USER,
      RABBITMQ_PASSWORD: process.env.RABBITMQ_PASSWORD,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      Logger.error(`rabbitMQConfig: Invalid environment variables`, null, error.errors);
      process.exit(1);
    } else {
      Logger.error(`rabbitMQConfig: Invalid environment variables`, error as Error);
      process.exit(1);
    }
  }
})();
