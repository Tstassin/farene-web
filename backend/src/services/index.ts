import { notification } from './notifications/notifications'
import { createPaymentIntent } from './create-payment-intent/create-payment-intent'
import { orderItem } from './order-items/order-items'
import { tag } from './tags/tags'
import { category } from './categories/categories'
import { user } from './users/users'
import { product } from './products/products'
import { order } from './orders/orders'
// For more information about this file see https://dove.feathersjs.com/guides/cli/application.html#configure-functions
import type { Application } from '../declarations'

export const services = (app: Application) => {
  app.configure(notification)
  app.configure(createPaymentIntent)
  app.configure(orderItem)
  app.configure(tag)
  app.configure(category)
  app.configure(user)
  app.configure(product)
  app.configure(order)
  // All services will be registered here
}
