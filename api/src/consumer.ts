import 'reflect-metadata';
import { loadConfigs } from '@/config';
import { Logger } from '@/core/utils/logger';
import { config } from 'dotenv';
import { RabbitMQProvider } from '@/providers/rabbitmq.provider';
import { EmailService } from '@/services/email.service';
import { EmailOptions } from '@/core/interfaces/email-options.interface';

config();

const consumer = async (): Promise<void> => {
  try {
    await loadConfigs();
    Logger.info('Application configurations loaded successfully.');

    const emailService = new EmailService();

    await RabbitMQProvider.initialize(['email']);
    Logger.info('RabbitMQ provider initialized with queue: email');

    await RabbitMQProvider.consume('email', async (message: unknown) => {
      try {
        await emailService.sendEmail(message as EmailOptions);
      } catch (error) {
        Logger.error('Failed to process message:', error as Error);
      }
    });
    Logger.info('Consumer started for queue: email');
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

consumer();
