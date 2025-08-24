import { Module } from '@nestjs/common';
import Knex from 'knex';
import * as process from 'node:process';

@Module({
  providers: [
    {
      provide: 'KnexConnection',
      useFactory: () => {
        return Knex({
          client: 'pg',
          connection: {
            host: 'db',
            user: process.env.POSTGRES_USER,
            password: process.env.POSTGRES_PASSWORD,
            database: process.env.POSTGRES_DB,
          },
        });
      },
    },
  ],
  exports: ['KnexConnection'],
})
export class DatabaseModule {}
