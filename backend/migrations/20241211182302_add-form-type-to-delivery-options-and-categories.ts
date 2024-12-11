import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("delivery-options", (table) => {
    table.string('type').defaultTo('standard').notNullable()
  });
  await knex.schema.alterTable("categories", (table) => {
    table.string('type').defaultTo('standard').notNullable()
  });
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("delivery-options", (table) => {
    table.dropColumn('type')
  });
  await knex.schema.alterTable("categories", (table) => {
    table.dropColumn('type')
  });
}
