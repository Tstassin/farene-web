// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html

import { hooks as schemaHooks } from '@feathersjs/schema'

import {
  orderDataValidator,
  orderPatchValidator,
  orderQueryValidator,
  orderResolver,
  orderExternalResolver,
  orderDataResolver,
  orderPatchResolver,
  orderQueryResolver,
} from './orders.schema'

import type { Application } from '../../declarations'
import { OrderService, getOptions } from './orders.class'
import { orderPath, orderMethods } from './orders.shared'
import { authenticate } from '@feathersjs/authentication/'
import { resourceSchemaCreateResolver, resourceSchemaUpdateResolver } from '../common/resources'
import { checkDeliveryDate, createOrderItems } from './orders.hooks'

export * from './orders.class'
export * from './orders.schema'

// A configure function that registers the service and its hooks via `app.configure`
export const order = (app: Application) => {
  // Register our service on the Feathers application
  app.use(orderPath, new OrderService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: orderMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(orderPath).hooks({
    around: {
      find: [
        authenticate('jwt'),
        schemaHooks.resolveExternal(orderExternalResolver),
        schemaHooks.resolveResult(orderResolver),
      ],
      get: [
        authenticate('jwt'),
        schemaHooks.resolveExternal(orderExternalResolver),
        schemaHooks.resolveResult(orderResolver),
      ],
      create: [
        authenticate('jwt'),
        schemaHooks.resolveExternal(orderExternalResolver),
        schemaHooks.resolveResult(orderResolver),
        createOrderItems,
      ],
      getNextDeliveryDates: [
        authenticate('jwt')
      ]
    },
    before: {
      all: [
        schemaHooks.validateQuery(orderQueryValidator),
        schemaHooks.resolveQuery(orderQueryResolver)
      ],
      find: [
        schemaHooks.validateQuery(orderQueryValidator),
        schemaHooks.resolveQuery(orderQueryResolver)],
      get: [
        schemaHooks.validateQuery(orderQueryValidator),
        schemaHooks.resolveQuery(orderQueryResolver)],
      create: [
        schemaHooks.validateData(orderDataValidator),
        schemaHooks.resolveData(orderDataResolver, resourceSchemaCreateResolver),
        checkDeliveryDate
      ],
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
    [orderPath]: OrderService
  }
}
