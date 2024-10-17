// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#custom-services
import type { Params, ServiceInterface } from '@feathersjs/feathers'
import multer from '@koa/multer'
import { BadRequest } from '@feathersjs/errors'

import type { Application } from '../../declarations'
import type { Asset, AssetData, AssetPatch, AssetQuery } from './assets.schema'

export type { Asset, AssetData, AssetPatch, AssetQuery }

export interface AssetServiceOptions {
  app: Application
}

export interface AssetParams extends Params<AssetQuery> { }

export class AssetService<ServiceParams extends AssetParams = AssetParams>
  implements ServiceInterface<Asset, AssetData, ServiceParams, AssetPatch>
{
  constructor(public options: AssetServiceOptions) { }

  async create(data: AssetData, _params?: ServiceParams & { file: multer.File }): Promise<Asset> {
    const { file } = _params ?? {}
    if (!file) throw new BadRequest("Couldn't process image")
    const id = parseInt(data.id.toString())
    if (Number.isNaN(id)) throw new BadRequest("id must be an integer")
    return {
      id,
      service: data.service,
      file
    }
  }
}

export const getOptions = (app: Application) => {
  return { app }
}
