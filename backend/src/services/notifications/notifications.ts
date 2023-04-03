// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'

import { hooks as schemaHooks } from '@feathersjs/schema'

import {
  notificationDataValidator,
  notificationResolver,
  notificationExternalResolver,
  notificationDataResolver,
} from './notifications.schema'

import type { Application } from '../../declarations'
import { NotificationService, getOptions } from './notifications.class'
import { notificationPath, notificationMethods } from './notifications.shared'

export * from './notifications.class'
export * from './notifications.schema'

// A configure function that registers the service and its hooks via `app.configure`
export const notification = (app: Application) => {
  // Register our service on the Feathers application
  app.use(notificationPath, new NotificationService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: notificationMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(notificationPath).hooks({
    around: {
      all: [
        authenticate('jwt'),
        schemaHooks.resolveExternal(notificationExternalResolver),
        schemaHooks.resolveResult(notificationResolver)
      ]
    },
    before: {
      create: [
        schemaHooks.validateData(notificationDataValidator),
        schemaHooks.resolveData(notificationDataResolver)
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
    [notificationPath]: NotificationService
  }
}
