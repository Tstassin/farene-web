// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services
import type { Id, NullableId, Params } from "@feathersjs/feathers";
import { KnexService } from "@feathersjs/knex";
import type { KnexAdapterParams, KnexAdapterOptions } from "@feathersjs/knex";

import type { Application } from "../../declarations";
import type { Order, OrderData, OrderPatch, OrderPayWithCode, OrderQuery } from "./orders.schema";
import { allowedWeekDays } from "../../config/orders";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import isoWeek from "dayjs/plugin/isoWeek";
import fr from "dayjs/locale/fr";
import { app } from "../../app";
import { PaymentError } from "@feathersjs/errors/lib";
//@ts-expect-error no types for json2csv
import { Parser } from '@json2csv/plainjs';
import { sendPaymentSuccess } from "../../hooks/send-payment-success";

dayjs.extend(utc);
dayjs.extend(isoWeek);

export type { Order, OrderData, OrderPatch, OrderQuery };

export interface OrderParams extends KnexAdapterParams<OrderQuery> { }

// TODO : fix this asap, no future-proof at all
const exportsProductOrder = [5, 4, 9, 8, 2, 3, 6, 7, 10, 11, 12, 24, 25, 26, 16, 17, 13, 15, 18, 19, 20, 21, 22, 23]

// By default calls the standard Knex adapter service methods but can be customized with your own functionality.
export class OrderService<
  ServiceParams extends Params = OrderParams
> extends KnexService<Order, OrderData, OrderParams, OrderPatch | OrderPayWithCode> {

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

  async payWithCode(data: OrderPayWithCode, params: OrderParams): Promise<Order> {
    const { id, code } = data
    if (code === app.get('payments').b2b.code) {
      const order = await app.service('orders').patch(id, { paymentSuccess: 1 })
      const user = await app.service('users').get(order.userId)
      await sendPaymentSuccess(user, order)
      return order
    } else throw new PaymentError('Code invalide')
  }

  async exportOrders() {
    let allOrders = await app.service('orders').find({ query: { paymentSuccess: 1 }, paginate: false })
    const allProducts = await app.service('products').find({ paginate: false })

    // Base info from order
    let forCsv = await Promise.all(allOrders.map(async order => (
      {
        commande: order.id,
        date: dayjs(order.delivery, 'YYYY-MM-DD').tz('Europe/Paris').locale(fr).format('dddd DD MMMM'),
        email: (await app.service('users').get(order.userId)).email,
        orderItems: order.orderItems
      }
    )))

    // A A-Z sorted array of all products SKU's as keys of objects with amount 0
    // [{sku1 :0}, {sku2: 0}, ...]
    // If product id's referenced doesn't exist anymore they are thrown
    const productsSkus = exportsProductOrder
      .map(pId => allProducts.find(p => p.id === pId)?.sku)
      .reduce((acc: string[], curr) => curr ? [...acc, curr] : acc, [])
      .map(sku => ({ [sku]: 0 }))

    /* const productsSkus = await (
      await app.service('products')
        .find({ paginate: false })
    )
      .sort(p)
      .map(p => (p.sku || p.name))
      .map(sku => ({ [sku]: 0 })) */

    // Each order contains all skus in correct order with amount: 0
    forCsv.forEach(order => { Object.assign(order, ...productsSkus) })

    // fill order with items ordered using sku's previously filled
    forCsv.forEach(order => {
      order.orderItems.forEach(orderItem => {
        const product = allProducts.find(p => p.id === orderItem.product.id)
        const sku = product?.sku || orderItem.product.sku || product?.name || orderItem.product.name
        //@ts-expect-error sku generated cannot be infered as legal key for order object 
        order[sku] =
          orderItem.amount
      })
      //@ts-expect-error
      delete order.orderItems
    })

    try {
      const parser = new Parser();
      const csv = parser.parse(forCsv);
      //console.log(csv);
      return ({ csv, forCsv })
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

