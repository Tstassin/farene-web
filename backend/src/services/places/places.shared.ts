// For more information about this file see https://dove.feathersjs.com/guides/cli/service.shared.html
import type { Params } from '@feathersjs/feathers'
import type { ClientApplication } from '../../client'
import type { Place, PlaceData, PlacePatch, PlaceQuery, PlaceService } from './places.class'

export type { Place, PlaceData, PlacePatch, PlaceQuery }

export type PlaceClientService = Pick<PlaceService<Params<PlaceQuery>>, (typeof placeMethods)[number]>

export const placePath = 'places'

export const placeMethods = ['find', 'get', 'create', 'patch', 'remove'] as const

export const placeClient = (client: ClientApplication) => {
  const connection = client.get('connection')

  client.use(placePath, connection.service(placePath), {
    methods: placeMethods
  })
}

// Add this service to the client service type index
declare module '../../client' {
  interface ServiceTypes {
    [placePath]: PlaceClientService
  }
}
