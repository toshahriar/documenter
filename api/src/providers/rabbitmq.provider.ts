import * as amqp from 'amqp-connection-manager';
import { ConfirmChannel } from 'amqplib';
import { Logger } from '@/core/utils/logger';
import { InternalServerError } from '@/core/exceptions';
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
      await this.setupExchangeAndQueues();

      this.isInitialized = true;
      Logger.info(`RabbitMQ initialized with queues: ${queueNames.join(', ')}`);
    } catch (error) {
      Logger.error('Failed to initialize RabbitMQ', error as Error);
      throw new InternalServerError(
        'RabbitMQProvider',
        'RabbitMQ initialization failed',
        error as Error
      );
    }
  }

  private static createConnection(): amqp.AmqpConnectionManager {
    const uri = `amqp://${rabbitMQConfig.RABBITMQ_USER}:${rabbitMQConfig.RABBITMQ_PASSWORD}@${rabbitMQConfig.RABBITMQ_HOST}:${rabbitMQConfig.RABBITMQ_PORT}/`;
    const connection = amqp.connect([uri]);

    connection.on('connect', () => Logger.info('RabbitMQ client connected'));
    connection.on('disconnect', (err) => Logger.error('RabbitMQ client disconnected', err?.err));

    return connection;
  }

  private static async setupExchangeAndQueues(): Promise<void> {
    const channel = await this.createChannel();

    await channel.addSetup(async (channel: ConfirmChannel) => {
      for (const queueName of this.queues) {
        await channel.assertExchange(`${queueName}-exchange`, 'direct', { durable: true });
        await channel.assertQueue(queueName, { durable: true });
        await channel.bindQueue(queueName, `${queueName}-exchange`, queueName);
        Logger.info(`Queue "${queueName}" bound to exchange "${queueName}-exchange"`);
      }
    });

    this.channels.set('default', channel);
  }

  public static async produce(queueName: string, message: unknown): Promise<void> {
    const channel = await this.getChannel(queueName);

    await channel.publish(
      `${queueName}-exchange`,
      queueName,
      message,
      { contentType: 'application/json', persistent: true },
      (err) => {
        if (err) {
          Logger.error(`Failed to send message to queue "${queueName}"`, err);
          throw new Error(`Failed to publish message to queue "${queueName}": ${err.message}`);
        }
        Logger.info(`Message sent to queue "${queueName}": ${message}`);
      }
    );
  }

  public static async consume(queueName: string, callback: (msg: string) => void): Promise<void> {
    const channel = await this.getChannel(queueName);

    await channel.addSetup((channel: ConfirmChannel) =>
      channel.consume(queueName, (msg) => {
        if (msg) {
          try {
            callback(JSON.parse(msg.content.toString()));
            channel.ack(msg);
          } catch (err) {
            Logger.error(`Error processing message from queue "${queueName}"`, err as Error);
            channel.nack(msg);
          }
        }
      })
    );
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
    } catch (err) {
      Logger.error('Error during RabbitMQ shutdown', err as Error);
    } finally {
      this.instance = null;
    }
  }

  private static async getChannel(queueName: string): Promise<amqp.ChannelWrapper> {
    if (!this.queues.includes(queueName)) {
      Logger.warn(`Queue "${queueName}" is not registered in the configuration.`);
      throw new Error(`Queue "${queueName}" is not initialized.`);
    }

    if (!this.channels.has(queueName)) {
      const channel = await this.createChannel();

      await channel.addSetup(async (ch: ConfirmChannel) => {
        await ch.assertQueue(queueName, { durable: true }); // Ensure the queue exists
        Logger.info(`Queue "${queueName}" dynamically created.`);
      });

      this.channels.set(queueName, channel);
    }

    return this.channels.get(queueName)!;
  }

  private static async createChannel(): Promise<amqp.ChannelWrapper> {
    if (!this.instance) {
      throw new Error('RabbitMQ connection is not initialized. Call initialize() first.');
    }

    return this.instance.createChannel({
      json: true,
    });
  }
}
