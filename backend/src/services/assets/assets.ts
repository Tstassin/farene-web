// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'

import { hooks as schemaHooks } from '@feathersjs/schema'
import multer, { MulterIncomingMessage } from '@koa/multer'
// @ts-expect-error
import SharpMulter from 'sharp-multer'
import fs from 'fs'

import {
  assetDataValidator,
  assetQueryValidator,
  assetResolver,
  assetExternalResolver,
  assetDataResolver,
  assetQueryResolver,
} from './assets.schema'

import type { Application } from '../../declarations'
import {  AssetService, getOptions } from './assets.class'
import { assetPath, assetMethods } from './assets.shared'

export * from './assets.class'
export * from './assets.schema'

const storage = SharpMulter({
  destination: (req: MulterIncomingMessage, file: multer.File, cb: (error: Error | null, destination: string) => void) => {
    const { service, id } = req.body
    console.log(service, id)
    const destination = ['./public/assets', service, id].join('/')
    fs.mkdirSync(destination, { recursive: true })
    cb(null, destination); // The destination folder for file uploads
  },
  imageOptions: {
    fileFormat: 'jpg',
    quality: 80,
    resize: { width: 500, height: 500, resizeMode: 'cover' }
  },
  filename: (originalname: string, opts: object, req: MulterIncomingMessage) => {
    return req.body.id + '.jpg'
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 20 * 1000 * 1000
  }
}
)

// A configure function that registers the service and its hooks via `app.configure`
export const asset = (app: Application) => {
  // Register our service on the Feathers application
  app.use(assetPath, new AssetService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: assetMethods,
    events: [],
    koa: {
      before: [
        upload.single('file'),
        async (ctx, next) => {
          const { file } = ctx.request
          console.log('multer got :')
          console.log({ file })
          ctx.feathers = {
            ...ctx.feathers,
            //@ts-expect-error
            file,
          }
          await next()
        }
      ]
    }
  })
  // Initialize hooks
  app.service(assetPath).hooks({
    around: {
      all: [
        // authenticate('jwt'),
        schemaHooks.resolveExternal(assetExternalResolver),
        schemaHooks.resolveResult(assetResolver)
      ]
    },
    before: {
      all: [schemaHooks.validateQuery(assetQueryValidator), schemaHooks.resolveQuery(assetQueryResolver)],
      create: [
        schemaHooks.validateData(assetDataValidator),
        schemaHooks.resolveData(assetDataResolver)
      ],
      /* patch: [schemaHooks.validateData(assetPatchValidator), schemaHooks.resolveData(assetPatchResolver)], */
      /* remove: [] */
    },
    after: {
      all: [],
      create: []
    },
    error: {
      all: []
    }
  })
}

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    [assetPath]: AssetService
  }
}