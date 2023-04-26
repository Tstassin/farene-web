// For more information about this file see https://dove.feathersjs.com/guides/cli/service.shared.html
import type { Params } from "@feathersjs/feathers";
import type { ClientApplication } from "../../client";
import type {
  Order,
  OrderData,
  OrderPatch,
  OrderQuery,
  OrderService,
} from "./orders.class";

export type { Order, OrderData, OrderPatch, OrderQuery };

export type OrderClientService = Pick<
  OrderService<Params<OrderQuery>>,
  (typeof orderMethods)[number]
>;

export const orderPath = "orders";

export const orderMethods = [
  "find",
  "get",
  "create",
  "patch",
  "getNextDeliveryDates",
  "payWithCode",
  "exportOrders"
] as const;

export const orderClient = (client: ClientApplication) => {
  const connection = client.get("connection");

  client.use(orderPath, connection.service(orderPath), {
    methods: orderMethods,
  });
};

// Add this service to the client service type index
declare module "../../client" {
  interface ServiceTypes {
    [orderPath]: OrderClientService;
  }
}
