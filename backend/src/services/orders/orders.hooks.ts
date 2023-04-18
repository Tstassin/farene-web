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

export const checkDeliveryDate = async (
  context: HookContext<Application, OrderService<OrderParams>>,
  next: NextFunction
) => {
  if (Array.isArray(context.data)) {
    throw new BadRequest("Please create one order at a time");
  }
  if (!context.data) throw new BadRequest('No data provided to checkDeliveryDate method')
  if (!('delivery' in context.data)) throw new BadRequest('No delivery date provided to checkDelviveryDate method')

  const deliveryDate = context.data.delivery;
  if (!dayjs(deliveryDate, "YYYY-MM-DD", true).isValid()) {
    throw new BadRequest("Invalid delivery date or format :" + deliveryDate);
  }

  const { nextDeliveryDates } = await context.app
    .service("orders")
    .getNextDeliveryDates();
  if (!nextDeliveryDates.some((date) => date === deliveryDate)) {
    throw new BadRequest("No delivery on " + deliveryDate);
  }
  await next()
};


export const checkOrderIsOutdated = async (
  context: HookContext<Application, OrderService<OrderParams>>
) => {
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