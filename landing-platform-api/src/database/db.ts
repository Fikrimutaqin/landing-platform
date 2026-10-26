import postgres from 'postgres';
import * as dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL || '';

// If DATABASE_URL is not provided or contains placeholder, export a dummy/noop proxy to avoid crashing on import
const sql = postgres(connectionString, {
  ssl: 'require',
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
});

export default sql;
