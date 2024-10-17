import pgPromise, { IInitOptions, IDatabase } from 'pg-promise';
import getConnectionConfig from './app';
import { connection as generalConnection } from './general';
import { connection as blogConnection } from './blogs';

const logSQL = process.env.LOG_SQL !== 'false';
if (!logSQL) {
  console.warn('suppressing SQL output! use LOG_SQL to configure');
}

const initOptions: IInitOptions = {
  query(e) {
    if (logSQL) console.log(e.query);
  },
};

const pgp = pgPromise(initOptions);

// Initialize the database connections
const sm_conn: IDatabase<any> = pgp(getConnectionConfig('sm'));
const exp_conn: IDatabase<any> = pgp(getConnectionConfig('exp'));
const ap_conn: IDatabase<any> = pgp(getConnectionConfig('ap'));
const general: IDatabase<any> = pgp(generalConnection);
const blogs: IDatabase<any> = pgp(blogConnection);

export const DB = { sm_conn, exp_conn, ap_conn, general, blogs, pgp };

export const get_db_name = async (db_id : number ) => {
  const db = await general.oneOrNone(`
    SELECT db from extern_db
     WHERE id = $1
    `, [db_id])

  if(db == 'ap') return ap_conn;
  if(db == 'exp') return exp_conn;
  if(db == 'sm') return sm_conn;
  return null;
}
