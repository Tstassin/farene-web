// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services
import type { Params } from '@feathersjs/feathers'
import { KnexService } from '@feathersjs/knex'
import type { KnexAdapterParams, KnexAdapterOptions } from '@feathersjs/knex'

import type { Application } from '../../declarations'
import type { Place, PlaceData, PlacePatch, PlaceQuery } from './places.schema'

export type { Place, PlaceData, PlacePatch, PlaceQuery }

export interface PlaceParams extends KnexAdapterParams<PlaceQuery> { }

// By default calls the standard Knex adapter service methods but can be customized with your own functionality.
export class PlaceService<ServiceParams extends Params = PlaceParams> extends KnexService<
  Place,
  PlaceData,
  PlaceParams,
  PlacePatch
> {
}

export const getOptions = (app: Application): KnexAdapterOptions => {
  return {
    paginate: false,
    Model: app.get('sqliteClient'),
    name: 'places',
    multi: ['remove']
  }
}
