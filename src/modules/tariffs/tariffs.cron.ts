import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { TariffsService } from './tariffs.service';
import { Logger } from '@nestjs/common';
import WarehouseTariffDto from './dto/warehouse-tariff.dto';

@Injectable()
export class TariffsCron {
  private readonly logger = new Logger(TariffsCron.name);
  constructor(private readonly tariffsService: TariffsService) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async handleCron() {
    const today = new Date().toISOString().slice(0, 10);
    this.logger.verbose(`Today is ${today}`);
    const tariffs: WarehouseTariffDto[] = await this.tariffsService.getTariffs(today);
    this.logger.verbose(tariffs);
  }
}
