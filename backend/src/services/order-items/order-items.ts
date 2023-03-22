// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from "@feathersjs/authentication";

import { hooks as schemaHooks } from "@feathersjs/schema";

import {
  orderItemDataValidator,
  orderItemPatchValidator,
  orderItemQueryValidator,
  orderItemResolver,
  orderItemExternalResolver,
  orderItemDataResolver,
  orderItemPatchResolver,
  orderItemQueryResolver,
} from "./order-items.schema";

import type { Application } from "../../declarations";
import { OrderItemService, getOptions } from "./order-items.class";
import { orderItemPath, orderItemMethods } from "./order-items.shared";
import {
  resourceSchemaCreateResolver,
  resourceSchemaUpdateResolver,
} from "../common/resources";

export * from "./order-items.class";
export * from "./order-items.schema";

// A configure function that registers the service and its hooks via `app.configure`
export const orderItem = (app: Application) => {
  // Register our service on the Feathers application
  app.use(orderItemPath, new OrderItemService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: orderItemMethods,
    // You can add additional custom events to be sent to clients here
    events: [],
  });
  // Initialize hooks
  app.service(orderItemPath).hooks({
    around: {
      all: [
        authenticate("jwt"),
        schemaHooks.resolveExternal(orderItemExternalResolver),
        schemaHooks.resolveResult(orderItemResolver),
      ],
    },
    before: {
      all: [
        schemaHooks.validateQuery(orderItemQueryValidator),
        schemaHooks.resolveQuery(orderItemQueryResolver),
      ],
      find: [],
      get: [],
      create: [
        schemaHooks.validateData(orderItemDataValidator),
        schemaHooks.resolveData(
          orderItemDataResolver,
          resourceSchemaCreateResolver
        ),
      ],
      patch: [
        schemaHooks.validateData(orderItemPatchValidator),
        schemaHooks.resolveData(
          orderItemPatchResolver,
          resourceSchemaUpdateResolver
        ),
      ],
      remove: [],
    },
    after: {
      all: [],
    },
    error: {
      all: [],
    },
  });
};

// Add this service to the service type index
declare module "../../declarations" {
  interface ServiceTypes {
    [orderItemPath]: OrderItemService;
  }
}
