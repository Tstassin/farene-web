import { BadRequest } from "@feathersjs/errors/lib";
import { HookContext } from "@feathersjs/feathers";
import dayjs from "dayjs";
import { Application, NextFunction } from "../../declarations";
import { Order, OrderData, OrderParams, OrderService } from "./orders.class";
import { transaction } from "@feathersjs/knex/lib";
import { isOrderIsOutdated } from "./orders.utils";

export const createOrderItems = async (
  context: HookContext<Application, OrderService<OrderParams>>,
  next: NextFunction
) => {
  const data = context.data as OrderData
  if (data.orderItems.length === 0) {
    throw new BadRequest("No orderItems in order");
  }
  const { orderItems } = data;
  try {
    transaction.start()
    await next();
    const result = context.result as Order
    const { id: orderId } = result;
    await context.app
      .service("order-items")
      .create(orderItems.map((orderItem) => ({ ...orderItem, orderId })));
    transaction.end()
  }
  catch (err) {
    transaction.rollback()
    throw err
  }
};

export const noPaymentOnOutdatedOrder = async (
  context: HookContext<Application, OrderService<OrderParams>>
) => {
  const { paymentSuccess, paymentIntent } = context.data || {}
  // We don't allow payments for outdated orders
  if (!paymentIntent && !paymentSuccess) return context
  const noOrderIdError = 'No order id in context to check if order is outdated'
  let orderId: number
  if (context.id) {
    orderId = typeof context.id === "string" ? parseInt(context.id) : context.id
  } else if (context.data && 'id' in context.data) {
    orderId = context.data.id
  } else {
    throw new BadRequest(noOrderIdError)
  }
  const isOutdated = await isOrderIsOutdated(orderId)
  if (isOutdated) {
    throw new BadRequest('order is outdated please make a new order')
  }
  return context
}