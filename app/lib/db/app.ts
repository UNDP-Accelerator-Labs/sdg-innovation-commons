import { ConnectionConfig } from '@/app/lib/definitions';

export default function getConnectionConfig(app_id: string): ConnectionConfig {
  let db_name: string | undefined;

  switch (app_id) {
    case 'sm':
      db_name = process.env.SM_DB_NAME;
      break;
    case 'exp':
      db_name = process.env.EXP_DB_NAME;
      break;
    case 'ap':
      db_name = process.env.AP_DB_NAME;
      break;
    default:
      db_name = process.env.SM_DB_NAME;
      break;
  }

  let connection: ConnectionConfig;

  if (['production', 'local-production'].includes(process.env.NODE_ENV || '')) {
    console.log('in production environment');
    connection = {
      database: db_name || '',
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
      host: process.env.APP_DB_HOST,
      user: process.env.APP_DB_USER,
      password: process.env.APP_DB_PASSWORD,
      ssl: process.env.APP_DB_HOST !== 'localhost',
    };
  } else {
    console.log('in local test environment');
    connection = {
      database: db_name || process.env.database || '',
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
      host: process.env.host,
      user: process.env.user,
      password: process.env.password,
    };
  }

  return connection;
}
