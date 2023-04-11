// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#custom-services
import type { Id, NullableId, Params, ServiceInterface } from '@feathersjs/feathers'
import Stripe from 'stripe'
import { app } from '../../app'

import type { Application } from '../../declarations'
import { sendPaymentSuccess } from '../../hooks/send-new-account-email'

type StripeWebhooks = 'ok'
type StripeWebhooksData = Stripe.Event & { data: { object: Stripe.PaymentIntent & {receipt_url?: string} } }
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

  async create(event: StripeWebhooksData, params?: ServiceParams): Promise<StripeWebhooks> {
    this.handle_webhook(event)
    return 'ok'
  }

  async handle_webhook(event: StripeWebhooksData) {
    if (event.data.object.status === 'succeeded') {
      const { orderId } = event.data.object.metadata
      const order = await app.service('orders').patch(orderId, { paymentSuccess: 1 })
      const user = await app.service('users').get(order.userId)
      sendPaymentSuccess(user, order, event.data.object?.receipt_url)
    }
  }
}

export const getOptions = (app: Application) => {
  return { app }
}
