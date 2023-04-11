// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#custom-services
import type { Id, NullableId, Params, ServiceInterface } from '@feathersjs/feathers'
import Stripe from 'stripe'

import type { Application } from '../../declarations'

type StripeWebhooks = 'ok'
type StripeWebhooksData = Stripe.Event
type StripeWebhooksQuery = {}

export type { StripeWebhooks, StripeWebhooksData, StripeWebhooksQuery }

export interface StripeWebhooksServiceOptions {
  app: Application
}

export interface StripeWebhooksParams extends Params<StripeWebhooksQuery> { }

// This is a skeleton for a custom service class. Remove or add the methods you need here
export class StripeWebhooksService<ServiceParams extends StripeWebhooksParams = StripeWebhooksParams>
  implements ServiceInterface<StripeWebhooks, StripeWebhooksData, ServiceParams>
{
  constructor(public options: StripeWebhooksServiceOptions) { }

  async create(data: StripeWebhooksData, params?: ServiceParams): Promise<StripeWebhooks> {
    this.handle_webhook(data)
    return 'ok'
  }

  async handle_webhook(data: Stripe.Event) {
    console.log(data.object)
  }
}

export const getOptions = (app: Application) => {
  return { app }
}
