import { Injectable } from '@nestjs/common';
import WarehouseTariffDto from './dto/warehouse-tariff.dto';
import axios from 'axios';
import * as process from 'node:process';
import { Logger } from '@nestjs/common';
import { TariffsRepository } from './tariffs.repository';

@Injectable()
export class TariffsService {
  private readonly logger = new Logger(TariffsService.name);
  constructor(private readonly repository: TariffsRepository) {}

  async getTariffs(date: string): Promise<WarehouseTariffDto[]> {
    const url = process.env.API_URL;
    this.logger.verbose(`url ${url}`);
    const response = await axios.get(`${url}?date=${date}`, {
      headers: { Authorization: `${process.env.WB_API_KEY}` },
    });
    const data = response.data.response.data.warehouseList;

    return data.map((item) => ({
      geo_name: item.geoName,
      warehouse_name: item.warehouseName,
      box_delivery_base: this.parseNumber(item.boxDeliveryBase),
      box_delivery_coef_expr: this.parseNumber(item.boxDeliveryCoefExpr),
      box_delivery_liter: this.parseNumber(item.boxDeliveryLiter),
      box_delivery_marketplace_base: this.parseNumber(item.boxDeliveryMarketplaceBase),
      box_delivery_marketplace_coef_expr: this.parseNumber(item.boxDeliveryMarketplaceCoefExpr),
      box_delivery_marketplace_liter: this.parseNumber(item.boxDeliveryMarketplaceLiter),
      box_storage_base: this.parseNumber(item.boxStorageBase),
      box_storage_coef_expr: this.parseNumber(item.boxStorageCoefExpr),
      box_storage_liter: this.parseNumber(item.boxStorageLiter),
    }));
  }

  private parseNumber(value: string | null): number | null {
    if (!value || value === '-') return null;
    return parseFloat(value.replace(',', '.'));
  }

  async saveTariffs(date: string, tariffs: WarehouseTariffDto[]): Promise<void> {
    const dateId = await this.repository.getOrCreateDate(date);
    for (const tariff of tariffs) {
      await this.repository.upsertWarehouseTariff(dateId, tariff);
    }
  }
}
