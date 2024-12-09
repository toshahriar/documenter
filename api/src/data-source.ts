import { config } from 'dotenv';
import { DataSource } from 'typeorm';
import { databaseConfig } from '@/config/database';
import { CreateTables20241202123045 } from '@/database/migrations/CreateTables20241202123045';

config();

const dataSource = new DataSource({
  type: 'postgres',
  host: databaseConfig.DB_HOST,
  port: databaseConfig.DB_PORT,
  username: databaseConfig.DB_USER,
  password: databaseConfig.DB_PASSWORD,
  database: databaseConfig.DB_NAME,
  synchronize: false,
  logging: databaseConfig.DB_LOGGING,
  entities: [],
  migrations: [CreateTables20241202123045],
  subscribers: [],
  extra: {
    connectionLimit: databaseConfig.DB_CONNECTION_LIMIT,
    idleTimeoutMillis: databaseConfig.DB_IDLE_TIMEOUT,
  },
  maxQueryExecutionTime: databaseConfig.DB_MAX_QUERY_EXEC_TIME,
});

export default dataSource;
