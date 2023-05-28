// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'

import { hooks as schemaHooks } from '@feathersjs/schema'

import {
  placeDataValidator,
  placePatchValidator,
  placeQueryValidator,
  placeResolver,
  placeExternalResolver,
  placeDataResolver,
  placePatchResolver,
  placeQueryResolver
} from './places.schema'

import type { Application } from '../../declarations'
import { PlaceService, getOptions } from './places.class'
import { placePath, placeMethods } from './places.shared'
import { restrictToAdmin } from '../users/users.hooks'
import { debug, validate } from 'feathers-hooks-common'
import { noDuplicatePlaceName } from './places.hooks'

export * from './places.class'
export * from './places.schema'

// A configure function that registers the service and its hooks via `app.configure`
export const place = (app: Application) => {
  // Register our service on the Feathers application
  app.use(placePath, new PlaceService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: placeMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(placePath).hooks({
    around: {
      all: [
        authenticate('jwt'),
        schemaHooks.resolveExternal(placeExternalResolver),
        schemaHooks.resolveResult(placeResolver)
      ]
    },
    before: {
      all: [schemaHooks.validateQuery(placeQueryValidator), schemaHooks.resolveQuery(placeQueryResolver)],
      find: [],
      get: [],
      create: [restrictToAdmin, schemaHooks.validateData(placeDataValidator), validate(noDuplicatePlaceName), schemaHooks.resolveData(placeDataResolver)],
      patch: [restrictToAdmin, schemaHooks.validateData(placePatchValidator), schemaHooks.resolveData(placePatchResolver)],
      remove: [restrictToAdmin]
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
    [placePath]: PlaceService
  }
}
