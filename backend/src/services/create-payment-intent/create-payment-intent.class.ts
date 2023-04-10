// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#custom-services
import { BadRequest } from "@feathersjs/errors/lib";
import type {
  Id,
  NullableId,
  Params,
  ServiceInterface,
} from "@feathersjs/feathers";
import Stripe from "stripe";
import { app } from "../../app";
import type { Application } from "../../declarations";
import type {
  CreatePaymentIntentReturnData,
  CreatePaymentIntentData,
} from "./create-payment-intent.schema";

export type { CreatePaymentIntentReturnData, CreatePaymentIntentData };

export interface CreatePaymentIntentServiceOptions {
  app: Application;
}

export interface CreatePaymentIntentParams
  extends Params<CreatePaymentIntentData> { }

let stripe: Stripe

// This is a skeleton for a custom service class. Remove or add the methods you need here
export class CreatePaymentIntentService<
  ServiceParams extends CreatePaymentIntentParams = CreatePaymentIntentParams
> implements
  ServiceInterface<
    CreatePaymentIntentReturnData,
    CreatePaymentIntentData,
    ServiceParams
  >
{
  constructor(public options: CreatePaymentIntentServiceOptions) {
    stripe = new Stripe(app.get('payments').stripe.secret_key, {
      apiVersion: "2022-11-15",
    });
    // TODO : Validate the API KEY
  }

  // This method has to be added to the 'methods' option to make it available to clients
  async update(
    orderId: NullableId,
    data: CreatePaymentIntentData,
    _params?: ServiceParams
  ): Promise<{ clientSecret: Stripe.PaymentIntent["client_secret"] }> {

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 400,
      currency: "eur",
      automatic_payment_methods: {
        enabled: false,
      },
    });

    return {
      clientSecret: paymentIntent.client_secret,
    };
  }
}

export const getOptions = (app: Application) => {
  return { app };
};
