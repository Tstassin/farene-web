// For more information about this file see https://dove.feathersjs.com/guides/cli/knexfile.html
import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('order-items', (table) => {
    table.increments('id')
    table.integer('amount').notNullable()
    table.jsonb('product').notNullable()
    table.integer('orderId').references('id').inTable('orders').notNullable()
    table.dateTime('createdAt').notNullable()
    table.dateTime('updatedAt').notNullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('order-items')
}
