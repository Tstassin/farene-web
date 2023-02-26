// For more information about this file see https://dove.feathersjs.com/guides/cli/knexfile.html
import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('products', (table) => {
    table.increments('id')
    table.text('name').notNullable()
    table.text('description')
    table.float('price').notNullable()
    table.integer('weight')
    table.text('categoryId').references('id').inTable('categories')
    table.dateTime('createdAt').notNullable()
    table.dateTime('updatedAt').notNullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('products')
}
