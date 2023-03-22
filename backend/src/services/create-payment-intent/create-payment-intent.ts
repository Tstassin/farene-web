// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from "@feathersjs/authentication";
import { hooks as schemaHooks } from "@feathersjs/schema";

import {
  createPaymentIntentDataValidator,
  createPaymentIntentExternalResolver,
  createPaymentIntentDataResolver,
  createPaymentIntentReturnDataResolver,
} from "./create-payment-intent.schema";

import type { Application } from "../../declarations";
import {
  CreatePaymentIntentService,
  getOptions,
} from "./create-payment-intent.class";
import {
  createPaymentIntentPath,
  createPaymentIntentMethods,
} from "./create-payment-intent.shared";

export * from "./create-payment-intent.class";
export * from "./create-payment-intent.schema";

// A configure function that registers the service and its hooks via `app.configure`
export const createPaymentIntent = (app: Application) => {
  // Register our service on the Feathers application
  app.use(
    createPaymentIntentPath,
    new CreatePaymentIntentService(getOptions(app)),
    {
      // A list of all methods this service exposes externally
      methods: createPaymentIntentMethods,
      // You can add additional custom events to be sent to clients here
      events: [],
    }
  );
  // Initialize hooks
  app.service(createPaymentIntentPath).hooks({
    around: {
      update: [
        authenticate("jwt"),
        schemaHooks.resolveExternal(createPaymentIntentExternalResolver),
        schemaHooks.resolveResult(createPaymentIntentReturnDataResolver),
      ],
    },
    before: {
      update: [
        schemaHooks.validateData(createPaymentIntentDataValidator),
        schemaHooks.resolveData(createPaymentIntentDataResolver),
      ],
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
    [createPaymentIntentPath]: CreatePaymentIntentService;
  }
}
