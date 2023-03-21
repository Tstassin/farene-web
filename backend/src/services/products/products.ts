// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'

import { hooks as schemaHooks } from '@feathersjs/schema'

import {
  productDataValidator,
  productPatchValidator,
  productQueryValidator,
  productResolver,
  productExternalResolver,
  productDataResolver,
  productPatchResolver,
  productQueryResolver
} from './products.schema'

import type { Application } from '../../declarations'
import { ProductService, getOptions } from './products.class'
import { productPath, productMethods } from './products.shared'
import { resourceSchemaCreateResolver, resourceSchemaUpdateResolver } from '../common/resources'

export * from './products.class'
export * from './products.schema'

// A configure function that registers the service and its hooks via `app.configure`
export const product = (app: Application) => {
  // Register our service on the Feathers application
  app.use(productPath, new ProductService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: productMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(productPath).hooks({
    around: {
      all: [
        authenticate('jwt'),
        schemaHooks.resolveExternal(productExternalResolver),
        schemaHooks.resolveResult(productResolver)
      ]
    },
    before: {
      all: [schemaHooks.validateQuery(productQueryValidator), schemaHooks.resolveQuery(productQueryResolver)],
      find: [],
      get: [],
      create: [
        schemaHooks.validateData(productDataValidator), 
        schemaHooks.resolveData(productDataResolver, resourceSchemaCreateResolver)
      ],
      patch: [
        schemaHooks.validateData(productPatchValidator), 
        schemaHooks.resolveData(productPatchResolver, resourceSchemaUpdateResolver)
      ],
      remove: []
    },
    after: {
      all: []
    },
    error: {
      all: []
    }
  })
}

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    [productPath]: ProductService
  }
}
