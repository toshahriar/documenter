import { appConfig } from '@/config/app';
import { databaseConfig } from '@/config/database';
import { redisConfig } from '@/config/redis';
import { logConfig } from '@/config/log';
import { emailConfig } from '@/config/email';
import { Logger } from '@/core/utils/logger';
import { docusignConfig } from '@/config/docusign';

export const loadConfigs = async (): Promise<void> => {
  try {
    [appConfig, databaseConfig, redisConfig, logConfig, emailConfig, docusignConfig].forEach(
      (config) => config
    );
    Logger.info('All configurations validated successfully');
  } catch (error) {
    Logger.error('Configuration validation failed', error as Error);
    process.exit(1);
  }
};
