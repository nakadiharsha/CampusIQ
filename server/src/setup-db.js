import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import mysql from 'mysql2/promise';
import 'dotenv/config';

const serverDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const connection = await mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  multipleStatements: true
});

try {
  const schema = await fs.readFile(path.join(serverDir, 'schema.sql'), 'utf8');
  const seed = await fs.readFile(path.join(serverDir, 'seed.sql'), 'utf8');
  await connection.query(schema);
  await connection.query(seed);
  console.log('CampusIQ database, tables, and demo data are ready.');
} catch (error) {
  console.error('Database setup failed:', error.message);
  process.exitCode = 1;
} finally {
  await connection.end();
}
