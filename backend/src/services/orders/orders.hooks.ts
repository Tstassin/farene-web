import { BadRequest, FeathersError } from "@feathersjs/errors/lib"
import { HookContext } from "@feathersjs/feathers"
import dayjs from "dayjs"
import { allowedWeekDays } from "../../config/orders"
import { Application, NextFunction } from "../../declarations"
import { OrderParams, OrderService } from "./orders.class"
import weekday from 'dayjs/plugin/weekday'
import isoWeek from 'dayjs/plugin/isoWeek'

export const createOrderItems = async (context: HookContext<Application, OrderService<OrderParams>>, next: NextFunction) => {
  if (!context.data || !('products' in context.data)) {
    throw new BadRequest('No products in order')
  }
  const { products } = context.data
  await next()
  if (context.result === undefined || Array.isArray(context.result) || 'total' in context.result) {
    throw new BadRequest("Hmmm shouldn't happen")
  }
  const { id: orderId } = context.result
  const orderItems = await context.app.service('order-items').create(products.map(product => ({ ...product, orderId })))
}

export const checkDeliveryDate = async (context: HookContext<Application, OrderService<OrderParams>>) => {
  if (Array.isArray(context.data)) {
    throw new BadRequest('Please create one order at a time')
  }

  const deliveryDate = context.data?.delivery
  if (!dayjs(deliveryDate, 'YYYY-MM-DD', true).isValid()) {
    throw new BadRequest('Invalid delivery date or format :' + deliveryDate)
  }

  const { nextDeliveryDates } = await context.app.service('orders').getNextDeliveryDates()
  if (!nextDeliveryDates.some(date => date === deliveryDate)) {
    throw new BadRequest('No delivery on ' + deliveryDate)
  }
  return context
}