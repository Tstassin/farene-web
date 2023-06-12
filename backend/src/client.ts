// For more information about this file see https://dove.feathersjs.com/guides/cli/client.html
import { feathers } from '@feathersjs/feathers'
import type { TransportConnection, Application } from '@feathersjs/feathers'
import authenticationClient from '@feathersjs/authentication-client'
import type { AuthenticationClientOptions } from '@feathersjs/authentication-client'

import { deliveryOptionClient } from './services/delivery-options/delivery-options.shared'
export type {
  DeliveryOption,
  DeliveryOptionData,
  DeliveryOptionQuery,
  DeliveryOptionPatch
} from './services/delivery-options/delivery-options.shared'

import { placeClient } from './services/places/places.shared'
export type { Place, PlaceData, PlaceQuery, PlacePatch } from './services/places/places.shared'

import { stripeWebhooksClient } from './services/stripe-webhooks/stripe-webhooks.shared'
export type {
  StripeWebhooks,
  StripeWebhooksData,
  StripeWebhooksQuery
} from './services/stripe-webhooks/stripe-webhooks.shared'

import { notificationClient } from './services/notifications/notifications.shared'
export type { Notification, NotificationData } from './services/notifications/notifications.shared'

import { paymentIntentsClient } from './services/payment-intents/payment-intents.shared'
export type {
  PaymentIntentsData,
  PaymentIntentsReturnData
} from './services/payment-intents/payment-intents.shared'

import { AuthenticationResult } from '@feathersjs/authentication/lib'
export type { AuthenticationResult }

import { productClient } from './services/products/products.shared'
import { orderClient } from './services/orders/orders.shared'
import { categoryClient } from './services/categories/categories.shared'
import { userClient } from './services/users/users.shared'

export interface Configuration {
  connection: TransportConnection<ServiceTypes>
}

export interface ServiceTypes {}

export type ClientApplication = Application<ServiceTypes, Configuration>

/**
 * Returns a typed client for the backend app.
 *
 * @param connection The REST or Socket.io Feathers client connection
 * @param authenticationOptions Additional settings for the authentication client
 * @see https://dove.feathersjs.com/api/client.html
 * @returns The Feathers client application
 */
export const createClient = <Configuration = any>(
  connection: TransportConnection<ServiceTypes>,
  authenticationOptions: Partial<AuthenticationClientOptions> = {}
) => {
  const client: ClientApplication = feathers()

  client.configure(connection)
  client.set('connection', connection)
  client.configure(authenticationClient(authenticationOptions))
  client.configure(orderClient)
  client.configure(categoryClient)
  client.configure(productClient)
  client.configure(paymentIntentsClient)
  client.configure(notificationClient)
  client.configure(userClient)
  client.configure(stripeWebhooksClient)
  client.configure(placeClient)
  client.configure(deliveryOptionClient)
  return client
}
