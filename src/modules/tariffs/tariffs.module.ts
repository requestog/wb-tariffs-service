import { Module } from '@nestjs/common';
import { TariffsService } from './tariffs.service';
import { TariffsCron } from './tariffs.cron';
import { DatabaseModule } from '../database/database.module';
import { TariffsRepository } from './tariffs.repository';
import { GoogleSheetsModule } from '../google-sheets/google-sheets.module';

@Module({
  imports: [DatabaseModule, GoogleSheetsModule],
  providers: [TariffsService, TariffsRepository, TariffsCron],
  exports: [TariffsService],
})
export class TariffsModule {}
