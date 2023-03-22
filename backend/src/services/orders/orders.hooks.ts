import { BadRequest, FeathersError } from "@feathersjs/errors/lib";
import { HookContext } from "@feathersjs/feathers";
import dayjs from "dayjs";
import { Application, NextFunction } from "../../declarations";
import { Order, OrderData, OrderParams, OrderService } from "./orders.class";
import { transaction } from "@feathersjs/knex/lib";

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

  const deliveryDate = context.data?.delivery;
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
