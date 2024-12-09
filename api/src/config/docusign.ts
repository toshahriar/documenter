import { z, ZodError } from 'zod';
import { Logger } from '@/core/utils/logger';
import { config } from 'dotenv';

config();

const docusignSchema = z.object({
  DS_PAYMENT_GATEWAY_ID: z.string().optional(),
  DS_APP_ID: z.string(),
  DS_CLIENT_ID: z.string(),
  DS_CLIENT_SECRET: z.string(),
  DS_SIGNER_EMAIL: z.string().email(),
  DS_SIGNER_NAME: z.string(),
  DS_APP_URL: z.string().url(),
  DS_JWT_CLIENT_ID: z.string(),
  DS_PRIVATE_KEY: z.string(),
  DS_IMPERSONATED_USER_GUID: z.string(),
  DS_BASE_PATH: z.string(),
  DS_OAUTH_BASE_PATH: z.string(),
});

export const docusignConfig = (() => {
  try {
    return docusignSchema.parse({
      DS_PAYMENT_GATEWAY_ID: process.env.DS_PAYMENT_GATEWAY_ID,
      DS_APP_ID: process.env.DS_APP_ID,
      DS_CLIENT_ID: process.env.DS_CLIENT_ID,
      DS_CLIENT_SECRET: process.env.DS_CLIENT_SECRET,
      DS_SIGNER_EMAIL: process.env.DS_SIGNER_EMAIL,
      DS_SIGNER_NAME: process.env.DS_SIGNER_NAME,
      DS_APP_URL: process.env.DS_APP_URL,
      DS_JWT_CLIENT_ID: process.env.DS_JWT_CLIENT_ID,
      DS_PRIVATE_KEY: process.env.DS_PRIVATE_KEY,
      DS_IMPERSONATED_USER_GUID: process.env.DS_IMPERSONATED_USER_GUID,
      DS_BASE_PATH: process.env.DS_BASE_PATH,
      DS_OAUTH_BASE_PATH: process.env.DS_OAUTH_BASE_PATH,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      Logger.error(`docusignConfig: Invalid environment variables`, null, error.errors);
      process.exit(1);
    } else {
      Logger.error(`docusignConfig: Error loading environment variables`, error as Error);
      process.exit(1);
    }
  }
})();
