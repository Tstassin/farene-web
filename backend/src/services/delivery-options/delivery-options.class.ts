// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services
import type { Params } from '@feathersjs/feathers'
import { KnexService } from '@feathersjs/knex'
import type { KnexAdapterParams, KnexAdapterOptions } from '@feathersjs/knex'

import type { Application } from '../../declarations'
import type {
  DeliveryOption,
  DeliveryOptionData,
  DeliveryOptionPatch,
  DeliveryOptionQuery
} from './delivery-options.schema'

export type { DeliveryOption, DeliveryOptionData, DeliveryOptionPatch, DeliveryOptionQuery }

export interface DeliveryOptionParams extends KnexAdapterParams<DeliveryOptionQuery> {}

// By default calls the standard Knex adapter service methods but can be customized with your own functionality.
export class DeliveryOptionService<ServiceParams extends Params = DeliveryOptionParams> extends KnexService<
  DeliveryOption,
  DeliveryOptionData,
  DeliveryOptionParams,
  DeliveryOptionPatch
> {}

export const getOptions = (app: Application): KnexAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('sqliteClient'),
    name: 'delivery-options',
    multi: ['remove']
  }
}
