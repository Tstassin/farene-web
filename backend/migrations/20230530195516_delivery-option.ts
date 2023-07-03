// For more information about this file see https://dove.feathersjs.com/guides/cli/knexfile.html
import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('delivery-options', (table) => {
    table.increments('id').notNullable()
    table.integer('placeId').references('id').inTable('places').notNullable()
    table.date('day').notNullable()
    table.time('from').notNullable()
    table.time('to').notNullable()
    table.string('description').notNullable().defaultTo('')
  })
  await knex.schema.alterTable('orders', (table) => {
    table.integer('deliveryOptionId').references('id').inTable('delivery-options').notNullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('delivery-options')
  await knex.schema.alterTable('orders', (table) => {
    table.dropColumn('deliveryOptionId')
  })
}
