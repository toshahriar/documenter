import { z, ZodError } from 'zod';
import { Logger } from '@/core/utils/logger';
import { config } from 'dotenv';

config();

const appSchema = z.object({
  NAME: z.string().default('documenter-api'),
  PORT: z.number().default(3000),
  ENV: z.enum(['development', 'test', 'production']).default('development'),
  DEBUG: z.boolean().default(true),
  WEB_URL: z.string().default('http://localhost:3000'),
  API_URL: z.string().default('http://localhost:3000/api'),
  JWT_SECRET: z.string().default('jwt-secret-key'),
  ACCESS_TOKEN_EXPIRY: z.number().default(24 * 60 * 60 * 1000),
  REFRESH_TOKEN_EXPIRY: z.number().default(7 * 24 * 60 * 60 * 1000),
  EMAIL_VERIFICATION_TOKEN_EXPIRY: z.number().default(24 * 60 * 60 * 1000),
  PASSWORD_RESET_TOKEN_EXPIRY: z.number().default(24 * 60 * 60 * 1000),
});

export const appConfig = (() => {
  try {
    return appSchema.parse({
      NAME: process.env.APP_NAME,
      PROTOCOL: process.env.APP_PROTOCOL,
      PORT: process.env.APP_PORT ? parseInt(process.env.APP_PORT, 10) : undefined,
      ENV: process.env.APP_ENV || process.env.NODE_ENV,
      DEBUG: process.env.APP_DEBUG ? process.env.APP_DEBUG === 'true' : undefined,
      WEB_URL: process.env.WEB_URL,
      API_URL: process.env.API_URL,
      JWT_SECRET: process.env.JWT_SECRET,
      ACCESS_TOKEN_EXPIRY: process.env.ACCESS_TOKEN_EXPIRY
        ? parseInt(process.env.ACCESS_TOKEN_EXPIRY, 10)
        : undefined,
      REFRESH_TOKEN_EXPIRY: process.env.REFRESH_TOKEN_EXPIRY
        ? parseInt(process.env.REFRESH_TOKEN_EXPIRY, 10)
        : undefined,
      EMAIL_VERIFICATION_TOKEN_EXPIRY: process.env.EMAIL_VERIFICATION_TOKEN_EXPIRY
        ? parseInt(process.env.EMAIL_VERIFICATION_TOKEN_EXPIRY, 10)
        : undefined,
      PASSWORD_RESET_TOKEN_EXPIRY: process.env.PASSWORD_RESET_TOKEN_EXPIRY
        ? parseInt(process.env.PASSWORD_RESET_TOKEN_EXPIRY, 10)
        : undefined,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      Logger.error(`appConfig: Invalid environment variables`, null, error.errors);
      process.exit(1);
    } else {
      Logger.error(`appConfig: Invalid environment variables`, error as Error);
      process.exit(1);
    }
  }
})();
