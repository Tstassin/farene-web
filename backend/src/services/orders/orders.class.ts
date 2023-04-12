// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services
import type { Params } from "@feathersjs/feathers";
import { KnexService } from "@feathersjs/knex";
import type { KnexAdapterParams, KnexAdapterOptions } from "@feathersjs/knex";

import type { Application } from "../../declarations";
import type { Order, OrderData, OrderPatch,  OrderPayWithCode,  OrderQuery } from "./orders.schema";
import { allowedWeekDays } from "../../config/orders";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import isoWeek from "dayjs/plugin/isoWeek";
import { app } from "../../app";
import { PaymentError } from "@feathersjs/errors/lib";

dayjs.extend(utc);
dayjs.extend(isoWeek);

export type { Order, OrderData, OrderPatch, OrderQuery };

export interface OrderParams extends KnexAdapterParams<OrderQuery> {}

// By default calls the standard Knex adapter service methods but can be customized with your own functionality.
export class OrderService<
  ServiceParams extends Params = OrderParams
> extends KnexService<Order, OrderData, OrderParams, OrderPatch> {
  async getNextDeliveryDates() {
    const now = dayjs().utc();
    const nextOrderWeek = now.endOf("isoWeek").add(1, "day");
    const nextAllowedDeliveryDates = allowedWeekDays.map((allowedWeekDay) =>
      nextOrderWeek.isoWeekday(allowedWeekDay)
    );
    return {
      nextWeek: nextOrderWeek.format("YYYY-MM-DD"),
      nextDeliveryDates: nextAllowedDeliveryDates.map((d) =>
        d.format("YYYY-MM-DD")
      ),
    };
  }
  async payWithCode(data: OrderPayWithCode):Promise<Order> {
    const {id, code} = data
    if (code === app.get('payments').b2b.code) {
      const order = await app.service('orders').patch(id, {paymentSuccess: 1})
      return order
    } else throw new PaymentError('Code invalide')
  }
}

export const getOptions = (app: Application): KnexAdapterOptions => {
  return {
    paginate: app.get("paginate"),
    Model: app.get("sqliteClient"),
    name: "orders",
    multi: ["remove"],
  };
};
