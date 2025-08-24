import { Injectable, Inject } from '@nestjs/common';
import WarehouseTariffDto from './dto/warehouse-tariff.dto';
import { Knex } from 'knex';

interface TariffDate {
  id: number;
  tariff_date: string;
}

@Injectable()
export class TariffsRepository {
  constructor(@Inject('KnexConnection') private readonly knex: Knex) {}

  async getOrCreateDate(date: string): Promise<number> {
    const existing = await this.knex<TariffDate>('tariff_dates')
      .where({ tariff_date: date })
      .first();

    if (existing) return existing.id;

    const [inserted] = await this.knex<TariffDate>('tariff_dates')
      .insert({ tariff_date: date })
      .returning('*');

    return inserted.id;
  }

  async upsertWarehouseTariff(dateId: number, tariff: WarehouseTariffDto): Promise<void> {
    await this.knex('warehouse_tariffs')
      .insert({ date_id: dateId, ...tariff })
      .onConflict(['date_id', 'warehouse_name'])
      .merge();
  }
}
