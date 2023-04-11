// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html

import type { Application } from '../../declarations'
import { StripeWebhooksService, getOptions } from './stripe-webhooks.class'
import { stripeWebhooksPath, stripeWebhooksMethods } from './stripe-webhooks.shared'

export * from './stripe-webhooks.class'

// A configure function that registers the service and its hooks via `app.configure`
export const stripeWebhooks = (app: Application) => {
  // Register our service on the Feathers application
  app.use(stripeWebhooksPath, new StripeWebhooksService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: stripeWebhooksMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(stripeWebhooksPath).hooks({})
}

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    [stripeWebhooksPath]: StripeWebhooksService
  }
}
