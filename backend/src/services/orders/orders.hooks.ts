import { BadRequest } from "@feathersjs/errors/lib"
import { HookContext } from "@feathersjs/feathers"
import dayjs from "dayjs"
import { Application, NextFunction } from "../../declarations"
import { OrderParams, OrderService } from "./orders.class"

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
  const delivery = context.data?.delivery
  if (dayjs(delivery).isBefore(dayjs())) throw new Error('No delivery in the past')
  return context
}