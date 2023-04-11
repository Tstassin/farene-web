import { app } from "../../app";
import { Order } from "./orders.schema";

export const calculateOrderPrice = async (_order: Order | Order['id']) => {
  const order = (typeof _order === "number") ? await app.service('orders').get(_order) : _order 
  const price = order.orderItems.reduce((total, orderItem) => total + orderItem.amount * orderItem.product.price * 100, 0)
  return price / 100
}