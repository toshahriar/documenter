import * as amqp from 'amqp-connection-manager';
import { ConfirmChannel } from 'amqplib';
import { Logger } from '@/core/utils/logger';
import { rabbitMQConfig } from '@/config/rabbitmq';

export class RabbitMQProvider {
  private static instance: amqp.AmqpConnectionManager | null = null;
  private static queues: string[] = [];
  private static isInitialized = false;
  private static channels: Map<string, amqp.ChannelWrapper> = new Map();

  private constructor() {}

  public static async initialize(queueNames: string[]): Promise<void> {
    if (this.isInitialized) return;

    try {
      this.queues = queueNames;
      this.instance = this.createConnection();
      await this.setupQueues();
      this.isInitialized = true;
      Logger.info(`RabbitMQ initialized with queues: ${queueNames.join(', ')}`);
    } catch (error) {
      this.logError('Failed to initialize RabbitMQ', error);
      throw error;
    }
  }

  private static createConnection(): amqp.AmqpConnectionManager {
    const uri = `amqp://${rabbitMQConfig.RABBITMQ_USER}:${rabbitMQConfig.RABBITMQ_PASSWORD}@${rabbitMQConfig.RABBITMQ_HOST}:${rabbitMQConfig.RABBITMQ_PORT}/`;
    const connection = amqp.connect([uri]);

    connection.on('connect', () => Logger.info('RabbitMQ client successfully connected'));
    connection.on('disconnect', (error) =>
      this.logError('RabbitMQ client disconnected', error?.err)
    );
    connection.on('blocked', (reason) => Logger.warn(`RabbitMQ connection blocked: ${reason}`));
    connection.on('unblocked', () => Logger.info('RabbitMQ connection unblocked'));
    connection.on('close', () => Logger.warn('RabbitMQ connection closed'));

    return connection;
  }

  private static async setupQueues(): Promise<void> {
    const channel = await this.createChannel();
    await channel.addSetup(async (channel: ConfirmChannel) => {
      for (const queueName of this.queues) {
        try {
          await channel.assertExchange(`${queueName}-exchange`, 'direct', { durable: true });
          await channel.assertQueue(queueName, { durable: true });
          await channel.bindQueue(queueName, `${queueName}-exchange`, queueName);
          Logger.info(`Queue "${queueName}" set up successfully.`);
        } catch (error) {
          this.logError(`Error setting up queue "${queueName}"`, error);
          throw error;
        }
      }
    });
    this.channels.set('default', channel);
  }

  public static async produce(queueName: string, message: unknown): Promise<void> {
    try {
      const channel = await this.getChannel(queueName);
      await channel.publish(`${queueName}-exchange`, queueName, message, {
        contentType: 'application/json',
        persistent: true,
      });
      Logger.info(`Message sent to queue "${queueName}": ${JSON.stringify(message)}`);
    } catch (error) {
      this.logError(`Failed to send message to queue "${queueName}"`, error);
      throw error;
    }
  }

  public static async consume(queueName: string, callback: (msg: string) => void): Promise<void> {
    try {
      const channel = await this.getChannel(queueName);
      await channel.addSetup((channel: ConfirmChannel) =>
        channel.consume(queueName, (msg) => {
          if (!msg) return;

          try {
            callback(JSON.parse(msg.content.toString()));
            channel.ack(msg);
          } catch (error) {
            this.logError(`Error processing message from queue "${queueName}"`, error);
            channel.nack(msg);
          }
        })
      );
    } catch (error) {
      this.logError(`Failed to set up consumer for queue "${queueName}"`, error);
      throw error;
    }
  }

  public static async close(): Promise<void> {
    try {
      for (const channel of this.channels.values()) {
        await channel.close();
      }
      if (this.instance) {
        await this.instance.close();
        Logger.info('RabbitMQ connection closed');
      }
    } catch (error) {
      this.logError('Error during RabbitMQ shutdown', error);
    } finally {
      this.instance = null;
      this.isInitialized = false;
    }
  }

  private static async getChannel(queueName: string): Promise<amqp.ChannelWrapper> {
    if (!this.queues.includes(queueName)) {
      const warningMessage = `Queue "${queueName}" is not registered.`;
      Logger.warn(warningMessage);
      throw new Error(warningMessage);
    }

    if (!this.channels.has(queueName)) {
      const channel = await this.createChannel();
      await channel.addSetup(async (ch: ConfirmChannel) => {
        try {
          await ch.assertQueue(queueName, { durable: true });
          Logger.info(`Queue "${queueName}" dynamically created.`);
        } catch (error) {
          this.logError(`Error creating dynamic queue "${queueName}"`, error);
          throw error;
        }
      });
      this.channels.set(queueName, channel);
    }

    return this.channels.get(queueName)!;
  }

  private static async createChannel(): Promise<amqp.ChannelWrapper> {
    if (!this.instance) {
      const errorMessage = 'RabbitMQ connection is not initialized. Call initialize() first.';
      Logger.error(errorMessage);
      throw new Error(errorMessage);
    }
    return this.instance.createChannel({ json: true });
  }

  private static logError(message: string, error: unknown): void {
    const errorMessage = error instanceof Error ? error.message : String(error);
    Logger.error(`${message}: ${errorMessage}`, error as Error);
  }
}
