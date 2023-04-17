import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("products", (table) => {
    table.boolean('disabled').defaultTo(false)
  });
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('products', (table) => {
    table.dropColumn('disabled')
  })
}
