import { BadRequest } from "@feathersjs/errors/lib"
import { HookContext } from "@feathersjs/feathers"
import dayjs from "dayjs"
import { allowedWeekDays, maxAllowedOrderWeekDay, minAllowedOrderWeekDay } from "../../config/orders"
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
    throw new Error("Hmmm shouldn't happen")
  }
  const { id: orderId } = context.result
  const orderItems = await context.app.service('order-items').create(products.map(product => ({ ...product, orderId })))
}

export const checkDeliveryDate = async (context: HookContext<Application, OrderService<OrderParams>>) => {
  if (Array.isArray(context.data)) throw new Error('Please create one order at a time')
  const deliveryDate = dayjs(context.data?.delivery)
  // Impossible to choose a delivery date in the past
  if (deliveryDate.isBefore(dayjs())) throw new Error('No delivery in the past')
  // Delivery date only on allowed weekdays
  if (!allowedWeekDays.some(allowedWeekDay => allowedWeekDay === deliveryDate.isoWeekday())) {
    throw new Error('No delivery on ' + dayjs().weekday(deliveryDate.isoWeekday()))
  }
  return context
}

export const checkOrderDate = async (context: HookContext<Application, OrderService<OrderParams>>) => {
  if (Array.isArray(context.data)) throw new Error('Please create one order at a time')
  const orderDateTime = dayjs()
  const orderDateTimeIsoWeekDay = orderDateTime.isoWeekday()
  if (orderDateTimeIsoWeekDay < minAllowedOrderWeekDay) {
    throw new Error('Not allowed to order before ' + dayjs().weekday(minAllowedOrderWeekDay))
  }
  if (orderDateTimeIsoWeekDay > maxAllowedOrderWeekDay) {
    throw new Error('Not allowed to order after ' + dayjs().weekday(maxAllowedOrderWeekDay))
  }
  return context
}