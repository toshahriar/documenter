import 'reflect-metadata';
import app from './app';
import { loadConfigs } from '@/config';
import { loadProviders } from '@/providers';
import { appConfig } from '@/config/app';
import { Logger } from '@/core/utils/logger';
import { config } from 'dotenv';

config();

const start = async (): Promise<void> => {
  try {
    await loadConfigs();
    await loadProviders();
    app.listen(appConfig.PORT, () => {
      Logger.info(`Server is running on port: ${appConfig.PORT}`);
    });
  } catch (error: unknown) {
    Logger.error(
      `Server failed to start due to error: ${(error as Error).message}`,
      error as Error
    );
  }
};

process.on('uncaughtException', (error: Error) => {
  Logger.error(`Uncaught Exception: ${error.message}`, error);
  process.exit(1);
});

process.on('unhandledRejection', (reason: unknown, promise: Promise<unknown>) => {
  if (reason instanceof Error) {
    Logger.error(
      `Unhandled Rejection at: ${promise}, reason: ${reason.message}, stack: ${reason.stack}`
    );
  } else {
    Logger.error(`Unhandled Rejection at: ${promise}, reason: ${String(reason)}`);
  }
  process.exit(1);
});

start();
