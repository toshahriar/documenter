import { Redis } from 'ioredis';
import { Logger } from '@/core/utils/logger';
import { InternalServerError } from '@/core/exceptions';

export class RedisProvider {
  private static instance: Redis;

  private constructor() {}

  public static getInstance(): Redis {
    if (!RedisProvider.instance) {
      RedisProvider.instance = new Redis({
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379', 10),
        password: process.env.REDIS_PASSWORD || undefined,
        db: parseInt(process.env.REDIS_DB || '0', 10),
        retryStrategy: (times: number): number => Math.min(times * 50, 2000),
        maxRetriesPerRequest: parseInt(process.env.REDIS_MAX_RETRIES || '3', 10),
        connectTimeout: parseInt(process.env.REDIS_CONNECT_TIMEOUT || '10000', 10),
        keepAlive: parseInt(process.env.REDIS_KEEP_ALIVE || '30000', 10),
        lazyConnect: process.env.REDIS_LAZY_CONNECT === 'true',
      });

      RedisProvider.instance.on('connect', () => Logger.info('Redis client connected'));
      RedisProvider.instance.on('ready', () => Logger.info('Redis client ready'));
      RedisProvider.instance.on('error', (error) =>
        Logger.error(`Redis client error: ${error.message}`, error)
      );
      RedisProvider.instance.on('end', () => Logger.info('Redis client disconnected'));
    }

    return RedisProvider.instance;
  }

  public static async initialize(): Promise<void> {
    try {
      const client = RedisProvider.getInstance();
      const pingResponse = await client.ping();
      if (pingResponse === 'PONG') {
        Logger.info('Redis connected and ready');
      }
    } catch (error: unknown) {
      Logger.error(
        `Failed to initialize Redis connection: ${(error as Error).message}`,
        error as Error
      );

      throw new InternalServerError(
        RedisProvider.name,
        'Redis initialization failed',
        error as Error
      );
    }
  }
}
