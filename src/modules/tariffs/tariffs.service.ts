import { Injectable } from '@nestjs/common';
import WarehouseTariffDto from './dto/warehouse-tariff.dto';
import axios from 'axios';
import * as process from 'node:process';
import { Logger } from '@nestjs/common';

@Injectable()
export class TariffsService {
  private readonly logger = new Logger(TariffsService.name);
  async getTariffs(date: string): Promise<WarehouseTariffDto[]> {
    const url = process.env.ENDPOINT_URL;
    this.logger.verbose(`url ${url}`);
    const response = await axios.get(`${url}?date=${date}`, {
      headers: { Authorization: `${process.env.WB_API_KEY}` },
    });
    const data = response.data.response.data.warehouseList;

    return data.map((item) => ({
      geoName: item.geoName,
      warehouseName: item.warehouseName,
      boxDeliveryBase: this.parseNumber(item.boxDeliveryBase),
      boxDeliveryCoefExpr: this.parseNumber(item.boxDeliveryCoefExpr),
      boxDeliveryLiter: this.parseNumber(item.boxDeliveryLiter),
      boxDeliveryMarketplaceBase: this.parseNumber(item.boxDeliveryMarketplaceBase),
      boxDeliveryMarketplaceCoefExpr: this.parseNumber(item.boxDeliveryMarketplaceCoefExpr),
      boxDeliveryMarketplaceLiter: this.parseNumber(item.boxDeliveryMarketplaceLiter),
      boxStorageBase: this.parseNumber(item.boxStorageBase),
      boxStorageCoefExpr: this.parseNumber(item.boxStorageCoefExpr),
      boxStorageLiter: this.parseNumber(item.boxStorageLiter),
    }));
  }

  private parseNumber(value: string | null): number | null {
    if (!value || value === '-') return null;
    return parseFloat(value.replace(',', '.'));
  }
}
