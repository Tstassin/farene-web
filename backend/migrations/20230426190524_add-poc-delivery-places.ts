// For more information about this file see https://dove.feathersjs.com/guides/cli/knexfile.html
import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("orders", (table) => {
    table.string("deliveryPlace").notNullable().defaultTo('farene');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("orders", (table) => {
    table.dropColumn("deliveryPlace");
  });
}
