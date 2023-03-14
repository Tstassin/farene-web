// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { Type, getValidator } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'
import Stripe from 'stripe'

import type { HookContext } from '../../declarations'
import { dataValidator } from '../../validators'


// Schema for creating new payment intents
export const createPaymentIntentDataSchema = Type.Object(
  {
    //orderId: Type.Number(),
    //userId: Type.Number()
  },
  { $id: 'CreatePaymentIntentData', additionalProperties: false }
)
export type CreatePaymentIntentData = Static<typeof createPaymentIntentDataSchema>
export const createPaymentIntentDataValidator = getValidator(createPaymentIntentDataSchema, dataValidator)
export const createPaymentIntentDataResolver = resolve<CreatePaymentIntentData, HookContext>({})

// Schema for returning payment intent data
export const createPaymentIntentReturnDataSchema = Type.Object(
  {
    clientSecret: Type.String()
  },
  { $id: 'CreatePaymentIntentReturnData', additionalProperties: false }
)

export type CreatePaymentIntentReturnData = { clientSecret: Stripe.PaymentIntent['client_secret'] }
export const createPaymentIntentReturnDataValidator = getValidator(createPaymentIntentReturnDataSchema, dataValidator)
export const createPaymentIntentReturnDataResolver = resolve<CreatePaymentIntentReturnData, HookContext>({})

export const createPaymentIntentExternalResolver = resolve<CreatePaymentIntentReturnData, HookContext>({})