import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drizzle, PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema.js';

export type DrizzleDatabase = PostgresJsDatabase<typeof schema>;

@Injectable()
export class DatabaseService implements OnModuleDestroy {
  private readonly logger = new Logger(DatabaseService.name);
  private client: postgres.Sql | null = null;
  private db: DrizzleDatabase | null = null;

  constructor(private readonly configService: ConfigService) {
    this.initDatabase();
  }

  private initDatabase() {
    const databaseUrl =
      this.configService.get<string>('DATABASE_URL') ||
      process.env.DATABASE_URL;

    // Check if DATABASE_URL contains placeholder or is missing
    if (!databaseUrl || databaseUrl.includes('[YOUR_DB_PASSWORD]') || databaseUrl.includes('[YOUR-PASSWORD]')) {
      this.logger.warn(
        'DATABASE_URL contains placeholder or is not configured. Direct PostgreSQL Drizzle queries will remain offline until a valid password is provided in .env.',
      );
      return;
    }

    try {
      this.client = postgres(databaseUrl, {
        ssl: 'require',
        max: 10,
        idle_timeout: 30,
        connect_timeout: 10,
      });

      this.db = drizzle(this.client, { schema });
      this.logger.log('✅ Supabase PostgreSQL Drizzle (postgres.js) connection initialized');
    } catch (error: any) {
      this.logger.error(
        `Failed to initialize database client: ${error?.message || error}`,
      );
    }
  }

  getDb(): DrizzleDatabase | null {
    return this.db;
  }

  getClient(): postgres.Sql | null {
    return this.client;
  }

  async onModuleDestroy() {
    if (this.client) {
      await this.client.end();
      this.logger.log('Database connection closed.');
    }
  }
}
