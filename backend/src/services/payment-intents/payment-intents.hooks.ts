import { PaymentIntentsParams, PaymentIntentsService } from "./payment-intents.class"
import type { Application } from "../../declarations";
import type { HookContext } from "@feathersjs/feathers";
import { BadRequest } from "@feathersjs/errors/lib";
import { isOrderIsOutdated } from "../orders/orders.utils";

export const checkOrderIsOutdated = async (
  context: HookContext<Application, PaymentIntentsService<PaymentIntentsParams>>
) => {
  let orderId: number
  if (context.method === 'create' && context.data?.orderId) {
    orderId = context.data.orderId
  } else if (context.method === 'get' && context.type === 'after') {
    orderId = parseInt(context.result?.metadata?.orderId as string) // Fix these types...
  } else {
    throw new BadRequest('No orderId provided to check if order is outdated')
  }
  const isOutdated = await isOrderIsOutdated(orderId)
  if (isOutdated) {
    throw new BadRequest('order is outdated please make a new order')
  }
  return context
}