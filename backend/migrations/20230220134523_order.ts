// For more information about this file see https://dove.feathersjs.com/guides/cli/knexfile.html
import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('orders', (table) => {
    table.increments('id')
    table.date('delivery').notNullable()
    table.integer('userId').references('id').inTable('users').notNullable()
    table.dateTime('createdAt').notNullable()
    table.dateTime('updatedAt').notNullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('orders')
}
