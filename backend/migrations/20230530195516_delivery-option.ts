// For more information about this file see https://dove.feathersjs.com/guides/cli/knexfile.html
import type { Knex } from 'knex'
import { DeliveryOption, DeliveryOptionData } from '../src/client'
import { Order } from '../src/services/orders/orders.schema'
import { place } from '../src/services/places/places'
import { Place, PlaceData } from '../src/services/places/places.schema'

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
    table.integer('deliveryOptionId').references('id').inTable('delivery-options')
  })
  const allOrders = await (await knex.table('orders')) as Order[]
  for (const order of allOrders) {
    const { delivery, deliveryPlace } = order
    let places = await knex('places').where({ name: deliveryPlace })
    let place
    if (places.length === 0) {
      places = await knex('places').insert({ name: deliveryPlace, description: '' }, '*')
    }
    place = places[0]
    let deliveryOptions = await knex('delivery-options').where({ placeId: place.id, day: delivery })
    let deliveryOption
    if (deliveryOptions.length === 0) {
      deliveryOptions = await knex('delivery-options').insert({ day: delivery, from: 9, to: 17, placeId: place.id }, '*')
    }
    deliveryOption = deliveryOptions[0]
    await knex('orders').where({ id: order.id }).update({ deliveryOptionId: deliveryOption.id })
  }
  await knex.schema.alterTable('orders', (table) => {
    table.dropNullable('deliveryOptionId')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('delivery-options')
  await knex.schema.alterTable('orders', (table) => {
    table.dropColumn('deliveryOptionId')
  })
}
