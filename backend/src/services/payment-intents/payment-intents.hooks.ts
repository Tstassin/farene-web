import { PaymentIntentsParams, PaymentIntentsService } from "./payment-intents.class"
import type { Application } from "../../declarations";
import type { HookContext } from "@feathersjs/feathers";
import { BadRequest } from "@feathersjs/errors/lib";
import { isOrderIsOutdated } from "../orders/orders.utils";

export const checkOrderIsOutdated = async (
  context: HookContext<Application, PaymentIntentsService<PaymentIntentsParams>>
) => {
  if (!context.data?.orderId) throw new BadRequest('No orderId provided to check if order is outdated')
  const { orderId } = context.data
  const isOutdated = await isOrderIsOutdated(orderId)
  if (isOutdated) {
    throw new BadRequest('order is outdated please make a new order')
  }
  return context
}