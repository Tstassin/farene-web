import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("products", (table) => {
    table.integer('sortOrder').defaultTo(0)
  });
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('products', (table) => {
    table.dropColumn('sortOrder')
  })
}
