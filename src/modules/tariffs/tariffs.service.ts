import { Injectable } from '@nestjs/common';
import WarehouseTariffDto from './dto/warehouse-tariff.dto';
import axios from 'axios';
import * as process from 'node:process';
import { Logger } from '@nestjs/common';
import { TariffsRepository } from './tariffs.repository';
import { GoogleSheetsService } from '../google-sheets/google-sheets.service';

@Injectable()
export class TariffsService {
  private readonly logger = new Logger(TariffsService.name);

  constructor(
    private readonly repository: TariffsRepository,
    private readonly googleSheetsService: GoogleSheetsService,
  ) {}

  async getTariffs(date: string): Promise<WarehouseTariffDto[]> {
    const url = process.env.API_URL;
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

  async saveTariffs(date: string, tariffs): Promise<void> {
    const dateId = await this.repository.getOrCreateDate(date);
    for (const tariff of tariffs) {
      await this.repository.upsertWarehouseTariff(dateId, tariff);
    }

    const sortedTariffs = [...tariffs].sort((a, b) => {
      const aCoef = a.box_delivery_coef_expr ?? 0;
      const bCoef = b.box_delivery_coef_expr ?? 0;
      return aCoef - bCoef;
    });

    const dataForSheet = [
      [
        'Географический округ',
        'Склад',
        'Базовая стоимость (FBO)',
        'Коэффициент (FBO)',
        'Стоимость за литр (FBO)',
        'Базовая стоимость (FBS)',
        'Коэффициент (FBS)',
        'Стоимость за литр (FBS)',
        'Базовая стоимость хранения',
        'Коэффициент хранения',
        'Стоимость хранения за литр',
      ],
      ...sortedTariffs.map((tariff) => [
        tariff.geo_name ?? '',
        tariff.warehouse_name ?? '',
        tariff.box_delivery_base ?? '',
        tariff.box_delivery_coef_expr ?? '',
        tariff.box_delivery_liter ?? '',
        tariff.box_delivery_marketplace_base ?? '',
        tariff.box_delivery_marketplace_coef_expr ?? '',
        tariff.box_delivery_marketplace_liter ?? '',
        tariff.box_storage_base ?? '',
        tariff.box_storage_coef_expr ?? '',
        tariff.box_storage_liter ?? '',
      ]),
    ];

    await this.googleSheetsService.updateSheet(dataForSheet);
  }
}
