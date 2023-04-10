// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from "@feathersjs/schema";
import { Type, getValidator } from "@feathersjs/typebox";
import type { Static } from "@feathersjs/typebox";
import Stripe from "stripe";

import type { HookContext } from "../../declarations";
import { dataValidator } from "../../validators";

// Schema for creating new payment intents
export const paymentIntentsDataSchema = Type.Object(
  {
    orderId: Type.Number()
  },
  { $id: "PaymentIntentsData", additionalProperties: false }
);
export type PaymentIntentsData = Static<
  typeof paymentIntentsDataSchema
>;
export const paymentIntentsDataValidator = getValidator(
  paymentIntentsDataSchema,
  dataValidator
);
export const paymentIntentsDataResolver = resolve<
  PaymentIntentsData,
  HookContext
>({});

// Schema for returning payment intent data
export const paymentIntentsReturnDataSchema = Type.Object(
  {
    clientSecret: Type.String(),
  },
  { $id: "PaymentIntentsReturnData", additionalProperties: false }
);

export type PaymentIntentsReturnData =  Stripe.PaymentIntent
export const paymentIntentsReturnDataValidator = getValidator(
  paymentIntentsReturnDataSchema,
  dataValidator
);
export const paymentIntentsReturnDataResolver = resolve<
  PaymentIntentsReturnData,
  HookContext
>({});

export const paymentIntentsExternalResolver = resolve<
  PaymentIntentsReturnData,
  HookContext
>({});
