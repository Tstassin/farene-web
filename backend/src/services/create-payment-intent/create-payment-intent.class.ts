// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#custom-services
import { BadRequest } from '@feathersjs/errors/lib'
import type { Id, NullableId, Params, ServiceInterface } from '@feathersjs/feathers'
import Stripe from 'stripe'
import type { Application } from '../../declarations'
import type {
  CreatePaymentIntentReturnData,
  CreatePaymentIntentData,
} from './create-payment-intent.schema'

export type {
  CreatePaymentIntentReturnData,
  CreatePaymentIntentData,
}

export interface CreatePaymentIntentServiceOptions {
  app: Application
}

export interface CreatePaymentIntentParams extends Params<CreatePaymentIntentData> { }

const stripe = new Stripe('sk_test_tqcvbJtLwKUtMcIQm1bPLZq6', { apiVersion: '2022-11-15' })

// This is a skeleton for a custom service class. Remove or add the methods you need here
export class CreatePaymentIntentService<
  ServiceParams extends CreatePaymentIntentParams = CreatePaymentIntentParams
> implements
  ServiceInterface<CreatePaymentIntentReturnData, CreatePaymentIntentData, ServiceParams>
{
  constructor(public options: CreatePaymentIntentServiceOptions) { }

  // This method has to be added to the 'methods' option to make it available to clients
  async update(
    id: NullableId,
    data: CreatePaymentIntentData,
    _params?: ServiceParams
  ): Promise<{ clientSecret: Stripe.PaymentIntent['client_secret'] }> {

    const { orderId } = data

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 40,
      currency: "eur",
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return {
      clientSecret: paymentIntent.client_secret,
    }
  }
}

export const getOptions = (app: Application) => {
  return { app }
}
