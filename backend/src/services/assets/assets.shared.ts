// For more information about this file see https://dove.feathersjs.com/guides/cli/service.shared.html
import type { Params } from '@feathersjs/feathers'
import type { ClientApplication } from '../../client'
import type { Asset, AssetData, AssetPatch, AssetQuery, AssetService } from './assets.class'

export type { Asset, AssetData, AssetPatch, AssetQuery }

export type AssetClientService = Pick<AssetService<Params<AssetQuery>>, (typeof assetMethods)[number]>

export const assetPath = 'assets'

export const assetMethods = [/* 'find', 'get', */ 'create',/*  'patch', 'remove' */] as const

export const assetClient = (client: ClientApplication) => {
  const connection = client.get('connection')

  client.use(assetPath, connection.service(assetPath), {
    methods: assetMethods
  })
}

// Add this service to the client service type index
declare module '../../client' {
  interface ServiceTypes {
    [assetPath]: AssetClientService
  }
}
