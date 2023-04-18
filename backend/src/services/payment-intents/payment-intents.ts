// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from "@feathersjs/authentication";
import { hooks as schemaHooks } from "@feathersjs/schema";

import {
  paymentIntentsDataValidator,
  paymentIntentsExternalResolver,
  paymentIntentsDataResolver,
  paymentIntentsReturnDataResolver,
} from "./payment-intents.schema";

import type { Application } from "../../declarations";
import {
  PaymentIntentsService,
  getOptions,
} from "./payment-intents.class";
import {
  paymentIntentsPath,
  paymentIntentsMethods,
} from "./payment-intents.shared";
import { BadRequest } from "@feathersjs/errors/lib";
import dayjs from "dayjs";

export * from "./payment-intents.class";
export * from "./payment-intents.schema";

// A configure function that registers the service and its hooks via `app.configure`
export const paymentIntents = (app: Application) => {
  // Register our service on the Feathers application
  app.use(
    paymentIntentsPath,
    new PaymentIntentsService(getOptions(app)),
    {
      // A list of all methods this service exposes externally
      methods: paymentIntentsMethods,
      // You can add additional custom events to be sent to clients here
      events: [],
    }
  );
  // Initialize hooks
  app.service(paymentIntentsPath).hooks({
    around: {
      create: [
        authenticate("jwt"),
        schemaHooks.resolveExternal(paymentIntentsExternalResolver),
        schemaHooks.resolveResult(paymentIntentsReturnDataResolver),
      ],
      get: [
        authenticate("jwt"),
        schemaHooks.resolveExternal(paymentIntentsExternalResolver),
        schemaHooks.resolveResult(paymentIntentsReturnDataResolver),
      ],
    },
    before: {
      create: [
        schemaHooks.validateData(paymentIntentsDataValidator),
        async (context) => {
          if (!context.data) throw new BadRequest('no data provided for paymentIntent creation')
          if (!('orderId' in context.data)) throw new BadRequest('no orderId provided for paymentIntent creation')
          const order = await context.app.service('orders').get(context.data.orderId)
          const nextWeek = await (await app.service('orders').getNextDeliveryDates()).nextWeek
          if (dayjs(order.delivery, 'YYYY-MM-DD', true).isBefore(nextWeek)) {
            throw new BadRequest('order is outdated please make a new order')
          }
          return context
        },
        schemaHooks.resolveData(paymentIntentsDataResolver),
      ],
    },
    after: {
      create: [
        async (context) => {
          if (context.data?.orderId) {
            await app.service('orders').patch(context.data.orderId, { paymentIntent: context.result.id })
          }
          return context
        }
      ],
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
    [paymentIntentsPath]: PaymentIntentsService;
  }
}
