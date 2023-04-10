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
      update: [
        authenticate("jwt"),
        schemaHooks.resolveExternal(paymentIntentsExternalResolver),
        schemaHooks.resolveResult(paymentIntentsReturnDataResolver),
      ],
    },
    before: {
      update: [
        schemaHooks.validateData(paymentIntentsDataValidator),
        schemaHooks.resolveData(paymentIntentsDataResolver),
      ],
    },
    after: {
      update: [
        async (context) => {
          if (context.data?.orderId) {
            console.log(context.data)
            await app.service('orders').patch(context.data.orderId, {paymentIntent: context.result})
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
