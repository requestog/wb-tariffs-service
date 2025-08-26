import * as dotenv from 'dotenv';

dotenv.config();

module.exports = {
  client: 'pg',
  connection: {
    host: process.env.DATABASE_HOST || 'postgres',
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_DB,
  },
  migrations: {
    directory: 'migrations',
    extension: 'js',
  },
};
