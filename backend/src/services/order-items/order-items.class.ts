// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services
import type { Params } from '@feathersjs/feathers'
import { KnexService } from '@feathersjs/knex'
import type { KnexAdapterParams, KnexAdapterOptions } from '@feathersjs/knex'

import type { Application } from '../../declarations'
import type { OrderItem, OrderItemData, OrderItemPatch, OrderItemQuery } from './order-items.schema'

export type { OrderItem, OrderItemData, OrderItemPatch, OrderItemQuery }

export interface OrderItemParams extends KnexAdapterParams<OrderItemQuery> {}

// By default calls the standard Knex adapter service methods but can be customized with your own functionality.
export class OrderItemService<ServiceParams extends Params = OrderItemParams> extends KnexService<
  OrderItem,
  OrderItemData,
  OrderItemParams,
  OrderItemPatch
> {}

export const getOptions = (app: Application): KnexAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('sqliteClient'),
    name: 'order-items'
  }
}
