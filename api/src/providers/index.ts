import { DatabaseProvider } from '@/providers/database.provider';
import { RedisProvider } from '@/providers/redis.provider';
import { Logger } from '@/core/utils/logger';

export const loadProviders = async (): Promise<void> => {
  try {
    for (const Provider of [DatabaseProvider, RedisProvider]) {
      await Provider.initialize();
    }

    Logger.info('All providers initialized successfully');
  } catch (error) {
    Logger.error('Provider initialization failed', error as Error);
    process.exit(1);
  }
};
