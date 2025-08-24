import { Module } from '@nestjs/common';
import { TariffsService } from './tariffs.service';
import { TariffsCron } from './tariffs.cron';
import { DatabaseModule } from '../database/database.module';
import { TariffsRepository } from './tariffs.repository';

@Module({
  imports: [DatabaseModule],
  providers: [TariffsService, TariffsRepository, TariffsCron],
  exports: [TariffsService],
})
export class TariffsModule {}
