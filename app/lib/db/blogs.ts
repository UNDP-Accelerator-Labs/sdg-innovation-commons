import { ConnectionConfig } from '@/app/lib/definitions';

export const connection: ConnectionConfig = {
  database: process.env.BLOG_DB_NAME || '',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
  host: process.env.BLOG_DB_HOST,
  user: process.env.BLOG_DB_USERNAME,
  password: process.env.BLOG_DB_PASSWORD,
  ssl: ['production', 'local-production'].includes(process.env.NODE_ENV || '') &&
    process.env.BLOG_DB_HOST !== 'localhost',
};

