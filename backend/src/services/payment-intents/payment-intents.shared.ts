// For more information about this file see https://dove.feathersjs.com/guides/cli/service.shared.html
import type { Params } from "@feathersjs/feathers";
import type { ClientApplication } from "../../client";
import type {
  PaymentIntentsData,
  PaymentIntentsService,
  PaymentIntentsReturnData,
} from "./payment-intents.class";

export type { PaymentIntentsData, PaymentIntentsReturnData };

export type paymentIntentsClientService = Pick<
  PaymentIntentsService,
  (typeof paymentIntentsMethods)[number]
>;

export const paymentIntentsPath = "payment-intent";

export const paymentIntentsMethods = ["create", "get"] as const;

export const paymentIntentsClient = (client: ClientApplication) => {
  const connection = client.get("connection");

  client.use(
    paymentIntentsPath,
    connection.service(paymentIntentsPath),
    {
      methods: paymentIntentsMethods,
    }
  );
};

// Add this service to the client service type index
declare module "../../client" {
  interface ServiceTypes {
    [paymentIntentsPath]: paymentIntentsClientService;
  }
}
