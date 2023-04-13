// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services
import type { Params } from "@feathersjs/feathers";
import { KnexService } from "@feathersjs/knex";
import type { KnexAdapterParams, KnexAdapterOptions } from "@feathersjs/knex";

import type { Application } from "../../declarations";
import type { Order, OrderData, OrderPatch, OrderPayWithCode, OrderQuery } from "./orders.schema";
import { allowedWeekDays } from "../../config/orders";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import isoWeek from "dayjs/plugin/isoWeek";
import { app } from "../../app";
import { PaymentError } from "@feathersjs/errors/lib";
//@ts-expect-error no types for json2csv
import { Parser } from '@json2csv/plainjs';

dayjs.extend(utc);
dayjs.extend(isoWeek);

export type { Order, OrderData, OrderPatch, OrderQuery };

export interface OrderParams extends KnexAdapterParams<OrderQuery> { }

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

  async payWithCode(data: OrderPayWithCode): Promise<Order> {
    const { id, code } = data
    if (code === app.get('payments').b2b.code) {
      const order = await app.service('orders').patch(id, { paymentSuccess: 1 })
      return order
    } else throw new PaymentError('Code invalide')
  }

  async exportOrders() {
    let allOrders = await app.service('orders').find({ query: { paymentSuccess: 1 }, paginate: false })

    // Base info from order
    let forCsv = await Promise.all(allOrders.map(async order => (
      {
        commande: order.id,
        date: order.delivery,
        email: (await app.service('users').get(order.userId)).email,
        orderItems: order.orderItems
      }
    )))

    // A A-Z sorted array of all products SKU's as keys of objects with amount 0
    // [{sku1 :0}, {sku2: 0}, ...]
    const productsSkus = await (await app.service('products').find({ paginate: false }))
      .map(p => (p.sku || p.name)).sort().map(sku => ({ [sku]: 0 }))

    // order contains all skus with amount: 0
    forCsv.forEach(order => { Object.assign(order, ...productsSkus) })

    // fill order with items ordered using sku's previously filled
    forCsv.forEach(order => {
      order.orderItems.forEach(orderItem => {
        //@ts-expect-error
        order[orderItem.product.sku] = orderItem.amount
      })
      //@ts-expect-error
      delete order.orderItems
    })

    try {
      const parser = new Parser();
      const csv = parser.parse(forCsv);
      //console.log(csv);
      return ({ csv })
    } catch (err) {
      console.error(err);
    }
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

