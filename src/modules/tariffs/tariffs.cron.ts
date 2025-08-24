import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { TariffsService } from './tariffs.service';
import { Logger } from '@nestjs/common';
import WarehouseTariffDto from './dto/warehouse-tariff.dto';

@Injectable()
export class TariffsCron {
  private readonly logger = new Logger(TariffsCron.name);
  constructor(private readonly tariffsService: TariffsService) {}

  @Cron(CronExpression.EVERY_HOUR)
  async handleCron() {
    const today = new Date().toISOString().slice(0, 10);
    this.logger.log(`Получение данных на ${today}...`);
    const tariffs: WarehouseTariffDto[] = await this.tariffsService.getTariffs(today);
    await this.tariffsService.saveTariffs(today, tariffs);
    this.logger.log('Данные были получены и сохранены');
  }
}
