import { Module } from '@nestjs/common';
import { TariffsService } from './tariffs.service';
import { TariffsCron } from './tariffs.cron';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [TariffsService, TariffsCron],
  exports: [TariffsService],
})
export class TariffsModule {}
