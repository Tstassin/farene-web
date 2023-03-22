// For more information about this file see https://dove.feathersjs.com/guides/cli/service.shared.html
import type { Params } from "@feathersjs/feathers";
import type { ClientApplication } from "../../client";
import type {
  OrderItem,
  OrderItemData,
  OrderItemPatch,
  OrderItemQuery,
  OrderItemService,
} from "./order-items.class";

export type { OrderItem, OrderItemData, OrderItemPatch, OrderItemQuery };

export type OrderItemClientService = Pick<
  OrderItemService<Params<OrderItemQuery>>,
  (typeof orderItemMethods)[number]
>;

export const orderItemPath = "order-items";

export const orderItemMethods = [
  "find",
  "get",
  "create",
  "patch",
  "remove",
] as const;

export const orderItemClient = (client: ClientApplication) => {
  const connection = client.get("connection");

  client.use(orderItemPath, connection.service(orderItemPath), {
    methods: orderItemMethods,
  });
};

// Add this service to the client service type index
declare module "../../client" {
  interface ServiceTypes {
    [orderItemPath]: OrderItemClientService;
  }
}
