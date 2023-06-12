// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'

import { hooks as schemaHooks } from '@feathersjs/schema'

import {
  deliveryOptionDataValidator,
  deliveryOptionPatchValidator,
  deliveryOptionQueryValidator,
  deliveryOptionResolver,
  deliveryOptionExternalResolver,
  deliveryOptionDataResolver,
  deliveryOptionPatchResolver,
  deliveryOptionQueryResolver
} from './delivery-options.schema'

import type { Application } from '../../declarations'
import { DeliveryOptionService, getOptions } from './delivery-options.class'
import { deliveryOptionPath, deliveryOptionMethods } from './delivery-options.shared'

export * from './delivery-options.class'
export * from './delivery-options.schema'

// A configure function that registers the service and its hooks via `app.configure`
export const deliveryOption = (app: Application) => {
  // Register our service on the Feathers application
  app.use(deliveryOptionPath, new DeliveryOptionService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: deliveryOptionMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(deliveryOptionPath).hooks({
    around: {
      all: [
        authenticate('jwt'),
        schemaHooks.resolveExternal(deliveryOptionExternalResolver),
        schemaHooks.resolveResult(deliveryOptionResolver)
      ]
    },
    before: {
      all: [
        schemaHooks.validateQuery(deliveryOptionQueryValidator),
        schemaHooks.resolveQuery(deliveryOptionQueryResolver)
      ],
      find: [],
      get: [],
      create: [
        schemaHooks.validateData(deliveryOptionDataValidator),
        schemaHooks.resolveData(deliveryOptionDataResolver)
      ],
      patch: [
        schemaHooks.validateData(deliveryOptionPatchValidator),
        schemaHooks.resolveData(deliveryOptionPatchResolver)
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
    [deliveryOptionPath]: DeliveryOptionService
  }
}
