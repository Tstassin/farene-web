import dayjs from "dayjs";
import { app } from "../../app";
import { Order } from "./orders.schema";

export const calculateOrderPrice = async (_order: Order | Order['id']) => {
  const order = (typeof _order === "number") ? await app.service('orders').get(_order) : _order 
  const price = order.orderItems.reduce((total, orderItem) => total + orderItem.amount * Math.round(orderItem.product.price * 100), 0)
  return price / 100
}
/**
 * true => order is outdated
 * false => order is not outdated
 */
export const isOrderIsOutdated = async (orderId: Order['id']) => {
  const order = await app.service('orders').get(orderId)
  const nextWeek = (await app.service('orders').getNextDeliveryDates()).nextWeek
  if (dayjs(order.delivery, 'YYYY-MM-DD', true).isBefore(nextWeek)) {
    return true
  }
  return false
}