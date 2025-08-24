import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('tariff_dates', (table) => {
    table.increments('id').primary();
    table.date('tariff_date').unique().notNullable();
  });

  await knex.schema.createTable('warehouse_tariffs', (table) => {
    table.increments('id').primary();
    table
      .integer('date_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('tariff_dates')
      .onDelete('CASCADE');

    table.string('geo_name').notNullable();
    table.string('warehouse_name').notNullable();
    table.decimal('box_delivery_base');
    table.decimal('box_delivery_coef_expr');
    table.decimal('box_delivery_liter');
    table.decimal('box_delivery_marketplace_base');
    table.decimal('box_delivery_marketplace_coef_expr');
    table.decimal('box_delivery_marketplace_liter');
    table.decimal('box_storage_base');
    table.decimal('box_storage_coef_expr');
    table.decimal('box_storage_liter');

    table.unique(['date_id', 'warehouse_name']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('warehouse_tariffs');
  await knex.schema.dropTableIfExists('tariff_dates');
}
