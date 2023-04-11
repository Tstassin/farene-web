// For more information about this file see https://dove.feathersjs.com/guides/cli/service.shared.html
import type { Params } from '@feathersjs/feathers'
import type { ClientApplication } from '../../client'
import type {
  StripeWebhooks,
  StripeWebhooksData,
  StripeWebhooksQuery,
  StripeWebhooksService
} from './stripe-webhooks.class'

export type { StripeWebhooks, StripeWebhooksData, StripeWebhooksQuery }

export type StripeWebhooksClientService = Pick<
  StripeWebhooksService<Params<StripeWebhooksQuery>>,
  (typeof stripeWebhooksMethods)[number]
>

export const stripeWebhooksPath = 'stripe-webhooks'

export const stripeWebhooksMethods = ['create'] as const

export const stripeWebhooksClient = (client: ClientApplication) => {
  const connection = client.get('connection')

  client.use(stripeWebhooksPath, connection.service(stripeWebhooksPath), {
    methods: stripeWebhooksMethods
  })
}

// Add this service to the client service type index
declare module '../../client' {
  interface ServiceTypes {
    [stripeWebhooksPath]: StripeWebhooksClientService
  }
}
