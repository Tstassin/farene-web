// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services
import type { Params } from "@feathersjs/feathers";
import { KnexService } from "@feathersjs/knex";
import type { KnexAdapterParams, KnexAdapterOptions } from "@feathersjs/knex";

import type { Application } from "../../declarations";
import type { Order, OrderData, OrderPatch, OrderPayWithCode, OrderQuery } from "./orders.schema";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import isoWeek from "dayjs/plugin/isoWeek";
import fr from "dayjs/locale/fr";
import { app } from "../../app";
import { PaymentError } from "@feathersjs/errors/lib";
//@ts-expect-error no types for json2csv
import { Parser } from '@json2csv/plainjs';
import { sendPaymentSuccess } from "../../hooks/send-payment-success";
import { Product } from "../products/products.schema";
import { Place } from "../places/places.schema";
import { User } from "../users/users.schema";
import { OrderItem } from "../order-items/order-items.schema";

dayjs.extend(utc);
dayjs.extend(isoWeek);

export type { Order, OrderData, OrderPatch, OrderQuery };

export interface OrderParams extends KnexAdapterParams<OrderQuery> { }

interface ExportRow {
  commande: Order['id']
  date: string
  livraison: Place['name']
  email: User['email']
}

interface ExportRowWithOrders extends ExportRow {
  commande: Order['id']
  date: string
  livraison: Place['name']
  email: User['email']
  [key: Product['sku']]: OrderItem['amount'] | string
}

// By default calls the standard Knex adapter service methods but can be customized with your own functionality.
export class OrderService<
  ServiceParams extends Params = OrderParams
> extends KnexService<Order, OrderData, OrderParams, OrderPatch | OrderPayWithCode> {

  async payWithCode(data: OrderPayWithCode, params: OrderParams): Promise<Order> {
    const { id, code } = data
    if (code === app.get('payments').b2b.code) {
      const order = await app.service('orders').patch(id, { paymentSuccess: 1 })
      const user = await app.service('users').get(order.userId)
      await sendPaymentSuccess(user, order)
      return order
    } else throw new PaymentError('Code invalide')
  }


  async exportOrders({ $gte, $lte }: { $gte: string, $lte: string }) {
    let allOrders = await app.service('orders').find({ query: { paymentSuccess: 1, delivery: { $gte, $lte } }, paginate: false })
    const allProductsInDatabase = await app.service('products').find({ paginate: false, query: { $sort: { sortOrder: 1 } } })
  
    const allSoldProducts = allProductsInDatabase
    for (const order of allOrders) {
      for (const orderItem of order.orderItems) {
        const orderedProduct = orderItem.product
        if (!allProductsInDatabase.find(p => p.id === orderedProduct.id && p.sku === orderedProduct.sku)) {
          console.log(orderItem)
          allSoldProducts.push(orderItem.product)
        }
      }
    }

    const allSkus = Object.freeze(
      allSoldProducts.map(p => p.sku)
    )
    
    const orderLine = Object.freeze(
      allSkus.reduce(
        (all, sku) => {
          all[sku] = 0
          return all
        },
        {} as { [key: Product['sku']]: OrderItem['amount'] }
      )
    )

    let totalAmount = 0 
    // Base info from order
    let forCsv: ExportRowWithOrders[] = await Promise.all(allOrders.map(async order => {
      const row: ExportRowWithOrders = {
        commande: order.id,
        date: dayjs(order.delivery, 'YYYY-MM-DD').tz('Europe/Paris').locale(fr).format('dddd DD MMMM'),
        livraison: order.deliveryPlace,
        email: (await app.service('users').get(order.userId)).email,
        ...orderLine
      }
      order.orderItems.forEach(oI => {
        row[oI.product.sku] = oI.amount
        totalAmount += oI.amount
      })
      return row
    }))

    const rowFields: (keyof ExportRow)[] = ['commande', 'date', 'email', 'livraison']
    const fields: (keyof ExportRowWithOrders)[] = [...rowFields, ...allSkus]
    try {
      const parser = new Parser({ fields });
      const csv = parser.parse(forCsv);
      //console.log(csv);
      return ({ csv, forCsv, total: totalAmount })
    } catch (err) {
      console.error(err);
    }
  }

  async getOrdersSummary(query: OrderQuery, params: OrderParams): Promise<OrdersSummary> {
    const orders = await app.service('orders').find({ query })
    const price = orders.data.reduce((total: number, { price }) => total + price, 0)
    let amount = 0
    const orderItems = orders.data.reduce(
      (all: OrdersSummary['orderItems'], { orderItems: oI }) => {
        oI.forEach(oI => {
          const existsIndex = all.findIndex(entry => entry.product.id === oI.product.id)
          amount += oI.amount
          if (existsIndex > -1) {
            all[existsIndex].amount += oI.amount
            all[existsIndex].price += oI.amount * oI.product.price
          }
          else {
            all.push({
              product: oI.product,
              amount: oI.amount,
              price: oI.amount * oI.product.price
            })
          }
        })
        return all
      }, [])
    return ({
      price,
      amount,
      orderItems
    })
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

export type OrdersSummary = {
  price: number,
  amount: number,
  orderItems: Array<{ product: Product, amount: number, price: number }>
}