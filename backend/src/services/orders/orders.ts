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
  orderQueryResolver
} from './orders.schema'

import type { Application } from '../../declarations'
import { OrderService, getOptions } from './orders.class'
import { orderPath, orderMethods } from './orders.shared'
import { authenticate } from '@feathersjs/authentication/'
import { resourceSchemaCreateResolver, resourceSchemaUpdateResolver } from '../common/resources'
import { BadRequest } from '@feathersjs/errors/lib'

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
      all: [
        authenticate('jwt'),
        schemaHooks.resolveExternal(orderExternalResolver),
        schemaHooks.resolveResult(orderResolver),
      ],
      create: [
        async (context, next) => {
          if (!context.data || !('products' in context.data)) {
            throw new BadRequest('No products in order')
          }
          const { products } = context.data
          await next()
          if (context.result === undefined || Array.isArray(context.result) || 'total' in context.result) {
            throw new Error("Hmmm shouldn't happen")
          }
          const { id: orderId } = context.result
          const orderItems = await context.app.service('order-items').create(products.map(product => ({ ...product, orderId })))
          console.log(orderItems)
        }
      ]
    },
    before: {
      all: [
        schemaHooks.validateQuery(orderQueryValidator),
        schemaHooks.resolveQuery(orderQueryResolver)
      ],
      find: [],
      get: [],
      create: [
        schemaHooks.validateData(orderDataValidator),
        schemaHooks.resolveData(orderDataResolver, resourceSchemaCreateResolver),
      ],
      patch: [
        schemaHooks.validateData(orderPatchValidator),
        schemaHooks.resolveData(orderPatchResolver, resourceSchemaUpdateResolver),
      ],
      remove: [],
      update: [
        schemaHooks.validateData(orderDataValidator),
        schemaHooks.resolveData(orderDataResolver, resourceSchemaUpdateResolver),
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
