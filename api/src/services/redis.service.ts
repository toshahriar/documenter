import { Redis } from 'ioredis';
import { Logger } from '@/core/utils/logger';
import { InternalServerError } from '@/core/exceptions';
import { RedisProvider } from '@/providers/redis.provider';

export class RedisService {
  constructor(private client: Redis = RedisProvider.getInstance()) {}

  public async get(key: string): Promise<string | null> {
    try {
      const value = await this.client.get(key);
      if (value) {
        Logger.info(`Cache hit for key: ${key}`);
        return value;
      } else {
        Logger.info(`Cache miss for key: ${key}`);
        return null;
      }
    } catch (error: unknown) {
      Logger.error(
        `Failed to get value for key ${key}: ${(error as Error).message}`,
        error as Error
      );
      throw new InternalServerError(
        RedisService.name,
        'Failed to get value from Redis',
        error as Error
      );
    }
  }

  public async set(key: string, value: string, ttl?: number): Promise<void> {
    try {
      if (ttl) {
        await this.client.setex(key, ttl, value);
      } else {
        await this.client.set(key, value);
      }
      Logger.info(`Cache set for key: ${key}`);
    } catch (error: unknown) {
      Logger.error(
        `Failed to set value for key ${key}: ${(error as Error).message}`,
        error as Error
      );
      throw new InternalServerError(
        RedisService.name,
        'Failed to set value in Redis',
        error as Error
      );
    }
  }

  public async delete(key: string): Promise<void> {
    try {
      const result = await this.client.del(key);
      if (result === 1) {
        Logger.info(`Cache key ${key} deleted`);
      } else {
        Logger.info(`Cache key ${key} not found for deletion`);
      }
    } catch (error: unknown) {
      Logger.error(`Failed to delete key ${key}: ${(error as Error).message}`, error as Error);
      throw new InternalServerError(
        RedisService.name,
        'Failed to delete value from Redis',
        error as Error
      );
    }
  }
}
