import Stripe from "stripe"
import { PaymentIntentsParams, PaymentIntentsService } from "../../../src/services/payment-intents/payment-intents.class"
import * as sinon from 'sinon'

let lastPaymentIntent: Stripe.Response<Stripe.PaymentIntent>

export const mockStripePaymentIntentsCreate = () => {
  const _createPaymentIntent = sinon
    .stub(PaymentIntentsService.prototype, '_createPaymentIntent')
    .callsFake(
      async (data: Stripe.PaymentIntentCreateParams) => {
        const { amount, metadata } = data
        const paymentIntent = mockedCreatedPaymentIntent(amount, { orderId: metadata!.orderId!.toString() })
        lastPaymentIntent = paymentIntent
        return new Promise(resolve => resolve(paymentIntent))
      }
    )
  return _createPaymentIntent
}

export const mockStripePaymentIntentsGet= () => {
  const _getPaymentIntent = sinon
    .stub(PaymentIntentsService.prototype, '_get')
    .callsFake(
      async () => {
        return new Promise(resolve => resolve(lastPaymentIntent))
      }
    )
  return _getPaymentIntent
}


export const mockedCreatedPaymentIntent = (amount: number, metadata: { orderId: string }) => ({
  id: 'pi_3MyTySFRObIGk3ha16KN4k0f',
  object: 'payment_intent' as const,
  amount,
  amount_capturable: 0,
  amount_details: { tip: {} },
  amount_received: 0,
  application: null,
  application_fee_amount: null,
  automatic_payment_methods: null,
  canceled_at: null,
  cancellation_reason: null,
  capture_method: 'automatic' as const,
  client_secret: 'pi_3MyTySFRObIGk3ha16KN4k0f_secret_Fvm7qPVfXXFB5bcCG08D9XJoH',
  confirmation_method: 'automatic' as const,
  created: 1681883676,
  currency: 'eur',
  customer: null,
  description: null,
  invoice: null,
  last_payment_error: null,
  latest_charge: null,
  lastResponse: {
    headers: {},
    requestId: 'requestId',
    statusCode: 0,
    apiVersion: '',
  },
  livemode: false,
  metadata,
  next_action: null,
  on_behalf_of: null,
  payment_method: null,
  payment_method_options: {
    bancontact: { preferred_language: 'en' as const },
    card: {
      installments: null,
      mandate_options: null,
      network: null,
      request_three_d_secure: 'automatic' as const
    }
  },
  payment_method_types: ['card', 'bancontact'],
  processing: null,
  receipt_email: 'tstassin@gmail.com',
  review: null,
  setup_future_usage: null,
  shipping: null,
  source: null,
  statement_descriptor: null,
  statement_descriptor_suffix: null,
  status: 'requires_payment_method' as const,
  transfer_data: null,
  transfer_group: null
})
