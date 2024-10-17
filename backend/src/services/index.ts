import { asset } from './assets/assets'
import { deliveryOption } from './delivery-options/delivery-options'
import { place } from './places/places'
import { stripeWebhooks } from './stripe-webhooks/stripe-webhooks'
import { notification } from './notifications/notifications'
import { paymentIntents } from './payment-intents/payment-intents'
import { orderItem } from './order-items/order-items'
import { tag } from './tags/tags'
import { category } from './categories/categories'
import { user } from './users/users'
import { product } from './products/products'
import { order } from './orders/orders'
// For more information about this file see https://dove.feathersjs.com/guides/cli/application.html#configure-functions
import type { Application } from '../declarations'

export const services = (app: Application) => {
  app.configure(asset)
  app.configure(deliveryOption)
  app.configure(place)
  app.configure(stripeWebhooks)
  app.configure(notification)
  app.configure(paymentIntents)
  app.configure(orderItem)
  app.configure(tag)
  app.configure(category)
  app.configure(user)
  app.configure(product)
  app.configure(order)
  // All services will be registered here
}
