import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import * as dotenv from 'dotenv';

dotenv.config();

async function runMigration() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error('❌ DATABASE_URL is not defined in environment variables');
    process.exit(1);
  }

  const client = postgres(connectionString, { max: 1, ssl: 'require' });
  const db = drizzle(client);

  try {
    await migrate(db, { migrationsFolder: './drizzle' });
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runMigration();
