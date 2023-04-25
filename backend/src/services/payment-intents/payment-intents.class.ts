// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#custom-services
import type {
  Params,
  ServiceInterface,
} from "@feathersjs/feathers";
import Stripe from "stripe";
import { app } from "../../app";
import type { Application } from "../../declarations";
import { calculateOrderPrice } from "../orders/orders.utils";
import type {
  PaymentIntentsReturnData,
  PaymentIntentsData,
} from "./payment-intents.schema";

export type { PaymentIntentsReturnData, PaymentIntentsData };

export interface PaymentIntentsServiceOptions {
  app: Application;
}

export interface PaymentIntentsParams
  extends Params<PaymentIntentsData> { }

let stripe: Stripe

// This is a skeleton for a custom service class. Remove or add the methods you need here
export class PaymentIntentsService<
  ServiceParams extends PaymentIntentsParams = PaymentIntentsParams
> implements
  ServiceInterface<
    PaymentIntentsReturnData,
    PaymentIntentsData,
    ServiceParams
  >
{
  constructor(public options: PaymentIntentsServiceOptions) {
    stripe = new Stripe(app.get('payments').stripe.secret_key, {
      apiVersion: "2022-11-15",
    });
    // TODO : Validate the API KEY
  }

  // This method has to be added to the 'methods' option to make it available to clients
  async create({ orderId }: PaymentIntentsData, params: ServiceParams): Promise<Stripe.Response<Stripe.PaymentIntent>> {

    const orderPrice = Math.round((await calculateOrderPrice(orderId)) * 100)
    const userEmail = params.user?.email

    const paymentIntentCreateData: Stripe.PaymentIntentCreateParams = {
      amount: orderPrice,
      currency: "eur",
      receipt_email: userEmail,
      payment_method_types: ['card', 'bancontact'],
      metadata: {
        orderId
      }
    }

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await this._createPaymentIntent(paymentIntentCreateData);
    return paymentIntent;
  }

  async _createPaymentIntent(data: Stripe.PaymentIntentCreateParams) {
    const paymentIntent = stripe.paymentIntents.create(data)
    return paymentIntent
  }

  // This method has to be added to the 'methods' option to make it available to clients
  async get(paymentIntentId: Stripe.PaymentIntent['id']): Promise<Stripe.Response<Stripe.PaymentIntent>> {
    return this._get(paymentIntentId);
  }

  async _get(paymentIntentId: Stripe.PaymentIntent['id']): Promise<Stripe.Response<Stripe.PaymentIntent>> {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    return paymentIntent;
  }
}

export const getOptions = (app: Application) => {
  return { app };
};
