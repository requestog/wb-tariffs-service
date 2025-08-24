import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Knex from 'knex';

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [
    {
      provide: 'KnexConnection',
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return Knex({
          client: 'pg',
          connection: {
            host: config.get<string>('POSTGRES_HOST', 'localhost'),
            user: config.get<string>('POSTGRES_USER'),
            password: config.get<string>('POSTGRES_PASSWORD'),
            database: config.get<string>('POSTGRES_DB'),
          },
        });
      },
    },
  ],
  exports: ['KnexConnection'],
})
export class DatabaseModule {}
