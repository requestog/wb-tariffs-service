import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TariffsModule } from './modules/tariffs/tariffs.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    }),
    ScheduleModule.forRoot(),
    TariffsModule,
  ],
})
export class AppModule {}
