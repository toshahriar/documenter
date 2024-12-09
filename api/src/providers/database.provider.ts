import { DataSource } from 'typeorm';
import { entities } from '@/entities';
import { databaseConfig } from '@/config/database';
import { Logger } from '@/core/utils/logger';
import { InternalServerError } from '@/core/exceptions';

export class DatabaseProvider {
  private static instance: DataSource;

  private constructor() {}

  public static getInstance(): DataSource {
    if (!DatabaseProvider.instance) {
      DatabaseProvider.instance = new DataSource({
        type: 'postgres',
        host: databaseConfig.DB_HOST,
        port: databaseConfig.DB_PORT,
        username: databaseConfig.DB_USER,
        password: databaseConfig.DB_PASSWORD,
        database: databaseConfig.DB_NAME,
        synchronize: false,
        logging: databaseConfig.DB_LOGGING,
        entities,
        migrations: [],
        subscribers: [],
        extra: {
          connectionLimit: databaseConfig.DB_CONNECTION_LIMIT,
          idleTimeoutMillis: databaseConfig.DB_IDLE_TIMEOUT,
        },
        maxQueryExecutionTime: databaseConfig.DB_MAX_QUERY_EXEC_TIME,
      });
    }

    return DatabaseProvider.instance;
  }

  public static async initialize(): Promise<void> {
    const dataSource = DatabaseProvider.getInstance();

    try {
      await dataSource.initialize();
      await dataSource.query('SELECT NOW()');

      Logger.info('Database connection established successfully');
    } catch (error: unknown) {
      Logger.error(
        `Failed to initialize database connection: ${(error as Error).message}`,
        error as Error
      );

      throw new InternalServerError(
        DatabaseProvider.name,
        'Database initialization failed',
        error as Error
      );
    }
  }
}
