// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html

import { hooks as schemaHooks } from "@feathersjs/schema";

import {
  orderDataValidator,
  orderQueryValidator,
  orderResolver,
  orderExternalResolver,
  orderDataResolver,
  orderQueryResolver,
  orderPayWithCodeResolver,
  orderPayWithCodeValidator,
  orderPatchValidator,
} from "./orders.schema";

import type { Application } from "../../declarations";
import { OrderService, getOptions } from "./orders.class";
import { orderPath, orderMethods } from "./orders.shared";
import { authenticate } from "@feathersjs/authentication/";
import {
  resourceSchemaCreateResolver, resourceSchemaPatchResolver,
} from "../common/resources";
import { checkDeliveryDate, checkOrderIsOutdated, createOrderItems } from "./orders.hooks";
import { disallow } from "feathers-hooks-common";

export * from "./orders.class";
export * from "./orders.schema";

const { resolveExternal, resolveQuery, resolveData, resolveResult, validateData, validateQuery } = schemaHooks

// A configure function that registers the service and its hooks via `app.configure`
export const order = (app: Application) => {
  // Register our service on the Feathers application
  app.use(orderPath, new OrderService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: orderMethods,
    // You can add additional custom events to be sent to clients here
    events: [],
  });
  // Initialize hooks
  app.service(orderPath).hooks({
    around: {
      find: [
        authenticate("jwt"),
        resolveExternal(orderExternalResolver),
        resolveResult(orderResolver),
      ],
      get: [
        authenticate("jwt"),
        resolveExternal(orderExternalResolver),
        resolveResult(orderResolver),
      ],
      create: [
        authenticate("jwt"),
        resolveExternal(orderExternalResolver),
        resolveResult(orderResolver),
        checkDeliveryDate,
        validateData(orderDataValidator),
        createOrderItems,
        resolveData(
          orderDataResolver,
          resourceSchemaCreateResolver
        ),
      ],
      update: [
        authenticate("jwt"),
        resolveExternal(orderExternalResolver),
        resolveResult(orderResolver),
      ],
      patch: [
        authenticate("jwt"),
        resolveExternal(orderExternalResolver),
        resolveResult(orderResolver),
      ],
      remove: [
        authenticate("jwt"),
        resolveExternal(orderExternalResolver),
        resolveResult(orderResolver),
      ],
      getNextDeliveryDates: [authenticate("jwt")],
      payWithCode: [
        authenticate('jwt'),
        resolveExternal(orderExternalResolver),
        resolveResult(orderResolver),
      ],
      exportOrders: [
        authenticate('jwt'),
      ]
    },
    before: {
      find: [
        validateQuery(orderQueryValidator),
        resolveQuery(orderQueryResolver),
      ],
      get: [
        validateQuery(orderQueryValidator),
        resolveQuery(orderQueryResolver),
      ],
      create: [],
      patch: [
        validateData(orderPatchValidator),
        checkOrderIsOutdated,
        resolveData(resourceSchemaPatchResolver)
      ],
      update: [disallow()],
      remove: [disallow()],
      payWithCode: [
        validateData(orderPayWithCodeValidator),
        checkOrderIsOutdated,
      ]
    },
    after: {},
    error: {},
  });
};

// Add this service to the service type index
declare module "../../declarations" {
  interface ServiceTypes {
    [orderPath]: OrderService;
  }
}
