import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TariffsModule } from './modules/tariffs/tariffs.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),
    ScheduleModule.forRoot(),
    TariffsModule,
  ],
})
export class AppModule {}
