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
            host: config.get<string>('DATABASE_HOST', 'postgres'),
            user: config.get<string>('DATABASE_USER'),
            password: config.get<string>('DATABASE_PASSWORD'),
            database: config.get<string>('DATABASE_DB'),
          },
        });
      },
    },
  ],
  exports: ['KnexConnection'],
})
export class DatabaseModule {}
