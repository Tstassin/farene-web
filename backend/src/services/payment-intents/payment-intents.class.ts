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
import { Order } from "../orders/orders.schema";
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
  async update(
    orderId: Order['id'],
    data: PaymentIntentsData,
    _params?: ServiceParams
  ): Promise<{ clientSecret: Stripe.PaymentIntent["client_secret"] }> {

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: await calculateOrderPrice(orderId),
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
